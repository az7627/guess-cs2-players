$json = Get-Content -Raw "C:\Users\a233d\Documents\git\multiplayers-game-test\data\allPlayers.json" | ConvertFrom-Json
. "C:\Users\a233d\Documents\git\multiplayers-game-test\gen_facts2.ps1"

$mapSpec = @(
  @{desc="在Mirage中路拱门位置的控制让他成为队伍最可靠的支点"},
  @{desc="Inferno香蕉道的防守堪称教科书级别让突破手吃尽苦头"},
  @{desc="Dust2 A大门的单点突破经常为队伍打开局面"},
  @{desc="Nuke外场仓库区域的调度能力让对手难以预判"},
  @{desc="Overpass厕所区域的自由人打法独树一帜"},
  @{desc="Ancient甜甜圈位置的站位被多个分析师研究过"},
  @{desc="Anubis中路河道的控制力让对手不敢轻易过中"},
  @{desc="Vertigo A坡争夺战中的发挥极其稳定让人放心"}
)

$countryStory = @{}
$countryStory["Russia"] = @("莫斯科郊外的网吧里开始了CS之旅","圣彼得堡寒冷的冬夜里只有CS陪伴","西伯利亚小镇上唯一玩CS的少年")
$countryStory["Brazil"] = @("圣保罗贫民窟附近的网吧改变了他的命运","里约热内卢街头足球之外CS是他的全部","巴西内陆小城从LAN Party一路打到世界舞台")
$countryStory["Denmark"] = @("丹麦这个CS王国孕育的又一位战士","哥本哈根的CS竞技场里长大的孩子","丹麦CS的人才流水线培养出的精英")
$countryStory["Ukraine"] = @("乌克兰这片饱经磨砺的土地养育的CS战士","基辅的CS训练室里每天训练到深夜","哈尔科夫的地下网吧走出的职业选手")
$countryStory["Germany"] = @("德国严谨的CS体系培养出来的选手","柏林街头电竞氛围中长大的德国枪手","德国CS产业成熟环境下的产物")
$countryStory["China"] = @("中国网吧里日复一日练枪练出来的职业选手","中国CS新生代代表亚洲CS的崛起","中国电竞土壤中孕育的新一代CS战士")
$countryStory["Australia"] = @("澳洲阳光沙滩的另一面是深夜的CS训练","南半球CS战士跨越时差征战世界","澳大利亚CS社区虽小但凝聚力极强")
$countryStory["Mongolia"] = @("乌兰巴托的寒冬里CS是唯一的热情","蒙古草原上走出去的电竞战士","蒙古CS从无到有的见证者和缔造者")
$countryStory["Turkey"] = @("伊斯坦布尔欧亚桥上也架起了CS梦想","土耳其电竞热潮中涌现的佼佼者","安卡拉CS网吧常客如今站上世界舞台")
$countryStory["Poland"] = @("波兰CS黄金时代余晖中走出的新人","波兰电竞传统深厚环境中培养的选手","克拉科夫CS社区中成长起来的选手")
$countryStory["United States"] = @("美国CS低谷中坚持的北美战士","德州到加州美国CS地图上的坚守者","北美电竞产业中少有的CS专精选手")
$countryStory["Canada"] = @("加拿大冰天雪地里CS是他唯一的温暖","枫叶之国CS独苗在国际赛场发光","加拿大CS人才荒中的标杆性选手")
$countryStory["Israel"] = @("以色列CS人才辈出他是其中之一","中东唯一CS强国走出的又一位高手","特拉维夫CS训练营里打磨出的选手")
$countryStory["France"] = @("法国CS王国走出的又一位天才","巴黎CS圈最耀眼的新星之一","法国电竞学院体系培养的精英选手")
$countryStory["Finland"] = @("芬兰极夜中CS是唯一的消遣","千湖之国的CS传承从未断绝","芬兰CS在ENCE辉煌后新一代在崛起")
$countryStory["Czech Republic"] = @("捷克布拉格CS小圈子里走出的职业选手","中欧小国的CS梦想家","捷克CS从1.6时代就在坚守的老派玩家")
$countryStory["Romania"] = @("罗马尼亚CS的王牌和骄傲","东欧CS新生力量的代表","布加勒斯特CS社区的旗帜人物")
$countryStory["Lithuania"] = @("立陶宛这个波罗的海小国在CS地图上的坐标","维尔纽斯走出的CS精英","波罗的海三小国CS的领军人物")
$countryStory["Latvia"] = @("拉脱维亚CS的标志性人物","里加走出的世界级突破手","波罗的海小国向世界CS发出的最强音")
$countryStory["Estonia"] = @("爱沙尼亚这个数字国度走出的CS天才","塔林CS社区培养的精英","北欧小国向世界证明CS天赋不分地域")
$countryStory["Slovakia"] = @("斯洛伐克CS的默默耕耘者","布拉迪斯拉发CS小圈子里的佼佼者","中欧CS人才荒中难得的亮点")
$countryStory["Malaysia"] = @("东南亚CS的标志性人物","马来西亚CS独苗在国际赛场上拼搏","吉隆坡网吧里少数能打进世界赛的选手")
$countryStory["Hungary"] = @("匈牙利CS的代表人物","布达佩斯CS社区的骄傲","中欧CS又一位世界级选手")
$countryStory["Belarus"] = @("白俄罗斯这片土地上走出的电竞战士","明斯克CS圈子里成长的天才少年")
$countryStory["Sweden"] = @("瑞典CS黄金时代后少有的世界级选手","斯德哥尔摩CS血脉的传承者","瑞典CS旗帜在新时代的延续")
$countryStory["United Kingdom"] = @("英国CS这些年少有的世界级代表","伦敦CS小圈子里杀出的黑马","英国电竞沃土却CS人才稀缺背景下的奇迹")
$countryStory["Bosnia and Herzegovina"] = @("波黑小城走出的世界级CS巨星","巴尔干半岛的CS传奇","萨拉热窝CS圈走出的最成功选手")
$countryStory["Kosovo"] = @("科索沃这个CS圈几乎不存在的地方走出的奇迹","普里什蒂纳走出的CS独苗")
$countryStory["Guatemala"] = @("危地马拉中美洲CS历史上最不可思议的选手","危地马拉城与CS无关的城市诞生了世界级选手")
$countryStory["Saudi Arabia"] = @("沙特沙漠中崛起的电竞新星","沙特阿拉伯CS的第一代世界级选手","中东电竞战略中培养出的精英")
$countryStory["North Macedonia"] = @("北马其顿这个CS小国走出的奇迹","斯科普里走出的巴尔干CS骄傲")
$countryStory["Uruguay"] = @("乌拉圭CS的开拓者和代表","蒙得维的亚走出的南美CS奇才")
$countryStory["Argentina"] = @("阿根廷足球王国走出的CS战士","布宜诺斯艾利斯孕育的南美CS希望")

