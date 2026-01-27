import { useState, useEffect } from 'react'

// Sample user data for the dating app
const sampleProfiles = [
  {
    id: 1,
    name: 'Emma',
    age: 28,
    bio: 'Coffee enthusiast ☕ | Dog mom 🐕 | Adventure seeker',
    location: 'San Francisco, CA',
    distance: '3 miles away',
    images: ['https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400'],
    interests: ['Travel', 'Photography', 'Hiking', 'Coffee'],
  },
  {
    id: 2,
    name: 'James',
    age: 31,
    bio: 'Tech entrepreneur by day, chef by night 👨‍🍳',
    location: 'Oakland, CA',
    distance: '7 miles away',
    images: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400'],
    interests: ['Cooking', 'Startups', 'Music', 'Fitness'],
  },
  {
    id: 3,
    name: 'Sofia',
    age: 26,
    bio: 'Artist & dreamer 🎨 Looking for my partner in crime',
    location: 'Berkeley, CA',
    distance: '5 miles away',
    images: ['https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400'],
    interests: ['Art', 'Museums', 'Wine', 'Dancing'],
  },
  {
    id: 4,
    name: 'Marcus',
    age: 29,
    bio: 'Surfer 🏄 | Yoga instructor | Living life one wave at a time',
    location: 'Santa Cruz, CA',
    distance: '12 miles away',
    images: ['https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400'],
    interests: ['Surfing', 'Yoga', 'Meditation', 'Beach'],
  },
  {
    id: 5,
    name: 'Olivia',
    age: 27,
    bio: 'Book lover 📚 | Cat person 🐱 | Hopeless romantic',
    location: 'San Jose, CA',
    distance: '15 miles away',
    images: ['https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400'],
    interests: ['Reading', 'Writing', 'Movies', 'Cats'],
  },
]

const sampleMatches = [
  { id: 101, name: 'Alex', image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100', lastMessage: 'Hey! How was your weekend?', time: '2m ago', unread: true },
  { id: 102, name: 'Jordan', image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100', lastMessage: 'That sounds amazing!', time: '1h ago', unread: false },
  { id: 103, name: 'Taylor', image: 'https://images.unsplash.com/photo-1524638431109-93d95c968f03?w=100', lastMessage: 'Would love to grab coffee ☕', time: '3h ago', unread: false },
]

// Icons as components
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
    <path d="M12 23c-3.866 0-7-3.134-7-7 0-2.551 1.268-4.827 2.71-6.6.853-1.05 1.785-1.96 2.562-2.686.387-.362.736-.678 1.016-.94.136-.127.261-.244.376-.35.09-.084.159-.148.195-.18l.141-.13.141.13c.036.032.105.096.195.18.115.106.24.223.376.35.28.262.629.578 1.016.94.777.726 1.71 1.636 2.562 2.686C17.732 11.173 19 13.449 19 16c0 3.866-3.134 7-7 7zm0-18.794c-.272.246-.566.515-.869.798-.777.726-1.71 1.636-2.562 2.686C7.268 9.173 6 11.449 6 14c0 3.314 2.686 6 6 6s6-2.686 6-6c0-2.551-1.268-4.827-2.71-6.6-.853-1.05-1.785-1.96-2.562-2.686-.303-.283-.597-.552-.869-.798-.044-.04-.085-.078-.124-.114l-.012-.011-.012.011c-.039.036-.08.074-.124.114-.044.04-.085.078-.124.114l-.012.011-.012-.011c-.039-.036-.08-.074-.124-.114z" />
  </svg>
)

const LocationIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)

const SettingsIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
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

