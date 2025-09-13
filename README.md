# Formulario Filtro Propietarios — Despliegue en GitHub Pages

Sitio estático (HTML/CSS/JS) que envía los datos del formulario a un Web App de Google Apps Script, guarda en Google Sheets y notifica por email.

## Estructura
- `index.html`: página principal
- `css/style.css`: estilos (rutas relativas preparadas para Pages)
- `js/app.js`: lógica de envío y confirmación
- `assets/`: iconos SVG (WhatsApp, Instagram, TikTok)

## Configuración previa
- Endpoint Apps Script: edita `js/app.js` y confirma tu `ENDPOINT_URL` activo.
- Redes sociales (opcional): en `js/app.js` dentro de `renderConfirmation()` actualiza los enlaces si cambian.
- Apps Script: la implementación debe estar como “Aplicación web”, ejecutar como “Yo”, acceso “Cualquiera”. Acepta permisos.

## Despliegue en GitHub Pages (manual)
1) Crea un repositorio en GitHub (por ejemplo `formulario-filtro`).
2) En la carpeta del proyecto:
   - `git init`
   - `git add .`
   - `git commit -m "Initial deploy"`
   - `git branch -M main`
   - `git remote add origin https://github.com/TU_USUARIO/formulario-filtro.git`
   - `git push -u origin main`
3) Activa Pages: en GitHub → Repo → Settings → Pages → Build and deployment → Source: "Deploy from a branch" → Branch: `main` y carpeta `/ (root)` → Save.
4) Abre la URL que te muestra GitHub (algo como `https://TU_USUARIO.github.io/formulario-filtro/`).

## Despliegue con script
Puedes usar `deploy.sh` para automatizar commit + push:

- Uso: `bash deploy.sh TU_USUARIO formulario-filtro`
- Si ya tienes `origin` configurado, puedes invocarlo solo con `bash deploy.sh`.

## Dominio propio (opcional)
- En Settings → Pages añade tu dominio. GitHub creará un archivo `CNAME` en la raíz.
- En tu DNS apunta el CNAME a `TU_USUARIO.github.io`.

## Problemas comunes
- CSS/JS/Assets no cargan: asegúrate de que las rutas son relativas (ya están como `./css`, `./js`, `assets`/`../assets` según el archivo).
- Envío no llega a Sheets/Email: re‑implementa Apps Script, revisa permisos y que el endpoint de `js/app.js` sea el correcto.
- 404 tras activar Pages: espera 1–2 minutos a que GitHub construya y publique.

---

Si quieres, puedo añadir el archivo `CNAME` con tu dominio cuando lo tengas.
