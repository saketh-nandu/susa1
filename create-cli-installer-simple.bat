@echo off
echo ========================================
echo Creating SUSA CLI Installer
echo ========================================

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
echo VIProductVersion "1.0.0.0"
echo VIAddVersionKey "ProductName" "SUSA CLI"
echo VIAddVersionKey "FileVersion" "1.0.0.0"
echo VIAddVersionKey "ProductVersion" "1.0.0.0"
echo VIAddVersionKey "LegalCopyright" "© 2026 SUSA Team"
echo VIAddVersionKey "FileDescription" "SUSA Programming Language - Command Line Interface"
echo.
echo Section "SUSA CLI (Required)" SecCLI
echo   SectionIn RO
echo   SetOutPath "$INSTDIR"
echo   File /r "SUSA-CLI-Package\*.*"
echo   CreateDirectory "$SMPROGRAMS\SUSA CLI"
echo   CreateShortcut "$SMPROGRAMS\SUSA CLI\SUSA CLI.lnk" "cmd.exe" '/k cd /d "$INSTDIR" ^&^& susa-cli.bat'
echo   CreateShortcut "$SMPROGRAMS\SUSA CLI\Examples.lnk" "$INSTDIR\examples"
echo   WriteUninstaller "$INSTDIR\Uninstall.exe"
echo   WriteRegStr HKLM "Software\SUSA-CLI" "InstallDir" "$INSTDIR"
echo   WriteRegStr HKLM "Software\SUSA-CLI" "Version" "1.0.0"
echo   WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\SUSA-CLI" "DisplayName" "SUSA CLI"
echo   WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\SUSA-CLI" "UninstallString" "$INSTDIR\Uninstall.exe"
echo   WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\SUSA-CLI" "DisplayIcon" "$INSTDIR\susa.exe"
echo   WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\SUSA-CLI" "Publisher" "SUSA Team"
echo   WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\SUSA-CLI" "DisplayVersion" "1.0.0"
echo   WriteRegDWORD HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\SUSA-CLI" "EstimatedSize" 1024
echo SectionEnd
echo.
echo Section "Add to PATH" SecPATH
echo   ; Read current PATH
echo   ReadRegStr $0 HKLM "SYSTEM\CurrentControlSet\Control\Session Manager\Environment" "Path"
echo   ; Add CLI directory to PATH
echo   StrCpy $1 "$INSTDIR"
echo   StrCpy $2 "$0;$1"
echo   WriteRegExpandStr HKLM "SYSTEM\CurrentControlSet\Control\Session Manager\Environment" "Path" "$2"
echo   ; Broadcast change
echo   SendMessage ${HWND_BROADCAST} ${WM_WININICHANGE} 0 "STR:Environment" /TIMEOUT=5000
echo SectionEnd
echo.
echo Section "Desktop Shortcut" SecShortcut
echo   CreateShortcut "$DESKTOP\SUSA CLI.lnk" "cmd.exe" '/k cd /d "$INSTDIR" ^&^& susa-cli.bat'
echo SectionEnd
echo.
echo !insertmacro MUI_FUNCTION_DESCRIPTION_BEGIN
echo   !insertmacro MUI_DESCRIPTION_TEXT ${SecCLI} "SUSA command-line compiler and interpreter with all modules (Required)"
echo   !insertmacro MUI_DESCRIPTION_TEXT ${SecPATH} "Add SUSA to system PATH for easy command-line access from anywhere"
echo   !insertmacro MUI_DESCRIPTION_TEXT ${SecShortcut} "Create desktop shortcut for quick access"
echo !insertmacro MUI_FUNCTION_DESCRIPTION_END
echo.
echo Section "Uninstall"
echo   ; Remove from PATH
echo   ReadRegStr $0 HKLM "SYSTEM\CurrentControlSet\Control\Session Manager\Environment" "Path"
echo   StrCpy $1 "$INSTDIR"
echo   Push "$0"
echo   Push "$1"
echo   Call un.RemoveFromPath
echo   Pop $2
echo   WriteRegExpandStr HKLM "SYSTEM\CurrentControlSet\Control\Session Manager\Environment" "Path" "$2"
echo   SendMessage ${HWND_BROADCAST} ${WM_WININICHANGE} 0 "STR:Environment" /TIMEOUT=5000
echo   ; Remove files
echo   RMDir /r "$INSTDIR"
echo   ; Remove shortcuts
echo   Delete "$DESKTOP\SUSA CLI.lnk"
echo   Delete "$SMPROGRAMS\SUSA CLI\SUSA CLI.lnk"
echo   Delete "$SMPROGRAMS\SUSA CLI\Examples.lnk"
echo   RMDir "$SMPROGRAMS\SUSA CLI"
echo   ; Remove registry keys
echo   DeleteRegKey HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\SUSA-CLI"
echo   DeleteRegKey HKLM "Software\SUSA-CLI"
echo SectionEnd
echo.
echo ; Function to remove from PATH
echo Function un.RemoveFromPath
echo   Exch $0 ; path to remove
echo   Exch
echo   Exch $1 ; current PATH
echo   Push $2
echo   Push $3
echo   StrCpy $2 "$1;"
echo   StrCpy $3 ""
echo   loop:
echo     StrCmp $2 "" done
echo     StrCpy $1 $2 "" 1
echo     StrCpy $1 $1 -1
echo     StrCpy $2 $2 1
echo     StrCmp $2 ";" 0 +3
echo       StrCmp $1 $0 +2
echo         StrCpy $3 "$3$1;"
echo     Goto loop
echo   done:
echo   StrCpy $0 $3
echo   StrCpy $0 $0 -1
echo   Pop $3
echo   Pop $2
echo   Pop $1
echo   Exch $0
echo FunctionEnd
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
    
    echo.
    echo ✓ CLI Installer created successfully!
) else (
    echo.
    echo ERROR: Failed to create installer!
    pause
    exit /b 1
)

echo.
