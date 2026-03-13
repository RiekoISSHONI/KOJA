import { useState, useEffect } from 'react'

// ============================================
// MENSTRUAL CYCLE PHASES DATA (Dr. Mindy Pelz Research)
// ============================================

const CYCLE_PHASES = {
  menstruation: {
    name: 'Menstruation',
    days: [1, 2, 3, 4, 5],
    color: 'bg-red-100 border-red-400',
    dotColor: 'bg-red-500',
    textColor: 'text-red-700',
    emoji: '🌙',
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
  },
  follicular: {
    name: 'Follicular (Power Phase)',
    days: [6, 7, 8, 9, 10],
    color: 'bg-green-100 border-green-400',
    dotColor: 'bg-green-500',
    textColor: 'text-green-700',
    emoji: '🌱',
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
  },
  ovulation: {
    name: 'Ovulation (Manifestation)',
    days: [11, 12, 13, 14, 15],
    color: 'bg-pink-100 border-pink-400',
    dotColor: 'bg-pink-500',
    textColor: 'text-pink-700',
    emoji: '🌸',
    description: 'Peak Energy & Fertility',
    forHer: {
      title: 'Superpower Phase',
      tips: [
        'Estrogen, testosterone, and progesterone all peak - you\'re at your best!',
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
        'Plan romantic activities - she\'s feeling social',
        'Great time for important relationship talks',
        'Physical attraction and intimacy peak',
        'Be aware: this is her fertile window',
      ],
    },
  },
  earlyLuteal: {
    name: 'Early Luteal',
    days: [16, 17, 18, 19],
    color: 'bg-yellow-100 border-yellow-400',
    dotColor: 'bg-yellow-500',
    textColor: 'text-yellow-700',
    emoji: '🍂',
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
  },
  lateLuteal: {
    name: 'Late Luteal (Nurture Phase)',
    days: [20, 21, 22, 23, 24, 25, 26, 27, 28],
    color: 'bg-purple-100 border-purple-400',
    dotColor: 'bg-purple-500',
    textColor: 'text-purple-700',
    emoji: '🦋',
    description: 'Rest & Nurture',
    forHer: {
      title: 'Nurture Phase',
      tips: [
        'Carb cravings are NORMAL - your body needs them for progesterone',
        'This is NOT a lack of discipline - it\'s biology',
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
// MAIN APP
// ============================================

function App() {
  const [lastPeriodStart, setLastPeriodStart] = useState(() => {
    const saved = localStorage.getItem('cycleLastPeriod')
    return saved || ''
  })
  const [cycleLength, setCycleLength] = useState(() => {
    const saved = localStorage.getItem('cycleLengthDays')
    return saved ? parseInt(saved) : 28
  })
  const [periodLength, setPeriodLength] = useState(() => {
    const saved = localStorage.getItem('periodLengthDays')
    return saved ? parseInt(saved) : 5
  })
  const [viewMode, setViewMode] = useState('her')
  const [selectedDate, setSelectedDate] = useState(null)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [showSettings, setShowSettings] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [showNotes, setShowNotes] = useState(false)
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem('cycleNotes')
    return saved ? JSON.parse(saved) : {}
  })
  const [partnerEmail, setPartnerEmail] = useState(() => {
    return localStorage.getItem('partnerEmail') || ''
  })
  const [exportSuccess, setExportSuccess] = useState('')

  useEffect(() => {
    if (lastPeriodStart) localStorage.setItem('cycleLastPeriod', lastPeriodStart)
  }, [lastPeriodStart])

  useEffect(() => {
    localStorage.setItem('cycleLengthDays', cycleLength.toString())
  }, [cycleLength])

  useEffect(() => {
    localStorage.setItem('periodLengthDays', periodLength.toString())
  }, [periodLength])

  useEffect(() => {
    localStorage.setItem('cycleNotes', JSON.stringify(notes))
  }, [notes])

  useEffect(() => {
    if (partnerEmail) localStorage.setItem('partnerEmail', partnerEmail)
  }, [partnerEmail])

  const getCycleDay = (date) => {
    if (!lastPeriodStart) return null
    const start = new Date(lastPeriodStart)
    const target = new Date(date)
    const diffTime = target - start
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    if (diffDays < 0) return null
    return (diffDays % cycleLength) + 1
  }

  const getPhaseForDay = (cycleDay) => {
    if (!cycleDay) return null
    if (cycleDay <= periodLength) return CYCLE_PHASES.menstruation
    if (cycleDay <= 10) return CYCLE_PHASES.follicular
    if (cycleDay <= 15) return CYCLE_PHASES.ovulation
    if (cycleDay <= 19) return CYCLE_PHASES.earlyLuteal
    return CYCLE_PHASES.lateLuteal
  }

  const today = new Date()
  const todayCycleDay = getCycleDay(today)
  const todayPhase = getPhaseForDay(todayCycleDay)

  const getNextPeriod = () => {
    if (!lastPeriodStart) return null
    const start = new Date(lastPeriodStart)
    const now = new Date()
    let nextPeriod = new Date(start)
    while (nextPeriod <= now) {
      nextPeriod.setDate(nextPeriod.getDate() + cycleLength)
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
      days.push({ date, day: d, cycleDay, phase, isToday: date.toDateString() === today.toDateString(), hasNote: !!notes[dateStr] })
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
        { name: 'Menstruation', startDay: 1, endDay: periodLength },
        { name: 'Follicular (Power Phase)', startDay: periodLength + 1, endDay: 10 },
        { name: 'Ovulation', startDay: 11, endDay: 15 },
        { name: 'Early Luteal', startDay: 16, endDay: 19 },
        { name: 'Late Luteal (Nurture Phase)', startDay: 20, endDay: cycleLength },
      ]

      phases.forEach(phase => {
        const phaseStart = new Date(currentCycleStart)
        phaseStart.setDate(phaseStart.getDate() + phase.startDay - 1)
        const phaseEnd = new Date(currentCycleStart)
        phaseEnd.setDate(phaseEnd.getDate() + phase.endDay - 1)

        if (phaseEnd >= new Date()) {
          const phaseData = Object.values(CYCLE_PHASES).find(p => p.name.includes(phase.name.split(' ')[0]))
          const tips = forPartner && phaseData ? phaseData.forHim.tips.slice(0, 2).join('. ') : (phaseData ? phaseData.forHer.tips.slice(0, 2).join('. ') : '')
          events.push({
            uid: `cycle-${currentCycleStart.getTime()}-${phase.name}@cycle-tracker.app`,
            start: phaseStart, end: phaseEnd,
            summary: forPartner ? `Partner's ${phase.name}` : phase.name,
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
          <h1 className="text-xl font-bold">Cycle Tracker</h1>
          <div className="flex gap-2">
            <button onClick={() => setShowSettings(true)} className="p-2 hover:bg-white/20 rounded-lg transition">
              <CalendarIcon className="w-5 h-5" />
            </button>
            <button onClick={() => setShowShareModal(true)} className="p-2 hover:bg-white/20 rounded-lg transition">
              <ShareIcon />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto pb-8">
        {/* View Toggle */}
        <div className="p-4">
          <div className="flex rounded-xl bg-gray-200 p-1">
            <button onClick={() => setViewMode('her')} className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${viewMode === 'her' ? 'bg-white text-pink-600 shadow-sm' : 'text-gray-500'}`}>For Her</button>
            <button onClick={() => setViewMode('him')} className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${viewMode === 'him' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'}`}>For Him</button>
          </div>
        </div>

        {/* Status Card */}
        {lastPeriodStart && todayPhase ? (
          <div className={`mx-4 p-4 rounded-2xl border-2 ${todayPhase.color}`}>
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-sm text-gray-500">Today - Day {todayCycleDay}</p>
                <h2 className={`text-lg font-bold ${todayPhase.textColor}`}>{todayPhase.emoji} {todayPhase.name}</h2>
              </div>
              {nextPeriod && daysUntilPeriod > 0 && (
                <div className="text-right">
                  <p className="text-sm text-gray-500">Next period in</p>
                  <p className="text-lg font-bold text-gray-800">{daysUntilPeriod} days</p>
                </div>
              )}
            </div>
            <p className="text-sm text-gray-600">{todayPhase.description}</p>
          </div>
        ) : (
          <div className="mx-4 p-4 rounded-2xl border-2 border-gray-200 bg-white">
            <p className="text-center text-gray-500">Set your last period start date to begin tracking</p>
            <button onClick={() => setShowSettings(true)} className="w-full mt-3 py-2 bg-pink-500 text-white rounded-xl font-medium">Set Up Cycle</button>
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
            {Object.values(CYCLE_PHASES).map((phase, i) => (
              <div key={i} className="flex items-center gap-1">
                <div className={`w-3 h-3 rounded-full ${phase.dotColor}`} />
                <span className="text-xs text-gray-500">{phase.name.split(' ')[0]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tips */}
        {todayPhase && (
          <div className="mx-4 mt-4 bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-gray-800">{viewMode === 'her' ? todayPhase.forHer.title : todayPhase.forHim.title}</h3>
              <button onClick={() => setShowNotes(true)} className="flex items-center gap-1 text-sm text-pink-500">
                <NoteIcon className="w-4 h-4" /> Notes
              </button>
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
          <p className="text-xs text-gray-500 text-center">Tips based on Dr. Mindy Pelz's research on women's hormonal cycles.</p>
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
              <h3 className="text-lg font-bold text-gray-800">Share & Export</h3>
              <button onClick={() => setShowShareModal(false)} className="text-gray-400 hover:text-gray-600"><XIcon className="w-6 h-6" /></button>
            </div>
            {exportSuccess && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-xl text-sm">{exportSuccess}</div>}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Partner's Email</label>
              <input type="email" value={partnerEmail} onChange={(e) => setPartnerEmail(e.target.value)} placeholder="partner@email.com" className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500" />
              <p className="text-xs text-gray-500 mt-1">Save for your records - export their calendar below</p>
            </div>
            <div className="space-y-3">
              <p className="text-sm font-medium text-gray-700">Export to Calendar</p>
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

      {showNotes && <NotesModal notes={notes} onSaveNote={handleSaveNote} onClose={() => setShowNotes(false)} selectedDate={selectedDate?.date || today} />}
      {selectedDate && <DayDetailModal dayInfo={selectedDate} viewMode={viewMode} notes={notes} onSaveNote={handleSaveNote} onClose={() => setSelectedDate(null)} />}

      {/* PWA Install Banner */}
      <InstallBanner />
    </div>
  )
}

export default App
