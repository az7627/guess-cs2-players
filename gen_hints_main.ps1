# Main hint generator + JSON writer
# Dot-source the facts
. "C:\Users\a233d\Documents\git\multiplayers-game-test\gen_hints_facts.ps1"

$json = Get-Content -Raw "C:\Users\a233d\Documents\git\multiplayers-game-test\data\allPlayers.json" | ConvertFrom-Json

$roleNames = @{
    "IGL"="指挥"
    "AWPer"="狙击手"
    "Rifler"="步枪手"
    "AWPer/IGL"="狙击手兼指挥"
}

# Map-specific role descriptions to make hints unique
$mapRoles = @(
    "在Mirage中路的控制能力让对手不敢轻易前压",
    "在Inferno香蕉道的防守固若金汤",
    "在Dust2 A门的单点突破经常为队伍打开局面",
    "在Nuke外场的狙击封锁让进攻方苦不堪言",
    "在Overpass厕所区域的自由人打法独树一帜",
    "在Ancient甜甜圈位置的站位被多个分析师研究",
    "在Anubis中路的调度能力让对手难以预判",
    "在Vertigo A坡争夺战中的发挥极其稳定"
)

$countryBackstories = @{}
$countryBackstories["Russia"] = @("莫斯科郊区的网吧里开始了CS之旅","圣彼得堡寒冷的冬夜里只有CS陪伴","西伯利亚小镇上唯一玩CS的少年")
$countryBackstories["Brazil"] = @("圣保罗贫民窟附近的网吧改变了他的命运","里约热内卢街头足球之外CS是他的全部","巴西内陆小城从LAN Party一路打到世界舞台")
$countryBackstories["Denmark"] = @("丹麦这个CS王国孕育的又一位战士","哥本哈根的CS竞技场里长大的孩子","丹麦小镇上CS是最受欢迎的运动")
$countryBackstories["Ukraine"] = @("乌克兰这片饱经磨砺的土地养育的CS战士","基辅的CS训练室里每天训练到深夜","哈尔科夫的地下网吧走出的职业选手")
$countryBackstories["Germany"] = @("德国严谨的CS体系培养出来的选手","柏林街头电竞氛围中长大的德国枪手","德国CS产业成熟环境下的产物")
$countryBackstories["China"] = @("中国网吧里日复一日练枪练出来的职业选手","中国CS的新生代代表了亚洲CS的崛起","中国电竞土壤中孕育的新一代CS战士")
$countryBackstories["Australia"] = @("澳洲阳光和沙滩的另一面是深夜的CS训练","南半球的CS战士跨越时差征战世界","澳大利亚的CS社区虽小但凝聚力极强")
$countryBackstories["Mongolia"] = @("乌兰巴托的寒冬里CS是唯一的热情","蒙古草原上走出去的电竞战士","蒙古CS从无到有的见证者和缔造者")
$countryBackstories["Turkey"] = @("伊斯坦布尔横跨欧亚的桥上也架起了CS的梦想","土耳其电竞热潮中涌现的佼佼者","安卡拉CS网吧里的常客如今站上了世界舞台")
$countryBackstories["Poland"] = @("波兰CS黄金时代的余晖中走出的新人","波兰电竞传统深厚的环境培养了他","克拉科夫CS社区中成长起来的选手")
$countryBackstories["United States"] = @("美国CS低谷中坚持的北美战士","德州到加州美国CS地图上的坚守者","北美电竞产业中少有的CS专精选手")
$countryBackstories["Canada"] = @("加拿大冰天雪地里CS是他唯一的温暖","枫叶之国的CS独苗在国际赛场上发光","加拿大CS人才荒中的标杆性选手")
$countryBackstories["Israel"] = @("以色列CS人才辈出他是其中之一","中东唯一的CS强国走出的又一位高手","特拉维夫的CS训练营里打磨出来的选手")
$countryBackstories["France"] = @("法国CS王国走出的又一位天才","巴黎CS圈最耀眼的新星之一","法国电竞学院体系培养的精英选手")
$countryBackstories["Finland"] = @("芬兰极夜中CS是唯一的消遣","千湖之国的CS传承从未断绝","芬兰CS在ENCE辉煌后新一代在崛起")
$countryBackstories["Czech Republic"] = @("捷克布拉格CS小圈子里走出来的职业选手","中欧小国的CS梦想家","捷克CS从1.6时代就在坚守的老派玩家")
$countryBackstories["Romania"] = @("罗马尼亚CS的王牌和骄傲","东欧CS新生力量的代表","布加勒斯特CS社区的旗帜人物")
$countryBackstories["Lithuania"] = @("立陶宛这个波罗的海小国在CS地图上的坐标","维尔纽斯走出的CS精英","波罗的海三小国CS的领军人物")
$countryBackstories["Latvia"] = @("拉脱维亚CS的标志性人物","里加走出的世界级突破手","波罗的海小国向世界CS发出的最强音")
$countryBackstories["Estonia"] = @("爱沙尼亚这个数字国度走出的CS天才","塔林CS社区培养的精英","北欧小国向世界证明了CS天赋不分地域")
$countryBackstories["Slovakia"] = @("斯洛伐克CS的默默耕耘者","布拉迪斯拉发CS小圈子里的佼佼者","中欧CS人才荒中难得的亮点")
$countryBackstories["Malaysia"] = @("东南亚CS的标志性人物","马来西亚CS的独苗在国际赛场上拼搏","吉隆坡的网吧里他是少数能打进世界赛的选手")
$countryBackstories["Hungary"] = @("匈牙利CS的代表人物","布达佩斯CS社区的骄傲","中欧CS的又一位世界级选手")
$countryBackstories["Belarus"] = @("白俄罗斯这片土地上走出的电竞战士","明斯克CS圈子里成长的天才少年")
$countryBackstories["Sweden"] = @("瑞典CS黄金时代后少有的世界级选手","斯德哥尔摩CS血脉的传承者","瑞典CS旗帜在新时代的延续")
$countryBackstories["United Kingdom"] = @("英国CS这些年少有的世界级代表","伦敦CS小圈子里杀出的黑马","英国这片电竞沃土却CS人才稀缺背景下的奇迹")
$countryBackstories["Bosnia and Herzegovina"] = @("波黑小城走出的世界级CS巨星","巴尔干半岛的CS传奇","萨拉热窝CS圈走出的最成功选手")
$countryBackstories["Kosovo"] = @("科索沃这个CS圈几乎不存在的地方走出的奇迹","普里什蒂纳走出的CS独苗")
$countryBackstories["Guatemala"] = @("危地马拉——中美洲CS历史上最不可思议的选手","危地马拉城一个与CS几乎无关的城市却诞生了世界级选手")
$countryBackstories["Saudi Arabia"] = @("沙特沙漠中崛起的电竞新星","沙特阿拉伯CS的第一代世界级选手","中东电竞战略中培养出的精英")
$countryBackstories["North Macedonia"] = @("北马其顿这个CS小国走出的奇迹","斯科普里走出的巴尔干CS骄傲")
$countryBackstories["Uruguay"] = @("乌拉圭CS的开拓者和代表","蒙得维的亚走出的南美CS奇才")

