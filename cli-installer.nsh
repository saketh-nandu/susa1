!macro customInstall
  ; Add SUSA CLI to PATH
  nsExec::ExecToLog 'setx PATH "$INSTDIR\resources;%PATH%"'
  
  ; Also add to current session
  ${EnvVarUpdate} $0 "PATH" "A" "HKCU" "$INSTDIR\resources"
!macroend

!macro customUnInstall
  ; Remove SUSA from PATH
  ${un.EnvVarUpdate} $0 "PATH" "R" "HKCU" "$INSTDIR\resources"
!macroend
