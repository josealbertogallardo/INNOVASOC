# Regenera llms-full.txt a partir de scripts/llms-full-head.md y assets/js/publicaciones.js.
# Uso (desde la carpeta del proyecto):  powershell -ExecutionPolicy Bypass -File scripts\build-llms-full.ps1
param([string]$Web = (Split-Path $PSScriptRoot -Parent), [string]$Head = (Join-Path $PSScriptRoot 'llms-full-head.md'), [string]$Fecha = (Get-Date -Format 'yyyy-MM-dd'))
$utf8 = New-Object System.Text.UTF8Encoding $false
$js = [System.IO.File]::ReadAllText((Join-Path $Web 'assets\js\publicaciones.js'), $utf8)
$head = [System.IO.File]::ReadAllText($Head, $utf8)

function Get-Field($entry, $k) {
  $m = [regex]::Match($entry, '(?<![\w])' + $k + ':\s*(?:"((?:[^"\\]|\\.)*)"|(\d+))')
  if (-not $m.Success) { return $null }
  if ($m.Groups[2].Success) { return $m.Groups[2].Value }
  return ($m.Groups[1].Value -replace '\\"', '"')
}

$sb = New-Object System.Text.StringBuilder
[void]$sb.AppendLine('## Publicaciones')
[void]$sb.AppendLine()
[void]$sb.AppendLine("Volcado del archivo assets/js/publicaciones.js de la web, generado el $Fecha. Puede no reflejar altas posteriores; la versi$([char]0xF3)n vigente es la que muestra la secci$([char]0xF3)n Publicaciones de https://josealbertogallardo.github.io/INNOVASOC/#publicaciones. Ordenadas de la m$([char]0xE1)s reciente a la m$([char]0xE1)s antigua.")
[void]$sb.AppendLine()
$total = 0
foreach ($sec in @(@('libros','Libros'), @('articulos',"Art$([char]0xED)culos en revistas cient$([char]0xED)ficas"), @('capitulos',"Cap$([char]0xED)tulos de libro"))) {
  $m = [regex]::Match($js, $sec[0] + ':\s*\[(.*?)\n\s*\]', 'Singleline')
  $entries = [regex]::Matches($m.Groups[1].Value, '\{[^{}]*\}') | ForEach-Object {
    [pscustomobject]@{ y = [int](Get-Field $_.Value 'y'); a = Get-Field $_.Value 'a'; t = Get-Field $_.Value 't'; f = Get-Field $_.Value 'f'; u = Get-Field $_.Value 'u' }
  } | Sort-Object -Property y -Descending
  $n = @($entries).Count; $total += $n
  [void]$sb.AppendLine("### $($sec[1]) ($n)")
  [void]$sb.AppendLine()
  foreach ($p in $entries) {
    $line = "- $($p.a) ($($p.y)). $($p.t). $($p.f)."
    if ($p.u) { $line += " $($p.u)" }
    [void]$sb.AppendLine($line)
  }
  [void]$sb.AppendLine()
}
$out = $head + $sb.ToString().TrimEnd() + "`n"
[System.IO.File]::WriteAllText((Join-Path $Web 'llms-full.txt'), ($out -replace "`r`n", "`n"), $utf8)
"Total publicaciones: $total"
