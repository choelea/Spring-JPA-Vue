@echo off
cd /d %~dp0

REM 查找对应 JAR 的 javaw 进程
for /f "tokens=2 delims=," %%i in ('tasklist /v /fo csv ^| findstr /i "crm-sjv-app.jar"') do (
    echo Stopping crm-sjv-app.jar (PID=%%i)...
    taskkill /F /PID %%i
    goto end
)

echo No running process found for crm-sjv-app.jar.

:end