# Use an official OpenJDK runtime as a parent image
FROM eclipse-temurin:21-jdk-alpine

# Set the working directory in the container
WORKDIR /app

# Copy the application's jar file to the container
COPY target/email-writer-sb-0.0.1-SNAPSHOT.jar app.jar

# Make port 8080 available to the world outside this container
EXPOSE 8080

# Run the jar file
ENTRYPOINT ["java", "-jar", "app.jar"]
