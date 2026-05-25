import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  BadgeCheck,
  Bot,
  BookOpenText,
  CalendarCheck,
  ChevronRight,
  CircleAlert,
  Flame,
  HeartHandshake,
  Home,
  IndianRupee,
  Leaf,
  Lock,
  LogOut,
  Moon,
  Pause,
  PenLine,
  Play,
  RotateCcw,
  Send,
  ShieldCheck,
  Sparkles,
  Target,
  TimerReset,
  TrendingUp,
  UserRound,
  Waves,
} from 'lucide-react';
import { appConfig } from './config';
import './styles.css';

const STORAGE_KEY = 'quittr-india-state-v1';
const rescueSeconds = 90;

const quotes = [
  {
    text: 'The mind becomes peaceful when it learns to turn away from temporary attraction and toward devotion.',
    label: 'Discipline',
  },
  {
    text: 'Do not fight impurity with shame. Replace it with remembrance, service, and a cleaner daily routine.',
    label: 'Purity',
  },
  {
    text: 'Every urge is temporary. Your real nature is stronger than the storm passing through the mind.',
    label: 'Self-control',
  },
  {
    text: 'Protect your eyes, protect your thoughts, and your life slowly becomes light from within.',
    label: 'Awareness',
  },
];

const roadmap = [
  {
    day: 1,
    title: 'Sankalp',
    detail: 'Take a clear pledge, remove triggers, and write your reason for quitting.',
  },
  {
    day: 3,
    title: 'Urge Control',
    detail: 'Use breath, cold water, prayer, walking, or call an accountability friend.',
  },
  {
    day: 7,
    title: 'Mind Reset',
    detail: 'Track patterns, avoid late-night scrolling, and build an evening routine.',
  },
  {
    day: 21,
    title: 'New Identity',
    detail: 'Replace secrecy with study, exercise, seva, and clean digital boundaries.',
  },
  {
    day: 40,
    title: 'Steady Bhakti',
    detail: 'Turn recovery into a lifestyle with satsang, journaling, and service.',
  },
];

const practiceSeeds = [
  { icon: Waves, key: 'breath', title: '2 min breath', value: '8 rounds' },
  { icon: BookOpenText, key: 'satsang', title: 'Satsang clip', value: '12 min' },
  { icon: PenLine, key: 'journal', title: 'Journal', value: '3 lines' },
  { icon: Moon, key: 'night', title: 'No phone after', value: '10:30 PM' },
];

const tabs = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'pledge', label: 'Pledge', icon: BadgeCheck },
  { id: 'ai', label: 'AI', icon: Bot },
  { id: 'meditate', label: 'Meditate', icon: Leaf },
  { id: 'more', label: 'More', icon: HeartHandshake },
];

const starterMessages = [
  {
    id: 'ai-seed',
    role: 'assistant',
    text: 'Radhe Radhe. Tell me what is happening right now: urge, guilt, stress, boredom, or relapse fear. I will give you a small next step.',
  },
];

const defaultState = {
  onboardingComplete: false,
  addictionScore: 0,
  addictionLevel: '',
  subscription: null,
  signedIn: false,
  authUser: null,
  lifetimeOfferSeen: false,
  quitDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
  dailyCost: 350,
  clarityBase: 28,
  relapses: [],
  pledges: [],
  completedPractices: [],
  communityJoined: false,
  aiMessages: starterMessages,
  journal: [
    {
      id: 'seed-1',
      createdAt: new Date().toISOString(),
      mood: 'Clear',
      trigger: 'Morning',
      note: 'Morning walk, no scrolling before bath.',
    },
  ],
};

