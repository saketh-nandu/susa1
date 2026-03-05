; ================================
; SUSA CLI Professional Installer
; ================================
; Modern UI 2 based installer for SUSA CLI compiler
; Similar to Node.js and Python CLI installers

!define PRODUCT_NAME "SUSA CLI"
!define PRODUCT_VERSION "1.0.0"
!define PRODUCT_PUBLISHER "SUSA Programming Language"
!define PRODUCT_WEB_SITE "https://susa-programming-language.web.app"
!define PRODUCT_DIR_REGKEY "Software\Microsoft\Windows\CurrentVersion\App Paths\susa.exe"
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
OutFile "SUSA-CLI-Setup.exe"
InstallDir "$PROGRAMFILES\SUSA\cli"
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
!define MUI_WELCOMEPAGE_TITLE "Welcome to SUSA CLI Setup"
!define MUI_WELCOMEPAGE_TEXT "This wizard will guide you through the installation of ${PRODUCT_NAME}.$\r$\n$\r$\nSUSA is a modern programming language with a powerful command-line compiler.$\r$\n$\r$\nClick Next to continue."

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
!define MUI_FINISHPAGE_TEXT "${PRODUCT_NAME} has been installed on your computer.$\r$\n$\r$\nYou can now use the 'susa' command from any command prompt.$\r$\n$\r$\nClick Finish to close Setup."
!define MUI_FINISHPAGE_RUN
!define MUI_FINISHPAGE_RUN_TEXT "Open SUSA CLI Terminal"
!define MUI_FINISHPAGE_RUN_FUNCTION "LaunchCLI"
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
Var AddToPath
Var CreateStartMenu
Var Dialog
Var PathCheckbox
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
  
  ; Add to PATH checkbox
  ${NSD_CreateCheckbox} 10u 30u 100% 12u "Add SUSA to system PATH (recommended)"
  Pop $PathCheckbox
  ${NSD_Check} $PathCheckbox
  
  ${NSD_CreateLabel} 25u 45u 95% 20u "Allows you to run 'susa' from any command prompt"
  Pop $0
  
  ; Create Start Menu checkbox
  ${NSD_CreateCheckbox} 10u 75u 100% 12u "Create Start Menu shortcut"
  Pop $StartMenuCheckbox
  ${NSD_Check} $StartMenuCheckbox
  
  ${NSD_CreateLabel} 25u 90u 95% 20u "Adds 'SUSA CLI' to your Start Menu"
  Pop $0
  
  ; Info section
  ${NSD_CreateLabel} 0 120u 100% 30u "Installation will include:$\r$\n• SUSA CLI Compiler (susa.exe)$\r$\n• Command-line interpreter$\r$\n• Standard library modules"
  Pop $0
  
  nsDialogs::Show
FunctionEnd

Function ComponentsPageLeave
  ${NSD_GetState} $PathCheckbox $AddToPath
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
Section "SUSA CLI Compiler" SecMain
  SectionIn RO  ; Read-only, always installed
  
  SetOutPath "$INSTDIR"
  SetOverwrite on
  
  ; Kill any running SUSA processes
  DetailPrint "Checking for running SUSA processes..."
  nsExec::ExecToLog 'taskkill /F /IM susa.exe /T'
  nsExec::ExecToLog 'taskkill /F /IM cpp-core.exe /T'
  Sleep 500
  
  ; Install CLI executable
  DetailPrint "Installing SUSA CLI compiler..."
  File "dist\cli\susa.exe"
  
  ; Create uninstaller
  DetailPrint "Creating uninstaller..."
  WriteUninstaller "$INSTDIR\Uninstall.exe"
  
  ; Write registry keys for Add/Remove Programs
  WriteRegStr ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "DisplayName" "${PRODUCT_NAME}"
  WriteRegStr ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "UninstallString" "$INSTDIR\Uninstall.exe"
  WriteRegStr ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "DisplayIcon" "$INSTDIR\susa.exe"
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
  WriteRegStr HKLM "${PRODUCT_DIR_REGKEY}" "" "$INSTDIR\susa.exe"
  WriteRegStr HKLM "${PRODUCT_DIR_REGKEY}" "Path" "$INSTDIR"
  
  ; Add to PATH if selected
  ${If} $AddToPath == ${BST_CHECKED}
    DetailPrint "Adding SUSA to system PATH..."
    Call AddToPath
  ${EndIf}
  
  ; Create Start Menu shortcut if selected
  ${If} $CreateStartMenu == ${BST_CHECKED}
    DetailPrint "Creating Start Menu shortcuts..."
    CreateDirectory "$SMPROGRAMS\SUSA"
    CreateShortcut "$SMPROGRAMS\SUSA\SUSA CLI.lnk" "cmd.exe" '/K "cd /d $INSTDIR && echo SUSA CLI ${PRODUCT_VERSION} && echo Type: susa --help for usage && echo. && susa --version"' "$INSTDIR\susa.exe" 0
    CreateShortcut "$SMPROGRAMS\SUSA\Uninstall SUSA CLI.lnk" "$INSTDIR\Uninstall.exe"
  ${EndIf}
  
  DetailPrint "Installation complete!"
SectionEnd

