@echo off
echo Fixing welcome.susa file...

set WORKSPACE_PATH=C:\Users\Nandu\SUSA_Projects\welcome.susa

if exist "%WORKSPACE_PATH%" (
    echo Found welcome.susa, updating...
    del "%WORKSPACE_PATH%"
    echo File deleted. Please restart the IDE to generate a new welcome.susa
) else (
    echo welcome.susa not found at %WORKSPACE_PATH%
)

pause