function App() {
  const [appState, setAppState] = useStoredState();
  const [activeTab, setActiveTab] = useState(() => window.location.hash.replace('#', '') || 'home');
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [toast, setToast] = useState('');
  const [rescueActive, setRescueActive] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(rescueSeconds);
  const [journalDraft, setJournalDraft] = useState({ mood: 'Steady', trigger: '', note: '' });

  useEffect(() => {
    const onHashChange = () => setActiveTab(window.location.hash.replace('#', '') || 'home');
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => {
    if (!tabs.some((tab) => tab.id === activeTab)) {
      setActiveTab('home');
      window.location.hash = 'home';
    }
  }, [activeTab]);

  useEffect(() => {
    if (!rescueActive) return undefined;

    const timer = window.setInterval(() => {
      setSecondsLeft((current) => {
        if (current <= 1) {
          window.clearInterval(timer);
          setRescueActive(false);
          addJournalEntry({
            mood: 'Strong',
            trigger: 'Urge rescue',
            note: 'Completed the 90 second SOS reset.',
          });
          return rescueSeconds;
        }
        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [rescueActive]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(''), 2200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const todayKey = getDayKey(new Date());
  const daysClean = Math.max(1, daysBetween(new Date(appState.quitDate), new Date()) + 1);
  const moneySaved = Math.max(0, Math.round(daysClean * Number(appState.dailyCost || 0)));
  const pledgedToday = appState.pledges.includes(todayKey);
  const completedToday = appState.completedPractices.filter((item) => item.startsWith(todayKey)).length;
  const clarity = Math.min(100, appState.clarityBase + daysClean * 2 + completedToday * 3);
  const currentQuote = quotes[quoteIndex];

  const roadmapItems = roadmap.map((item) => {
    if (daysClean >= item.day) return { ...item, status: 'done' };
    const nextLocked = roadmap.find((step) => daysClean < step.day)?.day === item.day;
    return { ...item, status: nextLocked ? 'active' : 'locked' };
  });
  const progress = Math.round((roadmapItems.filter((item) => item.status === 'done').length / roadmap.length) * 100);

  function updateState(updater) {
    setAppState((current) => (typeof updater === 'function' ? updater(current) : updater));
  }

  function takePledge() {
    updateState((current) => ({
      ...current,
      pledges: current.pledges.includes(todayKey) ? current.pledges : [todayKey, ...current.pledges],
    }));
    notify(pledgedToday ? 'Pledge already completed today.' : 'Pledge saved for today.');
  }

  function togglePractice(key) {
    const entryKey = `${todayKey}:${key}`;
    const practice = practiceSeeds.find((item) => item.key === key);
    const alreadyDone = appState.completedPractices.includes(entryKey);
    updateState((current) => ({
      ...current,
      completedPractices: current.completedPractices.includes(entryKey)
        ? current.completedPractices.filter((item) => item !== entryKey)
        : [entryKey, ...current.completedPractices],
    }));
    notify(`${practice?.title || 'Practice'} ${alreadyDone ? 'marked incomplete' : 'completed'}.`);
  }

  function startRescue() {
    if (rescueActive) {
      setRescueActive(false);
      notify('SOS reset paused.');
      return;
    }
    setSecondsLeft(rescueSeconds);
    setRescueActive(true);
    notify('SOS reset started.');
  }

  function addJournalEntry(entry) {
    const note = entry.note.trim();
    if (!note) return;

    updateState((current) => ({
      ...current,
      journal: [
        {
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          mood: entry.mood,
          trigger: entry.trigger.trim() || 'General',
          note,
        },
        ...current.journal,
      ].slice(0, 30),
    }));
    notify('Journal entry saved.');
  }

  function submitJournal(event) {
    event.preventDefault();
    addJournalEntry(journalDraft);
    setJournalDraft({ mood: 'Steady', trigger: '', note: '' });
  }

  function recordRelapse() {
    updateState((current) => ({
      ...current,
      quitDate: new Date().toISOString(),
      relapses: [new Date().toISOString(), ...current.relapses],
    }));
    addJournalEntry({
      mood: 'Reset',
      trigger: 'Relapse logged',
      note: 'Streak restarted. Review the trigger and begin again without shame.',
    });
    notify('Relapse logged. Streak restarted.');
  }

  function resetAll() {
    updateState({
      ...defaultState,
      quitDate: new Date().toISOString(),
      journal: [],
    });
    setShowSettings(false);
    notify('App reset. Start the journey again.');
  }

  function loginWithGoogle() {
    updateState((current) => ({
      ...current,
      signedIn: true,
      authUser: {
        name: 'Dhruv',
        email: 'dhruv@example.com',
        provider: appConfig.googleOauthProvider,
        signedInAt: new Date().toISOString(),
      },
    }));
    notify('Logged in with Google.');
  }

  function logout() {
    updateState((current) => ({
      ...current,
      signedIn: false,
      authUser: null,
    }));
    setShowSettings(false);
    window.location.hash = 'home';
    notify('Logged out.');
  }

  function notify(message) {
    setToast(message);
  }

  function joinCommunity() {
    updateState((current) => ({
      ...current,
      communityJoined: true,
    }));
    notify('Telegram community marked as joined.');
  }

  function addAiMessage(text) {
    const cleanText = text.trim();
    if (!cleanText) return;
    const answer = buildAiReply(cleanText, {
      daysClean,
      pledgedToday,
      completedToday,
      level: appState.addictionLevel,
    });

    updateState((current) => ({
      ...current,
      aiMessages: [
        ...(current.aiMessages || starterMessages),
        { id: crypto.randomUUID(), role: 'user', text: cleanText },
        { id: crypto.randomUUID(), role: 'assistant', text: answer },
      ].slice(-18),
    }));
    notify('AI guide replied.');
  }

  const statCards = [
    { icon: Flame, label: 'Streak', value: `${daysClean} day${daysClean === 1 ? '' : 's'}`, tone: 'sun' },
    { icon: IndianRupee, label: 'Saved', value: formatRupees(moneySaved), tone: 'mint' },
    { icon: TrendingUp, label: 'Clarity', value: `${clarity}%`, tone: 'blue' },
    { icon: ShieldCheck, label: 'Relapses', value: String(appState.relapses.length), tone: 'rose' },
  ];

  if (!appState.onboardingComplete) {
    return (
      <AppFrame>
        <OnboardingScreen
          onComplete={({ score, level }) =>
            updateState((current) => ({
              ...current,
              onboardingComplete: true,
              addictionScore: score,
              addictionLevel: level,
            }))
          }
          onNotify={notify}
        />
      </AppFrame>
    );
  }

  if (!appState.signedIn) {
    return (
      <AppFrame>
        <SigninScreen onSignin={loginWithGoogle} />
      </AppFrame>
    );
  }

  if (!appState.subscription) {
    return (
      <AppFrame>
        <PaywallScreen
          level={appState.addictionLevel}
          score={appState.addictionScore}
          onChoose={(plan) => {
            updateState((current) => ({
              ...current,
              subscription: {
                ...plan,
                purchasedAt: new Date().toISOString(),
                status: 'active',
              },
            }));
            notify(`${plan.label} plan activated. No trial period applied.`);
          }}
        />
      </AppFrame>
    );
  }

  if (!appState.lifetimeOfferSeen) {
    return (
      <AppFrame>
        <LifetimeOfferScreen
          onAccept={() =>
            updateState((current) => ({
              ...current,
              subscription: { type: 'lifetime', label: 'Lifetime', price: 2150 },
              lifetimeOfferSeen: true,
            }))
          }
          onSkip={() =>
            updateState((current) => ({
              ...current,
              lifetimeOfferSeen: true,
            }))
          }
          onNotify={notify}
        />
      </AppFrame>
    );
  }

  return (
    <main className="app-shell">
      <section className="phone-frame" aria-label="Quittr India app">
        <div className="content-scroll">
          <header className="topbar">
            <div>
              <p className="eyebrow">Quittr India</p>
              <h1>Premanand Ji Recovery Path</h1>
            </div>
            <button className="icon-button" aria-label="Open protection settings" onClick={() => setShowSettings(true)}>
              <Lock size={19} />
            </button>
          </header>

          {activeTab === 'home' && (
            <>
              <GuruPanel quote={currentQuote} onNextQuote={() => setQuoteIndex((current) => (current + 1) % quotes.length)} />

              <OpeningFocus
                level={appState.addictionLevel}
                score={appState.addictionScore}
                pledgedToday={pledgedToday}
                rescueActive={rescueActive}
                onPledge={takePledge}
                onStartSos={startRescue}
              />

              <section className="stats-grid" aria-label="Recovery stats">
                {statCards.map((stat) => (
                  <Stat {...stat} key={stat.label} />
                ))}
              </section>

              <section className="action-row">
                <button className={pledgedToday ? 'primary-action complete' : 'primary-action'} onClick={takePledge}>
                  <BadgeCheck size={18} />
                  {pledgedToday ? 'Pledge taken today' : 'Take today pledge'}
                </button>
                <button className={rescueActive ? 'sos-action active' : 'sos-action'} onClick={startRescue}>
                  {rescueActive ? <Pause size={18} /> : <Play size={18} />}
                  SOS
                </button>
              </section>

              {rescueActive && <UrgeRescue secondsLeft={secondsLeft} />}

              <AiPreview onOpen={() => (window.location.hash = 'ai')} />

              <PracticePanel completedPractices={appState.completedPractices} todayKey={todayKey} onToggle={togglePractice} />
              <JournalPanel entries={appState.journal} draft={journalDraft} onDraftChange={setJournalDraft} onSubmit={submitJournal} />
            </>
          )}

          {activeTab === 'pledge' && <RoadmapPanel items={roadmapItems} progress={progress} daysClean={daysClean} />}

          {activeTab === 'ai' && (
            <AiPanel
              messages={appState.aiMessages || starterMessages}
              onSend={addAiMessage}
              onStartSos={startRescue}
              onPledge={takePledge}
              onMeditate={() => {
                window.location.hash = 'meditate';
                notify('Opened meditation tools.');
              }}
            />
          )}

          {activeTab === 'meditate' && (
            <SatsangPanel
              quote={currentQuote}
              onNextQuote={() => setQuoteIndex((current) => (current + 1) % quotes.length)}
              completedPractices={appState.completedPractices}
              todayKey={todayKey}
              onToggle={togglePractice}
            />
          )}

          {activeTab === 'more' && (
            <MorePanel
              onStartSos={startRescue}
              onRelapse={recordRelapse}
              relapses={appState.relapses}
              rescueActive={rescueActive}
              secondsLeft={secondsLeft}
              communityJoined={appState.communityJoined}
              onJoinCommunity={joinCommunity}
              telegramUrl={appConfig.telegramChannelUrl}
              subscription={appState.subscription}
              authUser={appState.authUser}
              onLogout={logout}
            />
          )}
        </div>

        <nav className="bottom-nav" aria-label="Primary navigation">
          {tabs.map(({ id, label, icon: Icon }) => (
            <a className={activeTab === id ? 'active' : ''} href={`#${id}`} aria-label={label} key={id}>
              <Icon size={19} />
              <span>{label}</span>
            </a>
          ))}
        </nav>

        {showSettings && (
          <SettingsModal
            state={appState}
            onClose={() => setShowSettings(false)}
            onSave={(nextState) => {
              updateState(nextState);
              setShowSettings(false);
              notify('Settings saved.');
            }}
            onReset={resetAll}
            onLogout={logout}
          />
        )}
        {toast && <div className="toast" role="status">{toast}</div>}
      </section>
    </main>
  );
}

function AppFrame({ children }) {
  return (
    <main className="app-shell">
      <section className="phone-frame" aria-label="Quittr India app">
        <div className="content-scroll no-nav">{children}</div>
      </section>
    </main>
  );
}

function OnboardingScreen({ onComplete }) {
  const questions = [
    {
      id: 'frequency',
      title: 'How often do urges disturb your day?',
      options: [
        { label: 'Rarely', value: 1 },
        { label: 'Few times weekly', value: 2 },
        { label: 'Almost daily', value: 3 },
      ],
    },
    {
      id: 'control',
      title: 'When an urge starts, how hard is it to stop?',
      options: [
        { label: 'I can stop', value: 1 },
        { label: 'It takes effort', value: 2 },
        { label: 'Very hard', value: 3 },
      ],
    },
    {
      id: 'impact',
      title: 'What has it affected most?',
      options: [
        { label: 'Focus', value: 1 },
        { label: 'Confidence', value: 2 },
        { label: 'Relationships or faith', value: 3 },
      ],
    },
  ];
  const [answers, setAnswers] = useState({ frequency: 2, control: 2, impact: 2 });
  const score = Object.values(answers).reduce((total, value) => total + Number(value), 0);
  const level = score <= 4 ? 'Mild' : score <= 7 ? 'Moderate' : 'High';

  return (
    <section className="journey-screen">
      <p className="eyebrow">First-time setup</p>
      <h1>Let us understand your pattern</h1>
      <p className="panel-copy">Answer three questions so the app can personalize your recovery path.</p>
      <div className="quiz-list">
        {questions.map((question) => (
          <article className="quiz-card" key={question.id}>
            <h2>{question.title}</h2>
            <div className="segmented-options">
              {question.options.map((option) => (
                <button
                  className={answers[question.id] === option.value ? 'selected' : ''}
                  onClick={() => setAnswers({ ...answers, [question.id]: option.value })}
                  key={option.label}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </article>
        ))}
      </div>
      <div className="result-card">
        <span>{score}/9</span>
        <h2>{level} addiction risk</h2>
        <p>Your plan will focus on pledge, meditation, reset tools, and daily accountability.</p>
      </div>
      <button className="primary-action wide" onClick={() => onComplete({ score, level })}>Continue</button>
    </section>
  );
}

function PaywallScreen({ level, score, onChoose }) {
  return (
    <section className="journey-screen">
      <p className="eyebrow">Hard paywall</p>
      <h1>{level || 'Moderate'} recovery path</h1>
      <p className="panel-copy">Your score is {score}/9. There is no free trial. Choose a paid plan to unlock tracking, pledge, meditation, reset tools, AI guide, and roadmap progress.</p>
      <div className="plan-grid">
        <button onClick={() => onChoose({ type: 'monthly', label: 'Monthly', price: 1050 })}>
          <span>Monthly</span>
          <strong>₹1,050</strong>
          <small>pay now - no trial</small>
        </button>
        <button className="highlight" onClick={() => onChoose({ type: 'yearly', label: 'Yearly', price: 3000 })}>
          <span>Yearly</span>
          <strong>₹3,000</strong>
          <small>best value - no trial</small>
        </button>
      </div>
    </section>
  );
}

function SigninScreen({ onSignin }) {
  const providerLabel = appConfig.googleOauthProvider === 'firebase' ? 'Firebase Auth' : 'Google Identity Services';

  return (
    <section className="journey-screen center-screen">
      <div className="portrait-mark large">
        <Sparkles size={34} />
      </div>
      <p className="eyebrow">Secure your progress</p>
      <h1>Sign in to continue</h1>
      <p className="panel-copy">Google login is required before payment. Provider target: {providerLabel}.</p>
      <div className="auth-status">
        <UserRound size={18} />
        <span>{appConfig.googleOauthClientId ? 'OAuth client configured' : 'OAuth client placeholder set in env'}</span>
      </div>
      <button className="google-button" onClick={onSignin}>Continue with Google</button>
    </section>
  );
}

function LifetimeOfferScreen({ onAccept, onSkip }) {
  return (
    <section className="journey-screen center-screen">
      <p className="eyebrow">Once in a lifetime offer</p>
      <h1>Lifetime access for ₹2,150</h1>
      <p className="panel-copy">Keep the whole recovery system forever: pledge, meditation, reset, roadmap, journal, and community access.</p>
      <button className="primary-action wide" onClick={onAccept}>Claim lifetime</button>
      <button className="ghost-action" onClick={onSkip}>Continue with current plan</button>
    </section>
  );
}

function OpeningFocus({ level, score, pledgedToday, rescueActive, onPledge, onStartSos }) {
  return (
    <section className="opening-focus">
      <div>
        <p className="section-kicker">Opening check-in</p>
        <h2>{level || 'Moderate'} risk · {score || 0}/9 score</h2>
        <p>{pledgedToday ? 'Your pledge is complete. Keep the phone boundaries clean today.' : 'Start with pledge before anything else.'}</p>
      </div>
      <div className="opening-actions">
        <button onClick={onPledge}>
          <BadgeCheck size={16} />
          Pledge
        </button>
        <button onClick={onStartSos}>
          {rescueActive ? <Pause size={16} /> : <Play size={16} />}
          Reset
        </button>
      </div>
    </section>
  );
}

function AiPreview({ onOpen }) {
  return (
    <section className="ai-preview">
      <div className="ai-orb">
        <Bot size={22} />
      </div>
      <div>
        <p className="section-kicker">AI Guide</p>
        <h2>Prem Path AI</h2>
        <p>Ask for help with urges, guilt, triggers, meditation, or relapse recovery.</p>
      </div>
      <button onClick={onOpen} aria-label="Open Prem Path AI">
        <ChevronRight size={18} />
      </button>
    </section>
  );
}

function AiPanel({ messages, onSend, onStartSos, onPledge, onMeditate }) {
  const [draft, setDraft] = useState('');
  const prompts = ['I have an urge', 'I relapsed', 'I feel guilty', 'Give me a meditation'];

  function submit(event) {
    event.preventDefault();
    onSend(draft);
    setDraft('');
  }

  return (
    <section className="ai-panel page-panel">
      <div className="section-heading">
        <div>
          <p className="section-kicker">AI Guide</p>
          <h2>Prem Path AI</h2>
        </div>
        <Bot size={22} />
      </div>
      <p className="panel-copy">A local recovery coach inspired by the app's Premanand ji centered path.</p>

      <div className="ai-quick-actions">
        <button onClick={onPledge}>
          <BadgeCheck size={16} />
          Pledge
        </button>
        <button onClick={onStartSos}>
          <TimerReset size={16} />
          SOS
        </button>
        <button onClick={onMeditate}>
          <Leaf size={16} />
          Meditate
        </button>
      </div>

      <div className="prompt-chips">
        {prompts.map((prompt) => (
          <button
            key={prompt}
            onClick={() => {
              onSend(prompt);
              setDraft('');
            }}
          >
            {prompt}
          </button>
        ))}
      </div>

      <div className="chat-log" aria-live="polite">
        {messages.map((message) => (
          <article className={`chat-message ${message.role}`} key={message.id}>
            <span>{message.role === 'assistant' ? 'AI' : 'You'}</span>
            <p>{message.text}</p>
          </article>
        ))}
      </div>

      <form className="ai-form" onSubmit={submit}>
        <input
          placeholder="Ask Prem Path AI..."
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
        />
        <button type="submit" aria-label="Send message">
          <Send size={18} />
        </button>
      </form>
    </section>
  );
}

function GuruPanel({ quote, onNextQuote }) {
  return (
    <section className="guru-panel">
      <div className="halo-art" aria-hidden="true">
        <div className="portrait-mark">
          <Sparkles size={28} />
        </div>
      </div>
      <div className="quote-card">
        <span>{quote.label}</span>
        <p>{quote.text}</p>
        <button onClick={onNextQuote}>
          Next quote
          <ChevronRight size={16} />
        </button>
      </div>
    </section>
  );
}

function Stat({ icon: Icon, label, value, tone }) {
  return (
    <article className={`stat-card ${tone}`}>
      <Icon size={18} />
      <p>{label}</p>
      <strong>{value}</strong>
    </article>
  );
}

function UrgeRescue({ secondsLeft }) {
  return (
    <section className="urge-box" aria-live="polite">
      <div>
        <p className="section-kicker">Urge rescue</p>
        <h2>Hold steady for {secondsLeft} seconds</h2>
        <p>Put the phone down, breathe slowly, drink water, and repeat your sankalp once.</p>
      </div>
      <div className="timer-ring">
        <TimerReset size={26} />
        <strong>{formatTimer(secondsLeft)}</strong>
      </div>
    </section>
  );
}

function RoadmapPanel({ items, progress, daysClean }) {
  return (
    <section className="roadmap-panel page-panel">
      <div className="section-heading">
        <div>
          <p className="section-kicker">Roadmap</p>
          <h2>40-day self-control yatra</h2>
        </div>
        <span>{progress}%</span>
      </div>
      <p className="panel-copy">You are on day {daysClean}. Milestones unlock automatically from your quit date.</p>
      <div className="progress-bar">
        <div style={{ width: `${progress}%` }} />
      </div>
      <div className="roadmap-list">
        {items.map((item) => (
          <article className={`roadmap-item ${item.status}`} key={item.day}>
            <div className="roadmap-dot">
              {item.status === 'locked' ? <Lock size={14} /> : <CalendarCheck size={14} />}
            </div>
            <div>
              <span>Day {item.day}</span>
              <h3>{item.title}</h3>
              <p>{item.detail}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function PracticePanel({ completedPractices, todayKey, onToggle }) {
  return (
    <section className="practice-panel">
      <div className="section-heading">
        <div>
          <p className="section-kicker">Daily discipline</p>
          <h2>Today&apos;s reset stack</h2>
        </div>
        <Target size={21} />
      </div>
      <div className="practice-grid">
        {practiceSeeds.map(({ icon: Icon, key, title, value }) => {
          const done = completedPractices.includes(`${todayKey}:${key}`);
          return (
            <button className={done ? 'practice-card done' : 'practice-card'} onClick={() => onToggle(key)} key={key}>
              <Icon size={18} />
              <p>{title}</p>
              <strong>{done ? 'Done' : value}</strong>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function JournalPanel({ entries, draft, onDraftChange, onSubmit }) {
  return (
    <section className="journal-panel">
      <div className="section-heading">
        <div>
          <p className="section-kicker">Tracker</p>
          <h2>Mood and trigger journal</h2>
        </div>
        <PenLine size={20} />
      </div>

      <form className="journal-form" onSubmit={onSubmit}>
        <select value={draft.mood} onChange={(event) => onDraftChange({ ...draft, mood: event.target.value })}>
          <option>Steady</option>
          <option>Clear</option>
          <option>Triggered</option>
          <option>Strong</option>
          <option>Reset</option>
        </select>
        <input
          placeholder="Trigger"
          value={draft.trigger}
          onChange={(event) => onDraftChange({ ...draft, trigger: event.target.value })}
        />
        <textarea
          placeholder="What happened and what helped?"
          value={draft.note}
          onChange={(event) => onDraftChange({ ...draft, note: event.target.value })}
        />
        <button type="submit">Save entry</button>
      </form>

      {entries.length === 0 && <p className="empty-state">No entries yet. Add your first trigger note above.</p>}

      {entries.map((entry) => (
        <article className="journal-entry" key={entry.id}>
          <time>{formatEntryTime(entry.createdAt)}</time>
          <div>
            <h3>{entry.mood} · {entry.trigger}</h3>
            <p>{entry.note}</p>
          </div>
        </article>
      ))}
    </section>
  );
}

function SatsangPanel({ quote, onNextQuote, completedPractices, todayKey, onToggle }) {
  return (
    <>
      <GuruPanel quote={quote} onNextQuote={onNextQuote} />
      <section className="practice-panel page-panel">
        <div className="section-heading">
          <div>
            <p className="section-kicker">Satsang</p>
            <h2>Spiritual replacement plan</h2>
          </div>
          <Leaf size={21} />
        </div>
        <p className="panel-copy">
          Use this tab when urges are low but discipline needs maintenance. Complete the stack once daily.
        </p>
        <PracticePanel completedPractices={completedPractices} todayKey={todayKey} onToggle={onToggle} />
      </section>
    </>
  );
}

function MorePanel({
  onStartSos,
  onRelapse,
  relapses,
  rescueActive,
  secondsLeft,
  communityJoined,
  onJoinCommunity,
  telegramUrl,
  subscription,
  authUser,
  onLogout,
}) {
  return (
    <>
      <section className="support-panel page-panel">
        <div className="section-heading">
          <div>
            <p className="section-kicker">More</p>
            <h2>Community and reset tools</h2>
          </div>
          <HeartHandshake size={21} />
        </div>
        <div className="support-actions">
          <button className="primary-action" onClick={onStartSos}>
            {rescueActive ? <Pause size={18} /> : <Play size={18} />}
            {rescueActive ? 'Pause SOS' : 'Start SOS reset'}
          </button>
          <button className="danger-action" onClick={onRelapse}>
            <CircleAlert size={18} />
            Log relapse
          </button>
        </div>
        <a
          className={communityJoined ? 'telegram-action joined' : 'telegram-action'}
          href={telegramUrl}
          target="_blank"
          rel="noreferrer"
          onClick={onJoinCommunity}
        >
          {communityJoined ? 'Telegram joined' : 'Join Telegram group'}
          <ChevronRight size={16} />
        </a>
        {rescueActive && <UrgeRescue secondsLeft={secondsLeft} />}
        <div className="account-card">
          <div>
            <p className="section-kicker">Account</p>
            <h3>{authUser?.name || 'Google user'}</h3>
            <p>{authUser?.email || 'Signed in with Google'}</p>
          </div>
          <button className="logout-action" onClick={onLogout}>
            <LogOut size={16} />
            Logout
          </button>
        </div>
        <div className="account-card">
          <div>
            <p className="section-kicker">Subscription</p>
            <h3>{subscription?.label || 'No plan'}</h3>
            <p>{subscription ? `${formatRupees(subscription.price)} - ${subscription.status || 'active'} - no trial` : 'Hard paywall active'}</p>
          </div>
        </div>
        <div className="support-list">
          <h3>Emergency steps</h3>
          <p>1. Stand up and leave the room.</p>
          <p>2. Put the phone away for 10 minutes.</p>
          <p>3. Drink water, breathe, and message an accountability person.</p>
          <p>4. Open Satsang and complete one practice.</p>
        </div>
      </section>

      <section className="journal-panel">
        <div className="section-heading">
          <div>
            <p className="section-kicker">History</p>
            <h2>Relapse log</h2>
          </div>
          <RotateCcw size={20} />
        </div>
        {relapses.length === 0 && <p className="empty-state">No relapse logged. Keep protecting the streak.</p>}
        {relapses.map((date) => (
          <article className="journal-entry" key={date}>
            <time>{formatEntryTime(date)}</time>
            <div>
              <h3>Restarted</h3>
              <p>Streak reset from this point. Learn the trigger and continue.</p>
            </div>
          </article>
        ))}
      </section>
    </>
  );
}

function SettingsModal({ state, onClose, onSave, onReset, onLogout }) {
  const [draft, setDraft] = useState({
    quitDate: state.quitDate.slice(0, 10),
    dailyCost: state.dailyCost,
  });

  function submit(event) {
    event.preventDefault();
    onSave({
      ...state,
      quitDate: new Date(`${draft.quitDate}T00:00:00`).toISOString(),
      dailyCost: Number(draft.dailyCost || 0),
    });
  }

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Recovery settings">
      <form className="settings-modal" onSubmit={submit}>
        <div className="section-heading">
          <div>
            <p className="section-kicker">Settings</p>
            <h2>Your recovery baseline</h2>
          </div>
          <button className="mini-button" type="button" onClick={onClose}>×</button>
        </div>
        <label>
          Quit start date
          <input
            type="date"
            value={draft.quitDate}
            onChange={(event) => setDraft({ ...draft, quitDate: event.target.value })}
          />
        </label>
        <label>
          Daily money saved
          <input
            type="number"
            min="0"
            value={draft.dailyCost}
            onChange={(event) => setDraft({ ...draft, dailyCost: event.target.value })}
          />
        </label>
        <div className="settings-actions">
          <button className="primary-action" type="submit">Save settings</button>
          <button className="ghost-action" type="button" onClick={onLogout}>Logout</button>
          <button className="danger-action span-all" type="button" onClick={onReset}>Reset app</button>
        </div>
      </form>
    </div>
  );
}

function useStoredState() {
  const [state, setState] = useState(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      return saved ? { ...defaultState, ...JSON.parse(saved) } : defaultState;
    } catch {
      return defaultState;
    }
  });

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  return [state, setState];
}

function getDayKey(date) {
  return date.toISOString().slice(0, 10);
}

function daysBetween(start, end) {
  const startDay = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate());
  const endDay = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate());
  return Math.floor((endDay - startDay) / 86400000);
}

function formatRupees(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
}

function formatTimer(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainder = String(seconds % 60).padStart(2, '0');
  return `${minutes}:${remainder}`;
}

function formatEntryTime(value) {
  return new Intl.DateTimeFormat('en-IN', {
    hour: 'numeric',
    minute: '2-digit',
    day: '2-digit',
    month: 'short',
  }).format(new Date(value));
}

function buildAiReply(message, context) {
  const text = message.toLowerCase();
  const prefix = `You are on day ${context.daysClean} with ${context.level || 'moderate'} risk.`;

  if (text.includes('urge') || text.includes('trigger') || text.includes('tempt')) {
    return `${prefix} Start SOS now: stand up, drink water, breathe for 90 seconds, and move to a public place. Do not negotiate with the urge.`;
  }

  if (text.includes('relapse') || text.includes('failed') || text.includes('slip')) {
    return 'Reset without shame. Write the trigger, remove the same condition for tomorrow, and take the next pledge. One fall is data, not your identity.';
  }

  if (text.includes('guilt') || text.includes('shame') || text.includes('bad')) {
    return 'Guilt should become correction, not self-hate. Take a bath or walk, say your sankalp once, and do one clean action immediately.';
  }

  if (text.includes('meditat') || text.includes('focus') || text.includes('calm')) {
    return 'Try this: inhale for 4 counts, hold for 2, exhale for 6. Repeat 8 rounds, then listen to one satsang clip before touching social media.';
  }

  if (!context.pledgedToday) {
    return `${prefix} Your next best step is simple: take today's pledge, complete one practice, and write a one-line journal entry.`;
  }

  return `${prefix} Stay steady. Protect your eyes, avoid isolation, keep the phone away at night, and use SOS at the first sign of bargaining.`;
}

createRoot(document.getElementById('root')).render(<App />);
