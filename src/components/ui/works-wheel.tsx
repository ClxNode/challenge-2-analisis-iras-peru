"use client";

// WorksWheel adaptado al proyecto IRAs · UPCH.
//
// Concepto original (conservado): una rueda de tarjetas con perspectiva 3D. En reposo
// las tarjetas forman un anillo alrededor de un título; la primera muesca de scroll
// lo abre en un tambor vertical donde la tarjeta frontal queda plana y las vecinas
// giran hacia atrás en perspectiva. Todo depende de un único número, `turn`, que un
// bucle rAF traduce a transformaciones escritas directamente en el DOM.
//
// Cambios respecto del componente original (correcciones de integración):
//  - El puntero se captura en el escenario, por lo que el `click` de las tarjetas
//    nunca llegaba a ellas. La selección se resuelve ahora en `pointerup`
//    (si el gesto fue un toque y no un arrastre) con `elementFromPoint`.
//  - Nueva prop `onOpen`: se invoca al tocar la tarjeta frontal, al pulsar Enter /
//    Espacio, o al elegir un título del índice estando ya en el frente.
//  - `ref` con `goTo(i)` para que la vista de detalle pueda mover la rueda.
//  - Tamaño de tarjeta e índice adaptados a pantallas estrechas (móvil).
//  - `settling` se declara antes de usarse y se limpia al desmontar.
//  - Soporta Inicio/Fin/PageUp/PageDown además de las flechas.
//  - Solo la cara de cada tarjeta (ya escalada) recibe toques; el contenedor de
//    tamaño completo se solapaba con sus vecinos en el anillo y robaba los clics.
//  - El radio del anillo se limita al alto/ancho del escenario para que no se
//    corten tarjetas en laptops y móviles.
import * as React from "react";

import { cn } from "@/lib/utils";

export interface WorksWheelItem {
  /** Nombre de la sección. Se muestra junto a la tarjeta frontal y en el índice. */
  title: string;
  /** Imagen de portada (cualquier `src` válido para <img>). */
  image: string;
  /** Texto breve bajo el título de la tarjeta frontal. */
  subtitle?: string;
}

export interface WorksWheelHandle {
  /** Lleva la rueda a la tarjeta `index` (0-based) con la animación habitual. */
  goTo: (index: number) => void;
}

export interface WorksWheelProps
  extends Omit<React.ComponentPropsWithoutRef<"section">, "children"> {
  items: WorksWheelItem[];
  /** Título en el centro del anillo. */
  label?: string;
  /** Texto pequeño bajo el título del anillo (invitación a desplazarse). */
  hint?: string;
  /** Etiqueta de la tarjeta frontal al pasar el cursor. Omitir para quitarla. */
  action?: string;
  /** Se llama con el índice de la tarjeta que el usuario quiere abrir. */
  onOpen?: (index: number) => void;
}

/* Geometría: la tarjeta se mide contra el escenario y todo lo demás contra la tarjeta. */
const CARD_H = 0.38; // alto de la tarjeta frontal, respecto del escenario
const CARD_MAX_W = 0.34; // ... sin superar esta fracción del ancho (escritorio)
const CARD_MAX_W_NARROW = 0.74; // ... ni esta, en pantallas estrechas
const NARROW_PX = 720;
const CARD_RATIO = 1.45; // ancho / alto de la tarjeta
const STEP = 40; // grados entre tarjetas en el tambor
const DRUM = 2.22; // radio del tambor, en alturas de tarjeta
const LENS = 2.7; // distancia de perspectiva
const RING_R = 1.14; // radio del anillo
const BOW = 1.82; // curvatura lateral del tambor
const TITLE = 0.124; // tamaño del título del anillo / de la tarjeta frontal
const INDEX = 0.05; // tamaño del índice lateral
/** Tarjetas a cada lado del frente que aún vale la pena dibujar. */
const CULL = 1.6;

const WHEEL_UNITS = 900;
const DRAG_UNITS = 420;
const SETTLE = 140;
const EASE = 0.12;
/** Movimiento máximo (px) para considerar un gesto como toque y no como arrastre. */
const TAP_SLOP = 6;

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const rad = (deg: number) => (deg * Math.PI) / 180;

type Stage = { w: number; h: number };

const bowAt = (drumDeg: number, bow: number) => -bow * (1 - Math.cos(rad(drumDeg)));

