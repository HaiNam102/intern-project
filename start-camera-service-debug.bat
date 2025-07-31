@echo off
echo Starting Camera Service with debug logging...
cd microservice-example\camera-service
set SPRING_PROFILES_ACTIVE=dev
set LOGGING_LEVEL_COM_EXAMPLE_CAMERA_SERVICE=DEBUG
mvn spring-boot:run -Dspring-boot.run.jvmArguments="-Dlogging.level.com.example.camera_service=DEBUG"
pause 