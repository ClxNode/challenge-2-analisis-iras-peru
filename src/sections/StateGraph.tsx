import { conexiones, costos, estados, etiqueta, inicio, objetivo, posiciones, type EstadoId } from "@/data/notebook";

interface Props {
  /** Ruta a resaltar (estados en orden). */
  ruta?: EstadoId[];
  /** Rutas secundarias a resaltar con trazo suave (fuerza bruta). */
  rutasSecundarias?: EstadoId[][];
  /** Muestra el costo didáctico sobre cada arista. */
  mostrarCostos?: boolean;
}

const R = 50;

function enRuta(ruta: EstadoId[] | undefined, a: EstadoId, b: EstadoId) {
  if (!ruta) return false;
  return ruta.some((e, i) => e === a && ruta[i + 1] === b);
}

export function StateGraph({ ruta, rutasSecundarias = [], mostrarCostos }: Props) {
  const nodosRuta = new Set(ruta ?? []);
  return (
    <svg viewBox="0 0 770 360" role="img" aria-label="Grafo del espacio de estados" className="h-auto w-full">
      <defs>
        <marker id="flecha" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 0 10 5 0 10z" fill="#53647f" />
        </marker>
        <marker id="flecha-ruta" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 0 10 5 0 10z" fill="#1b3a6b" />
        </marker>
      </defs>

      {estados.flatMap((a) =>
        conexiones[a].map((b) => {
          const p = posiciones[a];
          const q = posiciones[b];
          const dx = q.x - p.x;
          const dy = q.y - p.y;
          const len = Math.hypot(dx, dy);
          const ux = dx / len;
          const uy = dy / len;
          const x1 = p.x + ux * R;
          const y1 = p.y + uy * R;
          const x2 = q.x - ux * (R + 4);
          const y2 = q.y - uy * (R + 4);
          const principal = enRuta(ruta, a, b);
          const secundaria = rutasSecundarias.some((r) => enRuta(r, a, b));
          return (
            <g key={`${a}-${b}`}>
              <line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={principal ? "#1b3a6b" : secundaria ? "#2e6db4" : "#9fb0c8"}
                strokeWidth={principal ? 4.5 : secundaria ? 3 : 2}
                strokeOpacity={principal || secundaria ? 1 : 0.8}
                markerEnd={`url(#${principal ? "flecha-ruta" : "flecha"})`}
              />
              {mostrarCostos ? (
                <g transform={`translate(${(x1 + x2) / 2} ${(y1 + y2) / 2})`}>
                  <circle r="13" fill="#ffffff" stroke={principal ? "#1b3a6b" : "#9fb0c8"} strokeWidth="1.5" />
                  <text textAnchor="middle" dominantBaseline="central" fontSize="14" fontWeight="600" fill="#0b1f3f">
                    {costos[`${a}>${b}`]}
                  </text>
                </g>
              ) : null}
            </g>
          );
        }),
      )}

      {estados.map((e) => {
        const { x, y } = posiciones[e];
        const extremo = e === inicio || e === objetivo;
        const activo = nodosRuta.has(e);
        // Una palabra por línea (3 palabras → 3 líneas) para que el texto quepa en el círculo.
        const lineas = etiqueta(e).split(" ");
        return (
          <g key={e}>
            <circle
              cx={x}
              cy={y}
              r={R}
              fill={activo ? "#1b3a6b" : extremo ? "#d6efdc" : "#dbe8f7"}
              stroke={activo ? "#0b1f3f" : extremo ? "#1f7a4d" : "#2e6db4"}
              strokeWidth={extremo ? 3.5 : 2.5}
            />
            <text textAnchor="middle" fontSize="11" fontWeight="600" fill={activo ? "#ffffff" : "#0b1f3f"}>
              {lineas.map((l, i) => (
                <tspan key={l} x={x} y={y + (i - (lineas.length - 1) / 2) * 14 + 4}>
                  {l}
                </tspan>
              ))}
            </text>
            {extremo ? (
              <text x={x} y={y - R - 8} textAnchor="middle" fontSize="12" fontWeight="700" fill="#1f7a4d">
                {e === inicio ? "INICIO" : "META"}
              </text>
            ) : null}
          </g>
        );
      })}
    </svg>
  );
}
