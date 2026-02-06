; Inno Setup Script for Crypto Miner Optimizer
; Build this with: "C:\Program Files (x86)\Inno Setup 6\ISCC.exe" CryptoMinerOptimizer.iss

#define MyAppName "Crypto Miner Optimizer"
#define MyAppVersion "1.0.0"
#define MyAppPublisher "NeuroKoder"
#define MyAppExeName "CryptoMinerOptimizer.exe"

[Setup]
AppId={{7F3E9A2B-C8D1-4E5F-B6A7-9D0E1F2C3B4A}
AppName={#MyAppName}
AppVersion={#MyAppVersion}
AppVerName={#MyAppName} {#MyAppVersion}
AppPublisher={#MyAppPublisher}
DefaultDirName={autopf}\{#MyAppName}
DefaultGroupName={#MyAppName}
AllowNoIcons=yes
; Output settings
OutputDir=..\dist-installer
OutputBaseFilename=CryptoMinerOptimizer-Setup-{#MyAppVersion}
; Compression
Compression=lzma2/ultra64
SolidCompression=yes
; Modern look
WizardStyle=modern
; Require admin for Program Files install
PrivilegesRequired=admin
; 64-bit only
ArchitecturesAllowed=x64compatible
ArchitecturesInstallIn64BitMode=x64compatible
; Uninstall settings
UninstallDisplayIcon={app}\{#MyAppExeName}
UninstallDisplayName={#MyAppName}

[Languages]
Name: "english"; MessagesFile: "compiler:Default.isl"

[Tasks]
Name: "desktopicon"; Description: "{cm:CreateDesktopIcon}"; GroupDescription: "{cm:AdditionalIcons}"; Flags: unchecked

[Files]
; Main executable and all files from the build folder
Source: "..\qt\build\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs createallsubdirs
; Exclude unnecessary files
; Note: windeployqt already copied required DLLs

[Icons]
Name: "{group}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"
Name: "{group}\{cm:UninstallProgram,{#MyAppName}}"; Filename: "{uninstallexe}"
Name: "{autodesktop}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"; Tasks: desktopicon

[Run]
; Option to launch after install
Filename: "{app}\{#MyAppExeName}"; Description: "{cm:LaunchProgram,{#StringChange(MyAppName, '&', '&&')}}"; Flags: nowait postinstall skipifsilent

[Code]
// Check for Visual C++ Redistributable
function VCRedistInstalled: Boolean;
var
  RegKey: String;
begin
  RegKey := 'SOFTWARE\Microsoft\VisualStudio\14.0\VC\Runtimes\x64';
  Result := RegKeyExists(HKEY_LOCAL_MACHINE, RegKey);
end;

procedure InitializeWizard;
begin
  if not VCRedistInstalled then
  begin
    MsgBox('This application requires Microsoft Visual C++ Redistributable.' + #13#10 +
           'Please install it from: https://aka.ms/vs/17/release/vc_redist.x64.exe', 
           mbInformation, MB_OK);
  end;
end;