// Profile Card Component
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
      {/* Profile Image */}
      <div className="relative h-96 sm:h-[500px]">
        <img
          src={profile.images[0]}
          alt={profile.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

        {/* Swipe Indicators */}
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

        {/* Profile Info Overlay */}
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
            {profile.interests.map((interest, idx) => (
              <span key={idx} className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm">
                {interest}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
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

// Match Modal
function MatchModal({ match, onClose, onMessage }) {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-b from-pink-500 to-rose-600 rounded-3xl p-8 max-w-sm w-full text-center text-white animate-bounce-in">
        <h2 className="text-3xl font-bold mb-2">It's a Match! 🎉</h2>
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

// Chat Component
function Chat({ match, messages, onSendMessage, onBack }) {
  const [newMessage, setNewMessage] = useState('')

  const handleSend = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage)
      setNewMessage('')
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
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.sent ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[75%] px-4 py-2 rounded-2xl ${
              msg.sent
                ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-br-md'
                : 'bg-white text-gray-800 rounded-bl-md shadow-sm'
            }`}>
              <p>{msg.text}</p>
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
    </div>
  )
}

// Messages List Component
function MessagesList({ matches, onSelectChat }) {
  return (
    <div className="h-full bg-gray-50">
      {/* New Matches */}
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

      {/* Messages */}
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

// Profile Settings Component
function ProfileSettings({ user, onUpdateUser }) {
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
          <button className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center text-pink-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
        </div>
        <h2 className="text-2xl font-bold mt-3">{user.name}, {user.age}</h2>
      </div>

      {/* Stats */}
      <div className="bg-white -mt-8 mx-4 rounded-2xl shadow-lg p-4 mb-4">
        <div className="flex justify-around text-center">
          <div>
            <p className="text-2xl font-bold text-pink-500">{user.likes}</p>
            <p className="text-sm text-gray-500">Likes</p>
          </div>
          <div className="border-l border-r px-8">
            <p className="text-2xl font-bold text-pink-500">{user.matches}</p>
            <p className="text-sm text-gray-500">Matches</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-pink-500">{user.superLikes}</p>
            <p className="text-sm text-gray-500">Super Likes</p>
          </div>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="bg-white mx-4 rounded-2xl shadow-lg divide-y mb-4">
        <button className="w-full p-4 flex items-center justify-between hover:bg-gray-50">
          <span className="font-medium text-gray-700">Edit Profile</span>
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
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
    </div>
  )
}

// Empty State when no more profiles
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
      <div className="w-24 h-24 bg-pink-100 rounded-full flex items-center justify-center mb-4">
        <HeartIcon filled className="w-12 h-12 text-pink-500" />
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">No more profiles</h2>
      <p className="text-gray-500 mb-6">Check back later for more people in your area</p>
      <button className="px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full font-semibold hover:shadow-lg transition">
        Expand Search
      </button>
    </div>
  )
}

// Main App Component
function App() {
  const [currentTab, setCurrentTab] = useState('discover')
  const [profiles, setProfiles] = useState(sampleProfiles)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [matches, setMatches] = useState(sampleMatches)
  const [showMatch, setShowMatch] = useState(null)
  const [selectedChat, setSelectedChat] = useState(null)
  const [chatMessages, setChatMessages] = useState({})
  const [user] = useState({
    name: 'You',
    age: 25,
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
    likes: 47,
    matches: 12,
    superLikes: 3,
  })

  const currentProfile = profiles[currentIndex]

  const handleLike = () => {
    // 30% chance of match for demo purposes
    if (Math.random() < 0.3) {
      setShowMatch(currentProfile)
    }
    nextProfile()
  }

  const handlePass = () => {
    nextProfile()
  }

  const handleSuperLike = () => {
    // 50% chance of match for super likes
    if (Math.random() < 0.5) {
      setShowMatch(currentProfile)
    }
    nextProfile()
  }

  const nextProfile = () => {
    if (currentIndex < profiles.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      setCurrentIndex(profiles.length) // Show empty state
    }
  }

  const handleSendMessage = (text) => {
    if (!selectedChat) return
    const chatId = selectedChat.id
    const newMsg = { text, sent: true, time: 'Just now' }
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

  // Render based on current view
  const renderContent = () => {
    // If in chat view
    if (selectedChat && currentTab === 'messages') {
      return (
        <Chat
          match={selectedChat}
          messages={chatMessages[selectedChat.id] || []}
          onSendMessage={handleSendMessage}
          onBack={() => setSelectedChat(null)}
        />
      )
    }

    switch (currentTab) {
      case 'discover':
        return currentProfile ? (
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
          <EmptyState />
        )
      case 'messages':
        return <MessagesList matches={matches} onSelectChat={setSelectedChat} />
      case 'profile':
        return <ProfileSettings user={user} />
      default:
        return null
    }
  }

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm px-4 py-3 flex items-center justify-between">
        <button className="text-gray-600 hover:text-gray-800">
          <SettingsIcon />
        </button>
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

      {/* Add custom styles for animations */}
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
