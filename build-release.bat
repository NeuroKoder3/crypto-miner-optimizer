@echo off
REM ============================================================
REM Crypto Miner Optimizer - Release Build & Package Script
REM Run this from "x64 Native Tools Command Prompt for VS 2022"
REM ============================================================

setlocal

set QT_DIR=C:\Qt\6.10.1\msvc2022_64
set INNO_SETUP="C:\Program Files (x86)\Inno Setup 6\ISCC.exe"

echo.
echo ========================================
echo  Step 1: Building Web UI
echo ========================================
call npm install
call npm run build
if errorlevel 1 (
    echo ERROR: Web build failed!
    exit /b 1
)

echo.
echo ========================================
echo  Step 2: Building Qt Application
echo ========================================
if exist qt\build rmdir /s /q qt\build
cmake -S qt -B qt\build -G Ninja -DCMAKE_BUILD_TYPE=Release -DQt6_DIR="%QT_DIR%\lib\cmake\Qt6"
if errorlevel 1 (
    echo ERROR: CMake configure failed!
    exit /b 1
)

cmake --build qt\build --config Release
if errorlevel 1 (
    echo ERROR: Build failed!
    exit /b 1
)

echo.
echo ========================================
echo  Step 3: Deploying Qt Dependencies
echo ========================================
"%QT_DIR%\bin\windeployqt.exe" --release --no-translations qt\build\CryptoMinerOptimizer.exe
if errorlevel 1 (
    echo ERROR: windeployqt failed!
    exit /b 1
)

echo.
echo ========================================
echo  Step 4: Copying Web UI to Build
echo ========================================
if exist qt\build\web rmdir /s /q qt\build\web
xcopy dist qt\build\web /E /I /Y /Q

echo.
echo ========================================
echo  Step 5: Creating Installer
echo ========================================
if not exist %INNO_SETUP% (
    echo WARNING: Inno Setup not found at %INNO_SETUP%
    echo Install it with: winget install --id JRSoftware.InnoSetup -e
    echo Skipping installer creation...
    goto :done
)

if not exist dist-installer mkdir dist-installer
%INNO_SETUP% installer\CryptoMinerOptimizer.iss
if errorlevel 1 (
    echo ERROR: Installer creation failed!
    exit /b 1
)

:done
echo.
echo ========================================
echo  BUILD COMPLETE!
echo ========================================
echo.
echo Outputs:
echo   - Executable: qt\build\CryptoMinerOptimizer.exe
echo   - Installer:  dist-installer\CryptoMinerOptimizer-Setup-1.0.0.exe
echo.

endlocal
