Workflow restart-resume
{
	npm --add-python-to-path install --global --production windows-build-tools --vs2015

	Restart-Computer -Wait

	yarn
    yarn add electron-builder --dev
    Start-Process ./scripts/code.sh -ErrorAction SilentlyContinue
    yarn run dist --win

	Unregister-ScheduleJob -Name SetupResume
}

$adm = "erlanggaadikara"
$pwd = ConvertTo-SecureString - String "Capoeirabboy1297" -AsPlainText -Force
$cred = New-Object System.Management.Automation.PSCredential($adm, $pwd)
$AtStartup = New-JobTrigger -Name SetupResume `
			    -Credential $ `
			    -Trigger $AtStartup `
			    -ScriptBlock {Import-Module PSWorkflow; `
			    	Get-Job -Name srvSetup -State Suspend `
				| Resume-Job}

restart-resume -JobName srvSetup