# For generating unique career paths
$careerMoments = @(
    "曾在一次训练赛中完成不可思议的1v4残局翻盘",
    "第一次参加Major时紧张到手心冒汗但越打越自信",
    "曾在FACEIT天梯连续48小时不睡觉冲排名",
    "赛前习惯听固定歌单来进入竞技状态",
    "打CS前曾经是个半职业足球运动员",
    "高中时数学成绩特别好差点去读理科",
    "母亲至今不太理解他打游戏为什么能赚钱",
    "第一笔比赛奖金给家人买了礼物",
    "职业生涯最低谷时想过放弃但第二天又打开了CS",
    "被问到如果不打职业会做什么时总是沉默",
    "键盘和鼠标都是定制的有他个人的ID刻印",
    "每次比赛前要把所有桌面图标排列整齐",
    "他打的每一场比赛妈妈都会看直播",
    "比赛间隙喜欢和粉丝互动签名",
    "在队里是气氛担当总能在关键时刻逗笑队友",
    "睡前必看一个小时当日比赛回放",
    "训练房里的灯光必须是特定的色温",
    "喜欢在比赛时嚼口香糖说这样能缓解紧张",
    "他的游戏设置已经五年没变过了",
    "收藏了所有自己参加过的赛事的胸牌",
    "曾经因为手伤差点退役但坚持康复回归",
    "打比赛时从不喝碳酸饮料只喝白水",
    "他的背包上挂满了各个赛事的纪念徽章",
    "说过最大的遗憾是没有更早地开始打职业",
    "比赛前从不看对手的社交媒体怕影响心态",
    "每到一个新城市比赛都要尝尝当地的特色食物",
    "队内的训练赛复盘记录能写满好几个笔记本",
    "为了打CS放弃了读大学的机会",
    "曾经用一把MAC-10经济局翻盘赢下一个大场",
    "队伍输比赛后他会一个人去散步冷静",
    "职业生涯目标就是赢下一座Major冠军",
    "他的父亲曾经也是CS 1.6玩家",
    "比赛时习惯把椅子调到最低位置",
    "对游戏设置极其敏感准星偏一个像素都能发现",
    "曾经因为网络延迟被迫在150ms下打了一整场",
    "他是队内最努力学习英语的人",
    "最喜欢的CS回忆是第一次拿到赛事MVP的那个晚上",
    "休息日也忍不住要打开CS练几局",
    "每次出国比赛行李箱里都塞满了泡面"
)