; ================================
; Add to PATH Function
; ================================
Function AddToPath
  Push $0
  Push $1
  Push $2
  
  ; Read current PATH
  ReadRegStr $0 HKLM "SYSTEM\CurrentControlSet\Control\Session Manager\Environment" "Path"
  
  ; Check if already in PATH
  ${StrStr} $1 $0 "$INSTDIR"
  ${If} $1 == ""
    ; Not in PATH, add it
    StrCpy $1 "$0;$INSTDIR"
    WriteRegExpandStr HKLM "SYSTEM\CurrentControlSet\Control\Session Manager\Environment" "Path" $1
    
    ; Broadcast environment change
    SendMessage ${HWND_BROADCAST} ${WM_WININICHANGE} 0 "STR:Environment" /TIMEOUT=5000
    
    DetailPrint "Added $INSTDIR to system PATH"
  ${Else}
    DetailPrint "SUSA is already in system PATH"
  ${EndIf}
  
  Pop $2
  Pop $1
  Pop $0
FunctionEnd

; ================================
; Launch CLI Function
; ================================
Function LaunchCLI
  ExecShell "open" "cmd.exe" '/K "cd /d $INSTDIR && echo Welcome to SUSA CLI ${PRODUCT_VERSION}! && echo. && echo Type: susa --help for usage && echo Type: susa --version to check version && echo. && susa --version"'
FunctionEnd

; ================================
; Uninstaller Section
; ================================
Section "Uninstall"
  ; Kill running processes
  DetailPrint "Terminating SUSA processes..."
  nsExec::ExecToLog 'taskkill /F /IM susa.exe /T'
  nsExec::ExecToLog 'taskkill /F /IM cpp-core.exe /T'
  Sleep 1000
  
  ; Remove from PATH
  DetailPrint "Removing from system PATH..."
  Call un.RemoveFromPath
  
  ; Delete files
  DetailPrint "Removing files..."
  Delete "$INSTDIR\susa.exe"
  Delete "$INSTDIR\Uninstall.exe"
  
  ; Remove directories
  RMDir "$INSTDIR"
  RMDir "$PROGRAMFILES\SUSA"
  
  ; Remove Start Menu shortcuts
  DetailPrint "Removing shortcuts..."
  Delete "$SMPROGRAMS\SUSA\SUSA CLI.lnk"
  Delete "$SMPROGRAMS\SUSA\Uninstall SUSA CLI.lnk"
  RMDir "$SMPROGRAMS\SUSA"
  
  ; Remove registry keys
  DetailPrint "Cleaning registry..."
  DeleteRegKey ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}"
  DeleteRegKey HKLM "${PRODUCT_DIR_REGKEY}"
  
  DetailPrint "Uninstallation complete!"
  
  SetAutoClose true
SectionEnd

; ================================
; Remove from PATH Function
; ================================
Function un.RemoveFromPath
  Push $0
  Push $1
  Push $2
  Push $3
  
  ; Read current PATH
  ReadRegStr $0 HKLM "SYSTEM\CurrentControlSet\Control\Session Manager\Environment" "Path"
  
  ; Remove our directory from PATH
  StrCpy $1 ""
  StrCpy $2 $0 1 0
  StrCpy $3 0
  
  ${While} $2 != ""
    IntOp $3 $3 + 1
    StrCpy $2 $0 1 $3
    
    ${If} $2 == ";"
      ${OrIf} $2 == ""
      StrCpy $2 $0 $3
      
      ${StrStr} $4 $2 "$INSTDIR"
      ${If} $4 == ""
        ${If} $1 != ""
          StrCpy $1 "$1;$2"
        ${Else}
          StrCpy $1 $2
        ${EndIf}
      ${EndIf}
      
      IntOp $3 $3 + 1
      StrCpy $0 $0 "" $3
      StrCpy $3 0
      StrCpy $2 $0 1 0
    ${EndIf}
  ${EndWhile}
  
  ; Write updated PATH
  WriteRegExpandStr HKLM "SYSTEM\CurrentControlSet\Control\Session Manager\Environment" "Path" $1
  
  ; Broadcast environment change
  SendMessage ${HWND_BROADCAST} ${WM_WININICHANGE} 0 "STR:Environment" /TIMEOUT=5000
  
  DetailPrint "Removed from system PATH"
  
  Pop $3
  Pop $2
  Pop $1
  Pop $0
FunctionEnd

; ================================
; Installer Functions
; ================================
Function .onInit
  ; Check for existing installation
  ReadRegStr $0 ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "UninstallString"
  ${If} $0 != ""
    MessageBox MB_YESNO|MB_ICONQUESTION "SUSA CLI is already installed. Do you want to upgrade to version ${PRODUCT_VERSION}?$\r$\n$\r$\nClick Yes to upgrade or No to cancel." IDYES upgrade
    Abort
    upgrade:
      ; Run silent uninstall
      ExecWait '"$0" /S _?=$INSTDIR'
      Sleep 1000
  ${EndIf}
  
  ; Initialize variables
  StrCpy $AddToPath ${BST_CHECKED}
  StrCpy $CreateStartMenu ${BST_CHECKED}
FunctionEnd

Function .onInstSuccess
  MessageBox MB_OK "SUSA CLI has been successfully installed!$\r$\n$\r$\nYou can now use 'susa' from any command prompt."
FunctionEnd

Function un.onInit
  MessageBox MB_YESNO|MB_ICONQUESTION "Are you sure you want to completely remove ${PRODUCT_NAME}?" IDYES +2
  Abort
FunctionEnd

Function un.onUninstSuccess
  MessageBox MB_OK "SUSA CLI has been successfully removed from your computer."
FunctionEnd
