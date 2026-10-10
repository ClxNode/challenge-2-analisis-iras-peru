import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, XAxis, YAxis, ReferenceLine } from "recharts";

import { modelo, N_TRAIN, serieSintetica, meses } from "@/data/notebook";
import { Card, ChartFrame, H3, P, Stat, SyntheticBanner } from "./common";

const serie = meses.map((m, i) => ({ mes: m, valor: serieSintetica[i] }));

export function Modelo() {
  return (
    <div className="space-y-2">
      <SyntheticBanner />

      <H3>Por qué una regresión lineal</H3>
      <P>
        La infografía solo da tres valores anuales de episodios de IRA, insuficientes para entrenar y evaluar una
        regresión de forma sólida. Por eso el notebook genera una serie mensual sintética de 36 puntos para practicar el
        modelo. El objetivo es estimar una cantidad numérica, y la regresión lineal ajusta una recta entre una entrada
        X y una variable objetivo y.
      </P>

      <H3>Variables</H3>
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <div className="text-accent text-xs font-semibold tracking-wider uppercase">Entrada (X)</div>
          <div className="mt-1 font-mono text-sm">mes</div>
          <p className="text-muted-foreground mt-1 text-sm">Índice temporal simulado, de 1 a 36.</p>
        </Card>
        <Card>
          <div className="text-accent text-xs font-semibold tracking-wider uppercase">Objetivo (y)</div>
          <div className="mt-1 font-mono text-sm">episodios_sinteticos_miles</div>
          <p className="text-muted-foreground mt-1 text-sm">Índice sintético en miles artificiales.</p>
        </Card>
      </div>

      <H3>Generación de los datos</H3>
      <P>
        y = 100 − 0.8 · mes + ruido normal (media 0, desviación 2.0), con semilla 42, recortado a un mínimo de 1 y
        redondeado a 2 decimales. La tendencia descendente se inspira solo en la dirección general de las cifras de la
        infografía; la escala y los valores mensuales son artificiales. No deben mezclarse con las cifras oficiales.
      </P>

      <div className="grid gap-4 pt-4 sm:grid-cols-3">
        <Stat value="36" label="Registros sintéticos" note="1 punto por mes simulado" />
        <Stat value={String(N_TRAIN)} label="Meses de entrenamiento" note="Meses 1 a 27" />
        <Stat value={String(meses.length - N_TRAIN)} label="Meses de prueba" note="Meses 28 a 36, no usados para ajustar" />
      </div>

      <H3>Serie mensual sintética</H3>
      <ChartFrame
        title="Índice de episodios (miles artificiales)"
        caption="La línea punteada marca la división temporal entre entrenamiento y prueba."
      >
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={serie} margin={{ top: 10, right: 16, bottom: 18, left: 0 }}>
              <CartesianGrid stroke="#e3ebf6" />
              <XAxis dataKey="mes" label={{ value: "Mes simulado", position: "insideBottom", offset: -10, fontSize: 12 }} />
              <YAxis domain={[65, 105]} width={40} />
              <ReferenceLine x={N_TRAIN + 0.5} stroke="#53647f" strokeDasharray="5 4" />
              <Line type="monotone" dataKey="valor" stroke="#2e6db4" strokeWidth={2} dot={{ r: 3 }} isAnimationActive={false} />
              <Legend formatter={() => "Datos sintéticos"} verticalAlign="top" height={24} wrapperStyle={{ fontSize: 12 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </ChartFrame>

      <H3>Modelo ajustado</H3>
      <Card className="bg-primary text-primary-foreground border-primary">
        <div className="font-mono text-lg sm:text-xl">
          y = {modelo.intercepto.toFixed(3)} + ({modelo.pendiente.toFixed(3)}) · mes
        </div>
        <p className="mt-2 text-sm opacity-85">
          Pendiente: {modelo.pendiente.toFixed(3)} unidades sintéticas por mes. Ajustado solo con los primeros 27 meses.
        </p>
      </Card>
    </div>
  );
}
