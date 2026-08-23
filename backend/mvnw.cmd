@REM ----------------------------------------------------------------------------
@REM Maven Wrapper startup batch script
@REM Downloads Maven 3.9.6 automatically on first run if not cached.
@REM ----------------------------------------------------------------------------
@echo off
setlocal enabledelayedexpansion

SET MAVEN_VERSION=3.9.6
SET MAVEN_DIST_URL=https://repo.maven.apache.org/maven2/org/apache/maven/apache-maven/%MAVEN_VERSION%/apache-maven-%MAVEN_VERSION%-bin.zip
SET MAVEN_HOME=%~dp0.mvn\wrapper\dists\apache-maven-%MAVEN_VERSION%
SET MAVEN_CMD=%MAVEN_HOME%\bin\mvn.cmd
SET MAVEN_ZIP=%~dp0.mvn\wrapper\dists\apache-maven-%MAVEN_VERSION%-bin.zip

@REM Check if Maven is already downloaded and cached
IF EXIST "%MAVEN_CMD%" GOTO :RUN_MAVEN

echo [mvnw] Maven %MAVEN_VERSION% not found. Downloading...
echo [mvnw] Target: %MAVEN_HOME%

@REM Create dists directory
IF NOT EXIST "%~dp0.mvn\wrapper\dists" (
    mkdir "%~dp0.mvn\wrapper\dists"
)

@REM Download Maven zip using PowerShell
powershell -Command "& { [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; $ProgressPreference='SilentlyContinue'; Invoke-WebRequest -Uri '%MAVEN_DIST_URL%' -OutFile '%MAVEN_ZIP%' }"
IF ERRORLEVEL 1 (
    echo [mvnw] ERROR: Failed to download Maven. Check your internet connection.
    exit /b 1
)
echo [mvnw] Download complete. Extracting...

@REM Extract zip using PowerShell
powershell -Command "Expand-Archive -Path '%MAVEN_ZIP%' -DestinationPath '%~dp0.mvn\wrapper\dists' -Force"
IF ERRORLEVEL 1 (
    echo [mvnw] ERROR: Failed to extract Maven.
    exit /b 1
)

@REM Clean up zip
del /F /Q "%MAVEN_ZIP%" 2>nul

echo [mvnw] Maven %MAVEN_VERSION% ready at %MAVEN_HOME%

:RUN_MAVEN
"%MAVEN_CMD%" %*