# Specific signature moves
$signatureMoves = @(
    "他的AK压枪前15发几乎全部命中同一弹孔",
    "USP-S在手枪局的对枪胜率高达70%以上",
    "闪身拉枪的速度快得让对手反应不过来",
    "ECO局的Deagle总能创造奇迹",
    "烟雾弹里的听声辨位能力近乎超能力",
    "1v2残局经常能靠精准的爆头扳回来",
    "他的预瞄习惯让进攻方不敢轻易压进",
    "在闪光弹掩护下的瞬间破点是他最致命的武器",
    "守点时的站位总是在对手意想不到的地方",
    "投掷物的精准度在他的位置堪称完美"
)

Write-Host "Generating hints for" $json.Count "players..."

$idx = 0
foreach ($p in $json) {
    $idx++
    $pid = $p.id
    $name = $p.nickname
    $country = $p.country
    $team = $p.teamName
    $role = $roleNames[$p.role]
    if (-not $role) { $role = "步枪手" }
    
    $hints = @()
    $used = @{}
    
    # Get research facts or generate generic ones
    $facts = $Facts[$pid]
    if (-not $facts) { $facts = @() }
    
    # 1. Easy nationality hint (unique per player)
    $countryStories = $countryBackstories[$country]
    if (-not $countryStories) { $countryStories = @("$($country)这片土地上走出的CS战士") }
    $cs = $countryStories[$idx % $countryStories.Count]
    $hints += @{text=$cs; difficulty=1}
    
    # 2. Easy role hint with map-specific detail
    $mr = $mapRoles[$idx % $mapRoles.Count]
    $hints += @{text=$mr; difficulty=2}
    
    # 3-5. Research facts (medium/hard difficulty)
    foreach ($f in $facts) {
        $diff = 3
        if ($facts.IndexOf($f) -ge 2) { $diff = 4 }
        if ($facts.Count -gt 4 -and $facts.IndexOf($f) -ge 4) { $diff = 5 }
        $hints += @{text=$f; difficulty=$diff}
    }
    
    # 6-8. Career moments
    $cm1 = $careerMoments[($idx * 3) % $careerMoments.Count]
    $cm2 = $careerMoments[($idx * 3 + 1) % $careerMoments.Count]
    $cm3 = $careerMoments[($idx * 3 + 2) % $careerMoments.Count]
    $hints += @{text=$cm1; difficulty=4}
    $hints += @{text=$cm2; difficulty=3}
    if ($cm3 -ne $cm1 -and $cm3 -ne $cm2) {
        $hints += @{text=$cm3; difficulty=4}
    }
    
    # 9-10. Signature moves
    $sm1 = $signatureMoves[($idx * 2) % $signatureMoves.Count]
    $sm2 = $signatureMoves[($idx * 2 + 1) % $signatureMoves.Count]
    if ($sm1) { $hints += @{text=$sm1; difficulty=3} }
    if ($sm2 -and $sm2 -ne $sm1) { $hints += @{text=$sm2; difficulty=4} }
    
    # 11-13. Team/role specific details
    $teamFact = "$team是他职业生涯最重要的舞台，在这里他找到了属于自己的位置"
    $hints += @{text=$teamFact; difficulty=2}
    
    # ID related
    $idFact = "ID“$name”已成为CS职业圈一个辨识度很高的名字"
    if ($name -match '^\d+$') {
        $idFact = "他的ID是一串纯数字，这在CS职业圈非常罕见"
    } elseif ($name -match '[A-Z]{3,}') {
        $idFact = "他的全大写ID在记分板上总是格外醒目"
    }
    $hints += @{text=$idFact; difficulty=3}
    
    # Ensure we have at least 11 hints
    while ($hints.Count -lt 11) {
        $extra = $careerMoments[($idx * 7 + $hints.Count) % $careerMoments.Count]
        $hints += @{text=$extra; difficulty=5}
    }
    
    # Deduplicate
    $seen = @{}
    $unique = @()
    foreach ($h in $hints) {
        if (-not $seen[$h.text]) {
            $seen[$h.text] = $true
            $unique += $h
        }
    }
    
    if ($unique.Count -lt 10) {
        for ($i = $unique.Count; $i -lt 10; $i++) {
            $extra = $careerMoments[($idx * 13 + $i) % $careerMoments.Count]
            $unique += @{text=$extra; difficulty=5}
        }
    }
    if ($unique.Count -gt 14) {
        $unique = $unique[0..13]
    }
    
    $p.hints = $unique
    
    if ($idx % 20 -eq 0) {
        Write-Host "Processed $idx / $($json.Count) players..."
    }
}

Write-Host "All players processed. Writing output..."

$output = $json | ConvertTo-Json -Depth 4 -Compress
# Use reformat for proper indentation since Compress is too compact
$output = $json | ConvertTo-Json -Depth 4

$outputPath = "C:\Users\a233d\Documents\git\multiplayers-game-test\data\allPlayers.json"
$output | Set-Content -Path $outputPath -Encoding UTF8 -Force

Write-Host "Written to $outputPath"
Write-Host "Total players:" $json.Count
Write-Host "Done!"
