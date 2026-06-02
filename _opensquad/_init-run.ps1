$ErrorActionPreference = 'Stop'
$coreDest = 'D:\PROJETOS\Afiliado\_opensquad\core'
$coreSrc  = 'D:\PROJETOS\Youtube\_opensquad\core'
$coreStatus = 'ALREADY_OK'
if (-not (Test-Path (Join-Path $coreDest 'runner.pipeline.md')) -or (Get-ChildItem $coreDest -ErrorAction SilentlyContinue | Measure-Object).Count -lt 5) {
  if (-not (Test-Path $coreDest)) { New-Item -ItemType Directory -Path $coreDest -Force | Out-Null }
  robocopy $coreSrc $coreDest /E /IS /IT | Out-Null
  if ($LASTEXITCODE -ge 8) { throw "robocopy failed: $LASTEXITCODE" }
  $coreStatus = 'COPIED'
}
$baseRun = 'D:\PROJETOS\Afiliado\squads\afili-miner\output'
$ts = Get-Date -Format 'yyyy-MM-dd-HHmmss'
$runId = $ts
$runDir = Join-Path $baseRun $runId
if (-not (Test-Path $baseRun)) { New-Item -ItemType Directory -Path $baseRun -Force | Out-Null }
$n = 2
while (Test-Path $runDir) {
  $runId = "$ts-$n"
  $runDir = Join-Path $baseRun $runId
  $n++
}
New-Item -ItemType Directory -Path $runDir -Force | Out-Null
$result = @{
  CORE_STATUS = $coreStatus
  RUN_ID = $runId
  RUN_DIR = $runDir
  RUNNER_EXISTS = (Test-Path (Join-Path $coreDest 'runner.pipeline.md'))
}
$result | ConvertTo-Json -Compress | Set-Content (Join-Path $runDir '_init.json') -Encoding UTF8
$result | ConvertTo-Json
