; SUSA IDE Professional Installer
; Modern UI 2 based installer for SUSA IDE

!define PRODUCT_NAME "SUSA IDE"
!define PRODUCT_VERSION "1.0.0"
!define PRODUCT_PUBLISHER "SUSA Programming Language"
!define PRODUCT_WEB_SITE "https://susa-programming-language.web.app"
!define PRODUCT_DIR_REGKEY "Software\Microsoft\Windows\CurrentVersion\App Paths\SUSA IDE.exe"
!define PRODUCT_UNINST_KEY "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}"
!define PRODUCT_UNINST_ROOT_KEY "HKLM"

!include "MUI2.nsh"
!include "FileFunc.nsh"
!include "LogicLib.nsh"

Name "${PRODUCT_NAME} ${PRODUCT_VERSION}"
OutFile "SUSA-IDE-Setup.exe"
InstallDir "$PROGRAMFILES\SUSA\IDE"
InstallDirRegKey HKLM "${PRODUCT_DIR_REGKEY}" ""
ShowInstDetails show
ShowUnInstDetails show
RequestExecutionLevel admin
SetCompressor /SOLID lzma

!define MUI_ICON "assets\susa.ico"
!define MUI_UNICON "assets\susa.ico"
!define MUI_HEADERIMAGE
!define MUI_HEADERIMAGE_BITMAP "assets\susa-header.bmp"
!define MUI_WELCOMEFINISHPAGE_BITMAP "assets\susa-sidebar.bmp"
!define MUI_UNWELCOMEFINISHPAGE_BITMAP "assets\susa-sidebar.bmp"

!define MUI_WELCOMEPAGE_TITLE "Welcome to SUSA IDE Setup"
!define MUI_WELCOMEPAGE_TEXT "This wizard will guide you through the installation of ${PRODUCT_NAME}.$\r$\n$\r$\nSUSA IDE is a modern desktop development environment.$\r$\n$\r$\nClick Next to continue."

!define MUI_FINISHPAGE_TITLE "Completing ${PRODUCT_NAME} Setup"
!define MUI_FINISHPAGE_TEXT "${PRODUCT_NAME} has been installed successfully.$\r$\n$\r$\nClick Finish to close Setup."
!define MUI_FINISHPAGE_RUN "$INSTDIR\SUSA IDE.exe"
!define MUI_FINISHPAGE_RUN_TEXT "Launch SUSA IDE"
!define MUI_FINISHPAGE_LINK "Visit SUSA Website"
!define MUI_FINISHPAGE_LINK_LOCATION "${PRODUCT_WEB_SITE}"

!insertmacro MUI_PAGE_WELCOME
!insertmacro MUI_PAGE_LICENSE "license.txt"
!insertmacro MUI_PAGE_DIRECTORY
Page custom ComponentsPage ComponentsPageLeave
!insertmacro MUI_PAGE_INSTFILES
!insertmacro MUI_PAGE_FINISH

!insertmacro MUI_UNPAGE_CONFIRM
!insertmacro MUI_UNPAGE_INSTFILES
!insertmacro MUI_UNPAGE_FINISH

!insertmacro MUI_LANGUAGE "English"

Var CreateDesktopShortcut
Var CreateStartMenu
Var Dialog
Var DesktopCheckbox
Var StartMenuCheckbox

Function ComponentsPage
  !insertmacro MUI_HEADER_TEXT "Installation Options" "Choose installation options"
  
  nsDialogs::Create 1018
  Pop $Dialog
  
  ${If} $Dialog == error
    Abort
  ${EndIf}
  
  ${NSD_CreateLabel} 0 0 100% 20u "Select additional tasks:"
  Pop $0
  
  ${NSD_CreateCheckbox} 10u 30u 100% 12u "Create Desktop shortcut"
  Pop $DesktopCheckbox
  ${NSD_Check} $DesktopCheckbox
  
  ${NSD_CreateLabel} 25u 45u 95% 20u "Adds SUSA IDE icon to your desktop"
  Pop $0
  
  ${NSD_CreateCheckbox} 10u 75u 100% 12u "Create Start Menu shortcut"
  Pop $StartMenuCheckbox
  ${NSD_Check} $StartMenuCheckbox
  
  ${NSD_CreateLabel} 25u 90u 95% 20u "Adds SUSA IDE to your Start Menu"
  Pop $0
  
  nsDialogs::Show
FunctionEnd

Function ComponentsPageLeave
  ${NSD_GetState} $DesktopCheckbox $CreateDesktopShortcut
  ${NSD_GetState} $StartMenuCheckbox $CreateStartMenu
FunctionEnd

