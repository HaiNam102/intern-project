@echo off
echo Testing Chat Message Service startup...
cd microservice-example\chat-message
echo Building the project...
mvn clean compile
if %errorlevel% neq 0 (
    echo ❌ Build failed
    pause
    exit /b 1
)
echo ✅ Build successful
echo.
echo Starting the service...
mvn spring-boot:run
pause 