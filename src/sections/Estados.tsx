import { Card, Callout, H3, P } from "./common";
import { StateGraph } from "./StateGraph";

export function Estados() {
  return (
    <div className="space-y-2">
      <P>
        El espacio de estados representa rutas alternativas de trabajo analítico para elaborar un resumen a partir de la
        infografía. No es un protocolo del MINSA ni una recomendación clínica.
      </P>

      <div className="border-border bg-card mt-4 rounded-xl border p-3 sm:p-5">
        <StateGraph />
        <div className="text-muted-foreground mt-2 flex flex-wrap gap-x-5 gap-y-1 text-xs">
          <span className="inline-flex items-center gap-1.5"><i className="inline-block size-3 rounded-full border-2 border-ok bg-[#d6efdc]" /> inicio / meta</span>
          <span className="inline-flex items-center gap-1.5"><i className="inline-block size-3 rounded-full border-2 border-accent bg-accent-soft" /> estados intermedios</span>
        </div>
      </div>

      <H3>Componentes del problema</H3>
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <div className="text-accent text-xs font-semibold tracking-wider uppercase">Estado inicial</div>
          <p className="mt-1 text-sm leading-relaxed">Datos epidemiológicos de la infografía disponibles.</p>
        </Card>
        <Card>
          <div className="text-accent text-xs font-semibold tracking-wider uppercase">Estados intermedios</div>
          <p className="mt-1 text-sm leading-relaxed">
            Analizar episodios de IRA, analizar defunciones por neumonía o identificar brechas de información. Luego, el
            estado de integración: integrar los hallazgos de la ruta explorada.
          </p>
        </Card>
        <Card>
          <div className="text-accent text-xs font-semibold tracking-wider uppercase">Operadores</div>
          <p className="mt-1 text-sm leading-relaxed">
            Seleccionar una de las tareas de análisis disponibles y luego integrar el hallazgo. En total hay 6 estados y
            7 transiciones dirigidas.
          </p>
        </Card>
        <Card>
          <div className="text-accent text-xs font-semibold tracking-wider uppercase">Estado objetivo</div>
          <p className="mt-1 text-sm leading-relaxed">
            Producir un resumen epidemiológico con el alcance y las limitaciones documentadas.
          </p>
        </Card>
      </div>

      <H3>Restricciones</H3>
      <ul className="text-foreground/85 max-w-[68ch] list-disc space-y-1.5 pl-5 leading-relaxed">
        <li>No inventar datos faltantes.</li>
        <li>Distinguir las cifras de la infografía de los datos sintéticos.</li>
        <li>No atribuir causalidad a una simple tendencia.</li>
      </ul>

      <div className="pt-4">
        <Callout title="Alcance de la búsqueda">
          Los algoritmos comparan rutas posibles dentro de este modelo conceptual. No determinan qué política sanitaria
          debe aplicarse.
        </Callout>
      </div>
    </div>
  );
}
