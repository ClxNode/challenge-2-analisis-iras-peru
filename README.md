# IRAs en menores de 5 años · Búsqueda y regresión lineal

Presentación web interactiva del **Challenge 1 (Tipo B)** de la Universidad Peruana Cayetano Heredia (UPCH):
*Análisis de las Infecciones Respiratorias Agudas en menores de cinco años en el Perú mediante algoritmos de
búsqueda y regresión lineal.*

La navegación usa el componente **WorksWheel** (rueda 3D de tarjetas) adaptado a las nueve secciones del trabajo.
El contenido sale del notebook `Challenge_IRAs_UPCH_version_mejorada.ipynb`.

> **Aviso de datos.** Las cifras de 2023–2025 vienen de la infografía del caso. La serie mensual usada para la
> regresión es **sintética** (generada por código): no procede del MINSA ni de pacientes reales y no es un pronóstico
> epidemiológico.

## Requisitos

- [Node.js](https://nodejs.org) 18 o superior (probado con Node 22).
- Navegador moderno (Chrome en Windows recomendado).

## Instalar y ejecutar (Windows, PowerShell o CMD)

```bash
npm install
npm run dev
```

Abre la dirección que muestra la consola (normalmente <http://localhost:5173>).

Otros comandos:

| Comando | Qué hace |
| --- | --- |
| `npm run build` | Revisa los tipos con TypeScript y genera la versión de producción en `dist/`. |
| `npm run preview` | Sirve `dist/` para probar la versión de producción. |
| `npm run typecheck` | Solo revisa los tipos. |

## Cómo se usa

- **Rueda del mouse / arrastrar / flechas ↑ ↓**: giran la rueda. La primera muesca abre el anillo en un tambor.
- **Clic en la tarjeta frontal**, botón **Abrir sección**, o **Enter**: abre la sección en un panel de lectura.
- **Índice de la derecha**: lleva directamente a una sección (clic de nuevo para abrirla).
- Dentro del panel: **← →** cambian de sección y **Esc** vuelve a la rueda.
- La URL guarda la sección abierta (`#busqueda`, `#resultados`, …), útil para enlazar o recargar.

## Secciones y rúbrica

| # | Sección | Criterio de la rúbrica |
| --- | --- | --- |
| 1 | Inicio | Presentación del caso y problema |
| 2 | El problema | Presentación del caso y problema |
| 3 | Datos epidemiológicos | Presentación del caso y problema |
| 4 | Espacio de estados | Espacio de estados |
| 5 | Algoritmos de búsqueda (BFS, DFS, fuerza bruta, A*, Hill Climbing) | Pipeline de razonamiento, búsqueda y resultados |
| 6 | Modelo predictivo | Pipeline del modelo de predicción y visualización |
| 7 | Resultados | Búsqueda y modelo de predicción |
| 8 | Conclusiones | Cierre |
| 9 | Fuentes | Referencias |

## Estructura

```
index.html
package.json · vite.config.ts · tsconfig*.json · components.json
public/
  favicon.svg
  cards/                      portadas SVG locales de las tarjetas
src/
  main.tsx · App.tsx · index.css
  components/ui/works-wheel.tsx   WorksWheel adaptado
  lib/utils.ts                    helper cn() (estructura shadcn/ui)
  data/notebook.ts                datos y resultados del notebook
  data/sections.ts                metadatos de las 9 secciones
  sections/                       una vista por sección + grafo de estados
```

El proyecto sigue la estructura de shadcn/ui (`components.json`, alias `@/`, `src/components/ui`) con Tailwind CSS v4.
Los gráficos usan [Recharts](https://recharts.org) e iconos de `lucide-react`.

## Fidelidad al notebook

- Rutas: BFS (vía *Analizar episodios IRA*), DFS (vía *Identificar brechas*), fuerza bruta (3 rutas simples) y
  A* (vía *Analizar defunciones neumonía*, costo didáctico 4).
- Regresión lineal ajustada con los primeros 27 meses sintéticos: `y = 99.609 − 0.776 · mes`.
- Métricas en los 9 meses de prueba: MAE 1.40, RMSE 1.75, R² 0.602. La aplicación las recalcula a partir de la serie
  y coinciden con las del notebook.
- Hill Climbing se presenta como demostración independiente (converge a [0.7, 0.3]).

## Cambios sobre el WorksWheel original

Ver el comentario al inicio de `src/components/ui/works-wheel.tsx`. En resumen: selección por toque corregida (el
puntero capturado impedía el `click` de las tarjetas), prop `onOpen`, método `goTo`, tamaños adaptados a móvil, anillo
acotado al escenario y atajos de teclado extra.

## Publicar en GitHub Pages

1. Sube el proyecto a un repositorio de GitHub (rama `main`).
2. En el repositorio: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Cada `push` a `main` ejecuta `.github/workflows/deploy.yml` y publica el sitio en
   `https://TU_USUARIO.github.io/NOMBRE_DEL_REPO/`.