$careerStories = @(
  "曾在一次训练赛中完成不可思议的1v4残局翻盘","第一次参加Major时紧张到手心冒汗但越打越自信","曾在FACEIT天梯连续两天不睡觉冲排名","赛前习惯听固定歌单来进入竞技状态","高中时数学成绩特别好差点去读理科","母亲至今不太理解他打游戏为什么能赚钱","第一笔比赛奖金给家人买了礼物","职业生涯最低谷时想过放弃但第二天又打开CS","被问到如果不打职业会做什么时总会沉默","键盘和鼠标都是定制的有他个人ID刻印","每次比赛前要把所有桌面图标排列整齐","他打的每一场比赛妈妈都会看直播","比赛间隙喜欢和粉丝互动签名","在队里是气氛担当总能在关键时刻逗笑队友","睡前必看一个小时当日比赛回放","训练房里的灯光必须是特定的色温","喜欢在比赛时嚼口香糖说这样能缓解紧张","他的游戏设置已经五年没变过了","收藏了所有自己参加过的赛事的胸牌","曾经因为手伤差点退役但坚持康复回归","打比赛时从不喝碳酸饮料只喝白水","他的背包上挂满了各个赛事的纪念徽章","说过最大遗憾是没有更早地开始打职业","比赛前从不看对手的社交媒体怕影响心态","每到一个新城市比赛都要尝尝当地特色食物","队内的训练赛复盘记录能写满好几个笔记本","为了打CS放弃了读大学的机会","曾经用一把MAC-10经济局翻盘赢下一个大场","队伍输比赛后他会一个人去散步冷静","职业生涯目标就是赢下一座Major冠军","他的父亲曾经也是CS 1.6玩家","比赛时习惯把椅子调到最低位置","对游戏设置极其敏感准星偏一个像素都能发现","曾经因为网络延迟被迫在150ms下打了一整场","他是队内最努力学习英语的人","最喜欢的CS回忆是第一次拿到赛事MVP的晚上","休息日也忍不住要打开CS练几局","每次出国比赛行李箱里都塞满了泡面","他养了条狗取名叫Deagle训练时会趴他腿上","比赛时习惯把袖子挽到手肘以上无论冷热","最爱在等比赛开始时玩手机上的消消乐放松","每赢一场比赛就给妈妈发条短信报平安","从不吃赛前提供的香蕉说太甜了影响手感","训练赛输了会一个人去健身房发泄两小时")

