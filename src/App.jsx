import { useState, useEffect, createContext, useContext } from 'react'

// ============================================
// LANGUAGE & TRANSLATIONS SYSTEM
// ============================================

const LANGUAGES = [
  { id: 'en', label: 'English', native: 'English', flag: '🇺🇸' },
  { id: 'ko', label: 'Korean', native: '한국어', flag: '🇰🇷' },
  { id: 'ja', label: 'Japanese', native: '日本語', flag: '🇯🇵' },
]

const TRANSLATIONS = {
  en: {
    // App
    appName: 'koja',
    tagline: 'Finding connection and your love language',
    // Navigation
    discover: 'Discover',
    messages: 'Messages',
    profile: 'Profile',
    // Welcome
    getStarted: 'Get Started',
    alreadyHaveAccount: 'Already have an account?',
    signIn: 'Sign In',
    // Sign Up
    basicInfo: 'Basic Information',
    letsStart: "Let's start with the basics",
    fullName: 'Full Name',
    enterName: 'Enter your name',
    email: 'Email',
    dateOfBirth: 'Date of Birth',
    gender: 'Gender',
    male: 'Male',
    female: 'Female',
    other: 'Other',
    location: 'Location',
    cityCountry: 'City, Country',
    continue: 'Continue',
    addPhotos: 'Add Photos & Video',
    showPersonality: 'Show off your personality',
    profilePhoto: 'Profile Photo',
    addPhoto: 'Add Photo',
    introVideo: 'Introduction Video (Optional)',
    addVideo: 'Add a short video (max 30 sec)',
    videoUploaded: 'Video uploaded!',
    videoHelp: 'A video helps you stand out and get 3x more matches!',
    bio: 'Bio',
    tellAboutYourself: 'Tell others about yourself...',
    yourInterests: 'Your Interests',
    selectInterests: 'Select at least 3 interests',
    minimum: 'minimum',
    termsPreferences: 'Terms & Preferences',
    almostThere: 'Almost there!',
    agreeTerms: 'I agree to the Terms & Conditions',
    termsDescription: 'By checking this, you agree to our Terms of Service and Privacy Policy',
    marketingComms: 'Marketing Communications',
    marketingDescription: 'Receive updates about new features, tips, and special offers',
    createAccount: 'Create Account',
    // Subscription
    choosePlan: 'Choose Your Plan',
    unlockExperience: 'Unlock the full Koja experience',
    mostPopular: 'MOST POPULAR',
    continueWithFree: 'Continue with Free',
    startFreeTrial: 'Start Free Trial',
    freeTrialNote: '7-day free trial, cancel anytime',
    free: 'Free',
    standard: 'Standard',
    premium: 'Premium',
    forever: 'forever',
    perMonth: '/month',
    limitedMatches: 'Limited to 5 matches per day',
    soloGame: 'Solo language learning game',
    basicProfile: 'Basic profile',
    unlimitedMatches: 'Unlimited matches',
    conversationStarters: 'Conversation starter questions',
    multiplayerGames: 'Multiplayer language games',
    seeWhoLikes: 'See who likes you',
    everythingStandard: 'Everything in Standard',
    aiDatePlanning: 'AI date planning recommendations',
    virtualGifts: 'Virtual gift feature',
    priorityVisibility: 'Priority profile visibility',
    readReceipts: 'Read receipts',
    // Chat
    online: 'Online',
    typeMessage: 'Type a message...',
    date: 'Date',
    game: 'Game',
    gift: 'Gift',
    ideas: 'Ideas',
    sendGift: 'Send a Gift',
    yourPoints: 'Your Points',
    send: 'Send',
    planDate: 'Plan a Date',
    generateDateIdea: 'Generate Date Idea',
    generatingIdea: 'Generating idea...',
    generateAnother: 'Generate Another',
    shareWith: 'Share with',
    premiumFeature: 'Premium Feature',
    upgradePremium: 'Upgrade to Premium',
    upgradeStandard: 'Upgrade to Standard',
    maybeLater: 'Maybe Later',
    datePlanningLocked: 'Upgrade to Premium to unlock AI-powered date planning',
    // Conversation Starters
    conversationStartersTitle: 'Conversation Starters',
    casualQuestions: 'Casual & Fun',
    seriousQuestions: 'Deep & Meaningful',
    standardFeature: 'Standard Feature',
    startersLocked: 'Upgrade to Standard to unlock conversation starters',
    // Game
    gameComplete: 'Game Complete!',
    youEarned: 'You earned',
    points: 'points',
    totalPoints: 'total points',
    done: 'Done',
    whatDoesThisMean: 'What does this mean?',
    nextQuestion: 'Next Question',
    seeResults: 'See Results',
    startGame: 'Start Game',
    playTogether: 'Play Together',
    yourTurn: 'Your Turn!',
    theirTurn: "'s Turn",
    waiting: 'Waiting...',
    correct: 'Correct!',
    incorrect: 'Incorrect',
    // Profile
    editProfile: 'Edit Profile',
    subscription: 'Subscription',
    discoverySettings: 'Discovery Settings',
    notifications: 'Notifications',
    helpSupport: 'Help & Support',
    privacyPolicy: 'Privacy Policy',
    logOut: 'Log Out',
    languageGame: 'Language Game',
    learnAndEarn: 'Learn languages & earn points',
    likes: 'Likes',
    matches: 'Matches',
    superLikes: 'Super Likes',
    saveChanges: 'Save Changes',
    updateVideo: 'Update Video',
    languageSettings: 'Language Settings',
    appLanguage: 'App Language',
    // Match
    itsAMatch: "It's a Match!",
    youBothLiked: 'You and {name} liked each other',
    sendMessage: 'Send a Message',
    keepSwiping: 'Keep Swiping',
    // Empty State
    noMoreProfiles: 'No more profiles',
    dailyLimitReached: 'Daily limit reached',
    checkBackLater: 'Check back later for more people in your area',
    upgradeUnlimited: 'Upgrade to get unlimited matches',
    expandSearch: 'Expand Search',
    upgradeNow: 'Upgrade Now',
    // Translation
    translate: 'Translate',
    originalMessage: 'Original',
    translatedMessage: 'Translated',
    autoTranslate: 'Auto-translate messages',
  },
  ko: {
    appName: 'koja',
    tagline: '연결과 사랑의 언어를 찾아서',
    discover: '발견',
    messages: '메시지',
    profile: '프로필',
    getStarted: '시작하기',
    alreadyHaveAccount: '이미 계정이 있으신가요?',
    signIn: '로그인',
    basicInfo: '기본 정보',
    letsStart: '기본 정보부터 시작해요',
    fullName: '이름',
    enterName: '이름을 입력하세요',
    email: '이메일',
    dateOfBirth: '생년월일',
    gender: '성별',
    male: '남성',
    female: '여성',
    other: '기타',
    location: '위치',
    cityCountry: '도시, 국가',
    continue: '계속',
    addPhotos: '사진 & 영상 추가',
    showPersonality: '당신의 개성을 보여주세요',
    profilePhoto: '프로필 사진',
    addPhoto: '사진 추가',
    introVideo: '소개 영상 (선택)',
    addVideo: '짧은 영상 추가 (최대 30초)',
    videoUploaded: '영상 업로드 완료!',
    videoHelp: '영상은 매치 확률을 3배 높여줍니다!',
    bio: '자기소개',
    tellAboutYourself: '자신에 대해 알려주세요...',
    yourInterests: '관심사',
    selectInterests: '최소 3개의 관심사를 선택하세요',
    minimum: '최소',
    termsPreferences: '약관 및 설정',
    almostThere: '거의 다 왔어요!',
    agreeTerms: '이용약관에 동의합니다',
    termsDescription: '서비스 이용약관 및 개인정보처리방침에 동의합니다',
    marketingComms: '마케팅 수신',
    marketingDescription: '새로운 기능, 팁, 특별 혜택에 대한 정보를 받습니다',
    createAccount: '계정 만들기',
    choosePlan: '플랜 선택',
    unlockExperience: 'Koja의 모든 기능을 이용하세요',
    mostPopular: '인기',
    continueWithFree: '무료로 계속',
    startFreeTrial: '무료 체험 시작',
    freeTrialNote: '7일 무료 체험, 언제든 취소 가능',
    free: '무료',
    standard: '스탠다드',
    premium: '프리미엄',
    forever: '영구',
    perMonth: '/월',
    limitedMatches: '하루 5개 매치 제한',
    soloGame: '솔로 언어 학습 게임',
    basicProfile: '기본 프로필',
    unlimitedMatches: '무제한 매치',
    conversationStarters: '대화 시작 질문',
    multiplayerGames: '멀티플레이어 언어 게임',
    seeWhoLikes: '좋아요 한 사람 보기',
    everythingStandard: '스탠다드의 모든 기능',
    aiDatePlanning: 'AI 데이트 추천',
    virtualGifts: '가상 선물 기능',
    priorityVisibility: '프로필 우선 노출',
    readReceipts: '읽음 확인',
    online: '온라인',
    typeMessage: '메시지를 입력하세요...',
    date: '데이트',
    game: '게임',
    gift: '선물',
    ideas: '아이디어',
    sendGift: '선물 보내기',
    yourPoints: '내 포인트',
    send: '보내기',
    planDate: '데이트 계획',
    generateDateIdea: '데이트 아이디어 생성',
    generatingIdea: '생성 중...',
    generateAnother: '다른 아이디어',
    shareWith: '공유하기',
    premiumFeature: '프리미엄 기능',
    upgradePremium: '프리미엄으로 업그레이드',
    upgradeStandard: '스탠다드로 업그레이드',
    maybeLater: '나중에',
    datePlanningLocked: '프리미엄으로 업그레이드하여 AI 데이트 계획을 이용하세요',
    conversationStartersTitle: '대화 시작하기',
    casualQuestions: '가벼운 질문',
    seriousQuestions: '진지한 질문',
    standardFeature: '스탠다드 기능',
    startersLocked: '스탠다드로 업그레이드하여 대화 시작 질문을 이용하세요',
    gameComplete: '게임 완료!',
    youEarned: '획득한 포인트',
    points: '포인트',
    totalPoints: '총 포인트',
    done: '완료',
    whatDoesThisMean: '이것은 무슨 뜻일까요?',
    nextQuestion: '다음 질문',
    seeResults: '결과 보기',
    startGame: '게임 시작',
    playTogether: '함께 플레이',
    yourTurn: '당신 차례!',
    theirTurn: '님 차례',
    waiting: '대기 중...',
    correct: '정답!',
    incorrect: '오답',
    editProfile: '프로필 수정',
    subscription: '구독',
    discoverySettings: '탐색 설정',
    notifications: '알림',
    helpSupport: '도움말 및 지원',
    privacyPolicy: '개인정보처리방침',
    logOut: '로그아웃',
    languageGame: '언어 게임',
    learnAndEarn: '언어를 배우고 포인트를 얻으세요',
    likes: '좋아요',
    matches: '매치',
    superLikes: '슈퍼 좋아요',
    saveChanges: '변경사항 저장',
    updateVideo: '영상 업데이트',
    languageSettings: '언어 설정',
    appLanguage: '앱 언어',
    itsAMatch: '매치 성공!',
    youBothLiked: '당신과 {name}님이 서로 좋아요를 눌렀어요',
    sendMessage: '메시지 보내기',
    keepSwiping: '계속 둘러보기',
    noMoreProfiles: '더 이상 프로필이 없습니다',
    dailyLimitReached: '일일 한도 도달',
    checkBackLater: '나중에 다시 확인해주세요',
    upgradeUnlimited: '업그레이드하여 무제한 매치를 받으세요',
    expandSearch: '검색 확장',
    upgradeNow: '지금 업그레이드',
    translate: '번역',
    originalMessage: '원본',
    translatedMessage: '번역됨',
    autoTranslate: '메시지 자동 번역',
  },
  ja: {
    appName: 'koja',
    tagline: 'つながりと愛の言葉を見つける',
    discover: '発見',
    messages: 'メッセージ',
    profile: 'プロフィール',
    getStarted: '始める',
    alreadyHaveAccount: 'すでにアカウントをお持ちですか？',
    signIn: 'サインイン',
    basicInfo: '基本情報',
    letsStart: '基本情報から始めましょう',
    fullName: '氏名',
    enterName: '名前を入力',
    email: 'メール',
    dateOfBirth: '生年月日',
    gender: '性別',
    male: '男性',
    female: '女性',
    other: 'その他',
    location: '場所',
    cityCountry: '都市、国',
    continue: '続ける',
    addPhotos: '写真と動画を追加',
    showPersonality: 'あなたの個性を見せましょう',
    profilePhoto: 'プロフィール写真',
    addPhoto: '写真を追加',
    introVideo: '紹介動画（任意）',
    addVideo: '短い動画を追加（最大30秒）',
    videoUploaded: '動画がアップロードされました！',
    videoHelp: '動画があるとマッチ率が3倍になります！',
    bio: '自己紹介',
    tellAboutYourself: '自分について教えてください...',
    yourInterests: '興味・関心',
    selectInterests: '3つ以上の興味を選択してください',
    minimum: '最低',
    termsPreferences: '利用規約と設定',
    almostThere: 'もう少しです！',
    agreeTerms: '利用規約に同意します',
    termsDescription: '利用規約とプライバシーポリシーに同意します',
    marketingComms: 'マーケティング通知',
    marketingDescription: '新機能、ヒント、特別オファーの情報を受け取る',
    createAccount: 'アカウント作成',
    choosePlan: 'プランを選択',
    unlockExperience: 'Kojaの全機能をお楽しみください',
    mostPopular: '人気',
    continueWithFree: '無料で続ける',
    startFreeTrial: '無料トライアルを開始',
    freeTrialNote: '7日間無料、いつでもキャンセル可能',
    free: '無料',
    standard: 'スタンダード',
    premium: 'プレミアム',
    forever: '永久',
    perMonth: '/月',
    limitedMatches: '1日5マッチまで',
    soloGame: 'ソロ言語学習ゲーム',
    basicProfile: '基本プロフィール',
    unlimitedMatches: '無制限マッチ',
    conversationStarters: '会話スターター',
    multiplayerGames: 'マルチプレイヤー言語ゲーム',
    seeWhoLikes: 'いいねした人を見る',
    everythingStandard: 'スタンダードの全機能',
    aiDatePlanning: 'AIデートプランニング',
    virtualGifts: 'バーチャルギフト機能',
    priorityVisibility: 'プロフィール優先表示',
    readReceipts: '既読確認',
    online: 'オンライン',
    typeMessage: 'メッセージを入力...',
    date: 'デート',
    game: 'ゲーム',
    gift: 'ギフト',
    ideas: 'アイデア',
    sendGift: 'ギフトを送る',
    yourPoints: 'ポイント',
    send: '送る',
    planDate: 'デートを計画',
    generateDateIdea: 'デートアイデアを生成',
    generatingIdea: '生成中...',
    generateAnother: '別のアイデア',
    shareWith: 'と共有',
    premiumFeature: 'プレミアム機能',
    upgradePremium: 'プレミアムにアップグレード',
    upgradeStandard: 'スタンダードにアップグレード',
    maybeLater: '後で',
    datePlanningLocked: 'プレミアムにアップグレードしてAIデートプランニングを利用',
    conversationStartersTitle: '会話スターター',
    casualQuestions: 'カジュアルな質問',
    seriousQuestions: '真剣な質問',
    standardFeature: 'スタンダード機能',
    startersLocked: 'スタンダードにアップグレードして会話スターターを利用',
    gameComplete: 'ゲーム完了！',
    youEarned: '獲得ポイント',
    points: 'ポイント',
    totalPoints: '合計ポイント',
    done: '完了',
    whatDoesThisMean: 'これはどういう意味ですか？',
    nextQuestion: '次の質問',
    seeResults: '結果を見る',
    startGame: 'ゲーム開始',
    playTogether: '一緒にプレイ',
    yourTurn: 'あなたの番！',
    theirTurn: 'さんの番',
    waiting: '待機中...',
    correct: '正解！',
    incorrect: '不正解',
    editProfile: 'プロフィールを編集',
    subscription: 'サブスクリプション',
    discoverySettings: '検索設定',
    notifications: '通知',
    helpSupport: 'ヘルプ＆サポート',
    privacyPolicy: 'プライバシーポリシー',
    logOut: 'ログアウト',
    languageGame: '言語ゲーム',
    learnAndEarn: '言語を学んでポイントを獲得',
    likes: 'いいね',
    matches: 'マッチ',
    superLikes: 'スーパーいいね',
    saveChanges: '変更を保存',
    updateVideo: '動画を更新',
    languageSettings: '言語設定',
    appLanguage: 'アプリの言語',
    itsAMatch: 'マッチしました！',
    youBothLiked: 'あなたと{name}さんが互いにいいねしました',
    sendMessage: 'メッセージを送る',
    keepSwiping: 'スワイプを続ける',
    noMoreProfiles: 'プロフィールがありません',
    dailyLimitReached: '1日の上限に達しました',
    checkBackLater: '後でまた確認してください',
    upgradeUnlimited: 'アップグレードして無制限マッチを取得',
    expandSearch: '検索を拡大',
    upgradeNow: '今すぐアップグレード',
    translate: '翻訳',
    originalMessage: '原文',
    translatedMessage: '翻訳済み',
    autoTranslate: 'メッセージを自動翻訳',
  },
}

