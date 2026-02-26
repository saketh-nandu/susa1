@echo off
echo ========================================
echo Creating SUSA CLI Installer
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

REM Create CLI package if it doesn't exist
if not exist "SUSA-CLI-Package" (
    echo Creating CLI package...
    call create-cli-package.bat
)

REM Create NSIS script for CLI
echo Creating NSIS installer script...
(
echo ; SUSA CLI Only Installer
echo !include "MUI2.nsh"
echo.
echo Name "SUSA CLI"
echo OutFile "Output\SUSA-CLI-Only-1.0.0.exe"
echo InstallDir "$PROGRAMFILES64\SUSA-CLI"
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
echo Section "SUSA CLI (Required)" SecCLI
echo   SectionIn RO
echo   SetOutPath "$INSTDIR"
echo   File /r "SUSA-CLI-Package\*.*"
echo   CreateDirectory "$SMPROGRAMS\SUSA CLI"
echo   CreateShortcut "$SMPROGRAMS\SUSA CLI\SUSA CLI.lnk" "cmd.exe" '/k "$INSTDIR\susa-cli.bat"'
echo   CreateShortcut "$SMPROGRAMS\SUSA CLI\Examples.lnk" "$INSTDIR\examples"
echo   WriteUninstaller "$INSTDIR\Uninstall.exe"
echo   WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\SUSA-CLI" "DisplayName" "SUSA CLI"
echo   WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\SUSA-CLI" "UninstallString" "$INSTDIR\Uninstall.exe"
echo   WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\SUSA-CLI" "DisplayIcon" "$INSTDIR\susa.exe"
echo   WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\SUSA-CLI" "Publisher" "SUSA Team"
echo   WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\SUSA-CLI" "DisplayVersion" "1.0.0"
echo SectionEnd
echo.
echo Section "Add to PATH" SecPATH
echo   nsExec::ExecToLog 'setx PATH "$INSTDIR;%%PATH%%"'
echo SectionEnd
echo.
echo Section "Desktop Shortcut" SecShortcut
echo   CreateShortcut "$DESKTOP\SUSA CLI.lnk" "cmd.exe" '/k "$INSTDIR\susa-cli.bat"'
echo SectionEnd
echo.
echo !insertmacro MUI_FUNCTION_DESCRIPTION_BEGIN
echo   !insertmacro MUI_DESCRIPTION_TEXT ${SecCLI} "SUSA command-line compiler and interpreter (Required)"
echo   !insertmacro MUI_DESCRIPTION_TEXT ${SecPATH} "Add SUSA to system PATH for easy command-line access"
echo   !insertmacro MUI_DESCRIPTION_TEXT ${SecShortcut} "Create desktop shortcut"
echo !insertmacro MUI_FUNCTION_DESCRIPTION_END
echo.
echo Section "Uninstall"
echo   RMDir /r "$INSTDIR"
echo   Delete "$DESKTOP\SUSA CLI.lnk"
echo   Delete "$SMPROGRAMS\SUSA CLI\SUSA CLI.lnk"
echo   Delete "$SMPROGRAMS\SUSA CLI\Examples.lnk"
echo   RMDir "$SMPROGRAMS\SUSA CLI"
echo   DeleteRegKey HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\SUSA-CLI"
echo SectionEnd
) > "susa-cli-installer.nsi"

REM Build installer
echo.
echo Building installer with NSIS...
makensis /V2 "susa-cli-installer.nsi"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo CLI Installer Created!
    echo ========================================
    echo Location: Output\SUSA-CLI-Only-1.0.0.exe
    dir "Output\SUSA-CLI-Only-1.0.0.exe" | find "SUSA-CLI"
    
    REM Cleanup
    echo.
    echo Cleaning up...
    del "susa-cli-installer.nsi"
) else (
    echo.
    echo ERROR: Failed to create installer!
    pause
    exit /b 1
)

echo.
pause
