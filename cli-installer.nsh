!macro customInstall
  ; Add SUSA CLI to PATH via registry (simple append)
  ReadRegStr $0 HKCU "Environment" "PATH"
  WriteRegExpandStr HKCU "Environment" "PATH" "$INSTDIR\resources;$0"
  SendMessage ${HWND_BROADCAST} ${WM_WININICHANGE} 0 "STR:Environment" /TIMEOUT=5000
!macroend

!macro customUnInstall
  ; Note: PATH cleanup on uninstall is complex, user can manually remove if needed
  ; Or use Windows Settings > Environment Variables
!macroend
