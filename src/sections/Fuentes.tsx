import { Callout, H3 } from "./common";

const fuentes = [
  "Universidad Peruana Cayetano Heredia (UPCH). Challenge 1 (Individual): Pipeline de Machine Learning. Documento de instrucciones y rúbrica proporcionados para el curso.",
  "UPCH, Fundamentos de IA y Búsqueda. Búsqueda en Profundidad (DFS) y Búsqueda en Anchura (BFS), Sesión 3.",
  "UPCH, Fundamentos de IA y Búsqueda. Búsqueda Exhaustiva (BF), Hill Climbing y A* Search, Sesión 4.",
  "UPCH, Fundamentos de Machine Learning. Tipos de Aprendizaje, Sesión 5.",
  "UPCH, Fundamentos de Machine Learning. Clasificación vs Regresión y Clustering vs Reducción, Sesión 6.",
  "UPCH, Fundamentos de Machine Learning. Regresión Lineal, Regresión No Lineal y Regresión Logística, Sesión 7.",
  "Infografía «Infecciones Respiratorias Agudas (IRA) y Neumonía en menores de 5 años en el Perú», proporcionada para el caso.",
];

export function Fuentes() {
  return (
    <div className="space-y-2">
      <H3>Referencias</H3>
      <ol className="space-y-3">
        {fuentes.map((f, i) => (
          <li key={i} className="flex gap-3">
            <span className="text-accent w-5 shrink-0 text-sm font-semibold tabular-nums">{i + 1}.</span>
            <span className="text-foreground/85 max-w-[68ch] leading-relaxed">{f}</span>
          </li>
        ))}
        <li className="flex gap-3">
          <span className="text-accent w-5 shrink-0 text-sm font-semibold tabular-nums">8.</span>
          <span className="text-foreground/85 leading-relaxed">
            Ministerio de Salud del Perú (MINSA), portal institucional:{" "}
            <a className="text-accent underline underline-offset-2" href="https://www.gob.pe/minsa" target="_blank" rel="noreferrer">
              https://www.gob.pe/minsa
            </a>
          </span>
        </li>
      </ol>

      <div className="pt-6">
        <Callout title="Declaración de datos">
          Las cifras de contexto (episodios de IRA y defunciones por neumonía, 2023–2025) proceden de la infografía del
          caso. La serie mensual usada para la regresión se genera artificialmente en el notebook y no procede del MINSA
          ni de pacientes reales.
        </Callout>
      </div>
    </div>
  );
}
