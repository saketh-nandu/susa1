; SUSA Programming Language - Professional Windows Installer
; Modern UI 2 - Production Ready
; Version: 1.0.0

!define PRODUCT_NAME "SUSA Programming Language"
!define PRODUCT_VERSION "1.0.0"
!define PRODUCT_PUBLISHER "SUSA Development Team"
!define PRODUCT_WEB_SITE "https://github.com/yourusername/susa"
!define PRODUCT_DIR_REGKEY "Software\Microsoft\Windows\CurrentVersion\App Paths\susa.exe"
!define PRODUCT_UNINST_KEY "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}"
!define PRODUCT_UNINST_ROOT_KEY "HKLM"

; MUI 2.0 compatible
!include "MUI2.nsh"
!include "FileFunc.nsh"
!include "LogicLib.nsh"
!include "x64.nsh"

; Request application privileges for Windows Vista+
RequestExecutionLevel admin

; Installer settings
Name "${PRODUCT_NAME} ${PRODUCT_VERSION}"
OutFile "..\dist\SUSA-Setup.exe"
InstallDir "$PROGRAMFILES64\SUSA"
InstallDirRegKey HKLM "${PRODUCT_DIR_REGKEY}" ""
ShowInstDetails show
ShowUnInstDetails show

; Branding
BrandingText "${PRODUCT_NAME} Installer"

; Variables
Var StartMenuFolder
Var AddToPath
Var CreateDesktopShortcut

; MUI Settings
!define MUI_ABORTWARNING
!define MUI_ICON "assets\susa_icon.ico"
!define MUI_UNICON "assets\susa_icon.ico"
!define MUI_HEADERIMAGE
!define MUI_HEADERIMAGE_BITMAP "assets\susa_header.bmp"
!define MUI_WELCOMEFINISHPAGE_BITMAP "assets\susa_sidebar.bmp"
!define MUI_UNWELCOMEFINISHPAGE_BITMAP "assets\susa_sidebar.bmp"

; Welcome page
!insertmacro MUI_PAGE_WELCOME

; License page
!insertmacro MUI_PAGE_LICENSE "license.txt"

; Directory page
!insertmacro MUI_PAGE_DIRECTORY

; Components page
!insertmacro MUI_PAGE_COMPONENTS

; Start Menu Folder Page Configuration
!define MUI_STARTMENUPAGE_REGISTRY_ROOT "HKLM"
!define MUI_STARTMENUPAGE_REGISTRY_KEY "${PRODUCT_UNINST_KEY}"
!define MUI_STARTMENUPAGE_REGISTRY_VALUENAME "StartMenuFolder"
!define MUI_STARTMENUPAGE_DEFAULTFOLDER "SUSA"
!insertmacro MUI_PAGE_STARTMENU Application $StartMenuFolder

; Instfiles page
!insertmacro MUI_PAGE_INSTFILES

; Finish page
!define MUI_FINISHPAGE_RUN "$INSTDIR\ide\SUSA-IDE.exe"
!define MUI_FINISHPAGE_RUN_TEXT "Launch SUSA IDE"
!define MUI_FINISHPAGE_SHOWREADME ""
!define MUI_FINISHPAGE_SHOWREADME_TEXT "Open CLI Terminal"
!define MUI_FINISHPAGE_SHOWREADME_FUNCTION LaunchCLI
!insertmacro MUI_PAGE_FINISH

; Uninstaller pages
!insertmacro MUI_UNPAGE_CONFIRM
!insertmacro MUI_UNPAGE_INSTFILES
!insertmacro MUI_UNPAGE_FINISH

; Language files
!insertmacro MUI_LANGUAGE "English"

; Installer Sections
Section "SUSA CLI Compiler" SecCLI
  SectionIn RO  ; Required component
  
  SetOutPath "$INSTDIR\cli"
  SetOverwrite on
  
  File "..\cpp-core\build\Release\susa.exe"
  
  ; Create registry keys
  WriteRegStr HKLM "${PRODUCT_DIR_REGKEY}" "" "$INSTDIR\cli\susa.exe"
  
  DetailPrint "SUSA CLI Compiler installed successfully"
SectionEnd

Section "SUSA IDE" SecIDE
  SectionIn RO  ; Required component
  
  SetOutPath "$INSTDIR\ide"
  SetOverwrite on
  
  File /r "..\ide\dist\win-unpacked\*.*"
  
  DetailPrint "SUSA IDE installed successfully"
