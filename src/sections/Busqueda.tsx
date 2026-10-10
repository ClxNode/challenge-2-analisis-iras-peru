import { useState } from "react";
import { CartesianGrid, ReferenceDot, ResponsiveContainer, Scatter, ScatterChart, XAxis, YAxis, ZAxis } from "recharts";

import {
  costoAEstrella,
  costoRuta,
  etiqueta,
  hillPath,
  rutaAEstrella,
  rutaBFS,
  rutaDFS,
  rutasBF,
  type EstadoId,
} from "@/data/notebook";
import { Callout, Card, ChartFrame, H3, P, Pill } from "./common";
import { StateGraph } from "./StateGraph";

type Algo = "bfs" | "dfs" | "bf" | "astar" | "hill";

const ALGOS: { id: Algo; nombre: string }[] = [
  { id: "bfs", nombre: "BFS" },
  { id: "dfs", nombre: "DFS" },
  { id: "bf", nombre: "Fuerza bruta" },
  { id: "astar", nombre: "A*" },
  { id: "hill", nombre: "Hill Climbing" },
];

function Ruta({ ruta }: { ruta: EstadoId[] }) {
  return (
    <ol className="flex flex-wrap items-center gap-x-2 gap-y-2 text-sm">
      {ruta.map((e, i) => (
        <li key={e} className="flex items-center gap-2">
          <span className="bg-primary text-primary-foreground rounded-full px-3 py-1 font-medium">{etiqueta(e)}</span>
          {i < ruta.length - 1 ? <span className="text-muted-foreground">→</span> : null}
        </li>
      ))}
    </ol>
  );
}

export function Busqueda() {
  const [algo, setAlgo] = useState<Algo>("bfs");

  return (
    <div className="space-y-2">
      <P>
        Los cuatro primeros algoritmos recorren el mismo grafo (de «Datos disponibles» a «Resumen epidemiológico»).
        Elige uno para ver su ruta resaltada. Los resultados son los que imprime el notebook.
      </P>

      <div className="flex flex-wrap gap-2 pt-3" role="tablist" aria-label="Algoritmo">
        {ALGOS.map((a) => (
          <Pill key={a.id} active={algo === a.id} onClick={() => setAlgo(a.id)}>
            {a.nombre}
          </Pill>
        ))}
      </div>

      <div className="pt-4">
        {algo === "bfs" && (
          <Detalle
            titulo="Búsqueda en anchura (BFS)"
            idea="Usa una cola y explora primero los estados más cercanos al inicio, por niveles. En un grafo no ponderado encuentra una ruta con el menor número de transiciones."
            ruta={rutaBFS}
            resumen={`${rutaBFS.length - 1} transiciones · ${rutaBFS.length} estados en la ruta`}
          />
        )}
        {algo === "dfs" && (
          <Detalle
            titulo="Búsqueda en profundidad (DFS)"
            idea="Usa una pila y avanza por una rama antes de retroceder. Puede encontrar una ruta, pero no garantiza la de menos transiciones: su resultado depende del orden en que se visitan los vecinos."
            ruta={rutaDFS}
            resumen={`${rutaDFS.length - 1} transiciones · ${rutaDFS.length} estados en la ruta`}
          />
        )}
        {algo === "bf" && (
          <Detalle
            titulo="Fuerza bruta (BF)"
            idea="Genera todas las rutas simples (sin repetir estados) desde el inicio hasta la meta. En este grafo pequeño son 3; en un espacio mayor el costo crecería rápidamente."
            ruta={rutasBF[0]}
            secundarias={rutasBF.slice(1)}
            resumen="3 rutas simples · la de menos transiciones tiene 3"
            extra={
              <ul className="mt-3 space-y-1 text-sm">
                {rutasBF.map((r, i) => (
                  <li key={i}>
                    <span className="text-muted-foreground">Ruta {i + 1}:</span> {r.map(etiqueta).join(" → ")}
                  </li>
                ))}
              </ul>
            }
          />
        )}
        {algo === "astar" && (
          <Detalle
            titulo="A* (búsqueda informada)"
            idea="Prioriza estados con f(n) = g(n) + h(n). Los costos son unidades didácticas de esfuerzo por transición, no costos sanitarios. Con h = 0 se comporta como búsqueda de costo uniforme."
            ruta={rutaAEstrella}
            resumen={`Costo didáctico total: ${costoAEstrella}`}
            costos
            extra={
              <p className="text-muted-foreground mt-3 max-w-[68ch] text-sm leading-relaxed">
                Costo por ruta: vía episodios IRA = {costoRuta(rutasBF[0])}; vía defunciones por neumonía ={" "}
                {costoRuta(rutasBF[1])}; vía brechas = {costoRuta(rutasBF[2])}. Las dos primeras empatan en 4; el notebook
                devuelve la de defunciones según el orden en que procesa los nodos abiertos.
              </p>
            }
          />
        )}
        {algo === "hill" && <HillClimbing />}
      </div>

      <H3>Comparación</H3>
      <div className="border-border bg-card overflow-x-auto rounded-xl border">
        <table className="w-full min-w-[34rem] text-left text-sm">
          <thead className="bg-muted text-primary">
            <tr>
              <th className="px-4 py-2.5 font-semibold">Algoritmo</th>
              <th className="px-4 py-2.5 font-semibold">Cómo explora</th>
              <th className="px-4 py-2.5 font-semibold">Ruta obtenida</th>
            </tr>
          </thead>
          <tbody className="divide-border divide-y">
            <tr><td className="px-4 py-2.5 font-medium">BFS</td><td className="px-4 py-2.5">Por niveles (cola)</td><td className="px-4 py-2.5">Vía episodios IRA · 3 transiciones</td></tr>
            <tr><td className="px-4 py-2.5 font-medium">DFS</td><td className="px-4 py-2.5">En profundidad (pila)</td><td className="px-4 py-2.5">Vía brechas · 3 transiciones</td></tr>
            <tr><td className="px-4 py-2.5 font-medium">Fuerza bruta</td><td className="px-4 py-2.5">Todas las rutas simples</td><td className="px-4 py-2.5">3 rutas posibles</td></tr>
            <tr><td className="px-4 py-2.5 font-medium">A*</td><td className="px-4 py-2.5">Menor costo acumulado (h = 0)</td><td className="px-4 py-2.5">Vía defunciones · costo {costoAEstrella}</td></tr>
          </tbody>
        </table>
      </div>
      <p className="text-muted-foreground max-w-[68ch] pt-3 text-sm leading-relaxed">
        La ruta encontrada no demuestra que una tarea epidemiológica sea más importante que otra: solo muestra el
        comportamiento del algoritmo sobre el grafo definido.
      </p>
    </div>
  );
}

