@echo off
cd /d %~dp0

REM 检查是否已经在运行
tasklist /v | findstr /i "crm-sjv-app.jar" >nul
if %errorlevel%==0 (
    echo crm-sjv-app.jar is already running.
    goto end
)

REM 后台启动应用
start /min javaw -jar crm-sjv-app.jar --spring.profiles.active=prod

echo Started crm-sjv-app.jar

:end