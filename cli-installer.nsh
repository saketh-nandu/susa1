!macro customInstall
  ; Add SUSA CLI to PATH using PowerShell
  nsExec::ExecToLog 'powershell -Command "$oldPath = [Environment]::GetEnvironmentVariable(''PATH'', ''User''); if ($oldPath -notlike ''*$INSTDIR\resources*'') { [Environment]::SetEnvironmentVariable(''PATH'', ''$INSTDIR\resources;'' + $oldPath, ''User'') }"'
!macroend

!macro customUnInstall
  ; Remove SUSA from PATH using PowerShell
  nsExec::ExecToLog 'powershell -Command "$oldPath = [Environment]::GetEnvironmentVariable(''PATH'', ''User''); $newPath = ($oldPath -split '';'' | Where-Object { $_ -notlike ''*$INSTDIR\resources*'' }) -join '';''; [Environment]::SetEnvironmentVariable(''PATH'', $newPath, ''User'')"'
!macroend
