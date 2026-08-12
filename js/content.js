// ============================================================
//  content.js — 궁노리 설정 파일
//  ★ 화면별 텍스트는 이 파일에서 수정하세요 (마크업은 index.html) ★
// ============================================================

const CONFIG = {
  // 평문 비밀번호 대신 SHA-256 해시로 저장 (개발자도구에서 소스를 봐도 PIN 원문이 드러나지 않음).
  // 현재 값은 '1395'의 해시. 비밀번호를 바꾸려면 브라우저 콘솔에서 아래를 실행해 새 해시를 구하세요:
  //   crypto.subtle.digest('SHA-256', new TextEncoder().encode('새비밀번호')).then(b =>
  //     console.log([...new Uint8Array(b)].map(x => x.toString(16).padStart(2,'0')).join('')))
  passwordHash: '3e6fadf870460e8de27944dbf668c111feafdecd7ad396aff65380cde34051b4',
  defaultLang: 'ko',
  maxAttempts: 5,   // 이 횟수만큼 틀리면 잠금
  lockoutMs:   30000, // 잠금 지속 시간 (ms)
};

// 지원 언어 — Language Select 화면 버튼 순서와 동일
const LANGUAGES = [
  { code: 'ko', label: '한국어' },
  { code: 'en', label: 'English' },
  { code: 'ja', label: '日本語' },
  { code: 'zh', label: '中文' },
];

const UI_TEXT = {
  ko: { pw_error: '비밀번호가 올바르지 않습니다' },
  en: { pw_error: 'Incorrect password' },
  ja: { pw_error: 'パスワードが正しくありません' },
  zh: { pw_error: '密码不正确' },
};

const LOCK_TEXT = {
  ko: s => `너무 많이 틀렸습니다. ${s}초 후 다시 시도해 주세요`,
  en: s => `Too many attempts. Try again in ${s}s`,
  ja: s => `試行回数が多すぎます。${s}秒後に再試行してください`,
  zh: s => `尝试次数过多，请在 ${s} 秒后重试`,
};

// Language Select — 언어 선택 전이라 4개 언어 문구를 동시에 보여줌
const LANGUAGE_SELECT_TEXT = {
  subtitle: [
    '언어를 선택해 주세요',
    'Please select a language',
    '言語を選択してください',
    '请选择语言',
  ],
};

// Gate Screen — PIN 입력 화면
const GATE_PIN_TEXT = {
  ko: { title: '궁이와의 약속', dialogue: '"열쇠에 새겨진 네 자리 숫자를 소인에게 보여 주시어요. 그리하면 근정전으로 가는 문을 활짝 열어드리겠사옵니다!"' },
  en: { title: 'A Promise with Goong-i', dialogue: '"Show me the four digits carved upon your key, if you please! Then I shall throw open the gate to Geunjeongjeon for you!"' },
  ja: { title: 'ミヤビとの約束', dialogue: '「鍵に刻まれた四つの数字を、どうぞわたくしにお見せくださいませ！さすれば勤政殿へ続く門を、ぱあっと開けて差し上げますよ！」' },
  zh: { title: '与宫伊的约定', dialogue: '「请把钥匙上刻着的四个数字给小的看看吧！小的这就为您打开通往勤政殿的大门！」' },
};

// Gate 등장 — PIN 통과 후 캐릭터 등장 화면
const GATE_APPEAR_TEXT = {
  ko: { dialogue: '"전하! 소인은 궁이라 하옵니다. 이 궁궐이라면 구석구석, 소인이 누구보다 잘 알고 있지요! 오늘은 소인만 믿고 따라오시어요. 자, 어서 가보시옵소서!"', cta: '소인과 함께 떠나요!' },
  en: { dialogue: '"Your Majesty! This humble servant is called Goong-i. Every nook and cranny of this palace — nobody knows it better than I! Today, just trust in me and follow along. Now then, shall we be on our way?"', cta: "Let's Go Together!" },
  ja: { dialogue: '「殿下！わたくしめはミヤビと申します。この宮殿のことなら、隅から隅まで、わたくしめが一番よく存じておりますよ！今日はわたくしめにお任せくださいませ。さあ、参りましょう！」', cta: 'いざ、参りましょう！' },
  zh: { dialogue: '「殿下！小的名叫宫伊。这座宫殿的每一个角落，小的都比谁都清楚！今日请只管信小的，跟小的走吧！来，我们这就出发啦！」', cta: '一起出发吧！' },
};

// 7개 장소 이름 (지도 핀 라벨, Chapter 헤더 등에서 공유)
const PLACES = [
  { ko: '경복궁', en: 'Gyeongbokgung', ja: '景福宮', zh: '景福宫' },
  { ko: '흥례문', en: 'Heungnyemun', ja: '興礼門', zh: '兴礼门' },
  { ko: '영제교', en: 'Yeongjegyo', ja: '永済橋', zh: '永济桥' },
  { ko: '근정전', en: 'Geunjeongjeon', ja: '勤政殿', zh: '勤政殿' },
  { ko: '사정전', en: 'Sajeongjeon', ja: '思政殿', zh: '思政殿' },
  { ko: '수정전', en: 'Sujeongjeon', ja: '修政殿', zh: '修政殿' },
  { ko: '경회루', en: 'Gyeonghoeru', ja: '慶会楼', zh: '庆会楼' },
];

