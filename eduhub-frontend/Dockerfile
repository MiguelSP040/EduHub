# Etapa 1: Construcción de la aplicación
FROM node:20-alpine AS build

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos necesarios para instalar dependencias
COPY package.json package-lock.json ./

# Instala las dependencias
RUN npm install

# Copia el resto del código fuente al contenedor
COPY . .

# Construye la aplicación para producción
RUN npm run build

# Etapa 2: Servir la aplicación con Express.js
FROM node:20-alpine

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos construidos y el servidor
COPY --from=build /app/dist ./dist
COPY server.js .

# Instala solo las dependencias de producción
COPY package.json package-lock.json ./
RUN npm install --production

# Expone el puerto 3000
EXPOSE 3000

# Comando para iniciar el servidor
CMD ["node", "server.js"]