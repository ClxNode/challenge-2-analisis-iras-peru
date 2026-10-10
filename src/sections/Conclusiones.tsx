import { Callout, Card, H3 } from "./common";

const hallazgos = [
  "Se presentó el caso de las IRAs en menores de cinco años con las cifras transcritas de la infografía.",
  "Se definió un espacio de estados con rutas alternativas (episodios de IRA, defunciones por neumonía o brechas de información) y luego una integración de hallazgos.",
  "Se implementaron BFS, DFS, fuerza bruta y A* para explorar rutas; los costos de A* son didácticos y no representan costos sanitarios.",
  "Hill Climbing se mostró como demostración matemática independiente, sin atribuirle recomendaciones de salud pública.",
  "Se eligió regresión lineal porque el objetivo demostrativo es estimar una cantidad numérica.",
  "Se generó una serie mensual sintética, se entrenó la regresión y se interpretaron un gráfico y métricas de evaluación (MAE 1.40, RMSE 1.75, R² 0.602).",
];

export function Conclusiones() {
  return (
    <div className="space-y-2">
      <H3>Hallazgos</H3>
      <ol className="space-y-3">
        {hallazgos.map((h, i) => (
          <li key={i} className="flex gap-3">
            <span className="bg-primary text-primary-foreground mt-0.5 grid size-6 shrink-0 place-items-center rounded-full text-xs font-semibold">{i + 1}</span>
            <span className="text-foreground/85 max-w-[68ch] leading-relaxed">{h}</span>
          </li>
        ))}
      </ol>

      <H3>Limitaciones</H3>
      <Callout tone="warn" title="Los resultados de regresión no son pronósticos epidemiológicos reales">
        Para ese objetivo se necesitarían datos oficiales mensuales, suficientemente extensos y documentados. Los costos
        de A* son unidades didácticas y el grafo es un modelo conceptual, no un protocolo sanitario.
      </Callout>

      <H3>Posibles mejoras</H3>
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <div className="font-medium">Datos oficiales</div>
          <p className="text-muted-foreground mt-1 text-sm">Series mensuales documentadas, idealmente por región, para entrenar y validar con casos reales.</p>
        </Card>
        <Card>
          <div className="font-medium">Más variables</div>
          <p className="text-muted-foreground mt-1 text-sm">Incorporar factores adicionales cuando existan datos, en lugar de solo el tiempo.</p>
        </Card>
        <Card>
          <div className="font-medium">Otros modelos</div>
          <p className="text-muted-foreground mt-1 text-sm">Comparar con regresión no lineal u otros enfoques vistos en clase.</p>
        </Card>
      </div>
      <p className="text-muted-foreground pt-2 text-xs">Las mejoras son propuestas de trabajo futuro; no forman parte de los resultados del notebook.</p>
    </div>
  );
}