// Chapter Screen — 장소별 이야기 (index 0~6 = 경복궁~경회루)
// hero1: 상단 고정 히어로 이미지. extraImages: 본문 문단 사이에 끼워 넣을 이미지들
//   { src, after } — after는 0-based paragraphs 인덱스, 그 문단 뒤에 삽입 (언어 공통)
const CHAPTERS = [
  {
    // 0. 경복궁
    hero1: 'images/02_chapters/01_gyeongbokgung/hero1-900.jpg',
    extraImages: [
      { src: 'images/02_chapters/01_gyeongbokgung/hero2-900.jpg', after: 0 },
    ],
    text: {
      ko: {
        dialogue: '"전하, 드디어 도착하였사옵니다! 지금부터 소인이 궁궐 구석구석을 안내해 드리겠나이다."',
        title: '조선의 법궁, 경복궁',
        paragraphs: [
          '경복궁은 1394년 태조 이성계가 수도를 한양으로 옮기며 지은 조선 제일의 고궁이옵니다. 그 이름에는 "대대로 큰 복을 누리며 나라가 번영하라"는 깊은 뜻이 담겨 있사옵니다. 단순히 임금이 거처하는 공간이 아닌, 조선이 꿈꾸었던 이상과 소망이 깃든 상징적 궁궐이옵니다.',
          '북쪽으로 북악산을 등지고 남쪽으로 목멱산(남산)을 바라보는 이 땅은, 풍수에서 말하는 배산임수(背山臨水)의 형국입니다. 뒤로는 산이 나쁜 기운을 막고, 앞으로는 물이 생명과 번영을 불러오는, 궁궐이 자리하기에 가장 이상적인 곳이었습니다.',
          '1592년 임진왜란으로 대부분이 불탔으나, 19세기 고종 대에 흥선대원군의 주도로 중건되었습니다. 이후 일제강점기와 한국전쟁의 아픔을 겪으면서도, 오늘날 우리 앞에 그 자리를 지키고 있습니다.',
        ],
        cta: '다음 이야기로 · 흥례문',
      },
      en: {
        dialogue: '"Your Majesty, we have arrived at last! From here on, this humble servant shall guide you through every corner of the palace."',
        title: 'The Grand Palace of Joseon, Gyeongbokgung',
        paragraphs: [
          'Gyeongbokgung was built in 1394 when King Taejo Yi Seonggye moved the capital of Joseon to Hanyang — present-day Seoul. Its name carries the profound wish that "great fortune shall be enjoyed for generations, and the kingdom shall prosper." More than a mere royal residence, Gyeongbokgung was erected as a symbolic palace embodying the ideals, aspirations, and the very soul of the Joseon Dynasty.',
          'Built with Bugaksan Mountain to the north and Mongmyeoksan (Namsan) to the south, it embodies the geomantic principle of Baesanimsu (背山臨水) — mountains behind to ward off ill winds, and water before to bring vitality and prosperity.',
          'In 1592, the Imjin War reduced most of the palace to ash, but it was reconstructed in the 19th century under the direction of Regent Heungseon Daewongun. Despite the scars of the colonial period and the Korean War, it proudly stands before us today.',
        ],
        cta: 'Next Story · Heungnyemun Gate',
      },
      ja: {
        dialogue: '「殿下、ついに到着いたしました！これよりわたくしめが宮殿の隅々までご案内いたします。」',
        title: '朝鮮の法宮、景福宮',
        paragraphs: [
          '景福宮は、1394年に太祖・李成桂（イ・ソンゲ）が首都を漢陽（ハニャン）へ移した際に建てた、朝鮮随一の古宮でございます。その名には「代々大きな福を享受し、国が繁栄するように」という深い意味が込められております。単に王が居住する空間ではなく、朝鮮が夢見た理想と願いが込められた象徴的な宮殿でございます。',
          '北には北岳山（プガクサン）を背にし、南には木覓山（モンミョクサン・南山）を望むこの地は、風水で言う「背山臨水（はいざんりんすい）」の地勢でございます。後ろの山が悪い気運を防ぎ、前の水が生命と繁栄を呼び込むという、宮殿が位置するのに最も理想的な場所でございました。',
          '1592年の壬辰倭乱で大部分が焼失いたしましたが、19世紀の高宗（コジョン）の代に興宣大院君（フンソンデウォングン）の主導により再建されました。その後、日本統治時代や朝鮮戦争の痛みを経ながらも、今日私たちの前にその姿をとどめております。',
        ],
        cta: '次のお話へ・興礼門',
      },
      zh: {
        dialogue: '「殿下，终于到了！从现在起，小的将为您引路，带您走遍这座宫殿的每一个角落。」',
        title: '朝鲜法宫，景福宫',
        paragraphs: [
          '景福宫乃1394年太祖李成桂将都城迁至汉阳时所建的朝鲜第一古宫。其名蕴含着"祈愿子孙万代享有大福，国家繁荣昌盛"的深意。它不仅是君主居住的空间，更是承载了朝鲜所梦想的理想与期盼的象征性宫殿。',
          '此地北依北岳山，南望木觅山（南山），正是风水学中所说的"背山临水"之格局。后有高山阻挡煞气，前有流水带来生机与繁荣，乃是修建宫殿的最理想之地。',
          '1592年壬辰倭乱时，这里的大部分建筑毁于战火，直到19世纪高宗时期，才在兴宣大院君的主导下得以重建。此后虽历经日本帝国主义强占期与朝鲜战争的创伤，但时至今日，它依然坚守并屹立在我们面前。',
        ],
        cta: '下一段故事・兴礼门',
      },
    },
  },
  {
    // 1. 흥례문
    hero1: 'images/02_chapters/02_heungnyemun/hero1-900.jpg',
    extraImages: [
      { src: 'images/02_chapters/02_heungnyemun/hero2-900.jpg', after: 0 },
      { src: 'images/02_chapters/02_heungnyemun/hero3-900.jpg', after: 1 },
      { src: 'images/02_chapters/02_heungnyemun/hero4-900.jpg', after: 2 },
    ],
    text: {
      ko: {
        dialogue: '"전하, 이 문이 바로 흥례문이옵니다! 광화문과 근정전을 잇는 두 번째 관문이지요."',
        title: '예를 널리 편다, 흥례문',
        paragraphs: [
          '전하, 앞에 보이는 이 문은 흥례문이라 하옵니다. \'예를 일으킨다\'는 뜻을 지닌 경복궁의 중문이자 궁성 안 첫 번째 문이옵니다. 이곳부터는 반드시 예를 갖추어야 하였으며, 조선 시대의 신분증인 호패를 지닌 자만이 통과할 수 있었사옵니다.',
          '발아래를 살펴보시옵소서. 돌길은 세 갈래로 나뉜 삼도(三道)입니다. 가운데 약간 도드라진 어도는 전하만이 지나갈 수 있는 길이며, 좌우의 길은 신하들이 사용하였습니다. 중간의 계단 답도 한가운데에는 봉황이 새겨져 있사옵니다. 봉황은 임금이 바른 정치를 펼쳐 나라가 태평성대를 이룰 때에만 나타난다고 여겨졌사옵니다.',
          '일제강점기에 철거되었던 흥례문은, 광복 50주년인 1995년에 다시 세워졌습니다. 오늘날 이 문은 단순한 건축물이 아닌, 역사를 바로 세우고자 했던 우리 국민의 의지가 담긴 상징입니다.',
        ],
        cta: '다음 이야기로 · 영제교',
      },
      en: {
        dialogue: '"Your Majesty, this gate before us is Heungnyemun! It is the second gateway linking Gwanghwamun and Geunjeongjeon."',
        title: 'Where Propriety Spreads Wide, Heungnyemun',
        paragraphs: [
          'Your Majesty, the gate before you is Heungnyemun — meaning "to elevate propriety." It is the inner gate of Gyeongbokgung and the first gate within the palace walls. From this point forward, all who entered were required to observe proper etiquette, and only those bearing a hopae (identity tablet) were permitted to pass.',
          "Look down at your feet. The stone path is divided into three lanes — the Samdo (三道). The slightly raised center path, called the Eodo, was reserved solely for the king. The side paths were for ministers. At the center of the middle stairway's Dado is carved a phoenix — a creature believed to appear only when the king rules justly and the kingdom is at peace.",
          "During the Japanese colonial period, Japan demolished this gate, but the Republic of Korea restored it in 1995, marking the 50th anniversary of liberation. Today, Heungnyemun is not merely a piece of architecture; it is a symbol of the Korean people's resolve to restore their history.",
        ],
        cta: 'Next Story · Yeongjegyo Bridge',
      },
      ja: {
        dialogue: '「殿下、この門こそが興礼門でございます！光化門と勤政殿を結ぶ二番目の関門でございますよ。」',
        title: '礼を広める、興礼門',
        paragraphs: [
          '殿下、前に見えますこの門は興礼門（フンレムン）と申します。「礼を起こす」という意味を持つ景福宮の中門であり、宮城内の最初の門でございます。ここから先は必ず礼を尽くさねばならず、朝鮮時代の身分証である号牌（ホペ）を持つ者だけが通過することができました。',
          '足元をご覧くださいませ。石道は三つに分かれた三道（サムド）です。中央のやや高い御道（オド）は殿下だけが通れる道であり、左右の道は臣下が使用しておりました。中央の階段、踏道の真ん中には鳳凰が刻まれております。鳳凰は、王が正しい政治を行い国が太平の世を迎えた時にのみ現れると信じられておりました。',
          '日本統治時代に撤去された興礼門は、光復50周年の1995年に再建されました。今日、この門は単なる建築物ではなく、歴史を正そうとした我が国民の意志が込められた象徴でございます。',
        ],
        cta: '次のお話へ・永済橋',
      },
      zh: {
        dialogue: '「殿下，这道门便是兴礼门！它是连接光化门与勤政殿的第二道关卡呢。」',
        title: '弘扬礼仪，兴礼门',
        paragraphs: [
          '殿下，前方所见之门名为"兴礼门"。它意为"兴盛礼仪"，是景福宫的中门，也是进入宫城内部的第一道门。自此门起，必须严守礼仪，只有持有朝鲜时代身份证——号牌之人方可通行。',
          '请看您脚下。石道分为三条，名为三道。中央稍高处为御道，仅供君王通行；左右两侧则供臣子使用。中央台阶答道的正中雕刻着凤凰。凤凰被认为只有在君王施行仁政、国家太平盛世之时才会现身。',
          '曾于日本帝国主义强占期被拆除的兴礼门，在光复50周年的1995年得以重建。今日此门，已不仅是一座建筑，更是凝聚了我国国民纠正历史之意志的象征。',
        ],
        cta: '下一段故事・永济桥',
      },
    },
  },
  {
    // 2. 영제교
    hero1: 'images/02_chapters/03_yeongjegyo/hero1-900.jpg',
    extraImages: [],
    text: {
      ko: {
        dialogue: '"전하, 발밑을 조심하시어요! 이 다리 아래로 맑은 물이 흐르고 있사옵니다."',
        title: '궁궐을 지키는 다리, 영제교',
        paragraphs: [
          '영제교는 궁궐 안으로 흐르는 금천을 건너는 돌다리이옵니다. 다리 옆에는 천록이라는 상상의 동물이 눈을 부릅뜨고 있는데, 나쁜 기운이 궁 안으로 들어오지 못하게 지키는 것이지요. 이 다리를 건너야 비로소 임금의 공간, 근정전에 다다를 수 있사옵니다.',
          '영제교 아래에는 천록(天祿)이라 불리는 상상 속의 동물들이 자리합니다. 왕의 밝은 은혜가 아래로 미칠 때 나타난다고 전해지며, 사악한 기운이 궁 안으로 스며들지 못하도록 묵묵히 임무를 수행하고 있습니다.',
          '북서쪽의 천록이 혀를 길게 내밀고 있는 모습은, 조선 선조들의 해학과 여유를 느낄 수 있는 장면입니다.',
        ],
        cta: '다음 이야기로 · 근정전',
      },
      en: {
        dialogue: '"Your Majesty, please mind your step! Clear water flows beneath this bridge."',
        title: 'The Bridge that Guards the Palace, Yeongjegyo',
        paragraphs: [
          'Yeongjegyo is the stone bridge crossing the Geumcheon stream that flows through the palace grounds. Beside the bridge, imaginary creatures called Cheonrok keep their eyes wide open, standing guard so that ill fortune cannot enter the palace. Only by crossing this bridge may one finally reach Geunjeongjeon, the seat of the king.',
          "Beneath Yeongjegyo Bridge rest mythical beings known as Cheonrok, said to appear when the king's benevolent grace shines upon the world. They stand silent watch, preventing wicked spirits from seeping into the palace.",
          "The Cheonrok to the northwest, stretching its tongue long, offers a glimpse of the wit and ease of Joseon's ancestors.",
        ],
        cta: 'Next Story · Geunjeongjeon Hall',
      },
      ja: {
        dialogue: '「殿下、足元にお気をつけくださいませ！この橋の下には清らかな水が流れております。」',
        title: '宮殿を守る橋、永済橋',
        paragraphs: [
          '永済橋は、宮殿の中を流れる禁川を渡る石橋でございます。橋のそばには天禄という想像上の動物が目を見開いており、悪い気運が宮中に入り込まぬよう見張っているのでございます。この橋を渡ってこそ、ようやく王の空間である勤政殿にたどり着くことができるのでございます。',
          '永済橋（ヨンジェギョ）の下には天禄（テンロク）と呼ばれる想像上の動物たちが位置しております。王の明るい恩恵が下界に及ぶ時に現れると伝えられており、邪悪な気運が宮内に染み込まないよう黙々と任務を遂行しております。',
          '北西側の天禄が舌を長く出している姿は、朝鮮の先祖たちのユーモアと心のゆとりを感じることができる場面でございます。',
        ],
        cta: '次のお話へ・勤政殿',
      },
      zh: {
        dialogue: '「殿下，请小心脚下！这座桥下正流淌着清澈的水呢。」',
        title: '守护宫殿的桥，永济桥',
        paragraphs: [
          '永济桥是横跨宫内金川的石桥。桥边有名为天禄的神兽睁大双眼，守护着不让邪气进入宫中。唯有跨过这座桥，才能真正到达君王的空间——勤政殿。',
          '永济桥下，镇守着名为"天禄"的想象中的神兽。相传当君王的圣明恩泽降临人间时它们才会出现，正默默地履行着使命，防止邪气渗入宫中。',
          '西北侧那只伸长舌头的天禄，尽显朝鲜先祖们的幽默与从容。',
        ],
        cta: '下一段故事・勤政殿',
      },
    },
  },
  {
    // 3. 근정전
    hero1: 'images/02_chapters/04_geunjeongjeon/hero1-900.jpg',
    extraImages: [
      { src: 'images/02_chapters/04_geunjeongjeon/hero2-900.jpg', after: 0 },
      { src: 'images/02_chapters/04_geunjeongjeon/hero3-900.jpg', after: 1 },
    ],
    text: {
      ko: {
        dialogue: '"전하, 이곳이 바로 근정전이옵니다! 궁궐에서 가장 중심이 되는 곳이지요~"',
        title: '왕의 자리, 근정전',
        paragraphs: [
          '전하, 경복궁에서 가장 중심이 되는 근정전이옵니다. \'근정\'이란 부지런하면 천하의 일을 잘 다스릴 수 있다는 뜻이옵니다. 이곳에서 국가 행사를 거행하고 외국 사신을 맞이하였으며, 1985년 국보로 지정되었사옵니다.',
          '앞마당인 조정 바닥에는 박석이 깔려 있습니다. 거친 표면은 여름철 강한 햇빛을 난반사시켜 눈부심을 줄여 주고, 비가 오는 날에는 돌 사이 틈으로 물이 빠져나가 마당이 잠기지 않도록 하였사옵니다. 조선 선조들의 뛰어난 과학적 지혜를 보여주는 대목이옵니다.',
          '근정전 건물을 정면 오른쪽 끝 처마 쪽 45도 각도에서 바라보면, 뒤로 펼쳐진 산이 건물의 일부처럼 어우러집니다. 자연을 빌려 풍경을 완성하는 조선 건축 철학인 \'차경\'이 구현된 조선 건축 자연미의 극치라 할 수 있사옵니다.',
        ],
        cta: '다음 이야기로 · 사정전',
      },
      en: {
        dialogue: '"Your Majesty, this is Geunjeongjeon! It is the very heart of the palace~"',
        title: 'The Seat of the King, Geunjeongjeon',
        paragraphs: [
          'Your Majesty, this is Geunjeongjeon — the heart of Gyeongbokgung. The name carries the meaning that "diligence brings order to all under heaven." It was here that state ceremonies were held and foreign envoys received. It was designated a National Treasure in 1985.',
          "The courtyard floor is paved with unpolished granite stones called Bakseok. Their rough surface scatters summer sunlight to reduce glare, and on rainy days water drains through the gaps so the courtyard never floods. A testament to the remarkable scientific wisdom of Joseon's ancestors.",
          'Looking at Geunjeongjeon from a 45-degree angle from the right corridor, you can see the mountains behind merging naturally as part of the structure — the ultimate realization of Chaegyeong, the Joseon philosophy of completing the landscape by borrowing from nature.',
        ],
        cta: 'Next Story · Sajeongjeon Hall',
      },
      ja: {
        dialogue: '「殿下、こちらが勤政殿でございます！宮殿で最も中心となる場所ですよ〜」',
        title: '王の座、勤政殿',
        paragraphs: [
          '殿下、景福宮で最も中心となる勤政殿（クンジョンジョン）でございます。「勤政」とは、勤勉であれば天下の事をよく治めることができるという意味でございます。ここで国家行事を取り行い、外国の使臣を迎い入れておりました。1985年に国宝に指定されております。',
          '前庭である朝廷（チョジョン）の床には薄石（パクソク）が敷かれています。その粗い表面は夏の強い日差しを乱反射させてまぶしさを和らげ、雨の日には石の隙間から水が抜けて庭が水没しないようにしておりました。朝鮮の先祖たちの優れた科学的知恵を示す箇所でございます。',
          '勤政殿の建物を正面右端の軒先の方、45度の角度から眺めますと、後ろに広がる山が建物の一部のように調和いたします。自然を借りて風景を完成させる朝鮮建築哲学「借景」が体現された、朝鮮建築の自然美の極致といえるでしょう。',
        ],
        cta: '次のお話へ・思政殿',
      },
      zh: {
        dialogue: '「殿下，这里就是勤政殿！是宫中最核心的地方哦～」',
        title: '王座之地，勤政殿',
        paragraphs: [
          '殿下，这里便是景福宫最为中心的勤政殿。"勤政"意为只要勤勉，便能治理好天下之事。这里曾是举行国家大典、接见外国使臣之所，并于1985年被指定为国宝。',
          '作为前院的朝廷地面上，铺设着薄石。其粗糙的表面能散射夏日强烈的阳光，减少刺眼感；下雨天时，水从石缝间排出，使庭院不会积水。这正是朝鲜先祖卓越科学智慧的体现。',
          '若站在勤政殿正面右侧屋檐尽头45度角望去，背后连绵的群山便如同建筑的一部分般交相辉映。这正是朝鲜建筑哲学"借景"的极致体现——借自然之景以完成风景。',
        ],
        cta: '下一段故事・思政殿',
      },
    },
  },
  {
    // 4. 사정전
    hero1: 'images/02_chapters/05_sajeongjeon/hero1-900.jpg',
    extraImages: [],
    text: {
      ko: {
        dialogue: '"전하, 이곳은 근정전 바로 뒤편이옵니다! 매일 정사를 살피시던 편전이지요."',
        title: '생각하며 다스리다, 사정전',
        paragraphs: [
          '전하, 근정전이 나라의 격식을 드러내는 무대였다면, 이 사정전은 전하께서 매일 나라의 일을 고민하시던 현실의 공간이옵니다. \'선정을 깊이 생각하다\'는 뜻 그대로, 신하들과 함께 정사를 논하고 일상 업무를 처리하던 공식 집무실이옵니다.',
          '사정전 동쪽에는 만춘전이, 서쪽에는 천추전이 자리합니다. 만춘전은 \'만년의 봄\', 천추전은 \'천년의 가을\'이라는 뜻으로, 기온에 따라 자리를 옮기며 사계절 내내 올바른 정치를 위해 달려갈 수 있었사옵니다.',
          '용상 옆에 놓인 책상이 보이십니까? 이 자리는 전하의 곁에서 한마디도 빠짐없이 기록하던 사관과 주서가 자리하던 곳으로, 바로 이 공간에서 조선왕조실록, 승정원일기를 비롯한 수많은 국가 기록이 탄생했사옵니다.',
        ],
        cta: '다음 이야기로 · 수정전',
      },
      en: {
        dialogue: '"Your Majesty, this lies just behind Geunjeongjeon! It is the office where you attended to state affairs each day."',
        title: 'To Govern Through Deep Thought, Sajeongjeon',
        paragraphs: [
          'Your Majesty, if Geunjeongjeon was the stage for formal ceremonies, Sajeongjeon was the everyday office where the king contemplated the affairs of the kingdom. True to its name — "to think deeply upon benevolent governance" — this was the official royal office where the king deliberated with ministers.',
          'To its east stands Manchunjeon ("Spring of Ten Thousand Years") and to its west Cheonchujeon ("Autumn of a Thousand Years"). The king moved between them according to the seasons, never ceasing in his pursuit of righteous governance throughout the year.',
          'Do you see the desk beside the throne? That was where royal scribes and secretaries sat, recording every word without exception. Within these very walls were born the Annals of the Joseon Dynasty and the Seungjeongwon Ilgi — world-record-scale historical archives.',
        ],
        cta: 'Next Story · Sujeongjeon Hall',
      },
      ja: {
        dialogue: '「殿下、こちらは勤政殿のすぐ裏手でございます！毎日政務をご覧になっていた便殿でございますよ。」',
        title: '考えながら治める、思政殿',
        paragraphs: [
          '殿下、勤政殿が国の格式を示す舞台であったとすれば、この思政殿（サジョンジョン）は殿下が毎日国の事を悩まれた現実の空間でございます。「政（まつりごと）を深く思う」という言葉の通り、臣下たちと共に国政を論じ、日常業務を処理した公式の執務室（便殿）でございます。',
          '思政殿の東側には万春殿（マンチュンジョン・「万年の春」）が、西側には千秋殿（チョンチュジョン・「千年の秋」）が位置しております。気温に応じて移動しながら、殿下は四季を通じて正しい政治のために励むことができたのでございます。',
          '用床の隣に置かれた机が見えますか？そこは殿下のそばで一言も漏らさず記録した史官と注書が座っていた場所で、この空間でこそ、朝鮮王朝実録・承政院日記をはじめとする数多くの国家記録が誕生したのでございます。',
        ],
        cta: '次のお話へ・修政殿',
      },
      zh: {
        dialogue: '「殿下，这里就在勤政殿正后方！是您每日处理政务的便殿呢。」',
        title: '深思而治，思政殿',
        paragraphs: [
          '殿下，若说勤政殿是彰显国家威仪的舞台，那么这思政殿便是殿下每日苦思国事之空间。正如其名"深思善政"一般，这里是与臣子们共商国是、处理日常政务的官方办公处（便殿）。',
          '思政殿东侧为万春殿（"万年之春"），西侧为千秋殿（"千年之秋"）。随气温变换，殿下得以四季不断地为正道政治而奔走。',
          '您看到龙床旁边那张书桌了吗？那便是紧随殿下身边、一字不漏地记录的史官与注书之位所在。正是在这个空间里，朝鲜王朝实录、承政院日记等大量国家史料在此诞生。',
        ],
        cta: '下一段故事・修政殿',
      },
    },
  },
  {
    // 5. 수정전
    hero1: 'images/02_chapters/06_sujeongjeon/hero1-900.jpg',
    extraImages: [],
    text: {
      ko: {
        dialogue: '"전하, 이곳이 바로 그 유명한 자리이옵니다! 훈민정음이 태어난 곳이지요."',
        title: '한글이 태어난 곳, 수정전',
        paragraphs: [
          '이곳 수정전은 \'정치를 바르게 닦는다\'는 뜻을 지녔으며, 대한민국 역사에 큰 획을 그은 공간이옵니다.',
          '세종대왕 재위 시기에 집현전으로 사용되어, 바로 이 자리에서 오늘날 한글인 훈민정음이 탄생하였사옵니다. 훈민정음은 소리의 원리를 과학적으로 구현한 문자로, 세계에서 가장 체계적이고 과학적인 문자 중 하나로 평가받습니다. 그 해설서인 훈민정음해례본은 유네스코 세계기록유산으로 등재되어 있사옵니다.',
          '19세기 말, 수정전은 군국기무처로 활용되며 갑오개혁이 추진되었고, 이 개혁을 통해 조선은 오랜 신분제를 폐지하고 근대 국가로 나아가기 위한 첫걸음을 내디뎠사옵니다. 이처럼 수정전은 한글의 탄생지, 근대 개혁의 출발점이라는 역사적 가치를 인정받아 2012년 보물로 지정되었사옵니다.',
        ],
        cta: '다음 이야기로 · 경회루',
      },
      en: {
        dialogue: '"Your Majesty, this is that very famous place! It is where Hunminjeongeum was born."',
        title: 'Where Hangeul Was Born, Sujeongjeon',
        paragraphs: [
          'This hall is Sujeongjeon — meaning "to cultivate righteous governance." It is a space that left a profound mark on Korean history.',
          'During the reign of King Sejong the Great, it served as Jiphyeonjeon (Hall of Worthies), where Hunminjeongeum — the writing system known today as Hangeul — was born. Hangeul is recognized as one of the most systematic and scientific scripts in the world. Its annotation manual, the Hunminjeongeum Haeryebon, is listed as a UNESCO Memory of the World.',
          'In the late 19th century, Sujeongjeon housed the Office for the Deliberation of State Affairs, where the Gabo Reform was initiated — abolishing the centuries-old class system and taking the first steps toward a modern state. Recognized for its historical value as the birthplace of Hangeul and the starting point of modern reform, it was designated a Treasure in 2012.',
        ],
        cta: 'Next Story · Gyeonghoeru Pavilion',
      },
      ja: {
        dialogue: '「殿下、こちらがあの有名な場所でございます！訓民正音が誕生した地でございますよ。」',
        title: 'ハングルが生まれた場所、修政殿',
        paragraphs: [
          'ここ修政殿（スジョンジョン）は「政治を正しく修める」という意味を持ち、大韓民国の歴史に大きな一画を引いた空間でございます。',
          '世宗大王の在位時期に集賢殿（チッピョンジョン）として使用され、まさにこの場所で今日のハングルである訓民正音（フンミンジョンウム）が誕生いたしました。訓民正音は音の原理を科学的に具現化した文字であり、世界で最も体系的かつ科学的な文字の一つとして評価されております。その解説書である訓民正音解例本はユネスコ世界記録遺産に登録されております。',
          '19世紀末、修政殿は軍国機務処として活用され甲午改革が推進され、この改革によって朝鮮は長年の身分制を廃止し近代国家へと踏み出す第一歩を刻みました。このように修政殿はハングルの誕生地、近代改革の出発点としての歴史的価値が認められ、2012年に宝物に指定されました。',
        ],
        cta: '次のお話へ・慶会楼',
      },
      zh: {
        dialogue: '「殿下，这里正是那个著名的地方！训民正音就诞生于此呢。」',
        title: '韩文诞生之地，修政殿',
        paragraphs: [
          '此处修政殿意为"修明政治"，在韩国历史上留下了浓墨重彩的一笔。',
          '世宗大王在位时期，这里曾被用作集贤殿，正是在此地，诞生了今日的韩文——训民正音。训民正音科学地体现了发声原理，被誉为世界上最系统、最科学的文字之一。其解说书《训民正音解例本》已被列入联合国教科文组织世界记忆遗产名录。',
          '19世纪末，修政殿曾作为军国机务处运作，推进了甲午改革。通过这次改革，朝鲜废除了延续已久的身份制度，迈出了走向近代国家的第一步。修政殿作为韩文诞生地、近代改革出发点的历史价值得到认可，于2012年被指定为宝物。',
        ],
        cta: '下一段故事・庆会楼',
      },
    },
  },
  {
    // 6. 경회루
    hero1: 'images/02_chapters/07_gyeonghoeru/hero1-900.jpg',
    extraImages: [
      { src: 'images/02_chapters/07_gyeonghoeru/hero2-900.jpg', after: 1 },
    ],
    text: {
      ko: {
        dialogue: '"전하, 드디어 마지막 이야기이옵니다! 저 아름다운 누각이 보이시는지요?"',
        title: '연못 위의 잔치, 경회루',
        paragraphs: [
          '전하, 이곳은 경사스러운 연회라는 뜻을 지닌 경회루이옵니다. 나라의 큰 경사가 있을 때 연회를 베풀어 외국 사신을 접대하였으며, 연못 둘레에 담장이 둘러져 아무나 접근할 수 없었던 조선 왕실 최고의 연회 공간이옵니다.',
          '경회루는 원형으로, 이를 받치는 연못은 사각형으로 설계되었사옵니다. 이는 사각형이 땅을, 원형이 하늘을 상징한다는 \'천원지방(天圓地方)\'의 전통적 해석을 따른 것이옵니다.',
          '경회루 2층 추녀마루 끝의 잡상은 우리나라 건축물 가운데 가장 많은 11개로, 이 공간의 위상과 중요함을 다시금 알 수 있사옵니다. 마지막으로 연못을 바라봐 주시옵소서. 1990년대 연못에서 발견된 두 마리의 청동용은 단순한 전설을 넘어 이 공간을 지켜온 상징이라 할 수 있겠사옵니다.',
        ],
        cta: '여정을 마치다',
      },
      en: {
        dialogue: '"Your Majesty, this is the final story at last! Do you see that beautiful pavilion?"',
        title: 'A Banquet Upon the Pond, Gyeonghoeru',
        paragraphs: [
          'Your Majesty, this is Gyeonghoeru — meaning "joyful gathering." True to its name, grand banquets were held here to entertain foreign envoys on occasions of great national celebration. Enclosed by walls around the pond, it was the grandest banquet hall of the Joseon court.',
          'Gyeonghoeru is circular in form, while the pond supporting it is square — a design reflecting the traditional cosmological view of Cheonwonjibang (天圓地方): the circle represents heaven, the square represents the earth.',
          'The roofline of the second floor bears 11 japsang (decorative figurines) — the most of any building in Korea — a testament to the pavilion’s supreme status. Look out upon the pond: the two bronze dragons discovered there in the 1990s are more than legend; they are the guardians of this enduring space.',
        ],
        cta: 'Complete the Journey',
      },
      ja: {
        dialogue: '「殿下、ついに最後のお話でございます！あの美しい楼閣が見えますでしょうか？」',
        title: '池の上の宴、慶会楼',
        paragraphs: [
          '殿下、こちらは慶事の宴会という意味を持つ慶会楼（キョンフェル）でございます。国に大きな慶事がある際に宴を開き、外国の使臣をもてなした場所であり、池の周りに塀が巡らされ、誰もが近づくことはできなかった朝鮮王室最高の宴会空間でございます。',
          '慶会楼は円形で、これを支える池は四角形に設計されております。これは四角形が大地を、円形が天を象徴するという「天円地方（チョンウォンジバン）」の伝統的な解釈に基づいたものでございます。',
          '2層の棟先の端に見られる雑像（チャプサン）は11個で、我が国の建築物の中で最も多く、この空間の威相と重要性を改めて示しています。最後に池をご覧くださいませ。1990年代に池で発見された2匹の青銅龍は、単なる伝説を超えてこの空間を守り続けてきた象徴といえるでしょう。',
        ],
        cta: '旅を終える',
      },
      zh: {
        dialogue: '「殿下，终于到了最后的故事！您看见那座美丽的楼阁了吗？」',
        title: '池上盛宴，庆会楼',
        paragraphs: [
          '殿下，这里是寓意喜庆宴会的庆会楼。每逢国家有大庆之事，便会在此设宴款待外国使臣。昔日莲池四周环绕着围墙，外人无法轻易靠近，是朝鲜王室最高规格的宴会场所。',
          '庆会楼呈圆形，而承托它的莲池则被设计成方形。这是遵循"天圆地方"传统宇宙观的体现——方形象征大地，圆形象征苍天。',
          '庆会楼二层屋脊端设有11个杂像，是韩国建筑中数量最多的，充分说明了这一空间的崇高地位与重要性。最后请望向莲池：1990年代在池中发现的两条青铜龙，已超越传说本身，成为守护这片空间的象征。',
        ],
        cta: '结束旅程',
      },
    },
  },
];

