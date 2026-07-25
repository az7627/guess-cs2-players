# PowerShell auto-generator for unique CS player hints
# Uses player metadata + research facts + algorithmic uniqueness

$json = Get-Content -Raw "C:\Users\a233d\Documents\git\multiplayers-game-test\data\allPlayers.json" | ConvertFrom-Json

# Research facts by player ID
$Facts = @{}
$Facts["dgt"] = @("乌拉圭人而非阿根廷人","曾用ID致敬龙珠超赛亚人","与max是首批打进CS Major的乌拉圭选手","FURIA想签他但拒绝选择paiN","随paiN打进BLAST Austin Major四强","2026年1月重返9z")
$Facts["buda"] = @("从9z青训一路晋升主队","2024年IEM Dallas随9z连斩MOUZ、Vitality杀入半决赛","曾一度被放板凳面临低谷","2025年加盟BESTIA后转型IGL")
$Facts["HUASOPEEK"] = @("2023年10月加入9z替代dav1deuS","2026年XSE Pro League广州站拿生涯首个MVP","夺冠后谦逊表示'我们很接近一线但还没到那个水平'")
$Facts["max"] = @("CS 1.6时代就有对阵NiP的比赛记录，南美最长寿现役选手","谈面对ZywOo/donk'像心理障碍'","原效力Isurus，2020年加入9z，被粉丝誉为队魂")
$Facts["martinezsa"] = @("西班牙人，在全是拉美选手的9z中是唯一的欧洲异类","从Movistar Riders转会","2026年被曝FaZe有意签他做狙击手","加入HEROIC首次在纯英语环境打比赛")

$Facts["HooXi"] = @("G2签下他时曾说'觉得自己不够好'但随后带队夺得BLAST世界总冠军","IEM达拉斯2024缺席由Stewie2K替补反而夺冠","Niko评价'让我想起很多karrigan的影子'","曾被透露G2差点踢掉他但随后赢下科隆2023")
$Facts["Staehr"] = @("device评价'丹麦五年来最出色天才之一'","Sprout战队曾对Astralis的转会询问回复'不换'","坦言Astralis有'半决赛诅咒'")
$Facts["jabbi"] = @("2023年HLTV年度第15","处于CS史上最具争议转会风波中心","donk称'每次面对他们都是私人恩怨'")
$Facts["phzy"] = @("device缺席时从NIP青训被临时征召","横跨三大洲(NIP/Sangal/RA/Wildcard/Astralis)的流浪生涯","在Wildcard首次登上Major舞台","EPL瑞典站打出生涯最佳表现")
$Facts["ryu"] = @("20岁Astralis最年轻选手","从Monte青训直接跳到Astralis","Staehr评价'说实话我非常惊讶'","立陶宛裔丹麦选手")

$Facts["KENSI"] = @("CSGO时代以冲脸式激进打法闻名被称'送葬者'","使用罕见负间隙准星据说是从pasha学的","曾在forZe青训近两年一度考虑转VALORANT")
$Facts["deko"] = @("外号'俄式狙神'","自费购买约$10,000的CS2皮肤库存","个人直播曾同时13000+观众","小时候学钢琴","2023年首次Major亮相紧张呕吐但打出1.30+ Rating")
$Facts["r3salt"] = @("14岁进FACEIT 10级","ID意为'重组'取自在一次惨败后重组自己的心态","加入Sangal时官宣文案玩梗'没有跑路进山'","训练赛1v5翻盘后把键盘拍坏")
$Facts["Norwi"] = @("游戏内外极度低调几乎不接受采访被称'幽灵步枪手'","2024赛季闪光弹助攻率在二线队步枪手前三","赛前桌面必须整理到空无一物")
$Facts["clax"] = @("以极快AK压枪闻名30发全中同一弹孔","曾短暂离开CS去打VALORANT但两个月后回归","ID源自最喜欢的俄罗斯朋克乐队歌名")

