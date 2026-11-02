# Musicala Piano Lab - Himno a la alegría

Aplicativo educativo estático para enseñar **Himno a la alegría** en piano usando la guía previa de Musicala.

## Qué incluye

- **Paso a paso (por defecto):** 5 pasos — posición de cinco dedos, mano derecha, acordes de mano izquierda, unir manos y canción completa. Cada paso muestra solo lo que necesita.
- **Práctica libre:** elegir mano (derecha, acorde izquierdo, ambas, melodía con izquierda) y alcance (línea, bloque, canción), más la tabla guía y el plan de clase de 20 minutos.
- **Escuchar:** la app toca lo que se está practicando.
- **Toca conmigo:** cuenta 1-2-3-4, la app toca la *otra* mano y marca el pulso mientras ilumina cada nota a tiempo.
- **Reto:** la app espera cada nota y la verifica. Se puede responder con el piano en pantalla, el teclado del computador (A S D F G H J = Do…Si) o el **micrófono** tocando un piano real. Cada reto sin errores suma un punto; 3 puntos = línea dominada.
- **Mapa de la canción** por bloques con el progreso de cada línea (se guarda en el navegador).
- Tempo con presets (Lento, Medio, Original), metrónomo y repetición.
- Piano visual con colores de la paleta Musicala y el número de dedo sobre cada tecla.

## Paleta Musicala

Azul Mozart `#0C41C4` (acorde Sol) · Violeta Beethoven `#680DBF` · Violeta Vivaldi `#5729FF` (melodía, acciones) · Magenta Brahms `#CE0071` (acorde Do, retos) · Blanco Debussy `#F9F9F9` · Gris Haydn `#E6E8E8`.

## Cómo usar

1. Abre `index.html` en un navegador moderno. Para usar el micrófono, sírvelo desde `https` o `localhost` (por ejemplo `python -m http.server`).
2. Sigue el modo **Paso a paso**: Escuchar → Toca conmigo → Reto.
3. Pasa de línea solo cuando tenga 3 puntos; sube el tempo cuando suene claro.

## Hosting

Puedes subir la carpeta completa a Firebase Hosting, GitHub Pages, Netlify, Vercel o cualquier hosting estático. No usa base de datos, ni login, ni dependencias externas obligatorias.

## Notas pedagógicas

- El aplicativo está pensado para clase inicial, no para edición académica de partitura.
- El foco es lectura por nombres de notas, digitación y coordinación básica entre manos.
- La melodía se trabaja por líneas para que el estudiante avance sin saturarse.
- En el Bloque B se usa digitación sugerida porque la guía base no la separa con el mismo detalle que las primeras frases.

## Archivos

- `index.html`: estructura del aplicativo.
- `styles.css`: estilos visuales Musicala.
- `app.js`: datos de la canción, audio WebAudio, piano visual y entrenador.
- `logo.png`: logo usado en la interfaz.
