import { useState, useEffect } from 'react'

// ============================================
// CONSTANTS & DATA
// ============================================

const INTERESTS_OPTIONS = [
  { id: 'kpop', label: 'K-Pop', emoji: '🎤' },
  { id: 'kdrama', label: 'K-Drama', emoji: '📺' },
  { id: 'cooking', label: 'Cooking', emoji: '🍳' },
  { id: 'outdoors', label: 'Outdoors', emoji: '🏕️' },
  { id: 'fitness', label: 'Fitness', emoji: '💪' },
  { id: 'gaming', label: 'Gaming', emoji: '🎮' },
  { id: 'music', label: 'Music', emoji: '🎵' },
  { id: 'travel', label: 'Travel', emoji: '✈️' },
  { id: 'photography', label: 'Photography', emoji: '📷' },
  { id: 'art', label: 'Art', emoji: '🎨' },
  { id: 'reading', label: 'Reading', emoji: '📚' },
  { id: 'movies', label: 'Movies', emoji: '🎬' },
  { id: 'food', label: 'Foodie', emoji: '🍜' },
  { id: 'coffee', label: 'Coffee', emoji: '☕' },
  { id: 'pets', label: 'Pet Lover', emoji: '🐕' },
  { id: 'yoga', label: 'Yoga', emoji: '🧘' },
  { id: 'dancing', label: 'Dancing', emoji: '💃' },
  { id: 'language', label: 'Language Learning', emoji: '🗣️' },
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

const LANGUAGE_GAME_QUESTIONS = [
  { korean: '안녕하세요', english: 'Hello', romanization: 'Annyeonghaseyo' },
  { korean: '감사합니다', english: 'Thank you', romanization: 'Gamsahamnida' },
  { korean: '사랑해요', english: 'I love you', romanization: 'Saranghaeyo' },
  { korean: '맛있어요', english: 'It\'s delicious', romanization: 'Masisseoyo' },
  { korean: '어디예요?', english: 'Where is it?', romanization: 'Eodiyeyo?' },
  { korean: '이름이 뭐예요?', english: 'What\'s your name?', romanization: 'Ireumi mwoyeyo?' },
  { korean: '좋아요', english: 'I like it / Good', romanization: 'Joayo' },
  { korean: '미안해요', english: 'I\'m sorry', romanization: 'Mianhaeyo' },
  { korean: '괜찮아요', english: 'It\'s okay', romanization: 'Gwaenchanayo' },
  { korean: '만나서 반가워요', english: 'Nice to meet you', romanization: 'Mannaseo bangawoyo' },
]

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

const CONVERSATION_STARTERS = [
  "What's your favorite K-drama and why?",
  "If you could visit any city in Korea, which would it be?",
  "What Korean food could you eat every day?",
  "Do you have a favorite K-pop group or artist?",
  "What's something on your bucket list?",
  "What's the most adventurous thing you've ever done?",
  "If you could learn any skill instantly, what would it be?",
  "What's your idea of a perfect weekend?",
]

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
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-500 via-rose-500 to-purple-600 flex flex-col items-center justify-center p-6 text-white">
      <div className="mb-8">
        <FlameIcon className="w-24 h-24 mx-auto mb-4" />
        <h1 className="text-5xl font-bold text-center">koja</h1>
        <p className="text-pink-100 text-center mt-2">Connect through culture</p>
      </div>

      <div className="space-y-4 text-center mb-12">
        <p className="text-lg">Find meaningful connections with people who share your love for Korean culture</p>
      </div>

      <button
        onClick={onGetStarted}
        className="w-full max-w-sm py-4 bg-white text-pink-600 rounded-full font-bold text-lg hover:bg-gray-100 transition shadow-lg"
      >
        Get Started
      </button>

      <p className="mt-6 text-sm text-pink-200">
        Already have an account? <button className="underline font-semibold">Sign In</button>
      </p>
    </div>
  )
}

