@REM ----------------------------------------------------------------------------
@REM Licensed to the Apache Software Foundation (ASF) under one
@REM or more contributor license agreements.  See the NOTICE file
@REM distributed with this work for additional information
@REM regarding copyright ownership.  The ASF licenses this file
@REM to you under the Apache License, Version 2.0 (the
@REM "License"); you may not use this file except in compliance
@REM with the License.  You may obtain a copy of the License at
@REM
@REM    http://www.apache.org/licenses/LICENSE-2.0
@REM
@REM Unless required by applicable law or agreed to in writing,
@REM software distributed under the License is distributed on an
@REM "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
@REM KIND, either express or implied.  See the License for the
@REM specific language governing permissions and limitations
@REM under the License.
@REM ----------------------------------------------------------------------------

@REM ----------------------------------------------------------------------------
@REM Apache Maven Wrapper startup batch script, version 3.3.2
@REM
@REM Environment Variable Prerequisites:
@REM   JAVA_HOME       Must point at your Java Development Kit installation.
@REM
@REM   MAVEN_OPTS      (Optional) Java runtime options used when Maven is executed.
@REM ----------------------------------------------------------------------------

@IF "%MAVEN_BATCH_ECHO%"=="on" echo %MAVEN_BATCH_ECHO%
@echo off

@REM Set local scope
SETLOCAL

SET MAVEN_PROJECTBASEDIR=%~dp0

@REM Find JAVA_HOME
IF NOT "%JAVA_HOME%"=="" GOTO OkJHome
echo Error: JAVA_HOME not found in your environment. >&2
echo Please set the JAVA_HOME variable in your environment to match the >&2
echo location of your Java installation. >&2
GOTO error

:OkJHome
IF EXIST "%JAVA_HOME%\bin\java.exe" GOTO init
echo Error: JAVA_HOME is set to an invalid directory: "%JAVA_HOME%" >&2
GOTO error

:init

@REM Maven distribution config
SET MAVEN_VERSION=3.9.9
SET MAVEN_HOME=%USERPROFILE%\.m2\wrapper\dists\apache-maven-%MAVEN_VERSION%
SET MVN_CMD=%MAVEN_HOME%\bin\mvn.cmd

@REM Check if Maven is already downloaded
IF EXIST "%MVN_CMD%" GOTO runMaven

@REM Download and extract Maven
echo Maven not found at %MAVEN_HOME%, downloading...
SET DOWNLOAD_URL=https://repo.maven.apache.org/maven2/org/apache/maven/apache-maven/%MAVEN_VERSION%/apache-maven-%MAVEN_VERSION%-bin.zip
SET DOWNLOAD_DIR=%USERPROFILE%\.m2\wrapper\dists
SET DOWNLOAD_FILE=%DOWNLOAD_DIR%\apache-maven-%MAVEN_VERSION%-bin.zip

IF NOT EXIST "%DOWNLOAD_DIR%" mkdir "%DOWNLOAD_DIR%"

@REM Use PowerShell to download
echo Downloading from %DOWNLOAD_URL%...
powershell -Command "& { [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; Invoke-WebRequest -Uri '%DOWNLOAD_URL%' -OutFile '%DOWNLOAD_FILE%' }"
IF %ERRORLEVEL% NEQ 0 (
    echo Failed to download Maven distribution. >&2
    GOTO error
)

@REM Extract using PowerShell
echo Extracting Maven...
powershell -Command "& { Expand-Archive -Path '%DOWNLOAD_FILE%' -DestinationPath '%DOWNLOAD_DIR%' -Force }"
IF %ERRORLEVEL% NEQ 0 (
    echo Failed to extract Maven distribution. >&2
    GOTO error
)

@REM Rename extracted folder
IF EXIST "%DOWNLOAD_DIR%\apache-maven-%MAVEN_VERSION%" (
    IF EXIST "%MAVEN_HOME%" rmdir /S /Q "%MAVEN_HOME%"
    rename "%DOWNLOAD_DIR%\apache-maven-%MAVEN_VERSION%" "apache-maven-%MAVEN_VERSION%"
)

@REM Clean up zip
DEL /F /Q "%DOWNLOAD_FILE%" 2>NUL

@REM Verify
IF NOT EXIST "%MVN_CMD%" (
    echo Maven installation failed - mvn.cmd not found at %MVN_CMD% >&2
    GOTO error
)
echo Maven %MAVEN_VERSION% installed successfully.

:runMaven
SET MAVEN_CMD_LINE_ARGS=%*
"%MVN_CMD%" %MAVEN_CMD_LINE_ARGS%
IF %ERRORLEVEL% NEQ 0 GOTO error
GOTO end

:error
SET ERROR_CODE=1

:end
ENDLOCAL & EXIT /B %ERROR_CODE%
