; SUSA Complete Setup Installer
; Includes both IDE and CLI with PATH configuration

!include "MUI2.nsh"

; Installer settings
Name "SUSA Complete Setup"
OutFile "..\..\Output\SUSA-Complete-Setup-1.0.0.exe"
InstallDir "$PROGRAMFILES64\SUSA"
InstallDirRegKey HKLM "Software\SUSA" "InstallDir"
RequestExecutionLevel admin

; Modern UI Configuration
!define MUI_ICON "public\susa-logo.ico"
!define MUI_UNICON "public\susa-logo.ico"
!define MUI_HEADERIMAGE
!define MUI_HEADERIMAGE_BITMAP "public\susa-logo.png"
!define MUI_WELCOMEFINISHPAGE_BITMAP "public\susa-logo.png"
!define MUI_ABORTWARNING

; Pages
!insertmacro MUI_PAGE_WELCOME
!insertmacro MUI_PAGE_LICENSE "..\..\LICENSE"
!insertmacro MUI_PAGE_COMPONENTS
!insertmacro MUI_PAGE_DIRECTORY
!insertmacro MUI_PAGE_INSTFILES
!insertmacro MUI_PAGE_FINISH

!insertmacro MUI_UNPAGE_CONFIRM
!insertmacro MUI_UNPAGE_INSTFILES

; Languages
!insertmacro MUI_LANGUAGE "English"

; Version Information
VIProductVersion "1.0.0.0"
VIAddVersionKey "ProductName" "SUSA Complete Setup"
VIAddVersionKey "CompanyName" "SUSA Team"
VIAddVersionKey "FileDescription" "SUSA Programming Language - Complete Installation"
VIAddVersionKey "FileVersion" "1.0.0.0"
VIAddVersionKey "ProductVersion" "1.0.0.0"
VIAddVersionKey "LegalCopyright" "© 2026 SUSA Team"

; Sections
Section "SUSA IDE (Required)" SecIDE
  SectionIn RO
  
  SetOutPath "$INSTDIR"
  
  ; Copy IDE files from dist-electron\win-unpacked
  File /r "dist-electron\win-unpacked\*.*"
  
  ; Create shortcuts
  CreateDirectory "$SMPROGRAMS\SUSA"
  CreateShortcut "$SMPROGRAMS\SUSA\SUSA IDE.lnk" "$INSTDIR\SUSA IDE.exe"
  CreateShortcut "$DESKTOP\SUSA IDE.lnk" "$INSTDIR\SUSA IDE.exe"
  
  ; Write registry keys
  WriteRegStr HKLM "Software\SUSA" "InstallDir" "$INSTDIR"
  WriteRegStr HKLM "Software\SUSA" "Version" "1.0.0"
  
  ; Create uninstaller
  WriteUninstaller "$INSTDIR\Uninstall.exe"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\SUSA" "DisplayName" "SUSA Complete Setup"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\SUSA" "UninstallString" "$INSTDIR\Uninstall.exe"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\SUSA" "DisplayIcon" "$INSTDIR\SUSA IDE.exe"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\SUSA" "Publisher" "SUSA Team"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\SUSA" "DisplayVersion" "1.0.0"
  WriteRegDWORD HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\SUSA" "EstimatedSize" 106496
  
SectionEnd

Section "SUSA CLI" SecCLI
  SetOutPath "$INSTDIR\cli"
  
  ; Copy CLI files
  File "..\..\susa-cpp.exe"
  
  ; Copy modules
  SetOutPath "$INSTDIR\cli\modules"
  File /r "..\..\modules\*.*"
  
  ; Copy examples
  SetOutPath "$INSTDIR\cli\examples"
  File /r "..\..\examples\*.*"
  
  ; Create CLI batch wrapper
  SetOutPath "$INSTDIR\cli"
  FileOpen $0 "$INSTDIR\cli\susa.bat" w
  FileWrite $0 "@echo off$\r$\n"
  FileWrite $0 'set SUSA_HOME=%~dp0$\r$\n'
  FileWrite $0 '"%SUSA_HOME%susa-cpp.exe" %*$\r$\n'
  FileClose $0
  
  ; Create shortcuts for CLI
  CreateShortcut "$SMPROGRAMS\SUSA\SUSA CLI.lnk" "$INSTDIR\cli\susa.bat"
  
SectionEnd

Section "Add to PATH" SecPATH
  ; Add CLI directory to PATH using registry
  ReadRegStr $0 HKLM "SYSTEM\CurrentControlSet\Control\Session Manager\Environment" "Path"
  StrCpy $1 "$INSTDIR\cli"
  
  ; Check if already in PATH
  ${StrContains} $2 "$1" "$0"
  StrCmp $2 "" 0 +3
    ; Not in PATH, add it
    WriteRegExpandStr HKLM "SYSTEM\CurrentControlSet\Control\Session Manager\Environment" "Path" "$0;$1"
    SendMessage ${HWND_BROADCAST} ${WM_WININICHANGE} 0 "STR:Environment" /TIMEOUT=5000
  
SectionEnd

Section "Desktop Shortcuts" SecShortcuts
  ; Already created in SecIDE
SectionEnd

; Section Descriptions
!insertmacro MUI_FUNCTION_DESCRIPTION_BEGIN
  !insertmacro MUI_DESCRIPTION_TEXT ${SecIDE} "SUSA IDE with Monaco editor, debugger, and live execution (Required)"
  !insertmacro MUI_DESCRIPTION_TEXT ${SecCLI} "Command-line SUSA compiler and interpreter with all modules"
  !insertmacro MUI_DESCRIPTION_TEXT ${SecPATH} "Add SUSA CLI to system PATH for easy command-line access"
  !insertmacro MUI_DESCRIPTION_TEXT ${SecShortcuts} "Create desktop and start menu shortcuts"
!insertmacro MUI_FUNCTION_DESCRIPTION_END

; Uninstaller
Section "Uninstall"
  ; Remove from PATH
  ReadRegStr $0 HKLM "SYSTEM\CurrentControlSet\Control\Session Manager\Environment" "Path"
  StrCpy $1 "$INSTDIR\cli"
  ${StrRep} $2 $0 ";$1" ""
  ${StrRep} $3 $2 "$1;" ""
  ${StrRep} $4 $3 "$1" ""
  WriteRegExpandStr HKLM "SYSTEM\CurrentControlSet\Control\Session Manager\Environment" "Path" "$4"
  SendMessage ${HWND_BROADCAST} ${WM_WININICHANGE} 0 "STR:Environment" /TIMEOUT=5000
  
  ; Remove files
  RMDir /r "$INSTDIR"
  
  ; Remove shortcuts
  Delete "$DESKTOP\SUSA IDE.lnk"
  Delete "$SMPROGRAMS\SUSA\SUSA IDE.lnk"
  Delete "$SMPROGRAMS\SUSA\SUSA CLI.lnk"
  RMDir "$SMPROGRAMS\SUSA"
  
  ; Remove registry keys
  DeleteRegKey HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\SUSA"
  DeleteRegKey HKLM "Software\SUSA"
  
SectionEnd
