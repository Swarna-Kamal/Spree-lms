FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /workspace/app

# Copies files whether context is root or backend directory
COPY backend/mvnw backend/pom.xml ./
COPY backend/.mvn ./.mvn
COPY backend/src ./src

RUN chmod +x ./mvnw
RUN ./mvnw clean package -DskipTests

FROM eclipse-temurin:21-jre-alpine
VOLUME /tmp
WORKDIR /app
COPY --from=build /workspace/app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
