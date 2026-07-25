const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'data');

function loadTeams() {
  const raw = fs.readFileSync(path.join(dataDir, 'teams.json'), 'utf-8');
  return JSON.parse(raw).teams;
}

function loadTeamsWithHints() {
  const raw = fs.readFileSync(path.join(dataDir, 'teams.json'), 'utf-8');
  const data = JSON.parse(raw);
  const teamHints = getTeamHintsMap();
  data.teams.forEach(t => {
    t.hints = teamHints[t.id] || [];
  });
  return data.teams;
}

function getTeamHintsMap() {
  return {
    vitality: [
      { text: 'Vitality是法国最有影响力的电竞俱乐部之一', difficulty: 1 },
      { text: 'Vitality的CS分部曾多次夺得Major冠军', difficulty: 2 },
      { text: '法国本土Major上Vitality的夺冠是整个法国的荣耀', difficulty: 2 },
      { text: 'ZywOo在这支队伍中成长为世界第一选手', difficulty: 2 },
      { text: 'Vitality的标志是一只充满活力的蜜蜂', difficulty: 4 },
      { text: 'apEX是这支队伍的队长和精神领袖', difficulty: 2 },
      { text: 'ropz从FaZe转会加入后让Vitality更加强大', difficulty: 3 },
      { text: '2023年BLAST巴黎Major的冠军', difficulty: 1 },
      { text: '这支队伍的战术体系融合了法国和爱沙尼亚风格', difficulty: 4 },
      { text: 'mezii是队内少有的英国选手', difficulty: 3 },
    ],
    navi: [
      { text: 'NAVI是独联体地区历史最悠久的CS战队之一', difficulty: 1 },
      { text: 'NAVI曾创造全年不败的传奇纪录', difficulty: 2 },
      { text: 's1mple在这支队伍成为了CS史上最伟大的选手', difficulty: 1 },
      { text: 'NAVI在2021年赢得了斯德哥尔摩Major', difficulty: 2 },
      { text: '这支队曾培养出s1mple、electronic、Perfecto等巨星', difficulty: 3 },
      { text: 'Aleksib是NAVI的芬兰籍指挥', difficulty: 2 },
      { text: 'b1t以极高的爆头率在CS圈内闻名', difficulty: 2 },
      { text: 'w0nderful接替了s1mple的位置担任主狙击手', difficulty: 2 },
      { text: 'NAVI的标志性颜色是黄黑', difficulty: 4 },
      { text: '这支队伍在哥本哈根Major 2024夺冠', difficulty: 3 },
    ],
    parivision: [
      { text: 'PARIVISION是一支俄罗斯新锐战队', difficulty: 1 },
      { text: 'Jame是这支队伍的指挥，以极其保守的战术风格著称', difficulty: 2 },
      { text: 'Jame曾被称为CSGO最慢的指挥——Jame Time', difficulty: 3 },
      { text: 'BELCHONOKK在多个俄罗斯战队间积累了丰富经验', difficulty: 3 },
      { text: '这支队伍的核心战术风格偏向稳健', difficulty: 3 },
      { text: 'PARIVISION在本次Major种子排名第三', difficulty: 1 },
    ],
    aurora: [
      { text: 'Aurora Gaming是2026年被土耳其选手全面接管', difficulty: 2 },
      { text: '队内有四位土耳其选手和一位俄罗斯选手', difficulty: 3 },
      { text: 'MAJ3R是这支队伍的老将IGL，经验极其丰富', difficulty: 2 },
      { text: 'XANTARES是这支队伍中最知名的选手，被称为土耳其CS之神', difficulty: 1 },
      { text: 'woxic以极高的鼠标灵敏度闻名', difficulty: 2 },
      { text: '这支土耳其阵容被称为"全土班"的代表', difficulty: 3 },
      { text: 'Wicadia是土耳其CS新生代的代表', difficulty: 3 },
      { text: '这支队伍在本次Major种子排名第四', difficulty: 1 },
    ],
    falcons: [
      { text: 'Falcons是沙特资本重金打造的超级战队', difficulty: 1 },
      { text: '阵容中有多位HLTV TOP20级别的超级巨星', difficulty: 1 },
      { text: 'm0NESY是这支队伍的超级狙击手', difficulty: 1 },
      { text: 'NiKo在这支队伍终于实现了Major冠军梦想', difficulty: 2 },
      { text: 'karrigan是这支队伍的丹麦指挥，CS圈最老牌的IGL之一', difficulty: 2 },
      { text: 'kyousuke是极少数登陆国际赛场的日本CS选手', difficulty: 2 },
      { text: 'TeSeS从HEROIC转会加入这支超级阵容', difficulty: 3 },
      { text: 'Falcons的薪资预算据说是CS圈最高的之一', difficulty: 4 },
      { text: '这支队伍在2026科隆Major夺冠', difficulty: 1 },
    ],
    mouz: [
      { text: 'MOUZ的青训体系培养了m0NESY、torzsi等多位顶级选手', difficulty: 2 },
      { text: 'MOUZ是德国CS的代表性战队', difficulty: 1 },
      { text: 'Brollan从NIP转会MOUZ后转型担任IGL', difficulty: 3 },
      { text: 'Spinx和xertioN是队内的以色列双核', difficulty: 3 },
      { text: 'torzsi是匈牙利极为罕见的顶级CS选手', difficulty: 2 },
      { text: 'xelex是从MOUZ青训晋升的新人', difficulty: 3 },
    ],
    furia: [
      { text: 'FURIA是巴西CS最激进的代表', difficulty: 1 },
      { text: 'FURIA的打法以狂野著称，令对手防不胜防', difficulty: 2 },
      { text: 'FalleN是这支队伍的领袖——被称为巴西CS教父', difficulty: 1 },
      { text: 'KSCERATO多次入选HLTV年度TOP20', difficulty: 2 },
      { text: 'YEKINDAR从Liquid转会加入FURIA——一位拉脱维亚选手加入纯巴西阵容', difficulty: 3 },
      { text: 'molodoy是FURIA阵容中较新的面孔', difficulty: 3 },
    ],
    mongolz: [
      { text: 'MongolZ是亚洲CS崛起的标志', difficulty: 1 },
      { text: 'MongolZ创造了亚洲战队在Major上的最佳战绩——亚军', difficulty: 2 },
      { text: '这支队伍的阵容长期保持稳定，这在CS圈极为罕见', difficulty: 3 },
      { text: 'bLitz是蒙古CS崛起的灵魂人物', difficulty: 2 },
      { text: '910和mzinho是蒙古CS新生代的双子星', difficulty: 3 },
      { text: '全队都是蒙古人，用母语交流——这在顶级赛场是独一无二的优势', difficulty: 3 },
      { text: 'cobrazera是MongolZ阵容中的新成员', difficulty: 4 },
    ],
    spirit: [
      { text: 'Spirit是2024年IEM Katowice冠军', difficulty: 2 },
      { text: 'donk在这支队伍成为了史上最年轻的HLTV TOP1', difficulty: 1 },
      { text: 'sh1ro是队内的超级狙击手，从Cloud9转会而来', difficulty: 2 },
      { text: 'magixx是队伍中最资深的成员之一', difficulty: 3 },
      { text: 'Spirit的青训体系是独联体地区最成功的之一', difficulty: 3 },
      { text: '这支队伍中donk和sh1ro组成了令人胆寒的双子星', difficulty: 2 },
    ],
    g2: [
      { text: 'G2是欧洲最具人气的战队之一', difficulty: 1 },
      { text: 'G2的粉丝遍布全球，社交媒体极为活跃', difficulty: 3 },
      { text: 'huNter-是这支队伍的老将步枪手', difficulty: 2 },
      { text: 'NertZ从HEROIC转会加入G2', difficulty: 3 },
      { text: 'SunPayus是队内的西班牙狙击手', difficulty: 2 },
      { text: 'HeavyGod拥有以色列和乌克兰双重国籍', difficulty: 3 },
      { text: '这支队伍在本次Major种子排名第十', difficulty: 1 },
    ],
    astralis: [
      { text: 'Astralis曾创造CS史上最伟大的王朝——连续三座Major冠军', difficulty: 1 },
      { text: 'Astralis的战术体系改变了整个CS圈的道具使用方法', difficulty: 2 },
      { text: 'HooXi是这支丹麦豪门的指挥', difficulty: 2 },
      { text: 'phzy从NIP青训辗转多队后最终加入Astralis', difficulty: 3 },
      { text: 'jabbi和stavn的转会曾是CS圈最大的争议之一', difficulty: 3 },
      { text: 'Staehr曾被device评价为"丹麦五年来最出色天才"', difficulty: 3 },
      { text: '这支队伍在本次Major种子排名第十一', difficulty: 1 },
    ],
    fut: [
      { text: 'FUT是土耳其CS的新兴力量', difficulty: 1 },
      { text: '这支队伍的阵容经历了大幅重建', difficulty: 3 },
      { text: 'lauNX是队内唯一的非土耳其选手，来自立陶宛', difficulty: 3 },
      { text: 'FUT在本次Major种子排名第十二', difficulty: 1 },
    ],
    monte: [
      { text: 'Monte是欧洲CS新势力', difficulty: 1 },
      { text: 'Gizmy从Monte青训晋升为主力', difficulty: 3 },
      { text: 'afro是队内的法国狙击手', difficulty: 3 },
      { text: 'Bymas是立陶宛选手，曾在MOUZ等队效力', difficulty: 2 },
      { text: '这支队伍在本次Major种子排名第十三', difficulty: 1 },
    ],
    pain: [
      { text: 'paiN Gaming是巴西CS的骄傲', difficulty: 1 },
      { text: 'paiN从巴西次级联赛一路打到世界舞台', difficulty: 2 },
      { text: 'biguzera是paiN的队长和灵魂人物', difficulty: 2 },
      { text: 'nqz是paiN最年轻的选手，年仅19岁', difficulty: 3 },
      { text: '这支队伍在IEM Rio Major上创造了历史', difficulty: 2 },
    ],
    '9z': [
      { text: '9z是南美CS的新兴力量', difficulty: 1 },
      { text: '9z代表了阿根廷和乌拉圭CS的最高水平', difficulty: 2 },
      { text: 'max是9z队内资历最深的元老，被粉丝称为队魂', difficulty: 2 },
      { text: 'dgt从paiN回归9z，完成游子归乡', difficulty: 3 },
      { text: 'HUASOPEEK在2026年XPL广州站拿下生涯首个MVP', difficulty: 3 },
    ],
    legacy: [
      { text: 'Legacy是巴西CS的新生代代表', difficulty: 1 },
      { text: 'dumau和latto是这支队伍的年轻核心', difficulty: 3 },
      { text: 'arT是巴西CS的老牌选手，外号小art', difficulty: 2 },
      { text: '这支队伍在本次Major种子排名第十六', difficulty: 1 },
    ],
    gamerlegion: [
      { text: 'GamerLegion以发掘年轻天才著称', difficulty: 1 },
      { text: 'GamerLegion曾在巴黎Major上创造奇迹杀入决赛', difficulty: 2 },
      { text: 'iM就是在这支队伍一战成名后才被NAVI签下', difficulty: 2 },
      { text: 'Snax是加入这支队伍的波兰传奇老将', difficulty: 2 },
      { text: 'REZ从NIP转会加入GamerLegion', difficulty: 3 },
      { text: 'PR是队内最年轻的选手，来自捷克', difficulty: 3 },
    ],
    betboom: [
      { text: 'BetBoom是俄罗斯电竞的重要玩家', difficulty: 1 },
      { text: 'Boombl4是这支队伍的指挥，前NAVI队员', difficulty: 2 },
      { text: 'zorte是队内的俄罗斯狙击手', difficulty: 2 },
      { text: 'S1ren从Spirit青训和主队一路成长', difficulty: 3 },
      { text: 'Magnojez被sh1ro选为HLTV明日之星', difficulty: 3 },
      { text: 'FL4MUS是队内较新的面孔', difficulty: 4 },
    ],
    heroic: [
      { text: 'HEROIC是丹麦CS的重要力量', difficulty: 1 },
      { text: 'HEROIC阵容在2026年经历了重大变化', difficulty: 2 },
      { text: 'xfl0ud是队内的土耳其籍选手', difficulty: 3 },
      { text: 'Chr1zN和susp是HEROIC新阵容中的丹麦选手', difficulty: 4 },
    ],
    liquid: [
      { text: 'Liquid是北美CS历史上最成功的战队之一', difficulty: 1 },
      { text: 'Liquid曾创造大满贯最快完成纪录', difficulty: 2 },
      { text: 'siuhy是这支队伍的波兰籍指挥', difficulty: 2 },
      { text: 'EliGE是北美CS的传奇步枪手', difficulty: 1 },
      { text: 'NAF以极度冷静的残局处理著称', difficulty: 2 },
      { text: 'malbsMd从G2转会加入Liquid', difficulty: 3 },
      { text: 'ultimate是在两个ultimates中效力于Liquid的那个', difficulty: 4 },
    ],
    big: [
      { text: 'BIG是德国CS的旗帜', difficulty: 1 },
      { text: 'tabseN是BIG的建队基石，从2017年效力至今', difficulty: 1 },
      { text: 'blameF是队内的丹麦选手，个人能力极强', difficulty: 2 },
      { text: 'JDC是德国本土选手的代表', difficulty: 3 },
      { text: 'faveN从BIG青训一路晋升至主队', difficulty: 3 },
    ],
    b8: [
      { text: 'B8是乌克兰CS的年轻力量', difficulty: 1 },
      { text: 'npl从NAVI转会加入B8', difficulty: 2 },
      { text: 'esenthial是B8阵中最年轻的选手之一', difficulty: 3 },
      { text: 'alex666是队内的乌克兰指挥', difficulty: 3 },
    ],
    sinners: [
      { text: 'SINNERS是捷克CS的代表', difficulty: 1 },
      { text: 'SHOCK是这支队伍的核心和队长', difficulty: 2 },
      { text: 'beastik是队内的斯洛伐克选手，也是新生代代表', difficulty: 3 },
      { text: 'SINNERS在东欧地区拥有广泛影响力', difficulty: 3 },
    ],
    nrg: [
      { text: 'NRG是北美CS的传统强队', difficulty: 1 },
      { text: 'nitr0是北美CS的传奇选手，从Valorant回归CS', difficulty: 2 },
      { text: 'oSee是NRG的主力狙击手', difficulty: 2 },
      { text: 'Grim是NRG新生代步枪手的代表', difficulty: 3 },
      { text: 'br0是队内唯一的丹麦选手', difficulty: 3 },
    ],
    m80: [
      { text: 'M80是北美CS的新锐力量', difficulty: 1 },
      { text: 'Swisher从EG Black体系单飞后创建了M80', difficulty: 2 },
      { text: 'slaxz是队内的德国狙击手，跨国组合', difficulty: 3 },
      { text: 'Lake是M80阵中经验最丰富的选手之一', difficulty: 3 },
    ],
    mibr: [
      { text: 'MIBR是巴西CS历史上最辉煌的战队之一', difficulty: 1 },
      { text: 'MIBR正在重建新一代阵容', difficulty: 2 },
      { text: 'insani是MIBR最有天赋的年轻选手', difficulty: 2 },
      { text: 'LNZ是队内唯一的瑞典选手', difficulty: 3 },
      { text: 'venomzera和kl1m是MIBR新阵容中的巴西新星', difficulty: 3 },
    ],
    sharks: [
      { text: 'Sharks是巴西CS的新锐之师', difficulty: 1 },
      { text: 'gafolo是队内的狙击手', difficulty: 3 },
      { text: 'rdnzao是Sharks的指挥', difficulty: 3 },
      { text: '这支队伍在本次Major种子排名第二十七', difficulty: 1 },
    ],
    gaimin: [
      { text: 'Gaimin Gladiators是加拿大电竞品牌', difficulty: 1 },
      { text: '这支队伍的阵容以巴西选手为主', difficulty: 2 },
      { text: 'HEN1是巴西CS的老牌选手', difficulty: 2 },
      { text: 'felps曾在SK和MIBR等巴西顶级战队效力', difficulty: 2 },
      { text: 'NEKIZ和JOTA是队内的核心', difficulty: 3 },
    ],
    tyloo: [
      { text: 'TYLOO是中国CS历史最悠久的战队', difficulty: 1 },
      { text: 'TYLOO曾是中国CS唯一的世界级代表', difficulty: 2 },
      { text: 'JamYoung是TYLOO最年轻的选手之一', difficulty: 2 },
      { text: 'Mercury和Moseyuh是TYLOO的新鲜血液', difficulty: 3 },
      { text: 'TYLOO正在重建新一代中国CS阵容', difficulty: 2 },
    ],
    lynnvision: [
      { text: 'Lynn Vision是中国CS的新生力量', difficulty: 1 },
      { text: 'LVG已经多次接近Major正赛', difficulty: 2 },
      { text: 'z4kr是中国CS公认的最强狙击手之一', difficulty: 2 },
      { text: 'Westmelon是LVG的建队核心和队长', difficulty: 2 },
      { text: 'C4LLM3SU3是LVG阵容中的新面孔', difficulty: 4 },
      { text: 'LVG的青训体系培养了中国最有潜力的年轻选手', difficulty: 3 },
    ],
    thunderaustralia: [
      { text: 'THUNDERdOWNUNDER是澳洲CS的新面孔', difficulty: 1 },
      { text: 'aliStair是队内的知名澳大利亚狙击手', difficulty: 2 },
      { text: 'dexter和Liazz都是澳洲CS的老将', difficulty: 2 },
      { text: '这支队伍的阵容混合了经验老将和年轻新星', difficulty: 3 },
    ],
    flyquest: [
      { text: 'FlyQuest是澳洲CS重新崛起的标志', difficulty: 1 },
      { text: 'jks是澳大利亚CS历史上最成功的选手', difficulty: 1 },
      { text: 'INS是队内的新西兰选手和IGL', difficulty: 2 },
      { text: 'Vexite是最年轻的队员，被誉澳大利亚明日之星', difficulty: 2 },
      { text: 'dexter离开FlyQuest加盟THUNDERdOWNUNDER', difficulty: 3 },
    ],
  };
}

