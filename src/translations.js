// Bilingual translations for Cycle Tracker (English / Japanese)

export const translations = {
  en: {
    // App
    appName: 'Cycle Tracker',

    // Navigation
    forHer: 'For Her',
    forHim: 'For Him',
    myCycle: 'My Cycle',
    partnerCycle: "Partner's Cycle",

    // Status
    today: 'Today',
    day: 'Day',
    nextPeriodIn: 'Next period in',
    days: 'days',
    setupCycle: 'Set Up Cycle',
    setLastPeriod: 'Set your last period start date to begin tracking',
    partnerNotSetup: "Partner hasn't set up their cycle yet",

    // Energy levels
    lowEnergy: 'Low Energy',
    risingEnergy: 'Rising Energy',
    moderateEnergy: 'Moderate Energy',
    peakEnergy: 'Peak Energy',

    // Settings
    cycleSettings: 'Cycle Settings',
    lastPeriodDate: 'Last Period Start Date',
    cycleLength: 'Cycle Length (days)',
    cycleLengthHint: 'Normal range: 21-35 days',
    periodLength: 'Period Length (days)',
    saveSettings: 'Save Settings',

    // Share/Export
    shareExport: 'Export to Calendar',
    myCalendar: 'My Calendar (For Her)',
    partnerCalendar: 'Partner Calendar (For Him)',
    downloadApple: 'Apple',
    downloadGoogle: 'Google',
    icsHint: 'ICS files work with Apple Calendar, Google Calendar, Outlook, and more.',
    googleImportHint: 'For Google: Go to Calendar Settings > Import & Export > Import',

    // Partner sharing
    shareWithPartner: 'Share with Partner',
    yourShareCode: 'Your Share Code',
    shareCodeHint: 'Give this code to your partner so they can see your cycle.',
    generateCode: 'Generate Share Code',
    enterPartnerCode: "Enter Partner's Code",
    enterCodeHint: "Enter your partner's code to view their cycle.",
    connect: 'Connect',
    sharedWith: 'Shared With',
    remove: 'Remove',
    connected: "Connected! You can now view your partner's cycle.",
    invalidCode: 'Invalid share code',

    // Auth
    signIn: 'Sign In',
    signUp: 'Create Account',
    magicLink: 'Magic Link',
    email: 'Email',
    password: 'Password',
    signInHint: 'Sign in to sync your cycle data across devices and share with your partner.',
    checkEmail: 'Check your email for a login link!',
    confirmEmail: 'Check your email to confirm your account!',
    signInMagicLink: 'Sign in with magic link instead',
    noAccount: "Don't have an account?",
    hasAccount: 'Already have an account?',
    backToPassword: 'Back to password sign in',
    syncShare: 'Sync & share with partner',

    // Notes
    cycleNotes: 'Cycle Notes',
    notes: 'Notes',
    addNoteFor: 'Add note for',
    howFeeling: 'How are you feeling? Any symptoms?',
    howFeelingLong: 'How are you feeling? Any symptoms, mood changes, or observations?',
    saveNote: 'Save Note',
    previousNotes: 'Previous Notes',
    noNotes: 'No notes yet',

    // PWA
    installApp: 'Install Cycle Tracker',
    installHint: 'Add to home screen for quick access',
    install: 'Install',

    // Phases
    phases: {
      menstruation: {
        name: 'Menstruation',
        description: 'Rest & Reset Phase',
        forHer: {
          title: 'Rest & Reset Phase',
          tips: [
            'Your body is shedding - honor this natural cleansing process',
            'Estrogen is at its lowest - you may feel more introspective',
            'Light movement like yoga or walking is ideal',
            'Iron-rich foods help replenish what you lose',
            'Rest and self-care are especially important now',
          ],
          exercise: 'Light movement, yoga, walking',
          foods: ['Iron-rich foods', 'Leafy greens', 'Bone broth', 'Dark chocolate'],
        },
        forHim: {
          title: 'Support & Space Phase',
          tips: [
            'She may need more rest and quiet time',
            'Offer to help with household tasks',
            'Be patient - energy levels are naturally lower',
            'Warm comfort foods and heating pads are appreciated',
            'This is not the time to plan big activities or make major decisions',
          ],
        },
        quotes: [
          { text: "Rest is not giving up. It's gearing up.", author: "Unknown" },
          { text: "In the midst of winter, I found there was, within me, an invincible summer.", author: "Albert Camus" },
          { text: "Almost everything will work again if you unplug it for a few minutes, including you.", author: "Anne Lamott" },
          { text: "Self-care is not selfish. You cannot serve from an empty vessel.", author: "Eleanor Brown" },
          { text: "The time to relax is when you don't have time for it.", author: "Sydney J. Harris" },
        ],
      },
      follicular: {
        name: 'Follicular (Power Phase)',
        description: 'Energy Rising',
        forHer: {
          title: 'Power Up Phase',
          tips: [
            'Estrogen is building - energy and mood are rising',
            'Best time for challenging workouts and new fitness goals',
            'Great time to start new projects or tackle hard tasks',
            'Your brain is sharp - learning and creativity peak',
            'Social energy is increasing - connect with friends',
          ],
          exercise: 'HIIT, strength training, cardio - push yourself!',
          foods: ['Fermented foods', 'Lean proteins', 'Fresh vegetables', 'Complex carbs'],
        },
        forHim: {
          title: 'Adventure & Activity Phase',
          tips: [
            'Her energy is high - plan active activities!',
            'She is more social and adventurous now',
            'Great time for trying new restaurants or activities',
            'Support her new projects and ideas',
            'Physical intimacy drive may increase',
          ],
        },
        quotes: [
          { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
          { text: "Energy and persistence conquer all things.", author: "Benjamin Franklin" },
          { text: "You are never too old to set another goal or to dream a new dream.", author: "C.S. Lewis" },
          { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
          { text: "Start where you are. Use what you have. Do what you can.", author: "Arthur Ashe" },
        ],
      },
      ovulation: {
        name: 'Ovulation (Manifestation)',
        description: 'Peak Energy & Fertility',
        forHer: {
          title: 'Superpower Phase',
          tips: [
            "Estrogen, testosterone, and progesterone all peak - you're at your best!",
            'You look and feel your best - confidence is high',
            'Communication skills peak - great for important conversations',
            'Fertility window - be mindful if avoiding pregnancy',
            'Great time for social events and networking',
          ],
          exercise: 'Moderate to high intensity, group classes',
          foods: ['Anti-inflammatory foods', 'Fiber-rich vegetables', 'Light proteins', 'Antioxidant fruits'],
        },
        forHim: {
          title: 'Connection & Romance Phase',
          tips: [
            'She is at her most confident and attractive',
            "Plan romantic activities - she's feeling social",
            'Great time for important relationship talks',
            'Physical attraction and intimacy peak',
            'Be aware: this is her fertile window',
          ],
        },
        quotes: [
          { text: "She remembered who she was and the game changed.", author: "Lalah Delia" },
          { text: "You are magnetic. You are radiant. You are enough.", author: "Unknown" },
          { text: "Confidence is not 'they will like me.' Confidence is 'I'll be fine if they don't.'", author: "Christina Grimmie" },
          { text: "The most alluring thing a woman can have is confidence.", author: "Beyoncé" },
          { text: "You were born to be real, not to be perfect.", author: "Unknown" },
        ],
      },
      earlyLuteal: {
        name: 'Early Luteal',
        description: 'Transition Phase',
        forHer: {
          title: 'Transition Phase',
          tips: [
            'Hormones start to dip - energy may fluctuate',
            'Good time to wrap up projects before the nurture phase',
            'You may start to feel more inward-focused',
            'Prioritize sleep and stress management',
            'Listen to your body and adjust activity as needed',
          ],
          exercise: 'Moderate intensity, steady-state cardio',
          foods: ['Complex carbohydrates', 'Magnesium-rich foods', 'Root vegetables', 'Healthy fats'],
        },
        forHim: {
          title: 'Supportive Transition Phase',
          tips: [
            'Energy may start to shift - be flexible with plans',
            'Low-key activities are often preferred',
            'Help reduce stress where possible',
            'Be understanding if mood shifts slightly',
            'Quality time at home becomes more appealing',
          ],
        },
        quotes: [
          { text: "Life is a balance of holding on and letting go.", author: "Rumi" },
          { text: "Progress, not perfection.", author: "Unknown" },
          { text: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar" },
          { text: "Trust the timing of your life.", author: "Unknown" },
          { text: "Slow progress is still progress.", author: "Unknown" },
        ],
      },
      lateLuteal: {
        name: 'Late Luteal (Nurture Phase)',
        description: 'Rest & Nurture',
        forHer: {
          title: 'Nurture Phase',
          tips: [
            'Carb cravings are NORMAL - your body needs them for progesterone',
            "This is NOT a lack of discipline - it's biology",
            'Focus on rest, self-care, and gentle movement',
            'Stress reduction is critical - cortisol affects progesterone',
            'Be gentle with yourself - this is a time for nurturing',
          ],
          exercise: 'Yoga, pilates, walking, stretching only',
          foods: ['Complex carbs (sweet potato, rice)', 'Comfort foods in moderation', 'Magnesium-rich foods', 'Warm, cooked meals'],
        },
        forHim: {
          title: 'Nurture & Support Phase',
          tips: [
            'She may be more sensitive - extra patience helps',
            'PMS symptoms may appear - this is hormonal, not personal',
            'Carb cravings are biological needs, not weakness',
            'Reduce stress and conflict where possible',
            'Small acts of care mean everything right now',
          ],
        },
        quotes: [
          { text: "Be gentle with yourself. You're doing the best you can.", author: "Unknown" },
          { text: "You owe yourself the love that you so freely give to others.", author: "Unknown" },
          { text: "It's okay to not be okay, as long as you're not giving up.", author: "Karen Salmansohn" },
          { text: "Feelings are just visitors. Let them come and go.", author: "Mooji" },
          { text: "Your feelings are valid. Your struggles are real. Your story matters.", author: "Unknown" },
        ],
      },
    },

    // Attribution
    attribution: "Tips based on Dr. Mindy Pelz's research on women's hormonal cycles.",
  },

  ja: {
    // App
    appName: '生理周期トラッカー',

    // Navigation
    forHer: '彼女向け',
    forHim: '彼向け',
    myCycle: '自分の周期',
    partnerCycle: 'パートナーの周期',

    // Status
    today: '今日',
    day: '日目',
    nextPeriodIn: '次の生理まで',
    days: '日',
    setupCycle: '周期を設定',
    setLastPeriod: '最後の生理開始日を設定してトラッキングを開始',
    partnerNotSetup: 'パートナーはまだ周期を設定していません',

    // Energy levels
    lowEnergy: 'エネルギー低',
    risingEnergy: 'エネルギー上昇中',
    moderateEnergy: 'エネルギー中',
    peakEnergy: 'エネルギー最高',

    // Settings
    cycleSettings: '周期設定',
    lastPeriodDate: '最後の生理開始日',
    cycleLength: '周期の長さ（日）',
    cycleLengthHint: '通常範囲：21〜35日',
    periodLength: '生理の長さ（日）',
    saveSettings: '設定を保存',

    // Share/Export
    shareExport: 'カレンダーにエクスポート',
    myCalendar: '自分のカレンダー（彼女向け）',
    partnerCalendar: 'パートナーのカレンダー（彼向け）',
    downloadApple: 'Apple',
    downloadGoogle: 'Google',
    icsHint: 'ICSファイルはAppleカレンダー、Googleカレンダー、Outlookなどで使用できます。',
    googleImportHint: 'Google：カレンダー設定 > インポート/エクスポート > インポート',

    // Partner sharing
    shareWithPartner: 'パートナーと共有',
    yourShareCode: 'あなたの共有コード',
    shareCodeHint: 'このコードをパートナーに伝えて、あなたの周期を見られるようにしましょう。',
    generateCode: '共有コードを生成',
    enterPartnerCode: 'パートナーのコードを入力',
    enterCodeHint: 'パートナーのコードを入力して、周期を見ましょう。',
    connect: '接続',
    sharedWith: '共有中',
    remove: '削除',
    connected: '接続完了！パートナーの周期を見られるようになりました。',
    invalidCode: '無効な共有コード',

    // Auth
    signIn: 'ログイン',
    signUp: 'アカウント作成',
    magicLink: 'マジックリンク',
    email: 'メールアドレス',
    password: 'パスワード',
    signInHint: 'ログインしてデータを同期し、パートナーと共有しましょう。',
    checkEmail: 'メールでログインリンクを確認してください！',
    confirmEmail: 'メールでアカウントを確認してください！',
    signInMagicLink: 'マジックリンクでログイン',
    noAccount: 'アカウントをお持ちでないですか？',
    hasAccount: 'すでにアカウントをお持ちですか？',
    backToPassword: 'パスワードログインに戻る',
    syncShare: '同期＆パートナーと共有',

    // Notes
    cycleNotes: '周期メモ',
    notes: 'メモ',
    addNoteFor: 'メモを追加：',
    howFeeling: '体調はいかがですか？症状はありますか？',
    howFeelingLong: '体調はいかがですか？症状、気分の変化、気づいたことは？',
    saveNote: 'メモを保存',
    previousNotes: '過去のメモ',
    noNotes: 'メモはまだありません',

    // PWA
    installApp: '生理周期トラッカーをインストール',
    installHint: 'ホーム画面に追加してすぐにアクセス',
    install: 'インストール',

    // Phases
    phases: {
      menstruation: {
        name: '生理期',
        description: '休息＆リセット期',
        forHer: {
          title: '休息＆リセット期',
          tips: [
            '体が自然にクレンジングしています - この過程を大切に',
            'エストロゲンが最も低い時期 - 内省的になりやすいです',
            'ヨガやウォーキングなど軽い運動がおすすめ',
            '鉄分豊富な食事で失った分を補いましょう',
            '今は特に休息とセルフケアが大切です',
          ],
          exercise: '軽い運動、ヨガ、ウォーキング',
          foods: ['鉄分豊富な食品', '葉物野菜', 'ボーンブロス', 'ダークチョコレート'],
        },
        forHim: {
          title: 'サポート＆スペース期',
          tips: [
            '彼女はより多くの休息と静かな時間を必要としているかも',
            '家事を手伝うことを申し出て',
            '辛抱強く - エネルギーレベルは自然と低くなります',
            '温かい食べ物やカイロが喜ばれます',
            '大きな活動や重要な決定をする時期ではありません',
          ],
        },
        quotes: [
          { text: '休むことは諦めることではない。準備をすることだ。', author: '不明' },
          { text: '冬の真っ只中、私の中に不屈の夏があることに気づいた。', author: 'アルベール・カミュ' },
          { text: '数分プラグを抜けば、ほとんど全てのものは再び動き出す。あなた自身も。', author: 'アン・ラモット' },
          { text: 'セルフケアは利己的ではない。空の器からは何も与えられない。', author: 'エレノア・ブラウン' },
          { text: 'リラックスする時間がない時こそ、リラックスすべき時だ。', author: 'シドニー・J・ハリス' },
        ],
      },
      follicular: {
        name: '卵胞期（パワー期）',
        description: 'エネルギー上昇中',
        forHer: {
          title: 'パワーアップ期',
          tips: [
            'エストロゲンが上昇中 - エネルギーと気分が向上',
            'ハードなワークアウトや新しいフィットネス目標に最適',
            '新しいプロジェクトを始めたり、難しいタスクに取り組むのに最適',
            '脳が冴えています - 学習と創造性がピーク',
            '社交的なエネルギーが増加 - 友達と繋がりましょう',
          ],
          exercise: 'HIIT、筋トレ、カーディオ - 自分を追い込んで！',
          foods: ['発酵食品', '赤身のタンパク質', '新鮮な野菜', '複合炭水化物'],
        },
        forHim: {
          title: 'アドベンチャー＆アクティビティ期',
          tips: [
            '彼女のエネルギーは高い - アクティブな活動を計画しよう！',
            '彼女は今、より社交的で冒険的',
            '新しいレストランやアクティビティを試すのに最適',
            '彼女の新しいプロジェクトやアイデアをサポートして',
            '親密さへの欲求が高まるかも',
          ],
        },
        quotes: [
          { text: '先に進む秘訣は、始めることだ。', author: 'マーク・トウェイン' },
          { text: 'エネルギーと粘り強さは全てを征服する。', author: 'ベンジャミン・フランクリン' },
          { text: '新しい目標を設定したり、新しい夢を見るのに遅すぎることはない。', author: 'C.S.ルイス' },
          { text: '素晴らしい仕事をする唯一の方法は、自分のしていることを愛すること。', author: 'スティーブ・ジョブズ' },
          { text: '今いる場所から始めよう。持っているものを使おう。できることをしよう。', author: 'アーサー・アッシュ' },
        ],
      },
      ovulation: {
        name: '排卵期（マニフェスト期）',
        description: 'ピークエネルギー＆妊娠可能期',
        forHer: {
          title: 'スーパーパワー期',
          tips: [
            'エストロゲン、テストステロン、プロゲステロンが全てピーク - 最高の状態！',
            '見た目も気分も最高 - 自信がみなぎっています',
            'コミュニケーション能力がピーク - 重要な会話に最適',
            '妊娠可能期間 - 妊娠を避けている場合は注意',
            'ソーシャルイベントやネットワーキングに最適',
          ],
          exercise: '中〜高強度、グループクラス',
          foods: ['抗炎症食品', '食物繊維豊富な野菜', '軽めのタンパク質', '抗酸化フルーツ'],
        },
        forHim: {
          title: 'コネクション＆ロマンス期',
          tips: [
            '彼女は最も自信に満ち、魅力的',
            'ロマンチックな活動を計画しよう - 彼女は社交的な気分',
            '重要な関係の話をするのに最適',
            '身体的な魅力と親密さがピーク',
            '注意：これは彼女の妊娠可能期間です',
          ],
        },
        quotes: [
          { text: '彼女は自分が誰であるかを思い出し、ゲームが変わった。', author: 'ララ・デリア' },
          { text: 'あなたは磁石のように魅力的。輝いている。それで十分。', author: '不明' },
          { text: '自信とは「彼らは私を好きになる」ではなく「好かれなくても大丈夫」ということ。', author: 'クリスティーナ・グリミー' },
          { text: '女性が持てる最も魅力的なものは自信。', author: 'ビヨンセ' },
          { text: '完璧になるためではなく、本物になるために生まれてきた。', author: '不明' },
        ],
      },
      earlyLuteal: {
        name: '黄体期前半',
        description: '移行期',
        forHer: {
          title: '移行期',
          tips: [
            'ホルモンが下がり始めます - エネルギーが変動するかも',
            'ナーチャー期の前にプロジェクトを完了させるのに良い時期',
            'より内向的になり始めるかも',
            '睡眠とストレス管理を優先して',
            '体の声を聞いて、必要に応じて活動を調整して',
          ],
          exercise: '中強度、安定したカーディオ',
          foods: ['複合炭水化物', 'マグネシウム豊富な食品', '根菜', '健康的な脂肪'],
        },
        forHim: {
          title: 'サポーティブ移行期',
          tips: [
            'エネルギーが変化し始めるかも - 計画は柔軟に',
            'のんびりした活動が好まれることが多い',
            'できる限りストレスを減らす手助けを',
            '気分が少し変わっても理解を',
            '家での質の高い時間がより魅力的に',
          ],
        },
        quotes: [
          { text: '人生は握ることと手放すことのバランス。', author: 'ルーミー' },
          { text: '完璧ではなく、進歩を。', author: '不明' },
          { text: '始めるのに偉大である必要はないが、偉大になるには始めなければならない。', author: 'ジグ・ジグラー' },
          { text: '人生のタイミングを信じて。', author: '不明' },
          { text: 'ゆっくりな進歩も、進歩には変わりない。', author: '不明' },
        ],
      },
      lateLuteal: {
        name: '黄体期後半（ナーチャー期）',
        description: '休息＆ナーチャー期',
        forHer: {
          title: 'ナーチャー期',
          tips: [
            '炭水化物への欲求は正常 - 体がプロゲステロンのために必要としています',
            'これは意志の弱さではなく、生物学的なもの',
            '休息、セルフケア、穏やかな運動に集中',
            'ストレス軽減が重要 - コルチゾールはプロゲステロンに影響',
            '自分に優しく - これはナーチャリングの時間です',
          ],
          exercise: 'ヨガ、ピラティス、ウォーキング、ストレッチのみ',
          foods: ['複合炭水化物（さつまいも、米）', '適度なコンフォートフード', 'マグネシウム豊富な食品', '温かい調理済み食事'],
        },
        forHim: {
          title: 'ナーチャー＆サポート期',
          tips: [
            '彼女はより敏感かも - 余分な忍耐が助けになります',
            'PMS症状が出るかも - これはホルモンのせい、個人的なものではない',
            '炭水化物への欲求は生物学的ニーズ、弱さではない',
            'できる限りストレスと対立を減らして',
            '今、小さな思いやりの行動がすべてを意味します',
          ],
        },
        quotes: [
          { text: '自分に優しく。あなたはベストを尽くしている。', author: '不明' },
          { text: '他人に惜しみなく与える愛を、自分自身にも与える価値がある。', author: '不明' },
          { text: '大丈夫じゃなくても大丈夫、諦めなければ。', author: 'カレン・サルマンソーン' },
          { text: '感情は訪問者のようなもの。来ては去るに任せよう。', author: 'ムージ' },
          { text: 'あなたの感情は正当。あなたの苦労は本物。あなたの物語は大切。', author: '不明' },
        ],
      },
    },

    // Attribution
    attribution: 'ヒントはDr. Mindy Pelzの女性ホルモン周期研究に基づいています。',
  },
}

export const getTranslation = (lang, key) => {
  const keys = key.split('.')
  let value = translations[lang]
  for (const k of keys) {
    value = value?.[k]
  }
  return value || translations.en[key] || key
}