// Language Context
const LanguageContext = createContext()

const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) throw new Error('useLanguage must be used within LanguageProvider')
  return context
}

const useTranslation = () => {
  const { language } = useLanguage()
  return (key, replacements = {}) => {
    let text = TRANSLATIONS[language]?.[key] || TRANSLATIONS.en[key] || key
    Object.entries(replacements).forEach(([k, v]) => {
      text = text.replace(`{${k}}`, v)
    })
    return text
  }
}

// ============================================
// CONSTANTS & DATA
// ============================================

const INTERESTS_OPTIONS = [
  { id: 'kpop', label: { en: 'K-Pop', ko: 'K-Pop', ja: 'K-Pop' }, emoji: '🎤' },
  { id: 'kdrama', label: { en: 'K-Drama', ko: 'K-드라마', ja: 'K-ドラマ' }, emoji: '📺' },
  { id: 'cooking', label: { en: 'Cooking', ko: '요리', ja: '料理' }, emoji: '🍳' },
  { id: 'outdoors', label: { en: 'Outdoors', ko: '아웃도어', ja: 'アウトドア' }, emoji: '🏕️' },
  { id: 'fitness', label: { en: 'Fitness', ko: '피트니스', ja: 'フィットネス' }, emoji: '💪' },
  { id: 'gaming', label: { en: 'Gaming', ko: '게임', ja: 'ゲーム' }, emoji: '🎮' },
  { id: 'music', label: { en: 'Music', ko: '음악', ja: '音楽' }, emoji: '🎵' },
  { id: 'travel', label: { en: 'Travel', ko: '여행', ja: '旅行' }, emoji: '✈️' },
  { id: 'photography', label: { en: 'Photography', ko: '사진', ja: '写真' }, emoji: '📷' },
  { id: 'art', label: { en: 'Art', ko: '예술', ja: 'アート' }, emoji: '🎨' },
  { id: 'reading', label: { en: 'Reading', ko: '독서', ja: '読書' }, emoji: '📚' },
  { id: 'movies', label: { en: 'Movies', ko: '영화', ja: '映画' }, emoji: '🎬' },
  { id: 'food', label: { en: 'Foodie', ko: '미식가', ja: 'グルメ' }, emoji: '🍜' },
  { id: 'coffee', label: { en: 'Coffee', ko: '커피', ja: 'コーヒー' }, emoji: '☕' },
  { id: 'pets', label: { en: 'Pet Lover', ko: '반려동물', ja: 'ペット好き' }, emoji: '🐕' },
  { id: 'yoga', label: { en: 'Yoga', ko: '요가', ja: 'ヨガ' }, emoji: '🧘' },
  { id: 'dancing', label: { en: 'Dancing', ko: '댄스', ja: 'ダンス' }, emoji: '💃' },
  { id: 'language', label: { en: 'Language Learning', ko: '언어 학습', ja: '言語学習' }, emoji: '🗣️' },
]

const SUBSCRIPTION_PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    period: 'forever',
    features: [
      'Limited to 5 matches per day',
      'Solo language learning game',
      'Basic profile',
    ],
    color: 'gray',
  },
  {
    id: 'standard',
    name: 'Standard',
    price: '$9.99',
    period: '/month',
    features: [
      'Unlimited matches',
      'Conversation starter questions',
      'Multiplayer language games',
      'See who likes you',
    ],
    color: 'pink',
    popular: true,
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '$19.99',
    period: '/month',
    features: [
      'Everything in Standard',
      'AI date planning recommendations',
      'Virtual gift feature',
      'Priority profile visibility',
      'Read receipts',
    ],
    color: 'purple',
  },
]

// Multi-language game questions with pronunciations for each language
const LANGUAGE_GAME_QUESTIONS = {
  ko: [
    { native: '안녕하세요', translations: { en: 'Hello', ja: 'こんにちは' }, pronunciation: { en: 'Ahn-nyeong-ha-se-yo', ja: 'アンニョンハセヨ' } },
    { native: '감사합니다', translations: { en: 'Thank you', ja: 'ありがとうございます' }, pronunciation: { en: 'Gam-sa-ham-ni-da', ja: 'カムサハムニダ' } },
    { native: '사랑해요', translations: { en: 'I love you', ja: '愛してる' }, pronunciation: { en: 'Sa-rang-hae-yo', ja: 'サランヘヨ' } },
    { native: '맛있어요', translations: { en: "It's delicious", ja: '美味しい' }, pronunciation: { en: 'Ma-shi-sseo-yo', ja: 'マシッソヨ' } },
    { native: '어디예요?', translations: { en: 'Where is it?', ja: 'どこですか？' }, pronunciation: { en: 'Eo-di-ye-yo?', ja: 'オディエヨ？' } },
    { native: '이름이 뭐예요?', translations: { en: "What's your name?", ja: '名前は何ですか？' }, pronunciation: { en: 'I-reum-i mwo-ye-yo?', ja: 'イルミ ムォエヨ？' } },
    { native: '좋아요', translations: { en: 'I like it / Good', ja: 'いいね / 良い' }, pronunciation: { en: 'Jo-a-yo', ja: 'チョアヨ' } },
    { native: '미안해요', translations: { en: "I'm sorry", ja: 'ごめんなさい' }, pronunciation: { en: 'Mi-an-hae-yo', ja: 'ミアネヨ' } },
    { native: '괜찮아요', translations: { en: "It's okay", ja: '大丈夫です' }, pronunciation: { en: 'Gwaen-chan-a-yo', ja: 'ケンチャナヨ' } },
    { native: '만나서 반가워요', translations: { en: 'Nice to meet you', ja: 'お会いできて嬉しい' }, pronunciation: { en: 'Man-na-seo ban-ga-wo-yo', ja: 'マンナソ パンガウォヨ' } },
  ],
  ja: [
    { native: 'こんにちは', translations: { en: 'Hello', ko: '안녕하세요' }, pronunciation: { en: 'Kon-ni-chi-wa', ko: '곤니치와' } },
    { native: 'ありがとう', translations: { en: 'Thank you', ko: '감사합니다' }, pronunciation: { en: 'A-ri-ga-tou', ko: '아리가토' } },
    { native: '愛してる', translations: { en: 'I love you', ko: '사랑해요' }, pronunciation: { en: 'Ai-shi-te-ru', ko: '아이시테루' } },
    { native: '美味しい', translations: { en: 'Delicious', ko: '맛있어요' }, pronunciation: { en: 'O-i-shi-i', ko: '오이시이' } },
    { native: 'どこですか？', translations: { en: 'Where is it?', ko: '어디예요?' }, pronunciation: { en: 'Do-ko-de-su-ka?', ko: '도코데스카?' } },
    { native: 'お名前は？', translations: { en: "What's your name?", ko: '이름이 뭐예요?' }, pronunciation: { en: 'O-na-ma-e-wa?', ko: '오나마에와?' } },
    { native: 'いいね', translations: { en: 'Nice / Good', ko: '좋아요' }, pronunciation: { en: 'Ii-ne', ko: '이이네' } },
    { native: 'ごめんなさい', translations: { en: "I'm sorry", ko: '미안해요' }, pronunciation: { en: 'Go-men-na-sai', ko: '고멘나사이' } },
    { native: '大丈夫', translations: { en: "It's okay", ko: '괜찮아요' }, pronunciation: { en: 'Dai-jou-bu', ko: '다이조부' } },
    { native: 'はじめまして', translations: { en: 'Nice to meet you', ko: '만나서 반가워요' }, pronunciation: { en: 'Ha-ji-me-ma-shi-te', ko: '하지메마시테' } },
  ],
  en: [
    { native: 'Hello', translations: { ko: '안녕하세요', ja: 'こんにちは' }, pronunciation: { ko: '헬로', ja: 'ハロー' } },
    { native: 'Thank you', translations: { ko: '감사합니다', ja: 'ありがとう' }, pronunciation: { ko: '땡큐', ja: 'サンキュー' } },
    { native: 'I love you', translations: { ko: '사랑해요', ja: '愛してる' }, pronunciation: { ko: '아이 러브 유', ja: 'アイラブユー' } },
    { native: 'Delicious', translations: { ko: '맛있어요', ja: '美味しい' }, pronunciation: { ko: '딜리셔스', ja: 'デリシャス' } },
    { native: 'Where?', translations: { ko: '어디?', ja: 'どこ？' }, pronunciation: { ko: '웨얼?', ja: 'ウェア？' } },
    { native: "What's your name?", translations: { ko: '이름이 뭐예요?', ja: 'お名前は？' }, pronunciation: { ko: '왓츠 유어 네임?', ja: 'ワッツ ユア ネーム？' } },
    { native: 'Good', translations: { ko: '좋아요', ja: 'いいね' }, pronunciation: { ko: '굿', ja: 'グッド' } },
    { native: 'Sorry', translations: { ko: '미안해요', ja: 'ごめんなさい' }, pronunciation: { ko: '쏘리', ja: 'ソーリー' } },
    { native: "It's okay", translations: { ko: '괜찮아요', ja: '大丈夫' }, pronunciation: { ko: '잇츠 오케이', ja: 'イッツオーケー' } },
    { native: 'Nice to meet you', translations: { ko: '만나서 반가워요', ja: 'はじめまして' }, pronunciation: { ko: '나이스 투 밋 유', ja: 'ナイストゥミーチュー' } },
  ],
}

