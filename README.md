# Penteon App

Construi esta aplicacion con Next.js 15 y React Query para practicar como combino datos de dos APIs publicas: [Cat Facts](https://catfact.ninja/) y [Random User](https://randomuser.me/). El objetivo es mostrar curiosidades felinas junto con perfiles generados aleatoriamente, todo con una experiencia de scroll infinito.

## Demo y codigo
- Produccion: desplegare la app en Vercel.
- Repositorio: [github.com/edervalois88/penteon-app-2](https://github.com/edervalois88/penteon-app-2)

## Caracteristicas principales
- Renderizado con la App Router de Next.js y fuentes Geist configuradas a nivel de layout.
- React Query para cargar paginas de datos con `useInfiniteQuery`.
- Componentes cliente documentados en primera persona para explicar mi razonamiento.
- TailwindCSS 4 (version canary) para estilos utilitarios.

## Requisitos
- Node.js 18.18 o superior (recomiendo la LTS mas reciente).
- npm v9+ (incluido con Node).

## Como ejecutar en local
```bash
npm install
npm run dev
```
Luego visito [http://localhost:3000](http://localhost:3000) para explorar la interfaz.

## Comandos utiles
- `npm run dev`: servidor de desarrollo.
- `npm run build`: build de produccion (ver nota de errores).
- `npm run start`: servidor de produccion local despues del build.
- `npm run lint`: analisis estatico con ESLint.

## Variables de entorno
Actualmente no necesito variables de entorno. Si decido agregar servicios privados mas adelante, documentare los nombres abajo.

## Despliegue en Vercel
Este poryeto esta publicado en Vercel en la siguiente liga: 

https://penteon-app-2.vercel.app/

## Errores que observe
- **Advertencia de hidratacion en desarrollo:** aparecio cuando tenia extensiones como LanguageTool instaladas. Estas extensiones inyectan atributos (`data-lt-installed`, `bis_skin_checked`) y rompen la hidratacion. Solucion: probar en una ventana limpia o desactivar las extensiones.

## Proximos pasos a evaluar

- Anadir pruebas automaticas para las funciones que mezclan datos de ambas APIs.
- Incorporar manejo de errores mas granular (por ejemplo, mensajes diferenciados para cada API).
- Evaluar un modo offline usando el cache de React Query.