function getTeamHints(teamId) {
  const map = getTeamHintsMap();
  const hints = map[teamId] || [];
  if (hints.length === 0) return [];

  // Random pick with difficulty weight (higher difficulty = higher probability to appear first)
  const pool = [...hints];
  const selected = [];
  const maxN = Math.min(10, pool.length);

  for (let i = 0; i < maxN; i++) {
    const totalWeight = pool.reduce((sum, h) => sum + h.difficulty, 0);
    let rand = Math.random() * totalWeight;
    let pickedIdx = 0;
    for (let j = 0; j < pool.length; j++) {
      rand -= pool[j].difficulty;
      if (rand <= 0) { pickedIdx = j; break; }
    }
    selected.push(pool[pickedIdx]);
    pool.splice(pickedIdx, 1);
  }

  return selected.map(h => h.text);
}

function getTeamFacts(teamId, teamsData) {
  if (!teamsData) {
    teamsData = loadTeams();
  }
  const team = teamsData.find(t => t.id === teamId);
  if (!team) return [];

  const facts = [];
  facts.push(`所属赛区是${team.country}`);
  facts.push(`在本次Major种子排名${team.placement}`);
  facts.push(`来自${team.country}的代表队`);
  return facts;
}

function loadAllPlayers() {
  const raw = fs.readFileSync(path.join(dataDir, 'allPlayers.json'), 'utf-8');
  return JSON.parse(raw);
}

