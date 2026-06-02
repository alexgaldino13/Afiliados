$src = 'D:\PROJETOS\Youtube\_opensquad\core'
$dst = 'D:\PROJETOS\Afiliado\_opensquad\core'
Get-ChildItem -Path $src -Recurse -File | ForEach-Object {
  $rel = $_.FullName.Substring($src.Length).TrimStart('\')
  $target = Join-Path $dst $rel
  $dir = Split-Path $target -Parent
  if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Force -Path $dir | Out-Null }
  Copy-Item -LiteralPath $_.FullName -Destination $target -Force
}
$count = (Get-ChildItem -Path $dst -Recurse -File).Count
$lines = (Get-Content -LiteralPath (Join-Path $dst 'runner.pipeline.md')).Count
"FILES=$count"
"RUNNER_LINES=$lines"
"GT500=$($lines -gt 500)"
