# Etapa 1: Construcción del proyecto
FROM maven:3.9.4-eclipse-temurin-17 AS build
WORKDIR /app

# Copiar el archivo pom.xml y descargar las dependencias
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copiar el código fuente y compilar el proyecto
COPY src ./src
RUN mvn clean package -DskipTests

# Etapa 2: Imagen final para ejecutar la aplicación
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app

# Copiar el archivo WAR generado desde la etapa de construcción
COPY --from=build /app/target/EduHub-0.0.1-SNAPSHOT.war /app/EduHub.war

# Exponer el puerto en el que se ejecutará la aplicación
EXPOSE 8080

# Comando para ejecutar la aplicación
ENTRYPOINT ["java", "-jar", "/app/EduHub.war"]