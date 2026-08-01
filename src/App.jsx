import { useState, useEffect, useRef, createContext, useContext } from 'react'
import * as faceapi from 'face-api.js'

// ============================================
// FACE VERIFICATION SYSTEM
// ============================================

let faceModelsLoaded = false

const loadFaceModels = async () => {
  if (faceModelsLoaded) return true
  try {
    await Promise.all([
      faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
      faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
      faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
    ])
    faceModelsLoaded = true
    return true
  } catch (err) {
    console.error('Failed to load face models:', err)
    return false
  }
}

const extractFaceDescriptor = async (element) => {
  const detection = await faceapi
    .detectSingleFace(element)
    .withFaceLandmarks()
    .withFaceDescriptor()
  return detection ? detection.descriptor : null
}

const getVideoFrameAsCanvas = (videoSrc) => {
  return new Promise((resolve) => {
    const video = document.createElement('video')
    video.crossOrigin = 'anonymous'
    video.muted = true
    video.playsInline = true
    video.preload = 'auto'

    video.onloadeddata = () => {
      video.currentTime = Math.min(1, video.duration / 2)
    }

    video.onseeked = () => {
      const canvas = document.createElement('canvas')
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext('2d')
      ctx.drawImage(video, 0, 0)
      resolve(canvas)
    }

    video.onerror = () => resolve(null)
    video.src = videoSrc
  })
}

const compareFaces = (desc1, desc2) => {
  const distance = faceapi.euclideanDistance(desc1, desc2)
  const similarity = Math.max(0, Math.min(100, Math.round((1 - distance / 1.0) * 100)))
  return { distance, similarity, match: distance < 0.6 }
}

// ============================================
// NOTIFICATION SYSTEM
// ============================================

const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications')
    return false
  }

  if (Notification.permission === 'granted') {
    return true
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission()
    return permission === 'granted'
  }

  return false
}

const sendNotification = (title, options = {}) => {
  if (Notification.permission === 'granted') {
    const notification = new Notification(title, {
      icon: '/icons/icon.svg',
      badge: '/icons/icon.svg',
      vibrate: [200, 100, 200],
      ...options
    })

    notification.onclick = () => {
      window.focus()
      notification.close()
    }

    return notification
  }
  return null
}

