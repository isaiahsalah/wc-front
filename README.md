# PlastSYS - Frontend

#### Versión actual: 0.282

Software [PlastSYS](http://192.0.0.4:5174) desarrollado en principio para la gestión de producción de expandido, pero con potencial para ser usado en cualquier area. Actualmente instalado en el servidor 192.0.0.4

## Herramientas usadas

- Visual Studio Code
- Serve
- Github

## Tecnologias usadas

- ReactJS
- Typescript
- ShadCN
- Recharts
- Tailwind
- Tanstack

Las demas librerias menores las puede encontrar en el package.json

## Instalación para desarrollo

1. **Clonación de reporitorio**

   ```bash
   git clone "cambiar-por-el-url-repositorio"
   cd "cambiar-por-el-nombre-repositorio"
   ```

1. **Instalación de dependencias**

   ```bash
   npm i
   ```

1. **Arranque de app**
   ```bash
   npm run dev
   ```

## Instalación para producción

1. **Clonación de reporitorio**

   ```bash
   git clone "cambiar-por-el-url-repositorio"
   cd "cambiar-por-el-nombre-repositorio"
   ```

1. **Instalación de dependencias**

   ```bash
   npm i
   ```

1. **Construcción de app**
   ```bash
   npm run build
   ```
1. **Crea el .env**
   1. Crea un archivo .env en la raiz del proyecto
   2. Abre el archivo .env en un editor de texto y agrega las siguientes líneas
      ```bash
      VITE_API_URL="cambiar-por-el-backend-host"
      ```
1. **Puesta en marcha con serve**
   ```bash
   npm install -g serve
   serve -s build
   ```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    "react-x": reactX,
    "react-dom": reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs["recommended-typescript"].rules,
    ...reactDom.configs.recommended.rules,
  },
});
```
