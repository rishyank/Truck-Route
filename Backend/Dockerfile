# Use a base image with Java
FROM openjdk:17-jdk-slim

# Set the working directory
WORKDIR /app

# Copy the jar file (replace with your actual jar name)
COPY target/*.jar sse-0.0.1-SNAPSHOT.jar

# Expose the app port
EXPOSE 8085

# Run the jar file
ENTRYPOINT ["java", "-jar", "sse-0.0.1-SNAPSHOT.jar"]
