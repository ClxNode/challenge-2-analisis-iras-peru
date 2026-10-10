// Datos tomados del notebook "Challenge_IRAs_UPCH_version_mejorada".
// Las cifras de contexto vienen de la infografía del caso; la serie mensual es
// SINTÉTICA (numpy default_rng(42)) y no procede del MINSA ni de pacientes reales.

export const contexto = [
  { anio: 2023, episodios: 1_003_178, defunciones: 113 },
  { anio: 2024, episodios: 883_959, defunciones: 82 },
  { anio: 2025, episodios: 824_978, defunciones: 51 },
] as const;

/* ---------- Espacio de estados ---------- */
export type EstadoId =
  | "Datos_disponibles"
  | "Analizar_episodios_IRA"
  | "Analizar_defunciones_neumonia"
  | "Identificar_brechas"
  | "Integrar_hallazgos"
  | "Resumen_epidemiologico";

export const estados: EstadoId[] = [
  "Datos_disponibles",
  "Analizar_episodios_IRA",
  "Analizar_defunciones_neumonia",
  "Identificar_brechas",
  "Integrar_hallazgos",
  "Resumen_epidemiologico",
];

export const conexiones: Record<EstadoId, EstadoId[]> = {
  Datos_disponibles: ["Analizar_episodios_IRA", "Analizar_defunciones_neumonia", "Identificar_brechas"],
  Analizar_episodios_IRA: ["Integrar_hallazgos"],
  Analizar_defunciones_neumonia: ["Integrar_hallazgos"],
  Identificar_brechas: ["Integrar_hallazgos"],
  Integrar_hallazgos: ["Resumen_epidemiologico"],
  Resumen_epidemiologico: [],
};

/** Costos didácticos de A* (no son costos sanitarios). */
export const costos: Record<string, number> = {
  "Datos_disponibles>Analizar_episodios_IRA": 2,
  "Datos_disponibles>Analizar_defunciones_neumonia": 2,
  "Datos_disponibles>Identificar_brechas": 2,
  "Analizar_episodios_IRA>Integrar_hallazgos": 1,
  "Analizar_defunciones_neumonia>Integrar_hallazgos": 1,
  "Identificar_brechas>Integrar_hallazgos": 2,
  "Integrar_hallazgos>Resumen_epidemiologico": 1,
};

export const inicio: EstadoId = "Datos_disponibles";
export const objetivo: EstadoId = "Resumen_epidemiologico";

/** Nombres para mostrar (los identificadores del notebook van sin tildes). */
const NOMBRES: Record<EstadoId, string> = {
  Datos_disponibles: "Datos disponibles",
  Analizar_episodios_IRA: "Analizar episodios IRA",
  Analizar_defunciones_neumonia: "Analizar defunciones neumonía",
  Identificar_brechas: "Identificar brechas",
  Integrar_hallazgos: "Integrar hallazgos",
  Resumen_epidemiologico: "Resumen epidemiológico",
};

export const etiqueta = (e: EstadoId) => NOMBRES[e];

/** Posiciones del diagrama (mismas del notebook, reescaladas a un lienzo 760x360). */
export const posiciones: Record<EstadoId, { x: number; y: number }> = {
  Datos_disponibles: { x: 80, y: 180 },
  Analizar_episodios_IRA: { x: 280, y: 60 },
  Analizar_defunciones_neumonia: { x: 280, y: 180 },
  Identificar_brechas: { x: 280, y: 300 },
  Integrar_hallazgos: { x: 500, y: 180 },
  Resumen_epidemiologico: { x: 690, y: 180 },
};