SectionEnd

Section /o "Add CLI to PATH" SecPath
  ; Add to system PATH
  Push "$INSTDIR\cli"
  Call AddToPath
  
  DetailPrint "Added SUSA CLI to system PATH"
SectionEnd

Section /o "Create Desktop Shortcut" SecDesktop
  CreateShortCut "$DESKTOP\SUSA IDE.lnk" "$INSTDIR\ide\SUSA-IDE.exe" "" "$INSTDIR\ide\SUSA-IDE.exe" 0
  
  DetailPrint "Desktop shortcut created"
SectionEnd

Section -AdditionalIcons
  !insertmacro MUI_STARTMENU_WRITE_BEGIN Application
  
  CreateDirectory "$SMPROGRAMS\$StartMenuFolder"
  CreateShortCut "$SMPROGRAMS\$StartMenuFolder\SUSA IDE.lnk" "$INSTDIR\ide\SUSA-IDE.exe"
  CreateShortCut "$SMPROGRAMS\$StartMenuFolder\SUSA CLI.lnk" "cmd.exe" '/k "$INSTDIR\cli\susa.exe --version"'
  CreateShortCut "$SMPROGRAMS\$StartMenuFolder\Uninstall SUSA.lnk" "$INSTDIR\uninst.exe"
  
  !insertmacro MUI_STARTMENU_WRITE_END
SectionEnd

Section -Post
  WriteUninstaller "$INSTDIR\uninst.exe"
  
  ; Registry entries for Add/Remove Programs
  WriteRegStr ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "DisplayName" "$(^Name)"
  WriteRegStr ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "UninstallString" "$INSTDIR\uninst.exe"
  WriteRegStr ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "DisplayIcon" "$INSTDIR\ide\SUSA-IDE.exe"
  WriteRegStr ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "DisplayVersion" "${PRODUCT_VERSION}"
  WriteRegStr ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "URLInfoAbout" "${PRODUCT_WEB_SITE}"
  WriteRegStr ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "Publisher" "${PRODUCT_PUBLISHER}"
  
  ; Calculate installed size
  ${GetSize} "$INSTDIR" "/S=0K" $0 $1 $2
  IntFmt $0 "0x%08X" $0
  WriteRegDWORD ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "EstimatedSize" "$0"
SectionEnd

; Section descriptions
!insertmacro MUI_FUNCTION_DESCRIPTION_BEGIN
  !insertmacro MUI_DESCRIPTION_TEXT ${SecCLI} "SUSA command-line compiler (cpp-core.exe). Required component."
  !insertmacro MUI_DESCRIPTION_TEXT ${SecIDE} "SUSA Integrated Development Environment. Required component."
  !insertmacro MUI_DESCRIPTION_TEXT ${SecPath} "Add SUSA CLI to system PATH for easy command-line access."
  !insertmacro MUI_DESCRIPTION_TEXT ${SecDesktop} "Create a desktop shortcut for quick access to SUSA IDE."
!insertmacro MUI_FUNCTION_DESCRIPTION_END

; Uninstaller Section
Section Uninstall
  ; Kill running processes
  DetailPrint "Checking for running SUSA processes..."
  Call un.KillSUSAProcesses
  
  ; Remove PATH entry
  Push "$INSTDIR\cli"
  Call un.RemoveFromPath
  
  ; Remove files and directories
  Delete "$INSTDIR\uninst.exe"
  RMDir /r "$INSTDIR\cli"
  RMDir /r "$INSTDIR\ide"
  RMDir "$INSTDIR"
  
  ; Remove shortcuts
  Delete "$DESKTOP\SUSA IDE.lnk"
  
  !insertmacro MUI_STARTMENU_GETFOLDER Application $StartMenuFolder
  Delete "$SMPROGRAMS\$StartMenuFolder\SUSA IDE.lnk"
  Delete "$SMPROGRAMS\$StartMenuFolder\SUSA CLI.lnk"
  Delete "$SMPROGRAMS\$StartMenuFolder\Uninstall SUSA.lnk"
  RMDir "$SMPROGRAMS\$StartMenuFolder"
  
  ; Remove registry keys
  DeleteRegKey ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}"
  DeleteRegKey HKLM "${PRODUCT_DIR_REGKEY}"
  
  SetAutoClose true
  
  DetailPrint "SUSA has been successfully uninstalled"
