@echo off
echo ========================================
echo Creating SUSA Complete Setup Installer
echo ========================================

REM Check if NSIS is installed
where makensis >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: NSIS not found!
    echo Please install NSIS from https://nsis.sourceforge.io/
    echo Or use Scoop: scoop install nsis
    pause
    exit /b 1
)

REM Check if IDE is built
if not exist "susa-ide\remix-of-susa-studio-ide-main\dist-electron\win-unpacked" (
    echo ERROR: IDE not built!
    echo Please run: cd susa-ide\remix-of-susa-studio-ide-main && npm run dist:win
    pause
    exit /b 1
)

REM Create temporary directory for complete installer
echo Creating temporary directory...
if exist "temp-complete-installer" rmdir /s /q "temp-complete-installer"
mkdir "temp-complete-installer"

REM Copy IDE files
echo Copying IDE files...
xcopy "susa-ide\remix-of-susa-studio-ide-main\dist-electron\win-unpacked" "temp-complete-installer\ide\" /E /I /Y /Q

REM Copy CLI files
echo Copying CLI files...
mkdir "temp-complete-installer\cli"
copy "susa-cpp.exe" "temp-complete-installer\cli\susa-cpp.exe" >nul
xcopy "modules" "temp-complete-installer\cli\modules\" /E /I /Y /Q
xcopy "examples" "temp-complete-installer\cli\examples\" /E /I /Y /Q

REM Create CLI batch wrapper
echo Creating CLI wrapper...
(
echo @echo off
echo set SUSA_HOME=%%~dp0
echo "%%SUSA_HOME%%susa-cpp.exe" %%*
) > "temp-complete-installer\cli\susa.bat"

REM Create NSIS script
echo Creating NSIS installer script...
(
echo ; SUSA Complete Setup - Auto-generated
echo !include "MUI2.nsh"
echo.
echo Name "SUSA Complete Setup"
echo OutFile "Output\SUSA-Complete-Setup-1.0.0.exe"
echo InstallDir "$PROGRAMFILES64\SUSA"
echo RequestExecutionLevel admin
echo.
echo !define MUI_ICON "susa logo.ico"
echo !define MUI_UNICON "susa logo.ico"
echo !define MUI_ABORTWARNING
echo.
echo !insertmacro MUI_PAGE_WELCOME
echo !insertmacro MUI_PAGE_LICENSE "LICENSE"
echo !insertmacro MUI_PAGE_COMPONENTS
echo !insertmacro MUI_PAGE_DIRECTORY
echo !insertmacro MUI_PAGE_INSTFILES
echo !insertmacro MUI_PAGE_FINISH
echo.
echo !insertmacro MUI_UNPAGE_CONFIRM
echo !insertmacro MUI_UNPAGE_INSTFILES
echo.
echo !insertmacro MUI_LANGUAGE "English"
echo.
echo Section "SUSA IDE (Required)" SecIDE
echo   SectionIn RO
echo   SetOutPath "$INSTDIR"
echo   File /r "temp-complete-installer\ide\*.*"
echo   CreateDirectory "$SMPROGRAMS\SUSA"
echo   CreateShortcut "$SMPROGRAMS\SUSA\SUSA IDE.lnk" "$INSTDIR\SUSA IDE.exe"
echo   CreateShortcut "$DESKTOP\SUSA IDE.lnk" "$INSTDIR\SUSA IDE.exe"
echo   WriteUninstaller "$INSTDIR\Uninstall.exe"
echo   WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\SUSA" "DisplayName" "SUSA Complete Setup"
echo   WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\SUSA" "UninstallString" "$INSTDIR\Uninstall.exe"
echo   WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\SUSA" "DisplayIcon" "$INSTDIR\SUSA IDE.exe"
echo   WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\SUSA" "Publisher" "SUSA Team"
echo   WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\SUSA" "DisplayVersion" "1.0.0"
echo SectionEnd
echo.
echo Section "SUSA CLI" SecCLI
echo   SetOutPath "$INSTDIR\cli"
echo   File /r "temp-complete-installer\cli\*.*"
echo   CreateShortcut "$SMPROGRAMS\SUSA\SUSA CLI.lnk" "cmd.exe" '/k "$INSTDIR\cli\susa.bat"'
echo SectionEnd
echo.
echo Section "Add CLI to PATH" SecPATH
echo   nsExec::ExecToLog 'setx PATH "$INSTDIR\cli;%PATH%"'
echo SectionEnd
echo.
echo !insertmacro MUI_FUNCTION_DESCRIPTION_BEGIN
echo   !insertmacro MUI_DESCRIPTION_TEXT ${SecIDE} "SUSA IDE with Monaco editor and debugger (Required)"
echo   !insertmacro MUI_DESCRIPTION_TEXT ${SecCLI} "Command-line SUSA compiler with all modules"
echo   !insertmacro MUI_DESCRIPTION_TEXT ${SecPATH} "Add SUSA CLI to system PATH"
echo !insertmacro MUI_FUNCTION_DESCRIPTION_END
echo.
echo Section "Uninstall"
echo   RMDir /r "$INSTDIR"
echo   Delete "$DESKTOP\SUSA IDE.lnk"
echo   Delete "$SMPROGRAMS\SUSA\SUSA IDE.lnk"
echo   Delete "$SMPROGRAMS\SUSA\SUSA CLI.lnk"
echo   RMDir "$SMPROGRAMS\SUSA"
echo   DeleteRegKey HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\SUSA"
echo SectionEnd
) > "temp-complete-installer.nsi"

REM Build installer
echo.
echo Building installer with NSIS...
makensis /V2 "temp-complete-installer.nsi"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo Complete Setup Installer Created!
    echo ========================================
    echo Location: Output\SUSA-Complete-Setup-1.0.0.exe
    dir "Output\SUSA-Complete-Setup-1.0.0.exe" | find "SUSA-Complete"
    
    REM Cleanup
    echo.
    echo Cleaning up temporary files...
    rmdir /s /q "temp-complete-installer"
    del "temp-complete-installer.nsi"
) else (
    echo.
    echo ERROR: Failed to create installer!
    pause
    exit /b 1
)

echo.
pause
