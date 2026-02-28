; SUSA Programming Language - Complete Installer (CLI + IDE)
; Professional NSIS installer script
; Version: 1.0.0

!define PRODUCT_NAME "SUSA Complete"
!define PRODUCT_VERSION "1.0.0"
!define PRODUCT_PUBLISHER "SUSA Labs"
!define PRODUCT_WEB_SITE "https://susastudio.online"
!define PRODUCT_DIR_REGKEY "Software\Microsoft\Windows\CurrentVersion\App Paths\susa.exe"
!define PRODUCT_UNINST_KEY "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}"
!define PRODUCT_UNINST_ROOT_KEY "HKLM"

; MUI Settings
!include "MUI2.nsh"
!include "FileFunc.nsh"

; MUI Settings - Modern UI
!define MUI_ABORTWARNING
!define MUI_ICON "${NSISDIR}\Contrib\Graphics\Icons\modern-install-blue.ico"
!define MUI_UNICON "${NSISDIR}\Contrib\Graphics\Icons\modern-uninstall-blue.ico"

; Welcome page with side image
!define MUI_WELCOMEFINISHPAGE_BITMAP "..\..\..\susa-side-panel.png"
!define MUI_UNWELCOMEFINISHPAGE_BITMAP "..\..\..\susa-side-panel.png"

; Header image
!define MUI_HEADERIMAGE
!define MUI_HEADERIMAGE_BITMAP "${NSISDIR}\Contrib\Graphics\Header\nsis3-metro.bmp"
!define MUI_HEADERIMAGE_RIGHT

; Welcome page
!insertmacro MUI_PAGE_WELCOME

; License page
!insertmacro MUI_PAGE_LICENSE "..\..\..\LICENSE"

; Directory page
!insertmacro MUI_PAGE_DIRECTORY

; Components page
!insertmacro MUI_PAGE_COMPONENTS

; Instfiles page
!insertmacro MUI_PAGE_INSTFILES

; Finish page
!define MUI_FINISHPAGE_RUN "$INSTDIR\IDE\SUSA IDE.exe"
!define MUI_FINISHPAGE_RUN_TEXT "Launch SUSA IDE"
!define MUI_FINISHPAGE_SHOWREADME
!define MUI_FINISHPAGE_SHOWREADME_TEXT "Open terminal and run 'susa --version'"
!define MUI_FINISHPAGE_SHOWREADME_FUNCTION "LaunchTerminal"
!insertmacro MUI_PAGE_FINISH

; Uninstaller pages
!insertmacro MUI_UNPAGE_CONFIRM
!insertmacro MUI_UNPAGE_INSTFILES
!insertmacro MUI_UNPAGE_FINISH

; Language
!insertmacro MUI_LANGUAGE "English"

; Installer details
Name "${PRODUCT_NAME} ${PRODUCT_VERSION}"
OutFile "susa-complete-${PRODUCT_VERSION}-windows.exe"
InstallDir "$PROGRAMFILES64\SUSA"
InstallDirRegKey HKLM "${PRODUCT_DIR_REGKEY}" ""
ShowInstDetails show
ShowUnInstDetails show
RequestExecutionLevel admin

; Version Information
VIProductVersion "1.0.0.0"
VIAddVersionKey "ProductName" "${PRODUCT_NAME}"
VIAddVersionKey "CompanyName" "${PRODUCT_PUBLISHER}"
VIAddVersionKey "LegalCopyright" "© 2026 ${PRODUCT_PUBLISHER}"
VIAddVersionKey "FileDescription" "${PRODUCT_NAME} Installer"
VIAddVersionKey "FileVersion" "${PRODUCT_VERSION}"
VIAddVersionKey "ProductVersion" "${PRODUCT_VERSION}"

; Installer initialization
Function .onInit
  ; Kill any running SUSA processes
  nsExec::ExecToLog 'taskkill /F /IM susa.exe /T'
  nsExec::ExecToLog 'taskkill /F /IM "SUSA IDE.exe" /T'
  Pop $0
  
  ; Check for existing installation
  ReadRegStr $R0 ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "UninstallString"
  StrCmp $R0 "" done
  
  MessageBox MB_OKCANCEL|MB_ICONEXCLAMATION \
  "${PRODUCT_NAME} is already installed. $\n$\nClick 'OK' to remove the previous version or 'Cancel' to cancel this upgrade." \
  IDOK uninst
  Abort
  