/* ---------- Rutas devueltas por cada algoritmo (salida real del notebook) ---------- */
export const rutaBFS: EstadoId[] = [
  "Datos_disponibles",
  "Analizar_episodios_IRA",
  "Integrar_hallazgos",
  "Resumen_epidemiologico",
];
export const rutaDFS: EstadoId[] = [
  "Datos_disponibles",
  "Identificar_brechas",
  "Integrar_hallazgos",
  "Resumen_epidemiologico",
];
export const rutasBF: EstadoId[][] = [
  rutaBFS,
  ["Datos_disponibles", "Analizar_defunciones_neumonia", "Integrar_hallazgos", "Resumen_epidemiologico"],
  rutaDFS,
];
export const rutaAEstrella: EstadoId[] = rutasBF[1];
export const costoAEstrella = 4;

export const costoRuta = (ruta: EstadoId[]) =>
  ruta.slice(1).reduce((acc, e, i) => acc + costos[`${ruta[i]}>${e}`], 0);

/** Trayectoria de Hill Climbing (paso 0.1) desde [0.2, 0.8]; termina en [0.7, 0.3]. */
export const hillPath: [number, number][] = [
  [0.2, 0.8], [0.3, 0.8], [0.3, 0.7], [0.4, 0.7], [0.4, 0.6], [0.4, 0.5],
  [0.5, 0.5], [0.5, 0.4], [0.6, 0.4], [0.6, 0.3], [0.7, 0.3],
];

/* ---------- Serie sintética y regresión lineal ---------- */
export const serieSintetica: number[] = [
  99.81, 96.32, 99.1, 98.68, 92.1, 92.6, 94.66, 92.97, 92.77, 90.29, 92.96, 91.96, 89.73, 91.05,
  88.94, 85.48, 87.14, 83.68, 86.56, 83.9, 82.83, 81.04, 84.05, 80.49, 79.14, 78.5, 79.46, 78.33,
  77.63, 76.86, 79.48, 73.59, 72.58, 71.17, 73.23, 73.46,
];

export const N_TRAIN = 27;

export const meses = serieSintetica.map((_, i) => i + 1);

/** Mínimos cuadrados sobre los primeros 27 meses (equivale a sklearn LinearRegression). */
function ajustar() {
  const xs = meses.slice(0, N_TRAIN);
  const ys = serieSintetica.slice(0, N_TRAIN);
  const mx = xs.reduce((a, b) => a + b, 0) / xs.length;
  const my = ys.reduce((a, b) => a + b, 0) / ys.length;
  const sxy = xs.reduce((a, x, i) => a + (x - mx) * (ys[i] - my), 0);
  const sxx = xs.reduce((a, x) => a + (x - mx) ** 2, 0);
  const pendiente = sxy / sxx;
  return { pendiente, intercepto: my - pendiente * mx };
}

export const modelo = ajustar();
export const predecir = (mes: number) => modelo.intercepto + modelo.pendiente * mes;

export const serieChart = meses.map((mes, i) => ({
  mes,
  entrenamiento: i < N_TRAIN ? serieSintetica[i] : null,
  prueba: i >= N_TRAIN ? serieSintetica[i] : null,
  recta: Number(predecir(mes).toFixed(2)),
  estimado: i >= N_TRAIN ? Number(predecir(mes).toFixed(2)) : null,
}));

export const tablaPrueba = meses.slice(N_TRAIN).map((mes) => ({
  mes,
  observado: serieSintetica[mes - 1],
  estimado: Number(predecir(mes).toFixed(2)),
}));

function metricas() {
  const obs = serieSintetica.slice(N_TRAIN);
  const err = obs.map((y, i) => y - predecir(N_TRAIN + 1 + i));
  const mae = err.reduce((a, e) => a + Math.abs(e), 0) / err.length;
  const rmse = Math.sqrt(err.reduce((a, e) => a + e * e, 0) / err.length);
  const media = obs.reduce((a, b) => a + b, 0) / obs.length;
  const ssTot = obs.reduce((a, y) => a + (y - media) ** 2, 0);
  const ssRes = err.reduce((a, e) => a + e * e, 0);
  return { mae, rmse, r2: 1 - ssRes / ssTot };
}

export const metricasPrueba = metricas();