function SignUpStep1({ data, onUpdate, onNext }) {
  const [errors, setErrors] = useState({})

  const validate = () => {
    const newErrors = {}
    if (!data.name?.trim()) newErrors.name = 'Name is required'
    if (!data.email?.trim()) newErrors.email = 'Email is required'
    if (!data.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required'
    if (!data.gender) newErrors.gender = 'Please select your gender'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validate()) onNext()
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-md mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-pink-500 text-white flex items-center justify-center text-sm font-bold">1</div>
            <div className="flex-1 h-1 bg-gray-200 rounded"><div className="h-full w-1/4 bg-pink-500 rounded"></div></div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Basic Information</h1>
          <p className="text-gray-500">Let's start with the basics</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              value={data.name || ''}
              onChange={(e) => onUpdate({ name: e.target.value })}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Enter your name"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
            <input
              type="date"
              value={data.dateOfBirth || ''}
              onChange={(e) => onUpdate({ dateOfBirth: e.target.value })}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 ${errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.dateOfBirth && <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
            <div className="grid grid-cols-3 gap-3">
              {['Male', 'Female', 'Other'].map((gender) => (
                <button
                  key={gender}
                  onClick={() => onUpdate({ gender })}
                  className={`py-3 px-4 rounded-xl border-2 font-medium transition ${
                    data.gender === gender
                      ? 'border-pink-500 bg-pink-50 text-pink-600'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  {gender}
                </button>
              ))}
            </div>
            {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input
              type="text"
              value={data.location || ''}
              onChange={(e) => onUpdate({ location: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              placeholder="City, Country"
            />
          </div>
        </div>

        <button
          onClick={handleNext}
          className="w-full mt-8 py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full font-bold text-lg hover:shadow-lg transition"
        >
          Continue
        </button>
      </div>
    </div>
  )
}

function SignUpStep2({ data, onUpdate, onNext, onBack }) {
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
          <h1 className="text-2xl font-bold text-gray-900">Add Photos & Video</h1>
          <p className="text-gray-500">Show off your personality</p>
        </div>

        <div className="space-y-6">
          {/* Profile Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Profile Photo</label>
            <div
              onClick={handleImageUpload}
              className="w-40 h-40 mx-auto rounded-full border-4 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-pink-400 transition bg-gray-100"
            >
              {data.profileImage ? (
                <img src={data.profileImage} alt="Profile" className="w-full h-full rounded-full object-cover" />
              ) : (
                <>
                  <CameraIcon className="w-10 h-10 text-gray-400" />
                  <span className="text-sm text-gray-500 mt-2">Add Photo</span>
                </>
              )}
            </div>
          </div>

          {/* Profile Video */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Introduction Video (Optional)</label>
            <div
              onClick={handleVideoUpload}
              className="w-full h-32 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-pink-400 transition bg-gray-100"
            >
              {data.profileVideo ? (
                <div className="text-center">
                  <CheckIcon className="w-10 h-10 text-green-500 mx-auto" />
                  <span className="text-sm text-green-600 mt-2">Video uploaded!</span>
                </div>
              ) : (
                <>
                  <VideoIcon className="w-10 h-10 text-gray-400" />
                  <span className="text-sm text-gray-500 mt-2">Add a short video (max 30 sec)</span>
                </>
              )}
            </div>
            <p className="text-xs text-gray-400 mt-2">A video helps you stand out and get 3x more matches!</p>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
            <textarea
              value={data.bio || ''}
              onChange={(e) => onUpdate({ bio: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 h-24 resize-none"
              placeholder="Tell others about yourself..."
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
          Continue
        </button>
      </div>
    </div>
  )
}

function SignUpStep3({ data, onUpdate, onNext, onBack }) {
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
          <h1 className="text-2xl font-bold text-gray-900">Your Interests</h1>
          <p className="text-gray-500">Select at least 3 interests</p>
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
              <span>{interest.label}</span>
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
          Continue ({(data.interests || []).length}/3 minimum)
        </button>
      </div>
    </div>
  )
}

function SignUpStep4({ data, onUpdate, onComplete, onBack }) {
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
          <h1 className="text-2xl font-bold text-gray-900">Terms & Preferences</h1>
          <p className="text-gray-500">Almost there!</p>
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
              <p className="font-medium text-gray-900">I agree to the Terms & Conditions</p>
              <p className="text-sm text-gray-500">By checking this, you agree to our <a href="#" className="text-pink-500 underline">Terms of Service</a> and <a href="#" className="text-pink-500 underline">Privacy Policy</a></p>
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
              <p className="font-medium text-gray-900">Marketing Communications</p>
              <p className="text-sm text-gray-500">Receive updates about new features, tips, and special offers</p>
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
          Create Account
        </button>
      </div>
    </div>
  )
}

// ============================================
// SUBSCRIPTION SCREEN
// ============================================

function SubscriptionScreen({ onSelectPlan }) {
  const [selectedPlan, setSelectedPlan] = useState('standard')

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-600 to-pink-600 p-6">
      <div className="max-w-md mx-auto">
        <div className="text-center text-white mb-8">
          <SparklesIcon className="w-12 h-12 mx-auto mb-4" />
          <h1 className="text-3xl font-bold">Choose Your Plan</h1>
          <p className="text-purple-200 mt-2">Unlock the full Koja experience</p>
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
                  MOST POPULAR
                </span>
              )}
              <div className="flex justify-between items-start">
                <div>
                  <h3 className={`text-xl font-bold ${selectedPlan === plan.id ? 'text-gray-900' : 'text-white'}`}>
                    {plan.name}
                  </h3>
                  <p className={`text-2xl font-bold mt-1 ${selectedPlan === plan.id ? 'text-pink-600' : 'text-white'}`}>
                    {plan.price}<span className="text-sm font-normal">{plan.period}</span>
                  </p>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  selectedPlan === plan.id ? 'border-pink-500 bg-pink-500' : 'border-white/50'
                }`}>
                  {selectedPlan === plan.id && <CheckIcon className="w-4 h-4 text-white" />}
                </div>
              </div>
              <ul className="mt-4 space-y-2">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className={`flex items-center gap-2 text-sm ${
                    selectedPlan === plan.id ? 'text-gray-600' : 'text-white/80'
                  }`}>
                    <CheckIcon className={`w-4 h-4 ${selectedPlan === plan.id ? 'text-green-500' : 'text-white/60'}`} />
                    {feature}
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
          {selectedPlan === 'free' ? 'Continue with Free' : 'Start Free Trial'}
        </button>

        {selectedPlan !== 'free' && (
          <p className="text-center text-white/60 text-sm mt-4">
            7-day free trial, cancel anytime
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
  const [questionIndex, setQuestionIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [gameComplete, setGameComplete] = useState(false)

  const currentQuestion = LANGUAGE_GAME_QUESTIONS[questionIndex]

  // Generate wrong answers
  const generateOptions = () => {
    const correct = currentQuestion.english
    const allAnswers = LANGUAGE_GAME_QUESTIONS.map(q => q.english).filter(a => a !== correct)
    const wrongAnswers = allAnswers.sort(() => Math.random() - 0.5).slice(0, 3)
    const options = [...wrongAnswers, correct].sort(() => Math.random() - 0.5)
    return options
  }

  const [options] = useState(generateOptions())

  const handleAnswer = (answer) => {
    if (answered) return
    setSelectedAnswer(answer)
    setAnswered(true)

    if (answer === currentQuestion.english) {
      setScore(score + 10)
    }
  }

  const nextQuestion = () => {
    if (questionIndex < 4) {
      setQuestionIndex(questionIndex + 1)
      setAnswered(false)
      setSelectedAnswer(null)
    } else {
      setGameComplete(true)
      onEarnPoints(score + (selectedAnswer === currentQuestion.english ? 10 : 0))
    }
  }

  if (gameComplete) {
    const finalScore = score + (selectedAnswer === currentQuestion.english ? 10 : 0)
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Game Complete!</h2>
          <p className="text-gray-600 mb-4">You earned {finalScore} points</p>
          <div className="flex items-center justify-center gap-2 text-xl font-bold text-yellow-600 mb-6">
            <CoinIcon className="w-6 h-6" />
            <span>{currentPoints + finalScore} total points</span>
          </div>
          <button
            onClick={onClose}
            className="w-full py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full font-semibold"
          >
            Done
          </button>
        </div>
      </div>
    )
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
          <p className="text-sm text-gray-500 mb-2">What does this mean?</p>
          <p className="text-4xl font-bold text-gray-900 mb-2">{currentQuestion.korean}</p>
          <p className="text-sm text-gray-400 italic">{currentQuestion.romanization}</p>
        </div>

        <div className="space-y-3">
          {options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleAnswer(option)}
              disabled={answered}
              className={`w-full py-4 px-6 rounded-xl font-medium transition text-left ${
                answered
                  ? option === currentQuestion.english
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
            {questionIndex < 4 ? 'Next Question' : 'See Results'}
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

function ConversationStartersModal({ onClose, onSelect, userPlan }) {
  if (userPlan === 'free') {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-3xl p-6 max-w-sm w-full text-center">
          <div className="text-6xl mb-4">💬</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Standard Feature</h2>
          <p className="text-gray-600 mb-6">Upgrade to Standard to unlock conversation starters</p>
          <button
            onClick={onClose}
            className="w-full py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full font-semibold"
          >
            Upgrade to Standard
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
          <h2 className="text-xl font-bold text-gray-900">Conversation Starters</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-3 max-h-80 overflow-y-auto">
          {CONVERSATION_STARTERS.map((starter, idx) => (
            <button
              key={idx}
              onClick={() => { onSelect(starter); onClose(); }}
              className="w-full p-4 bg-gray-100 hover:bg-pink-50 rounded-xl text-left text-gray-700 transition"
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

function EnhancedChat({ match, messages, onSendMessage, onBack, userPlan, userPoints, onEarnPoints, onSpendPoints }) {
  const [newMessage, setNewMessage] = useState('')
  const [showGifts, setShowGifts] = useState(false)
  const [showDatePlanning, setShowDatePlanning] = useState(false)
  const [showLanguageGame, setShowLanguageGame] = useState(false)
  const [showConversationStarters, setShowConversationStarters] = useState(false)

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
          title="Date Planning"
        >
          <CalendarIcon className="w-5 h-5" />
          <span className="text-xs mt-1">Date</span>
        </button>
        <button
          onClick={() => setShowLanguageGame(true)}
          className="flex flex-col items-center text-gray-500 hover:text-pink-500 transition"
          title="Language Game"
        >
          <GameIcon className="w-5 h-5" />
          <span className="text-xs mt-1">Game</span>
        </button>
        <button
          onClick={() => setShowGifts(true)}
          className="flex flex-col items-center text-gray-500 hover:text-pink-500 transition"
          title="Send Gift"
        >
          <GiftIcon className="w-5 h-5" />
          <span className="text-xs mt-1">Gift</span>
        </button>
        <button
          onClick={() => setShowConversationStarters(true)}
          className="flex flex-col items-center text-gray-500 hover:text-pink-500 transition"
          title="Conversation Starters"
        >
          <SparklesIcon className="w-5 h-5" />
          <span className="text-xs mt-1">Ideas</span>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.sent ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[75%] px-4 py-2 rounded-2xl ${
              msg.type === 'gift'
                ? 'bg-gradient-to-r from-yellow-100 to-pink-100 text-gray-800 text-center'
                : msg.sent
                ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-br-md'
                : 'bg-white text-gray-800 rounded-bl-md shadow-sm'
            }`}>
              <p className={msg.type === 'gift' ? 'text-2xl' : ''}>{msg.text}</p>
              <p className={`text-xs mt-1 ${msg.sent ? 'text-pink-100' : 'text-gray-400'}`}>
                {msg.time}
              </p>
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
      {showLanguageGame && (
        <LanguageGame
          onClose={() => setShowLanguageGame(false)}
          onEarnPoints={onEarnPoints}
          currentPoints={userPoints}
        />
      )}
      {showConversationStarters && (
        <ConversationStartersModal
          onClose={() => setShowConversationStarters(false)}
          onSelect={(starter) => setNewMessage(starter)}
          userPlan={userPlan}
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
  const [showEditProfile, setShowEditProfile] = useState(false)
  const [showLanguageGame, setShowLanguageGame] = useState(false)
  const [editData, setEditData] = useState({ ...user })

  const getInterestLabel = (id) => {
    const interest = INTERESTS_OPTIONS.find(i => i.id === id)
    return interest ? `${interest.emoji} ${interest.label}` : id
  }

  const getPlanBadge = () => {
    switch (userPlan) {
      case 'premium': return { text: 'Premium', color: 'bg-purple-500' }
      case 'standard': return { text: 'Standard', color: 'bg-pink-500' }
      default: return { text: 'Free', color: 'bg-gray-500' }
    }
  }

  const badge = getPlanBadge()

  if (showEditProfile) {
    return (
      <div className="h-full bg-gray-50 overflow-y-auto">
        <div className="bg-white shadow-sm px-4 py-3 flex items-center gap-3">
          <button onClick={() => setShowEditProfile(false)} className="text-gray-600">
            <BackIcon />
          </button>
          <h2 className="font-semibold text-gray-900">Edit Profile</h2>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Introduction Video</label>
            <button className="w-full h-24 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-500 hover:border-pink-400 transition">
              <VideoIcon className="w-8 h-8" />
              <span className="text-sm mt-1">Update Video</span>
            </button>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
            <textarea
              value={editData.bio || ''}
              onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 h-24 resize-none"
              placeholder="Tell others about yourself..."
            />
          </div>

          {/* Interests */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Interests</label>
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
                  {interest.emoji} {interest.label}
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
            Save Changes
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
            <p className="text-sm text-gray-500">Likes</p>
          </div>
          <div className="border-l border-r px-8">
            <p className="text-2xl font-bold text-pink-500">{user.matches || 0}</p>
            <p className="text-sm text-gray-500">Matches</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-pink-500">{user.superLikes || 0}</p>
            <p className="text-sm text-gray-500">Super Likes</p>
          </div>
        </div>
      </div>

      {/* Interests */}
      <div className="bg-white mx-4 rounded-2xl shadow-lg p-4 mb-4">
        <h3 className="font-semibold text-gray-900 mb-3">Your Interests</h3>
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
              <h3 className="font-semibold text-gray-900">Language Game</h3>
              <p className="text-sm text-gray-500">Learn Korean & earn points</p>
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
          <span className="font-medium text-gray-700">Edit Profile</span>
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
        <button className="w-full p-4 flex items-center justify-between hover:bg-gray-50">
          <span className="font-medium text-gray-700">Subscription</span>
          <span className={`${badge.color} text-white text-xs font-bold px-2 py-1 rounded-full`}>{badge.text}</span>
        </button>
        <button className="w-full p-4 flex items-center justify-between hover:bg-gray-50">
          <span className="font-medium text-gray-700">Discovery Settings</span>
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
        <button className="w-full p-4 flex items-center justify-between hover:bg-gray-50">
          <span className="font-medium text-gray-700">Notifications</span>
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="bg-white mx-4 rounded-2xl shadow-lg divide-y mb-8">
        <button className="w-full p-4 flex items-center justify-between hover:bg-gray-50">
          <span className="font-medium text-gray-700">Help & Support</span>
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
        <button className="w-full p-4 flex items-center justify-between hover:bg-gray-50">
          <span className="font-medium text-gray-700">Privacy Policy</span>
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
        <button className="w-full p-4 text-red-500 font-medium hover:bg-gray-50">
          Log Out
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
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
      <div className="w-24 h-24 bg-pink-100 rounded-full flex items-center justify-center mb-4">
        <HeartIcon filled className="w-12 h-12 text-pink-500" />
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">
        {userPlan === 'free' ? 'Daily limit reached' : 'No more profiles'}
      </h2>
      <p className="text-gray-500 mb-6">
        {userPlan === 'free'
          ? 'Upgrade to get unlimited matches'
          : 'Check back later for more people in your area'
        }
      </p>
      <button className="px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full font-semibold hover:shadow-lg transition">
        {userPlan === 'free' ? 'Upgrade Now' : 'Expand Search'}
      </button>
    </div>
  )
}

// ============================================
// MAIN APP COMPONENT
// ============================================

function App() {
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
            <span className="text-xs">Discover</span>
          </button>
          <button
            onClick={() => { setCurrentTab('messages'); setSelectedChat(null); }}
            className={`flex-1 py-4 flex flex-col items-center gap-1 relative ${
              currentTab === 'messages' ? 'text-pink-500' : 'text-gray-400'
            }`}
          >
            <ChatIcon />
            <span className="text-xs">Messages</span>
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
            <span className="text-xs">Profile</span>
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

export default App