VIProductVersion "1.0.0.0"
VIAddVersionKey "ProductName" "${PRODUCT_NAME}"
VIAddVersionKey "CompanyName" "${PRODUCT_PUBLISHER}"
VIAddVersionKey "LegalCopyright" "© 2024 ${PRODUCT_PUBLISHER}"
VIAddVersionKey "FileDescription" "${PRODUCT_NAME} Installer"
VIAddVersionKey "FileVersion" "${PRODUCT_VERSION}"
VIAddVersionKey "ProductVersion" "${PRODUCT_VERSION}"

Section "SUSA IDE" SecMain
  SectionIn RO
  
  SetOutPath "$INSTDIR"
  SetOverwrite on
  
  DetailPrint "Checking for running SUSA IDE..."
  nsExec::ExecToLog 'taskkill /F /IM "SUSA IDE.exe" /T'
  Sleep 500
  
  DetailPrint "Installing SUSA IDE..."
  File /r "dist\ide\*.*"
  
  DetailPrint "Creating uninstaller..."
  WriteUninstaller "$INSTDIR\Uninstall.exe"
  
  WriteRegStr ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "DisplayName" "${PRODUCT_NAME}"
  WriteRegStr ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "UninstallString" "$INSTDIR\Uninstall.exe"
  WriteRegStr ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "DisplayIcon" "$INSTDIR\SUSA IDE.exe"
  WriteRegStr ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "DisplayVersion" "${PRODUCT_VERSION}"
  WriteRegStr ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "Publisher" "${PRODUCT_PUBLISHER}"
  WriteRegStr ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "URLInfoAbout" "${PRODUCT_WEB_SITE}"
  WriteRegDWORD ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "NoModify" 1
  WriteRegDWORD ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "NoRepair" 1
  
  ${GetSize} "$INSTDIR" "/S=0K" $0 $1 $2
  IntFmt $0 "0x%08X" $0
  WriteRegDWORD ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "EstimatedSize" "$0"
  
  WriteRegStr HKLM "${PRODUCT_DIR_REGKEY}" "" "$INSTDIR\SUSA IDE.exe"
  WriteRegStr HKLM "${PRODUCT_DIR_REGKEY}" "Path" "$INSTDIR"
  
  ${If} $CreateDesktopShortcut == ${BST_CHECKED}
    DetailPrint "Creating desktop shortcut..."
    CreateShortcut "$DESKTOP\SUSA IDE.lnk" "$INSTDIR\SUSA IDE.exe"
  ${EndIf}
  
  ${If} $CreateStartMenu == ${BST_CHECKED}
    DetailPrint "Creating Start Menu shortcuts..."
    CreateDirectory "$SMPROGRAMS\SUSA"
    CreateShortcut "$SMPROGRAMS\SUSA\SUSA IDE.lnk" "$INSTDIR\SUSA IDE.exe"
    CreateShortcut "$SMPROGRAMS\SUSA\Uninstall SUSA IDE.lnk" "$INSTDIR\Uninstall.exe"
  ${EndIf}
  
  DetailPrint "Installation complete!"
SectionEnd

Section "Uninstall"
  DetailPrint "Terminating SUSA IDE..."
  nsExec::ExecToLog 'taskkill /F /IM "SUSA IDE.exe" /T'
  Sleep 1000
  
  DetailPrint "Removing files..."
  RMDir /r "$INSTDIR"
  
  DetailPrint "Removing shortcuts..."
  Delete "$DESKTOP\SUSA IDE.lnk"
  Delete "$SMPROGRAMS\SUSA\SUSA IDE.lnk"
  Delete "$SMPROGRAMS\SUSA\Uninstall SUSA IDE.lnk"
  RMDir "$SMPROGRAMS\SUSA"
  
  DetailPrint "Cleaning registry..."
  DeleteRegKey ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}"
  DeleteRegKey HKLM "${PRODUCT_DIR_REGKEY}"
  
  DetailPrint "Uninstallation complete!"
  SetAutoClose true
SectionEnd

Function .onInit
  ReadRegStr $0 ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "UninstallString"
  ${If} $0 != ""
    MessageBox MB_YESNO|MB_ICONQUESTION "SUSA IDE is already installed. Upgrade to version ${PRODUCT_VERSION}?" IDYES upgrade
    Abort
    upgrade:
      ExecWait '"$0" /S _?=$INSTDIR'
      Sleep 1000
  ${EndIf}
  
  StrCpy $CreateDesktopShortcut ${BST_CHECKED}
  StrCpy $CreateStartMenu ${BST_CHECKED}
FunctionEnd

Function .onInstSuccess
  MessageBox MB_OK "SUSA IDE has been successfully installed!"
FunctionEnd

Function un.onInit
  MessageBox MB_YESNO|MB_ICONQUESTION "Are you sure you want to remove ${PRODUCT_NAME}?" IDYES +2
  Abort
FunctionEnd

Function un.onUninstSuccess
  MessageBox MB_OK "SUSA IDE has been successfully removed."
FunctionEnd
