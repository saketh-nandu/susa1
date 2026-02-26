@echo off
echo ========================================
echo Creating SUSA Complete Setup Installer
echo ========================================

REM Check if IDE is built
if not exist "susa-ide\remix-of-susa-studio-ide-main\dist-electron\win-unpacked" (
    echo ERROR: IDE not built!
    echo Please wait for the IDE build to complete first.
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
echo !define MUI_FINISHPAGE_RUN "$INSTDIR\SUSA IDE.exe"
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
echo VIAddVersionKey "ProductName" "SUSA Complete Setup"
echo VIAddVersionKey "FileVersion" "1.0.0.0"
echo VIAddVersionKey "ProductVersion" "1.0.0.0"
echo VIAddVersionKey "LegalCopyright" "© 2026 SUSA Team"
echo VIAddVersionKey "FileDescription" "SUSA Programming Language - Complete Installation"
echo.
echo Section "SUSA IDE (Required)" SecIDE
echo   SectionIn RO
echo   SetOutPath "$INSTDIR"
echo   File /r "temp-complete-installer\ide\*.*"
echo   CreateDirectory "$SMPROGRAMS\SUSA"
echo   CreateShortcut "$SMPROGRAMS\SUSA\SUSA IDE.lnk" "$INSTDIR\SUSA IDE.exe"
echo   CreateShortcut "$DESKTOP\SUSA IDE.lnk" "$INSTDIR\SUSA IDE.exe"
echo   WriteUninstaller "$INSTDIR\Uninstall.exe"
echo   WriteRegStr HKLM "Software\SUSA" "InstallDir" "$INSTDIR"
echo   WriteRegStr HKLM "Software\SUSA" "Version" "1.0.0"
echo   WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\SUSA" "DisplayName" "SUSA Complete Setup"
echo   WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\SUSA" "UninstallString" "$INSTDIR\Uninstall.exe"
echo   WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\SUSA" "DisplayIcon" "$INSTDIR\SUSA IDE.exe"
echo   WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\SUSA" "Publisher" "SUSA Team"
echo   WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\SUSA" "DisplayVersion" "1.0.0"
echo   WriteRegDWORD HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\SUSA" "EstimatedSize" 106496
echo SectionEnd
echo.
echo Section "SUSA CLI" SecCLI
echo   SetOutPath "$INSTDIR\cli"
echo   File /r "temp-complete-installer\cli\*.*"
echo   CreateShortcut "$SMPROGRAMS\SUSA\SUSA CLI.lnk" "cmd.exe" '/k cd /d "$INSTDIR\cli" ^&^& susa.bat'
echo   CreateShortcut "$SMPROGRAMS\SUSA\Examples.lnk" "$INSTDIR\cli\examples"
echo SectionEnd
echo.
echo Section "Add CLI to PATH" SecPATH
echo   ; Read current PATH
echo   ReadRegStr $0 HKLM "SYSTEM\CurrentControlSet\Control\Session Manager\Environment" "Path"
echo   ; Add CLI directory to PATH
echo   StrCpy $1 "$INSTDIR\cli"
echo   StrCpy $2 "$0;$1"
echo   WriteRegExpandStr HKLM "SYSTEM\CurrentControlSet\Control\Session Manager\Environment" "Path" "$2"
echo   ; Broadcast change
echo   SendMessage ${HWND_BROADCAST} ${WM_WININICHANGE} 0 "STR:Environment" /TIMEOUT=5000
echo SectionEnd
echo.
echo !insertmacro MUI_FUNCTION_DESCRIPTION_BEGIN
echo   !insertmacro MUI_DESCRIPTION_TEXT ${SecIDE} "SUSA IDE with Monaco editor, debugger, and live execution (Required)"
echo   !insertmacro MUI_DESCRIPTION_TEXT ${SecCLI} "Command-line SUSA compiler and interpreter with all modules and examples"
echo   !insertmacro MUI_DESCRIPTION_TEXT ${SecPATH} "Add SUSA CLI to system PATH for easy command-line access from anywhere"
echo !insertmacro MUI_FUNCTION_DESCRIPTION_END
echo.
echo Section "Uninstall"
echo   ; Remove from PATH
echo   ReadRegStr $0 HKLM "SYSTEM\CurrentControlSet\Control\Session Manager\Environment" "Path"
echo   StrCpy $1 "$INSTDIR\cli"
echo   Push "$0"
echo   Push "$1"
echo   Call un.RemoveFromPath
echo   Pop $2
echo   WriteRegExpandStr HKLM "SYSTEM\CurrentControlSet\Control\Session Manager\Environment" "Path" "$2"
echo   SendMessage ${HWND_BROADCAST} ${WM_WININICHANGE} 0 "STR:Environment" /TIMEOUT=5000
echo   ; Remove files
echo   RMDir /r "$INSTDIR"
echo   ; Remove shortcuts
echo   Delete "$DESKTOP\SUSA IDE.lnk"
echo   Delete "$SMPROGRAMS\SUSA\SUSA IDE.lnk"
echo   Delete "$SMPROGRAMS\SUSA\SUSA CLI.lnk"
echo   Delete "$SMPROGRAMS\SUSA\Examples.lnk"
echo   RMDir "$SMPROGRAMS\SUSA"
echo   ; Remove registry keys
echo   DeleteRegKey HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\SUSA"
echo   DeleteRegKey HKLM "Software\SUSA"
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
    
    echo.
    echo ✓ Complete Setup created successfully!
) else (
    echo.
    echo ERROR: Failed to create installer!
    pause
    exit /b 1
)

echo.