function loadPlayersByTeams(teamIds) {
  const allPlayers = loadAllPlayers();
  return allPlayers.filter(p => teamIds.includes(p.team));
}

const COUNTRY_CN = {
  'Argentina': '阿根廷', 'Brazil': '巴西', 'Russia': '俄罗斯', 'Ukraine': '乌克兰',
  'Denmark': '丹麦', 'Sweden': '瑞典', 'Finland': '芬兰', 'Norway': '挪威',
  'France': '法国', 'Germany': '德国', 'United Kingdom': '英国', 'UK': '英国',
  'Poland': '波兰', 'Czech Republic': '捷克', 'Slovakia': '斯洛伐克',
  'Hungary': '匈牙利', 'Romania': '罗马尼亚', 'Bulgaria': '保加利亚',
  'Lithuania': '立陶宛', 'Latvia': '拉脱维亚', 'Estonia': '爱沙尼亚',
  'Turkey': '土耳其', 'Israel': '以色列', 'North Macedonia': '北马其顿',
  'Bosnia and Herzegovina': '波黑', 'Serbia': '塞尔维亚', 'Croatia': '克罗地亚',
  'Slovenia': '斯洛文尼亚', 'Spain': '西班牙', 'Portugal': '葡萄牙',
  'Italy': '意大利', 'Netherlands': '荷兰', 'Belgium': '比利时',
  'Switzerland': '瑞士', 'Austria': '奥地利',
  'United States': '美国', 'USA': '美国', 'Canada': '加拿大', 'Mexico': '墨西哥',
  'Guatemala': '危地马拉', 'Colombia': '哥伦比亚',
  'China': '中国', 'Mongolia': '蒙古', 'South Korea': '韩国', 'Japan': '日本',
  'Australia': '澳大利亚', 'New Zealand': '新西兰',
  'Malaysia': '马来西亚', 'Indonesia': '印度尼西亚', 'Vietnam': '越南',
  'International': '国际', 'Europe': '欧洲', 'Saudi Arabia': '沙特阿拉伯',
};