uninst:
  ClearErrors
  ExecWait '$R0 /S _?=$INSTDIR'
  
done:
FunctionEnd

; CLI installation section
Section "SUSA CLI Compiler" SEC01
  SectionIn RO
  SetOutPath "$INSTDIR"
  SetOverwrite on
  
  ; Copy CLI binary
  File "..\..\..\cpp-core\susa.exe"
  
  ; Copy license
  File /oname=LICENSE.txt "..\..\..\LICENSE"
  
  ; Copy examples
  SetOutPath "$INSTDIR\examples"
  File /r "..\..\..\examples\*.susa"
  
  ; Copy modules
  SetOutPath "$INSTDIR\modules"
  File /r "..\..\..\modules\*.susa"
  File "..\..\..\modules\MODULE_REGISTRY.json"
  
  SetOutPath "$INSTDIR"
SectionEnd

; IDE installation section
Section "SUSA Desktop IDE" SEC02
  SectionIn RO
  SetOutPath "$INSTDIR\IDE"
  SetOverwrite on
  
  ; Copy IDE files from electron build
  File /r "..\..\..\susa-ide\remix-of-susa-studio-ide-main\dist-electron\win-unpacked\*.*"
  
  SetOutPath "$INSTDIR"
SectionEnd

; Add to PATH section
Section "Add SUSA to PATH" SEC03
  SectionIn 1
  
  ; Add to system PATH
  EnVar::SetHKLM
  EnVar::AddValue "PATH" "$INSTDIR"
  Pop $0
  DetailPrint "Added SUSA to PATH: $0"
SectionEnd

; Desktop shortcuts section
Section "Create Desktop Shortcuts" SEC04
  SectionIn 1
  CreateShortCut "$DESKTOP\SUSA IDE.lnk" "$INSTDIR\IDE\SUSA IDE.exe" "" "$INSTDIR\IDE\SUSA IDE.exe" 0
  CreateShortCut "$DESKTOP\SUSA CLI.lnk" "cmd.exe" '/k "cd /d $INSTDIR && susa.exe --version"'
SectionEnd

; Start Menu shortcuts section
Section "Create Start Menu Shortcuts" SEC05
  SectionIn 1
  CreateDirectory "$SMPROGRAMS\SUSA"
  CreateShortCut "$SMPROGRAMS\SUSA\SUSA IDE.lnk" "$INSTDIR\IDE\SUSA IDE.exe"
  CreateShortCut "$SMPROGRAMS\SUSA\SUSA CLI.lnk" "cmd.exe" '/k "cd /d $INSTDIR && susa.exe --version"'
  CreateShortCut "$SMPROGRAMS\SUSA\Uninstall SUSA.lnk" "$INSTDIR\uninstall.exe"
SectionEnd

; File associations section
Section "Associate .susa files" SEC06
  ; Register .susa file extension
  WriteRegStr HKCR ".susa" "" "SUSAFile"
  WriteRegStr HKCR "SUSAFile" "" "SUSA Source File"
  WriteRegStr HKCR "SUSAFile\DefaultIcon" "" "$INSTDIR\IDE\SUSA IDE.exe,0"
  WriteRegStr HKCR "SUSAFile\shell\open\command" "" '"$INSTDIR\IDE\SUSA IDE.exe" "%1"'
  WriteRegStr HKCR "SUSAFile\shell\compile" "" "Compile with SUSA"
  WriteRegStr HKCR "SUSAFile\shell\compile\command" "" '"$INSTDIR\susa.exe" "%1"'
  
  ; Notify shell of changes
  System::Call 'shell32.dll::SHChangeNotify(i, i, i, i) v (0x08000000, 0, 0, 0)'
SectionEnd

