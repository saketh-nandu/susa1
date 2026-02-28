; ============================================================================
; SUSA Programming Language - Complete Installer
; Version 1.0.0
; ============================================================================

#define MyAppName "SUSA Programming Language"
#define MyAppVersion "1.0.0"
#define MyAppPublisher "SUSA Development Team"
#define MyAppURL "https://www.susastudio.online"
#define MyAppExeName "susa.bat"
#define MyAppIDEExe "SUSA-IDE-Portable-1.0.0.exe"
#define MyAppIcoName "susa logo.ico"

[Setup]
; App Identity
AppId={{F8E7D6C5-B4A3-9281-7654-321FEDCBA098}
AppName={#MyAppName}
AppVersion={#MyAppVersion}
AppVerName={#MyAppName} {#MyAppVersion}
AppPublisher={#MyAppPublisher}
AppPublisherURL={#MyAppURL}
AppSupportURL={#MyAppURL}
AppUpdatesURL={#MyAppURL}

; Installation Directories
DefaultDirName={autopf}\SUSA
DefaultGroupName={#MyAppName}
AllowNoIcons=yes

; Files
LicenseFile=susa-setup\LICENSE
InfoBeforeFile=susa-setup\README.md
OutputDir=Output
OutputBaseFilename=SUSA-Complete-Setup-{#MyAppVersion}
SetupIconFile=susa-setup\{#MyAppIcoName}

; Appearance
Compression=lzma2/ultra64
SolidCompression=yes
WizardStyle=modern

; System
PrivilegesRequired=lowest
ArchitecturesAllowed=x64compatible
ArchitecturesInstallIn64BitMode=x64compatible
UninstallDisplayIcon={app}\{#MyAppIcoName}
UninstallDisplayName={#MyAppName}

; Versioning
VersionInfoVersion={#MyAppVersion}
VersionInfoCompany={#MyAppPublisher}
VersionInfoDescription=SUSA Programming Language Installer
VersionInfoCopyright=Copyright (C) 2024 SUSA Development Team
VersionInfoProductName={#MyAppName}
VersionInfoProductVersion={#MyAppVersion}

[Languages]
Name: "english"; MessagesFile: "compiler:Default.isl"

[Tasks]
Name: "desktopicon"; Description: "Create a &desktop icon for SUSA IDE"; GroupDescription: "Desktop Shortcuts:"
Name: "quicklaunchicon"; Description: "Create a &Quick Launch icon for SUSA IDE"; GroupDescription: "Desktop Shortcuts:"; Flags: unchecked
Name: "addtopath"; Description: "Add SUSA to system PATH (Enables 'susa' command in terminal)"; GroupDescription: "System Integration:"
Name: "fileassoc"; Description: "Associate .susa files with SUSA IDE"; GroupDescription: "File Associations:"
Name: "launchide"; Description: "Launch SUSA IDE after installation"; GroupDescription: "Post-Installation:"

[Files]
; Core SUSA Files
Source: "susa-setup\*.py"; DestDir: "{app}"; Flags: ignoreversion
Source: "susa-setup\*.bat"; DestDir: "{app}"; Flags: ignoreversion
Source: "susa-setup\*.ps1"; DestDir: "{app}"; Flags: ignoreversion
Source: "susa-setup\*.ico"; DestDir: "{app}"; Flags: ignoreversion
Source: "susa-setup\*.png"; DestDir: "{app}"; Flags: ignoreversion
Source: "susa-setup\LICENSE"; DestDir: "{app}"; Flags: ignoreversion
Source: "susa-setup\README.md"; DestDir: "{app}"; Flags: ignoreversion
Source: "susa-setup\SETUP_README.md"; DestDir: "{app}"; Flags: ignoreversion

; Compiler and Runtime
Source: "susa-setup\compiler\*"; DestDir: "{app}\compiler"; Flags: ignoreversion recursesubdirs createallsubdirs
Source: "susa-setup\runtime\*"; DestDir: "{app}\runtime"; Flags: ignoreversion recursesubdirs createallsubdirs

; Standard Library and Modules
Source: "susa-setup\stdlib\*"; DestDir: "{app}\stdlib"; Flags: ignoreversion recursesubdirs createallsubdirs
Source: "susa-setup\modules\*"; DestDir: "{app}\modules"; Flags: ignoreversion recursesubdirs createallsubdirs

; Example Files
Source: "susa-setup\examples\*"; DestDir: "{app}\examples"; Flags: ignoreversion recursesubdirs createallsubdirs

; SUSA IDE (Complete Application)
Source: "susa-setup\susa-ide\*"; DestDir: "{app}\susa-ide"; Flags: ignoreversion recursesubdirs createallsubdirs
Source: "susa-setup\{#MyAppIDEExe}"; DestDir: "{app}"; Flags: ignoreversion

[Icons]
; Start Menu - Main Icons
Name: "{group}\SUSA IDE"; Filename: "{app}\{#MyAppIDEExe}"; IconFilename: "{app}\{#MyAppIcoName}"; Comment: "Launch SUSA Desktop IDE"
Name: "{group}\SUSA Terminal"; Filename: "cmd.exe"; Parameters: "/K cd /d ""{app}"" && susa help"; IconFilename: "{app}\{#MyAppIcoName}"; Comment: "Open SUSA Command Line"
Name: "{group}\SUSA REPL"; Filename: "{app}\susa.bat"; Parameters: "repl"; IconFilename: "{app}\{#MyAppIcoName}"; Comment: "Start SUSA Interactive REPL"

; Start Menu - Examples
Name: "{group}\Examples\01 - Basics"; Filename: "{app}\{#MyAppIDEExe}"; Parameters: """{app}\examples\01_basics.susa"""; IconFilename: "{app}\{#MyAppIcoName}"
Name: "{group}\Examples\02 - Control Flow"; Filename: "{app}\{#MyAppIDEExe}"; Parameters: """{app}\examples\02_control_flow.susa"""; IconFilename: "{app}\{#MyAppIcoName}"
Name: "{group}\Examples\03 - Functions"; Filename: "{app}\{#MyAppIDEExe}"; Parameters: """{app}\examples\03_functions.susa"""; IconFilename: "{app}\{#MyAppIcoName}"
Name: "{group}\Examples\04 - Lists"; Filename: "{app}\{#MyAppIDEExe}"; Parameters: """{app}\examples\04_lists.susa"""; IconFilename: "{app}\{#MyAppIcoName}"
Name: "{group}\Examples\05 - Classes"; Filename: "{app}\{#MyAppIDEExe}"; Parameters: """{app}\examples\05_classes.susa"""; IconFilename: "{app}\{#MyAppIcoName}"
Name: "{group}\Examples\Browse All Examples"; Filename: "explorer.exe"; Parameters: """{app}\examples"""; IconFilename: "{app}\{#MyAppIcoName}"

; Start Menu - Documentation
Name: "{group}\Documentation\README"; Filename: "{app}\README.md"; Comment: "SUSA Language Documentation"
Name: "{group}\Documentation\Module Registry"; Filename: "{app}\modules\MODULE_REGISTRY.md"; Comment: "Available SUSA Modules"
Name: "{group}\Documentation\Examples Folder"; Filename: "{app}\examples"; Comment: "Browse Example Programs"

; Start Menu - Utilities
Name: "{group}\Uninstall SUSA"; Filename: "{uninstallexe}"; Comment: "Uninstall SUSA Programming Language"

; Desktop Icons
Name: "{autodesktop}\SUSA IDE"; Filename: "{app}\{#MyAppIDEExe}"; IconFilename: "{app}\{#MyAppIcoName}"; Tasks: desktopicon; Comment: "Launch SUSA Desktop IDE"

; Quick Launch
Name: "{userappdata}\Microsoft\Internet Explorer\Quick Launch\SUSA IDE"; Filename: "{app}\{#MyAppIDEExe}"; IconFilename: "{app}\{#MyAppIcoName}"; Tasks: quicklaunchicon; Comment: "Launch SUSA Desktop IDE"

[Run]
; Launch IDE after installation
Filename: "{app}\{#MyAppIDEExe}"; Description: "Launch SUSA IDE"; Flags: nowait postinstall skipifsilent; Tasks: launchide

[Registry]
; File Association for .susa files
Root: HKCU; Subkey: "Software\Classes\.susa"; ValueType: string; ValueName: ""; ValueData: "SUSAFile"; Tasks: fileassoc; Flags: uninsdeletevalue
Root: HKCU; Subkey: "Software\Classes\SUSAFile"; ValueType: string; ValueName: ""; ValueData: "SUSA Program"; Tasks: fileassoc; Flags: uninsdeletekey
Root: HKCU; Subkey: "Software\Classes\SUSAFile\DefaultIcon"; ValueType: string; ValueName: ""; ValueData: "{app}\{#MyAppIcoName}"; Tasks: fileassoc
Root: HKCU; Subkey: "Software\Classes\SUSAFile\shell\open\command"; ValueType: string; ValueName: ""; ValueData: """{app}\{#MyAppIDEExe}"" ""%1"""; Tasks: fileassoc
Root: HKCU; Subkey: "Software\Classes\SUSAFile\shell\edit"; ValueType: string; ValueName: ""; ValueData: "Edit with SUSA IDE"; Tasks: fileassoc
Root: HKCU; Subkey: "Software\Classes\SUSAFile\shell\edit\command"; ValueType: string; ValueName: ""; ValueData: """{app}\{#MyAppIDEExe}"" ""%1"""; Tasks: fileassoc
Root: HKCU; Subkey: "Software\Classes\SUSAFile\shell\run"; ValueType: string; ValueName: ""; ValueData: "Run with SUSA"; Tasks: fileassoc
Root: HKCU; Subkey: "Software\Classes\SUSAFile\shell\run\command"; ValueType: string; ValueName: ""; ValueData: """{app}\{#MyAppExeName}"" run ""%1"""; Tasks: fileassoc

; Add to PATH
Root: HKCU; Subkey: "Environment"; ValueType: expandsz; ValueName: "Path"; ValueData: "{olddata};{app}"; Tasks: addtopath; Check: NeedsAddPath('{app}')

; SUSA Environment Variables
Root: HKCU; Subkey: "Environment"; ValueType: string; ValueName: "SUSA_HOME"; ValueData: "{app}"; Flags: uninsdeletevalue
Root: HKCU; Subkey: "Environment"; ValueType: string; ValueName: "SUSA_VERSION"; ValueData: "{#MyAppVersion}"; Flags: uninsdeletevalue

[Code]
var
  PythonDetected: Boolean;
  PythonVersion: String;
  PythonPath: String;

function NeedsAddPath(Param: string): boolean;
var
  OrigPath: string;
begin
  if not RegQueryStringValue(HKEY_CURRENT_USER, 'Environment', 'Path', OrigPath) then
  begin
    Result := True;
    exit;
  end;
  Result := Pos(';' + Param + ';', ';' + OrigPath + ';') = 0;
end;

function CheckPython(): Boolean;
var
  ResultCode: Integer;
  TempFile: String;
  Lines: TArrayOfString;
begin
  Result := False;
  PythonDetected := False;
  
  // Try python command
  TempFile := ExpandConstant('{tmp}\python_version.txt');
  
  if Exec('cmd.exe', '/C python --version > "' + TempFile + '" 2>&1', '', SW_HIDE, ewWaitUntilTerminated, ResultCode) then
  begin
    if FileExists(TempFile) then
    begin
      if LoadStringsFromFile(TempFile, Lines) then
      begin
        if GetArrayLength(Lines) > 0 then
        begin
          PythonVersion := Lines[0];
          if Pos('Python', PythonVersion) > 0 then
          begin
            PythonDetected := True;
            Result := True;
          end;
        end;
      end;
      DeleteFile(TempFile);
    end;
  end;
  
  // Try python3 if python failed
  if not Result then
  begin
    if Exec('cmd.exe', '/C python3 --version > "' + TempFile + '" 2>&1', '', SW_HIDE, ewWaitUntilTerminated, ResultCode) then
    begin
      if FileExists(TempFile) then
      begin
        if LoadStringsFromFile(TempFile, Lines) then
        begin
          if GetArrayLength(Lines) > 0 then
          begin
            PythonVersion := Lines[0];
            if Pos('Python', PythonVersion) > 0 then
            begin
              PythonDetected := True;
              Result := True;
            end;
          end;
        end;
        DeleteFile(TempFile);
      end;
    end;
  end;
end;

function InitializeSetup(): Boolean;
var
  Response: Integer;
begin
  Result := True;
  
  // Check for Python
  if CheckPython() then
  begin
    Log('Python detected: ' + PythonVersion);
  end
  else
  begin
    Response := MsgBox(
      'Python was not detected on your system.' + #13#10 + #13#10 +
      'SUSA requires Python 3.8 or higher for command-line tools.' + #13#10 +
      'The SUSA IDE will work without Python, but CLI commands will not function.' + #13#10 + #13#10 +
      'Would you like to:' + #13#10 +
      '  • Click YES to continue installation (IDE only)' + #13#10 +
      '  • Click NO to cancel and install Python first' + #13#10 + #13#10 +
      'You can download Python from: https://www.python.org/downloads/',
      mbConfirmation, MB_YESNO);
    
    if Response = IDNO then
    begin
      Result := False;
      Exit;
    end;
  end;
end;

procedure CurStepChanged(CurStep: TSetupStep);
var
  AppPath: String;
  BatchContent: String;
begin
  if CurStep = ssPostInstall then
  begin
    AppPath := ExpandConstant('{app}');
    
    // Create enhanced susa.bat wrapper
    BatchContent := 
      '@echo off' + #13#10 +
      'REM ============================================' + #13#10 +
      'REM SUSA Programming Language CLI' + #13#10 +
      'REM Version 1.0.0' + #13#10 +
      'REM ============================================' + #13#10 +
      'setlocal enabledelayedexpansion' + #13#10 + #13#10 +
      
      'set "SUSA_HOME=' + AppPath + '"' + #13#10 +
      'set "SUSA_VERSION=1.0.0"' + #13#10 +
      'cd /d "%SUSA_HOME%"' + #13#10 + #13#10 +
      
      'REM Check if Python is available' + #13#10 +
      'python --version >nul 2>&1' + #13#10 +
      'if errorlevel 1 (' + #13#10 +
      '    echo Error: Python is not installed or not in PATH' + #13#10 +
      '    echo Please install Python 3.8+ from https://www.python.org/downloads/' + #13#10 +
      '    echo.' + #13#10 +
      '    echo Note: SUSA IDE will still work without Python' + #13#10 +
      '    exit /b 1' + #13#10 +
      ')' + #13#10 + #13#10 +
      
      'REM Parse command' + #13#10 +
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
      'if "%~1"=="pkg" goto packagemgr' + #13#10 +
      'if "%~1"=="examples" goto showexamples' + #13#10 + #13#10 +
      
      'REM Try to run as file' + #13#10 +
      'if exist "%~1" (' + #13#10 +
      '    echo Running SUSA file: %~1' + #13#10 +
      '    python "%SUSA_HOME%\main.py" %*' + #13#10 +
      '    goto end' + #13#10 +
      ')' + #13#10 +
      'echo Error: Unknown command or file not found: %~1' + #13#10 +
      'echo Type "susa help" for usage information' + #13#10 +
      'goto end' + #13#10 + #13#10 +
      
      ':showhelp' + #13#10 +
      'echo.' + #13#10 +
      'echo  _____ _   _ _____ _' + #13#10 +
      'echo ^|  ___^| ^| ^| ^|  ___^| ^|' + #13#10 +
      'echo ^| ^|___^| ^| ^| ^| ^|___^| ^|' + #13#10 +
      'echo ^|___  ^| ^| ^| ^|___  ^| ^|' + #13#10 +
      'echo  ___^| ^| ^|_^| ^|___^| ^| ^|____' + #13#10 +
      'echo ^|_____/\___/^|_____/^|______^|' + #13#10 +
      'echo.' + #13#10 +
      'echo SUSA Programming Language v1.0.0' + #13#10 +
      'echo Modern, Case-Insensitive, Indentation-Independent' + #13#10 +
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
      'echo   pkg [command]     Package manager (list, install, remove)' + #13#10 +
      'echo   examples          Open examples folder' + #13#10 +
      'echo.' + #13#10 +
      'echo Examples:' + #13#10 +
      'echo   susa repl                    Start interactive mode' + #13#10 +
      'echo   susa run myfile.susa         Run a SUSA program' + #13#10 +
      'echo   susa ide                     Launch desktop IDE' + #13#10 +
      'echo   susa iso                     Launch desktop IDE (alias)' + #13#10 +
      'echo   susa pkg list                List available modules' + #13#10 +
      'echo.' + #13#10 +
      'echo Documentation: %SUSA_HOME%\README.md' + #13#10 +
      'echo Website: https://www.susastudio.online' + #13#10 +
      'goto end' + #13#10 + #13#10 +
      
      ':showversion' + #13#10 +
      'echo SUSA Programming Language v1.0.0' + #13#10 +
      'python --version 2>nul' + #13#10 +
      'goto end' + #13#10 + #13#10 +
      
      ':startrepl' + #13#10 +
      'echo Starting SUSA Interactive REPL...' + #13#10 +
      'echo Type "exit" or press Ctrl+C to quit' + #13#10 +
      'echo.' + #13#10 +
      'python "%SUSA_HOME%\repl.py"' + #13#10 +
      'goto end' + #13#10 + #13#10 +
      
      ':runfile' + #13#10 +
      'if "%~2"=="" (' + #13#10 +
      '    echo Error: No file specified' + #13#10 +
      '    echo Usage: susa run file.susa' + #13#10 +
      '    goto end' + #13#10 +
      ')' + #13#10 +
      'echo Running SUSA file: %~2' + #13#10 +
      'python "%SUSA_HOME%\main.py" %2 %3 %4 %5 %6 %7 %8 %9' + #13#10 +
      'goto end' + #13#10 + #13#10 +
      
      ':launchide' + #13#10 +
      'echo Launching SUSA IDE...' + #13#10 +
      'if exist "%SUSA_HOME%\{#MyAppIDEExe}" (' + #13#10 +
      '    start "" "%SUSA_HOME%\{#MyAppIDEExe}"' + #13#10 +
      ') else (' + #13#10 +
      '    echo Error: SUSA IDE not found' + #13#10 +
      ')' + #13#10 +
      'goto end' + #13#10 + #13#10 +
      
      ':packagemgr' + #13#10 +
      'shift' + #13#10 +
      'python "%SUSA_HOME%\susa_pkg.py" %*' + #13#10 +
      'goto end' + #13#10 + #13#10 +
      
      ':showexamples' + #13#10 +
      'echo Opening examples folder...' + #13#10 +
      'explorer "%SUSA_HOME%\examples"' + #13#10 +
      'goto end' + #13#10 + #13#10 +
      
      ':end' + #13#10 +
      'endlocal' + #13#10;
    
    SaveStringToFile(AppPath + '\susa.bat', BatchContent, False);
    
    // Create IDE launcher batch file
    SaveStringToFile(AppPath + '\Launch-SUSA-IDE.bat',
      '@echo off' + #13#10 +
      'cd /d "' + AppPath + '"' + #13#10 +
      'start "" "' + AppPath + '\{#MyAppIDEExe}"' + #13#10,
      False);
  end;
end;

procedure DeinitializeSetup();
var
  PathAdded: Boolean;
  IDELaunch: Boolean;
begin
  PathAdded := WizardIsTaskSelected('addtopath');
  IDELaunch := WizardIsTaskSelected('launchide');
  
  if PathAdded then
  begin
    if not IDELaunch then
    begin
      MsgBox(
        'SUSA has been installed successfully!' + #13#10 + #13#10 +
        'IMPORTANT: Please restart your terminal (PowerShell/CMD) or log out and back in' + #13#10 +
        'for the PATH changes to take effect.' + #13#10 + #13#10 +
        'After restarting your terminal, you can use:' + #13#10 +
        '  • susa help       - Show help' + #13#10 +
        '  • susa repl       - Interactive mode' + #13#10 +
        '  • susa run file   - Run a program' + #13#10 +
        '  • susa ide        - Launch IDE' + #13#10 + #13#10 +
        'Python Status: ' + PythonVersion,
        mbInformation, MB_OK);
    end;
  end;
end;

function UpdateReadyMemo(Space, NewLine, MemoUserInfoInfo, MemoDirInfo, MemoTypeInfo, MemoComponentsInfo, MemoGroupInfo, MemoTasksInfo: String): String;
var
  S: String;
begin
  S := '';
  S := S + 'Installation Summary:' + NewLine + NewLine;
  S := S + MemoDirInfo + NewLine + NewLine;
  S := S + 'Selected Tasks:' + NewLine;
  S := S + MemoTasksInfo + NewLine + NewLine;
  
  if PythonDetected then
    S := S + 'Python: Detected (' + PythonVersion + ')' + NewLine
  else
    S := S + 'Python: Not detected (CLI features will be limited)' + NewLine;
  
  S := S + NewLine + 'Components to be installed:' + NewLine;
  S := S + '  • SUSA Language Core' + NewLine;
  S := S + '  • SUSA Desktop IDE' + NewLine;
  S := S + '  • Standard Library & Modules' + NewLine;
  S := S + '  • Example Programs' + NewLine;
  S := S + '  • Command-Line Tools' + NewLine;
  
  Result := S;
end;

[UninstallDelete]
Type: filesandordirs; Name: "{app}\__pycache__"
Type: filesandordirs; Name: "{app}\compiler\__pycache__"
Type: filesandordirs; Name: "{app}\runtime\__pycache__"
Type: files; Name: "{app}\*.pyc"
Type: files; Name: "{app}\susa.bat"
Type: files; Name: "{app}\Launch-SUSA-IDE.bat"

[Messages]
WelcomeLabel1=Welcome to SUSA Programming Language Setup
WelcomeLabel2=This will install SUSA Programming Language v{#MyAppVersion} on your computer.%n%nSUSA is a modern programming language featuring:%n%n• Case-Insensitive Keywords - Write START, start, or StArT%n• Indentation-Independent - No whitespace errors%n• Professional Desktop IDE - Built with React & Electron%n• 283+ Built-in Functions - Comprehensive standard library%n• Module Marketplace - Easy package management%n• Cross-Platform - Windows, macOS, and Linux%n%nIt is recommended that you close all other applications before continuing.

FinishedHeadingLabel=SUSA Installation Complete!
FinishedLabel=SUSA Programming Language has been successfully installed.%n%nYou can now:%n• Launch SUSA IDE from the desktop or Start Menu%n• Use 'susa' command in terminal (after restart)%n• Explore example programs in the examples folder%n• Read documentation in the installation directory%n%nThank you for choosing SUSA!
