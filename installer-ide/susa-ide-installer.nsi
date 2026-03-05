; ================================
; SUSA IDE Professional Installer
; ================================
; Modern UI 2 based installer for SUSA IDE (Electron app)
; Consistent with CLI and Complete installers

!define PRODUCT_NAME "SUSA IDE"
!define PRODUCT_VERSION "1.0.0"
!define PRODUCT_PUBLISHER "SUSA Programming Language"
!define PRODUCT_WEB_SITE "https://susa-programming-language.web.app"
!define PRODUCT_DIR_REGKEY "Software\Microsoft\Windows\CurrentVersion\App Paths\SUSA IDE.exe"
!define PRODUCT_UNINST_KEY "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}"
!define PRODUCT_UNINST_ROOT_KEY "HKLM"

; ================================
; Modern UI 2 Configuration
; ================================
!include "MUI2.nsh"
!include "FileFunc.nsh"
!include "LogicLib.nsh"
!include "x64.nsh"

; ================================
; Installer Settings
; ================================
Name "${PRODUCT_NAME} ${PRODUCT_VERSION}"
OutFile "SUSA-IDE-Setup.exe"
InstallDir "$PROGRAMFILES\SUSA\IDE"
InstallDirRegKey HKLM "${PRODUCT_DIR_REGKEY}" ""
ShowInstDetails show
ShowUnInstDetails show
RequestExecutionLevel admin
SetCompressor /SOLID lzma

; ================================
; Branding & UI Customization
; ================================
!define MUI_ICON "assets\susa.ico"
!define MUI_UNICON "assets\susa.ico"
!define MUI_HEADERIMAGE
!define MUI_HEADERIMAGE_BITMAP "assets\susa-header.bmp"
!define MUI_WELCOMEFINISHPAGE_BITMAP "assets\susa-sidebar.bmp"
!define MUI_UNWELCOMEFINISHPAGE_BITMAP "assets\susa-sidebar.bmp"

; Custom colors
!define MUI_BGCOLOR "FFFFFF"
!define MUI_TEXTCOLOR "000000"

; ================================
; Welcome Page Configuration
; ================================
!define MUI_WELCOMEPAGE_TITLE "Welcome to SUSA IDE Setup"
!define MUI_WELCOMEPAGE_TEXT "This wizard will guide you through the installation of ${PRODUCT_NAME}.$\r$\n$\r$\nSUSA IDE is a modern desktop development environment with Monaco editor, debugger, and live execution.$\r$\n$\r$\nClick Next to continue."

; ================================
; License Page Configuration
; ================================
!define MUI_LICENSEPAGE_TEXT_TOP "Please review the license agreement before installing ${PRODUCT_NAME}."
!define MUI_LICENSEPAGE_TEXT_BOTTOM "If you accept the terms of the agreement, click I Agree to continue. You must accept the agreement to install ${PRODUCT_NAME}."
!define MUI_LICENSEPAGE_BUTTON "I &Agree"

; ================================
; Directory Page Configuration
; ================================
!define MUI_DIRECTORYPAGE_TEXT_TOP "Setup will install ${PRODUCT_NAME} in the following folder.$\r$\n$\r$\nTo install in a different folder, click Browse and select another folder. Click Next to continue."
!define MUI_DIRECTORYPAGE_TEXT_DESTINATION "Destination Folder"

; ================================
; Finish Page Configuration
; ================================
!define MUI_FINISHPAGE_TITLE "Completing ${PRODUCT_NAME} Setup"
!define MUI_FINISHPAGE_TEXT "${PRODUCT_NAME} has been installed on your computer.$\r$\n$\r$\nYou can now launch SUSA IDE from your desktop or Start Menu.$\r$\n$\r$\nClick Finish to close Setup."
!define MUI_FINISHPAGE_RUN "$INSTDIR\SUSA IDE.exe"
!define MUI_FINISHPAGE_RUN_TEXT "Launch SUSA IDE"
!define MUI_FINISHPAGE_LINK "Visit SUSA Website"
!define MUI_FINISHPAGE_LINK_LOCATION "${PRODUCT_WEB_SITE}"