; Post-installation
Section -Post
  WriteUninstaller "$INSTDIR\uninstall.exe"
  WriteRegStr HKLM "${PRODUCT_DIR_REGKEY}" "" "$INSTDIR\susa.exe"
  WriteRegStr ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "DisplayName" "$(^Name)"
  WriteRegStr ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "UninstallString" "$INSTDIR\uninstall.exe"
  WriteRegStr ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "DisplayIcon" "$INSTDIR\susa.exe"
  WriteRegStr ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "DisplayVersion" "${PRODUCT_VERSION}"
  WriteRegStr ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "URLInfoAbout" "${PRODUCT_WEB_SITE}"
  WriteRegStr ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "Publisher" "${PRODUCT_PUBLISHER}"
  
  ; Get installed size
  ${GetSize} "$INSTDIR" "/S=0K" $0 $1 $2
  IntFmt $0 "0x%08X" $0
  WriteRegDWORD ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "EstimatedSize" "$0"
SectionEnd

; Launch terminal function
Function LaunchTerminal
  ExecShell "open" "cmd.exe" '/k "cd /d $INSTDIR && susa.exe --version"'
FunctionEnd

; Uninstaller initialization
Function un.onInit
  MessageBox MB_ICONQUESTION|MB_YESNO|MB_DEFBUTTON2 "Are you sure you want to completely remove $(^Name) and all of its components?" IDYES +2
  Abort
  
  ; Kill any running SUSA processes
  nsExec::ExecToLog 'taskkill /F /IM susa.exe /T'
  nsExec::ExecToLog 'taskkill /F /IM "SUSA IDE.exe" /T'
  Pop $0
FunctionEnd

; Uninstaller section
Section Uninstall
  ; Remove files and directories
  Delete "$INSTDIR\susa.exe"
  Delete "$INSTDIR\LICENSE.txt"
  Delete "$INSTDIR\uninstall.exe"
  RMDir /r "$INSTDIR\examples"
  RMDir /r "$INSTDIR\modules"
  RMDir /r "$INSTDIR\IDE"
  RMDir "$INSTDIR"
  
  ; Remove shortcuts
  Delete "$DESKTOP\SUSA IDE.lnk"
  Delete "$DESKTOP\SUSA CLI.lnk"
  Delete "$SMPROGRAMS\SUSA\SUSA IDE.lnk"
  Delete "$SMPROGRAMS\SUSA\SUSA CLI.lnk"
  Delete "$SMPROGRAMS\SUSA\Uninstall SUSA.lnk"
  RMDir "$SMPROGRAMS\SUSA"
  
  ; Remove from PATH
  EnVar::SetHKLM
  EnVar::DeleteValue "PATH" "$INSTDIR"
  Pop $0
  
  ; Remove file associations
  DeleteRegKey HKCR ".susa"
  DeleteRegKey HKCR "SUSAFile"
  
  ; Notify shell of changes
  System::Call 'shell32.dll::SHChangeNotify(i, i, i, i) v (0x08000000, 0, 0, 0)'
  
  ; Remove registry keys
  DeleteRegKey ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}"
  DeleteRegKey HKLM "${PRODUCT_DIR_REGKEY}"
  
  SetAutoClose true
SectionEnd

; Section descriptions
!insertmacro MUI_FUNCTION_DESCRIPTION_BEGIN
  !insertmacro MUI_DESCRIPTION_TEXT ${SEC01} "SUSA compiler and CLI tools (required)"
  !insertmacro MUI_DESCRIPTION_TEXT ${SEC02} "SUSA Desktop IDE application (required)"
  !insertmacro MUI_DESCRIPTION_TEXT ${SEC03} "Add SUSA to system PATH for command-line access"
  !insertmacro MUI_DESCRIPTION_TEXT ${SEC04} "Create shortcuts on the desktop"
  !insertmacro MUI_DESCRIPTION_TEXT ${SEC05} "Create shortcuts in Start Menu"
  !insertmacro MUI_DESCRIPTION_TEXT ${SEC06} "Open .susa files with SUSA IDE by default"
!insertmacro MUI_FUNCTION_DESCRIPTION_END
