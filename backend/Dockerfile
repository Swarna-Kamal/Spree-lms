FROM maven:3.9.9-eclipse-temurin-21-alpine AS build
WORKDIR /workspace/app

COPY pom.xml .
RUN mvn dependency:go-offline -B

COPY src src
RUN mvn clean package -DskipTests -B

FROM eclipse-temurin:21-jre-alpine
VOLUME /tmp
WORKDIR /app
COPY --from=build /workspace/app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