function cn(country) {
  return COUNTRY_CN[country] || country;
}

function generateFacts(player) {
  const facts = [];

  const roleMap = {
    'AWPer': '在队内担任狙击手（AWPer）',
    'Rifler': '在队内担任步枪手',
    'IGL': '在队内担任指挥（IGL）',
    'AWPer/IGL': '在队内同时担任狙击手和指挥',
  };
  if (roleMap[player.role]) facts.push(roleMap[player.role]);

  facts.push(`来自${cn(player.country)}`);

  if (player.birthYear) {
    facts.push(`${player.birthYear}年出生，今年${player.age}岁`);
  }

  if (player.majorTitles > 0) {
    facts.push(player.majorTitles === 1
      ? '曾赢得过1次Major冠军'
      : `曾赢得过${player.majorTitles}次Major冠军`);
  }

  if (player.majorAppearances > 0) {
    facts.push(player.majorAppearances === 1
      ? '这是首次参加Major'
      : `已经参加了${player.majorAppearances}次Major`);
  }

  if (player.hlvtRating) {
    facts.push(`HLTV Rating约为${player.hlvtRating}`);
  }

  facts.push(`目前效力于${player.teamName || player.team}`);

  if (player.teamPlacement) {
    facts.push(`所在队伍在本次赛事获得${player.teamPlacement}`);
  }

  return facts;
}

