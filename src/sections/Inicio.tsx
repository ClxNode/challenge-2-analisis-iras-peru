import { Card, Callout } from "./common";

export function Inicio() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-accent text-sm font-semibold tracking-widest uppercase">Challenge 2 · Pipeline de Machine Learning · Tipo B</p>
        <h2 className="text-primary mt-3 text-3xl leading-tight font-semibold tracking-tight sm:text-4xl">
          Análisis de las Infecciones Respiratorias Agudas en menores de cinco años en el Perú mediante algoritmos de
          búsqueda y regresión lineal
        </h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <div className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">Curso</div>
          <div className="mt-1 font-medium">Fundamentos de Machine Learning</div>
          <div className="text-muted-foreground text-sm">Unidad: Fundamentos de IA y Búsqueda</div>
        </Card>
        <Card>
          <div className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">Universidad</div>
          <div className="mt-1 font-medium">Universidad Peruana Cayetano Heredia (UPCH)</div>
          <div className="text-muted-foreground text-sm">Estudiante: Juan Vidal Berrocal Ccapcha</div>
        </Card>
      </div>

      <div>
        <h3 className="text-primary mb-2 text-lg font-semibold">Objetivo</h3>
        <p className="text-foreground/85 max-w-[68ch] leading-relaxed">
          Representar el problema con un espacio de estados, explorar soluciones mediante búsqueda y construir un
          pipeline de regresión con datos sintéticos.
        </p>
      </div>

      <Callout title="Nota de rigor" tone="warn">
        La infografía aporta cifras agregadas para contextualizar el caso, pero no contiene registros individuales ni
        una serie suficiente para entrenar un modelo fiable. El conjunto de entrenamiento es sintético, generado por
        código; no procede del MINSA ni de pacientes reales.
      </Callout>

      <p className="text-muted-foreground text-sm">
        Usa las flechas del teclado, la rueda del mouse o el índice para moverte entre secciones. Esc vuelve a la rueda.
      </p>
    </div>
  );
}
