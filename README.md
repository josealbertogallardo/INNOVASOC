# INNOVASOC · Web del grupo de investigación

Web del **Grupo de Investigación en Innovación Socioeducativa (INNOVASOC)**.

Sitio estático (HTML + CSS + JavaScript, sin dependencias ni compilación), preparado para publicarse con GitHub Pages.

## Estructura

```
index.html            Página principal
robots.txt            Reglas para rastreadores (efectivo solo con dominio propio)
sitemap.xml           Mapa del sitio
llms.txt              Resumen para buscadores de IA / LLMs
llms-full.txt         Versión extendida con el volcado de publicaciones
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

## SEO e indexación

### Qué hay preparado

| Archivo | Para qué sirve |
|---|---|
| `index.html` (`<head>`) | `title`, `meta description`, `robots`, `canonical`, `hreflang`, Open Graph, Twitter Card, `theme-color`, iconos y datos estructurados JSON-LD (`ResearchOrganization` con miembros y ORCID, `WebSite`, `WebPage`) |
| `index.html` (sección Publicaciones) | `<noscript>` que remite a `llms-full.txt`, porque el listado se pinta con JavaScript |
| `robots.txt` | Permite explícitamente a buscadores (Googlebot, Bingbot) y a rastreadores de IA (GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-SearchBot, PerplexityBot, Google-Extended, Applebot-Extended, CCBot) e indica el sitemap |
| `sitemap.xml` | URL de la página principal con su fecha de última modificación |
| `llms.txt` | Resumen del grupo para modelos de lenguaje (formato [llmstxt.org](https://llmstxt.org/)) |
| `llms-full.txt` | Versión extendida: líneas, equipo con ORCID, redes, contacto y volcado de las publicaciones |
| `assets/img/og-image.png` | Imagen 1200×630 para compartir en redes |
| `assets/img/favicon-48.png`, `favicon-192.png`, `apple-touch-icon.png` | Iconos cuadrados (el `favicon.png` original es una lámina con cuatro variantes y no sirve como icono) |

### Aviso sobre `robots.txt` en GitHub Pages

Los rastreadores solo leen `robots.txt` en la **raíz del dominio**. Mientras la web esté publicada como sitio de proyecto en `https://josealbertogallardo.github.io/INNOVASOC/`, el archivo queda en `/INNOVASOC/robots.txt` y **no tiene efecto**: el que cuenta sería `https://josealbertogallardo.github.io/robots.txt`, que pertenece al repositorio de usuario `josealbertogallardo.github.io` (si no existe, se rastrea todo). No hace falta hacer nada ahora; el archivo está listo para cuando haya dominio propio. Por la misma razón, el sitemap hay que **enviarlo a mano** en Search Console y Bing (ver abajo).

### Pasos que tiene que hacer el responsable de la web

1. **Google Search Console** (https://search.google.com/search-console): añadir una propiedad de tipo *Prefijo de URL* con `https://josealbertogallardo.github.io/INNOVASOC/`. Verificarla con **etiqueta HTML**: copiar el `<meta name="google-site-verification" ...>` que da Google y pegarlo en `index.html`, en el comentario marcado como *"Verificación de buscadores"* dentro del `<head>` (también vale el método de *archivo HTML*: subir el archivo `googleXXXX.html` a la raíz del repositorio). Publicar (`git push`) y pulsar *Verificar*.
2. En Search Console → *Sitemaps*, enviar `https://josealbertogallardo.github.io/INNOVASOC/sitemap.xml`. Después, en *Inspección de URLs*, inspeccionar la página principal y pulsar *Solicitar indexación*.
3. **Bing Webmaster Tools** (https://www.bing.com/webmasters): lo más rápido es *Importar desde Google Search Console*. Si no, añadir el sitio y verificarlo con el `<meta name="msvalidate.01" ...>` (mismo lugar del `<head>`) o con el archivo `BingSiteAuth.xml` en la raíz. Enviar el mismo sitemap. Bing alimenta también a varios buscadores de IA.
4. Comprobar los datos estructurados con https://search.google.com/test/rich-results y https://validator.schema.org/ pegando la URL publicada.
5. Cada vez que cambie el contenido de forma relevante, actualizar `<lastmod>` en `sitemap.xml` y `dateModified` en el JSON-LD de `index.html`. Si se añaden publicaciones a `assets/js/publicaciones.js`, regenerar `llms-full.txt` (es un volcado con fecha) con `powershell -ExecutionPolicy Bypass -File scripts\build-llms-full.ps1` (la cabecera fija está en `scripts/llms-full-head.md`).

### Migrar a dominio propio

La URL base `https://josealbertogallardo.github.io/INNOVASOC/` está escrita, siempre igual, en estos archivos:

- `index.html`: `canonical`, `hreflang`, `og:url`, `og:image`, `twitter:image` y todos los `@id`/`url` del JSON-LD.
- `sitemap.xml`: `<loc>` e `<image:loc>`.
- `robots.txt`: línea `Sitemap:`.
- `llms.txt` y `llms-full.txt`: enlaces a la web.

Basta con buscar y reemplazar esa cadena por la nueva URL (terminada en `/`). Por ejemplo, en PowerShell desde la carpeta del proyecto:

```powershell
$old = 'https://josealbertogallardo.github.io/INNOVASOC/'
$new = 'https://www.ejemplo.es/'
foreach ($f in 'index.html','sitemap.xml','robots.txt','llms.txt','llms-full.txt') {
  $t = [IO.File]::ReadAllText($f); [IO.File]::WriteAllText($f, $t.Replace($old, $new))
}
```

Después:

1. Configurar el dominio en GitHub (Settings → Pages → *Custom domain*, que crea el archivo `CNAME`) y los registros DNS que indica GitHub; activar *Enforce HTTPS*.
2. Con el dominio en la raíz, `robots.txt` y `llms.txt` pasan a ser efectivos en `https://dominio/robots.txt` y `https://dominio/llms.txt`.
3. Dar de alta el nuevo dominio en Search Console (mejor como propiedad de *Dominio*, verificada por DNS) y en Bing, y enviar de nuevo el sitemap. GitHub Pages redirige automáticamente (301) la URL antigua al dominio propio, lo que basta para que Google traslade la indexación (la herramienta *Cambio de dirección* de Search Console solo admite propiedades de raíz de dominio, así que no se puede usar desde `github.io/INNOVASOC/`).
4. Pedir a la UPO y a los perfiles de los miembros que actualicen el enlace a la web.
