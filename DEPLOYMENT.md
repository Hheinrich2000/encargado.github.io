# GitHub Pages Deployment Guide

## Configuración completada

Este repositorio ha sido configurado para despliegue automático en GitHub Pages. Los siguientes cambios se han realizado:

### 1. **Configuración de Vite**
- Se agregó `base: "/"` en `vite.config.ts` para asegurar que los assets se carguen correctamente en GitHub Pages.
- Se configuró la salida de build al directorio `dist`.

### 2. **Archivo .nojekyll**
- Se creó el archivo `.nojekyll` en la raíz para indicarle a GitHub Pages que no procese el sitio con Jekyll.

### 3. **Gestión de dependencias**
- Se eliminó `package-lock.json` para evitar conflictos con `bun.lockb`.
- Usa `npm install` para instalar dependencias (recomendado para CI/CD).

### 4. **Workflow de GitHub Actions**
- Se creó `.github/workflows/deploy.yml` que:
  - Instala dependencias con npm
  - Compila el proyecto con Vite
  - Despliega automáticamente a GitHub Pages en cada push a `main`

### 5. **.gitignore actualizado**
- El directorio `dist` ahora es tracked para el deployment de GitHub Pages.

## Pasos para habilitar GitHub Pages

1. Ve a **Settings** → **Pages** en tu repositorio de GitHub
2. Selecciona **Deploy from a branch**
3. Elige la rama **gh-pages** y la carpeta root
4. Haz clic en **Save**

GitHub Actions creará automáticamente la rama `gh-pages` en el primer deployment.

## Comandos locales

```bash
# Instalar dependencias
npm install

# Desarrollar localmente
npm run dev

# Compilar para producción
npm run build

# Vista previa de la compilación
npm preview
```

## Estado del deployment

El sitio se desplegará automáticamente en:
- `https://hheinrich2000.github.io/`

(Si el repositorio tuviera otro nombre, sería: `https://hheinrich2000.github.io/nombre-repo/`)
