import { Bar, BarChart, CartesianGrid, LabelList, ResponsiveContainer, XAxis, YAxis } from "recharts";

import { contexto } from "@/data/notebook";
import { ChartFrame, Callout, fmt, H3, P, Stat } from "./common";

const cambio = (a: number, b: number) => ((b - a) / a) * 100;

export function Datos() {
  const [d23, , d25] = contexto;
  const dIra = cambio(d23.episodios, d25.episodios);
  const dMuertes = cambio(d23.defunciones, d25.defunciones);
  const datos = contexto.map((c) => ({ anio: String(c.anio), episodios: c.episodios, defunciones: c.defunciones }));

  return (
    <div className="space-y-2">
      <P>
        Valores transcritos de la infografía del caso, para menores de cinco años. Se usan solo para describir el
        contexto: tres observaciones anuales no bastan para entrenar un modelo predictivo robusto.
      </P>

      <div className="grid gap-4 pt-4 sm:grid-cols-3">
        <Stat value={fmt(d25.episodios)} label="Episodios de IRA en 2025" note={`${fmt(d23.episodios)} en 2023`} />
        <Stat value={fmt(d25.defunciones)} label="Defunciones por neumonía en 2025" note={`${d23.defunciones} en 2023`} />
        <Stat
          value={`${dIra.toFixed(1)} % / ${dMuertes.toFixed(1)} %`}
          label="Cambio 2023 → 2025 (IRA / neumonía)"
          note="Calculado a partir de las cifras de la infografía"
        />
      </div>

      <H3>Comparación anual</H3>
      <div className="grid gap-4 lg:grid-cols-2">
        <ChartFrame title="Episodios de IRA reportados" caption="Fuente: infografía del caso.">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={datos} margin={{ top: 22, right: 8, left: 8, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="#e3ebf6" />
                <XAxis dataKey="anio" tickLine={false} axisLine={false} />
                <YAxis tickFormatter={(v: number) => `${v / 1000} mil`} width={64} tickLine={false} axisLine={false} />
                <Bar dataKey="episodios" fill="#2e6db4" radius={[6, 6, 0, 0]} isAnimationActive={false}>
                  <LabelList dataKey="episodios" position="top" formatter={(v: number) => fmt(v)} fontSize={12} fill="#0b1f3f" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartFrame>
        <ChartFrame title="Defunciones por neumonía reportadas" caption="Fuente: infografía del caso.">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={datos} margin={{ top: 22, right: 8, left: 8, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="#e3ebf6" />
                <XAxis dataKey="anio" tickLine={false} axisLine={false} />
                <YAxis width={40} tickLine={false} axisLine={false} />
                <Bar dataKey="defunciones" fill="#1b3a6b" radius={[6, 6, 0, 0]} isAnimationActive={false}>
                  <LabelList dataKey="defunciones" position="top" fontSize={12} fill="#0b1f3f" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartFrame>
      </div>

      <div className="pt-4">
        <Callout title="Qué no dicen estas cifras">
          La disminución observada no permite atribuir causas ni comparar regiones: la infografía no incluye esas
          variables.
        </Callout>
      </div>
    </div>
  );
}