const VIRTUAL_GIFTS = [
  { id: 'rose', name: 'Rose', emoji: '🌹', points: 50 },
  { id: 'heart', name: 'Heart', emoji: '💝', points: 100 },
  { id: 'teddy', name: 'Teddy Bear', emoji: '🧸', points: 200 },
  { id: 'chocolate', name: 'Chocolate', emoji: '🍫', points: 150 },
  { id: 'star', name: 'Star', emoji: '⭐', points: 75 },
  { id: 'crown', name: 'Crown', emoji: '👑', points: 500 },
  { id: 'diamond', name: 'Diamond', emoji: '💎', points: 1000 },
  { id: 'bouquet', name: 'Bouquet', emoji: '💐', points: 300 },
]

const DATE_IDEAS = [
  { type: 'cafe', title: 'Korean Cafe Hopping', description: 'Visit trendy Korean cafes together', icon: '☕' },
  { type: 'karaoke', title: 'Noraebang Night', description: 'Sing K-pop hits at a private karaoke room', icon: '🎤' },
  { type: 'cooking', title: 'Korean Cooking Class', description: 'Learn to make bibimbap or kimchi together', icon: '🍳' },
  { type: 'movie', title: 'K-Drama Marathon', description: 'Watch your favorite dramas with snacks', icon: '📺' },
  { type: 'market', title: 'Korean Market Adventure', description: 'Explore a Korean grocery store together', icon: '🛒' },
  { type: 'picnic', title: 'Han River Style Picnic', description: 'Enjoy fried chicken and beer outdoors', icon: '🧺' },
]

const CONVERSATION_STARTERS = {
  casual: {
    en: [
      "What's your favorite K-drama and why?",
      "If you could visit any city in Korea or Japan, which would it be?",
      "What Asian food could you eat every day?",
      "Do you have a favorite K-pop or J-pop group?",
      "What's your go-to karaoke song?",
      "Are you more of a morning person or night owl?",
      "What's the last show you binge-watched?",
      "Coffee or tea? And how do you take it?",
      "What's your idea of a perfect weekend?",
      "If you could learn any skill instantly, what would it be?",
    ],
    ko: [
      "가장 좋아하는 드라마가 뭐예요?",
      "한국이나 일본에서 가고 싶은 도시는?",
      "매일 먹어도 안 질리는 음식은?",
      "좋아하는 K-pop 또는 J-pop 그룹이 있어요?",
      "노래방에서 꼭 부르는 노래는?",
      "아침형 인간이에요, 저녁형 인간이에요?",
      "최근에 정주행한 드라마는?",
      "커피파? 차파? 어떻게 마셔요?",
      "이상적인 주말은 어떻게 보내요?",
      "순간적으로 배울 수 있다면 어떤 기술을 배우고 싶어요?",
    ],
    ja: [
      "一番好きなドラマは何ですか？",
      "韓国や日本で行ってみたい都市は？",
      "毎日食べても飽きない料理は？",
      "好きなK-popまたはJ-popグループは？",
      "カラオケで必ず歌う曲は？",
      "朝型？夜型？",
      "最近イッキ見したドラマは？",
      "コーヒー派？お茶派？どうやって飲む？",
      "理想の週末の過ごし方は？",
      "瞬時に習得できるなら、どんなスキルを学びたい？",
    ],
  },
  serious: {
    en: [
      "What values are most important to you in a relationship?",
      "Where do you see yourself in 5 years?",
      "What's the most important lesson life has taught you?",
      "How do you handle disagreements in a relationship?",
      "What does family mean to you?",
      "What are you most passionate about?",
      "How do you like to show and receive love?",
      "What's something you're working on improving about yourself?",
      "What role does culture play in your life?",
      "What are your thoughts on long-distance relationships?",
    ],
    ko: [
      "연애에서 가장 중요하게 생각하는 가치는?",
      "5년 후 자신의 모습은 어떨 것 같아요?",
      "인생에서 배운 가장 중요한 교훈은?",
      "연인과 의견 충돌이 있을 때 어떻게 해결해요?",
      "가족이란 어떤 의미예요?",
      "가장 열정적인 것은 무엇인가요?",
      "사랑을 어떻게 표현하고 받고 싶어요?",
      "자기 자신에 대해 개선하려고 노력하는 것은?",
      "삶에서 문화가 어떤 역할을 해요?",
      "장거리 연애에 대해 어떻게 생각해요?",
    ],
    ja: [
      "恋愛で最も大切にしている価値観は？",
      "5年後の自分はどうなっていると思う？",
      "人生で学んだ最も大切な教訓は？",
      "意見の相違をどう解決する？",
      "家族とはどんな意味を持つ？",
      "何に一番情熱を持っている？",
      "愛情をどう表現し、受け取りたい？",
      "自分について改善しようとしていることは？",
      "人生における文化の役割は？",
      "遠距離恋愛についてどう思う？",
    ],
  },
}

const sampleProfiles = [
  {
    id: 1,
    name: 'Emma',
    age: 28,
    bio: 'K-pop enthusiast 🎤 | Foodie exploring Korean cuisine | Looking for someone to watch K-dramas with',
    location: 'San Francisco, CA',
    distance: '3 miles away',
    images: ['https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400'],
    video: null,
    interests: ['kpop', 'cooking', 'kdrama', 'coffee'],
  },
  {
    id: 2,
    name: 'James',
    age: 31,
    bio: 'Learning Korean one word at a time 🇰🇷 | Tech by day, chef by night',
    location: 'Oakland, CA',
    distance: '7 miles away',
    images: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400'],
    video: null,
    interests: ['cooking', 'language', 'gaming', 'fitness'],
  },
  {
    id: 3,
    name: 'Sofia',
    age: 26,
    bio: 'BTS ARMY 💜 | Artist & dreamer | Looking for my partner in crime',
    location: 'Berkeley, CA',
    distance: '5 miles away',
    images: ['https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400'],
    video: null,
    interests: ['kpop', 'art', 'dancing', 'photography'],
  },
  {
    id: 4,
    name: 'Marcus',
    age: 29,
    bio: 'Korean drama addict 📺 | Yoga instructor | Fluent in food recommendations',
    location: 'Santa Cruz, CA',
    distance: '12 miles away',
    images: ['https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400'],
    video: null,
    interests: ['kdrama', 'yoga', 'food', 'outdoors'],
  },
  {
    id: 5,
    name: 'Olivia',
    age: 27,
    bio: 'BLACKPINK in my area 🖤💗 | Book lover | Hopeless romantic',
    location: 'San Jose, CA',
    distance: '15 miles away',
    images: ['https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400'],
    video: null,
    interests: ['kpop', 'reading', 'movies', 'pets'],
  },
]

const sampleMatches = [
  { id: 101, name: 'Alex', image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100', lastMessage: 'Have you watched Goblin? 👻', time: '2m ago', unread: true },
  { id: 102, name: 'Jordan', image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100', lastMessage: '안녕! How was your day?', time: '1h ago', unread: false },
  { id: 103, name: 'Taylor', image: 'https://images.unsplash.com/photo-1524638431109-93d95c968f03?w=100', lastMessage: 'Let\'s try that Korean BBQ place! 🥩', time: '3h ago', unread: false },
]

// ============================================
// ICONS
// ============================================

const HeartIcon = ({ filled, className = "w-8 h-8" }) => (
  <svg className={className} fill={filled ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
)

const XIcon = ({ className = "w-8 h-8" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
)

const StarIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
)

const ChatIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
)

const UserIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
)

const FlameIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 23c-3.866 0-7-3.134-7-7 0-2.551 1.268-4.827 2.71-6.6.853-1.05 1.785-1.96 2.562-2.686.387-.362.736-.678 1.016-.94.136-.127.261-.244.376-.35.09-.084.159-.148.195-.18l.141-.13.141.13c.036.032.105.096.195.18.115.106.24.223.376.35.28.262.629.578 1.016.94.777.726 1.71 1.636 2.562 2.686C17.732 11.173 19 13.449 19 16c0 3.866-3.134 7-7 7z" />
  </svg>
)

const LocationIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)

const BackIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
)

const SendIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
  </svg>
)

const CameraIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)

const VideoIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
)

const GiftIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
  </svg>
)

const GameIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const CalendarIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
)

const SparklesIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
)

const CheckIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
)

const CoinIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" fill="#FFD700" stroke="#DAA520" strokeWidth="2"/>
    <text x="12" y="16" textAnchor="middle" fontSize="10" fill="#B8860B" fontWeight="bold">P</text>
  </svg>
)

// ============================================
// ONBOARDING COMPONENTS
// ============================================