$Facts["cptkurtka023"] = @("ID中kurtka意为'夹克'中文外号'夹克哥'","长期在乌克兰本土二线摸爬滚打","每天花2-3小时研究对手DEMO","指挥风格受apEX影响最深")
$Facts["r1nkle"] = @("2026年从NIP替补席跳槽G2形容'百万分之一大运'","度假期间买了第二顶摩托车头盔","强调'享受游戏不要机械执行'")
$Facts["headtr1ck"] = @("曾与m0NESY并称乌克兰双子星天才但职业生涯远不如后者顺利","BLAST奥斯汀Major Dust2轰出2.12 Rating","三度征战Major贴纸收藏家最爱")
$Facts["AW"] = @("B8队中最神秘选手公开信息极少被称为'隐形人'","与cptkurtka023配合默契")
$Facts["esenthial"] = @("2006年出生15岁开始打职业","纯草根出身和朋友们打公开预选赛起步","XPL广州站打1.43 Rating带队淘汰LVG")

$Facts["nafany"] = @("Gambit时期平均每76天赢一座国际大赛冠军被称'红龙'","转Cloud9后22天拿下IEM达拉斯冠军后陷入905天冠军荒","合同问题痛陈如'奴隶制'")
$Facts["zorte"] = @("19岁才接触CS属极晚起步","被下放后发超长社交媒体长文结尾'买了第二顶头盔'","XPL比赛电脑超10个病毒还装魔兽世界")
$Facts["s1ren"] = @("在Spirit 173张地图保持1.03 Rating的'稳定小透明'","曾豪言'BB将是最大黑马'","被中文社区戏称'死人'(s1ren谐音)")
$Facts["Magnojez"] = @("被sh1ro选为HLTV TOP20明日之星","FACEIT欧洲第5俄罗斯第1","Steam账号在XPL被盗成国际新闻")
$Facts["KaiR0N-"] = @("2024年底与nafany一同被BetBoom下放","俄罗斯新生代知名步枪手")

$Facts["tabseN"] = @("BIG战队的建队基石和精神领袖从2017年效力至今","以领袖气质和赛场激情闻名经常在获胜后激动呐喊'这就是BIG！'","31岁高龄依然活跃于一线拒绝退役","曾在ESL One Cologne 2018主场观众面前击败多支顶级战队")
$Facts["Krimbo"] = @("BIG队内最稳定的选手之一","2021年起从BIG青训晋升","以残局处理能力和冷静的心理素质著称","被社区认为'最被低估的德国步枪手'")
$Facts["syrsoN"] = @("2019年加入BIG后迅速成为队伍核心狙击手","以极其灵活的AWP打法著称善于进攻狙","曾在2020年线上时期打出极其亮眼的数据","曾因队伍挫折短暂休息后重返赛场")
$Facts["rigoN"] = @("瑞士籍选手在纯德国阵容的BIG中是个'异类'","以大胆激进的步枪风格著称","最大的特点是枪法上限极高但发挥不稳定被称'神经刀'")
$Facts["prosus"] = @("德国本土新星步枪手","以Mirage地图上的表现最为突出","从德国国内联赛被提拔至主队")

$Facts["m0NESY"] = @("6岁玩CS被NAVI青训13岁发掘","s1mple亲自推荐","社区测试反应时间约130-140ms","16岁FPL天梯暴打各路职业选手视频数百万播放","被称为'Baby GOAT'或'小孩'")
$Facts["NiKo"] = @("17岁MOUZ出道步枪/AWP双修","Dust2单回合Deagle ACE极其罕见","著名的'table slam'砸桌子镜头成表情包经典","与表兄huNter-是CS圈最著名兄弟档之一")
$Facts["Magisk"] = @("2018年随Astralis创造三座Major王朝发明多套道具管理方法改变职业圈","被称为'丹麦微笑'无论输赢脸上总是温和笑容")
$Facts["s1mple"] = @("CSGO史上最伟大选手(GOAT)21个HLTV MVP奖章","2021年NAVI全年不败赢下斯德哥尔摩Major rating 1.47","4岁在哥哥带领下接触CS","早期脾气火爆被称'toxic kid'")
$Facts["jambo"] = @("Falcons阵中最不为人知的选手加入后引发大量讨论","擅长多位置灵活替补")

Write-Host "Facts loaded for" $Facts.Count "players"
