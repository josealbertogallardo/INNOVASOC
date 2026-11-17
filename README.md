# INNOVASOC · Web del grupo de investigación

Web del **Grupo de Investigación en Innovación Socioeducativa (INNOVASOC)**.

Sitio estático (HTML + CSS + JavaScript, sin dependencias ni compilación), preparado para publicarse con GitHub Pages.

## Estructura

```
index.html            Página principal
assets/css/styles.css Estilos (paleta y tipografías del grupo)
assets/js/main.js     Scripts (menú móvil, etc.)
assets/img/           Imágenes optimizadas para la web
logos/                Material original de identidad visual y entidades colaboradoras
CONTENIDO WEB.docx    Textos de partida para la web
```

## Identidad visual

| Color          | Hex       | Uso          |
|----------------|-----------|--------------|
| Verde azulado  | `#1C8C88` | principal    |
| Petróleo       | `#0E4A4C` | fondos       |
| Tinta          | `#12343B` | textos       |
| Ámbar          | `#F2A33A` | acento       |
| Bruma          | `#E3F2F1` | fondo claro  |

Tipografías: **Sora Bold** (títulos) y **Manrope** (textos y menús), cargadas desde Google Fonts.

## Trabajar en local

Basta con abrir `index.html` en el navegador. Para un servidor local:

```bash
python -m http.server 8000
```

y abrir http://localhost:8000

## Publicar

Con GitHub Pages activado (Settings → Pages → rama `main`, carpeta `/`), cada `git push` actualiza la web.