function place(
  ringDeg: number,
  drumDeg: number,
  ringR: number,
  drumR: number,
  bow: number,
  m: number,
) {
  return (
    `translateX(${m * bowAt(drumDeg, bow)}px)` +
    ` rotateZ(${(1 - m) * ringDeg}deg) translateY(${-(1 - m) * ringR}px)` +
    ` rotateX(${m * drumDeg}deg) translateZ(${m * drumR}px)`
  );
}

export const WorksWheel = React.forwardRef<WorksWheelHandle, WorksWheelProps>(
  function WorksWheel(
    {
      items,
      label = "Works '26",
      hint,
      action = "Abrir",
      onOpen,
      className,
      ...props
    },
    ref,
  ) {
    const stageRef = React.useRef<HTMLDivElement>(null);
    const wheelRef = React.useRef<HTMLDivElement>(null);
    const cardRefs = React.useRef<(HTMLElement | null)[]>([]);
    const labelRef = React.useRef<HTMLDivElement>(null);
    const titleRef = React.useRef<HTMLDivElement>(null);
    const drag = React.useRef<{ y: number; x0: number; y0: number } | null>(null);
    const settling = React.useRef(0);

    // `turn` es la posición de la rueda y `target` hacia dónde va. Solo `active` es
    // estado de React: girar la rueda no provoca renders.
    const turn = React.useRef(0);
    const target = React.useRef(0);
    const [active, setActive] = React.useState(0);
    const [stage, setStage] = React.useState<Stage>({ w: 0, h: 0 });

    const count = items.length;
    const last = Math.max(count - 1, 0);
    const narrow = stage.w > 0 && stage.w < NARROW_PX;

    const [reduced, setReduced] = React.useState(false);
    React.useEffect(() => {
      const query = window.matchMedia("(prefers-reduced-motion: reduce)");
      const read = () => setReduced(query.matches);
      read();
      query.addEventListener("change", read);
      return () => query.removeEventListener("change", read);
    }, []);

    React.useEffect(() => {
      const el = stageRef.current;
      if (!el) return;
      const read = () => setStage({ w: el.clientWidth, h: el.clientHeight });
      read();
      const ro = new ResizeObserver(read);
      ro.observe(el);
      return () => ro.disconnect();
    }, []);

    const metrics = React.useMemo(() => {
      const { w, h } = stage;
      const maxW = w < NARROW_PX ? CARD_MAX_W_NARROW : CARD_MAX_W;
      const cardW = Math.min(h * CARD_H * CARD_RATIO, w * maxW);
      const cardH = cardW / CARD_RATIO;
      const drumR = cardH * DRUM;
      // El anillo no puede ser mayor que el escenario: en alto o ancho reducidos
      // (laptops, móviles) las tarjetas de arriba y de los lados se cortaban.
      const ringR = Math.min(cardH * RING_R, h * 0.36, w * 0.37);
      const ringScale = count
        ? clamp((((2 * Math.PI * ringR) / count) * 0.82) / (cardW || 1), 0.16, 1)
        : 1;
      return {
        cardW,
        cardH,
        ringR,
        ringScale,
        drumR,
        bow: cardH * BOW,
        depth: cardH * LENS,
        title: cardH * TITLE,
        index: Math.max(12, cardH * INDEX),
      };
    }, [stage, count]);

    // Un paso por fotograma: avanzar hacia el destino y escribir todas las transformaciones.
    React.useEffect(() => {
      if (!stage.h) return;
      let frame = 0;
      const { ringR, ringScale, drumR, bow } = metrics;

      const draw = () => {
        frame = requestAnimationFrame(draw);
        const gap = target.current - turn.current;
        if (Math.abs(gap) < 0.0005) turn.current = target.current;
        else turn.current += gap * (reduced ? 1 : EASE);

        const t = turn.current;
        const m = clamp(t, 0, 1);
        const pos = Math.max(0, t - 1);

        if (wheelRef.current) {
          wheelRef.current.style.transform = `translateZ(${-m * drumR}px)`;
        }

        for (let i = 0; i < count; i++) {
          const d = i - pos;
          const drumDeg = d * STEP;
          const card = cardRefs.current[i];
          if (card) {
            card.style.transform = place(d * (360 / count), drumDeg, ringR, drumR, bow, m);
            card.style.opacity = m > 0.5 && Math.abs(d) > CULL ? "0" : "1";
            card.style.zIndex = String(Math.round(100 - Math.abs(d) * 2));
          }
          const face = card?.firstElementChild as HTMLElement | null;
          if (face) {
            face.style.transform = `scale(${lerp(ringScale, 1, m)})`;
            // Solo la cara (ya escalada) recibe toques: el contenedor mantiene su
            // tamaño completo y, en el anillo, se solapaba con sus vecinos.
            face.style.pointerEvents = m > 0.5 && Math.abs(d) > CULL ? "none" : "auto";
          }
        }

        if (labelRef.current) labelRef.current.style.opacity = String(1 - m);
        if (titleRef.current) titleRef.current.style.opacity = String(m);
        const near = clamp(Math.round(pos), 0, last);
        setActive((prev) => (prev === near ? prev : near));
      };

      frame = requestAnimationFrame(draw);
      return () => cancelAnimationFrame(frame);
    }, [metrics, stage.h, count, last, reduced]);

    const to = React.useCallback(
      (next: number) => {
        target.current = clamp(next, 0, last + 1);
      },
      [last],
    );

    React.useImperativeHandle(ref, () => ({ goTo: (index) => to(clamp(index, 0, last) + 1) }), [
      to,
      last,
    ]);

    // Listener nativo para poder cancelar el scroll solo mientras la rueda tenga recorrido.
    React.useEffect(() => {
      const el = stageRef.current;
      if (!el) return;
      const onWheel = (event: WheelEvent) => {
        const next = target.current + event.deltaY / WHEEL_UNITS;
        if (next > 0 && next < last + 1) event.preventDefault();
        to(next);
        window.clearTimeout(settling.current);
        settling.current = window.setTimeout(() => to(Math.round(target.current)), SETTLE);
      };
      el.addEventListener("wheel", onWheel, { passive: false });
      return () => {
        el.removeEventListener("wheel", onWheel);
        window.clearTimeout(settling.current);
      };
    }, [to, last]);

    /** Índice de la tarjeta frontal, o -1 si la rueda aún es un anillo. */
    const frontIndex = () => (target.current >= 1 ? Math.round(target.current) - 1 : -1);

    const select = (i: number) => {
      if (i === frontIndex()) onOpen?.(i);
      else to(i + 1);
    };

    return (
      <section
        aria-label={label}
        className={cn(
          "bg-background text-foreground relative h-full min-h-[24rem] w-full overflow-hidden select-none",
          className,
        )}
        {...props}
      >
        <div
          ref={stageRef}
          tabIndex={0}
          role="listbox"
          aria-label={label}
          aria-activedescendant={`works-wheel-${active}`}
          className="focus-visible:outline-primary absolute inset-0 cursor-grab touch-pan-x outline-none focus-visible:outline-2 focus-visible:-outline-offset-4 active:cursor-grabbing"
          style={{ perspective: `${metrics.depth}px` }}
          onPointerDown={(event) => {
            drag.current = { y: event.clientY, x0: event.clientX, y0: event.clientY };
            event.currentTarget.setPointerCapture(event.pointerId);
          }}
          onPointerMove={(event) => {
            const d = drag.current;
            if (!d) return;
            to(target.current + (d.y - event.clientY) / DRAG_UNITS);
            d.y = event.clientY;
          }}
          onPointerUp={(event) => {
            const d = drag.current;
            drag.current = null;
            if (!d) return;
            const moved = Math.hypot(event.clientX - d.x0, event.clientY - d.y0);
            if (moved <= TAP_SLOP) {
              // Con el puntero capturado el `click` no llega a las tarjetas: se
              // busca la tarjeta bajo el dedo / cursor.
              const hit = document
                .elementFromPoint(event.clientX, event.clientY)
                ?.closest<HTMLElement>("[data-wheel-index]");
              if (hit) {
                select(Number(hit.dataset.wheelIndex));
                return;
              }
            }
            // Detenerse sobre una tarjeta y no entre dos.
            if (target.current > 1) to(Math.round(target.current));
          }}
          onPointerCancel={() => {
            drag.current = null;
          }}
          onKeyDown={(event) => {
            const here = Math.round(target.current);
            if (event.key === "ArrowDown" || event.key === "PageDown") to(here + 1);
            else if (event.key === "ArrowUp" || event.key === "PageUp") to(here - 1);
            else if (event.key === "Home") to(0);
            else if (event.key === "End") to(last + 1);
            else if (event.key === "Enter" || event.key === " ") {
              const f = frontIndex();
              if (f >= 0) onOpen?.(f);
              else to(1);
            } else return;
            event.preventDefault();
          }}
        >
          <div
            ref={wheelRef}
            className="absolute top-1/2 left-1/2 [transform-style:preserve-3d]"
          >
            {items.map((item, i) => (
              <div
                key={item.title}
                id={`works-wheel-${i}`}
                role="option"
                aria-selected={i === active}
                data-wheel-index={i}
                ref={(node) => {
                  cardRefs.current[i] = node;
                }}
                className="group pointer-events-none absolute [backface-visibility:hidden]"
                style={{
                  width: metrics.cardW,
                  height: metrics.cardH,
                  marginLeft: -metrics.cardW / 2,
                  marginTop: -metrics.cardH / 2,
                }}
              >
                <span className="bg-muted shadow-foreground/25 relative block size-full overflow-hidden rounded-lg shadow-[0_18px_40px_-18px_var(--tw-shadow-color)]">
                  <img
                    src={item.image}
                    alt={item.title}
                    draggable={false}
                    className="size-full object-cover"
                  />
                  {action && onOpen ? (
                    <span className="bg-background/85 text-foreground pointer-events-none absolute right-3 bottom-3 flex translate-y-1 items-center gap-1 rounded-full px-2.5 py-1 text-[0.7rem] opacity-0 backdrop-blur-sm transition group-hover:translate-y-0 group-hover:opacity-100">
                      <svg viewBox="0 0 12 12" className="size-2.5" aria-hidden="true">
                        <path
                          d="M3 9 9 3M4 3h5v5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      {action}
                    </span>
                  ) : null}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Título del anillo y título de la tarjeta frontal se intercambian en la transición. */}
        <div
          ref={labelRef}
          className="pointer-events-none absolute inset-0 grid place-items-center text-center font-semibold tracking-tight"
          style={{ fontSize: metrics.title * 0.8 }}
        >
          {/* El ancho se limita al hueco interior del anillo para no rozar las tarjetas. */}
          <div className="text-balance" style={{ maxWidth: metrics.ringR * 1.35 }}>
            {label}
            {hint ? (
              <div
                className="text-muted-foreground mt-3 font-normal tracking-normal"
                style={{ fontSize: Math.max(13, metrics.title * 0.3) }}
              >
                {hint}
              </div>
            ) : null}
          </div>
        </div>
        <div
          ref={titleRef}
          className={cn(
            "pointer-events-none absolute tracking-tight opacity-0",
            narrow
              ? "bg-background/90 right-[5%] bottom-[4%] left-[5%] rounded-2xl px-4 py-4 text-center backdrop-blur-sm"
              : "top-1/2 left-[6%] max-w-[26%] -translate-y-1/2",
          )}
        >
          <div
            className="leading-[1.08] font-semibold"
            style={{ fontSize: narrow ? Math.max(22, metrics.title * 0.8) : metrics.title * 0.8 }}
          >
            {items[active]?.title}
          </div>
          {items[active]?.subtitle ? (
            <div
              className="text-muted-foreground mt-3 leading-snug font-normal tracking-normal"
              style={{ fontSize: Math.max(13, metrics.title * 0.28) }}
            >
              {items[active].subtitle}
            </div>
          ) : null}
          {onOpen ? (
            <button
              type="button"
              onClick={() => onOpen(active)}
              className="bg-primary text-primary-foreground pointer-events-auto mt-5 inline-flex cursor-pointer items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium tracking-normal transition hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              Abrir sección →
            </button>
          ) : null}
        </div>

        <ol
          className="text-muted-foreground absolute top-[6%] right-[2.5%] hidden text-right leading-[1.75] sm:block"
          style={{ fontSize: metrics.index }}
        >
          {items.map((item, i) => (
            <li key={item.title}>
              <button
                type="button"
                onClick={() => select(i)}
                className={cn(
                  "focus-visible:outline-foreground hover:text-foreground cursor-pointer transition-colors outline-none focus-visible:outline-1",
                  i === active && "text-foreground font-semibold",
                )}
              >
                <span className="mr-2 tabular-nums opacity-60">{String(i + 1).padStart(2, "0")}</span>
                {item.title}
              </button>
            </li>
          ))}
        </ol>
      </section>
    );
  },
);

export default WorksWheel;