function pickRandom(arr, n) {
  const pool = [...arr];
  const result = [];
  const max = Math.min(n, pool.length);
  for (let i = 0; i < max; i++) {
    const idx = Math.floor(Math.random() * pool.length);
    result.push(pool[idx]);
    pool.splice(idx, 1);
  }
  return result;
}

function getPlayerHints(player) {
  if (!player) return [];

  const facts = generateFacts(player);
  const funFacts = (player.hints || []).map(h => typeof h === 'string' ? h : h.text);

  const maxHints = 10;
  const factCount = Math.floor(maxHints / 2);
  const funCount = maxHints - factCount;

  const selectedFacts = pickRandom(facts, factCount).map(t => t);

  const weightedFun = [];
  const funPool = funFacts.map((text, i) => {
    const h = player.hints[i];
    return { text, difficulty: (h && typeof h === 'object' && h.difficulty) ? h.difficulty : 3 };
  });
  for (let i = 0; i < Math.min(funCount, funPool.length); i++) {
    const totalWeight = funPool.reduce((s, h) => s + h.difficulty, 0);
    let rand = Math.random() * totalWeight;
    let picked = 0;
    for (let j = 0; j < funPool.length; j++) {
      rand -= funPool[j].difficulty;
      if (rand <= 0) { picked = j; break; }
    }
    weightedFun.push(funPool[picked].text);
    funPool.splice(picked, 1);
  }

  const allHints = [...selectedFacts, ...weightedFun];
  for (let i = allHints.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allHints[i], allHints[j]] = [allHints[j], allHints[i]];
  }

  return allHints;
}

module.exports = { loadTeams, loadAllPlayers, loadPlayersByTeams, getPlayerHints, getTeamHints, getTeamFacts };
