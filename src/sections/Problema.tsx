import { Callout, Card, H3, P } from "./common";

export function Problema() {
  return (
    <div className="space-y-2">
      <H3>Contexto del caso</H3>
      <P>
        La infografía entregada reporta, para menores de cinco años, los episodios de IRA y las defunciones por
        neumonía de 2023 a 2025. Las cifras muestran una disminución en el periodo, pero por sí solas no permiten
        establecer las causas ni comparar regiones: la infografía no incluye esas variables.
      </P>

      <H3>Pregunta del notebook</H3>
      <Card className="border-accent/40 bg-accent-soft">
        <p className="text-primary max-w-[68ch] text-lg leading-snug font-medium">
          ¿Cómo organizar y explorar distintas rutas de análisis de los datos disponibles para producir un resumen
          epidemiológico, y cómo demostrar una regresión lineal con datos sintéticos relacionados con la tendencia
          general del caso?
        </p>
      </Card>

      <H3>Tarea de Machine Learning</H3>
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <div className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">Tipo</div>
          <div className="mt-1 font-medium">Aprendizaje supervisado</div>
          <p className="text-muted-foreground mt-1 text-sm">Los ejemplos sintéticos incluyen una variable objetivo conocida.</p>
        </Card>
        <Card>
          <div className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">Tarea</div>
          <div className="mt-1 font-medium">Regresión</div>
          <p className="text-muted-foreground mt-1 text-sm">Se estima una cantidad numérica.</p>
        </Card>
        <Card>
          <div className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">Modelo</div>
          <div className="mt-1 font-medium">Regresión lineal</div>
          <p className="text-muted-foreground mt-1 text-sm">Ajusta una tendencia lineal sencilla, vista en clase.</p>
        </Card>
      </div>

      <H3>Por qué IA y ML en este caso</H3>
      <P>
        La búsqueda (BFS, DFS, fuerza bruta, A*) sirve para comparar rutas de trabajo analítico en un grafo de estados
        bien definido. La regresión lineal, como aprendizaje supervisado, ilustra cómo se ajusta una tendencia a datos
        con una respuesta conocida y cómo se mide el error en datos no vistos.
      </P>
      <div className="pt-4">
        <Callout title="Límite" tone="warn">
          El modelo usa datos artificiales y no debe interpretarse como un pronóstico de las IRAs reales.
        </Callout>
      </div>
    </div>
  );
}