// 7개 장소 핀 좌표 — Figma 6개 지도 화면에서 전부 동일한 값을 사용하고 있어
// (지도마다 완료/진행중/잠김 상태만 바뀜) 지도별로 반복 저장하지 않고 공용으로 둠.
// 375px 기준 화면 좌표(px, 핀 "중심점" — 완료/잠김 22px, 진행중 30px 핀 모두 같은 중심을 공유하는 것을
// Figma map5/map6 데이터로 교차 검증함) — CSS에서 %로 변환해 사용.
const MAP_PIN_POSITIONS = [
  { x: 185, y: 605 }, // 경복궁
  { x: 204, y: 566 }, // 흥례문
  { x: 186, y: 543 }, // 영제교
  { x: 205, y: 462 }, // 근정전
  { x: 207, y: 424 }, // 사정전
  { x: 141, y: 446 }, // 수정전
  { x: 130, y: 390 }, // 경회루
];
// 라벨을 핀 중심에서 가로로 얼마나 띄울지(px) — 지도 오른쪽 여백이 좁은 핀(영제교·수정전·경회루)은
// 라벨이 지도 밖으로 나가지 않도록 핀 왼쪽에 표시
const MAP_LABEL_OFFSETS = [17, 17, -78, 21, 17, -53, -86];
// 지도 이미지 자체의 화면상 위치/크기 (375px 기준) — 핀 좌표를 지도 기준 %로 환산할 때 사용
const MAP_GEOMETRY = { mapLeft: -1, mapTop: 171, mapW: 376, mapH: 519 };