; ================================
; Installer Pages
; ================================
!insertmacro MUI_PAGE_WELCOME
!insertmacro MUI_PAGE_LICENSE "license.txt"
!insertmacro MUI_PAGE_DIRECTORY
Page custom ComponentsPage ComponentsPageLeave
!insertmacro MUI_PAGE_INSTFILES
!insertmacro MUI_PAGE_FINISH

; ================================
; Uninstaller Pages
; ================================
!insertmacro MUI_UNPAGE_CONFIRM
!insertmacro MUI_UNPAGE_INSTFILES
!insertmacro MUI_UNPAGE_FINISH

; ================================
; Language
; ================================
!insertmacro MUI_LANGUAGE "English"

; ================================
; Custom Variables
; ================================
Var CreateDesktopShortcut
Var CreateStartMenu
Var Dialog
Var DesktopCheckbox
Var StartMenuCheckbox

; ================================
; Custom Components Page
; ================================
Function ComponentsPage
  !insertmacro MUI_HEADER_TEXT "Installation Options" "Choose how you want to install ${PRODUCT_NAME}"
  
  nsDialogs::Create 1018
  Pop $Dialog
  
  ${If} $Dialog == error
    Abort
  ${EndIf}
  
  ; Title
  ${NSD_CreateLabel} 0 0 100% 20u "Select additional tasks to perform:"
  Pop $0
  
  ; Create Desktop shortcut checkbox
  ${NSD_CreateCheckbox} 10u 30u 100% 12u "Create Desktop shortcut"
  Pop $DesktopCheckbox
  ${NSD_Check} $DesktopCheckbox
  
  ${NSD_CreateLabel} 25u 45u 95% 20u "Adds SUSA IDE icon to your desktop for quick access"
  Pop $0
  
  ; Create Start Menu checkbox
  ${NSD_CreateCheckbox} 10u 75u 100% 12u "Create Start Menu shortcut"
  Pop $StartMenuCheckbox
  ${NSD_Check} $StartMenuCheckbox
  
  ${NSD_CreateLabel} 25u 90u 95% 20u "Adds 'SUSA IDE' to your Start Menu"
  Pop $0
  
  ; Info section
  ${NSD_CreateLabel} 0 120u 100% 40u "Installation will include:$\r$\n• SUSA IDE Desktop Application$\r$\n• Monaco-based code editor$\r$\n• Built-in debugger$\r$\n• Live code execution"
  Pop $0
  
  nsDialogs::Show
FunctionEnd

Function ComponentsPageLeave
  ${NSD_GetState} $DesktopCheckbox $CreateDesktopShortcut
  ${NSD_GetState} $StartMenuCheckbox $CreateStartMenu
FunctionEnd

; ================================
; Version Information
; ================================
VIProductVersion "1.0.0.0"
VIAddVersionKey "ProductName" "${PRODUCT_NAME}"
VIAddVersionKey "CompanyName" "${PRODUCT_PUBLISHER}"
VIAddVersionKey "LegalCopyright" "© 2024 ${PRODUCT_PUBLISHER}"
VIAddVersionKey "FileDescription" "${PRODUCT_NAME} Installer"
VIAddVersionKey "FileVersion" "${PRODUCT_VERSION}"
VIAddVersionKey "ProductVersion" "${PRODUCT_VERSION}"

