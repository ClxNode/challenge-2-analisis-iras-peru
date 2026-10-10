# 🫁 IRAs en menores de 5 años | Perú

**Challenge 2 · Fundamentos de Machine Learning · UPCH**

Un proyecto que combina análisis epidemiológico, algoritmos de búsqueda y una demostración de regresión lineal para explorar la evolución de las Infecciones Respiratorias Agudas (IRAs).

## 📊 El caso en números

| Indicador | 2023 | 2024 | 2025 |
|---|---:|---:|---:|
| Episodios de IRA | 1 003 178 | 883 959 | 824 978 |
| Defunciones por neumonía | 113 | 82 | 51 |

Las cifras proceden de la infografía proporcionada para el caso. Muestran una disminución durante el periodo observado, pero no explican por sí solas sus causas.

## 🚀 ¿Qué vamos a mostrar?

- **Datos y gráficos:** comparación de episodios de IRA y defunciones entre 2023 y 2025.
- **Espacio de estados:** grafo con estados, transiciones, restricciones y objetivo.
- **Algoritmos de búsqueda:** BFS, DFS, fuerza bruta y A*, comparando las rutas obtenidas. Hill Climbing se presenta como demostración independiente.
- **Regresión lineal:** entrenamiento, predicciones, métricas y gráfico interpretativo con una serie sintética.
- **Conclusiones:** qué muestran los resultados y cuáles son las limitaciones.

## 🧰 Herramientas utilizadas

| Herramienta | Uso |
|---|---|
| **Google Colab + Python** | Ejecutar el notebook y los algoritmos. |
| **NumPy / scikit-learn** | Datos sintéticos, regresión lineal y métricas. |
| **Matplotlib / NetworkX** | Gráficos y grafo del espacio de estados. |
| **React + TypeScript + Vite** | Presentación web interactiva. |
| **Tailwind CSS** | Estilos de la interfaz. |
| **GitHub + GitHub Pages + Actions** | Control de versiones y publicación de la web. |

## 🤖 ¿Qué hace el modelo?

La regresión lineal demuestra el flujo básico de Machine Learning: datos → entrenamiento → predicción → evaluación. **La serie utilizada es sintética; el modelo no predice casos reales de IRA en el Perú.**

Los costos utilizados por A* son didácticos y no representan costos sanitarios reales. El espacio de estados es una propuesta académica, no un protocolo oficial del MINSA.

## ▶️ Cómo ejecutar

**Notebook:** abrir el archivo `.ipynb` en [Google Colab](https://drive.google.com/file/d/1-4engxnSvRuyiOzl_RCPbHVmmpszVMm9/view?usp=sharing) y seleccionar **Entorno de ejecución → Ejecutar todas**.

**Página web (React/Vite):**
```bash
npm install
npm run dev
```
Abrir en el navegador la URL local que indique la terminal.

**Sitio publicado:** [Ver presentación en GitHub Pages](https://clxnode.github.io/challenge-2-analisis-iras-peru/)

## 📚 Referencias

- Infografía del caso de IRAs proporcionada para el Challenge 1.
- Materiales de clase UPCH: sesiones 3–7 (búsqueda, tipos de aprendizaje y regresión).
- [Google Colab](https://colab.research.google.com/) · [scikit-learn](https://scikit-learn.org/stable/) · [GitHub Pages](https://docs.github.com/pages)

---
*Proyecto académico. Los datos sintéticos se identifican como tales y no deben interpretarse como registros oficiales.*