// 이동 중(맵) 화면 — index 0~5 = 경복궁→흥례문 ... 수정전→경회루 (6개)
// fromIdx까지는 completed, toIdx는 current, 그 이후는 locked로 자동 계산됨
// legend/cta 문구는 6개 지도 모두 언어별로 동일 (Figma에서 확인됨) — title만 도착지 장소명으로 교체
const MAP_LEGEND_CTA = {
  ko: { legend: ['완료', '진행중', '잠김'], cta: '도착했어요!' },
  en: { legend: ['Completed', 'Current', 'Locked'], cta: "I've Arrived!" },
  ja: { legend: ['完了', '進行中', 'ロック'], cta: '到着しました！' },
  zh: { legend: ['已完成', '进行中', '未解锁'], cta: '我到达了！' },
};
const MAPS = [
  {
    image: 'images/03_maps/map-bg-900.webp',
    fromIdx: 0, toIdx: 1, // 경복궁 → 흥례문
    text: {
      ko: { title: '흥례문으로 가는 길', stamp: n => `STAMP ${n} / 7 완료`, ...MAP_LEGEND_CTA.ko },
      en: { title: 'Walking to Heungnyemun', stamp: n => `STAMP ${n} / 7 Complete`, ...MAP_LEGEND_CTA.en },
      ja: { title: '興礼門への道', stamp: n => `スタンプ ${n} / 7 達成`, ...MAP_LEGEND_CTA.ja },
      zh: { title: '前往兴礼门', stamp: n => `印章 ${n} / 7 达成`, ...MAP_LEGEND_CTA.zh },
    },
  },
  {
    image: 'images/03_maps/map-bg-900.webp',
    fromIdx: 1, toIdx: 2, // 흥례문 → 영제교
    text: {
      ko: { title: '영제교로 가는 길', stamp: n => `STAMP ${n} / 7 완료`, ...MAP_LEGEND_CTA.ko },
      en: { title: 'Walking to Yeongjegyo', stamp: n => `STAMP ${n} / 7 Complete`, ...MAP_LEGEND_CTA.en },
      ja: { title: '永済橋への道', stamp: n => `スタンプ ${n} / 7 達成`, ...MAP_LEGEND_CTA.ja },
      zh: { title: '前往永济桥', stamp: n => `印章 ${n} / 7 达成`, ...MAP_LEGEND_CTA.zh },
    },
  },
  {
    image: 'images/03_maps/map-bg-900.webp',
    fromIdx: 2, toIdx: 3, // 영제교 → 근정전
    text: {
      ko: { title: '근정전으로 가는 길', stamp: n => `STAMP ${n} / 7 완료`, ...MAP_LEGEND_CTA.ko },
      en: { title: 'Walking to Geunjeongjeon', stamp: n => `STAMP ${n} / 7 Complete`, ...MAP_LEGEND_CTA.en },
      ja: { title: '勤政殿への道', stamp: n => `スタンプ ${n} / 7 達成`, ...MAP_LEGEND_CTA.ja },
      zh: { title: '前往勤政殿', stamp: n => `印章 ${n} / 7 达成`, ...MAP_LEGEND_CTA.zh },
    },
  },
  {
    image: 'images/03_maps/map-bg-900.webp',
    fromIdx: 3, toIdx: 4, // 근정전 → 사정전
    text: {
      ko: { title: '사정전으로 가는 길', stamp: n => `STAMP ${n} / 7 완료`, ...MAP_LEGEND_CTA.ko },
      en: { title: 'Walking to Sajeongjeon', stamp: n => `STAMP ${n} / 7 Complete`, ...MAP_LEGEND_CTA.en },
      ja: { title: '思政殿への道', stamp: n => `スタンプ ${n} / 7 達成`, ...MAP_LEGEND_CTA.ja },
      zh: { title: '前往思政殿', stamp: n => `印章 ${n} / 7 达成`, ...MAP_LEGEND_CTA.zh },
    },
  },
  {
    image: 'images/03_maps/map-bg-900.webp',
    fromIdx: 4, toIdx: 5, // 사정전 → 수정전
    text: {
      ko: { title: '수정전으로 가는 길', stamp: n => `STAMP ${n} / 7 완료`, ...MAP_LEGEND_CTA.ko },
      en: { title: 'Walking to Sujeongjeon', stamp: n => `STAMP ${n} / 7 Complete`, ...MAP_LEGEND_CTA.en },
      ja: { title: '修政殿への道', stamp: n => `スタンプ ${n} / 7 達成`, ...MAP_LEGEND_CTA.ja },
      zh: { title: '前往修政殿', stamp: n => `印章 ${n} / 7 达成`, ...MAP_LEGEND_CTA.zh },
    },
  },
  {
    image: 'images/03_maps/map-bg-900.webp',
    fromIdx: 5, toIdx: 6, // 수정전 → 경회루
    text: {
      ko: { title: '경회루로 가는 길', stamp: n => `STAMP ${n} / 7 완료`, ...MAP_LEGEND_CTA.ko },
      en: { title: 'Walking to Gyeonghoeru', stamp: n => `STAMP ${n} / 7 Complete`, ...MAP_LEGEND_CTA.en },
      ja: { title: '慶会楼への道', stamp: n => `スタンプ ${n} / 7 達成`, ...MAP_LEGEND_CTA.ja },
      zh: { title: '前往庆会楼', stamp: n => `印章 ${n} / 7 达成`, ...MAP_LEGEND_CTA.zh },
    },
  },
];

