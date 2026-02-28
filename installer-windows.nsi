; SUSA Programming Language Installer
; Windows NSIS Installer Script
; Version 1.0.0

!define PRODUCT_NAME "SUSA Programming Language"
!define PRODUCT_VERSION "1.0.0"
!define PRODUCT_PUBLISHER "SUSA Team"
!define PRODUCT_WEB_SITE "https://susastudio.online"
!define PRODUCT_DIR_REGKEY "Software\Microsoft\Windows\CurrentVersion\App Paths\susa.exe"
!define PRODUCT_UNINST_KEY "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}"
!define PRODUCT_UNINST_ROOT_KEY "HKLM"

; MUI Settings
!include "MUI2.nsh"
!include "EnvVarUpdate.nsh"
!include "x64.nsh"

; MUI Settings
!define MUI_ABORTWARNING
!define MUI_ICON "susa-logo.ico"
!define MUI_UNICON "susa-logo.ico"
!define MUI_HEADERIMAGE
!define MUI_HEADERIMAGE_BITMAP "susa-header.bmp"
!define MUI_WELCOMEFINISHPAGE_BITMAP "susa-welcome.bmp"

; Welcome page
!insertmacro MUI_PAGE_WELCOME

; License page
!define MUI_LICENSEPAGE_CHECKBOX
!insertmacro MUI_PAGE_LICENSE "LICENSE.txt"

; Directory page
!insertmacro MUI_PAGE_DIRECTORY

; Components page
!insertmacro MUI_PAGE_COMPONENTS

; Instfiles page
!insertmacro MUI_PAGE_INSTFILES

; Finish page
!define MUI_FINISHPAGE_RUN "$INSTDIR\susa.exe"
!define MUI_FINISHPAGE_SHOWREADME "$INSTDIR\README.txt"
!insertmacro MUI_PAGE_FINISH

; Uninstaller pages
!insertmacro MUI_UNPAGE_INSTFILES

; Language files
!insertmacro MUI_LANGUAGE "English"

; Installer attributes
Name "${PRODUCT_NAME} ${PRODUCT_VERSION}"
OutFile "SUSA-Setup-${PRODUCT_VERSION}.exe"
InstallDir "$PROGRAMFILES64\SUSA"
InstallDirRegKey HKLM "${PRODUCT_DIR_REGKEY}" ""
ShowInstDetails show
ShowUnInstDetails show
RequestExecutionLevel admin

; Version Information
VIProductVersion "1.0.0.0"
VIAddVersionKey "ProductName" "${PRODUCT_NAME}"
VIAddVersionKey "CompanyName" "${PRODUCT_PUBLISHER}"
VIAddVersionKey "LegalCopyright" "© 2026 SUSA Team. Licensed under MIT License."
VIAddVersionKey "FileDescription" "${PRODUCT_NAME} Installer"
VIAddVersionKey "FileVersion" "${PRODUCT_VERSION}"

Section "SUSA Core (Required)" SEC01
  SectionIn RO
  
  ; Kill any running SUSA processes
  DetailPrint "Checking for running SUSA processes..."
  nsExec::ExecToLog 'taskkill /F /IM susa.exe /T'
  nsExec::ExecToLog 'taskkill /F /IM susa-ide.exe /T'
  Sleep 1000
  
  SetOutPath "$INSTDIR"
  SetOverwrite ifnewer
  
  ; Copy main files
  File "cpp-core\susa.exe"
  File "LICENSE.txt"
  File "README.txt"
  
  ; Copy all .susa example files
  File /r "cpp-core\*.susa"
  
  ; Create uninstaller
  WriteUninstaller "$INSTDIR\uninstall.exe"
  
  ; Write registry keys
  WriteRegStr HKLM "${PRODUCT_DIR_REGKEY}" "" "$INSTDIR\susa.exe"
  WriteRegStr ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "DisplayName" "$(^Name)"
  WriteRegStr ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "UninstallString" "$INSTDIR\uninstall.exe"
  WriteRegStr ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "DisplayIcon" "$INSTDIR\susa.exe"
  WriteRegStr ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "DisplayVersion" "${PRODUCT_VERSION}"
  WriteRegStr ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "URLInfoAbout" "${PRODUCT_WEB_SITE}"
  WriteRegStr ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "Publisher" "${PRODUCT_PUBLISHER}"
  
  ; Add to PATH
  DetailPrint "Adding SUSA to system PATH..."
  ${EnvVarUpdate} $0 "PATH" "A" "HKLM" "$INSTDIR"
  
  ; Refresh environment
  SendMessage ${HWND_BROADCAST} ${WM_WININICHANGE} 0 "STR:Environment" /TIMEOUT=5000
