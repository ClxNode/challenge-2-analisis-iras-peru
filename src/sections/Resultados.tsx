import {
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { costoAEstrella, etiqueta, metricasPrueba, N_TRAIN, rutaAEstrella, rutaBFS, rutaDFS, serieChart, tablaPrueba } from "@/data/notebook";
import { ChartFrame, H3, P, Stat, SyntheticBanner } from "./common";

export function Resultados() {
  const { mae, rmse, r2 } = metricasPrueba;
  return (
    <div className="space-y-2">
      <H3>Resultados de la búsqueda</H3>
      <div className="border-border bg-card overflow-x-auto rounded-xl border">
        <table className="w-full min-w-[34rem] text-left text-sm">
          <thead className="bg-muted text-primary">
            <tr>
              <th className="px-4 py-2.5 font-semibold">Algoritmo</th>
              <th className="px-4 py-2.5 font-semibold">Estado intermedio elegido</th>
              <th className="px-4 py-2.5 font-semibold">Resultado</th>
            </tr>
          </thead>
          <tbody className="divide-border divide-y">
            <tr><td className="px-4 py-2.5 font-medium">BFS</td><td className="px-4 py-2.5">{etiqueta(rutaBFS[1])}</td><td className="px-4 py-2.5">3 transiciones</td></tr>
            <tr><td className="px-4 py-2.5 font-medium">DFS</td><td className="px-4 py-2.5">{etiqueta(rutaDFS[1])}</td><td className="px-4 py-2.5">3 transiciones</td></tr>
            <tr><td className="px-4 py-2.5 font-medium">Fuerza bruta</td><td className="px-4 py-2.5">Las 3 posibles</td><td className="px-4 py-2.5">3 rutas simples</td></tr>
            <tr><td className="px-4 py-2.5 font-medium">A*</td><td className="px-4 py-2.5">{etiqueta(rutaAEstrella[1])}</td><td className="px-4 py-2.5">Costo didáctico {costoAEstrella}</td></tr>
            <tr><td className="px-4 py-2.5 font-medium">Hill Climbing (demo)</td><td className="px-4 py-2.5">—</td><td className="px-4 py-2.5">Converge a [0.7, 0.3]</td></tr>
          </tbody>
        </table>
      </div>

      <H3>Métricas del modelo (9 meses de prueba)</H3>
      <div className="grid gap-4 sm:grid-cols-3">
        <Stat value={mae.toFixed(2)} label="MAE" note="Error absoluto medio, en unidades sintéticas" />
        <Stat value={rmse.toFixed(2)} label="RMSE" note="Penaliza más los errores grandes" />
        <Stat value={r2.toFixed(3)} label="R²" note="Variabilidad explicada en el conjunto de prueba" />
      </div>

      <H3>Regresión lineal sobre datos mensuales sintéticos</H3>
      <ChartFrame
        title="Entrenamiento, prueba y recta ajustada"
        caption="Cuadrados: valores sintéticos observados en prueba. Cruces: estimaciones del modelo en esos meses."
      >
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={serieChart} margin={{ top: 10, right: 16, bottom: 18, left: 0 }}>
              <CartesianGrid stroke="#e3ebf6" />
              <XAxis dataKey="mes" type="number" domain={[1, 36]} tickCount={10} label={{ value: "Mes simulado", position: "insideBottom", offset: -10, fontSize: 12 }} />
              <YAxis domain={[65, 105]} width={40} />
              <Tooltip />
              <ReferenceLine x={N_TRAIN + 0.5} stroke="#53647f" strokeDasharray="5 4" />
              <Line dataKey="recta" name="Recta de regresión" stroke="#1b3a6b" strokeWidth={2.5} dot={false} isAnimationActive={false} />
              <Scatter dataKey="entrenamiento" name="Entrenamiento" fill="#2e6db4" isAnimationActive={false} />
              <Scatter dataKey="prueba" name="Prueba: observados" fill="#c2410c" shape="square" isAnimationActive={false} />
              <Scatter dataKey="estimado" name="Estimaciones en prueba" fill="#1f7a4d" shape="cross" isAnimationActive={false} />
              <Legend verticalAlign="top" height={28} wrapperStyle={{ fontSize: 12 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </ChartFrame>

      <H3>Predicciones para los últimos 9 meses</H3>
      <div className="border-border bg-card overflow-x-auto rounded-xl border">
        <table className="w-full min-w-[26rem] text-left text-sm tabular-nums">
          <thead className="bg-muted text-primary">
            <tr>
              <th className="px-4 py-2.5 font-semibold">Mes</th>
              <th className="px-4 py-2.5 font-semibold">Valor sintético observado</th>
              <th className="px-4 py-2.5 font-semibold">Valor estimado</th>
            </tr>
          </thead>
          <tbody className="divide-border divide-y">
            {tablaPrueba.map((f) => (
              <tr key={f.mes}>
                <td className="px-4 py-2">{f.mes}</td>
                <td className="px-4 py-2">{f.observado.toFixed(2)}</td>
                <td className="px-4 py-2">{f.estimado.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <H3>Cómo leerlo</H3>
      <P>
        La pendiente indica cuánto cambia, en promedio, el índice sintético por cada mes simulado. MAE y RMSE resumen el
        tamaño del error en prueba; R² compara el ajuste con predecir la media. Aunque la tendencia se inspira en la
        disminución de la infografía, no se puede afirmar que el modelo prediga casos reales.
      </P>
      <div className="pt-4"><SyntheticBanner /></div>
    </div>
  );
}
