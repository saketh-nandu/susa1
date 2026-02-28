!macro customInstall
  ; Add SUSA CLI to PATH using PowerShell
  nsExec::ExecToLog 'powershell -Command "$oldPath = [Environment]::GetEnvironmentVariable(''PATH'', ''User''); if ($oldPath -notlike ''*$INSTDIR\resources*'') { [Environment]::SetEnvironmentVariable(''PATH'', ''$INSTDIR\resources;'' + $oldPath, ''User'') }"'
  
  ; Register .susa file association
  WriteRegStr HKCU "Software\Classes\.susa" "" "SUSA.File"
  WriteRegStr HKCU "Software\Classes\SUSA.File" "" "SUSA Source File"
  WriteRegStr HKCU "Software\Classes\SUSA.File\DefaultIcon" "" "$INSTDIR\${APP_EXECUTABLE_FILENAME},0"
  WriteRegStr HKCU "Software\Classes\SUSA.File\shell\open\command" "" '"$INSTDIR\${APP_EXECUTABLE_FILENAME}" "%1"'
  
  ; Refresh shell icons
  System::Call 'shell32.dll::SHChangeNotify(i, i, i, i) v (0x08000000, 0, 0, 0)'
!macroend

!macro customUnInstall
  ; Remove SUSA from PATH using PowerShell
  nsExec::ExecToLog 'powershell -Command "$oldPath = [Environment]::GetEnvironmentVariable(''PATH'', ''User''); $newPath = ($oldPath -split '';'' | Where-Object { $_ -notlike ''*$INSTDIR\resources*'' }) -join '';''; [Environment]::SetEnvironmentVariable(''PATH'', $newPath, ''User'')"'
  
  ; Remove .susa file association
  DeleteRegKey HKCU "Software\Classes\.susa"
  DeleteRegKey HKCU "Software\Classes\SUSA.File"
  
  ; Refresh shell icons
  System::Call 'shell32.dll::SHChangeNotify(i, i, i, i) v (0x08000000, 0, 0, 0)'
!macroend