SectionEnd

Section "SUSA IDE (Desktop Application)" SEC02
  SetOutPath "$INSTDIR"
  
  ; Copy IDE files (if available)
  File /nonfatal "susa-ide.exe"
  
  ; Create desktop shortcut
  CreateShortCut "$DESKTOP\SUSA IDE.lnk" "$INSTDIR\susa-ide.exe" "" "$INSTDIR\susa-ide.exe" 0
  
  ; Create start menu shortcuts
  CreateDirectory "$SMPROGRAMS\SUSA"
  CreateShortCut "$SMPROGRAMS\SUSA\SUSA IDE.lnk" "$INSTDIR\susa-ide.exe" "" "$INSTDIR\susa-ide.exe" 0
SectionEnd

Section "Desktop Shortcuts" SEC03
  ; Create desktop shortcut for CLI
  CreateShortCut "$DESKTOP\SUSA.lnk" "$INSTDIR\susa.exe" "" "$INSTDIR\susa.exe" 0
  
  ; Create start menu shortcuts
  CreateDirectory "$SMPROGRAMS\SUSA"
  CreateShortCut "$SMPROGRAMS\SUSA\SUSA.lnk" "$INSTDIR\susa.exe" "" "$INSTDIR\susa.exe" 0
  CreateShortCut "$SMPROGRAMS\SUSA\Uninstall SUSA.lnk" "$INSTDIR\uninstall.exe" "" "$INSTDIR\uninstall.exe" 0
  CreateShortCut "$SMPROGRAMS\SUSA\SUSA Website.lnk" "${PRODUCT_WEB_SITE}"
SectionEnd

Section "Documentation & Examples" SEC04
  SetOutPath "$INSTDIR\examples"
  
  ; Copy example files
  File /nonfatal /r "cpp-core\*.susa"
  
  SetOutPath "$INSTDIR\docs"
  File /nonfatal "README.txt"
SectionEnd

; Section descriptions
!insertmacro MUI_FUNCTION_DESCRIPTION_BEGIN
  !insertmacro MUI_DESCRIPTION_TEXT ${SEC01} "SUSA compiler and core runtime (required)"
  !insertmacro MUI_DESCRIPTION_TEXT ${SEC02} "SUSA IDE desktop application with code editor"
  !insertmacro MUI_DESCRIPTION_TEXT ${SEC03} "Create desktop and start menu shortcuts"
  !insertmacro MUI_DESCRIPTION_TEXT ${SEC04} "Example programs and documentation"
!insertmacro MUI_FUNCTION_DESCRIPTION_END

Section Uninstall
  ; Kill any running SUSA processes before uninstall
  DetailPrint "Stopping all SUSA processes..."
  nsExec::ExecToLog 'taskkill /F /IM susa.exe /T'
  nsExec::ExecToLog 'taskkill /F /IM susa-ide.exe /T'
  Sleep 2000
  
  ; Remove from PATH
  DetailPrint "Removing SUSA from system PATH..."
  ${un.EnvVarUpdate} $0 "PATH" "R" "HKLM" "$INSTDIR"
  
  ; Delete files
  Delete "$INSTDIR\susa.exe"
  Delete "$INSTDIR\susa-ide.exe"
  Delete "$INSTDIR\LICENSE.txt"
  Delete "$INSTDIR\README.txt"
  Delete "$INSTDIR\uninstall.exe"
  
  ; Delete directories
  RMDir /r "$INSTDIR\examples"
  RMDir /r "$INSTDIR\docs"
  RMDir "$INSTDIR"
  
  ; Delete shortcuts
  Delete "$DESKTOP\SUSA.lnk"
  Delete "$DESKTOP\SUSA IDE.lnk"
  Delete "$SMPROGRAMS\SUSA\*.*"
  RMDir "$SMPROGRAMS\SUSA"
  
  ; Delete registry keys
  DeleteRegKey ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}"
  DeleteRegKey HKLM "${PRODUCT_DIR_REGKEY}"
  
  ; Refresh environment
  SendMessage ${HWND_BROADCAST} ${WM_WININICHANGE} 0 "STR:Environment" /TIMEOUT=5000
  
  SetAutoClose true
SectionEnd