// 궁이 이름 — 언어별로 다르게 번역됨 (Gate 등장/Closing 대사에서 이미 쓰인 표기와 통일)
const CHARACTER_NAME = { ko: '궁이', en: 'Goong-i', ja: 'ミヤビ', zh: '宫伊' };

// Closing Screen
const CLOSING_TEXT = {
  ko: { headline: '여정을 모두 마쳤어요!', summary: '경복궁부터 경회루까지, 7곳을 모두 둘러보았어요', farewell: '"이로써 소신 궁이가 준비한 안내는 여기까지이옵니다. 이 궁 곳곳에 숨겨진 장소들을 함께 찾아다니며 즐거운 시간을 보내셨기를 바라옵니다. 부디 이 길이 오래도록 기억에 남는 산책이 되기를 바라옵니다."', cta: '처음부터 다시 보기', instagram: '인스타그램에서 만나요' },
  en: { headline: "You've Completed the Journey!", summary: 'From Gyeongbokgung to Gyeonghoeru — all 7 stops explored', farewell: '"And so, the guidance this humble servant Goong-i prepared for you comes to an end here. I do hope Your Majesty enjoyed seeking out the hidden corners of this palace together with me. May this walk remain a cherished memory for years to come."', cta: 'Start Over', instagram: 'Meet Us on Instagram' },
  ja: { headline: '旅を全て終えました！', summary: '景福宮から慶会楼まで、7か所すべて巡りました', farewell: '「これにて、わたくしめミヤビがご用意したご案内はここまででございます。この宮殿のあちこちに隠された場所を共に巡りながら、楽しいひとときをお過ごしいただけましたら幸いでございます。どうかこの道が、末長く記憶に残る散策となりますよう願っております。」', cta: '最初に戻る', instagram: 'インスタグラムでも会いましょう' },
  zh: { headline: '旅程圆满结束！', summary: '从景福宫到庆会楼，7个地点全部游览完毕', farewell: '「至此，微臣宫伊为您准备的导览便告一段落了。愿您方才寻访这座宫殿中隐藏的角落时，已度过了愉快的时光。愿此行能成为您记忆中长久留存的漫步。」', cta: '回到开始', instagram: '在Instagram上与我们相见' },
};

const INSTAGRAM_URL = 'https://www.instagram.com/goongnori/';