function Detalle({
  titulo,
  idea,
  ruta,
  secundarias,
  resumen,
  costos,
  extra,
}: {
  titulo: string;
  idea: string;
  ruta: EstadoId[];
  secundarias?: EstadoId[][];
  resumen: string;
  costos?: boolean;
  extra?: React.ReactNode;
}) {
  return (
    <div className="space-y-4">
      <Card>
        <h4 className="text-primary text-lg font-semibold">{titulo}</h4>
        <p className="text-foreground/85 mt-1 max-w-[68ch] text-sm leading-relaxed">{idea}</p>
        <div className="mt-4"><Ruta ruta={ruta} /></div>
        <div className="text-accent mt-3 text-sm font-semibold">{resumen}</div>
        {extra}
      </Card>
      <div className="border-border bg-card rounded-xl border p-3 sm:p-5">
        <StateGraph ruta={ruta} rutasSecundarias={secundarias} mostrarCostos={costos} />
        {costos ? <p className="text-muted-foreground mt-1 text-xs">Los números sobre las flechas son los costos didácticos de cada transición.</p> : null}
      </div>
    </div>
  );
}

function HillClimbing() {
  const data = hillPath.map(([x, y], i) => ({ x, y, paso: i }));
  const fin = hillPath[hillPath.length - 1];
  return (
    <div className="space-y-4">
      <Card>
        <h4 className="text-primary text-lg font-semibold">Hill Climbing (demostración conceptual)</h4>
        <p className="text-foreground/85 mt-1 max-w-[68ch] text-sm leading-relaxed">
          Mejora una solución con cambios pequeños y conserva los que mejoran la función objetivo. Aquí es una demo
          independiente con una función matemática artificial, f(x, y) = −((x − 0.7)² + (y − 0.3)²), partiendo de [0.2, 0.8]
          con paso 0.1.
        </p>
        <div className="text-accent mt-3 text-sm font-semibold">
          Converge a [{fin[0]}, {fin[1]}] en {hillPath.length - 1} pasos · valor de la función objetivo ≈ 0
        </div>
      </Card>
      <ChartFrame
        title="Trayectoria del ascenso"
        caption="Sus valores no representan prioridades reales de prevención ni una intervención contra las IRAs."
      >
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
              <CartesianGrid stroke="#e3ebf6" />
              <XAxis type="number" dataKey="x" domain={[0, 1]} tickCount={6} name="x" />
              <YAxis type="number" dataKey="y" domain={[0, 1]} tickCount={6} name="y" width={36} />
              <ZAxis range={[70, 70]} />
              <Scatter data={data} fill="#2e6db4" line={{ stroke: "#2e6db4", strokeWidth: 2 }} isAnimationActive={false} />
              <ReferenceDot x={fin[0]} y={fin[1]} r={9} fill="#1f7a4d" stroke="#fff" strokeWidth={2} />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </ChartFrame>
      <Callout title="Qué muestra">Explica el algoritmo; no produce una recomendación sanitaria.</Callout>
    </div>
  );
}
