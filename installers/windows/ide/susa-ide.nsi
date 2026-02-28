; SUSA Programming Language - IDE Installer
; Professional NSIS installer script
; Version: 1.0.0

!define PRODUCT_NAME "SUSA IDE"
!define PRODUCT_VERSION "1.0.0"
!define PRODUCT_PUBLISHER "SUSA Labs"
!define PRODUCT_WEB_SITE "https://susastudio.online"
!define PRODUCT_DIR_REGKEY "Software\Microsoft\Windows\CurrentVersion\App Paths\SUSA IDE.exe"
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
!define MUI_COMPONENTSPAGE_NODESC
!insertmacro MUI_PAGE_COMPONENTS

; Instfiles page
!insertmacro MUI_PAGE_INSTFILES

; Finish page
!define MUI_FINISHPAGE_RUN "$INSTDIR\SUSA IDE.exe"
!define MUI_FINISHPAGE_RUN_TEXT "Launch SUSA IDE"
!insertmacro MUI_PAGE_FINISH

; Uninstaller pages
!insertmacro MUI_UNPAGE_CONFIRM
!insertmacro MUI_UNPAGE_INSTFILES
!insertmacro MUI_UNPAGE_FINISH

; Language
!insertmacro MUI_LANGUAGE "English"

; Installer details
Name "${PRODUCT_NAME} ${PRODUCT_VERSION}"
OutFile "susa-ide-${PRODUCT_VERSION}-windows.exe"
InstallDir "$PROGRAMFILES64\SUSA IDE"
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
  ; Kill any running SUSA IDE processes
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

; Main installation section
Section "SUSA IDE Application" SEC01
  SectionIn RO
  SetOutPath "$INSTDIR"
  SetOverwrite on
  
  ; Copy IDE files from electron build
  File /r "..\..\..\susa-ide\remix-of-susa-studio-ide-main\dist-electron\win-unpacked\*.*"
  
  ; Copy license
  File /oname=LICENSE.txt "..\..\..\LICENSE"
  
  SetOutPath "$INSTDIR"
SectionEnd

; Desktop shortcut section
Section "Create Desktop Shortcut" SEC02
  SectionIn 1
  CreateShortCut "$DESKTOP\SUSA IDE.lnk" "$INSTDIR\SUSA IDE.exe" "" "$INSTDIR\SUSA IDE.exe" 0
SectionEnd

; Start Menu shortcuts section
Section "Create Start Menu Shortcuts" SEC03
  SectionIn 1
  CreateDirectory "$SMPROGRAMS\SUSA"
  CreateShortCut "$SMPROGRAMS\SUSA\SUSA IDE.lnk" "$INSTDIR\SUSA IDE.exe"
  CreateShortCut "$SMPROGRAMS\SUSA\Uninstall SUSA IDE.lnk" "$INSTDIR\uninstall.exe"
SectionEnd

; File associations section
Section "Associate .susa files" SEC04
  ; Register .susa file extension
  WriteRegStr HKCR ".susa" "" "SUSAFile"
  WriteRegStr HKCR "SUSAFile" "" "SUSA Source File"
  WriteRegStr HKCR "SUSAFile\DefaultIcon" "" "$INSTDIR\SUSA IDE.exe,0"
  WriteRegStr HKCR "SUSAFile\shell\open\command" "" '"$INSTDIR\SUSA IDE.exe" "%1"'
  
  ; Notify shell of changes
  System::Call 'shell32.dll::SHChangeNotify(i, i, i, i) v (0x08000000, 0, 0, 0)'
SectionEnd

; Post-installation
Section -Post
  WriteUninstaller "$INSTDIR\uninstall.exe"
  WriteRegStr HKLM "${PRODUCT_DIR_REGKEY}" "" "$INSTDIR\SUSA IDE.exe"
  WriteRegStr ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "DisplayName" "$(^Name)"
  WriteRegStr ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "UninstallString" "$INSTDIR\uninstall.exe"
  WriteRegStr ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "DisplayIcon" "$INSTDIR\SUSA IDE.exe"
  WriteRegStr ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "DisplayVersion" "${PRODUCT_VERSION}"
  WriteRegStr ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "URLInfoAbout" "${PRODUCT_WEB_SITE}"
  WriteRegStr ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "Publisher" "${PRODUCT_PUBLISHER}"
  
  ; Get installed size
  ${GetSize} "$INSTDIR" "/S=0K" $0 $1 $2
  IntFmt $0 "0x%08X" $0
  WriteRegDWORD ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "EstimatedSize" "$0"
SectionEnd

; Uninstaller initialization
Function un.onInit
  MessageBox MB_ICONQUESTION|MB_YESNO|MB_DEFBUTTON2 "Are you sure you want to completely remove $(^Name) and all of its components?" IDYES +2
  Abort
  
  ; Kill any running SUSA IDE processes
  nsExec::ExecToLog 'taskkill /F /IM "SUSA IDE.exe" /T'
  Pop $0
FunctionEnd

; Uninstaller section
Section Uninstall
  ; Remove files and directories
  RMDir /r "$INSTDIR"
  
  ; Remove shortcuts
  Delete "$DESKTOP\SUSA IDE.lnk"
  Delete "$SMPROGRAMS\SUSA\SUSA IDE.lnk"
  Delete "$SMPROGRAMS\SUSA\Uninstall SUSA IDE.lnk"
  RMDir "$SMPROGRAMS\SUSA"
  
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
  !insertmacro MUI_DESCRIPTION_TEXT ${SEC01} "SUSA IDE application files (required)"
  !insertmacro MUI_DESCRIPTION_TEXT ${SEC02} "Create a shortcut on the desktop"
  !insertmacro MUI_DESCRIPTION_TEXT ${SEC03} "Create shortcuts in Start Menu"
  !insertmacro MUI_DESCRIPTION_TEXT ${SEC04} "Open .susa files with SUSA IDE by default"
!insertmacro MUI_FUNCTION_DESCRIPTION_END
