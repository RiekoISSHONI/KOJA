import { useState, useEffect } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import { LanguageProvider, useLanguage } from './context/LanguageContext'
import { useCycleData } from './hooks/useCycleData'
import { isSupabaseConfigured } from './lib/supabase'

// ============================================
// CYCLE PHASE STYLING (content comes from translations)
// ============================================

const PHASE_STYLES = {
  menstruation: {
    key: 'menstruation',
    days: [1, 2, 3, 4, 5],
    color: 'bg-red-100 border-red-400',
    dotColor: 'bg-red-500',
    textColor: 'text-red-700',
    emoji: '🌙',
    energyLevel: 'low',
  },
  follicular: {
    key: 'follicular',
    days: [6, 7, 8, 9, 10],
    color: 'bg-green-100 border-green-400',
    dotColor: 'bg-green-500',
    textColor: 'text-green-700',
    emoji: '🌱',
    energyLevel: 'rising',
  },
  ovulation: {
    key: 'ovulation',
    days: [11, 12, 13, 14, 15],
    color: 'bg-pink-100 border-pink-400',
    dotColor: 'bg-pink-500',
    textColor: 'text-pink-700',
    emoji: '🌸',
    energyLevel: 'peak',
  },
  earlyLuteal: {
    key: 'earlyLuteal',
    days: [16, 17, 18, 19],
    color: 'bg-yellow-100 border-yellow-400',
    dotColor: 'bg-yellow-500',
    textColor: 'text-yellow-700',
    emoji: '🍂',
    energyLevel: 'moderate',
  },
  lateLuteal: {
    key: 'lateLuteal',
    days: [20, 21, 22, 23, 24, 25, 26, 27, 28],
    color: 'bg-purple-100 border-purple-400',
    dotColor: 'bg-purple-500',
    textColor: 'text-purple-700',
    emoji: '🦋',
    energyLevel: 'low',
  },
}

// ============================================
// ICONS
// ============================================

const CalendarIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
)

const ShareIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
  </svg>
)

const DownloadIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
)

const XIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
)

const BackIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
)

const CheckIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
)

const NoteIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
)

const UserIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
)

const CloudIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
  </svg>
)

