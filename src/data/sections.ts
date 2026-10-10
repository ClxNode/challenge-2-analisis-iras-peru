export interface SectionMeta {
  slug: string;
  title: string;
  subtitle: string;
  image: string;
  /** Criterio de la rúbrica que cubre la sección. */
  rubric: string;
}

export const RUBRIC = {
  caso: "Presentación del caso y problema",
  estados: "Espacio de estados",
  busqueda: "Pipeline de razonamiento, búsqueda y resultados",
  modelo: "Pipeline del modelo de predicción y visualización",
} as const;

export const sections: SectionMeta[] = [
  { slug: "inicio", title: "Inicio", subtitle: "Portada del proyecto", image: `${import.meta.env.BASE_URL}cards/01-inicio.svg`, rubric: RUBRIC.caso },
  { slug: "problema", title: "El problema", subtitle: "Contexto de las IRAs y por qué usar ML", image: `${import.meta.env.BASE_URL}cards/02-problema.svg`, rubric: RUBRIC.caso },
  { slug: "datos", title: "Datos epidemiológicos", subtitle: "Cifras 2023–2025 de la infografía", image: `${import.meta.env.BASE_URL}cards/03-datos.svg`, rubric: RUBRIC.caso },
  { slug: "estados", title: "Espacio de estados", subtitle: "Estados, operadores, restricciones y meta", image: `${import.meta.env.BASE_URL}cards/04-estados.svg`, rubric: RUBRIC.estados },
  { slug: "busqueda", title: "Algoritmos de búsqueda", subtitle: "BFS, DFS, fuerza bruta, A* y Hill Climbing", image: `${import.meta.env.BASE_URL}cards/05-busqueda.svg`, rubric: RUBRIC.busqueda },
  { slug: "modelo", title: "Modelo predictivo", subtitle: "Regresión lineal con datos sintéticos", image: `${import.meta.env.BASE_URL}cards/06-modelo.svg`, rubric: RUBRIC.modelo },
  { slug: "resultados", title: "Resultados", subtitle: "Rutas, métricas y gráficos del notebook", image: `${import.meta.env.BASE_URL}cards/07-resultados.svg`, rubric: RUBRIC.busqueda + " · " + RUBRIC.modelo },
  { slug: "conclusiones", title: "Conclusiones", subtitle: "Hallazgos, límites y mejoras", image: `${import.meta.env.BASE_URL}cards/08-conclusiones.svg`, rubric: "Cierre" },
  { slug: "fuentes", title: "Fuentes", subtitle: "Notebook, clases e infografía", image: `${import.meta.env.BASE_URL}cards/09-fuentes.svg`, rubric: "Referencias" },
];