// Notification types
const NotificationTypes = {
  CHALLENGE: 'challenge',
  CONVERSATION_STARTER: 'conversation_starter',
  NEW_MATCH: 'new_match',
  NEW_MESSAGE: 'new_message',
}

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
    appName: 'KONJA',
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
    lookingFor: 'Looking For',
    lookingForDesc: 'What are you hoping to find?',
    friendship: 'Friendship',
    friendshipDesc: 'Meet new people & make friends',
    love: 'Love',
    loveDesc: 'Find a romantic connection',
    both: 'Both',
    bothDesc: 'Open to friendship and romance',
    location: 'Location',
    cityCountry: 'City, Country',
    continue: 'Continue',
    addPhotos: 'Add Photos & Video',
    showPersonality: 'Show off your personality',
    profilePhoto: 'Profile Photo',
    addPhoto: 'Add Photo',
    introVideo: 'Introduction Video (Optional)',
    addVideo: 'Add a short video (max 30 sec)',
    recordVideo: 'Record Video',
    chooseVideo: 'Choose from Library',
    videoUploaded: 'Video uploaded!',
    removeVideo: 'Remove',
    tapToPlay: 'Tap to play',
    videoTooLong: 'Video must be 30 seconds or less',
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
    unlockExperience: 'Unlock the full KONJA experience',
    mostPopular: 'MOST POPULAR',
    continueWithFree: 'Continue with Free',
    startFreeTrial: 'Start Free Trial',
    freeTrialNote: '7-day free trial, cancel anytime',
    free: 'Free',
    standard: 'Standard',
    premium: 'Premium',
    forever: 'forever',
    perMonth: '/mo',
    perYear: '/year',
    monthly: 'Monthly',
    yearly: 'Yearly',
    savePercent: 'Save {percent}%',
    billedYearly: 'Billed yearly',
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
    // Verification
    verifying: 'Verifying your photo and video...',
    verificationPassed: 'Verified! Photo and video match',
    verificationFailed: 'Photo and video faces don\'t match',
    verificationNoFacePhoto: 'No face detected in photo',
    verificationNoFaceVideo: 'No face detected in video',
    verificationBadge: 'Verified',
    verificationLoading: 'Loading verification...',
    matchScore: 'Match score',
    // Notifications
    enableNotifications: 'Enable Notifications',
    notificationsEnabled: 'Notifications Enabled',
    notificationChallengeTitle: 'Language Challenge!',
    notificationChallengeBody: 'Time for a quick language game! Earn points now.',
    notificationStarterTitle: 'Need conversation help?',
    notificationStarterBody: 'Try a conversation starter to keep the chat going!',
    notificationMatchTitle: 'New Match!',
    notificationMatchBody: 'You matched with {name}! Say hello.',
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
    // Gallery
    addMorePhotos: 'Add More Photos',
    photoOf: 'of',
    // Dark Mode
    appearance: 'Appearance',
    darkMode: 'Dark Mode',
    lightMode: 'Light Mode',
    // Onboarding
    onboardingTitle1: 'Welcome to KONJA',
    onboardingDesc1: 'Find meaningful connections through shared culture and language',
    onboardingTitle2: 'Swipe & Match',
    onboardingDesc2: 'Swipe right to like, left to pass. When you both like each other, it\'s a match!',
    onboardingTitle3: 'Learn Together',
    onboardingDesc3: 'Play language games, earn points, and bond over learning new words',
    onboardingTitle4: 'Stay Verified',
    onboardingDesc4: 'Upload a photo and video to get verified and build trust',
    getStartedNow: 'Get Started',
    skip: 'Skip',
    next: 'Next',
    // Profile Completion
    profileCompletion: 'Profile Completion',
    completeProfile: 'Complete your profile to get more matches',
    addPhotoToComplete: 'Add a profile photo',
    addBioToComplete: 'Write a bio',
    addInterestsToComplete: 'Select your interests',
    addVideoToComplete: 'Add an intro video',
    verifyToComplete: 'Verify your identity',
    // Report/Block
    reportUser: 'Report User',
    blockUser: 'Block User',
    reportReasons: 'Why are you reporting this user?',
    fakeProfile: 'Fake profile',
    inappropriateContent: 'Inappropriate content',
    harassment: 'Harassment',
    spam: 'Spam',
    otherReason: 'Other',
    reportSubmitted: 'Report submitted. Thank you.',
    userBlocked: 'User blocked',
    unblock: 'Unblock',
    blockedUsers: 'Blocked Users',
    noBlockedUsers: 'No blocked users',
    confirmBlock: 'Are you sure you want to block this user?',
    yes: 'Yes',
    no: 'No',
    // Matching
    compatibility: 'Compatibility',
    sharedInterests: 'shared interests',
    // T&C and Privacy
    termsOfServiceTitle: 'Terms of Service',
    privacyPolicyTitle: 'Privacy Policy',
    termsContent: 'Welcome to KONJA. By using our app, you agree to these terms.\n\n1. Eligibility: You must be at least 18 years old to use KONJA.\n\n2. Account: You are responsible for maintaining the security of your account and for all activities that occur under it. You agree to provide accurate, current, and complete information.\n\n3. Conduct: You agree not to use KONJA to harass, abuse, or harm others. Fake profiles, spam, and inappropriate content are strictly prohibited.\n\n4. Content: You retain ownership of content you post. By posting, you grant KONJA a non-exclusive license to display your content within the app.\n\n5. Matching & Communication: KONJA facilitates introductions but does not guarantee compatibility. Always exercise caution when meeting someone in person.\n\n6. Subscriptions: Paid plans auto-renew unless canceled at least 24 hours before the renewal date. Refunds follow app store policies.\n\n7. Termination: We reserve the right to suspend or terminate accounts that violate these terms without prior notice.\n\n8. Limitation of Liability: KONJA is provided "as is." We are not liable for any damages arising from your use of the app.\n\n9. Changes: We may update these terms from time to time. Continued use constitutes acceptance of the updated terms.\n\nLast updated: July 2026',
    privacyContent: 'Your privacy matters to us. This policy explains how KONJA collects, uses, and protects your data.\n\n1. Information We Collect:\n- Profile information (name, age, photos, bio, interests)\n- Usage data (swipes, matches, messages)\n- Device information and location (with your permission)\n\n2. How We Use Your Data:\n- To match you with compatible users\n- To improve our matching algorithms\n- To provide customer support\n- To send relevant notifications\n\n3. Data Sharing:\n- We do not sell your personal data\n- Profile information is visible to other users as part of the matching experience\n- We may share anonymized analytics with partners\n\n4. Data Security:\n- We use industry-standard encryption\n- Face verification data is processed locally and not stored on servers\n- Photos and videos are stored securely\n\n5. Your Rights:\n- Access, correct, or delete your personal data\n- Opt out of marketing communications\n- Request a copy of your data\n- Delete your account at any time\n\n6. Cookies & Tracking:\n- We use essential cookies for app functionality\n- Analytics help us improve user experience\n\n7. Children:\n- KONJA is not intended for users under 18\n\n8. Contact:\n- For privacy inquiries: privacy@konja.app\n\nLast updated: July 2026',
    viewTerms: 'View Terms of Service',
    viewPrivacy: 'View Privacy Policy',
    close: 'Close',
    mustBe18: 'You must be at least 18 years old to use KONJA',
    lookingForLabel: 'Looking for',
    learningLanguage: 'Learning',
    wantsToLearn: 'Language to Learn',
    selectLanguageToLearn: 'What language do you want to learn?',
    korean: 'Korean',
    japanese: 'Japanese',
    english: 'English',
    chooseGameLanguage: 'Choose language to practice',
    // Subscription Settings
    currentPlan: 'Current Plan',
    changePlan: 'Change Plan',
    planFeatures: 'Plan Features',
    // Discovery Settings
    maxDistance: 'Maximum Distance',
    km: 'km',
    ageRange: 'Age Range',
    showMe: 'Show Me',
    everyone: 'Everyone',
    men: 'Men',
    women: 'Women',
    // Community
    community: 'Community',
    communityFeed: 'Community Feed',
    allTopics: 'All',
    topicKpop: 'K-Pop',
    topicKdrama: 'K-Drama',
    topicFood: 'Food & Drink',
    topicLanguage: 'Language',
    topicTravel: 'Travel',
    topicCulture: 'Culture',
    newPost: 'New Post',
    writePost: 'Share something with the community...',
    post: 'Post',
    cancel: 'Cancel',
    selectTopic: 'Select a topic',
    likesCount: 'likes',
    commentsCount: 'comments',
    writeComment: 'Write a comment...',
    reply: 'Reply',
    communityGuidelines: 'Be respectful and kind to everyone',
    noPostsYet: 'No posts yet',
    beFirstToPost: 'Be the first to share something!',
    connect: 'Connect',
    connected: 'Connected',
    connectSuccess: 'You are now connected!',
    connectMessage: 'Hey! I saw your post in the community and wanted to connect!',
    justNow: 'just now',
    minutesAgo: 'm ago',
    hoursAgo: 'h ago',
    daysAgo: 'd ago',
  },
  ko: {
    appName: 'KONJA',
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
    lookingFor: '목적',
    lookingForDesc: '무엇을 찾고 있나요?',
    friendship: '우정',
    friendshipDesc: '새로운 사람들을 만나고 친구 사귀기',
    love: '사랑',
    loveDesc: '로맨틱한 인연 찾기',
    both: '둘 다',
    bothDesc: '우정과 사랑 모두 열려 있어요',
    location: '위치',
    cityCountry: '도시, 국가',
    continue: '계속',
    addPhotos: '사진 & 영상 추가',
    showPersonality: '당신의 개성을 보여주세요',
    profilePhoto: '프로필 사진',
    addPhoto: '사진 추가',
    introVideo: '소개 영상 (선택)',
    addVideo: '짧은 영상 추가 (최대 30초)',
    recordVideo: '영상 촬영',
    chooseVideo: '라이브러리에서 선택',
    videoUploaded: '영상 업로드 완료!',
    removeVideo: '삭제',
    tapToPlay: '재생하려면 탭하세요',
    videoTooLong: '영상은 30초 이하여야 합니다',
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
    unlockExperience: 'KONJA의 모든 기능을 이용하세요',
    mostPopular: '인기',
    continueWithFree: '무료로 계속',
    startFreeTrial: '무료 체험 시작',
    freeTrialNote: '7일 무료 체험, 언제든 취소 가능',
    free: '무료',
    standard: '스탠다드',
    premium: '프리미엄',
    forever: '영구',
    perMonth: '/월',
    perYear: '/년',
    monthly: '월간',
    yearly: '연간',
    savePercent: '{percent}% 절약',
    billedYearly: '연간 결제',
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
    verifying: '사진과 영상을 확인 중...',
    verificationPassed: '인증 완료! 사진과 영상이 일치합니다',
    verificationFailed: '사진과 영상의 얼굴이 일치하지 않습니다',
    verificationNoFacePhoto: '사진에서 얼굴을 감지할 수 없습니다',
    verificationNoFaceVideo: '영상에서 얼굴을 감지할 수 없습니다',
    verificationBadge: '인증됨',
    verificationLoading: '인증 로딩 중...',
    matchScore: '일치 점수',
    enableNotifications: '알림 활성화',
    notificationsEnabled: '알림이 활성화됨',
    notificationChallengeTitle: '언어 챌린지!',
    notificationChallengeBody: '언어 게임 할 시간이에요! 지금 포인트를 획득하세요.',
    notificationStarterTitle: '대화 도움이 필요해요?',
    notificationStarterBody: '대화 시작 질문으로 대화를 이어가세요!',
    notificationMatchTitle: '새로운 매치!',
    notificationMatchBody: '{name}님과 매치되었어요! 인사해보세요.',
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
    addMorePhotos: '사진 더 추가',
    photoOf: '/',
    appearance: '외관',
    darkMode: '다크 모드',
    lightMode: '라이트 모드',
    onboardingTitle1: 'KONJA에 오신 것을 환영합니다',
    onboardingDesc1: '문화와 언어를 통해 의미 있는 만남을 찾으세요',
    onboardingTitle2: '스와이프 & 매칭',
    onboardingDesc2: '오른쪽으로 좋아요, 왼쪽으로 패스. 서로 좋아하면 매치!',
    onboardingTitle3: '함께 배우기',
    onboardingDesc3: '언어 게임을 하고, 포인트를 모으고, 새로운 단어를 배우며 교류하세요',
    onboardingTitle4: '인증받기',
    onboardingDesc4: '사진과 영상을 업로드하여 인증받고 신뢰를 쌓으세요',
    getStartedNow: '시작하기',
    skip: '건너뛰기',
    next: '다음',
    profileCompletion: '프로필 완성도',
    completeProfile: '프로필을 완성하면 더 많은 매치를 받을 수 있어요',
    addPhotoToComplete: '프로필 사진 추가',
    addBioToComplete: '자기소개 작성',
    addInterestsToComplete: '관심사 선택',
    addVideoToComplete: '소개 영상 추가',
    verifyToComplete: '본인 인증',
    reportUser: '사용자 신고',
    blockUser: '사용자 차단',
    reportReasons: '신고 사유를 선택해주세요',
    fakeProfile: '가짜 프로필',
    inappropriateContent: '부적절한 콘텐츠',
    harassment: '괴롭힘',
    spam: '스팸',
    otherReason: '기타',
    reportSubmitted: '신고가 접수되었습니다. 감사합니다.',
    userBlocked: '사용자가 차단되었습니다',
    unblock: '차단 해제',
    blockedUsers: '차단된 사용자',
    noBlockedUsers: '차단된 사용자 없음',
    confirmBlock: '이 사용자를 차단하시겠습니까?',
    yes: '예',
    no: '아니오',
    compatibility: '호환성',
    sharedInterests: '공통 관심사',
    termsOfServiceTitle: '이용약관',
    privacyPolicyTitle: '개인정보처리방침',
    termsContent: 'KONJA에 오신 것을 환영합니다. 앱을 사용하면 이 약관에 동의하는 것입니다.\n\n1. 자격: KONJA를 사용하려면 만 18세 이상이어야 합니다.\n\n2. 계정: 계정의 보안을 유지하고 계정에서 발생하는 모든 활동에 대해 책임을 집니다.\n\n3. 행동: KONJA를 사용하여 다른 사람을 괴롭히거나 해를 끼치지 않을 것에 동의합니다. 가짜 프로필, 스팸, 부적절한 콘텐츠는 엄격히 금지됩니다.\n\n4. 콘텐츠: 게시한 콘텐츠의 소유권은 귀하에게 있습니다. 게시함으로써 KONJA에 앱 내에서 콘텐츠를 표시할 비독점적 라이선스를 부여합니다.\n\n5. 매칭 및 커뮤니케이션: KONJA는 소개를 촉진하지만 호환성을 보장하지 않습니다.\n\n6. 구독: 유료 플랜은 갱신일 최소 24시간 전에 취소하지 않는 한 자동 갱신됩니다.\n\n7. 종료: 이 약관을 위반하는 계정을 사전 통지 없이 일시 중지하거나 종료할 권리가 있습니다.\n\n8. 책임 제한: KONJA는 "있는 그대로" 제공됩니다.\n\n9. 변경: 이 약관을 수시로 업데이트할 수 있습니다.\n\n최종 업데이트: 2026년 7월',
    privacyContent: '귀하의 개인정보는 중요합니다. 이 정책은 KONJA가 귀하의 데이터를 수집, 사용, 보호하는 방법을 설명합니다.\n\n1. 수집 정보:\n- 프로필 정보 (이름, 나이, 사진, 자기소개, 관심사)\n- 사용 데이터 (스와이프, 매치, 메시지)\n- 기기 정보 및 위치 (허가 시)\n\n2. 데이터 사용 방법:\n- 호환되는 사용자 매칭\n- 매칭 알고리즘 개선\n- 고객 지원\n- 관련 알림 발송\n\n3. 데이터 공유:\n- 개인 데이터를 판매하지 않습니다\n- 프로필 정보는 매칭의 일환으로 다른 사용자에게 표시됩니다\n\n4. 데이터 보안:\n- 업계 표준 암호화 사용\n- 얼굴 인증 데이터는 로컬에서 처리되며 서버에 저장되지 않습니다\n\n5. 귀하의 권리:\n- 개인 데이터 접근, 수정, 삭제\n- 마케팅 수신 거부\n- 데이터 사본 요청\n- 언제든 계정 삭제\n\n6. 문의: privacy@konja.app\n\n최종 업데이트: 2026년 7월',
    viewTerms: '이용약관 보기',
    viewPrivacy: '개인정보처리방침 보기',
    close: '닫기',
    mustBe18: 'KONJA를 사용하려면 만 18세 이상이어야 합니다',
    lookingForLabel: '목적',
    learningLanguage: '학습 중',
    wantsToLearn: '배우고 싶은 언어',
    selectLanguageToLearn: '어떤 언어를 배우고 싶나요?',
    korean: '한국어',
    japanese: '일본어',
    english: '영어',
    chooseGameLanguage: '연습할 언어를 선택하세요',
    currentPlan: '현재 플랜',
    changePlan: '플랜 변경',
    planFeatures: '플랜 기능',
    maxDistance: '최대 거리',
    km: 'km',
    ageRange: '연령 범위',
    showMe: '보여주기',
    everyone: '모두',
    men: '남성',
    women: '여성',
    community: '커뮤니티',
    communityFeed: '커뮤니티 피드',
    allTopics: '전체',
    topicKpop: 'K-Pop',
    topicKdrama: 'K-드라마',
    topicFood: '음식',
    topicLanguage: '언어',
    topicTravel: '여행',
    topicCulture: '문화',
    newPost: '새 글',
    writePost: '커뮤니티에 공유해보세요...',
    post: '게시',
    cancel: '취소',
    selectTopic: '주제를 선택하세요',
    likesCount: '좋아요',
    commentsCount: '댓글',
    writeComment: '댓글을 작성하세요...',
    reply: '답글',
    communityGuidelines: '모두에게 존중과 친절을 베풀어주세요',
    noPostsYet: '아직 게시글이 없습니다',
    beFirstToPost: '첫 번째 게시글을 작성해보세요!',
    connect: '연결하기',
    connected: '연결됨',
    connectSuccess: '연결되었습니다!',
    connectMessage: '안녕하세요! 커뮤니티에서 게시글을 보고 연결하고 싶었어요!',
    justNow: '방금',
    minutesAgo: '분 전',
    hoursAgo: '시간 전',
    daysAgo: '일 전',
  },
  ja: {
    appName: 'KONJA',
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
    lookingFor: '目的',
    lookingForDesc: '何を探していますか？',
    friendship: '友達',
    friendshipDesc: '新しい人と出会い、友達を作る',
    love: '恋愛',
    loveDesc: 'ロマンチックなつながりを見つける',
    both: '両方',
    bothDesc: '友情も恋愛もオープン',
    location: '場所',
    cityCountry: '都市、国',
    continue: '続ける',
    addPhotos: '写真と動画を追加',
    showPersonality: 'あなたの個性を見せましょう',
    profilePhoto: 'プロフィール写真',
    addPhoto: '写真を追加',
    introVideo: '紹介動画（任意）',
    addVideo: '短い動画を追加（最大30秒）',
    recordVideo: '動画を撮影',
    chooseVideo: 'ライブラリから選択',
    videoUploaded: '動画がアップロードされました！',
    removeVideo: '削除',
    tapToPlay: 'タップして再生',
    videoTooLong: '動画は30秒以下にしてください',
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
    unlockExperience: 'KONJAの全機能をお楽しみください',
    mostPopular: '人気',
    continueWithFree: '無料で続ける',
    startFreeTrial: '無料トライアルを開始',
    freeTrialNote: '7日間無料、いつでもキャンセル可能',
    free: '無料',
    standard: 'スタンダード',
    premium: 'プレミアム',
    forever: '永久',
    perMonth: '/月',
    perYear: '/年',
    monthly: '月額',
    yearly: '年額',
    savePercent: '{percent}%お得',
    billedYearly: '年間請求',
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
    verifying: '写真と動画を確認中...',
    verificationPassed: '認証済み！写真と動画が一致しました',
    verificationFailed: '写真と動画の顔が一致しません',
    verificationNoFacePhoto: '写真で顔が検出されませんでした',
    verificationNoFaceVideo: '動画で顔が検出されませんでした',
    verificationBadge: '認証済み',
    verificationLoading: '認証をロード中...',
    matchScore: '一致スコア',
    enableNotifications: '通知を有効にする',
    notificationsEnabled: '通知が有効です',
    notificationChallengeTitle: '言語チャレンジ！',
    notificationChallengeBody: '言語ゲームの時間です！今すぐポイントを獲得しよう。',
    notificationStarterTitle: '会話のヒントが必要？',
    notificationStarterBody: '会話スターターで会話を続けましょう！',
    notificationMatchTitle: '新しいマッチ！',
    notificationMatchBody: '{name}さんとマッチしました！挨拶しましょう。',
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
    addMorePhotos: '写真を追加',
    photoOf: '/',
    appearance: '外観',
    darkMode: 'ダークモード',
    lightMode: 'ライトモード',
    onboardingTitle1: 'KONJAへようこそ',
    onboardingDesc1: '文化と言語を通じて意味のある出会いを見つけましょう',
    onboardingTitle2: 'スワイプ＆マッチ',
    onboardingDesc2: '右にスワイプでいいね、左でパス。お互いにいいねするとマッチ！',
    onboardingTitle3: '一緒に学ぶ',
    onboardingDesc3: '言語ゲームで遊び、ポイントを貯め、新しい言葉を学びましょう',
    onboardingTitle4: '認証を受ける',
    onboardingDesc4: '写真と動画をアップロードして認証を受け、信頼を築きましょう',
    getStartedNow: '始める',
    skip: 'スキップ',
    next: '次へ',
    profileCompletion: 'プロフィール完成度',
    completeProfile: 'プロフィールを完成させてマッチを増やしましょう',
    addPhotoToComplete: 'プロフィール写真を追加',
    addBioToComplete: '自己紹介を書く',
    addInterestsToComplete: '興味を選択',
    addVideoToComplete: '紹介動画を追加',
    verifyToComplete: '本人確認',
    reportUser: 'ユーザーを報告',
    blockUser: 'ユーザーをブロック',
    reportReasons: '報告理由を選んでください',
    fakeProfile: '偽のプロフィール',
    inappropriateContent: '不適切なコンテンツ',
    harassment: 'ハラスメント',
    spam: 'スパム',
    otherReason: 'その他',
    reportSubmitted: '報告が送信されました。ありがとうございます。',
    userBlocked: 'ユーザーがブロックされました',
    unblock: 'ブロック解除',
    blockedUsers: 'ブロックしたユーザー',
    noBlockedUsers: 'ブロックしたユーザーはいません',
    confirmBlock: 'このユーザーをブロックしますか？',
    yes: 'はい',
    no: 'いいえ',
    compatibility: '相性',
    sharedInterests: '共通の興味',
    termsOfServiceTitle: '利用規約',
    privacyPolicyTitle: 'プライバシーポリシー',
    termsContent: 'KONJAへようこそ。アプリを使用することで、これらの規約に同意したものとみなされます。\n\n1. 資格: KONJAを使用するには18歳以上である必要があります。\n\n2. アカウント: アカウントのセキュリティを維持し、アカウントで発生するすべての活動に責任を負います。\n\n3. 行動: KONJAを使用して他者を嫌がらせたり、害を与えたりしないことに同意します。偽のプロフィール、スパム、不適切なコンテンツは厳禁です。\n\n4. コンテンツ: 投稿したコンテンツの所有権はお客様にあります。投稿することで、アプリ内でコンテンツを表示する非独占的ライセンスをKONJAに付与します。\n\n5. マッチングとコミュニケーション: KONJAは紹介を促進しますが、相性を保証するものではありません。\n\n6. サブスクリプション: 有料プランは更新日の少なくとも24時間前にキャンセルしない限り自動更新されます。\n\n7. 終了: これらの規約に違反するアカウントを予告なく一時停止または終了する権利を留保します。\n\n8. 責任の制限: KONJAは「現状のまま」提供されます。\n\n9. 変更: これらの規約は随時更新される場合があります。\n\n最終更新: 2026年7月',
    privacyContent: 'お客様のプライバシーは重要です。このポリシーでは、KONJAがお客様のデータをどのように収集、使用、保護するかを説明します。\n\n1. 収集する情報:\n- プロフィール情報（名前、年齢、写真、自己紹介、興味）\n- 使用データ（スワイプ、マッチ、メッセージ）\n- デバイス情報と位置情報（許可がある場合）\n\n2. データの使用方法:\n- 互換性のあるユーザーとのマッチング\n- マッチングアルゴリズムの改善\n- カスタマーサポート\n- 関連通知の送信\n\n3. データ共有:\n- 個人データを販売しません\n- プロフィール情報はマッチングの一環として他のユーザーに表示されます\n\n4. データセキュリティ:\n- 業界標準の暗号化を使用\n- 顔認証データはローカルで処理され、サーバーに保存されません\n\n5. お客様の権利:\n- 個人データのアクセス、修正、削除\n- マーケティング配信の停止\n- データのコピーのリクエスト\n- いつでもアカウント削除\n\n6. お問い合わせ: privacy@konja.app\n\n最終更新: 2026年7月',
    viewTerms: '利用規約を見る',
    viewPrivacy: 'プライバシーポリシーを見る',
    close: '閉じる',
    mustBe18: 'KONJAを利用するには18歳以上である必要があります',
    lookingForLabel: '目的',
    learningLanguage: '学習中',
    wantsToLearn: '学びたい言語',
    selectLanguageToLearn: 'どの言語を学びたいですか？',
    korean: '韓国語',
    japanese: '日本語',
    english: '英語',
    chooseGameLanguage: '練習する言語を選択',
    currentPlan: '現在のプラン',
    changePlan: 'プランを変更',
    planFeatures: 'プランの機能',
    maxDistance: '最大距離',
    km: 'km',
    ageRange: '年齢範囲',
    showMe: '表示する',
    everyone: '全員',
    men: '男性',
    women: '女性',
    community: 'コミュニティ',
    communityFeed: 'コミュニティフィード',
    allTopics: 'すべて',
    topicKpop: 'K-Pop',
    topicKdrama: 'K-ドラマ',
    topicFood: 'グルメ',
    topicLanguage: '言語',
    topicTravel: '旅行',
    topicCulture: '文化',
    newPost: '新規投稿',
    writePost: 'コミュニティでシェアしましょう...',
    post: '投稿',
    cancel: 'キャンセル',
    selectTopic: 'トピックを選択',
    likesCount: 'いいね',
    commentsCount: 'コメント',
    writeComment: 'コメントを書く...',
    reply: '返信',
    communityGuidelines: '皆に敬意と優しさを持ちましょう',
    noPostsYet: 'まだ投稿がありません',
    beFirstToPost: '最初の投稿をしましょう！',
    connect: 'つながる',
    connected: 'つながり済み',
    connectSuccess: 'つながりました！',
    connectMessage: 'こんにちは！コミュニティの投稿を見て、つながりたいと思いました！',
    justNow: 'たった今',
    minutesAgo: '分前',
    hoursAgo: '時間前',
    daysAgo: '日前',
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

// Theme Context
const ThemeContext = createContext()

const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used within ThemeProvider')
  return context
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
    priceMonthly: '$0',
    priceYearly: '$0',
    priceYearlyPerMonth: '$0',
    period: 'forever',
    features: [
      'limitedMatches',
      'soloGame',
      'basicProfile',
    ],
    color: 'gray',
  },
  {
    id: 'standard',
    name: 'Standard',
    priceMonthly: '$9.99',
    priceYearly: '$95.88',
    priceYearlyPerMonth: '$7.99',
    period: '/month',
    features: [
      'unlimitedMatches',
      'conversationStarters',
      'multiplayerGames',
      'seeWhoLikes',
    ],
    color: 'pink',
    popular: true,
    yearlySavings: 20,
  },
  {
    id: 'premium',
    name: 'Premium',
    priceMonthly: '$19.99',
    priceYearly: '$191.88',
    priceYearlyPerMonth: '$15.99',
    period: '/month',
    features: [
      'everythingStandard',
      'aiDatePlanning',
      'virtualGifts',
      'priorityVisibility',
      'readReceipts',
    ],
    color: 'purple',
    yearlySavings: 20,
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

const COMMUNITY_TOPICS = [
  { id: 'all', labelKey: 'allTopics', emoji: '🌐' },
  { id: 'kpop', labelKey: 'topicKpop', emoji: '🎤' },
  { id: 'kdrama', labelKey: 'topicKdrama', emoji: '📺' },
  { id: 'food', labelKey: 'topicFood', emoji: '🍜' },
  { id: 'language', labelKey: 'topicLanguage', emoji: '🗣️' },
  { id: 'travel', labelKey: 'topicTravel', emoji: '✈️' },
  { id: 'culture', labelKey: 'topicCulture', emoji: '🏯' },
]

const SAMPLE_COMMUNITY_POSTS = [
  {
    id: 1,
    author: { name: 'Mina', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100', verified: true },
    topic: 'kpop',
    text: 'Just saw BLACKPINK live in concert and it was absolutely INCREDIBLE! The energy was unreal. Anyone else been to a K-pop concert recently?',
    likes: 42,
    comments: [
      { id: 1, author: 'Yuki', text: 'So jealous! I want to see them live next year!', time: '1h ago' },
      { id: 2, author: 'Alex', text: 'Their choreography is insane! Which song was your favorite?', time: '45m ago' },
    ],
    time: '2h ago',
    timeMs: 7200000,
  },
  {
    id: 2,
    author: { name: 'David', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100', verified: false },
    topic: 'food',
    text: 'Made homemade tteokbokki for the first time! Not as spicy as I expected but SO delicious. Drop your favorite Korean recipes below!',
    likes: 28,
    comments: [
      { id: 1, author: 'Soo-jin', text: 'Try adding gochujang for extra kick!', time: '3h ago' },
    ],
    time: '4h ago',
    timeMs: 14400000,
  },
  {
    id: 3,
    author: { name: 'Haruki', image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100', verified: true },
    topic: 'language',
    text: 'Learning Korean tip: Watch K-dramas with Korean subtitles instead of English. It really helps with reading speed and vocabulary! What study methods work for you?',
    likes: 67,
    comments: [
      { id: 1, author: 'Lisa', text: 'This changed my learning completely! Also try Talk To Me In Korean podcast', time: '5h ago' },
      { id: 2, author: 'Jun', text: 'Flashcard apps + dramas = best combo', time: '4h ago' },
      { id: 3, author: 'Emily', text: 'I do this with Japanese anime too!', time: '3h ago' },
    ],
    time: '6h ago',
    timeMs: 21600000,
  },
  {
    id: 4,
    author: { name: 'Sarah', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100', verified: false },
    topic: 'kdrama',
    text: 'Just finished Crash Landing on You and I cannot stop crying. Why do K-dramas do this to us? What should I watch next?',
    likes: 53,
    comments: [
      { id: 1, author: 'Min-ho', text: 'Watch Goblin next! You will cry even more', time: '1d ago' },
      { id: 2, author: 'Nana', text: 'Reply 1988 is a masterpiece!', time: '23h ago' },
    ],
    time: '1d ago',
    timeMs: 86400000,
  },
  {
    id: 5,
    author: { name: 'Kenji', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100', verified: true },
    topic: 'travel',
    text: 'Planning my first trip to Seoul! Must-visit places? I already have Myeongdong and Bukchon Hanok Village on my list.',
    likes: 35,
    comments: [
      { id: 1, author: 'Ji-yeon', text: 'Hongdae for nightlife and street food! Also check out Ikseon-dong for cute cafes', time: '8h ago' },
    ],
    time: '12h ago',
    timeMs: 43200000,
  },
  {
    id: 6,
    author: { name: 'Aiko', image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100', verified: false },
    topic: 'culture',
    text: 'Tried wearing hanbok for the first time at Gyeongbokgung Palace. Such a beautiful experience! Has anyone tried wearing traditional clothing from another Asian culture?',
    likes: 89,
    comments: [
      { id: 1, author: 'Wei', text: 'I wore a yukata in Kyoto last summer! So fun', time: '2d ago' },
    ],
    time: '2d ago',
    timeMs: 172800000,
  },
]

const sampleProfiles = [
  {
    id: 1,
    name: 'Emma',
    age: 28,
    bio: 'K-pop enthusiast 🎤 | Foodie exploring Korean cuisine | Looking for someone to watch K-dramas with',
    location: 'San Francisco, CA',
    distance: '3 miles away',
    lookingFor: 'love',
    images: [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
      'https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?w=400',
      'https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=400',
    ],
    video: null,
    verified: true,
    interests: ['kpop', 'cooking', 'kdrama', 'coffee'],
    learningLanguage: 'ko',
  },
  {
    id: 2,
    name: 'James',
    age: 31,
    bio: 'Learning Korean one word at a time 🇰🇷 | Tech by day, chef by night',
    location: 'Oakland, CA',
    distance: '7 miles away',
    lookingFor: 'both',
    images: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400',
    ],
    video: null,
    verified: false,
    interests: ['cooking', 'language', 'gaming', 'fitness'],
    learningLanguage: 'ko',
  },
  {
    id: 3,
    name: 'Sofia',
    age: 26,
    bio: 'BTS ARMY 💜 | Artist & dreamer | Looking for my partner in crime',
    location: 'Berkeley, CA',
    distance: '5 miles away',
    lookingFor: 'love',
    images: [
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400',
      'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=400',
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400',
    ],
    video: null,
    verified: true,
    interests: ['kpop', 'art', 'dancing', 'photography'],
    learningLanguage: 'ja',
  },
  {
    id: 4,
    name: 'Marcus',
    age: 29,
    bio: 'Korean drama addict 📺 | Yoga instructor | Fluent in food recommendations',
    location: 'Santa Cruz, CA',
    distance: '12 miles away',
    lookingFor: 'friendship',
    images: [
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400',
    ],
    video: null,
    verified: true,
    interests: ['kdrama', 'yoga', 'food', 'outdoors'],
    learningLanguage: 'ko',
  },
  {
    id: 5,
    name: 'Olivia',
    age: 27,
    bio: 'BLACKPINK in my area 🖤💗 | Book lover | Hopeless romantic',
    location: 'San Jose, CA',
    distance: '15 miles away',
    lookingFor: 'love',
    images: [
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400',
    ],
    video: null,
    verified: false,
    interests: ['kpop', 'reading', 'movies', 'pets'],
    learningLanguage: 'en',
  },
]

const calculateCompatibility = (userProfile, otherProfile) => {
  if (!userProfile) return 0
  let score = 0
  const userInterests = userProfile.interests || []
  const otherInterests = otherProfile.interests || []
  const shared = userInterests.filter(i => otherInterests.includes(i))
  score += shared.length * 15
  if (userProfile.lookingFor && otherProfile.lookingFor) {
    if (userProfile.lookingFor === otherProfile.lookingFor) score += 25
    else if (userProfile.lookingFor === 'both' || otherProfile.lookingFor === 'both') score += 15
  }
  if (otherProfile.verified) score += 10
  return Math.min(99, Math.max(10, score))
}

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

const PlayCircleIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
  </svg>
)

const TrashIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
)

const MoonIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
  </svg>
)

const SunIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
)

const FlagIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
  </svg>
)

const ShieldIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
)

const DotsIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
  </svg>
)

const ChevronLeftIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
)

const ChevronRightIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
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

const UsersIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
)

const PlusIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
)

const MessageBubbleIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
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

  const getAge = (dob) => {
    const today = new Date()
    const birth = new Date(dob)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) age--
    return age
  }

  const validate = () => {
    const newErrors = {}
    if (!data.name?.trim()) newErrors.name = t('fullName') + ' is required'
    if (!data.email?.trim()) newErrors.email = t('email') + ' is required'
    if (!data.dateOfBirth) {
      newErrors.dateOfBirth = t('dateOfBirth') + ' is required'
    } else if (getAge(data.dateOfBirth) < 18) {
      newErrors.dateOfBirth = t('mustBe18')
    }
    if (!data.gender) newErrors.gender = t('gender') + ' is required'
    if (!data.lookingFor) newErrors.lookingFor = t('lookingFor') + ' is required'
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
            {data.dateOfBirth && getAge(data.dateOfBirth) < 18 && !errors.dateOfBirth && (
              <p className="text-amber-500 text-sm mt-1">{t('mustBe18')}</p>
            )}
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
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('lookingFor')}</label>
            <p className="text-xs text-gray-500 mb-2">{t('lookingForDesc')}</p>
            <div className="space-y-2">
              {[
                { key: 'friendship', icon: '🤝', label: t('friendship'), desc: t('friendshipDesc') },
                { key: 'love', icon: '💕', label: t('love'), desc: t('loveDesc') },
                { key: 'both', icon: '✨', label: t('both'), desc: t('bothDesc') },
              ].map((option) => (
                <button
                  key={option.key}
                  onClick={() => onUpdate({ lookingFor: option.key })}
                  className={`w-full p-3 rounded-xl border-2 flex items-center gap-3 text-left transition ${
                    data.lookingFor === option.key
                      ? 'border-pink-500 bg-pink-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="text-2xl">{option.icon}</span>
                  <div>
                    <p className={`font-medium ${data.lookingFor === option.key ? 'text-pink-600' : 'text-gray-700'}`}>{option.label}</p>
                    <p className="text-xs text-gray-500">{option.desc}</p>
                  </div>
                </button>
              ))}
            </div>
            {errors.lookingFor && <p className="text-red-500 text-sm mt-1">{errors.lookingFor}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('wantsToLearn')}</label>
            <p className="text-xs text-gray-500 mb-2">{t('selectLanguageToLearn')}</p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'ko', flag: '🇰🇷', label: t('korean') },
                { id: 'ja', flag: '🇯🇵', label: t('japanese') },
                { id: 'en', flag: '🇬🇧', label: t('english') },
              ].map((lang) => (
                <button
                  key={lang.id}
                  onClick={() => onUpdate({ learningLanguage: lang.id })}
                  className={`py-3 px-2 rounded-xl border-2 font-medium transition flex flex-col items-center gap-1 ${
                    data.learningLanguage === lang.id
                      ? 'border-pink-500 bg-pink-50 text-pink-600'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <span className="text-xl">{lang.flag}</span>
                  <span className="text-xs">{lang.label}</span>
                </button>
              ))}
            </div>
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
  const [videoError, setVideoError] = useState(null)
  const [showVideoOptions, setShowVideoOptions] = useState(false)
  const [isPlayingVideo, setIsPlayingVideo] = useState(false)
  const [verificationState, setVerificationState] = useState(null)
  const photoRef = useRef(null)

  useEffect(() => {
    if (data.profileImage && data.profileVideo) {
      runVerification()
    } else {
      setVerificationState(null)
      onUpdate({ faceVerified: false })
    }
  }, [data.profileImage, data.profileVideo])

  const runVerification = async () => {
    setVerificationState({ status: 'loading' })
    const loaded = await loadFaceModels()
    if (!loaded) {
      setVerificationState({ status: 'error', message: 'Models failed to load' })
      return
    }

    setVerificationState({ status: 'verifying' })

    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = data.profileImage
    await new Promise((resolve) => { img.onload = resolve; img.onerror = resolve })

    const photoDescriptor = await extractFaceDescriptor(img)
    if (!photoDescriptor) {
      setVerificationState({ status: 'no_face_photo' })
      onUpdate({ faceVerified: false })
      return
    }

    const videoCanvas = await getVideoFrameAsCanvas(data.profileVideo)
    if (!videoCanvas) {
      setVerificationState({ status: 'no_face_video' })
      onUpdate({ faceVerified: false })
      return
    }

    const videoDescriptor = await extractFaceDescriptor(videoCanvas)
    if (!videoDescriptor) {
      setVerificationState({ status: 'no_face_video' })
      onUpdate({ faceVerified: false })
      return
    }

    const result = compareFaces(photoDescriptor, videoDescriptor)
    if (result.match) {
      setVerificationState({ status: 'passed', similarity: result.similarity })
      onUpdate({ faceVerified: true })
    } else {
      setVerificationState({ status: 'failed', similarity: result.similarity })
      onUpdate({ faceVerified: false })
    }
  }

  const handleImageUpload = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.capture = 'user'
    input.onchange = (e) => {
      const file = e.target.files[0]
      if (file) {
        const url = URL.createObjectURL(file)
        onUpdate({ profileImage: url })
      }
    }
    input.click()
  }

  const handleVideoFromLibrary = () => {
    setShowVideoOptions(false)
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'video/*'
    input.onchange = (e) => {
      const file = e.target.files[0]
      if (file) processVideoFile(file)
    }
    input.click()
  }

  const handleVideoRecord = () => {
    setShowVideoOptions(false)
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'video/*'
    input.capture = 'user'
    input.onchange = (e) => {
      const file = e.target.files[0]
      if (file) processVideoFile(file)
    }
    input.click()
  }

  const processVideoFile = (file) => {
    setVideoError(null)
    const url = URL.createObjectURL(file)
    const video = document.createElement('video')
    video.preload = 'metadata'
    video.onloadedmetadata = () => {
      URL.revokeObjectURL(video.src)
      if (video.duration > 30) {
        setVideoError(t('videoTooLong'))
        URL.revokeObjectURL(url)
        return
      }
      onUpdate({ profileVideo: url, profileVideoFile: file })
    }
    video.src = url
  }

  const handleRemoveVideo = (e) => {
    e.stopPropagation()
    if (data.profileVideo) URL.revokeObjectURL(data.profileVideo)
    onUpdate({ profileVideo: null, profileVideoFile: null, faceVerified: false })
    setVerificationState(null)
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
              className="w-40 h-40 mx-auto rounded-full border-4 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-pink-400 transition bg-gray-100 overflow-hidden"
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

            {data.profileVideo ? (
              <div className="relative rounded-xl overflow-hidden bg-black">
                {isPlayingVideo ? (
                  <video
                    src={data.profileVideo}
                    className="w-full h-48 object-contain"
                    controls
                    autoPlay
                    onEnded={() => setIsPlayingVideo(false)}
                  />
                ) : (
                  <div
                    className="relative cursor-pointer"
                    onClick={() => setIsPlayingVideo(true)}
                  >
                    <video
                      src={data.profileVideo}
                      className="w-full h-48 object-contain"
                      muted
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <PlayCircleIcon className="w-16 h-16 text-white drop-shadow-lg" />
                    </div>
                  </div>
                )}
                <div className="absolute top-2 right-2 flex gap-2">
                  <button
                    onClick={handleRemoveVideo}
                    className="p-2 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
                <div className="bg-green-50 px-4 py-2 flex items-center gap-2">
                  <CheckIcon className="w-5 h-5 text-green-500" />
                  <span className="text-sm text-green-600 font-medium">{t('videoUploaded')}</span>
                </div>
              </div>
            ) : (
              <div
                onClick={() => setShowVideoOptions(true)}
                className="w-full h-32 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-pink-400 transition bg-gray-100"
              >
                <VideoIcon className="w-10 h-10 text-gray-400" />
                <span className="text-sm text-gray-500 mt-2">{t('addVideo')}</span>
              </div>
            )}

            {videoError && (
              <p className="text-sm text-red-500 mt-2 flex items-center gap-1">
                <span>⚠</span> {videoError}
              </p>
            )}
            <p className="text-xs text-gray-400 mt-2">{t('videoHelp')}</p>
          </div>

          {/* Face Verification Status */}
          {verificationState && (
            <div className={`rounded-xl p-4 flex items-center gap-3 ${
              verificationState.status === 'passed' ? 'bg-green-50 border border-green-200' :
              verificationState.status === 'failed' ? 'bg-red-50 border border-red-200' :
              verificationState.status === 'no_face_photo' || verificationState.status === 'no_face_video' ? 'bg-yellow-50 border border-yellow-200' :
              'bg-blue-50 border border-blue-200'
            }`}>
              {(verificationState.status === 'loading' || verificationState.status === 'verifying') && (
                <>
                  <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm text-blue-700 font-medium">{t('verifying')}</span>
                </>
              )}
              {verificationState.status === 'passed' && (
                <>
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-green-700 font-medium">{t('verificationPassed')}</p>
                    <p className="text-xs text-green-600">{t('matchScore')}: {verificationState.similarity}%</p>
                  </div>
                </>
              )}
              {verificationState.status === 'failed' && (
                <>
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <XIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-red-700 font-medium">{t('verificationFailed')}</p>
                    <p className="text-xs text-red-600">{t('matchScore')}: {verificationState.similarity}%</p>
                  </div>
                </>
              )}
              {verificationState.status === 'no_face_photo' && (
                <>
                  <span className="text-xl">⚠</span>
                  <span className="text-sm text-yellow-700 font-medium">{t('verificationNoFacePhoto')}</span>
                </>
              )}
              {verificationState.status === 'no_face_video' && (
                <>
                  <span className="text-xl">⚠</span>
                  <span className="text-sm text-yellow-700 font-medium">{t('verificationNoFaceVideo')}</span>
                </>
              )}
            </div>
          )}

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

      {/* Video Options Modal */}
      {showVideoOptions && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center" onClick={() => setShowVideoOptions(false)}>
          <div
            className="bg-white w-full max-w-md rounded-t-3xl p-6 space-y-3 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4" />
            <button
              onClick={handleVideoRecord}
              className="w-full py-4 px-6 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-2xl font-semibold flex items-center gap-3 hover:shadow-lg transition"
            >
              <VideoIcon className="w-6 h-6" />
              {t('recordVideo')}
            </button>
            <button
              onClick={handleVideoFromLibrary}
              className="w-full py-4 px-6 bg-gray-100 text-gray-700 rounded-2xl font-semibold flex items-center gap-3 hover:bg-gray-200 transition"
            >
              <CameraIcon className="w-6 h-6" />
              {t('chooseVideo')}
            </button>
            <button
              onClick={() => setShowVideoOptions(false)}
              className="w-full py-3 text-gray-400 font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
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

function LegalModal({ title, content, onClose }) {
  const t = useTranslation()
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="font-bold text-lg text-gray-900">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="p-4 overflow-y-auto flex-1">
          <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">{content}</p>
        </div>
        <div className="p-4 border-t">
          <button onClick={onClose} className="w-full py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full font-bold">
            {t('close')}
          </button>
        </div>
      </div>
    </div>
  )
}

function SignUpStep4({ data, onUpdate, onComplete, onBack }) {
  const t = useTranslation()
  const [showTerms, setShowTerms] = useState(false)
  const [showPrivacy, setShowPrivacy] = useState(false)

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
              <div className="flex gap-3 mt-2">
                <button type="button" onClick={(e) => { e.preventDefault(); setShowTerms(true) }} className="text-xs text-pink-500 underline">{t('viewTerms')}</button>
                <button type="button" onClick={(e) => { e.preventDefault(); setShowPrivacy(true) }} className="text-xs text-pink-500 underline">{t('viewPrivacy')}</button>
              </div>
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

      {showTerms && <LegalModal title={t('termsOfServiceTitle')} content={t('termsContent')} onClose={() => setShowTerms(false)} />}
      {showPrivacy && <LegalModal title={t('privacyPolicyTitle')} content={t('privacyContent')} onClose={() => setShowPrivacy(false)} />}
    </div>
  )
}

// ============================================
// SUBSCRIPTION SCREEN
// ============================================

function SubscriptionScreen({ onSelectPlan }) {
  const t = useTranslation()
  const [selectedPlan, setSelectedPlan] = useState('standard')
  const [billingCycle, setBillingCycle] = useState('yearly')

  const planFeatureKeys = {
    free: ['limitedMatches', 'soloGame', 'basicProfile'],
    standard: ['unlimitedMatches', 'conversationStarters', 'multiplayerGames', 'seeWhoLikes'],
    premium: ['everythingStandard', 'aiDatePlanning', 'virtualGifts', 'priorityVisibility', 'readReceipts'],
  }

  const getPrice = (plan) => {
    if (plan.id === 'free') return plan.priceMonthly
    return billingCycle === 'yearly' ? plan.priceYearlyPerMonth : plan.priceMonthly
  }

  const getPeriodLabel = (plan) => {
    if (plan.id === 'free') return ` ${t('forever')}`
    return ` ${t('perMonth')}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-600 to-pink-600 p-6">
      <div className="max-w-md mx-auto">
        <div className="text-center text-white mb-6">
          <SparklesIcon className="w-12 h-12 mx-auto mb-4" />
          <h1 className="text-3xl font-bold">{t('choosePlan')}</h1>
          <p className="text-purple-200 mt-2">{t('unlockExperience')}</p>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-6">
          <div className="bg-white/20 backdrop-blur-sm rounded-full p-1 flex">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition ${
                billingCycle === 'monthly'
                  ? 'bg-white text-purple-600 shadow'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              {t('monthly')}
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition flex items-center gap-1.5 ${
                billingCycle === 'yearly'
                  ? 'bg-white text-purple-600 shadow'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              {t('yearly')}
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                billingCycle === 'yearly'
                  ? 'bg-green-100 text-green-600'
                  : 'bg-green-500/30 text-green-200'
              }`}>-20%</span>
            </button>
          </div>
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
                  <div className="flex items-baseline gap-2 mt-1">
                    <p className={`text-2xl font-bold ${selectedPlan === plan.id ? 'text-pink-600' : 'text-white'}`}>
                      {getPrice(plan)}<span className="text-sm font-normal">{getPeriodLabel(plan)}</span>
                    </p>
                    {plan.id !== 'free' && billingCycle === 'yearly' && (
                      <span className={`text-xs line-through ${selectedPlan === plan.id ? 'text-gray-400' : 'text-white/50'}`}>
                        {plan.priceMonthly}
                      </span>
                    )}
                  </div>
                  {plan.id !== 'free' && billingCycle === 'yearly' && (
                    <p className={`text-xs mt-0.5 ${selectedPlan === plan.id ? 'text-gray-500' : 'text-white/60'}`}>
                      {plan.priceYearly} {t('perYear')} · {t('savePercent', { percent: plan.yearlySavings })}
                    </p>
                  )}
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
  const [targetLang, setTargetLang] = useState(null)
  const [questionIndex, setQuestionIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [gameComplete, setGameComplete] = useState(false)

  const langOptions = [
    { id: 'ko', flag: '🇰🇷', label: t('korean') },
    { id: 'ja', flag: '🇯🇵', label: t('japanese') },
    { id: 'en', flag: '🇬🇧', label: t('english') },
  ].filter(l => l.id !== language)

  if (!targetLang) {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center">
          <div className="text-5xl mb-4">🎮</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('chooseGameLanguage')}</h2>
          <p className="text-gray-500 mb-6">{t('selectLanguageToLearn')}</p>
          <div className="space-y-3">
            {langOptions.map((lang) => (
              <button
                key={lang.id}
                onClick={() => setTargetLang(lang.id)}
                className="w-full py-4 px-6 rounded-xl border-2 border-gray-200 hover:border-pink-500 hover:bg-pink-50 transition flex items-center gap-4 text-left"
              >
                <span className="text-3xl">{lang.flag}</span>
                <span className="text-lg font-semibold text-gray-800">{lang.label}</span>
              </button>
            ))}
          </div>
          <button
            onClick={onClose}
            className="w-full mt-6 py-3 text-gray-400 hover:text-gray-600 font-medium"
          >
            {t('cancel')}
          </button>
        </div>
      </div>
    )
  }

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

function DatePlanningModal({ onClose, matchName, userPlan, onShare }) {
  const t = useTranslation()
  const [selectedDate, setSelectedDate] = useState(null)
  const [generating, setGenerating] = useState(false)
  const [suggestion, setSuggestion] = useState(null)

  const generateSuggestion = () => {
    setGenerating(true)
    setTimeout(() => {
      const randomIdea = DATE_IDEAS[Math.floor(Math.random() * DATE_IDEAS.length)]
      setSuggestion(randomIdea)
      setGenerating(false)
    }, 1500)
  }

  const handleShare = () => {
    if (suggestion && onShare) {
      onShare(`${suggestion.icon} ${suggestion.title} — ${suggestion.description}`)
    }
    onClose()
  }

  if (userPlan !== 'premium') {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-3xl p-6 max-w-sm w-full text-center">
          <div className="text-6xl mb-4">👑</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">{t('premiumFeature')}</h2>
          <p className="text-gray-600 mb-6">{t('datePlanningLocked')}</p>
          <button
            onClick={onClose}
            className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-semibold"
          >
            {t('upgradePremium')}
          </button>
          <button onClick={onClose} className="w-full py-3 text-gray-500 mt-2">
            {t('maybeLater')}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-6 max-w-sm w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">{t('planDate')}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        <p className="text-gray-600 mb-6">{t('generateDateIdea')}</p>

        {!suggestion ? (
          <button
            onClick={generateSuggestion}
            disabled={generating}
            className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold flex items-center justify-center gap-2"
          >
            {generating ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {t('generatingIdea')}
              </>
            ) : (
              <>
                <SparklesIcon className="w-5 h-5" />
                {t('generateDateIdea')}
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
              {t('generateAnother')}
            </button>
            <button
              onClick={handleShare}
              className="w-full py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full font-semibold"
            >
              {t('shareWith')} {matchName}
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

const translateMessage = (text, fromLang, toLang) => {
  const simpleTranslations = {
    'ko-en': { '안녕': 'Hello', '감사합니다': 'Thank you', '좋아요': 'I like it', '뭐해요?': 'What are you doing?', '안녕하세요!': 'Hello!', '오늘 어땠어요?': 'How was your day?' },
    'ja-en': { 'こんにちは': 'Hello', 'ありがとう': 'Thank you', 'いいね': 'Nice', '何してる？': 'What are you doing?' },
    'en-ko': { 'Hello': '안녕', 'Thank you': '감사합니다', 'I like it': '좋아요', 'What are you doing?': '뭐해요?', 'Hey! I noticed you love K-dramas too!': 'K-드라마도 좋아하시는군요!', 'Have you watched Goblin? 👻': '도깨비 봤어요? 👻', 'How was your day?': '오늘 어땠어요?', "I know this amazing Korean BBQ place!": '맛있는 한국 바베큐 맛집을 알아요!', "Let's try that Korean BBQ place! 🥩": '그 한국 바베큐 맛집 가봐요! 🥩' },
    'en-ja': { 'Hello': 'こんにちは', 'Thank you': 'ありがとう', 'Nice': 'いいね', 'What are you doing?': '何してる？', 'Hey! I noticed you love K-dramas too!': 'K-ドラマも好きなんですね！', 'Have you watched Goblin? 👻': 'トッケビ見ましたか？👻', 'How was your day?': '今日はどうでしたか？', "I know this amazing Korean BBQ place!": '美味しい韓国バーベキューのお店を知ってるよ！', "Let's try that Korean BBQ place! 🥩": 'その韓国バーベキューのお店に行こう！🥩' },
    'ko-ja': { '안녕': 'こんにちは', '감사합니다': 'ありがとう', '좋아요': 'いいね', '뭐해요?': '何してる？', '안녕하세요!': 'こんにちは！', '오늘 어땠어요?': '今日はどうでしたか？' },
    'ja-ko': { 'こんにちは': '안녕', 'ありがとう': '감사합니다', 'いいね': '좋아요', '何してる？': '뭐해요？' },
  }
  const key = `${fromLang}-${toLang}`
  return simpleTranslations[key]?.[text] || `[${toLang.toUpperCase()}] ${text}`
}

function EnhancedChat({ match, messages, onSendMessage, onBack, userPlan, userPoints, onEarnPoints, onSpendPoints, language, notificationsEnabled }) {
  const t = useTranslation()
  const [newMessage, setNewMessage] = useState('')
  const [showGifts, setShowGifts] = useState(false)
  const [showDatePlanning, setShowDatePlanning] = useState(false)
  const [showInChatGame, setShowInChatGame] = useState(false)
  const [showConversationStarters, setShowConversationStarters] = useState(false)
  const [autoTranslate, setAutoTranslate] = useState(false)
  const [translatedMessages, setTranslatedMessages] = useState({})
  const [showStarterPrompt, setShowStarterPrompt] = useState(false)

  // Show conversation starter prompt after inactivity
  useEffect(() => {
    const timer = setTimeout(() => {
      // If last message was not sent by user, suggest a conversation starter
      const lastMsg = messages[messages.length - 1]
      if (lastMsg && !lastMsg.sent && userPlan !== 'free') {
        setShowStarterPrompt(true)
        // Send notification if enabled
        if (notificationsEnabled && Notification.permission === 'granted') {
          sendNotification(t('notificationStarterTitle'), {
            body: t('notificationStarterBody'),
            tag: 'starter-' + match.id,
          })
        }
      }
    }, 10000) // 10 seconds for demo (would be longer in production)

    return () => clearTimeout(timer)
  }, [messages, userPlan, notificationsEnabled, match.id, t])

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

        {/* Conversation Starter Prompt */}
        {showStarterPrompt && userPlan !== 'free' && (
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-4 mx-2 border border-purple-200">
            <div className="flex items-start gap-3">
              <div className="text-2xl">💡</div>
              <div className="flex-1">
                <p className="text-sm font-medium text-purple-800">{t('notificationStarterTitle')}</p>
                <p className="text-xs text-purple-600 mt-1">{t('notificationStarterBody')}</p>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => {
                      setShowConversationStarters(true)
                      setShowStarterPrompt(false)
                    }}
                    className="px-4 py-2 bg-purple-500 text-white text-xs rounded-full font-medium hover:bg-purple-600 transition"
                  >
                    {t('ideas')} ✨
                  </button>
                  <button
                    onClick={() => setShowStarterPrompt(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-600 text-xs rounded-full font-medium hover:bg-gray-300 transition"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Message Input */}
      <div className="bg-white p-4 shadow-lg">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder={t('typeMessage')}
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
          onShare={(text) => { onSendMessage(text); setShowDatePlanning(false) }}
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

function ProfileCard({ profile, onLike, onPass, onSuperLike, onReport, onBlock, compatibility }) {
  const t = useTranslation()
  const { language } = useLanguage()
  const { dark } = useTheme()
  const [touchStart, setTouchStart] = useState(null)
  const [touchEnd, setTouchEnd] = useState(null)
  const [swipeDirection, setSwipeDirection] = useState(null)
  const [showVideo, setShowVideo] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showMenu, setShowMenu] = useState(false)
  const [showReportModal, setShowReportModal] = useState(false)
  const [showBlockConfirm, setShowBlockConfirm] = useState(false)
  const [reportSubmitted, setReportSubmitted] = useState(false)

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

  const handleImageTap = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    if (x > rect.width / 2) {
      setCurrentImageIndex(i => Math.min(i + 1, profile.images.length - 1))
    } else {
      setCurrentImageIndex(i => Math.max(i - 1, 0))
    }
  }

  const getInterestLabel = (id) => {
    const interest = INTERESTS_OPTIONS.find(i => i.id === id)
    return interest ? `${interest.emoji} ${interest.label[language] || interest.label.en}` : id
  }

  const handleReport = (reason) => {
    if (onReport) onReport(profile.id, reason)
    setShowReportModal(false)
    setReportSubmitted(true)
    setTimeout(() => setReportSubmitted(false), 2000)
  }

  return (
    <div
      className={`relative rounded-3xl shadow-2xl overflow-hidden transition-transform duration-300 ${
        dark ? 'bg-gray-800' : 'bg-white'
      } ${
        swipeDirection === 'left' ? '-rotate-6 -translate-x-4' :
        swipeDirection === 'right' ? 'rotate-6 translate-x-4' : ''
      }`}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div className="relative h-96 sm:h-[500px]" onClick={handleImageTap}>
        <img
          src={profile.images[currentImageIndex]}
          alt={profile.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

        {/* Photo indicator dots */}
        {profile.images.length > 1 && (
          <div className="absolute top-3 left-0 right-0 flex justify-center gap-1 z-10">
            {profile.images.map((_, idx) => (
              <div key={idx} className={`h-1 rounded-full transition-all ${
                idx === currentImageIndex ? 'w-6 bg-white' : 'w-6 bg-white/40'
              }`} />
            ))}
          </div>
        )}

        {/* Top right: video + menu */}
        <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
          {profile.video && (
            <button
              onClick={(e) => { e.stopPropagation(); setShowVideo(true) }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-black/50 backdrop-blur-sm rounded-full text-white text-sm font-medium hover:bg-black/70 transition"
            >
              <PlayCircleIcon className="w-5 h-5" />
            </button>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu) }}
            className="p-2 bg-black/50 backdrop-blur-sm rounded-full text-white hover:bg-black/70 transition"
          >
            <DotsIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Dropdown menu */}
        {showMenu && (
          <div className="absolute top-16 right-4 bg-white rounded-xl shadow-xl z-20 overflow-hidden min-w-[160px]" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => { setShowMenu(false); setShowReportModal(true) }}
              className="w-full px-4 py-3 flex items-center gap-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              <FlagIcon className="w-4 h-4" />
              {t('reportUser')}
            </button>
            <button
              onClick={() => { setShowMenu(false); setShowBlockConfirm(true) }}
              className="w-full px-4 py-3 flex items-center gap-2 text-sm text-red-600 hover:bg-red-50 border-t"
            >
              <ShieldIcon className="w-4 h-4" />
              {t('blockUser')}
            </button>
          </div>
        )}

        {/* Compatibility badge */}
        {compatibility > 0 && (
          <div className="absolute top-4 left-4 px-3 py-1.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white text-sm font-bold z-10">
            {compatibility}% {t('compatibility')}
          </div>
        )}

        {swipeDirection === 'right' && (
          <div className="absolute top-20 left-8 border-4 border-green-500 text-green-500 px-4 py-2 rounded-lg rotate-[-20deg] text-2xl font-bold">
            LIKE
          </div>
        )}
        {swipeDirection === 'left' && (
          <div className="absolute top-20 right-8 border-4 border-red-500 text-red-500 px-4 py-2 rounded-lg rotate-[20deg] text-2xl font-bold">
            NOPE
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="flex items-end justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-3xl font-bold">{profile.name}, {profile.age}</h2>
                {profile.verified && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-500 text-white text-xs font-bold rounded-full">
                    <CheckIcon className="w-3 h-3" />
                    {t('verificationBadge')}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 text-gray-200 mt-1">
                <LocationIcon className="w-4 h-4" />
                <span className="text-sm">{profile.distance}</span>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {profile.lookingFor && (
                  <span className="px-2.5 py-1 bg-white/25 backdrop-blur-sm rounded-full text-xs font-medium">
                    {profile.lookingFor === 'friendship' ? '🤝' : profile.lookingFor === 'love' ? '💕' : '✨'}{' '}
                    {t(profile.lookingFor)}
                  </span>
                )}
                {profile.learningLanguage && (
                  <span className="px-2.5 py-1 bg-white/25 backdrop-blur-sm rounded-full text-xs font-medium">
                    {profile.learningLanguage === 'ko' ? '🇰🇷' : profile.learningLanguage === 'ja' ? '🇯🇵' : '🇬🇧'}{' '}
                    {t('learningLanguage')} {t(profile.learningLanguage === 'ko' ? 'korean' : profile.learningLanguage === 'ja' ? 'japanese' : 'english')}
                  </span>
                )}
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

      <div className={`flex justify-center items-center gap-4 p-6 ${dark ? 'bg-gray-800' : 'bg-white'}`}>
        <button
          onClick={onPass}
          className={`w-16 h-16 rounded-full shadow-lg border flex items-center justify-center text-red-500 hover:scale-110 transition-transform active:scale-95 ${dark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`}
        >
          <XIcon className="w-8 h-8" />
        </button>
        <button
          onClick={onSuperLike}
          className={`w-12 h-12 rounded-full shadow-lg border flex items-center justify-center text-blue-500 hover:scale-110 transition-transform active:scale-95 ${dark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`}
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

      {/* Report submitted toast */}
      {reportSubmitted && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg z-30">
          {t('reportSubmitted')}
        </div>
      )}

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowReportModal(false)}>
          <div className={`w-full max-w-sm rounded-2xl p-6 ${dark ? 'bg-gray-800' : 'bg-white'}`} onClick={(e) => e.stopPropagation()}>
            <h3 className={`text-lg font-bold mb-4 ${dark ? 'text-white' : 'text-gray-900'}`}>{t('reportReasons')}</h3>
            <div className="space-y-2">
              {['fakeProfile', 'inappropriateContent', 'harassment', 'spam', 'otherReason'].map((reason) => (
                <button
                  key={reason}
                  onClick={() => handleReport(reason)}
                  className={`w-full p-3 rounded-xl text-left text-sm font-medium transition ${dark ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  {t(reason)}
                </button>
              ))}
            </div>
            <button onClick={() => setShowReportModal(false)} className="w-full mt-4 py-2 text-gray-400 text-sm">Cancel</button>
          </div>
        </div>
      )}

      {/* Block Confirm */}
      {showBlockConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowBlockConfirm(false)}>
          <div className={`w-full max-w-sm rounded-2xl p-6 text-center ${dark ? 'bg-gray-800' : 'bg-white'}`} onClick={(e) => e.stopPropagation()}>
            <ShieldIcon className={`w-12 h-12 mx-auto mb-3 ${dark ? 'text-red-400' : 'text-red-500'}`} />
            <p className={`font-medium mb-4 ${dark ? 'text-white' : 'text-gray-900'}`}>{t('confirmBlock')}</p>
            <div className="flex gap-3">
              <button onClick={() => setShowBlockConfirm(false)} className={`flex-1 py-3 rounded-xl font-medium ${dark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>{t('no')}</button>
              <button onClick={() => { setShowBlockConfirm(false); if (onBlock) onBlock(profile.id) }} className="flex-1 py-3 bg-red-500 text-white rounded-xl font-medium">{t('yes')}</button>
            </div>
          </div>
        </div>
      )}

      {/* Video Playback Modal */}
      {showVideo && profile.video && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center" onClick={() => setShowVideo(false)}>
          <button className="absolute top-6 right-6 text-white p-2 hover:bg-white/20 rounded-full transition z-10" onClick={() => setShowVideo(false)}>
            <XIcon className="w-8 h-8" />
          </button>
          <div className="w-full max-w-lg px-4" onClick={(e) => e.stopPropagation()}>
            <video src={profile.video} className="w-full rounded-2xl" controls autoPlay playsInline />
            <p className="text-white text-center mt-4 font-medium">{profile.name}'s intro</p>
          </div>
        </div>
      )}
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
// SUBSCRIPTION SETTINGS VIEW
// ============================================

function SubscriptionSettingsView({ dark, t, badge, userPlan, onBack }) {
  const [billingCycle, setBillingCycle] = useState('yearly')

  const getPrice = (plan) => {
    if (plan.id === 'free') return plan.priceMonthly
    return billingCycle === 'yearly' ? plan.priceYearlyPerMonth : plan.priceMonthly
  }

  return (
    <div className={`h-full overflow-y-auto ${dark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className={`shadow-sm px-4 py-3 flex items-center gap-3 ${dark ? 'bg-gray-800' : 'bg-white'}`}>
        <button onClick={onBack} className={dark ? 'text-gray-400' : 'text-gray-600'}>
          <BackIcon />
        </button>
        <h2 className={`font-semibold ${dark ? 'text-white' : 'text-gray-900'}`}>{t('subscription')}</h2>
      </div>

      <div className="p-4">
        <div className={`rounded-2xl p-4 mb-4 ${dark ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
          <p className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{t('currentPlan')}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className={`${badge.color} text-white text-sm font-bold px-3 py-1 rounded-full`}>{badge.text}</span>
          </div>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-4">
          <div className={`rounded-full p-1 flex ${dark ? 'bg-gray-700' : 'bg-gray-200'}`}>
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                billingCycle === 'monthly'
                  ? dark ? 'bg-gray-600 text-white shadow' : 'bg-white text-gray-900 shadow'
                  : dark ? 'text-gray-400' : 'text-gray-500'
              }`}
            >
              {t('monthly')}
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition flex items-center gap-1.5 ${
                billingCycle === 'yearly'
                  ? dark ? 'bg-gray-600 text-white shadow' : 'bg-white text-gray-900 shadow'
                  : dark ? 'text-gray-400' : 'text-gray-500'
              }`}
            >
              {t('yearly')}
              <span className="text-xs px-1.5 py-0.5 rounded-full font-bold bg-green-100 text-green-600">-20%</span>
            </button>
          </div>
        </div>

        <h3 className={`text-sm font-semibold mb-3 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{t('changePlan')}</h3>

        <div className="space-y-3">
          {SUBSCRIPTION_PLANS.map((plan) => {
            const isActive = userPlan === plan.id
            return (
              <div
                key={plan.id}
                className={`rounded-2xl p-4 border-2 transition ${
                  isActive
                    ? 'border-pink-500 shadow-lg'
                    : dark ? 'border-gray-700' : 'border-gray-200'
                } ${dark ? 'bg-gray-800' : 'bg-white'}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className={`font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>{t(plan.id)}</h4>
                    <div className="flex items-baseline gap-2">
                      <p className="text-pink-500 font-bold">
                        {getPrice(plan)}
                        <span className={`text-sm font-normal ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                          {plan.id === 'free' ? ` ${t('forever')}` : ` ${t('perMonth')}`}
                        </span>
                      </p>
                      {plan.id !== 'free' && billingCycle === 'yearly' && (
                        <span className={`text-xs line-through ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
                          {plan.priceMonthly}
                        </span>
                      )}
                    </div>
                    {plan.id !== 'free' && billingCycle === 'yearly' && (
                      <p className={`text-xs mt-0.5 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
                        {plan.priceYearly} {t('perYear')} · {t('savePercent', { percent: plan.yearlySavings })}
                      </p>
                    )}
                  </div>
                  {isActive && (
                    <span className="px-3 py-1 bg-pink-500 text-white text-xs font-bold rounded-full">{t('currentPlan')}</span>
                  )}
                </div>
                <ul className="space-y-1.5">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className={`flex items-center gap-2 text-sm ${dark ? 'text-gray-300' : 'text-gray-600'}`}>
                      <CheckIcon className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span>{t(feature)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ============================================
// ENHANCED PROFILE SETTINGS COMPONENT
// ============================================

function EnhancedProfileSettings({ user, onUpdateUser, userPlan, userPoints, onEarnPoints, notificationsEnabled, onEnableNotifications }) {
  const { language, setLanguage, languages } = useLanguage()
  const { dark, toggleDark } = useTheme()
  const t = useTranslation()
  const [showEditProfile, setShowEditProfile] = useState(false)
  const [showLanguageGame, setShowLanguageGame] = useState(false)
  const [showLanguageSettings, setShowLanguageSettings] = useState(false)
  const [showSubscription, setShowSubscription] = useState(false)
  const [showDiscovery, setShowDiscovery] = useState(false)
  const [showTermsModal, setShowTermsModal] = useState(false)
  const [showPrivacyModal, setShowPrivacyModal] = useState(false)
  const [editData, setEditData] = useState({ ...user })
  const [discoveryData, setDiscoveryData] = useState({
    distance: 50,
    ageMin: 18,
    ageMax: 45,
    showMe: 'everyone',
  })

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

  if (showSubscription) {
    return <SubscriptionSettingsView dark={dark} t={t} badge={badge} userPlan={userPlan} onBack={() => setShowSubscription(false)} />
  }

  if (showDiscovery) {
    return (
      <div className={`h-full overflow-y-auto ${dark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className={`shadow-sm px-4 py-3 flex items-center gap-3 ${dark ? 'bg-gray-800' : 'bg-white'}`}>
          <button onClick={() => setShowDiscovery(false)} className={dark ? 'text-gray-400' : 'text-gray-600'}>
            <BackIcon />
          </button>
          <h2 className={`font-semibold ${dark ? 'text-white' : 'text-gray-900'}`}>{t('discoverySettings')}</h2>
        </div>

        <div className="p-4 space-y-6">
          {/* Max Distance */}
          <div className={`rounded-2xl p-4 ${dark ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
            <div className="flex items-center justify-between mb-3">
              <span className={`font-medium ${dark ? 'text-white' : 'text-gray-900'}`}>{t('maxDistance')}</span>
              <span className="text-pink-500 font-bold">{discoveryData.distance} {t('km')}</span>
            </div>
            <input
              type="range"
              min="1"
              max="200"
              value={discoveryData.distance}
              onChange={e => setDiscoveryData({ ...discoveryData, distance: parseInt(e.target.value) })}
              className="w-full accent-pink-500"
            />
            <div className={`flex justify-between text-xs mt-1 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
              <span>1 {t('km')}</span>
              <span>200 {t('km')}</span>
            </div>
          </div>

          {/* Age Range */}
          <div className={`rounded-2xl p-4 ${dark ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
            <div className="flex items-center justify-between mb-3">
              <span className={`font-medium ${dark ? 'text-white' : 'text-gray-900'}`}>{t('ageRange')}</span>
              <span className="text-pink-500 font-bold">{discoveryData.ageMin} - {discoveryData.ageMax}</span>
            </div>
            <div className="space-y-4">
              <div>
                <label className={`text-xs ${dark ? 'text-gray-400' : 'text-gray-500'}`}>Min: {discoveryData.ageMin}</label>
                <input
                  type="range"
                  min="18"
                  max="60"
                  value={discoveryData.ageMin}
                  onChange={e => {
                    const val = parseInt(e.target.value)
                    setDiscoveryData({ ...discoveryData, ageMin: val, ageMax: Math.max(val, discoveryData.ageMax) })
                  }}
                  className="w-full accent-pink-500"
                />
              </div>
              <div>
                <label className={`text-xs ${dark ? 'text-gray-400' : 'text-gray-500'}`}>Max: {discoveryData.ageMax}</label>
                <input
                  type="range"
                  min="18"
                  max="60"
                  value={discoveryData.ageMax}
                  onChange={e => {
                    const val = parseInt(e.target.value)
                    setDiscoveryData({ ...discoveryData, ageMax: val, ageMin: Math.min(val, discoveryData.ageMin) })
                  }}
                  className="w-full accent-pink-500"
                />
              </div>
            </div>
          </div>

          {/* Show Me */}
          <div className={`rounded-2xl p-4 ${dark ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
            <span className={`font-medium block mb-3 ${dark ? 'text-white' : 'text-gray-900'}`}>{t('showMe')}</span>
            <div className="space-y-2">
              {['everyone', 'men', 'women'].map(option => (
                <button
                  key={option}
                  onClick={() => setDiscoveryData({ ...discoveryData, showMe: option })}
                  className={`w-full p-3 rounded-xl border-2 text-left font-medium transition ${
                    discoveryData.showMe === option
                      ? 'border-pink-500 bg-pink-50 text-pink-600 dark:bg-pink-900/20'
                      : dark
                        ? 'border-gray-700 text-gray-300 hover:border-gray-600'
                        : 'border-gray-200 text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {t(option)}
                </button>
              ))}
            </div>
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
              <button
                onClick={() => {
                  const input = document.createElement('input')
                  input.type = 'file'
                  input.accept = 'image/*'
                  input.onchange = (e) => {
                    const file = e.target.files[0]
                    if (file) {
                      const url = URL.createObjectURL(file)
                      setEditData({ ...editData, image: url })
                    }
                  }
                  input.click()
                }}
                className="absolute bottom-0 right-0 w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center text-white shadow-lg"
              >
                <CameraIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Video */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('introVideo')}</label>
            {editData.profileVideo ? (
              <div className="relative rounded-xl overflow-hidden bg-black">
                <video
                  src={editData.profileVideo}
                  className="w-full h-40 object-contain"
                  controls
                  playsInline
                />
                <button
                  onClick={() => setEditData({ ...editData, profileVideo: null })}
                  className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  const input = document.createElement('input')
                  input.type = 'file'
                  input.accept = 'video/*'
                  input.onchange = (e) => {
                    const file = e.target.files[0]
                    if (file) {
                      const url = URL.createObjectURL(file)
                      const vid = document.createElement('video')
                      vid.preload = 'metadata'
                      vid.onloadedmetadata = () => {
                        URL.revokeObjectURL(vid.src)
                        if (vid.duration <= 30) {
                          setEditData({ ...editData, profileVideo: url })
                        } else {
                          URL.revokeObjectURL(url)
                          alert(t('videoTooLong'))
                        }
                      }
                      vid.src = url
                    }
                  }
                  input.click()
                }}
                className="w-full h-24 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-500 hover:border-pink-400 transition"
              >
                <VideoIcon className="w-8 h-8" />
                <span className="text-sm mt-1">{t('updateVideo')}</span>
              </button>
            )}
            <p className="text-xs text-gray-400 mt-2">{t('videoHelp')}</p>
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

          {/* Looking For */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('lookingFor')}</label>
            <div className="space-y-2">
              {[
                { key: 'friendship', icon: '🤝', label: t('friendship'), desc: t('friendshipDesc') },
                { key: 'love', icon: '💕', label: t('love'), desc: t('loveDesc') },
                { key: 'both', icon: '✨', label: t('both'), desc: t('bothDesc') },
              ].map((option) => (
                <button
                  key={option.key}
                  onClick={() => setEditData({ ...editData, lookingFor: option.key })}
                  className={`w-full p-3 rounded-xl border-2 flex items-center gap-3 text-left transition ${
                    editData.lookingFor === option.key
                      ? 'border-pink-500 bg-pink-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="text-2xl">{option.icon}</span>
                  <div>
                    <p className={`font-medium ${editData.lookingFor === option.key ? 'text-pink-600' : 'text-gray-700'}`}>{option.label}</p>
                    <p className="text-xs text-gray-500">{option.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Learning Language */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('wantsToLearn')}</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'ko', flag: '🇰🇷', label: t('korean') },
                { id: 'ja', flag: '🇯🇵', label: t('japanese') },
                { id: 'en', flag: '🇬🇧', label: t('english') },
              ].map((lang) => (
                <button
                  key={lang.id}
                  onClick={() => setEditData({ ...editData, learningLanguage: lang.id })}
                  className={`py-3 px-2 rounded-xl border-2 font-medium transition flex flex-col items-center gap-1 ${
                    editData.learningLanguage === lang.id
                      ? 'border-pink-500 bg-pink-50 text-pink-600'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <span className="text-xl">{lang.flag}</span>
                  <span className="text-xs">{lang.label}</span>
                </button>
              ))}
            </div>
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
    <div className={`h-full overflow-y-auto ${dark ? 'bg-gray-900' : 'bg-gray-50'}`}>
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
        <div className="flex items-center justify-center gap-2 mt-4">
          <h2 className="text-2xl font-bold">{user.name}, {user.age}</h2>
          {user.verified && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-500 text-white text-xs font-bold rounded-full">
              <CheckIcon className="w-3 h-3" />
              {t('verificationBadge')}
            </span>
          )}
        </div>
        {user.lookingFor && (
          <span className="inline-block mt-2 px-3 py-1 bg-white/20 rounded-full text-sm">
            {user.lookingFor === 'friendship' ? '🤝' : user.lookingFor === 'love' ? '💕' : '✨'} {t(user.lookingFor)}
          </span>
        )}
        <div className="flex items-center justify-center gap-2 mt-2">
          <CoinIcon />
          <span className="font-bold">{userPoints} {t('points')}</span>
        </div>
      </div>

      {/* Stats */}
      <div className={`-mt-8 mx-4 rounded-2xl shadow-lg p-4 mb-4 ${dark ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex justify-around text-center">
          <div>
            <p className="text-2xl font-bold text-pink-500">{user.likes || 0}</p>
            <p className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{t('likes')}</p>
          </div>
          <div className={`border-l border-r px-8 ${dark ? 'border-gray-700' : ''}`}>
            <p className="text-2xl font-bold text-pink-500">{user.matches || 0}</p>
            <p className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{t('matches')}</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-pink-500">{user.superLikes || 0}</p>
            <p className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{t('superLikes')}</p>
          </div>
        </div>
      </div>

      {/* Interests */}
      <div className={`mx-4 rounded-2xl shadow-lg p-4 mb-4 ${dark ? 'bg-gray-800' : 'bg-white'}`}>
        <h3 className={`font-semibold mb-3 ${dark ? 'text-white' : 'text-gray-900'}`}>{t('yourInterests')}</h3>
        <div className="flex flex-wrap gap-2">
          {(user.interests || []).map((interest, idx) => (
            <span key={idx} className={`px-3 py-1 rounded-full text-sm font-medium ${dark ? 'bg-pink-900/30 text-pink-400' : 'bg-pink-100 text-pink-600'}`}>
              {getInterestLabel(interest)}
            </span>
          ))}
        </div>
      </div>

      {/* Language Game */}
      <div className={`mx-4 rounded-2xl shadow-lg p-4 mb-4 ${dark ? 'bg-gray-800' : 'bg-white'}`}>
        <button
          onClick={() => setShowLanguageGame(true)}
          className="w-full flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <GameIcon className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <h3 className={`font-semibold ${dark ? 'text-white' : 'text-gray-900'}`}>{t('languageGame')}</h3>
              <p className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{t('learnAndEarn')}</p>
            </div>
          </div>
          <ChevronRightIcon className="w-6 h-6 text-pink-500" />
        </button>
      </div>

      {/* Settings */}
      <div className={`mx-4 rounded-2xl shadow-lg divide-y mb-4 ${dark ? 'bg-gray-800 divide-gray-700' : 'bg-white'}`}>
        <button
          onClick={() => setShowEditProfile(true)}
          className={`w-full p-4 flex items-center justify-between ${dark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}
        >
          <span className={`font-medium ${dark ? 'text-gray-200' : 'text-gray-700'}`}>{t('editProfile')}</span>
          <ChevronRightIcon className={`w-5 h-5 ${dark ? 'text-gray-500' : 'text-gray-400'}`} />
        </button>
        <button
          onClick={() => setShowLanguageSettings(true)}
          className={`w-full p-4 flex items-center justify-between ${dark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}
        >
          <span className={`font-medium ${dark ? 'text-gray-200' : 'text-gray-700'}`}>{t('languageSettings')}</span>
          <div className="flex items-center gap-2">
            <span className="text-sm">{languages.find(l => l.id === language)?.flag}</span>
            <ChevronRightIcon className={`w-5 h-5 ${dark ? 'text-gray-500' : 'text-gray-400'}`} />
          </div>
        </button>
        <button
          onClick={() => setShowSubscription(true)}
          className={`w-full p-4 flex items-center justify-between ${dark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}
        >
          <span className={`font-medium ${dark ? 'text-gray-200' : 'text-gray-700'}`}>{t('subscription')}</span>
          <span className={`${badge.color} text-white text-xs font-bold px-2 py-1 rounded-full`}>{badge.text}</span>
        </button>
        <button
          onClick={() => setShowDiscovery(true)}
          className={`w-full p-4 flex items-center justify-between ${dark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}
        >
          <span className={`font-medium ${dark ? 'text-gray-200' : 'text-gray-700'}`}>{t('discoverySettings')}</span>
          <ChevronRightIcon className={`w-5 h-5 ${dark ? 'text-gray-500' : 'text-gray-400'}`} />
        </button>
        <button
          onClick={!notificationsEnabled ? onEnableNotifications : undefined}
          className={`w-full p-4 flex items-center justify-between ${dark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}
        >
          <span className="font-medium text-gray-700">{t('notifications')}</span>
          {notificationsEnabled ? (
            <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full font-medium">
              ✓ {t('notificationsEnabled')}
            </span>
          ) : (
            <span className="text-xs bg-pink-100 text-pink-600 px-2 py-1 rounded-full font-medium">
              {t('enableNotifications')}
            </span>
          )}
        </button>
      </div>

      <div className={`mx-4 rounded-2xl shadow-lg divide-y mb-4 ${dark ? 'bg-gray-800 divide-gray-700' : 'bg-white'}`}>
        <div className="w-full p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {dark ? <MoonIcon className="w-5 h-5 text-purple-400" /> : <SunIcon className="w-5 h-5 text-yellow-500" />}
            <span className={`font-medium ${dark ? 'text-gray-200' : 'text-gray-700'}`}>{t('appearance')}</span>
          </div>
          <button
            onClick={toggleDark}
            className={`relative w-12 h-7 rounded-full transition-colors ${dark ? 'bg-purple-500' : 'bg-gray-300'}`}
          >
            <div className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform ${dark ? 'translate-x-5' : 'translate-x-0.5'}`} />
          </button>
        </div>
      </div>

      <div className={`mx-4 rounded-2xl shadow-lg divide-y mb-8 ${dark ? 'bg-gray-800 divide-gray-700' : 'bg-white'}`}>
        <button className={`w-full p-4 flex items-center justify-between ${dark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
          <span className={`font-medium ${dark ? 'text-gray-200' : 'text-gray-700'}`}>{t('helpSupport')}</span>
          <ChevronRightIcon className={`w-5 h-5 ${dark ? 'text-gray-500' : 'text-gray-400'}`} />
        </button>
        <button
          onClick={() => setShowPrivacyModal(true)}
          className={`w-full p-4 flex items-center justify-between ${dark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}
        >
          <span className={`font-medium ${dark ? 'text-gray-200' : 'text-gray-700'}`}>{t('privacyPolicy')}</span>
          <ChevronRightIcon className={`w-5 h-5 ${dark ? 'text-gray-500' : 'text-gray-400'}`} />
        </button>
        <button
          onClick={() => setShowTermsModal(true)}
          className={`w-full p-4 flex items-center justify-between ${dark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}
        >
          <span className={`font-medium ${dark ? 'text-gray-200' : 'text-gray-700'}`}>{t('termsOfServiceTitle')}</span>
          <ChevronRightIcon className={`w-5 h-5 ${dark ? 'text-gray-500' : 'text-gray-400'}`} />
        </button>
        <button className={`w-full p-4 text-red-500 font-medium ${dark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
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
      {showTermsModal && <LegalModal title={t('termsOfServiceTitle')} content={t('termsContent')} onClose={() => setShowTermsModal(false)} />}
      {showPrivacyModal && <LegalModal title={t('privacyPolicyTitle')} content={t('privacyContent')} onClose={() => setShowPrivacyModal(false)} />}
    </div>
  )
}

// ============================================
// EMPTY STATE
// ============================================

function EmptyState({ userPlan, onExpandSearch }) {
  const t = useTranslation()
  const { dark } = useTheme()
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
      <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-4 ${dark ? 'bg-pink-900/30' : 'bg-pink-100'}`}>
        <HeartIcon filled className="w-12 h-12 text-pink-500" />
      </div>
      <h2 className={`text-2xl font-bold mb-2 ${dark ? 'text-white' : 'text-gray-800'}`}>
        {userPlan === 'free' ? t('dailyLimitReached') : t('noMoreProfiles')}
      </h2>
      <p className={`mb-6 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
        {userPlan === 'free'
          ? t('upgradeUnlimited')
          : t('checkBackLater')
        }
      </p>
      <button
        onClick={onExpandSearch}
        className="px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full font-semibold hover:shadow-lg transition"
      >
        {userPlan === 'free' ? t('upgradeNow') : t('expandSearch')}
      </button>
    </div>
  )
}

// ============================================
// COMMUNITY FEED
// ============================================

function CommunityFeed({ user, posts, onAddPost, onLikePost, onAddComment, onConnectUser, connectedUsers }) {
  const t = useTranslation()
  const { dark } = useTheme()
  const [selectedTopic, setSelectedTopic] = useState('all')
  const [showNewPost, setShowNewPost] = useState(false)
  const [newPostText, setNewPostText] = useState('')
  const [newPostTopic, setNewPostTopic] = useState('culture')
  const [expandedComments, setExpandedComments] = useState({})
  const [commentText, setCommentText] = useState({})
  const [connectToast, setConnectToast] = useState(null)

  const filteredPosts = selectedTopic === 'all'
    ? posts
    : posts.filter(p => p.topic === selectedTopic)

  const handlePost = () => {
    if (!newPostText.trim()) return
    onAddPost({
      text: newPostText.trim(),
      topic: newPostTopic,
    })
    setNewPostText('')
    setNewPostTopic('culture')
    setShowNewPost(false)
  }

  const handleComment = (postId) => {
    const text = commentText[postId]
    if (!text?.trim()) return
    onAddComment(postId, text.trim())
    setCommentText({ ...commentText, [postId]: '' })
  }

  const toggleComments = (postId) => {
    setExpandedComments(prev => ({ ...prev, [postId]: !prev[postId] }))
  }

  const getTopicEmoji = (topicId) => {
    const topic = COMMUNITY_TOPICS.find(t => t.id === topicId)
    return topic ? topic.emoji : '🌐'
  }

  return (
    <div className="h-full flex flex-col">
      {/* Topic Filter Bar */}
      <div className={`px-3 py-2 border-b ${dark ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {COMMUNITY_TOPICS.map(topic => (
            <button
              key={topic.id}
              onClick={() => setSelectedTopic(topic.id)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                selectedTopic === topic.id
                  ? 'bg-pink-500 text-white'
                  : dark
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <span>{topic.emoji}</span>
              <span>{t(topic.labelKey)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Post Feed */}
      <div className="flex-1 overflow-y-auto">
        {/* Guidelines Banner */}
        <div className={`mx-4 mt-3 mb-2 px-3 py-2 rounded-lg text-xs flex items-center gap-2 ${
          dark ? 'bg-gray-800 text-gray-400' : 'bg-pink-50 text-pink-600'
        }`}>
          <span>💕</span>
          <span>{t('communityGuidelines')}</span>
        </div>

        {filteredPosts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-8">
            <span className="text-5xl mb-4">📝</span>
            <p className={`text-lg font-semibold mb-1 ${dark ? 'text-white' : 'text-gray-900'}`}>{t('noPostsYet')}</p>
            <p className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{t('beFirstToPost')}</p>
          </div>
        ) : (
          <div className="space-y-0">
            {filteredPosts.map(post => (
              <div key={post.id} className={`px-4 py-4 border-b ${dark ? 'border-gray-700' : 'border-gray-100'}`}>
                {/* Post Header */}
                <div className="flex items-center gap-3 mb-2">
                  <img
                    src={post.author.image}
                    alt={post.author.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className={`font-semibold text-sm ${dark ? 'text-white' : 'text-gray-900'}`}>
                        {post.author.name}
                      </span>
                      {post.author.verified && (
                        <span className="text-blue-500 text-xs">✓</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs ${dark ? 'text-gray-500' : 'text-gray-400'}`}>{post.time}</span>
                      <span className="text-xs">{getTopicEmoji(post.topic)}</span>
                      <span className={`text-xs ${dark ? 'text-gray-500' : 'text-gray-400'}`}>{t(COMMUNITY_TOPICS.find(tp => tp.id === post.topic)?.labelKey || 'allTopics')}</span>
                    </div>
                  </div>
                  {post.author.name !== (user?.name || 'You') && (
                    connectedUsers?.has(post.author.name) ? (
                      <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${dark ? 'bg-gray-700 text-green-400' : 'bg-green-50 text-green-600'}`}>
                        ✓ {t('connected')}
                      </span>
                    ) : (
                      <button
                        onClick={() => {
                          onConnectUser(post.author)
                          setConnectToast(post.author.name)
                          setTimeout(() => setConnectToast(null), 2500)
                        }}
                        className="px-3 py-1.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full text-xs font-semibold hover:shadow-md transition active:scale-95"
                      >
                        {t('connect')}
                      </button>
                    )
                  )}
                </div>

                {/* Post Text */}
                <p className={`text-sm leading-relaxed mb-3 ${dark ? 'text-gray-200' : 'text-gray-800'}`}>
                  {post.text}
                </p>

                {/* Post Actions */}
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => onLikePost(post.id)}
                    className={`flex items-center gap-1.5 text-sm transition ${
                      post.liked
                        ? 'text-pink-500'
                        : dark ? 'text-gray-400 hover:text-pink-400' : 'text-gray-500 hover:text-pink-500'
                    }`}
                  >
                    <HeartIcon filled={post.liked} className="w-5 h-5" />
                    <span>{post.likes}</span>
                  </button>
                  <button
                    onClick={() => toggleComments(post.id)}
                    className={`flex items-center gap-1.5 text-sm transition ${
                      dark ? 'text-gray-400 hover:text-blue-400' : 'text-gray-500 hover:text-blue-500'
                    }`}
                  >
                    <MessageBubbleIcon className="w-5 h-5" />
                    <span>{post.comments.length}</span>
                  </button>
                </div>

                {/* Comments Section */}
                {expandedComments[post.id] && (
                  <div className={`mt-3 pt-3 border-t ${dark ? 'border-gray-700' : 'border-gray-100'}`}>
                    {post.comments.map(comment => (
                      <div key={comment.id} className="flex gap-2 mb-2.5">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          dark ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-600'
                        }`}>
                          {comment.author[0]}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-baseline gap-2">
                            <span className={`text-xs font-semibold ${dark ? 'text-gray-300' : 'text-gray-700'}`}>{comment.author}</span>
                            <span className={`text-xs ${dark ? 'text-gray-600' : 'text-gray-400'}`}>{comment.time}</span>
                          </div>
                          <p className={`text-xs mt-0.5 ${dark ? 'text-gray-400' : 'text-gray-600'}`}>{comment.text}</p>
                        </div>
                      </div>
                    ))}

                    {/* Add Comment */}
                    <div className="flex gap-2 mt-2">
                      <input
                        type="text"
                        value={commentText[post.id] || ''}
                        onChange={e => setCommentText({ ...commentText, [post.id]: e.target.value })}
                        onKeyDown={e => e.key === 'Enter' && handleComment(post.id)}
                        placeholder={t('writeComment')}
                        className={`flex-1 text-sm px-3 py-1.5 rounded-full border ${
                          dark
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500'
                            : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
                        } focus:outline-none focus:ring-1 focus:ring-pink-500`}
                      />
                      <button
                        onClick={() => handleComment(post.id)}
                        className="px-3 py-1.5 bg-pink-500 text-white text-sm rounded-full font-medium hover:bg-pink-600 transition"
                      >
                        {t('reply')}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* New Post FAB */}
      <button
        onClick={() => setShowNewPost(true)}
        className="absolute bottom-20 right-4 w-14 h-14 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-all active:scale-95"
      >
        <PlusIcon className="w-7 h-7" />
      </button>

      {/* New Post Modal */}
      {showNewPost && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center" onClick={() => setShowNewPost(false)}>
          <div
            className={`w-full max-w-lg rounded-t-2xl p-5 animate-slide-up ${dark ? 'bg-gray-800' : 'bg-white'}`}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <button onClick={() => setShowNewPost(false)} className={`text-sm font-medium ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                {t('cancel')}
              </button>
              <h3 className={`font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>{t('newPost')}</h3>
              <button
                onClick={handlePost}
                disabled={!newPostText.trim()}
                className={`text-sm font-bold ${newPostText.trim() ? 'text-pink-500' : dark ? 'text-gray-600' : 'text-gray-300'}`}
              >
                {t('post')}
              </button>
            </div>

            {/* Topic Selector */}
            <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
              {COMMUNITY_TOPICS.filter(tp => tp.id !== 'all').map(topic => (
                <button
                  key={topic.id}
                  onClick={() => setNewPostTopic(topic.id)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                    newPostTopic === topic.id
                      ? 'bg-pink-500 text-white'
                      : dark
                        ? 'bg-gray-700 text-gray-300'
                        : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  <span>{topic.emoji}</span>
                  <span>{t(topic.labelKey)}</span>
                </button>
              ))}
            </div>

            {/* Post Input */}
            <div className="flex gap-3">
              {user?.image ? (
                <img src={user.image} alt="" className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
              ) : (
                <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center ${dark ? 'bg-gray-600' : 'bg-gray-200'}`}>
                  <UserIcon className="w-5 h-5" />
                </div>
              )}
              <textarea
                value={newPostText}
                onChange={e => setNewPostText(e.target.value)}
                placeholder={t('writePost')}
                rows={4}
                autoFocus
                className={`flex-1 text-sm p-3 rounded-xl border resize-none ${
                  dark
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500'
                    : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
                } focus:outline-none focus:ring-1 focus:ring-pink-500`}
              />
            </div>
          </div>
        </div>
      )}

      {/* Connect toast */}
      {connectToast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-green-500 text-white px-5 py-2.5 rounded-full text-sm font-medium shadow-lg z-50 animate-bounce-in">
          ✓ {t('connectSuccess')}
        </div>
      )}
    </div>
  )
}

// ============================================
// MAIN APP COMPONENT
// ============================================

// ============================================
// ONBOARDING TUTORIAL
// ============================================

function OnboardingTutorial({ onComplete }) {
  const t = useTranslation()
  const { dark } = useTheme()
  const [step, setStep] = useState(0)

  const steps = [
    { title: t('onboardingTitle1'), desc: t('onboardingDesc1'), emoji: '💕' },
    { title: t('onboardingTitle2'), desc: t('onboardingDesc2'), emoji: '👆' },
    { title: t('onboardingTitle3'), desc: t('onboardingDesc3'), emoji: '🎮' },
    { title: t('onboardingTitle4'), desc: t('onboardingDesc4'), emoji: '✅' },
  ]

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-8 ${dark ? 'bg-gray-900' : 'bg-gradient-to-br from-pink-50 to-rose-50'}`}>
      <div className="w-full max-w-md text-center">
        <div className="text-8xl mb-8 animate-bounce-in">{steps[step].emoji}</div>
        <h2 className={`text-2xl font-bold mb-3 ${dark ? 'text-white' : 'text-gray-900'}`}>{steps[step].title}</h2>
        <p className={`mb-8 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{steps[step].desc}</p>

        <div className="flex justify-center gap-2 mb-8">
          {steps.map((_, idx) => (
            <div key={idx} className={`h-2 rounded-full transition-all ${idx === step ? 'w-8 bg-pink-500' : 'w-2 bg-gray-300'}`} />
          ))}
        </div>

        <div className="flex gap-3">
          <button onClick={onComplete} className={`flex-1 py-3 rounded-full font-medium ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
            {t('skip')}
          </button>
          <button
            onClick={() => step < steps.length - 1 ? setStep(step + 1) : onComplete()}
            className="flex-1 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full font-bold hover:shadow-lg transition"
          >
            {step < steps.length - 1 ? t('next') : t('getStartedNow')}
          </button>
        </div>
      </div>
    </div>
  )
}

// ============================================
// PROFILE COMPLETION METER
// ============================================

function ProfileCompletionMeter({ user }) {
  const t = useTranslation()
  const { dark } = useTheme()

  const checks = [
    { key: 'photo', done: !!user?.image, label: t('addPhotoToComplete') },
    { key: 'bio', done: !!user?.bio, label: t('addBioToComplete') },
    { key: 'interests', done: (user?.interests || []).length >= 3, label: t('addInterestsToComplete') },
    { key: 'video', done: !!user?.profileVideo, label: t('addVideoToComplete') },
    { key: 'verified', done: !!user?.verified, label: t('verifyToComplete') },
  ]

  const completed = checks.filter(c => c.done).length
  const percentage = Math.round((completed / checks.length) * 100)
  const incomplete = checks.filter(c => !c.done)

  if (percentage === 100) return null

  return (
    <div className={`mx-4 mb-4 p-4 rounded-2xl ${dark ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className={`text-sm font-semibold ${dark ? 'text-white' : 'text-gray-900'}`}>{t('profileCompletion')}</h3>
        <span className="text-sm font-bold text-pink-500">{percentage}%</span>
      </div>
      <div className={`h-2 rounded-full mb-3 ${dark ? 'bg-gray-700' : 'bg-gray-200'}`}>
        <div className="h-full bg-gradient-to-r from-pink-500 to-rose-500 rounded-full transition-all duration-500" style={{ width: `${percentage}%` }} />
      </div>
      <p className={`text-xs mb-2 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{t('completeProfile')}</p>
      <div className="space-y-1">
        {incomplete.map((item) => (
          <div key={item.key} className={`flex items-center gap-2 text-xs ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
            <div className={`w-4 h-4 rounded-full border-2 ${dark ? 'border-gray-600' : 'border-gray-300'}`} />
            {item.label}
          </div>
        ))}
      </div>
    </div>
  )
}

// ============================================
// APP CONTENT
// ============================================

function AppContent() {
  const { language } = useLanguage()
  const { dark } = useTheme()
  const t = useTranslation()

  // App state
  const [appState, setAppState] = useState('welcome') // welcome, signup, subscription, onboarding, main
  const [signUpStep, setSignUpStep] = useState(1)
  const [signUpData, setSignUpData] = useState({})

  // User state
  const [user, setUser] = useState(null)
  const [userPlan, setUserPlan] = useState('free')
  const [userPoints, setUserPoints] = useState(100)
  const [notificationsEnabled, setNotificationsEnabled] = useState(false)
  const [blockedUsers, setBlockedUsers] = useState([])
  const [communityPosts, setCommunityPosts] = useState(SAMPLE_COMMUNITY_POSTS)
  const [connectedUsers, setConnectedUsers] = useState(new Set())

  // Request notification permission on app load
  useEffect(() => {
    const checkNotificationPermission = async () => {
      if ('Notification' in window && Notification.permission === 'granted') {
        setNotificationsEnabled(true)
      }
    }
    checkNotificationPermission()
  }, [])

  // Schedule periodic challenge notifications
  useEffect(() => {
    if (!notificationsEnabled || appState !== 'main') return

    // Send a challenge notification every 30 minutes (for demo, using shorter interval)
    const challengeInterval = setInterval(() => {
      sendNotification(t('notificationChallengeTitle'), {
        body: t('notificationChallengeBody'),
        tag: 'challenge',
        renotify: true,
      })
    }, 30 * 60 * 1000) // 30 minutes

    return () => clearInterval(challengeInterval)
  }, [notificationsEnabled, appState, t])

  // Handle enabling notifications
  const handleEnableNotifications = async () => {
    const granted = await requestNotificationPermission()
    setNotificationsEnabled(granted)
    if (granted) {
      sendNotification('KONJA', {
        body: t('notificationsEnabled'),
        tag: 'welcome',
      })
    }
  }

  // Main app state
  const [currentTab, setCurrentTab] = useState('discover')
  const [profiles, setProfiles] = useState(sampleProfiles)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [matches, setMatches] = useState(sampleMatches)
  const [matchCount, setMatchCount] = useState(0) // For free plan limit
  const [showMatch, setShowMatch] = useState(null)
  const [selectedChat, setSelectedChat] = useState(null)
  const [chatMessages, setChatMessages] = useState({
    101: [
      { text: 'Hey! I noticed you love K-dramas too!', sent: false, time: '2m ago' },
      { text: 'Have you watched Goblin? 👻', sent: false, time: '2m ago' },
    ],
    102: [
      { text: '안녕하세요!', sent: false, time: '1h ago' },
      { text: 'How was your day?', sent: false, time: '1h ago' },
    ],
    103: [
      { text: "I know this amazing Korean BBQ place!", sent: false, time: '3h ago' },
      { text: "Let's try that Korean BBQ place! 🥩", sent: false, time: '3h ago' },
    ],
  })

  const currentProfile = profiles[currentIndex]

  // Handlers
  const handleSignUpUpdate = (data) => {
    setSignUpData({ ...signUpData, ...data })
  }

  const handleSignUpComplete = () => {
    setUser({
      ...signUpData,
      image: signUpData.profileImage,
      profileVideo: signUpData.profileVideo || null,
      verified: signUpData.faceVerified || false,
      age: signUpData.dateOfBirth ? new Date().getFullYear() - new Date(signUpData.dateOfBirth).getFullYear() : 25,
      likes: 0,
      matches: 0,
      superLikes: 0,
    })
    setAppState('subscription')
  }

  const handleSelectPlan = (plan) => {
    setUserPlan(plan)
    setAppState('onboarding')
  }

  const handleReportUser = (userId, reason) => {
    console.log(`Reported user ${userId} for: ${reason}`)
  }

  const handleBlockUser = (userId) => {
    setBlockedUsers(prev => [...prev, userId])
    setProfiles(prev => prev.filter(p => p.id !== userId))
    if (currentProfile && currentProfile.id === userId) {
      nextProfile()
    }
  }

  const handleAddPost = ({ text, topic }) => {
    const newPost = {
      id: Date.now(),
      author: {
        name: user?.name || 'You',
        image: user?.image || '',
        verified: user?.verified || false,
      },
      topic,
      text,
      likes: 0,
      liked: false,
      comments: [],
      time: t('justNow'),
      timeMs: 0,
    }
    setCommunityPosts(prev => [newPost, ...prev])
  }

  const handleLikePost = (postId) => {
    setCommunityPosts(prev => prev.map(p =>
      p.id === postId
        ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
        : p
    ))
  }

  const handleAddComment = (postId, text) => {
    setCommunityPosts(prev => prev.map(p =>
      p.id === postId
        ? {
            ...p,
            comments: [...p.comments, {
              id: Date.now(),
              author: user?.name || 'You',
              text,
              time: t('justNow'),
            }],
          }
        : p
    ))
  }

  const handleConnectUser = (author) => {
    setConnectedUsers(prev => new Set([...prev, author.name]))
    const newMatchId = Date.now()
    const newMatch = {
      id: newMatchId,
      name: author.name,
      image: author.image,
      lastMessage: t('connectMessage'),
      time: t('justNow'),
      unread: true,
    }
    setMatches(prev => [newMatch, ...prev])
    setChatMessages(prev => ({
      ...prev,
      [newMatchId]: [{ text: t('connectMessage'), sent: true, time: t('justNow'), type: 'text' }],
    }))
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

  if (appState === 'onboarding') {
    return <OnboardingTutorial onComplete={() => setAppState('main')} />
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
          notificationsEnabled={notificationsEnabled}
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
                onReport={handleReportUser}
                onBlock={handleBlockUser}
                compatibility={calculateCompatibility(user, currentProfile)}
              />
            </div>
          </div>
        ) : (
          <EmptyState userPlan={userPlan} onExpandSearch={() => { setProfiles(sampleProfiles.filter(p => !blockedUsers.includes(p.id))); setCurrentIndex(0); }} />
        )
      case 'messages':
        return <MessagesList matches={matches} onSelectChat={setSelectedChat} />
      case 'community':
        return (
          <CommunityFeed
            user={user}
            posts={communityPosts}
            onAddPost={handleAddPost}
            onLikePost={handleLikePost}
            onAddComment={handleAddComment}
            onConnectUser={handleConnectUser}
            connectedUsers={connectedUsers}
          />
        )
      case 'profile':
        return (
          <div className="h-full overflow-y-auto">
            <ProfileCompletionMeter user={user} />
            <EnhancedProfileSettings
              user={user}
              onUpdateUser={handleUpdateUser}
              userPlan={userPlan}
              userPoints={userPoints}
              onEarnPoints={handleEarnPoints}
              notificationsEnabled={notificationsEnabled}
              onEnableNotifications={handleEnableNotifications}
            />
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className={`h-screen flex flex-col ${dark ? 'bg-gray-900' : 'bg-gray-100'}`}>
      {/* Header */}
      <header className={`shadow-sm px-4 py-3 flex items-center justify-between ${dark ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex items-center gap-2">
          <CoinIcon />
          <span className="font-bold text-yellow-600">{userPoints}</span>
        </div>
        <div className="flex items-center gap-2">
          <FlameIcon className="w-8 h-8 text-pink-500" />
          <span className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
            KONJA
          </span>
        </div>
        <button
          onClick={() => { setCurrentTab('messages'); setSelectedChat(null); }}
          className={`relative ${dark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-800'}`}
        >
          <ChatIcon />
          {matches.some(m => m.unread) && (
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-pink-500 rounded-full" />
          )}
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden relative">
        {renderContent()}
      </main>

      {/* Bottom Navigation */}
      <nav className={`shadow-lg border-t ${dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="flex justify-around">
          <button
            onClick={() => { setCurrentTab('discover'); setSelectedChat(null); }}
            className={`flex-1 py-4 flex flex-col items-center gap-1 ${
              currentTab === 'discover' ? 'text-pink-500' : dark ? 'text-gray-500' : 'text-gray-400'
            }`}
          >
            <FlameIcon />
            <span className="text-xs">{t('discover')}</span>
          </button>
          <button
            onClick={() => { setCurrentTab('messages'); setSelectedChat(null); }}
            className={`flex-1 py-4 flex flex-col items-center gap-1 relative ${
              currentTab === 'messages' ? 'text-pink-500' : dark ? 'text-gray-500' : 'text-gray-400'
            }`}
          >
            <ChatIcon />
            <span className="text-xs">{t('messages')}</span>
            {matches.some(m => m.unread) && (
              <span className="absolute top-3 right-1/3 w-2 h-2 bg-pink-500 rounded-full" />
            )}
          </button>
          <button
            onClick={() => { setCurrentTab('community'); setSelectedChat(null); }}
            className={`flex-1 py-4 flex flex-col items-center gap-1 ${
              currentTab === 'community' ? 'text-pink-500' : dark ? 'text-gray-500' : 'text-gray-400'
            }`}
          >
            <UsersIcon />
            <span className="text-xs">{t('community')}</span>
          </button>
          <button
            onClick={() => { setCurrentTab('profile'); setSelectedChat(null); }}
            className={`flex-1 py-4 flex flex-col items-center gap-1 ${
              currentTab === 'profile' ? 'text-pink-500' : dark ? 'text-gray-500' : 'text-gray-400'
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

// Main App wrapper with Language + Theme Providers
function App() {
  const [language, setLanguage] = useState('en')
  const [dark, setDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('konja-dark-mode')
      if (saved !== null) return saved === 'true'
      return window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    return false
  })

  const toggleDark = () => {
    setDark(prev => {
      const next = !prev
      localStorage.setItem('konja-dark-mode', String(next))
      return next
    })
  }

  return (
    <ThemeContext.Provider value={{ dark, toggleDark }}>
      <LanguageContext.Provider value={{ language, setLanguage, languages: LANGUAGES }}>
        <AppContent />
      </LanguageContext.Provider>
    </ThemeContext.Provider>
  )
}

export default App