const SyncIcon = ({ className = "w-4 h-4", spinning = false }) => (
  <svg className={`${className} ${spinning ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
)

const LinkIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
  </svg>
)

const LanguageIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
  </svg>
)

const EnergyIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
)

// Energy level indicator component
const EnergyLevel = ({ level, t }) => {
  const levels = {
    low: { bars: 1, color: 'bg-red-400', labelKey: 'lowEnergy' },
    rising: { bars: 2, color: 'bg-green-400', labelKey: 'risingEnergy' },
    moderate: { bars: 2, color: 'bg-yellow-400', labelKey: 'moderateEnergy' },
    peak: { bars: 3, color: 'bg-pink-400', labelKey: 'peakEnergy' },
  }
  const config = levels[level] || levels.moderate

  return (
    <div className="flex items-center gap-1.5">
      <EnergyIcon className="w-3.5 h-3.5 text-gray-500" />
      <div className="flex gap-0.5">
        {[1, 2, 3].map((bar) => (
          <div
            key={bar}
            className={`w-1.5 rounded-full ${bar <= config.bars ? config.color : 'bg-gray-200'}`}
            style={{ height: `${8 + bar * 3}px` }}
          />
        ))}
      </div>
      <span className="text-xs text-gray-500 ml-0.5">{t(config.labelKey)}</span>
    </div>
  )
}

// ============================================
// AUTH MODAL
// ============================================

function AuthModal({ onClose }) {
  const { signIn, signUp, signInWithMagicLink, error } = useAuth()
  const [mode, setMode] = useState('signin') // signin, signup, magic
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    if (mode === 'magic') {
      const { error } = await signInWithMagicLink(email)
      if (!error) {
        setMessage('Check your email for a login link!')
      }
    } else if (mode === 'signup') {
      const { error } = await signUp(email, password)
      if (!error) {
        setMessage('Check your email to confirm your account!')
      }
    } else {
      const { error } = await signIn(email, password)
      if (!error) {
        onClose()
      }
    }
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800">
            {mode === 'signin' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Magic Link'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        <p className="text-sm text-gray-600 mb-4">
          Sign in to sync your cycle data across devices and share with your partner.
        </p>

        {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-xl text-sm">{error}</div>}
        {message && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-xl text-sm">{message}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
            />
          </div>

          {mode !== 'magic' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl font-bold disabled:opacity-50"
          >
            {loading ? 'Loading...' : mode === 'signin' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Send Magic Link'}
          </button>
        </form>

        <div className="mt-4 text-center space-y-2">
          {mode === 'signin' && (
            <>
              <button onClick={() => setMode('magic')} className="text-sm text-pink-500 hover:underline">
                Sign in with magic link instead
              </button>
              <p className="text-sm text-gray-500">
                Don't have an account?{' '}
                <button onClick={() => setMode('signup')} className="text-pink-500 hover:underline">Sign up</button>
              </p>
            </>
          )}
          {mode === 'signup' && (
            <p className="text-sm text-gray-500">
              Already have an account?{' '}
              <button onClick={() => setMode('signin')} className="text-pink-500 hover:underline">Sign in</button>
            </p>
          )}
          {mode === 'magic' && (
            <button onClick={() => setMode('signin')} className="text-sm text-pink-500 hover:underline">
              Back to password sign in
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// ============================================
// PARTNER SHARE MODAL
// ============================================

function PartnerShareModal({ onClose, shareCode, sharedWith, onGenerateCode, onAcceptInvite, onRemoveShare }) {
  const [inviteCode, setInviteCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [copied, setCopied] = useState(false)

  const handleGenerateCode = async () => {
    setLoading(true)
    await onGenerateCode()
    setLoading(false)
  }

  const handleAcceptInvite = async () => {
    if (!inviteCode.trim()) return
    setLoading(true)
    setError('')
    setSuccess('')
    const result = await onAcceptInvite(inviteCode)
    if (result.error) {
      setError(result.error)
    } else {
      setSuccess('Connected! You can now view your partner\'s cycle.')
      setInviteCode('')
    }
    setLoading(false)
  }

  const copyCode = () => {
    navigator.clipboard.writeText(shareCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800">Share with Partner</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-xl text-sm">{error}</div>}
        {success && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-xl text-sm">{success}</div>}

        {/* Your share code */}
        <div className="mb-6 p-4 bg-pink-50 rounded-xl">
          <p className="text-sm font-medium text-gray-700 mb-2">Your Share Code</p>
          <p className="text-xs text-gray-500 mb-3">Give this code to your partner so they can see your cycle.</p>

          {shareCode ? (
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-white rounded-lg px-4 py-3 font-mono text-xl text-center tracking-wider">
                {shareCode}
              </div>
              <button
                onClick={copyCode}
                className="px-4 py-3 bg-pink-500 text-white rounded-lg font-medium"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          ) : (
            <button
              onClick={handleGenerateCode}
              disabled={loading}
              className="w-full py-3 bg-pink-500 text-white rounded-xl font-medium disabled:opacity-50"
            >
              {loading ? 'Generating...' : 'Generate Share Code'}
            </button>
          )}
        </div>

        {/* Enter partner's code */}
        <div className="mb-6 p-4 bg-blue-50 rounded-xl">
          <p className="text-sm font-medium text-gray-700 mb-2">Enter Partner's Code</p>
          <p className="text-xs text-gray-500 mb-3">Enter your partner's code to view their cycle.</p>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
              placeholder="ABC123"
              maxLength={6}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg font-mono text-center uppercase tracking-wider"
            />
            <button
              onClick={handleAcceptInvite}
              disabled={loading || !inviteCode.trim()}
              className="px-4 py-3 bg-blue-500 text-white rounded-lg font-medium disabled:opacity-50"
            >
              Connect
            </button>
          </div>
        </div>

        {/* Connected partners */}
        {sharedWith && sharedWith.length > 0 && (
          <div className="border-t pt-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Shared With</p>
            <div className="space-y-2">
              {sharedWith.map((share) => (
                <div key={share.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-700">{share.shared_with_user?.email || 'Partner'}</span>
                  <button
                    onClick={() => onRemoveShare(share.id)}
                    className="text-red-500 text-sm hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================
// PWA INSTALL BANNER
// ============================================

function InstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    const dismissed = localStorage.getItem('pwaInstallDismissed')
    if (dismissed) return

    const handler = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowBanner(true)
    }

    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') {
      setShowBanner(false)
    }
    setDeferredPrompt(null)
  }

  const handleDismiss = () => {
    setShowBanner(false)
    localStorage.setItem('pwaInstallDismissed', 'true')
  }

  if (!showBanner) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 z-40">
      <div className="max-w-lg mx-auto flex items-center justify-between gap-3">
        <div className="flex-1">
          <p className="font-medium text-gray-800 text-sm">Install Cycle Tracker</p>
          <p className="text-xs text-gray-500">Add to home screen for quick access</p>
        </div>
        <button
          onClick={handleInstall}
          className="px-4 py-2 bg-pink-500 text-white rounded-lg text-sm font-medium"
        >
          Install
        </button>
        <button
          onClick={handleDismiss}
          className="text-gray-400 hover:text-gray-600"
        >
          <XIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}

// ============================================
// NOTES MODAL
// ============================================

function NotesModal({ notes, onSaveNote, onClose, selectedDate }) {
  const [currentDate, setCurrentDate] = useState(selectedDate)
  const dateStr = currentDate.toISOString().split('T')[0]
  const [noteText, setNoteText] = useState(notes[dateStr] || '')

  useEffect(() => {
    const dateStr = currentDate.toISOString().split('T')[0]
    setNoteText(notes[dateStr] || '')
  }, [currentDate, notes])

  const handleSave = () => {
    const dateStr = currentDate.toISOString().split('T')[0]
    onSaveNote(dateStr, noteText)
  }

  const sortedNotes = Object.entries(notes)
    .sort((a, b) => new Date(b[0]) - new Date(a[0]))

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-bold text-gray-800">Cycle Notes</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="p-4 border-b">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Add note for {currentDate.toLocaleDateString()}
          </label>
          <input
            type="date"
            value={dateStr}
            onChange={(e) => setCurrentDate(new Date(e.target.value))}
            className="w-full px-3 py-2 border rounded-lg mb-2"
          />
          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="How are you feeling? Any symptoms?"
            className="w-full px-3 py-2 border rounded-lg h-24 resize-none"
          />
          <button
            onClick={handleSave}
            className="w-full mt-2 py-2 bg-pink-500 text-white rounded-lg font-medium"
          >
            Save Note
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Previous Notes</p>
          {sortedNotes.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">No notes yet</p>
          ) : (
            <div className="space-y-2">
              {sortedNotes.map(([date, note]) => (
                <div key={date} className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">
                    {new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                  </p>
                  <p className="text-sm text-gray-700">{note}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ============================================
// DAY DETAIL MODAL
// ============================================

function DayDetailModal({ dayInfo, viewMode, notes, onSaveNote, onClose }) {
  const dateStr = dayInfo.date.toISOString().split('T')[0]
  const [noteText, setNoteText] = useState(notes[dateStr] || '')

  const handleSave = () => {
    onSaveNote(dateStr, noteText)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[80vh] overflow-y-auto">
        <div className="sticky top-0 bg-white flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-bold text-gray-800">
            {dayInfo.date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="p-4">
          {dayInfo.phase ? (
            <>
              <div className={`p-4 rounded-xl border-2 ${dayInfo.phase.color} mb-4`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl">{dayInfo.phase.emoji}</span>
                  <div>
                    <p className="text-sm text-gray-500">Day {dayInfo.cycleDay}</p>
                    <p className={`font-bold ${dayInfo.phase.textColor}`}>{dayInfo.phase.name}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-2">{dayInfo.phase.description}</p>
              </div>

              <div className="mb-4">
                <p className="font-medium text-gray-800 mb-2">
                  {viewMode === 'her' ? dayInfo.phase.forHer.title : dayInfo.phase.forHim.title}
                </p>
                <div className="space-y-2">
                  {(viewMode === 'her' ? dayInfo.phase.forHer.tips : dayInfo.phase.forHim.tips).map((tip, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckIcon className={`w-4 h-4 ${viewMode === 'her' ? 'text-pink-500' : 'text-blue-500'} flex-shrink-0 mt-0.5`} />
                      <p className="text-sm text-gray-600">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <p className="text-gray-500 text-center py-4">No cycle data for this date</p>
          )}

          <div className="border-t pt-4">
            <p className="font-medium text-gray-800 mb-2">Notes</p>
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="How are you feeling? Any symptoms, mood changes, or observations?"
              className="w-full px-3 py-2 border rounded-lg h-24 resize-none"
            />
            <button
              onClick={handleSave}
              className="w-full mt-2 py-2 bg-pink-500 text-white rounded-lg font-medium"
            >
              Save Note
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================
// MAIN APP CONTENT
// ============================================

function AppContent() {
  const { user, signOut, isConfigured } = useAuth()
  const { t, getPhase, language, toggleLanguage } = useLanguage()
  const {
    lastPeriodStart, setLastPeriodStart,
    cycleLength, setCycleLength,
    periodLength, setPeriodLength,
    notes, setNotes,
    syncing, lastSynced,
    shareCode, sharedWith, sharedFromUser,
    generateShareCode, acceptShareInvite, removeShare,
    loadPartnerData,
  } = useCycleData()

  const [viewMode, setViewMode] = useState('her')
  const [selectedDate, setSelectedDate] = useState(null)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [showSettings, setShowSettings] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [showNotes, setShowNotes] = useState(false)
  const [showAuth, setShowAuth] = useState(false)
  const [showPartnerShare, setShowPartnerShare] = useState(false)
  const [exportSuccess, setExportSuccess] = useState('')
  const [partnerData, setPartnerData] = useState(null)
  const [viewingPartner, setViewingPartner] = useState(false)

  // Helper to get full phase data (styling + translated content)
  const getFullPhase = (phaseKey) => {
    const style = PHASE_STYLES[phaseKey]
    const content = getPhase(phaseKey)
    if (!style || !content) return null
    return { ...style, ...content }
  }

  // Load partner data when available
  useEffect(() => {
    if (sharedFromUser && user) {
      loadPartnerData().then(setPartnerData)
    }
  }, [sharedFromUser, user])

  // Use partner data when viewing partner
  const activeData = viewingPartner && partnerData ? partnerData : {
    lastPeriodStart, cycleLength, periodLength, notes
  }

  const getCycleDay = (date) => {
    if (!activeData.lastPeriodStart) return null
    const start = new Date(activeData.lastPeriodStart)
    const target = new Date(date)
    const diffTime = target - start
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    if (diffDays < 0) return null
    return (diffDays % activeData.cycleLength) + 1
  }

  const getPhaseForDay = (cycleDay) => {
    if (!cycleDay) return null
    if (cycleDay <= activeData.periodLength) return getFullPhase('menstruation')
    if (cycleDay <= 10) return getFullPhase('follicular')
    if (cycleDay <= 15) return getFullPhase('ovulation')
    if (cycleDay <= 19) return getFullPhase('earlyLuteal')
    return getFullPhase('lateLuteal')
  }

  const today = new Date()
  const todayCycleDay = getCycleDay(today)
  const todayPhase = getPhaseForDay(todayCycleDay)

  const getNextPeriod = () => {
    if (!activeData.lastPeriodStart) return null
    const start = new Date(activeData.lastPeriodStart)
    const now = new Date()
    let nextPeriod = new Date(start)
    while (nextPeriod <= now) {
      nextPeriod.setDate(nextPeriod.getDate() + activeData.cycleLength)
    }
    return nextPeriod
  }

  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startPadding = firstDay.getDay()
    const days = []

    for (let i = 0; i < startPadding; i++) days.push(null)

    for (let d = 1; d <= lastDay.getDate(); d++) {
      const date = new Date(year, month, d)
      const cycleDay = getCycleDay(date)
      const phase = getPhaseForDay(cycleDay)
      const dateStr = date.toISOString().split('T')[0]
      days.push({ date, day: d, cycleDay, phase, isToday: date.toDateString() === today.toDateString(), hasNote: !!activeData.notes[dateStr] })
    }
    return days
  }

  const generateICSContent = (forPartner = false) => {
    if (!lastPeriodStart) return null
    const events = []
    const endDate = new Date()
    endDate.setMonth(endDate.getMonth() + 6)
    let currentCycleStart = new Date(lastPeriodStart)

    while (currentCycleStart < endDate) {
      const phases = [
        { key: 'menstruation', startDay: 1, endDay: periodLength },
        { key: 'follicular', startDay: periodLength + 1, endDay: 10 },
        { key: 'ovulation', startDay: 11, endDay: 15 },
        { key: 'earlyLuteal', startDay: 16, endDay: 19 },
        { key: 'lateLuteal', startDay: 20, endDay: cycleLength },
      ]

      phases.forEach(phase => {
        const phaseStart = new Date(currentCycleStart)
        phaseStart.setDate(phaseStart.getDate() + phase.startDay - 1)
        const phaseEnd = new Date(currentCycleStart)
        phaseEnd.setDate(phaseEnd.getDate() + phase.endDay - 1)

        if (phaseEnd >= new Date()) {
          const phaseData = getFullPhase(phase.key)
          const tips = forPartner && phaseData ? phaseData.forHim.tips.slice(0, 2).join('. ') : (phaseData ? phaseData.forHer.tips.slice(0, 2).join('. ') : '')
          const phaseName = phaseData?.name || phase.key
          events.push({
            uid: `cycle-${currentCycleStart.getTime()}-${phase.key}@cycle-tracker.app`,
            start: phaseStart, end: phaseEnd,
            summary: forPartner ? `Partner's ${phaseName}` : phaseName,
            description: tips,
          })
        }
      })
      currentCycleStart.setDate(currentCycleStart.getDate() + cycleLength)
    }

    let ics = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Cycle Tracker//EN\nCALSCALE:GREGORIAN\nMETHOD:PUBLISH\nX-WR-CALNAME:${forPartner ? "Partner's Cycle" : 'My Cycle'}\n`
    events.forEach(event => {
      ics += `BEGIN:VEVENT\nUID:${event.uid}\nDTSTART;VALUE=DATE:${event.start.toISOString().split('T')[0].replace(/-/g, '')}\nDTEND;VALUE=DATE:${event.end.toISOString().split('T')[0].replace(/-/g, '')}\nSUMMARY:${event.summary}\nDESCRIPTION:${event.description.replace(/\n/g, '\\n')}\nEND:VEVENT\n`
    })
    ics += 'END:VCALENDAR'
    return ics
  }

  const downloadICS = (forPartner = false, type = 'apple') => {
    const ics = generateICSContent(forPartner)
    if (!ics) { alert('Please set your last period start date first'); return }
    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = forPartner ? 'partner-cycle.ics' : 'my-cycle.ics'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    setExportSuccess(type === 'google' ? 'Downloaded! Import into Google Calendar via Settings > Import' : 'Downloaded! Double-click to add to Apple Calendar')
    setTimeout(() => setExportSuccess(''), 5000)
  }

  const handleSaveNote = (dateStr, noteText) => {
    if (viewingPartner) return // Can't edit partner's notes
    if (noteText.trim()) {
      setNotes(prev => ({ ...prev, [dateStr]: noteText }))
    } else {
      const newNotes = { ...notes }
      delete newNotes[dateStr]
      setNotes(newNotes)
    }
  }

  const calendarDays = generateCalendarDays()
  const nextPeriod = getNextPeriod()
  const daysUntilPeriod = nextPeriod ? Math.ceil((nextPeriod - today) / (1000 * 60 * 60 * 24)) : null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-pink-500 to-rose-500 text-white p-4 shadow-lg">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold">{t('appName')}</h1>
            {syncing && <SyncIcon className="w-4 h-4 animate-spin" spinning />}
            {!syncing && user && lastSynced && (
              <CloudIcon className="w-4 h-4 opacity-75" title={`Synced ${lastSynced.toLocaleTimeString()}`} />
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={toggleLanguage}
              className="p-2 hover:bg-white/20 rounded-lg transition text-xs font-bold"
              title="Switch language"
            >
              {language === 'en' ? '日本語' : 'EN'}
            </button>
            {isConfigured && (
              <button
                onClick={() => user ? setShowPartnerShare(true) : setShowAuth(true)}
                className="p-2 hover:bg-white/20 rounded-lg transition"
                title={user ? t('shareWithPartner') : t('signIn')}
              >
                <LinkIcon className="w-5 h-5" />
              </button>
            )}
            <button onClick={() => setShowSettings(true)} className="p-2 hover:bg-white/20 rounded-lg transition">
              <CalendarIcon className="w-5 h-5" />
            </button>
            <button onClick={() => setShowShareModal(true)} className="p-2 hover:bg-white/20 rounded-lg transition">
              <ShareIcon />
            </button>
            {isConfigured && (
              <button
                onClick={() => user ? signOut() : setShowAuth(true)}
                className="p-2 hover:bg-white/20 rounded-lg transition"
                title={user ? `Signed in as ${user.email}` : t('signIn')}
              >
                <UserIcon className={`w-5 h-5 ${user ? 'fill-white' : ''}`} />
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto pb-8">
        {/* Partner view toggle (when connected to partner) */}
        {partnerData && (
          <div className="p-4 pb-0">
            <div className="flex rounded-xl bg-purple-100 p-1">
              <button
                onClick={() => setViewingPartner(false)}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${!viewingPartner ? 'bg-white text-purple-600 shadow-sm' : 'text-purple-500'}`}
              >
                {t('myCycle')}
              </button>
              <button
                onClick={() => setViewingPartner(true)}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${viewingPartner ? 'bg-white text-purple-600 shadow-sm' : 'text-purple-500'}`}
              >
                {t('partnerCycle')}
              </button>
            </div>
          </div>
        )}

        {/* View Toggle */}
        <div className="p-4">
          <div className="flex rounded-xl bg-gray-200 p-1">
            <button onClick={() => setViewMode('her')} className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${viewMode === 'her' ? 'bg-white text-pink-600 shadow-sm' : 'text-gray-500'}`}>{t('forHer')}</button>
            <button onClick={() => setViewMode('him')} className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${viewMode === 'him' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'}`}>{t('forHim')}</button>
          </div>
        </div>

        {/* Status Card */}
        {activeData.lastPeriodStart && todayPhase ? (
          <div className={`mx-4 p-4 rounded-2xl border-2 ${todayPhase.color}`}>
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-sm text-gray-500">
                  {viewingPartner ? t('partnerCycle') + ' - ' : ''}{t('today')} - {t('day')} {todayCycleDay}
                </p>
                <h2 className={`text-lg font-bold ${todayPhase.textColor}`}>{todayPhase.emoji} {todayPhase.name}</h2>
              </div>
              {nextPeriod && daysUntilPeriod > 0 && (
                <div className="text-right">
                  <p className="text-sm text-gray-500">{t('nextPeriodIn')}</p>
                  <p className="text-lg font-bold text-gray-800">{daysUntilPeriod} {t('days')}</p>
                </div>
              )}
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">{todayPhase.description}</p>
              {todayPhase.energyLevel && <EnergyLevel level={todayPhase.energyLevel} t={t} />}
            </div>

            {/* Daily Quote */}
            {todayPhase.quotes && (() => {
              const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24))
              const quote = todayPhase.quotes[dayOfYear % todayPhase.quotes.length]
              return (
                <div className="pt-3 mt-3 border-t border-gray-200/50">
                  <p className="text-sm italic text-gray-700">"{quote.text}"</p>
                  <p className="text-xs text-gray-500 mt-1">— {quote.author}</p>
                </div>
              )
            })()}
          </div>
        ) : (
          <div className="mx-4 p-4 rounded-2xl border-2 border-gray-200 bg-white">
            <p className="text-center text-gray-500">
              {viewingPartner ? t('partnerNotSetup') : t('setLastPeriod')}
            </p>
            {!viewingPartner && (
              <button onClick={() => setShowSettings(true)} className="w-full mt-3 py-2 bg-pink-500 text-white rounded-xl font-medium">{t('setupCycle')}</button>
            )}
          </div>
        )}

        {/* Cloud sync banner */}
        {!user && isConfigured && (
          <div className="mx-4 mt-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CloudIcon className="w-5 h-5 text-blue-500" />
                <span className="text-sm text-gray-700">{t('syncShare')}</span>
              </div>
              <button
                onClick={() => setShowAuth(true)}
                className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm font-medium"
              >
                {t('signIn')}
              </button>
            </div>
          </div>
        )}

        {/* Calendar */}
        <div className="mx-4 mt-4 bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => { const d = new Date(currentMonth); d.setMonth(d.getMonth() - 1); setCurrentMonth(d) }} className="p-2 text-gray-500 hover:text-gray-700"><BackIcon /></button>
            <h3 className="font-bold text-gray-800">{currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h3>
            <button onClick={() => { const d = new Date(currentMonth); d.setMonth(d.getMonth() + 1); setCurrentMonth(d) }} className="p-2 text-gray-500 hover:text-gray-700 rotate-180"><BackIcon /></button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
              <div key={i} className="text-center text-xs font-medium text-gray-400 py-2">{day}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((dayInfo, i) => (
              <button key={i} onClick={() => dayInfo && setSelectedDate(dayInfo)} disabled={!dayInfo}
                className={`aspect-square rounded-lg flex flex-col items-center justify-center text-sm relative ${!dayInfo ? 'invisible' : ''} ${dayInfo?.isToday ? 'ring-2 ring-pink-500' : ''} ${dayInfo?.phase ? dayInfo.phase.color : 'bg-gray-50'} hover:opacity-80 transition`}>
                {dayInfo && (
                  <>
                    <span className={`font-medium ${dayInfo.phase ? dayInfo.phase.textColor : 'text-gray-700'}`}>{dayInfo.day}</span>
                    {dayInfo.cycleDay && <span className="text-[10px] text-gray-500">D{dayInfo.cycleDay}</span>}
                    {dayInfo.hasNote && <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-blue-500 rounded-full" />}
                  </>
                )}
              </button>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap gap-2 justify-center">
            {Object.entries(PHASE_STYLES).map(([key, style]) => {
              const phaseContent = getPhase(key)
              return (
                <div key={key} className="flex items-center gap-1">
                  <div className={`w-3 h-3 rounded-full ${style.dotColor}`} />
                  <span className="text-xs text-gray-500">{phaseContent?.name?.split(' ')[0] || key}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Tips */}
        {todayPhase && (
          <div className="mx-4 mt-4 bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-gray-800">{viewMode === 'her' ? todayPhase.forHer.title : todayPhase.forHim.title}</h3>
              {!viewingPartner && (
                <button onClick={() => setShowNotes(true)} className="flex items-center gap-1 text-sm text-pink-500">
                  <NoteIcon className="w-4 h-4" /> {t('notes')}
                </button>
              )}
            </div>

            {viewMode === 'her' ? (
              <>
                <div className="space-y-2 mb-4">
                  {todayPhase.forHer.tips.map((tip, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckIcon className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-gray-600">{tip}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs font-medium text-gray-500 mb-1">Recommended Exercise</p>
                  <p className="text-sm text-gray-800">{todayPhase.forHer.exercise}</p>
                </div>
                <div className="mt-3">
                  <p className="text-xs font-medium text-gray-500 mb-2">Recommended Foods</p>
                  <div className="flex flex-wrap gap-2">
                    {todayPhase.forHer.foods.map((food, i) => (
                      <span key={i} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs">{food}</span>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="space-y-2">
                {todayPhase.forHim.tips.map((tip, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckIcon className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-gray-600">{tip}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Attribution */}
        <div className="mx-4 mt-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl">
          <p className="text-xs text-gray-500 text-center">{t('attribution')}</p>
        </div>
      </main>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">Cycle Settings</h3>
              <button onClick={() => setShowSettings(false)} className="text-gray-400 hover:text-gray-600"><XIcon className="w-6 h-6" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Period Start Date</label>
                <input type="date" value={lastPeriodStart} onChange={(e) => setLastPeriodStart(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cycle Length (days)</label>
                <input type="number" value={cycleLength} onChange={(e) => setCycleLength(parseInt(e.target.value) || 28)} min="21" max="35" className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500" />
                <p className="text-xs text-gray-500 mt-1">Normal range: 21-35 days</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Period Length (days)</label>
                <input type="number" value={periodLength} onChange={(e) => setPeriodLength(parseInt(e.target.value) || 5)} min="3" max="7" className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500" />
              </div>
            </div>
            <button onClick={() => setShowSettings(false)} className="w-full mt-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl font-bold">Save Settings</button>
          </div>
        </div>
      )}

      {/* Share/Export Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">Export to Calendar</h3>
              <button onClick={() => setShowShareModal(false)} className="text-gray-400 hover:text-gray-600"><XIcon className="w-6 h-6" /></button>
            </div>
            {exportSuccess && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-xl text-sm">{exportSuccess}</div>}
            <div className="space-y-3">
              <div className="border rounded-xl p-3">
                <p className="font-medium text-gray-800 mb-2">My Calendar (For Her)</p>
                <div className="flex gap-2">
                  <button onClick={() => downloadICS(false, 'apple')} className="flex-1 flex items-center justify-center gap-2 py-2 bg-gray-100 rounded-lg text-sm font-medium hover:bg-gray-200"><DownloadIcon className="w-4 h-4" /> Apple</button>
                  <button onClick={() => downloadICS(false, 'google')} className="flex-1 flex items-center justify-center gap-2 py-2 bg-gray-100 rounded-lg text-sm font-medium hover:bg-gray-200"><DownloadIcon className="w-4 h-4" /> Google</button>
                </div>
              </div>
              <div className="border rounded-xl p-3">
                <p className="font-medium text-gray-800 mb-2">Partner Calendar (For Him)</p>
                <div className="flex gap-2">
                  <button onClick={() => downloadICS(true, 'apple')} className="flex-1 flex items-center justify-center gap-2 py-2 bg-blue-50 rounded-lg text-sm font-medium hover:bg-blue-100 text-blue-700"><DownloadIcon className="w-4 h-4" /> Apple</button>
                  <button onClick={() => downloadICS(true, 'google')} className="flex-1 flex items-center justify-center gap-2 py-2 bg-blue-50 rounded-lg text-sm font-medium hover:bg-blue-100 text-blue-700"><DownloadIcon className="w-4 h-4" /> Google</button>
                </div>
              </div>
            </div>
            <p className="mt-4 text-xs text-gray-500 text-center">ICS files work with Apple Calendar, Google Calendar, Outlook, and more.<br />For Google: Go to Calendar Settings {'>'} Import & Export {'>'} Import</p>
          </div>
        </div>
      )}

      {showNotes && !viewingPartner && <NotesModal notes={notes} onSaveNote={handleSaveNote} onClose={() => setShowNotes(false)} selectedDate={selectedDate?.date || today} />}
      {selectedDate && <DayDetailModal dayInfo={selectedDate} viewMode={viewMode} notes={activeData.notes} onSaveNote={handleSaveNote} onClose={() => setSelectedDate(null)} />}

      {/* Auth Modal */}
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}

      {/* Partner Share Modal */}
      {showPartnerShare && user && (
        <PartnerShareModal
          onClose={() => setShowPartnerShare(false)}
          shareCode={shareCode}
          sharedWith={sharedWith}
          onGenerateCode={generateShareCode}
          onAcceptInvite={acceptShareInvite}
          onRemoveShare={removeShare}
        />
      )}

      {/* PWA Install Banner */}
      <InstallBanner />
    </div>
  )
}

// ============================================
// APP WRAPPER WITH AUTH PROVIDER
// ============================================

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </LanguageProvider>
  )
}

export default App
