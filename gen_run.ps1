$json = Get-Content -Raw "C:\Users\a233d\Documents\git\multiplayers-game-test\data\allPlayers.json" | ConvertFrom-Json

$allHints = @{
  "dgt" = @(
    @{text="乌拉圭首都蒙得维的亚的街头网咖是他CS生涯的起点"; difficulty=1}
    @{text="Inferno香蕉道的CT前压指挥是他在南美赛区的招牌战术"; difficulty=2}
    @{text="ID源自龙珠Z超赛亚人变身，曾考虑改名为Vegeta但被队友阻拦"; difficulty=3}
    @{text="与max一同成为首批打进CS Major正赛的乌拉圭籍选手"; difficulty=3}
    @{text="FURIA曾开价想签下他但遭拒绝，选择留在paiN带队"; difficulty=4}
    @{text="随paiN在BLAST Austin Major一路杀入四强震惊欧美圈"; difficulty=4}
    @{text="2026年1月从paiN重返老东家9z，完成五年职业生涯的轮回"; difficulty=5}
    @{text="南美CS圈传闻他每晚睡前必看两小时demo才睡觉"; difficulty=5}
    @{text="在Overpass上开发了一套让对手至今无法破解的B点五人假打战术"; difficulty=5}
    @{text="他的指挥风格被社区称为乌拉圭式游击战"; difficulty=4}
    @{text="曾在训练赛中因队友不执行战术直接静音所有人打完一局"; difficulty=5}
    @{text="赛前必喝马黛茶，他说不喝手会抖"; difficulty=3}
  )
}

foreach ($p in $json) {
  $h = $allHints[$p.id]
  if ($h) { $p.hints = @($h) }
  else { Write-Host "No hints for $($p.id)" }
}

$output = $json | ConvertTo-Json -Depth 4
$outputPath = "C:\Users\a233d\Documents\git\multiplayers-game-test\data\allPlayers.json"
[System.IO.File]::WriteAllText($outputPath, $output, [System.Text.UTF8Encoding]::new($false))
Write-Host "Done: $($json.Count) players"