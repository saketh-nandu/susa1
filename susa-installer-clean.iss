; SUSA Programming Language Installer Script
; Optimized for clean susa-setup folder

#define MyAppName "SUSA Programming Language"
#define MyAppVersion "1.0.0"
#define MyAppPublisher "SUSA Development Team"
#define MyAppURL "https://www.susastudio.online"
#define MyAppExeName "susa.bat"
#define MyAppIDEName "Launch-SUSA-IDE.bat"
#define MyAppIcoName "susa logo.ico"

[Setup]
; NOTE: Generate a unique GUID for AppId
AppId={{A1B2C3D4-E5F6-7890-ABCD-123456789DEF}
AppName={#MyAppName}
AppVersion={#MyAppVersion}
AppVerName={#MyAppName} {#MyAppVersion}
AppPublisher={#MyAppPublisher}
AppPublisherURL={#MyAppURL}
AppSupportURL={#MyAppURL}
AppUpdatesURL={#MyAppURL}
DefaultDirName={autopf}\SUSA
DefaultGroupName={#MyAppName}
AllowNoIcons=yes
LicenseFile=susa-setup\LICENSE
InfoBeforeFile=susa-setup\README.md
OutputDir=Output
OutputBaseFilename=SUSA-Language-Setup-{#MyAppVersion}
SetupIconFile=susa-setup\{#MyAppIcoName}
Compression=lzma
SolidCompression=yes
WizardStyle=modern
PrivilegesRequired=lowest
ArchitecturesAllowed=x64compatible
ArchitecturesInstallIn64BitMode=x64compatible
UninstallDisplayIcon={app}\{#MyAppIcoName}

[Languages]
Name: "english"; MessagesFile: "compiler:Default.isl"

[Tasks]
Name: "desktopicon"; Description: "{cm:CreateDesktopIcon}"; GroupDescription: "{cm:AdditionalIcons}"; Flags: unchecked
Name: "addtopath"; Description: "Add SUSA to system PATH (Recommended for command-line access)"; GroupDescription: "System Integration"
Name: "fileassoc"; Description: "Associate .susa files with SUSA"; GroupDescription: "File Associations"; Flags: unchecked

[Files]
; Copy entire susa-setup folder contents
Source: "susa-setup\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs createallsubdirs

[Icons]
; Start Menu Icons
Name: "{group}\SUSA IDE"; Filename: "{app}\{#MyAppIDEName}"; IconFilename: "{app}\{#MyAppIcoName}"; Comment: "SUSA Desktop IDE"
Name: "{group}\SUSA Documentation"; Filename: "{app}\README.md"; Comment: "SUSA Language Documentation"
Name: "{group}\{cm:UninstallProgram,{#MyAppName}}"; Filename: "{uninstallexe}"

; Desktop Icons
Name: "{autodesktop}\SUSA IDE"; Filename: "{app}\{#MyAppIDEName}"; IconFilename: "{app}\{#MyAppIcoName}"; Tasks: desktopicon; Comment: "SUSA Desktop IDE"

[Run]
; Post-installation options
Filename: "{app}\{#MyAppIDEName}"; Description: "Launch SUSA IDE"; Flags: nowait postinstall skipifsilent

[Registry]
; File associations for .susa files (User-level to avoid admin requirements)
Root: HKCU; Subkey: "Software\Classes\.susa"; ValueType: string; ValueName: ""; ValueData: "SUSAFile"; Tasks: fileassoc
Root: HKCU; Subkey: "Software\Classes\SUSAFile"; ValueType: string; ValueName: ""; ValueData: "SUSA Program"; Tasks: fileassoc
Root: HKCU; Subkey: "Software\Classes\SUSAFile\DefaultIcon"; ValueType: string; ValueName: ""; ValueData: "{app}\{#MyAppIcoName}"; Tasks: fileassoc
Root: HKCU; Subkey: "Software\Classes\SUSAFile\shell\open\command"; ValueType: string; ValueName: ""; ValueData: """{app}\{#MyAppExeName}"" ""%1"""; Tasks: fileassoc
Root: HKCU; Subkey: "Software\Classes\SUSAFile\shell\edit"; ValueType: string; ValueName: ""; ValueData: "Edit with SUSA IDE"; Tasks: fileassoc
Root: HKCU; Subkey: "Software\Classes\SUSAFile\shell\edit\command"; ValueType: string; ValueName: ""; ValueData: """{app}\{#MyAppIDEName}"""; Tasks: fileassoc

; Add to PATH if requested
Root: HKCU; Subkey: "Environment"; ValueType: expandsz; ValueName: "Path"; ValueData: "{olddata};{app}"; Tasks: addtopath; Check: NeedsAddPath('{app}')

[Code]
function NeedsAddPath(Param: string): boolean;
var
  OrigPath: string;
begin
  if not RegQueryStringValue(HKEY_CURRENT_USER, 'Environment', 'Path', OrigPath)
  then begin
    Result := True;
    exit;
  end;
  Result := Pos(';' + Param + ';', ';' + OrigPath + ';') = 0;
end;

function InitializeSetup(): Boolean;
var
  ResultCode: Integer;
begin
  // Check if Python is installed (optional check)
  if not Exec('python', '--version', '', SW_HIDE, ewWaitUntilTerminated, ResultCode) then
  begin
    if MsgBox('Python was not detected on your system.' + #13#10 + 
              'SUSA IDE will work without Python, but command-line tools require Python 3.8+.' + #13#10 + #13#10 +
              'Would you like to continue with the installation?', mbConfirmation, MB_YESNO) = IDNO then
    begin
      Result := False;
      Exit;
    end;
  end;
  Result := True;
end;

procedure CurStepChanged(CurStep: TSetupStep);
var
  AppPath: String;
begin
  if CurStep = ssPostInstall then
  begin
    AppPath := ExpandConstant('{app}');
    
    // Create main susa.bat command wrapper
    SaveStringToFile(AppPath + '\susa.bat', 
      '@echo off' + #13#10 + 
      'REM SUSA Programming Language CLI' + #13#10 + 
      'setlocal' + #13#10 + 
      'set "SUSA_HOME=' + AppPath + '"' + #13#10 + 
      'cd /d "%SUSA_HOME%"' + #13#10 + #13#10 + 
      
      'if "%~1"=="" goto showhelp' + #13#10 + 
      'if "%~1"=="help" goto showhelp' + #13#10 + 
      'if "%~1"=="--help" goto showhelp' + #13#10 + 
      'if "%~1"=="-h" goto showhelp' + #13#10 + 
      'if "%~1"=="version" goto showversion' + #13#10 + 
      'if "%~1"=="--version" goto showversion' + #13#10 + 
      'if "%~1"=="-v" goto showversion' + #13#10 + 
      'if "%~1"=="repl" goto startrepl' + #13#10 + 
      'if "%~1"=="run" goto runfile' + #13#10 + 
      'if "%~1"=="ide" goto launchide' + #13#10 + 
      'if "%~1"=="iso" goto launchide' + #13#10 + 
      'if "%~1"=="pkg" goto packagemgr' + #13#10 + #13#10 + 
      
      'REM Try to run as file' + #13#10 + 
      'if exist "%~1" (' + #13#10 + 
      '    python "%SUSA_HOME%\main.py" %*' + #13#10 + 
      '    goto end' + #13#10 + 
      ')' + #13#10 + 
      'echo Error: Unknown command or file not found: %~1' + #13#10 + 
      'echo Type "susa help" for usage information' + #13#10 + 
      'goto end' + #13#10 + #13#10 + 
      
      ':showhelp' + #13#10 + 
      'echo.' + #13#10 + 
      'echo SUSA Programming Language CLI v1.0' + #13#10 + 
      'echo.' + #13#10 + 
      'echo Usage: susa [command] [options]' + #13#10 + 
      'echo.' + #13#10 + 
      'echo Commands:' + #13#10 + 
      'echo   help              Show this help message' + #13#10 + 
      'echo   version           Show SUSA version' + #13#10 + 
      'echo   repl              Start interactive SUSA REPL' + #13#10 + 
      'echo   run [file]        Run a SUSA file' + #13#10 + 
      'echo   ide               Launch SUSA IDE' + #13#10 + 
      'echo   iso               Launch SUSA IDE (alias)' + #13#10 + 
      'echo   pkg [command]     Package manager' + #13#10 + 
      'echo.' + #13#10 + 
      'echo Examples:' + #13#10 + 
      'echo   susa repl' + #13#10 + 
      'echo   susa run myfile.susa' + #13#10 + 
      'echo   susa ide' + #13#10 + 
      'echo   susa iso' + #13#10 + 
      'goto end' + #13#10 + #13#10 + 
      
      ':showversion' + #13#10 + 
      'echo SUSA Programming Language v1.0' + #13#10 + 
      'goto end' + #13#10 + #13#10 + 
      
      ':startrepl' + #13#10 + 
      'echo Starting SUSA Interactive REPL...' + #13#10 + 
      'python "%SUSA_HOME%\repl.py"' + #13#10 + 
      'goto end' + #13#10 + #13#10 + 
      
      ':runfile' + #13#10 + 
      'if "%~2"=="" (' + #13#10 + 
      '    echo Error: No file specified' + #13#10 + 
      '    echo Usage: susa run file.susa' + #13#10 + 
      '    goto end' + #13#10 + 
      ')' + #13#10 + 
      'python "%SUSA_HOME%\main.py" %2 %3 %4 %5 %6 %7 %8 %9' + #13#10 + 
      'goto end' + #13#10 + #13#10 + 
      
      ':launchide' + #13#10 + 
      'echo Launching SUSA IDE...' + #13#10 + 
      'if exist "%SUSA_HOME%\Launch-SUSA-IDE.bat" (' + #13#10 + 
      '    start "" "%SUSA_HOME%\Launch-SUSA-IDE.bat"' + #13#10 + 
      ') else (' + #13#10 + 
      '    echo Error: SUSA IDE not found' + #13#10 + 
      ')' + #13#10 + 
      'goto end' + #13#10 + #13#10 + 
      
      ':packagemgr' + #13#10 + 
      'shift' + #13#10 + 
      'python "%SUSA_HOME%\susa_pkg.py" %1 %2 %3 %4 %5 %6 %7 %8 %9' + #13#10 + 
      'goto end' + #13#10 + #13#10 + 
      
      ':end' + #13#10 + 
      'endlocal' + #13#10, False);
    
    // Create REPL launcher
    SaveStringToFile(AppPath + '\susa-repl.bat', 
      '@echo off' + #13#10 + 
      'cd /d "' + AppPath + '"' + #13#10 + 
      'python repl.py' + #13#10 + 
      'pause' + #13#10, False);
      
    // Create compiler launcher
    SaveStringToFile(AppPath + '\susac.bat', 
      '@echo off' + #13#10 + 
      'cd /d "' + AppPath + '"' + #13#10 + 
      'python main.py --compile %*' + #13#10, False);
  end;
end;

procedure DeinitializeSetup();
var
  PathAdded: Boolean;
begin
  PathAdded := WizardIsTaskSelected('addtopath');
  
  if PathAdded then
  begin
    MsgBox('SUSA has been installed successfully!' + #13#10 + #13#10 + 
           'IMPORTANT: Please restart your terminal (PowerShell/CMD) or log out and back in for the PATH changes to take effect.' + #13#10 + #13#10 + 
           'After restarting your terminal, you can use:' + #13#10 + 
           '  • susa help' + #13#10 + 
           '  • susa repl' + #13#10 + 
           '  • susa run file.susa' + #13#10 + 
           '  • susa ide', mbInformation, MB_OK);
  end;
end;

[Messages]
WelcomeLabel1=Welcome to the SUSA Programming Language Setup
WelcomeLabel2=This will install SUSA Programming Language v{#MyAppVersion} on your computer.%n%nSUSA is a modern programming language featuring:%n• Case-insensitive keywords%n• Indentation-independent syntax%n• Professional desktop IDE%n• 283+ built-in functions%n• Comprehensive module library%n%nIt is recommended that you close all other applications before continuing.

[UninstallDelete]
Type: filesandordirs; Name: "{app}\__pycache__"
Type: files; Name: "{app}\*.pyc"
Type: files; Name: "{app}\susa.bat"
Type: files; Name: "{app}\susa-repl.bat"
Type: files; Name: "{app}\susac.bat"