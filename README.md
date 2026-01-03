# ImpostorZhin - Client (Frontend)

Interfaz de usuario para el juego ImpostorZhin, construida con React, Vite y Tailwind CSS.

## Requisitos Previos

- [Node.js](https://nodejs.org/) (versión 18 o superior)
- npm

## Instalación y Ejecución Local

1. Instala las dependencias:
   ```bash
   npm install
   ```

2. **Configuración de Variables de Entorno**:
   Crea un archivo `.env` en la raíz de esta carpeta (client) y añade la URL de tu backend local:
   ```env
   VITE_API_URL=http://localhost:3001
   ```

3. Ejecuta el cliente en modo desarrollo:
   ```bash
   npm run dev
   ```

4. Abre el juego en tu navegador siguiendo el link que indique la terminal (generalmente http://localhost:5173).

## Despliegue (Production)

Para desplegar en **Vercel** o **Netlify**:
- Directorio raíz: `client`
- Comando de build: `npm run build`
- Directorio de salida: `dist`
- **Variable de Entorno Obligatoria**: Debes configurar `VITE_API_URL` con la URL de tu servidor backend desplegado.