SectionEnd

; Functions

Function .onInit
  ; Check if already installed
  ReadRegStr $R0 ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "UninstallString"
  StrCmp $R0 "" done
  
  MessageBox MB_OKCANCEL|MB_ICONEXCLAMATION \
  "${PRODUCT_NAME} is already installed. $\n$\nClick 'OK' to remove the previous version or 'Cancel' to cancel this upgrade." \
  IDOK uninst
  Abort
  
uninst:
  ClearErrors
  ExecWait '$R0 _?=$INSTDIR'
  
done:
FunctionEnd

Function LaunchCLI
  ExecShell "open" "cmd.exe" '/k "cd /d $INSTDIR\cli && cpp-core.exe --version"'
FunctionEnd

; Add to PATH function
Function AddToPath
  Exch $0
  Push $1
  Push $2
  Push $3
  
  ; Read current PATH
  ReadRegStr $1 HKLM "SYSTEM\CurrentControlSet\Control\Session Manager\Environment" "Path"
  
  ; Check if already in PATH
  Push "$1;"
  Push "$0;"
  Call StrStr
  Pop $2
  StrCmp $2 "" 0 done
  
  ; Add to PATH
  StrCpy $2 "$1;$0"
  WriteRegExpandStr HKLM "SYSTEM\CurrentControlSet\Control\Session Manager\Environment" "Path" $2
  
  ; Broadcast WM_SETTINGCHANGE
  SendMessage ${HWND_BROADCAST} ${WM_WININICHANGE} 0 "STR:Environment" /TIMEOUT=5000
  
done:
  Pop $3
  Pop $2
  Pop $1
  Pop $0
FunctionEnd

; Remove from PATH function
Function un.RemoveFromPath
  Exch $0
  Push $1
  Push $2
  Push $3
  Push $4
  Push $5
  Push $6
  
  ReadRegStr $1 HKLM "SYSTEM\CurrentControlSet\Control\Session Manager\Environment" "Path"
  StrCpy $5 $1 1 -1
  StrCmp $5 ";" +2
  StrCpy $1 "$1;"
  
  Push $1
  Push "$0;"
  Call un.StrStr
  Pop $2
  StrCmp $2 "" done
  
  StrLen $3 "$0;"
  StrLen $4 $2
  StrCpy $5 $1 -$4
  StrCpy $6 $2 "" $3
  StrCpy $3 "$5$6"
  
  StrCpy $5 $3 1 -1
  StrCmp $5 ";" 0 +2
  StrCpy $3 $3 -1
  
  WriteRegExpandStr HKLM "SYSTEM\CurrentControlSet\Control\Session Manager\Environment" "Path" $3
  SendMessage ${HWND_BROADCAST} ${WM_WININICHANGE} 0 "STR:Environment" /TIMEOUT=5000
  
done:
  Pop $6
  Pop $5
  Pop $4
  Pop $3
  Pop $2
  Pop $1
  Pop $0
FunctionEnd

; Kill SUSA processes
Function un.KillSUSAProcesses
  nsExec::ExecToLog 'taskkill /F /IM susa.exe /T'
  nsExec::ExecToLog 'taskkill /F /IM SUSA-IDE.exe /T'
  Sleep 1000
FunctionEnd

; String search function
Function StrStr
  Exch $R1
  Exch
  Exch $R2
  Push $R3
  Push $R4
  Push $R5
  StrLen $R3 $R1
  StrCpy $R4 0
  loop:
    StrCpy $R5 $R2 $R3 $R4
    StrCmp $R5 $R1 done
    StrCmp $R5 "" done
    IntOp $R4 $R4 + 1
    Goto loop
  done:
    StrCpy $R1 $R2 "" $R4
    Pop $R5
    Pop $R4
    Pop $R3
    Pop $R2
    Exch $R1
FunctionEnd

Function un.StrStr
  Exch $R1
  Exch
  Exch $R2
  Push $R3
  Push $R4
  Push $R5
  StrLen $R3 $R1
  StrCpy $R4 0
  loop:
    StrCpy $R5 $R2 $R3 $R4
    StrCmp $R5 $R1 done
    StrCmp $R5 "" done
    IntOp $R4 $R4 + 1
    Goto loop
  done:
    StrCpy $R1 $R2 "" $R4
    Pop $R5
    Pop $R4
    Pop $R3
    Pop $R2
    Exch $R1
FunctionEnd