; ================================
; Installer Section
; ================================
Section "SUSA IDE" SecMain
  SectionIn RO  ; Read-only, always installed
  
  SetOutPath "$INSTDIR"
  SetOverwrite on
  
  ; Kill any running IDE processes
  DetailPrint "Checking for running SUSA IDE processes..."
  nsExec::ExecToLog 'taskkill /F /IM "SUSA IDE.exe" /T'
  Sleep 500
  
  ; Install IDE files
  DetailPrint "Installing SUSA IDE..."
  File /r "dist\ide\*.*"
  
  ; Create uninstaller
  DetailPrint "Creating uninstaller..."
  WriteUninstaller "$INSTDIR\Uninstall.exe"
  
  ; Write registry keys for Add/Remove Programs
  WriteRegStr ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "DisplayName" "${PRODUCT_NAME}"
  WriteRegStr ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "UninstallString" "$INSTDIR\Uninstall.exe"
  WriteRegStr ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "DisplayIcon" "$INSTDIR\SUSA IDE.exe"
  WriteRegStr ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "DisplayVersion" "${PRODUCT_VERSION}"
  WriteRegStr ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "Publisher" "${PRODUCT_PUBLISHER}"
  WriteRegStr ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "URLInfoAbout" "${PRODUCT_WEB_SITE}"
  WriteRegDWORD ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "NoModify" 1
  WriteRegDWORD ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "NoRepair" 1
  
  ; Calculate and write install size
  ${GetSize} "$INSTDIR" "/S=0K" $0 $1 $2
  IntFmt $0 "0x%08X" $0
  WriteRegDWORD ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "EstimatedSize" "$0"
  
  ; Write App Paths for Windows Search
  WriteRegStr HKLM "${PRODUCT_DIR_REGKEY}" "" "$INSTDIR\SUSA IDE.exe"
  WriteRegStr HKLM "${PRODUCT_DIR_REGKEY}" "Path" "$INSTDIR"
  
  ; Create Desktop shortcut if selected
  ${If} $CreateDesktopShortcut == ${BST_CHECKED}
    DetailPrint "Creating desktop shortcut..."
    CreateShortcut "$DESKTOP\SUSA IDE.lnk" "$INSTDIR\SUSA IDE.exe" "" "$INSTDIR\SUSA IDE.exe" 0
  ${EndIf}
  
  ; Create Start Menu shortcuts if selected
  ${If} $CreateStartMenu == ${BST_CHECKED}
    DetailPrint "Creating Start Menu shortcuts..."
    CreateDirectory "$SMPROGRAMS\SUSA"
    CreateShortcut "$SMPROGRAMS\SUSA\SUSA IDE.lnk" "$INSTDIR\SUSA IDE.exe" "" "$INSTDIR\SUSA IDE.exe" 0
    CreateShortcut "$SMPROGRAMS\SUSA\Uninstall SUSA IDE.lnk" "$INSTDIR\Uninstall.exe"
  ${EndIf}
  
  DetailPrint "Installation complete!"
SectionEnd

; ================================
; Uninstaller Section
; ================================
Section "Uninstall"
  ; Kill running processes
  DetailPrint "Terminating SUSA IDE processes..."
  nsExec::ExecToLog 'taskkill /F /IM "SUSA IDE.exe" /T'
  Sleep 1000
  
  ; Delete files
  DetailPrint "Removing files..."
  RMDir /r "$INSTDIR"
  
  ; Remove desktop shortcut
  DetailPrint "Removing shortcuts..."
  Delete "$DESKTOP\SUSA IDE.lnk"
  
  ; Remove Start Menu shortcuts
  Delete "$SMPROGRAMS\SUSA\SUSA IDE.lnk"
  Delete "$SMPROGRAMS\SUSA\Uninstall SUSA IDE.lnk"
  RMDir "$SMPROGRAMS\SUSA"
  
  ; Remove registry keys
  DetailPrint "Cleaning registry..."
  DeleteRegKey ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}"
  DeleteRegKey HKLM "${PRODUCT_DIR_REGKEY}"
  
  DetailPrint "Uninstallation complete!"
  
  SetAutoClose true
SectionEnd

; ================================
; Installer Functions
; ================================
Function .onInit
  ; Check for existing installation
  ReadRegStr $0 ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "UninstallString"
  ${If} $0 != ""
    MessageBox MB_YESNO|MB_ICONQUESTION "SUSA IDE is already installed. Do you want to upgrade to version ${PRODUCT_VERSION}?$\r$\n$\r$\nClick Yes to upgrade or No to cancel." IDYES upgrade
    Abort
    upgrade:
      ; Run silent uninstall
      ExecWait '"$0" /S _?=$INSTDIR'
      Sleep 1000
  ${EndIf}
  
  ; Initialize variables
  StrCpy $CreateDesktopShortcut ${BST_CHECKED}
  StrCpy $CreateStartMenu ${BST_CHECKED}
FunctionEnd

Function .onInstSuccess
  MessageBox MB_OK "SUSA IDE has been successfully installed!$\r$\n$\r$\nYou can now launch SUSA IDE from your desktop or Start Menu."
FunctionEnd

Function un.onInit
  MessageBox MB_YESNO|MB_ICONQUESTION "Are you sure you want to completely remove ${PRODUCT_NAME}?" IDYES +2
  Abort
FunctionEnd

Function un.onUninstSuccess
  MessageBox MB_OK "SUSA IDE has been successfully removed from your computer."
FunctionEnd
