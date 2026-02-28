!macro customInstall
  ; Add SUSA CLI to PATH via registry (simple append)
  ReadRegStr $0 HKCU "Environment" "PATH"
  WriteRegExpandStr HKCU "Environment" "PATH" "$INSTDIR\resources;$0"
  SendMessage ${HWND_BROADCAST} ${WM_WININICHANGE} 0 "STR:Environment" /TIMEOUT=5000
  
  ; Register .susa file association
  WriteRegStr HKCU "Software\Classes\.susa" "" "SUSA.File"
  WriteRegStr HKCU "Software\Classes\SUSA.File" "" "SUSA Source File"
  WriteRegStr HKCU "Software\Classes\SUSA.File\DefaultIcon" "" "$INSTDIR\${APP_EXECUTABLE_FILENAME},0"
  WriteRegStr HKCU "Software\Classes\SUSA.File\shell\open\command" "" '"$INSTDIR\${APP_EXECUTABLE_FILENAME}" "%1"'
  
  ; Refresh shell icons
  System::Call 'shell32.dll::SHChangeNotify(i, i, i, i) v (0x08000000, 0, 0, 0)'
!macroend

!macro customUnInstall
  ; Remove .susa file association
  DeleteRegKey HKCU "Software\Classes\.susa"
  DeleteRegKey HKCU "Software\Classes\SUSA.File"
  
  ; Refresh shell icons
  System::Call 'shell32.dll::SHChangeNotify(i, i, i, i) v (0x08000000, 0, 0, 0)'
  
  ; Note: PATH cleanup is complex, user can manually remove via Windows Settings
!macroend