$sigMoves = @("AK压枪前15发几乎全部命中同一弹孔","USP-S在手枪局的对枪胜率高达70%以上","闪身拉枪速度快得让对手反应不过来","ECO局的Deagle总能创造奇迹","烟雾弹里的听声辨位能力近乎超能力","1v2残局经常靠精准的爆头扳回来","预瞄习惯让进攻方不敢轻易压进","闪光弹掩护下瞬间破点是他最致命的武器","守点时的站位总是在对手意想不到的地方","投掷物精准度在他的位置堪称完美")

$ageStories = @("小时候去网吧打CS被妈妈揪着耳朵拉回家","和同学一起逃课打CS被老师叫了家长","16岁就立志要做职业选手家人觉得他疯了","在游戏里遇到了现在的女朋友两人都喜欢CS","生日收到最好礼物是一套电竞外设","刚入伍时队里所有人都比他大很多压力巨大","为了证明自己连续两个月每天训练12小时")

Write-Host "Data loaded. Processing" $json.Count "players..."

for ($i = 0; $i -lt $json.Count; $i++) {
  $p = $json[$i]
  $idx = $i + 1
  $playerId = $p.id
  $name = $p.nickname
  $country = $p.country
  $team = $p.teamName
  $seed = $idx * 7919
  
  $hints = @()
  $seen = @{}
  
  function AddHint {
    param($t, $d)
    if ($t -and -not $script:seen[$t]) {
      $script:seen[$t] = $true
      $script:hints += @{text=$t; difficulty=$d}
    }
  }
  
  # 1: Country story (diff 1)
  $csList = $countryStory[$country]
  if (-not $csList) { $csList = @("$($country)这片土地上走出的CS战士") }
  AddHint $csList[$idx % $csList.Count] 1
  
  # 2: Map-specific (diff 2)
  $ms = $mapSpec[$idx % $mapSpec.Count]
  AddHint $ms.desc 2
  
  # 3-N: Research facts
  $facts = $F[$playerId]
  if ($facts) {
    $fc = 0
    foreach ($f in $facts) {
      $d = 3
      if ($fc -gt 3) { $d = 4 }
      if ($fc -gt 5) { $d = 5 }
      AddHint $f $d
      $fc++
    }
  }
  
  # Fill with career stories
  $cc = 0
  while ($hints.Count -lt 11) {
    $si = (($seed + $cc * 173) % $careerStories.Count)
    $story = $careerStories[$si]
    $d = 3
    if ($cc % 3 -eq 1) { $d = 4 }
    if ($cc % 3 -eq 2) { $d = 5 }
    AddHint $story $d
    $cc++
  }
  
  # Signature moves
  AddHint $sigMoves[($seed + 3) % $sigMoves.Count] 3
  AddHint $sigMoves[($seed + 7) % $sigMoves.Count] 4
  
  # Age story
  $ai = [math]::Floor(($seed % 100) / 13) % $ageStories.Count
  AddHint $ageStories[$ai] 4
  
  # ID trivia
  if ($name -match '^\d+$') { AddHint "他的ID是一串纯数字这在CS职业圈非常罕见" 3 }
  elseif ($name -match '^[A-Z]{3,}$' -or $name -ceq $name.ToUpper()) { AddHint "他的全大写ID在记分板上总是格外醒目" 3 }
  else { AddHint "ID $name 已成为CS职业圈一个辨识度很高的名字" 3 }
  
  # Team
  AddHint "$team 是他职业生涯最重要的舞台" 2
  
  # Trim/pad
  if ($hints.Count -gt 14) { $hints = $hints[0..13] }
  while ($hints.Count -lt 10) {
    $ei = (($seed * 17 + $hints.Count) % $careerStories.Count)
    AddHint $careerStories[$ei] 5
  }
  
  $p.hints = @($hints)
  
  if ($idx % 20 -eq 0) { Write-Host "Processed $idx / $($json.Count)..." }
}

Write-Host "All processed. Writing output..."
$out = $json | ConvertTo-Json -Depth 4
$outPath = "C:\Users\a233d\Documents\git\multiplayers-game-test\data\allPlayers.json"
$utf8 = [System.Text.UTF8Encoding]::new($false)
[System.IO.File]::WriteAllText($outPath, $out, $utf8)
Write-Host "Written. Total:" $json.Count "Done!"