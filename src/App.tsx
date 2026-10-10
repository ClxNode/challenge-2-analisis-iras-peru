import { useCallback, useEffect, useRef, useState, type ComponentType } from "react";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";

import { WorksWheel, type WorksWheelHandle } from "@/components/ui/works-wheel";
import { sections } from "@/data/sections";
import { Busqueda } from "@/sections/Busqueda";
import { Conclusiones } from "@/sections/Conclusiones";
import { Datos } from "@/sections/Datos";
import { Estados } from "@/sections/Estados";
import { Fuentes } from "@/sections/Fuentes";
import { Inicio } from "@/sections/Inicio";
import { Modelo } from "@/sections/Modelo";
import { Problema } from "@/sections/Problema";
import { Resultados } from "@/sections/Resultados";

const VISTAS: Record<string, ComponentType> = {
  inicio: Inicio,
  problema: Problema,
  datos: Datos,
  estados: Estados,
  busqueda: Busqueda,
  modelo: Modelo,
  resultados: Resultados,
  conclusiones: Conclusiones,
  fuentes: Fuentes,
};

const indexFromHash = () => {
  const slug = window.location.hash.replace("#", "");
  const i = sections.findIndex((s) => s.slug === slug);
  return i >= 0 ? i : null;
};

export default function App() {
  const wheel = useRef<WorksWheelHandle>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<number | null>(indexFromHash);

  const abrir = useCallback((i: number) => {
    setOpen(i);
    window.history.replaceState(null, "", `#${sections[i].slug}`);
  }, []);

  const cerrar = useCallback(() => {
    setOpen((cur) => {
      if (cur !== null) wheel.current?.goTo(cur);
      return null;
    });
    window.history.replaceState(null, "", window.location.pathname);
  }, []);

  // Al cargar con #seccion, la rueda arranca en esa tarjeta.
  useEffect(() => {
    const i = indexFromHash();
    if (i !== null) wheel.current?.goTo(i);
  }, []);

  // Teclado dentro del panel: Esc cierra, flechas izquierda/derecha cambian de sección.
  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") cerrar();
      else if (e.key === "ArrowRight" && open < sections.length - 1) abrir(open + 1);
      else if (e.key === "ArrowLeft" && open > 0) abrir(open - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, abrir, cerrar]);

  useEffect(() => {
    scroller.current?.scrollTo({ top: 0 });
  }, [open]);

  const meta = open !== null ? sections[open] : null;
  const Vista = meta ? VISTAS[meta.slug] : null;

  return (
    <div className="bg-background text-foreground relative h-screen w-full overflow-hidden">
      <WorksWheel
        ref={wheel}
        items={sections.map((s) => ({ title: s.title, image: s.image, subtitle: s.subtitle }))}
        label="IRAs en menores de 5 años"
        hint="Desplázate, arrastra o usa las flechas para girar la rueda"
        action="Abrir"
        onOpen={abrir}
        aria-hidden={open !== null}
      />

      {meta && Vista && open !== null ? (
        <div className="animate-panel-in bg-background absolute inset-0 z-[200] flex flex-col" role="dialog" aria-modal="true" aria-label={meta.title}>
          <header className="border-border bg-card/90 flex items-center justify-between gap-3 border-b px-4 py-3 backdrop-blur sm:px-8">
            <button
              type="button"
              onClick={cerrar}
              className="text-primary hover:bg-muted inline-flex cursor-pointer items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium transition"
            >
              <ArrowLeft className="size-4" aria-hidden /> Volver a la rueda
            </button>
            <div className="flex items-center gap-1">
              <span className="text-muted-foreground mr-2 hidden text-sm tabular-nums sm:inline">
                {String(open + 1).padStart(2, "0")} / {String(sections.length).padStart(2, "0")}
              </span>
              <button
                type="button"
                aria-label="Sección anterior"
                disabled={open === 0}
                onClick={() => abrir(open - 1)}
                className="text-primary hover:bg-muted cursor-pointer rounded-full p-2 transition disabled:cursor-default disabled:opacity-30"
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                type="button"
                aria-label="Sección siguiente"
                disabled={open === sections.length - 1}
                onClick={() => abrir(open + 1)}
                className="text-primary hover:bg-muted cursor-pointer rounded-full p-2 transition disabled:cursor-default disabled:opacity-30"
              >
                <ChevronRight className="size-5" />
              </button>
            </div>
          </header>

          <div ref={scroller} className="panel-scroll flex-1 overflow-y-auto">
            <div className="mx-auto grid max-w-6xl gap-8 px-5 py-10 sm:px-8 lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-14 lg:py-14">
              <aside className="lg:sticky lg:top-0 lg:self-start">
                <div className="text-muted-foreground text-sm font-semibold tabular-nums">{String(open + 1).padStart(2, "0")}</div>
                <h1 className="text-primary mt-1 text-3xl leading-[1.1] font-semibold tracking-tight lg:text-4xl">{meta.title}</h1>
                <p className="text-muted-foreground mt-3 text-sm leading-snug">{meta.subtitle}</p>
                <div className="bg-accent-soft text-primary mt-5 inline-block rounded-full px-3 py-1 text-xs font-semibold">
                  Rúbrica: {meta.rubric}
                </div>
              </aside>
              <main className="min-w-0 pb-16">
                <Vista />
              </main>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