function WelcomeScreen({ onGetStarted }) {
  const { language, setLanguage, languages } = useLanguage()
  const t = useTranslation()
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-500 via-rose-500 to-purple-600 flex flex-col items-center justify-center p-6 text-white">
      {/* Language Selector */}
      <div className="absolute top-6 right-6">
        <div className="flex gap-2">
          {languages.map((lang) => (
            <button
              key={lang.id}
              onClick={() => setLanguage(lang.id)}
              className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition ${
                language === lang.id
                  ? 'bg-white shadow-lg'
                  : 'bg-white/20 hover:bg-white/30'
              }`}
            >
              {lang.flag}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <FlameIcon className="w-24 h-24 mx-auto mb-4" />
        <h1 className="text-5xl font-bold text-center">{t('appName')}</h1>
        <p className="text-pink-100 text-center mt-2">{t('tagline')}</p>
      </div>

      <button
        onClick={onGetStarted}
        className="w-full max-w-sm py-4 bg-white text-pink-600 rounded-full font-bold text-lg hover:bg-gray-100 transition shadow-lg"
      >
        {t('getStarted')}
      </button>

      <p className="mt-6 text-sm text-pink-200">
        {t('alreadyHaveAccount')} <button className="underline font-semibold">{t('signIn')}</button>
      </p>
    </div>
  )
}

function SignUpStep1({ data, onUpdate, onNext }) {
  const { language, setLanguage, languages } = useLanguage()
  const t = useTranslation()
  const [errors, setErrors] = useState({})

  const validate = () => {
    const newErrors = {}
    if (!data.name?.trim()) newErrors.name = t('fullName') + ' is required'
    if (!data.email?.trim()) newErrors.email = t('email') + ' is required'
    if (!data.dateOfBirth) newErrors.dateOfBirth = t('dateOfBirth') + ' is required'
    if (!data.gender) newErrors.gender = t('gender') + ' is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validate()) onNext()
  }

  const genderOptions = [
    { key: 'male', label: t('male') },
    { key: 'female', label: t('female') },
    { key: 'other', label: t('other') },
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-md mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-pink-500 text-white flex items-center justify-center text-sm font-bold">1</div>
            <div className="flex-1 h-1 bg-gray-200 rounded"><div className="h-full w-1/4 bg-pink-500 rounded"></div></div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{t('basicInfo')}</h1>
          <p className="text-gray-500">{t('letsStart')}</p>
        </div>

        <div className="space-y-4">
          {/* Language Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('appLanguage')}</label>
            <div className="grid grid-cols-3 gap-2">
              {languages.map((lang) => (
                <button
                  key={lang.id}
                  onClick={() => setLanguage(lang.id)}
                  className={`py-3 px-2 rounded-xl border-2 font-medium transition flex flex-col items-center gap-1 ${
                    language === lang.id
                      ? 'border-pink-500 bg-pink-50 text-pink-600'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <span className="text-xl">{lang.flag}</span>
                  <span className="text-xs">{lang.native}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('fullName')}</label>
            <input
              type="text"
              value={data.name || ''}
              onChange={(e) => onUpdate({ name: e.target.value })}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
              placeholder={t('enterName')}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('email')}</label>
            <input
              type="email"
              value={data.email || ''}
              onChange={(e) => onUpdate({ email: e.target.value })}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="your@email.com"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('dateOfBirth')}</label>
            <input
              type="date"
              value={data.dateOfBirth || ''}
              onChange={(e) => onUpdate({ dateOfBirth: e.target.value })}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 ${errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.dateOfBirth && <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('gender')}</label>
            <div className="grid grid-cols-3 gap-3">
              {genderOptions.map((option) => (
                <button
                  key={option.key}
                  onClick={() => onUpdate({ gender: option.key })}
                  className={`py-3 px-4 rounded-xl border-2 font-medium transition ${
                    data.gender === option.key
                      ? 'border-pink-500 bg-pink-50 text-pink-600'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('location')}</label>
            <input
              type="text"
              value={data.location || ''}
              onChange={(e) => onUpdate({ location: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              placeholder={t('cityCountry')}
            />
          </div>
        </div>

        <button
          onClick={handleNext}
          className="w-full mt-8 py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full font-bold text-lg hover:shadow-lg transition"
        >
          {t('continue')}
        </button>
      </div>
    </div>
  )
}

function SignUpStep2({ data, onUpdate, onNext, onBack }) {
  const t = useTranslation()

  const handleImageUpload = () => {
    // Simulated - in real app would use file input
    onUpdate({ profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400' })
  }

  const handleVideoUpload = () => {
    // Simulated - in real app would use file input
    onUpdate({ profileVideo: 'uploaded' })
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-md mx-auto">
        <button onClick={onBack} className="mb-4 text-gray-600 hover:text-gray-800">
          <BackIcon />
        </button>

        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-pink-500 text-white flex items-center justify-center text-sm font-bold">2</div>
            <div className="flex-1 h-1 bg-gray-200 rounded"><div className="h-full w-2/4 bg-pink-500 rounded"></div></div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{t('addPhotos')}</h1>
          <p className="text-gray-500">{t('showPersonality')}</p>
        </div>

        <div className="space-y-6">
          {/* Profile Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">{t('profilePhoto')}</label>
            <div
              onClick={handleImageUpload}
              className="w-40 h-40 mx-auto rounded-full border-4 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-pink-400 transition bg-gray-100"
            >
              {data.profileImage ? (
                <img src={data.profileImage} alt="Profile" className="w-full h-full rounded-full object-cover" />
              ) : (
                <>
                  <CameraIcon className="w-10 h-10 text-gray-400" />
                  <span className="text-sm text-gray-500 mt-2">{t('addPhoto')}</span>
                </>
              )}
            </div>
          </div>

          {/* Profile Video */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">{t('introVideo')}</label>
            <div
              onClick={handleVideoUpload}
              className="w-full h-32 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-pink-400 transition bg-gray-100"
            >
              {data.profileVideo ? (
                <div className="text-center">
                  <CheckIcon className="w-10 h-10 text-green-500 mx-auto" />
                  <span className="text-sm text-green-600 mt-2">{t('videoUploaded')}</span>
                </div>
              ) : (
                <>
                  <VideoIcon className="w-10 h-10 text-gray-400" />
                  <span className="text-sm text-gray-500 mt-2">{t('addVideo')}</span>
                </>
              )}
            </div>
            <p className="text-xs text-gray-400 mt-2">{t('videoHelp')}</p>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('bio')}</label>
            <textarea
              value={data.bio || ''}
              onChange={(e) => onUpdate({ bio: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 h-24 resize-none"
              placeholder={t('tellAboutYourself')}
              maxLength={300}
            />
            <p className="text-xs text-gray-400 text-right">{(data.bio || '').length}/300</p>
          </div>
        </div>

        <button
          onClick={onNext}
          disabled={!data.profileImage}
          className={`w-full mt-8 py-4 rounded-full font-bold text-lg transition ${
            data.profileImage
              ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:shadow-lg'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {t('continue')}
        </button>
      </div>
    </div>
  )
}

function SignUpStep3({ data, onUpdate, onNext, onBack }) {
  const { language } = useLanguage()
  const t = useTranslation()

  const toggleInterest = (interestId) => {
    const current = data.interests || []
    const updated = current.includes(interestId)
      ? current.filter(i => i !== interestId)
      : [...current, interestId]
    onUpdate({ interests: updated })
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-md mx-auto">
        <button onClick={onBack} className="mb-4 text-gray-600 hover:text-gray-800">
          <BackIcon />
        </button>

        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-pink-500 text-white flex items-center justify-center text-sm font-bold">3</div>
            <div className="flex-1 h-1 bg-gray-200 rounded"><div className="h-full w-3/4 bg-pink-500 rounded"></div></div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{t('yourInterests')}</h1>
          <p className="text-gray-500">{t('selectInterests')}</p>
        </div>

        <div className="flex flex-wrap gap-3">
          {INTERESTS_OPTIONS.map((interest) => (
            <button
              key={interest.id}
              onClick={() => toggleInterest(interest.id)}
              className={`px-4 py-2 rounded-full border-2 font-medium transition flex items-center gap-2 ${
                (data.interests || []).includes(interest.id)
                  ? 'border-pink-500 bg-pink-50 text-pink-600'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              <span>{interest.emoji}</span>
              <span>{interest.label[language] || interest.label.en}</span>
            </button>
          ))}
        </div>

        <button
          onClick={onNext}
          disabled={(data.interests || []).length < 3}
          className={`w-full mt-8 py-4 rounded-full font-bold text-lg transition ${
            (data.interests || []).length >= 3
              ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:shadow-lg'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {t('continue')} ({(data.interests || []).length}/3 {t('minimum')})
        </button>
      </div>
    </div>
  )
}

function SignUpStep4({ data, onUpdate, onComplete, onBack }) {
  const t = useTranslation()

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-md mx-auto">
        <button onClick={onBack} className="mb-4 text-gray-600 hover:text-gray-800">
          <BackIcon />
        </button>

        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-pink-500 text-white flex items-center justify-center text-sm font-bold">4</div>
            <div className="flex-1 h-1 bg-gray-200 rounded"><div className="h-full w-full bg-pink-500 rounded"></div></div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{t('termsPreferences')}</h1>
          <p className="text-gray-500">{t('almostThere')}</p>
        </div>

        <div className="space-y-4">
          <label className="flex items-start gap-3 p-4 bg-white rounded-xl border border-gray-200">
            <input
              type="checkbox"
              checked={data.agreeTerms || false}
              onChange={(e) => onUpdate({ agreeTerms: e.target.checked })}
              className="w-5 h-5 text-pink-500 rounded border-gray-300 focus:ring-pink-500 mt-0.5"
            />
            <div>
              <p className="font-medium text-gray-900">{t('agreeTerms')}</p>
              <p className="text-sm text-gray-500">{t('termsDescription')}</p>
            </div>
          </label>

          <label className="flex items-start gap-3 p-4 bg-white rounded-xl border border-gray-200">
            <input
              type="checkbox"
              checked={data.agreeMarketing || false}
              onChange={(e) => onUpdate({ agreeMarketing: e.target.checked })}
              className="w-5 h-5 text-pink-500 rounded border-gray-300 focus:ring-pink-500 mt-0.5"
            />
            <div>
              <p className="font-medium text-gray-900">{t('marketingComms')}</p>
              <p className="text-sm text-gray-500">{t('marketingDescription')}</p>
            </div>
          </label>
        </div>

        <button
          onClick={onComplete}
          disabled={!data.agreeTerms}
          className={`w-full mt-8 py-4 rounded-full font-bold text-lg transition ${
            data.agreeTerms
              ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:shadow-lg'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {t('createAccount')}
        </button>
      </div>
    </div>
  )
}

// ============================================
// SUBSCRIPTION SCREEN
// ============================================

function SubscriptionScreen({ onSelectPlan }) {
  const t = useTranslation()
  const [selectedPlan, setSelectedPlan] = useState('standard')

  // Translated feature keys for each plan
  const planFeatureKeys = {
    free: ['limitedMatches', 'soloGame', 'basicProfile'],
    standard: ['unlimitedMatches', 'conversationStarters', 'multiplayerGames', 'seeWhoLikes'],
    premium: ['everythingStandard', 'aiDatePlanning', 'virtualGifts', 'priorityVisibility', 'readReceipts'],
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-600 to-pink-600 p-6">
      <div className="max-w-md mx-auto">
        <div className="text-center text-white mb-8">
          <SparklesIcon className="w-12 h-12 mx-auto mb-4" />
          <h1 className="text-3xl font-bold">{t('choosePlan')}</h1>
          <p className="text-purple-200 mt-2">{t('unlockExperience')}</p>
        </div>

        <div className="space-y-4">
          {SUBSCRIPTION_PLANS.map((plan) => (
            <button
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              className={`w-full p-4 rounded-2xl text-left transition relative ${
                selectedPlan === plan.id
                  ? 'bg-white shadow-xl'
                  : 'bg-white/20 backdrop-blur-sm'
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-2 right-4 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full">
                  {t('mostPopular')}
                </span>
              )}
              <div className="flex justify-between items-start">
                <div>
                  <h3 className={`text-xl font-bold ${selectedPlan === plan.id ? 'text-gray-900' : 'text-white'}`}>
                    {t(plan.id)}
                  </h3>
                  <p className={`text-2xl font-bold mt-1 ${selectedPlan === plan.id ? 'text-pink-600' : 'text-white'}`}>
                    {plan.price}<span className="text-sm font-normal">{plan.id === 'free' ? t('forever') : t('perMonth')}</span>
                  </p>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  selectedPlan === plan.id ? 'border-pink-500 bg-pink-500' : 'border-white/50'
                }`}>
                  {selectedPlan === plan.id && <CheckIcon className="w-4 h-4 text-white" />}
                </div>
              </div>
              <ul className="mt-4 space-y-2">
                {planFeatureKeys[plan.id].map((featureKey, idx) => (
                  <li key={idx} className={`flex items-center gap-2 text-sm ${
                    selectedPlan === plan.id ? 'text-gray-600' : 'text-white/80'
                  }`}>
                    <CheckIcon className={`w-4 h-4 ${selectedPlan === plan.id ? 'text-green-500' : 'text-white/60'}`} />
                    {t(featureKey)}
                  </li>
                ))}
              </ul>
            </button>
          ))}
        </div>

        <button
          onClick={() => onSelectPlan(selectedPlan)}
          className="w-full mt-8 py-4 bg-white text-purple-600 rounded-full font-bold text-lg hover:bg-gray-100 transition shadow-lg"
        >
          {selectedPlan === 'free' ? t('continueWithFree') : t('startFreeTrial')}
        </button>

        {selectedPlan !== 'free' && (
          <p className="text-center text-white/60 text-sm mt-4">
            {t('freeTrialNote')}
          </p>
        )}
      </div>
    </div>
  )
}

// ============================================
// LANGUAGE GAME COMPONENT
// ============================================

function LanguageGame({ onClose, onEarnPoints, currentPoints }) {
  const { language } = useLanguage()
  const t = useTranslation()
  const [questionIndex, setQuestionIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [gameComplete, setGameComplete] = useState(false)

  // Get questions for the language being learned (learn Korean if user speaks English/Japanese, etc.)
  const targetLang = language === 'en' ? 'ko' : language === 'ko' ? 'ja' : 'ko'
  const questions = LANGUAGE_GAME_QUESTIONS[targetLang] || LANGUAGE_GAME_QUESTIONS.ko
  const currentQuestion = questions[questionIndex]

  // Generate wrong answers
  const generateOptions = () => {
    if (!currentQuestion) return []
    const correct = currentQuestion.translations[language] || currentQuestion.translations.en
    const allAnswers = questions.map(q => q.translations[language] || q.translations.en).filter(a => a !== correct)
    const wrongAnswers = allAnswers.sort(() => Math.random() - 0.5).slice(0, 3)
    const options = [...wrongAnswers, correct].sort(() => Math.random() - 0.5)
    return options
  }

  const [options, setOptions] = useState(() => generateOptions())

  const handleAnswer = (answer) => {
    if (answered || !currentQuestion) return
    setSelectedAnswer(answer)
    setAnswered(true)

    const correctAnswer = currentQuestion.translations[language] || currentQuestion.translations.en
    if (answer === correctAnswer) {
      setScore(score + 10)
    }
  }

  const nextQuestion = () => {
    const correctAnswer = currentQuestion?.translations?.[language] || currentQuestion?.translations?.en
    if (questionIndex < 4) {
      setQuestionIndex(questionIndex + 1)
      setAnswered(false)
      setSelectedAnswer(null)
      // Regenerate options for next question
      const nextQ = questions[questionIndex + 1]
      if (nextQ) {
        const correct = nextQ.translations[language] || nextQ.translations.en
        const allAnswers = questions.map(q => q.translations[language] || q.translations.en).filter(a => a !== correct)
        const wrongAnswers = allAnswers.sort(() => Math.random() - 0.5).slice(0, 3)
        setOptions([...wrongAnswers, correct].sort(() => Math.random() - 0.5))
      }
    } else {
      setGameComplete(true)
      onEarnPoints(score + (selectedAnswer === correctAnswer ? 10 : 0))
    }
  }

  const correctAnswer = currentQuestion?.translations?.[language] || currentQuestion?.translations?.en

  if (gameComplete) {
    const finalScore = score + (selectedAnswer === correctAnswer ? 10 : 0)
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('gameComplete')}</h2>
          <p className="text-gray-600 mb-4">{t('youEarned')} {finalScore} {t('points')}</p>
          <div className="flex items-center justify-center gap-2 text-xl font-bold text-yellow-600 mb-6">
            <CoinIcon className="w-6 h-6" />
            <span>{currentPoints + finalScore} {t('totalPoints')}</span>
          </div>
          <button
            onClick={onClose}
            className="w-full py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full font-semibold"
          >
            {t('done')}
          </button>
        </div>
      </div>
    )
  }

  if (!currentQuestion) {
    return null
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-6 max-w-sm w-full">
        <div className="flex justify-between items-center mb-6">
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XIcon className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2">
            <CoinIcon />
            <span className="font-bold text-yellow-600">{score}</span>
          </div>
          <span className="text-sm text-gray-500">{questionIndex + 1}/5</span>
        </div>

        <div className="text-center mb-8">
          <p className="text-sm text-gray-500 mb-2">{t('whatDoesThisMean')}</p>
          <p className="text-4xl font-bold text-gray-900 mb-2">{currentQuestion.native}</p>
          <p className="text-sm text-gray-400 italic">{currentQuestion.pronunciation?.[language] || currentQuestion.pronunciation?.en}</p>
        </div>

        <div className="space-y-3">
          {options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleAnswer(option)}
              disabled={answered}
              className={`w-full py-4 px-6 rounded-xl font-medium transition text-left ${
                answered
                  ? option === correctAnswer
                    ? 'bg-green-100 border-2 border-green-500 text-green-700'
                    : option === selectedAnswer
                    ? 'bg-red-100 border-2 border-red-500 text-red-700'
                    : 'bg-gray-100 text-gray-400'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              {option}
            </button>
          ))}
        </div>

        {answered && (
          <button
            onClick={nextQuestion}
            className="w-full mt-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full font-semibold"
          >
            {questionIndex < 4 ? t('nextQuestion') : t('seeResults')}
          </button>
        )}
      </div>
    </div>
  )
}

// ============================================
// VIRTUAL GIFT MODAL
// ============================================

function VirtualGiftModal({ onClose, onSendGift, userPoints, matchName }) {
  const [selectedGift, setSelectedGift] = useState(null)

  const handleSend = () => {
    if (selectedGift && userPoints >= selectedGift.points) {
      onSendGift(selectedGift)
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-6 max-w-sm w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Send a Gift</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="flex items-center justify-center gap-2 mb-6 py-2 bg-yellow-50 rounded-lg">
          <CoinIcon />
          <span className="font-bold text-yellow-600">Your Points: {userPoints}</span>
        </div>

        <div className="grid grid-cols-4 gap-3 mb-6">
          {VIRTUAL_GIFTS.map((gift) => (
            <button
              key={gift.id}
              onClick={() => setSelectedGift(gift)}
              disabled={userPoints < gift.points}
              className={`p-3 rounded-xl text-center transition ${
                selectedGift?.id === gift.id
                  ? 'bg-pink-100 border-2 border-pink-500'
                  : userPoints >= gift.points
                  ? 'bg-gray-100 hover:bg-gray-200'
                  : 'bg-gray-50 opacity-50 cursor-not-allowed'
              }`}
            >
              <span className="text-2xl">{gift.emoji}</span>
              <p className="text-xs text-gray-600 mt-1">{gift.points}p</p>
            </button>
          ))}
        </div>

        {selectedGift && (
          <div className="text-center mb-4">
            <p className="text-gray-600">
              Send {selectedGift.emoji} {selectedGift.name} to {matchName}?
            </p>
          </div>
        )}

        <button
          onClick={handleSend}
          disabled={!selectedGift || userPoints < selectedGift?.points}
          className={`w-full py-3 rounded-full font-semibold transition ${
            selectedGift && userPoints >= selectedGift.points
              ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          Send Gift
        </button>
      </div>
    </div>
  )
}

// ============================================
// DATE PLANNING MODAL
// ============================================

function DatePlanningModal({ onClose, matchName, userPlan }) {
  const [selectedDate, setSelectedDate] = useState(null)
  const [generating, setGenerating] = useState(false)
  const [suggestion, setSuggestion] = useState(null)

  const generateSuggestion = () => {
    setGenerating(true)
    // Simulate AI generating a suggestion
    setTimeout(() => {
      const randomIdea = DATE_IDEAS[Math.floor(Math.random() * DATE_IDEAS.length)]
      setSuggestion(randomIdea)
      setGenerating(false)
    }, 1500)
  }

  if (userPlan !== 'premium') {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-3xl p-6 max-w-sm w-full text-center">
          <div className="text-6xl mb-4">👑</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Premium Feature</h2>
          <p className="text-gray-600 mb-6">Upgrade to Premium to unlock AI-powered date planning</p>
          <button
            onClick={onClose}
            className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-semibold"
          >
            Upgrade to Premium
          </button>
          <button onClick={onClose} className="w-full py-3 text-gray-500 mt-2">
            Maybe Later
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-6 max-w-sm w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Plan a Date</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        <p className="text-gray-600 mb-6">Get AI-powered date ideas for you and {matchName}</p>

        {!suggestion ? (
          <button
            onClick={generateSuggestion}
            disabled={generating}
            className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold flex items-center justify-center gap-2"
          >
            {generating ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Generating idea...
              </>
            ) : (
              <>
                <SparklesIcon className="w-5 h-5" />
                Generate Date Idea
              </>
            )}
          </button>
        ) : (
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 mb-4">
            <div className="text-4xl mb-2">{suggestion.icon}</div>
            <h3 className="font-bold text-gray-900">{suggestion.title}</h3>
            <p className="text-gray-600 text-sm mt-1">{suggestion.description}</p>
          </div>
        )}

        {suggestion && (
          <div className="space-y-3">
            <button
              onClick={generateSuggestion}
              className="w-full py-3 border-2 border-pink-500 text-pink-500 rounded-full font-semibold"
            >
              Generate Another
            </button>
            <button
              onClick={onClose}
              className="w-full py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full font-semibold"
            >
              Share with {matchName}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================
// CONVERSATION STARTERS MODAL
// ============================================

function ConversationStartersModal({ onClose, onSelect, userPlan, language }) {
  const t = useTranslation()
  const [activeTab, setActiveTab] = useState('casual')

  if (userPlan === 'free') {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-3xl p-6 max-w-sm w-full text-center">
          <div className="text-6xl mb-4">💬</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">{t('standardFeature')}</h2>
          <p className="text-gray-600 mb-6">{t('startersLocked')}</p>
          <button
            onClick={onClose}
            className="w-full py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full font-semibold"
          >
            {t('upgradeStandard')}
          </button>
          <button onClick={onClose} className="w-full py-3 text-gray-500 mt-2">
            {t('maybeLater')}
          </button>
        </div>
      </div>
    )
  }

  const starters = CONVERSATION_STARTERS[activeTab]?.[language] || CONVERSATION_STARTERS[activeTab]?.en || []

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-6 max-w-sm w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">{t('conversationStartersTitle')}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setActiveTab('casual')}
            className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition ${
              activeTab === 'casual'
                ? 'bg-pink-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            😊 {t('casualQuestions')}
          </button>
          <button
            onClick={() => setActiveTab('serious')}
            className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition ${
              activeTab === 'serious'
                ? 'bg-purple-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            💭 {t('seriousQuestions')}
          </button>
        </div>

        <div className="space-y-3 max-h-64 overflow-y-auto">
          {starters.map((starter, idx) => (
            <button
              key={idx}
              onClick={() => { onSelect(starter); onClose(); }}
              className={`w-full p-4 rounded-xl text-left text-gray-700 transition ${
                activeTab === 'casual'
                  ? 'bg-pink-50 hover:bg-pink-100'
                  : 'bg-purple-50 hover:bg-purple-100'
              }`}
            >
              {starter}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ============================================
// ENHANCED CHAT COMPONENT
// ============================================

// In-Chat Language Game Component
function InChatLanguageGame({ onClose, onEarnPoints, onSendMessage, matchName, language }) {
  const t = useTranslation()
  const [gameState, setGameState] = useState('waiting') // waiting, playing, complete
  const [currentQuestion, setCurrentQuestion] = useState(null)
  const [playerScore, setPlayerScore] = useState(0)
  const [opponentScore, setOpponentScore] = useState(0)
  const [round, setRound] = useState(1)
  const [answered, setAnswered] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [isPlayerTurn, setIsPlayerTurn] = useState(true)

  // Get questions based on the language being learned
  const targetLang = language === 'en' ? 'ko' : language === 'ko' ? 'ja' : 'ko'
  const questions = LANGUAGE_GAME_QUESTIONS[targetLang] || LANGUAGE_GAME_QUESTIONS.ko

  const startGame = () => {
    setGameState('playing')
    loadQuestion()
    onSendMessage(`🎮 Started a language game with ${matchName}!`, 'game')
  }

  const loadQuestion = () => {
    const randomQ = questions[Math.floor(Math.random() * questions.length)]
    setCurrentQuestion(randomQ)
    setAnswered(false)
    setSelectedAnswer(null)
  }

  const generateOptions = () => {
    if (!currentQuestion) return []
    const correctAnswer = currentQuestion.translations[language] || currentQuestion.translations.en
    const allTranslations = questions.map(q => q.translations[language] || q.translations.en).filter(a => a !== correctAnswer)
    const wrongAnswers = allTranslations.sort(() => Math.random() - 0.5).slice(0, 3)
    return [...wrongAnswers, correctAnswer].sort(() => Math.random() - 0.5)
  }

  const handleAnswer = (answer) => {
    if (answered) return
    setSelectedAnswer(answer)
    setAnswered(true)

    const correctAnswer = currentQuestion.translations[language] || currentQuestion.translations.en
    if (answer === correctAnswer) {
      setPlayerScore(playerScore + 10)
      onSendMessage(`✅ Correct! +10 points`, 'game')
    } else {
      onSendMessage(`❌ Wrong! The answer was: ${correctAnswer}`, 'game')
    }

    // Simulate opponent answer after delay
    setTimeout(() => {
      const opponentCorrect = Math.random() > 0.4
      if (opponentCorrect) {
        setOpponentScore(opponentScore + 10)
      }

      if (round >= 5) {
        setGameState('complete')
        const finalPlayerScore = playerScore + (answer === correctAnswer ? 10 : 0)
        onEarnPoints(finalPlayerScore)
        onSendMessage(`🏆 Game Over! You: ${finalPlayerScore} vs ${matchName}: ${opponentScore + (opponentCorrect ? 10 : 0)}`, 'game')
      } else {
        setRound(round + 1)
        setIsPlayerTurn(!isPlayerTurn)
        loadQuestion()
      }
    }, 1500)
  }

  const options = generateOptions()
  const correctAnswer = currentQuestion?.translations?.[language] || currentQuestion?.translations?.en

  if (gameState === 'waiting') {
    return (
      <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-4 mx-4 my-2">
        <div className="text-center">
          <div className="text-4xl mb-2">🎮</div>
          <h3 className="font-bold text-gray-900 mb-1">{t('languageGame')}</h3>
          <p className="text-sm text-gray-600 mb-3">{t('playTogether')} {matchName}!</p>
          <div className="flex gap-2">
            <button
              onClick={startGame}
              className="flex-1 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-semibold text-sm"
            >
              {t('startGame')}
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-600 rounded-full text-sm"
            >
              ✕
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (gameState === 'complete') {
    const won = playerScore > opponentScore
    return (
      <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl p-4 mx-4 my-2">
        <div className="text-center">
          <div className="text-4xl mb-2">{won ? '🏆' : '👏'}</div>
          <h3 className="font-bold text-gray-900">{t('gameComplete')}</h3>
          <div className="flex justify-center gap-4 my-3">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{playerScore}</p>
              <p className="text-xs text-gray-500">You</p>
            </div>
            <div className="text-gray-400">vs</div>
            <div className="text-center">
              <p className="text-2xl font-bold text-pink-600">{opponentScore}</p>
              <p className="text-xs text-gray-500">{matchName}</p>
            </div>
          </div>
          <p className="text-sm text-gray-600">+{playerScore} {t('points')}!</p>
          <button
            onClick={onClose}
            className="mt-3 px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-sm font-semibold"
          >
            {t('done')}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-4 mx-4 my-2">
      {/* Score Header */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-purple-600">You: {playerScore}</span>
          <span className="text-gray-400">vs</span>
          <span className="text-sm font-bold text-pink-600">{matchName}: {opponentScore}</span>
        </div>
        <span className="text-xs text-gray-500">Round {round}/5</span>
      </div>

      {/* Question */}
      <div className="text-center mb-3">
        <p className="text-xs text-gray-500 mb-1">{t('whatDoesThisMean')}</p>
        <p className="text-2xl font-bold text-gray-900">{currentQuestion?.native}</p>
        <p className="text-xs text-gray-400 italic">
          {currentQuestion?.pronunciation?.[language] || currentQuestion?.pronunciation?.en}
        </p>
      </div>

      {/* Options */}
      <div className="grid grid-cols-2 gap-2">
        {options.map((option, idx) => (
          <button
            key={idx}
            onClick={() => handleAnswer(option)}
            disabled={answered}
            className={`p-3 rounded-xl text-sm font-medium transition ${
              answered
                ? option === correctAnswer
                  ? 'bg-green-500 text-white'
                  : option === selectedAnswer
                  ? 'bg-red-400 text-white'
                  : 'bg-gray-200 text-gray-400'
                : 'bg-white hover:bg-gray-50 text-gray-700 shadow-sm'
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  )
}

// Translation helper function
const translateMessage = (text, fromLang, toLang) => {
  // Simulated translation - in production would use real API
  const simpleTranslations = {
    'ko-en': { '안녕': 'Hello', '감사합니다': 'Thank you', '좋아요': 'I like it', '뭐해요?': 'What are you doing?' },
    'ja-en': { 'こんにちは': 'Hello', 'ありがとう': 'Thank you', 'いいね': 'Nice', '何してる？': 'What are you doing?' },
    'en-ko': { 'Hello': '안녕', 'Thank you': '감사합니다', 'I like it': '좋아요', 'What are you doing?': '뭐해요?' },
    'en-ja': { 'Hello': 'こんにちは', 'Thank you': 'ありがとう', 'Nice': 'いいね', 'What are you doing?': '何してる？' },
  }
  const key = `${fromLang}-${toLang}`
  return simpleTranslations[key]?.[text] || `[${toLang.toUpperCase()}] ${text}`
}

function EnhancedChat({ match, messages, onSendMessage, onBack, userPlan, userPoints, onEarnPoints, onSpendPoints, language }) {
  const t = useTranslation()
  const [newMessage, setNewMessage] = useState('')
  const [showGifts, setShowGifts] = useState(false)
  const [showDatePlanning, setShowDatePlanning] = useState(false)
  const [showInChatGame, setShowInChatGame] = useState(false)
  const [showConversationStarters, setShowConversationStarters] = useState(false)
  const [autoTranslate, setAutoTranslate] = useState(false)
  const [translatedMessages, setTranslatedMessages] = useState({})

  const handleSend = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage)
      setNewMessage('')
    }
  }

  const handleSendGift = (gift) => {
    onSpendPoints(gift.points)
    onSendMessage(`Sent a ${gift.emoji} ${gift.name}!`, 'gift')
  }

  const toggleTranslation = (msgIdx, text) => {
    if (translatedMessages[msgIdx]) {
      setTranslatedMessages(prev => {
        const copy = { ...prev }
        delete copy[msgIdx]
        return copy
      })
    } else {
      // Detect source language (simplified)
      const hasKorean = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(text)
      const hasJapanese = /[\u3040-\u309F\u30A0-\u30FF]/.test(text)
      const fromLang = hasKorean ? 'ko' : hasJapanese ? 'ja' : 'en'
      const translated = translateMessage(text, fromLang, language === fromLang ? 'en' : language)
      setTranslatedMessages(prev => ({ ...prev, [msgIdx]: translated }))
    }
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Chat Header */}
      <div className="bg-white shadow-sm px-4 py-3 flex items-center gap-3">
        <button onClick={onBack} className="text-gray-600 hover:text-gray-800">
          <BackIcon />
        </button>
        <img src={match.image} alt={match.name} className="w-10 h-10 rounded-full object-cover" />
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{match.name}</h3>
          <p className="text-xs text-green-500">Online</p>
        </div>
        <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-full">
          <CoinIcon className="w-4 h-4" />
          <span className="text-sm font-bold text-yellow-600">{userPoints}</span>
        </div>
      </div>

      {/* Chat Feature Bar */}
      <div className="bg-white border-b px-4 py-2 flex justify-around">
        <button
          onClick={() => setShowDatePlanning(true)}
          className="flex flex-col items-center text-gray-500 hover:text-pink-500 transition"
        >
          <CalendarIcon className="w-5 h-5" />
          <span className="text-xs mt-1">{t('date')}</span>
        </button>
        <button
          onClick={() => setShowInChatGame(!showInChatGame)}
          className={`flex flex-col items-center transition ${showInChatGame ? 'text-purple-500' : 'text-gray-500 hover:text-pink-500'}`}
        >
          <GameIcon className="w-5 h-5" />
          <span className="text-xs mt-1">{t('game')}</span>
        </button>
        <button
          onClick={() => setShowGifts(true)}
          className="flex flex-col items-center text-gray-500 hover:text-pink-500 transition"
        >
          <GiftIcon className="w-5 h-5" />
          <span className="text-xs mt-1">{t('gift')}</span>
        </button>
        <button
          onClick={() => setShowConversationStarters(true)}
          className="flex flex-col items-center text-gray-500 hover:text-pink-500 transition"
        >
          <SparklesIcon className="w-5 h-5" />
          <span className="text-xs mt-1">{t('ideas')}</span>
        </button>
      </div>

      {/* In-Chat Game */}
      {showInChatGame && (
        <InChatLanguageGame
          onClose={() => setShowInChatGame(false)}
          onEarnPoints={onEarnPoints}
          onSendMessage={onSendMessage}
          matchName={match.name}
          language={language}
        />
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {/* Auto-translate toggle */}
        <div className="flex justify-center mb-2">
          <button
            onClick={() => setAutoTranslate(!autoTranslate)}
            className={`text-xs px-3 py-1 rounded-full flex items-center gap-1 ${
              autoTranslate ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'
            }`}
          >
            🌐 {t('autoTranslate')}
          </button>
        </div>

        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.sent ? 'justify-end' : 'justify-start'}`}>
            <div className="max-w-[75%]">
              <div className={`px-4 py-2 rounded-2xl ${
                msg.type === 'gift'
                  ? 'bg-gradient-to-r from-yellow-100 to-pink-100 text-gray-800 text-center'
                  : msg.type === 'game'
                  ? 'bg-gradient-to-r from-purple-100 to-pink-100 text-gray-800'
                  : msg.sent
                  ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-br-md'
                  : 'bg-white text-gray-800 rounded-bl-md shadow-sm'
              }`}>
                <p className={msg.type === 'gift' ? 'text-2xl' : msg.type === 'game' ? 'text-sm' : ''}>
                  {msg.text}
                </p>
                {/* Show translation */}
                {translatedMessages[idx] && (
                  <p className={`text-xs mt-1 italic ${msg.sent ? 'text-pink-100' : 'text-gray-500'}`}>
                    🌐 {translatedMessages[idx]}
                  </p>
                )}
                <div className="flex items-center justify-between mt-1">
                  <p className={`text-xs ${msg.sent ? 'text-pink-100' : 'text-gray-400'}`}>
                    {msg.time}
                  </p>
                  {/* Translate button for non-gift/game messages */}
                  {msg.type !== 'gift' && msg.type !== 'game' && (
                    <button
                      onClick={() => toggleTranslation(idx, msg.text)}
                      className={`text-xs ml-2 ${msg.sent ? 'text-pink-200 hover:text-white' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                      {translatedMessages[idx] ? '✕' : '🌐'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="bg-white p-4 shadow-lg">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message..."
            className="flex-1 px-4 py-3 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
          <button
            onClick={handleSend}
            className="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center text-white hover:shadow-lg transition"
          >
            <SendIcon />
          </button>
        </div>
      </div>

      {/* Modals */}
      {showGifts && (
        <VirtualGiftModal
          onClose={() => setShowGifts(false)}
          onSendGift={handleSendGift}
          userPoints={userPoints}
          matchName={match.name}
        />
      )}
      {showDatePlanning && (
        <DatePlanningModal
          onClose={() => setShowDatePlanning(false)}
          matchName={match.name}
          userPlan={userPlan}
        />
      )}
      {showConversationStarters && (
        <ConversationStartersModal
          onClose={() => setShowConversationStarters(false)}
          onSelect={(starter) => setNewMessage(starter)}
          userPlan={userPlan}
          language={language}
        />
      )}
    </div>
  )
}

// ============================================
// PROFILE CARD COMPONENT
// ============================================

function ProfileCard({ profile, onLike, onPass, onSuperLike }) {
  const [touchStart, setTouchStart] = useState(null)
  const [touchEnd, setTouchEnd] = useState(null)
  const [swipeDirection, setSwipeDirection] = useState(null)

  const minSwipeDistance = 50

  const onTouchStart = (e) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX)
    const distance = touchStart - e.targetTouches[0].clientX
    if (distance > 30) setSwipeDirection('left')
    else if (distance < -30) setSwipeDirection('right')
    else setSwipeDirection(null)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe) onPass()
    if (isRightSwipe) onLike()
    setSwipeDirection(null)
  }

  const getInterestLabel = (id) => {
    const interest = INTERESTS_OPTIONS.find(i => i.id === id)
    return interest ? `${interest.emoji} ${interest.label}` : id
  }

  return (
    <div
      className={`relative bg-white rounded-3xl shadow-2xl overflow-hidden transition-transform duration-300 ${
        swipeDirection === 'left' ? '-rotate-6 -translate-x-4' :
        swipeDirection === 'right' ? 'rotate-6 translate-x-4' : ''
      }`}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div className="relative h-96 sm:h-[500px]">
        <img
          src={profile.images[0]}
          alt={profile.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

        {swipeDirection === 'right' && (
          <div className="absolute top-8 left-8 border-4 border-green-500 text-green-500 px-4 py-2 rounded-lg rotate-[-20deg] text-2xl font-bold">
            LIKE
          </div>
        )}
        {swipeDirection === 'left' && (
          <div className="absolute top-8 right-8 border-4 border-red-500 text-red-500 px-4 py-2 rounded-lg rotate-[20deg] text-2xl font-bold">
            NOPE
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-bold">{profile.name}, {profile.age}</h2>
              <div className="flex items-center gap-1 text-gray-200 mt-1">
                <LocationIcon className="w-4 h-4" />
                <span className="text-sm">{profile.distance}</span>
              </div>
            </div>
          </div>
          <p className="mt-3 text-gray-100">{profile.bio}</p>
          <div className="flex flex-wrap gap-2 mt-3">
            {profile.interests.slice(0, 4).map((interest, idx) => (
              <span key={idx} className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm">
                {getInterestLabel(interest)}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-center items-center gap-4 p-6 bg-white">
        <button
          onClick={onPass}
          className="w-16 h-16 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center text-red-500 hover:scale-110 transition-transform active:scale-95"
        >
          <XIcon className="w-8 h-8" />
        </button>
        <button
          onClick={onSuperLike}
          className="w-12 h-12 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center text-blue-500 hover:scale-110 transition-transform active:scale-95"
        >
          <StarIcon className="w-6 h-6" />
        </button>
        <button
          onClick={onLike}
          className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 shadow-lg flex items-center justify-center text-white hover:scale-110 transition-transform active:scale-95"
        >
          <HeartIcon filled className="w-8 h-8" />
        </button>
      </div>
    </div>
  )
}

// ============================================
// MATCH MODAL
// ============================================

function MatchModal({ match, onClose, onMessage }) {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-b from-pink-500 to-rose-600 rounded-3xl p-8 max-w-sm w-full text-center text-white animate-bounce-in">
        <h2 className="text-3xl font-bold mb-2">It's a Match!</h2>
        <p className="text-pink-100 mb-6">You and {match.name} liked each other</p>

        <div className="flex justify-center mb-6">
          <img
            src={match.images[0]}
            alt={match.name}
            className="w-32 h-32 rounded-full border-4 border-white object-cover"
          />
        </div>

        <div className="space-y-3">
          <button
            onClick={onMessage}
            className="w-full py-3 bg-white text-pink-600 rounded-full font-semibold hover:bg-gray-100 transition"
          >
            Send a Message
          </button>
          <button
            onClick={onClose}
            className="w-full py-3 bg-transparent border-2 border-white rounded-full font-semibold hover:bg-white/10 transition"
          >
            Keep Swiping
          </button>
        </div>
      </div>
    </div>
  )
}

// ============================================
// MESSAGES LIST COMPONENT
// ============================================

function MessagesList({ matches, onSelectChat }) {
  return (
    <div className="h-full bg-gray-50">
      <div className="bg-white p-4">
        <h3 className="text-gray-500 font-semibold text-sm mb-3">New Matches</h3>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {matches.map((match) => (
            <button
              key={match.id}
              onClick={() => onSelectChat(match)}
              className="flex-shrink-0 text-center"
            >
              <div className="relative">
                <img
                  src={match.image}
                  alt={match.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-pink-500"
                />
                {match.unread && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-pink-500 rounded-full border-2 border-white" />
                )}
              </div>
              <p className="text-xs mt-1 font-medium text-gray-700">{match.name}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-2 bg-white">
        <h3 className="text-gray-500 font-semibold text-sm p-4 pb-2">Messages</h3>
        <div className="divide-y">
          {matches.map((match) => (
            <button
              key={match.id}
              onClick={() => onSelectChat(match)}
              className="w-full p-4 flex items-center gap-3 hover:bg-gray-50 transition text-left"
            >
              <img
                src={match.image}
                alt={match.name}
                className="w-14 h-14 rounded-full object-cover"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className={`font-semibold ${match.unread ? 'text-gray-900' : 'text-gray-700'}`}>
                    {match.name}
                  </h4>
                  <span className="text-xs text-gray-400">{match.time}</span>
                </div>
                <p className={`text-sm truncate ${match.unread ? 'text-gray-800 font-medium' : 'text-gray-500'}`}>
                  {match.lastMessage}
                </p>
              </div>
              {match.unread && (
                <div className="w-3 h-3 bg-pink-500 rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ============================================
// ENHANCED PROFILE SETTINGS COMPONENT
// ============================================

function EnhancedProfileSettings({ user, onUpdateUser, userPlan, userPoints, onEarnPoints }) {
  const { language, setLanguage, languages } = useLanguage()
  const t = useTranslation()
  const [showEditProfile, setShowEditProfile] = useState(false)
  const [showLanguageGame, setShowLanguageGame] = useState(false)
  const [showLanguageSettings, setShowLanguageSettings] = useState(false)
  const [editData, setEditData] = useState({ ...user })

  const getInterestLabel = (id) => {
    const interest = INTERESTS_OPTIONS.find(i => i.id === id)
    return interest ? `${interest.emoji} ${interest.label[language] || interest.label.en}` : id
  }

  const getPlanBadge = () => {
    switch (userPlan) {
      case 'premium': return { text: 'Premium', color: 'bg-purple-500' }
      case 'standard': return { text: 'Standard', color: 'bg-pink-500' }
      default: return { text: 'Free', color: 'bg-gray-500' }
    }
  }

  const badge = getPlanBadge()

  // Language Settings Modal
  if (showLanguageSettings) {
    return (
      <div className="h-full bg-gray-50 overflow-y-auto">
        <div className="bg-white shadow-sm px-4 py-3 flex items-center gap-3">
          <button onClick={() => setShowLanguageSettings(false)} className="text-gray-600">
            <BackIcon />
          </button>
          <h2 className="font-semibold text-gray-900">{t('languageSettings')}</h2>
        </div>

        <div className="p-4">
          <h3 className="text-sm font-medium text-gray-500 mb-4">{t('appLanguage')}</h3>
          <div className="bg-white rounded-2xl shadow-lg divide-y">
            {languages.map((lang) => (
              <button
                key={lang.id}
                onClick={() => setLanguage(lang.id)}
                className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{lang.flag}</span>
                  <div className="text-left">
                    <p className="font-medium text-gray-900">{lang.label}</p>
                    <p className="text-sm text-gray-500">{lang.native}</p>
                  </div>
                </div>
                {language === lang.id && (
                  <div className="w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (showEditProfile) {
    return (
      <div className="h-full bg-gray-50 overflow-y-auto">
        <div className="bg-white shadow-sm px-4 py-3 flex items-center gap-3">
          <button onClick={() => setShowEditProfile(false)} className="text-gray-600">
            <BackIcon />
          </button>
          <h2 className="font-semibold text-gray-900">{t('editProfile')}</h2>
        </div>

        <div className="p-4 space-y-6">
          {/* Profile Image */}
          <div className="text-center">
            <div className="relative inline-block">
              <img
                src={editData.image}
                alt={editData.name}
                className="w-32 h-32 rounded-full object-cover border-4 border-pink-500"
              />
              <button className="absolute bottom-0 right-0 w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center text-white shadow-lg">
                <CameraIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Video */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('introVideo')}</label>
            <button className="w-full h-24 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-500 hover:border-pink-400 transition">
              <VideoIcon className="w-8 h-8" />
              <span className="text-sm mt-1">{t('updateVideo')}</span>
            </button>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('bio')}</label>
            <textarea
              value={editData.bio || ''}
              onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 h-24 resize-none"
              placeholder={t('tellAboutYourself')}
            />
          </div>

          {/* Interests */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('yourInterests')}</label>
            <div className="flex flex-wrap gap-2">
              {INTERESTS_OPTIONS.map((interest) => (
                <button
                  key={interest.id}
                  onClick={() => {
                    const current = editData.interests || []
                    const updated = current.includes(interest.id)
                      ? current.filter(i => i !== interest.id)
                      : [...current, interest.id]
                    setEditData({ ...editData, interests: updated })
                  }}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                    (editData.interests || []).includes(interest.id)
                      ? 'bg-pink-500 text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {interest.emoji} {interest.label[language] || interest.label.en}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => {
              onUpdateUser(editData)
              setShowEditProfile(false)
            }}
            className="w-full py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full font-bold"
          >
            {t('saveChanges')}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full bg-gray-50 overflow-y-auto">
      {/* Profile Header */}
      <div className="bg-gradient-to-b from-pink-500 to-rose-500 pt-8 pb-16 px-4 text-center text-white">
        <div className="relative inline-block">
          <img
            src={user.image}
            alt={user.name}
            className="w-28 h-28 rounded-full object-cover border-4 border-white"
          />
          <span className={`absolute -bottom-2 left-1/2 -translate-x-1/2 ${badge.color} text-white text-xs font-bold px-3 py-1 rounded-full`}>
            {badge.text}
          </span>
        </div>
        <h2 className="text-2xl font-bold mt-4">{user.name}, {user.age}</h2>
        <div className="flex items-center justify-center gap-2 mt-2">
          <CoinIcon />
          <span className="font-bold">{userPoints} points</span>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white -mt-8 mx-4 rounded-2xl shadow-lg p-4 mb-4">
        <div className="flex justify-around text-center">
          <div>
            <p className="text-2xl font-bold text-pink-500">{user.likes || 0}</p>
            <p className="text-sm text-gray-500">{t('likes')}</p>
          </div>
          <div className="border-l border-r px-8">
            <p className="text-2xl font-bold text-pink-500">{user.matches || 0}</p>
            <p className="text-sm text-gray-500">{t('matches')}</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-pink-500">{user.superLikes || 0}</p>
            <p className="text-sm text-gray-500">{t('superLikes')}</p>
          </div>
        </div>
      </div>

      {/* Interests */}
      <div className="bg-white mx-4 rounded-2xl shadow-lg p-4 mb-4">
        <h3 className="font-semibold text-gray-900 mb-3">{t('yourInterests')}</h3>
        <div className="flex flex-wrap gap-2">
          {(user.interests || []).map((interest, idx) => (
            <span key={idx} className="px-3 py-1 bg-pink-100 text-pink-600 rounded-full text-sm font-medium">
              {getInterestLabel(interest)}
            </span>
          ))}
        </div>
      </div>

      {/* Language Game */}
      <div className="bg-white mx-4 rounded-2xl shadow-lg p-4 mb-4">
        <button
          onClick={() => setShowLanguageGame(true)}
          className="w-full flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <GameIcon className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-gray-900">{t('languageGame')}</h3>
              <p className="text-sm text-gray-500">{t('learnAndEarn')}</p>
            </div>
          </div>
          <div className="text-pink-500">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </button>
      </div>

      {/* Settings */}
      <div className="bg-white mx-4 rounded-2xl shadow-lg divide-y mb-4">
        <button
          onClick={() => setShowEditProfile(true)}
          className="w-full p-4 flex items-center justify-between hover:bg-gray-50"
        >
          <span className="font-medium text-gray-700">{t('editProfile')}</span>
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
        <button
          onClick={() => setShowLanguageSettings(true)}
          className="w-full p-4 flex items-center justify-between hover:bg-gray-50"
        >
          <span className="font-medium text-gray-700">{t('languageSettings')}</span>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">{languages.find(l => l.id === language)?.flag}</span>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </button>
        <button className="w-full p-4 flex items-center justify-between hover:bg-gray-50">
          <span className="font-medium text-gray-700">{t('subscription')}</span>
          <span className={`${badge.color} text-white text-xs font-bold px-2 py-1 rounded-full`}>{badge.text}</span>
        </button>
        <button className="w-full p-4 flex items-center justify-between hover:bg-gray-50">
          <span className="font-medium text-gray-700">{t('discoverySettings')}</span>
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
        <button className="w-full p-4 flex items-center justify-between hover:bg-gray-50">
          <span className="font-medium text-gray-700">{t('notifications')}</span>
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="bg-white mx-4 rounded-2xl shadow-lg divide-y mb-8">
        <button className="w-full p-4 flex items-center justify-between hover:bg-gray-50">
          <span className="font-medium text-gray-700">{t('helpSupport')}</span>
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
        <button className="w-full p-4 flex items-center justify-between hover:bg-gray-50">
          <span className="font-medium text-gray-700">{t('privacyPolicy')}</span>
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
        <button className="w-full p-4 text-red-500 font-medium hover:bg-gray-50">
          {t('logOut')}
        </button>
      </div>

      {showLanguageGame && (
        <LanguageGame
          onClose={() => setShowLanguageGame(false)}
          onEarnPoints={onEarnPoints}
          currentPoints={userPoints}
        />
      )}
    </div>
  )
}

// ============================================
// EMPTY STATE
// ============================================

function EmptyState({ userPlan }) {
  const t = useTranslation()
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
      <div className="w-24 h-24 bg-pink-100 rounded-full flex items-center justify-center mb-4">
        <HeartIcon filled className="w-12 h-12 text-pink-500" />
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">
        {userPlan === 'free' ? t('dailyLimitReached') : t('noMoreProfiles')}
      </h2>
      <p className="text-gray-500 mb-6">
        {userPlan === 'free'
          ? t('upgradeUnlimited')
          : t('checkBackLater')
        }
      </p>
      <button className="px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full font-semibold hover:shadow-lg transition">
        {userPlan === 'free' ? t('upgradeNow') : t('expandSearch')}
      </button>
    </div>
  )
}

// ============================================
// MAIN APP COMPONENT
// ============================================

function AppContent() {
  const { language } = useLanguage()
  const t = useTranslation()

  // App state
  const [appState, setAppState] = useState('welcome') // welcome, signup, subscription, main
  const [signUpStep, setSignUpStep] = useState(1)
  const [signUpData, setSignUpData] = useState({})

  // User state
  const [user, setUser] = useState(null)
  const [userPlan, setUserPlan] = useState('free')
  const [userPoints, setUserPoints] = useState(100) // Start with 100 points

  // Main app state
  const [currentTab, setCurrentTab] = useState('discover')
  const [profiles, setProfiles] = useState(sampleProfiles)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [matches, setMatches] = useState(sampleMatches)
  const [matchCount, setMatchCount] = useState(0) // For free plan limit
  const [showMatch, setShowMatch] = useState(null)
  const [selectedChat, setSelectedChat] = useState(null)
  const [chatMessages, setChatMessages] = useState({})

  const currentProfile = profiles[currentIndex]

  // Handlers
  const handleSignUpUpdate = (data) => {
    setSignUpData({ ...signUpData, ...data })
  }

  const handleSignUpComplete = () => {
    setUser({
      ...signUpData,
      image: signUpData.profileImage,
      age: signUpData.dateOfBirth ? new Date().getFullYear() - new Date(signUpData.dateOfBirth).getFullYear() : 25,
      likes: 0,
      matches: 0,
      superLikes: 0,
    })
    setAppState('subscription')
  }

  const handleSelectPlan = (plan) => {
    setUserPlan(plan)
    setAppState('main')
  }

  const handleLike = () => {
    if (userPlan === 'free' && matchCount >= 5) {
      return // Limit reached
    }

    if (Math.random() < 0.3) {
      setShowMatch(currentProfile)
      setMatchCount(matchCount + 1)
    }
    nextProfile()
  }

  const handlePass = () => {
    nextProfile()
  }

  const handleSuperLike = () => {
    if (Math.random() < 0.5) {
      setShowMatch(currentProfile)
      setMatchCount(matchCount + 1)
    }
    nextProfile()
  }

  const nextProfile = () => {
    if (currentIndex < profiles.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      setCurrentIndex(profiles.length)
    }
  }

  const handleSendMessage = (text, type = 'text') => {
    if (!selectedChat) return
    const chatId = selectedChat.id
    const newMsg = { text, sent: true, time: 'Just now', type }
    setChatMessages(prev => ({
      ...prev,
      [chatId]: [...(prev[chatId] || []), newMsg]
    }))
  }

  const handleMatchMessage = () => {
    const newMatch = {
      id: showMatch.id,
      name: showMatch.name,
      image: showMatch.images[0],
      lastMessage: 'You matched!',
      time: 'Just now',
      unread: true,
    }
    setMatches([newMatch, ...matches])
    setSelectedChat(newMatch)
    setCurrentTab('messages')
    setShowMatch(null)
  }

  const handleEarnPoints = (points) => {
    setUserPoints(userPoints + points)
  }

  const handleSpendPoints = (points) => {
    setUserPoints(Math.max(0, userPoints - points))
  }

  const handleUpdateUser = (updatedUser) => {
    setUser({ ...user, ...updatedUser })
  }

  // Render based on app state
  if (appState === 'welcome') {
    return <WelcomeScreen onGetStarted={() => setAppState('signup')} />
  }

  if (appState === 'signup') {
    switch (signUpStep) {
      case 1:
        return (
          <SignUpStep1
            data={signUpData}
            onUpdate={handleSignUpUpdate}
            onNext={() => setSignUpStep(2)}
          />
        )
      case 2:
        return (
          <SignUpStep2
            data={signUpData}
            onUpdate={handleSignUpUpdate}
            onNext={() => setSignUpStep(3)}
            onBack={() => setSignUpStep(1)}
          />
        )
      case 3:
        return (
          <SignUpStep3
            data={signUpData}
            onUpdate={handleSignUpUpdate}
            onNext={() => setSignUpStep(4)}
            onBack={() => setSignUpStep(2)}
          />
        )
      case 4:
        return (
          <SignUpStep4
            data={signUpData}
            onUpdate={handleSignUpUpdate}
            onComplete={handleSignUpComplete}
            onBack={() => setSignUpStep(3)}
          />
        )
      default:
        return null
    }
  }

  if (appState === 'subscription') {
    return <SubscriptionScreen onSelectPlan={handleSelectPlan} />
  }

  // Main app
  const renderContent = () => {
    if (selectedChat && currentTab === 'messages') {
      return (
        <EnhancedChat
          match={selectedChat}
          messages={chatMessages[selectedChat.id] || []}
          onSendMessage={handleSendMessage}
          onBack={() => setSelectedChat(null)}
          userPlan={userPlan}
          userPoints={userPoints}
          onEarnPoints={handleEarnPoints}
          onSpendPoints={handleSpendPoints}
          language={language}
        />
      )
    }

    switch (currentTab) {
      case 'discover':
        const canMatch = userPlan !== 'free' || matchCount < 5
        return currentProfile && canMatch ? (
          <div className="h-full flex items-center justify-center p-4">
            <div className="w-full max-w-md">
              <ProfileCard
                profile={currentProfile}
                onLike={handleLike}
                onPass={handlePass}
                onSuperLike={handleSuperLike}
              />
            </div>
          </div>
        ) : (
          <EmptyState userPlan={userPlan} />
        )
      case 'messages':
        return <MessagesList matches={matches} onSelectChat={setSelectedChat} />
      case 'profile':
        return (
          <EnhancedProfileSettings
            user={user}
            onUpdateUser={handleUpdateUser}
            userPlan={userPlan}
            userPoints={userPoints}
            onEarnPoints={handleEarnPoints}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CoinIcon />
          <span className="font-bold text-yellow-600">{userPoints}</span>
        </div>
        <div className="flex items-center gap-2">
          <FlameIcon className="w-8 h-8 text-pink-500" />
          <span className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
            koja
          </span>
        </div>
        <button className="text-gray-600 hover:text-gray-800 relative">
          <ChatIcon />
          {matches.some(m => m.unread) && (
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-pink-500 rounded-full" />
          )}
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        {renderContent()}
      </main>

      {/* Bottom Navigation */}
      <nav className="bg-white shadow-lg border-t">
        <div className="flex justify-around">
          <button
            onClick={() => { setCurrentTab('discover'); setSelectedChat(null); }}
            className={`flex-1 py-4 flex flex-col items-center gap-1 ${
              currentTab === 'discover' ? 'text-pink-500' : 'text-gray-400'
            }`}
          >
            <FlameIcon />
            <span className="text-xs">{t('discover')}</span>
          </button>
          <button
            onClick={() => { setCurrentTab('messages'); setSelectedChat(null); }}
            className={`flex-1 py-4 flex flex-col items-center gap-1 relative ${
              currentTab === 'messages' ? 'text-pink-500' : 'text-gray-400'
            }`}
          >
            <ChatIcon />
            <span className="text-xs">{t('messages')}</span>
            {matches.some(m => m.unread) && (
              <span className="absolute top-3 right-1/3 w-2 h-2 bg-pink-500 rounded-full" />
            )}
          </button>
          <button
            onClick={() => { setCurrentTab('profile'); setSelectedChat(null); }}
            className={`flex-1 py-4 flex flex-col items-center gap-1 ${
              currentTab === 'profile' ? 'text-pink-500' : 'text-gray-400'
            }`}
          >
            <UserIcon />
            <span className="text-xs">{t('profile')}</span>
          </button>
        </div>
      </nav>

      {/* Match Modal */}
      {showMatch && (
        <MatchModal
          match={showMatch}
          onClose={() => setShowMatch(null)}
          onMessage={handleMatchMessage}
        />
      )}

      {/* Animations */}
      <style>{`
        @keyframes bounce-in {
          0% { transform: scale(0.5); opacity: 0; }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-bounce-in {
          animation: bounce-in 0.4s ease-out;
        }
      `}</style>
    </div>
  )
}

// Main App wrapper with Language Provider
function App() {
  const [language, setLanguage] = useState('en')

  return (
    <LanguageContext.Provider value={{ language, setLanguage, languages: LANGUAGES }}>
      <AppContent />
    </LanguageContext.Provider>
  )
}

export default App
