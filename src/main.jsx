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
import { appConfig, isFirebaseConfigured, isGoogleSignInReady } from './config';
import {
  completeRedirectSignIn,
  firebaseSignOut,
  getGoogleOAuthRedirectUri,
  shouldUseGoogleRedirect,
  signInWithGoogle as firebaseGoogleSignIn,
  subscribeToAuthChanges,
} from './firebase';
import {
  isSupabaseConfigured,
  mapSupabaseUser,
  signInWithEmail,
  signUpWithEmail,
  supabaseSignOut,
  subscribeToSupabaseAuth,
} from './lib/supabase';
import './styles.css';

const STORAGE_KEY = 'reclaim-india-state-v1';
const APP_SECRET = 'reclaim_app_2024_secure'; // Change this to your own secret
const AUTH_KEY = 'reclaim-app-authorized';
// Set to true before production to block web access without the mobile app token
const REQUIRE_APP_SECRET = false;
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
  welcomeComplete: false,
  onboardingComplete: false,
  addictionScore: 0,
  addictionLevel: '',
  subscription: null,
  signedIn: false,
  authUser: null,
  lifetimeOfferSeen: false,
  quitDate: new Date().toISOString(),
  dailyCost: 0,
  savingFor: '',
  productLink: '',
  productPrice: 0,
  clarityBase: 0,
  relapses: [],
  pledges: [],
  completedPractices: [],
  communityJoined: false,
  aiMessages: starterMessages,
  journal: [],
  maxStreak: 0,
};

function DownloadAppScreen() {
  return (
    <div className="download-app-screen">
      <div className="download-container">
        <div className="download-header">
          <div className="app-logo">
            <img src="/reclaim-logo.png" alt="Reclaim" />
          </div>
          <h1>Reclaim</h1>
          <p className="app-tagline">Guruji's path to freedom and recovery</p>
        </div>

        <div className="download-content">
          <div className="feature-highlight">
            <Lock size={20} />
            <p>This is an app-only experience</p>
          </div>

          <div className="qr-section">
            <p className="qr-label">Scan to download</p>
            <div className="qr-code-container">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent('https://play.google.com/store/apps/details?id=com.reclaim.app')}`}
                alt="QR Code for app download"
                className="qr-code"
              />
            </div>
            <p className="qr-hint">Open camera app and point at QR code</p>
          </div>

          <div className="download-buttons">
            <a
              href="https://play.google.com/store/apps/details?id=com.reclaim.app"
              className="store-button"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.5,12.92 20.16,13.19L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
              </svg>
              <span>Get it on Google Play</span>
            </a>
          </div>

          <div className="app-features">
            <div className="feature-item">
              <BadgeCheck size={18} />
              <span>Daily accountability pledge</span>
            </div>
            <div className="feature-item">
              <TimerReset size={18} />
              <span>90-second SOS urge reset</span>
            </div>
            <div className="feature-item">
              <Bot size={18} />
              <span>24/7 AI recovery guide</span>
            </div>
            <div className="feature-item">
              <Target size={18} />
              <span>40-day transformation roadmap</span>
            </div>
          </div>
        </div>

        <div className="download-footer">
          <p>© 2024 Reclaim · Private & Secure</p>
        </div>
      </div>
    </div>
  );
}



function IntroBrandHeader({ tagline, compact = false }) {
  return (
    <>
      <div className={`intro-brand__logo${compact ? ' intro-brand__logo--compact' : ''}`}>
        <img src="/reclaim-logo.png" alt="Reclaim" />
      </div>
      {tagline ? (
        <>
          <div className="intro-brand__divider" aria-hidden="true">
            <span />
            <i />
            <span />
          </div>
          <p className="intro-brand__tagline">{tagline}</p>
        </>
      ) : null}
      <div className="intro-brand__badge">
        INDIA <span aria-hidden="true">🇮🇳</span>
      </div>
    </>
  );
}

function LaunchSplash() {
  return (
    <AppFrame>
      <div className="intro-screen">
        <div className="intro-brand">
          <IntroBrandHeader tagline="Break Free. Live Fully." />
        </div>
        <div className="intro-loader" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
      </div>
    </AppFrame>
  );
}

function AboutScreen({ onContinue }) {
  const features = [
    { icon: ShieldCheck, text: '90-second SOS reset when urges hit' },
    { icon: TrendingUp, text: 'Track your streak, clarity and progress' },
    { icon: IndianRupee, text: 'See money and time you reclaim' },
    { icon: HeartHandshake, text: 'Daily wisdom and AI guidance from Guruji' },
  ];

  return (
    <AppFrame>
      <div className="intro-screen intro-screen--compact">
        <div className="intro-brand">
          <IntroBrandHeader compact />
          <p className="intro-brand__lead">
            Your private companion to quit the habit holding you back.
          </p>
          <ul className="intro-brand__features">
            {features.map(({ icon: Icon, text }) => (
              <li key={text}>
                <Icon size={16} />
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="intro-footer">
          <button type="button" className="primary-action wide intro-footer__button" onClick={onContinue}>
            Get Started
            <ChevronRight size={20} />
          </button>
          <p className="intro-footer__note">Private. Your data stays on your device.</p>
        </div>
      </div>
    </AppFrame>
  );
}

function App() {
  if (!REQUIRE_APP_SECRET) {
    return <ReclaimApp />;
  }

  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get('app_token');
    const storedAuth = localStorage.getItem(AUTH_KEY);

    if (urlToken === APP_SECRET) {
      localStorage.setItem(AUTH_KEY, 'true');
      setIsAuthorized(true);
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (storedAuth === 'true') {
      setIsAuthorized(true);
    } else {
      setIsAuthorized(false);
    }

    setIsChecking(false);
  }, []);

  if (isChecking) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: '#0B1014',
        color: '#FFCC80'
      }}>
        <div style={{ textAlign: 'center' }}>
          <Sparkles size={48} style={{ marginBottom: '16px' }} />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return <DownloadAppScreen />;
  }

  return <ReclaimApp />;
}

function ReclaimApp() {
  const [appState, setAppState] = useStoredState();
  const [activeTab, setActiveTab] = useState(() => window.location.hash.replace('#', '') || 'home');
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [toast, setToast] = useState('');
  const [rescueActive, setRescueActive] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(rescueSeconds);
  const [journalDraft, setJournalDraft] = useState({ mood: 'Steady', trigger: '', note: '' });
  const [showPledgeModal, setShowPledgeModal] = useState(false);
  const [activeStatModal, setActiveStatModal] = useState(null);
  const [showSplash, setShowSplash] = useState(true);
  const [authBootstrapping, setAuthBootstrapping] = useState(
    isFirebaseConfigured || Boolean(appConfig.googleOauthClientId),
  );
  const [authBusy, setAuthBusy] = useState(false);
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    if (!isFirebaseConfigured && !appConfig.googleOauthClientId) {
      setAuthBootstrapping(false);
      return undefined;
    }

    let unsub = () => {};
    let cancelled = false;

    const finishOAuthRedirect = async () => {
      try {
        const redirectUser = await completeRedirectSignIn();
        if (cancelled) return;

        if (redirectUser) {
          setAppState((current) => ({
            ...current,
            signedIn: true,
            authUser: redirectUser,
          }));
          setAuthError('');
        }
      } catch (error) {
        if (!cancelled) {
          setAuthError(getAuthErrorMessage(error));
        }
      } finally {
        if (!cancelled && !isFirebaseConfigured) {
          setAuthBootstrapping(false);
        }
      }
    };

    window.__reclaimHandleOAuthReturn = (returnUrl) => {
      if (!returnUrl || cancelled) return;
      const hashIndex = returnUrl.indexOf('#');
      if (hashIndex === -1) return;
      const hash = returnUrl.slice(hashIndex);
      window.history.replaceState({}, document.title, `${window.location.pathname}${window.location.search}${hash}`);
      finishOAuthRedirect();
    };

    finishOAuthRedirect();
    window.addEventListener('hashchange', finishOAuthRedirect);

    if (isFirebaseConfigured) {
      unsub = subscribeToAuthChanges((authUser) => {
        if (cancelled) return;

        setAppState((current) => ({
          ...current,
          signedIn: Boolean(authUser),
          authUser,
        }));
        setAuthBootstrapping(false);
      });
    } else if (isSupabaseConfigured) {
      // Restore email/password session from Supabase.
      // Important: do NOT override a Google/Firebase session (provider !== 'email')
      // just because Supabase has no record of it.
      unsub = subscribeToSupabaseAuth((sbUser) => {
        if (cancelled) return;
        setAppState((current) => {
          if (!sbUser && current.authUser?.provider !== 'email') {
            // Google user with no Supabase session — keep their stored session.
            return current;
          }
          const authUser = sbUser ? mapSupabaseUser(sbUser) : null;
          return { ...current, signedIn: Boolean(authUser), authUser };
        });
        setAuthBootstrapping(false);
      });
    }

    return () => {
      cancelled = true;
      unsub();
      window.removeEventListener('hashchange', finishOAuthRedirect);
      delete window.__reclaimHandleOAuthReturn;
    };
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => setShowSplash(false), 2400);
    return () => window.clearTimeout(timer);
  }, []);

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

  // Auto-advance quote carousel every 15 seconds
  useEffect(() => {
    const timer = window.setInterval(() => {
      setQuoteIndex((current) => (current + 1) % quotes.length);
    }, 15000);

    return () => window.clearInterval(timer);
  }, []);

  // Track max streak — update whenever current streak beats the stored best
  useEffect(() => {
    if (daysClean > 0 && daysClean > (appState.maxStreak || 0)) {
      updateState((current) => ({ ...current, maxStreak: daysClean }));
    }
  }, [daysClean]);

  const todayKey = getDayKey(new Date());
  const pledgedToday = appState.pledges.includes(todayKey);
  const completedToday = appState.completedPractices.filter((item) => item.startsWith(todayKey)).length;
  
  // Calculate streak: MUST have 0 relapses + daily discipline complete
  // Check if there are ANY relapses from quit date onwards
  const lastRelapseDate = appState.relapses.length > 0 ? new Date(appState.relapses[0]) : null;
  const streakStartDate = lastRelapseDate && lastRelapseDate > new Date(appState.quitDate)
    ? lastRelapseDate
    : new Date(appState.quitDate);
  
  let daysClean = 0;
  const today = new Date();
  const daysSinceStart = Math.max(0, daysBetween(streakStartDate, today));
  
  // First check: Are there any relapses on or after the start date?
  const hasRelapseInPeriod = appState.relapses.some(relapseISO => {
    const relapseDate = new Date(relapseISO);
    return relapseDate >= streakStartDate;
  });
  
  // If ANY relapse exists in the counting period, streak is 0
  if (hasRelapseInPeriod) {
    daysClean = 0;
  } else {
    // No relapses - now count CONSECUTIVE days with pledge + practice
    for (let i = 0; i <= daysSinceStart; i++) {
      const checkDate = new Date(streakStartDate);
      checkDate.setDate(checkDate.getDate() + i);
      const dayKey = getDayKey(checkDate);
      const isToday = checkDate.toDateString() === today.toDateString();
      
      const hasPledge = appState.pledges.includes(dayKey);
      const hasPractice = appState.completedPractices.some(p => p.startsWith(dayKey));
      
      // For today: count if has pledge+practice
      // For past days: MUST have both
      if (isToday) {
        if (hasPledge && hasPractice) {
          daysClean++;
        }
      } else {
        // Past day MUST have both - if missing either, streak breaks
        if (hasPledge && hasPractice) {
          daysClean++;
        } else {
          daysClean = 0;
          break;
        }
      }
    }
  }
  
  const moneySaved = Math.max(0, Math.round(daysClean * Number(appState.dailyCost || 0)));
  
  // Clarity calculation based on 100-day brain recovery science
  // Full clarity achieved around 100 days of consistent practice
  const totalPracticesCompleted = appState.completedPractices.length;
  const practicesPerDay = daysClean > 0 ? totalPracticesCompleted / daysClean : 0;
  const relapsePenalty = Math.min(20, appState.relapses.length * 5); // Each relapse -5%, max -20%
  
  // Base recovery (70%): Logarithmic curve - faster early gains, slower later
  const timeRecovery = Math.min(70, (daysClean / 100) * 70);
  
  // Practice bonus (30%): Based on consistency (target: 1+ practice/day)
  const practiceBonus = Math.min(30, practicesPerDay * 30);
  
  // Final clarity with relapse penalty
  const clarity = Math.max(0, Math.min(100, timeRecovery + practiceBonus - relapsePenalty));
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

  function openPledgeModal() {
    if (pledgedToday) {
      notify('Pledge already completed today.');
      return;
    }
    setShowPledgeModal(true);
  }

  function takePledge() {
    updateState((current) => ({
      ...current,
      pledges: current.pledges.includes(todayKey) ? current.pledges : [todayKey, ...current.pledges],
    }));
    setShowPledgeModal(false);
    notify('Pledge saved for today.');
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

  async function upsertProfile(authUser) {
    if (!authUser?.uid) return;
    try {
      await fetch('/api/me', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: authUser.uid,
          full_name: authUser.name,
          email: authUser.email,
          avatar_url: authUser.photoURL || '',
        }),
      });
    } catch {
      // Profile sync is non-critical; ignore network errors
    }
  }

  async function loginWithGoogle() {
    setAuthError('');
    setAuthBusy(true);

    try {
      const authUser = await firebaseGoogleSignIn();
      if (authUser) {
        updateState((current) => ({ ...current, signedIn: true, authUser }));
        upsertProfile(authUser);
        notify('Logged in with Google.');
      }
    } catch (error) {
      const message = getAuthErrorMessage(error);
      setAuthError(message);
      notify(message);
    } finally {
      setAuthBusy(false);
    }
  }

  async function loginWithEmail(email, password) {
    setAuthError('');
    setAuthBusy(true);
    try {
      const sbUser = await signInWithEmail(email, password);
      const authUser = mapSupabaseUser(sbUser);
      updateState((current) => ({ ...current, signedIn: true, authUser }));
      upsertProfile(authUser);
      notify('Logged in.');
    } catch (error) {
      const msg = error?.message || 'Sign-in failed. Check your email and password.';
      setAuthError(msg);
      notify(msg);
    } finally {
      setAuthBusy(false);
    }
  }

  async function signupWithEmail(email, password, fullName) {
    setAuthError('');
    setAuthBusy(true);
    try {
      const sbUser = await signUpWithEmail(email, password, fullName);
      if (!sbUser) {
        setAuthError('Check your inbox to confirm your email, then sign in.');
        return;
      }
      const authUser = mapSupabaseUser(sbUser);
      updateState((current) => ({ ...current, signedIn: true, authUser }));
      upsertProfile(authUser);
      notify('Account created. Welcome!');
    } catch (error) {
      const msg = error?.message || 'Sign-up failed. Please try again.';
      setAuthError(msg);
      notify(msg);
    } finally {
      setAuthBusy(false);
    }
  }

  async function logout() {
    try {
      await firebaseSignOut();
      await supabaseSignOut();
    } catch (error) {
      console.error(error);
    }

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
    {
      icon: Flame,
      label: 'Streak',
      value: `${daysClean}d`,
      subValue: `Best ${appState.maxStreak || 0}d`,
      tone: 'sun',
    },
    { icon: IndianRupee, label: 'Saved', value: formatRupees(moneySaved), tone: 'mint' },
    { icon: TrendingUp, label: 'Clarity', value: `${clarity}%`, tone: 'blue' },
    { icon: ShieldCheck, label: 'Relapses', value: String(appState.relapses.length), tone: 'rose' },
  ];

  if (showSplash) {
    return <LaunchSplash />;
  }

  if (!appState.welcomeComplete) {
    return (
      <AboutScreen
        onContinue={() =>
          updateState((current) => ({ ...current, welcomeComplete: true }))
        }
      />
    );
  }

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
        <SigninScreen
          onSignin={loginWithGoogle}
          onEmailSignin={loginWithEmail}
          onEmailSignup={signupWithEmail}
          isBusy={authBusy}
          error={authError}
          isBootstrapping={authBootstrapping}
          isConfigured={isGoogleSignInReady}
          isEmailConfigured={isSupabaseConfigured}
        />
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
      <section className="phone-frame" aria-label="Reclaim app">
        <div className="content-scroll">
          <header className="topbar">
            <div>
              <p className="eyebrow">Guruji's Recovery Path</p>
              <h1>Reclaim</h1>
            </div>
            <button className="icon-button" aria-label="Open protection settings" onClick={() => setShowSettings(true)}>
              <Lock size={19} />
            </button>
          </header>

          {activeTab === 'home' && (
            <>
              <GuruPanel
                quote={currentQuote}
                onNextQuote={() => setQuoteIndex((current) => (current + 1) % quotes.length)}
                currentIndex={quoteIndex}
                totalQuotes={quotes.length}
              />

              <OpeningFocus
                level={appState.addictionLevel}
                score={appState.addictionScore}
                pledgedToday={pledgedToday}
                rescueActive={rescueActive}
                onPledge={openPledgeModal}
                onStartSos={startRescue}
              />

              <section className="stats-grid" aria-label="Recovery stats">
                {statCards.map((stat) => (
                  <Stat {...stat} key={stat.label} onClick={() => setActiveStatModal(stat.label)} />
                ))}
              </section>

              <section className="action-row">
                <button className="relapse-action" onClick={recordRelapse}>
                  <CircleAlert size={18} />
                  Log Relapse
                </button>
              </section>


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
              onPledge={openPledgeModal}
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
              currentIndex={quoteIndex}
              totalQuotes={quotes.length}
              completedPractices={appState.completedPractices}
              todayKey={todayKey}
              onToggle={togglePractice}
            />
          )}

          {activeTab === 'more' && (
            <MorePanel
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

        {showPledgeModal && (
          <PledgeModal
            onConfirm={takePledge}
            onClose={() => setShowPledgeModal(false)}
          />
        )}

        {activeStatModal === 'Saved' ? (
          <SavingsModal
            daysClean={daysClean}
            moneySaved={moneySaved}
            quitDate={appState.quitDate}
            dailyCost={appState.dailyCost}
            savingFor={appState.savingFor}
            onClose={() => setActiveStatModal(null)}
            onSave={(savings) => {
              updateState((current) => ({
                ...current,
                dailyCost: savings.dailyCost,
              }));
              notify('Daily cost updated.');
            }}
          />
        ) : activeStatModal ? (
          <StatModal
            type={activeStatModal}
            daysClean={daysClean}
            maxStreak={appState.maxStreak || 0}
            moneySaved={moneySaved}
            clarity={clarity}
            relapses={appState.relapses}
            quitDate={appState.quitDate}
            dailyCost={appState.dailyCost}
            savingFor={appState.savingFor}
            completedPractices={appState.completedPractices}
            onClose={() => setActiveStatModal(null)}
          />
        ) : null}

        {rescueActive && (
          <UrgeRescueModal
            secondsLeft={secondsLeft}
          />
        )}

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
      <section className="phone-frame" aria-label="Reclaim app">
        <div className="content-scroll no-nav">{children}</div>
      </section>
    </main>
  );
}

function OnboardingScreen({ onComplete }) {
  const questions = [
    {
      id: 'frequency',
      icon: CalendarCheck,
      title: 'How often do urges disturb your day?',
      subtitle: 'Be honest—this helps us personalize your recovery path',
      options: [
        { label: 'Rarely', value: 1, desc: 'Once a week or less' },
        { label: 'Sometimes', value: 2, desc: 'Few times weekly' },
        { label: 'Often', value: 3, desc: 'Almost daily' },
      ],
    },
    {
      id: 'control',
      icon: ShieldCheck,
      title: 'When an urge starts, how hard is it to resist?',
      subtitle: 'Understanding this helps us build better coping tools',
      options: [
        { label: 'Manageable', value: 1, desc: 'I can usually stop' },
        { label: 'Challenging', value: 2, desc: 'Takes real effort' },
        { label: 'Very hard', value: 3, desc: 'Feel overwhelmed' },
      ],
    },
    {
      id: 'impact',
      icon: Target,
      title: 'What area of life has been affected most?',
      subtitle: 'This helps us focus on what matters to you',
      options: [
        { label: 'Focus', value: 1, desc: 'Work & studies' },
        { label: 'Confidence', value: 2, desc: 'Self-worth' },
        { label: 'Relationships', value: 3, desc: 'Faith & bonds' },
      ],
    },
    {
      id: 'duration',
      icon: Flame,
      title: 'How long has this pattern been present?',
      subtitle: 'Duration helps us understand the depth of the habit',
      options: [
        { label: 'Recent', value: 1, desc: 'Less than 6 months' },
        { label: 'Established', value: 2, desc: '6 months to 2 years' },
        { label: 'Long-term', value: 3, desc: 'More than 2 years' },
      ],
    },
    {
      id: 'triggers',
      icon: CircleAlert,
      title: 'What triggers urges most often?',
      subtitle: 'Identifying triggers is key to prevention',
      options: [
        { label: 'Boredom', value: 1, desc: 'Free time or idle moments' },
        { label: 'Stress', value: 2, desc: 'Pressure or anxiety' },
        { label: 'Isolation', value: 3, desc: 'Being alone or lonely' },
      ],
    },
    {
      id: 'attempts',
      icon: RotateCcw,
      title: 'Have you tried to quit before?',
      subtitle: 'Previous attempts give us valuable insights',
      options: [
        { label: 'First time', value: 1, desc: 'This is my first attempt' },
        { label: 'Few tries', value: 2, desc: '2-3 previous attempts' },
        { label: 'Many tries', value: 3, desc: 'Multiple attempts' },
      ],
    },
    {
      id: 'motivation',
      icon: TrendingUp,
      title: 'What motivates you to recover now?',
      subtitle: 'Understanding your why strengthens commitment',
      options: [
        { label: 'Self-improvement', value: 1, desc: 'Personal growth' },
        { label: 'Relationships', value: 2, desc: 'Family or faith' },
        { label: 'Crisis point', value: 3, desc: 'Hit rock bottom' },
      ],
    },
    {
      id: 'support',
      icon: HeartHandshake,
      title: 'Do you have accountability support?',
      subtitle: 'Community support greatly increases success rates',
      options: [
        { label: 'Yes', value: 1, desc: 'Friend or mentor aware' },
        { label: 'Partial', value: 2, desc: 'Some support available' },
        { label: 'No', value: 3, desc: 'Handling it alone' },
      ],
    },
  ];

  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  
  const maxScore = questions.length * 3;
  const score = Object.values(answers).reduce((total, value) => total + Number(value), 0);
  const percentage = Math.round((score / maxScore) * 100);
  
  // More nuanced level calculation based on 8 questions (max 24)
  const level = score <= 10 ? 'Mild' : score <= 16 ? 'Moderate' : 'High';
  const isQuestionAnswered = answers[questions[currentStep]?.id] !== undefined;
  const allQuestionsAnswered = Object.keys(answers).length === questions.length;

  const handleAnswer = (questionId, value) => {
    setAnswers({ ...answers, [questionId]: value });
    
    // Auto-advance after a brief delay
    setTimeout(() => {
      if (currentStep < questions.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        setShowResults(true);
      }
    }, 400);
  };

  const getLevelMessage = () => {
    if (score <= 10) {
      return {
        emoji: '🌱',
        color: '#81dab2',
        gradient: 'linear-gradient(135deg, rgba(129, 218, 178, 0.2), rgba(129, 218, 178, 0.08))',
        title: 'You\'re in a strong position',
        message: 'With the right tools and commitment, you can build lasting change. Your awareness and willingness to start is already a powerful step forward.',
        encouragement: 'Early intervention gives you the best chance for quick, lasting recovery.',
      };
    } else if (score <= 16) {
      return {
        emoji: '🔥',
        color: '#ffd28a',
        gradient: 'linear-gradient(135deg, rgba(255, 210, 138, 0.2), rgba(255, 210, 138, 0.08))',
        title: 'You\'re ready for transformation',
        message: 'This journey will be challenging but deeply rewarding. With daily practice, community support, and spiritual discipline, lasting freedom is absolutely possible.',
        encouragement: 'You have the self-awareness needed to succeed. Now it\'s about consistent action.',
      };
    } else {
      return {
        emoji: '⚡',
        color: '#ff9b9b',
        gradient: 'linear-gradient(135deg, rgba(255, 155, 155, 0.2), rgba(147, 47, 56, 0.15))',
        title: 'Your breakthrough starts now',
        message: 'You\'ve shown tremendous courage by seeking help. This path requires dedication and daily commitment, but you\'re not alone. We\'ll guide you through proven recovery methods, one day at a time.',
        encouragement: 'The hardest step is admitting you need help. You\'ve already done that. Now, let\'s walk this path together.',
      };
    }
  };

  const currentQuestion = questions[currentStep];
  const resultMessage = getLevelMessage();

  if (showResults) {
    return (
      <section className="journey-screen onboarding-results">
        <div className="result-hero" style={{ background: resultMessage.gradient }}>
          <div className="result-emoji">{resultMessage.emoji}</div>
          <p className="eyebrow">Assessment complete</p>
          <h1>{resultMessage.title}</h1>
          <p className="panel-copy">{resultMessage.message}</p>
        </div>
        
        <div className="result-score-card">
          <div className="score-visual-enhanced">
            <div className="score-circle-large" style={{ borderColor: `${resultMessage.color}40` }}>
              <svg className="score-ring" viewBox="0 0 120 120">
                <circle
                  className="ring-background"
                  cx="60"
                  cy="60"
                  r="54"
                />
                <circle
                  className="ring-progress"
                  cx="60"
                  cy="60"
                  r="54"
                  style={{
                    stroke: resultMessage.color,
                    strokeDasharray: `${percentage * 3.39} 339`,
                  }}
                />
              </svg>
              <div className="score-content">
                <strong>{score}</strong>
                <span>/ {maxScore}</span>
                <small>{percentage}%</small>
              </div>
            </div>
            <div className="score-info-enhanced">
              <div className="level-badge" style={{ background: resultMessage.gradient, borderColor: `${resultMessage.color}50` }}>
                <span>{level}</span>
              </div>
              <h2>{level} intensity level</h2>
              <p>{resultMessage.encouragement}</p>
            </div>
          </div>
        </div>

        <div className="onboarding-features">
          <h3>Your recovery toolkit includes:</h3>
          <div className="feature-list">
            <div className="feature-item">
              <BadgeCheck size={20} />
              <div>
                <strong>Daily Sankalp</strong>
                <p>Morning pledge system for accountability</p>
              </div>
            </div>
            <div className="feature-item">
              <TimerReset size={20} />
              <div>
                <strong>90-second SOS Reset</strong>
                <p>Emergency tool for urge management</p>
              </div>
            </div>
            <div className="feature-item">
              <Leaf size={20} />
              <div>
                <strong>Meditation & Satsang</strong>
                <p>Spiritual practices for mind discipline</p>
              </div>
            </div>
            <div className="feature-item">
              <Bot size={20} />
              <div>
                <strong>AI Recovery Guide</strong>
                <p>24/7 support for urges and setbacks</p>
              </div>
            </div>
          </div>
        </div>

        <div className="onboarding-privacy">
          <Lock size={16} />
          <p>Your responses are private and stored only on your device. We never share your data.</p>
        </div>

        <button
          className="primary-action wide onboarding-continue"
          onClick={() => onComplete({ score, level })}
        >
          Begin my journey
          <ChevronRight size={18} />
        </button>
      </section>
    );
  }

  return (
    <section className="journey-screen onboarding-screen">
      <div className="onboarding-header">
        <div className="portrait-mark large">
          <Sparkles size={34} />
        </div>
        <p className="eyebrow">First-time setup · Private & secure</p>
        <h1>Let's understand your journey</h1>
        <p className="panel-copy">
          Answer three quick questions to personalize your recovery path. Your responses help us tailor the right tools and support for you.
        </p>
      </div>

      <div className="onboarding-progress">
        <div className="progress-steps">
          {questions.map((_, idx) => (
            <div
              key={idx}
              className={`progress-step ${idx <= currentStep ? 'active' : ''} ${idx < currentStep ? 'completed' : ''}`}
            />
          ))}
        </div>
        <p className="progress-label">Question {currentStep + 1} of {questions.length}</p>
      </div>

      <div className="onboarding-question">
        <div className="question-icon">
          {React.createElement(currentQuestion.icon, { size: 28 })}
        </div>
        <h2>{currentQuestion.title}</h2>
        <p className="question-subtitle">{currentQuestion.subtitle}</p>
        
        <div className="onboarding-options">
          {currentQuestion.options.map((option) => (
            <button
              key={option.value}
              className={`onboarding-option ${answers[currentQuestion.id] === option.value ? 'selected' : ''}`}
              onClick={() => handleAnswer(currentQuestion.id, option.value)}
            >
              <div className="option-content">
                <strong>{option.label}</strong>
                <span>{option.desc}</span>
              </div>
              <div className="option-check">
                {answers[currentQuestion.id] === option.value && <BadgeCheck size={20} />}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="onboarding-navigation">
        {currentStep > 0 && (
          <button
            className="ghost-action"
            onClick={() => setCurrentStep(currentStep - 1)}
          >
            Previous
          </button>
        )}
        {isQuestionAnswered && currentStep === questions.length - 1 && (
          <button
            className="primary-action wide"
            onClick={() => setShowResults(true)}
          >
            See my results
          </button>
        )}
      </div>
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

function getAuthErrorMessage(error) {
  const code = error?.code || '';
  const message = `${error?.message || ''} ${error?.error || ''}`.toLowerCase();
  const origin = typeof window !== 'undefined' ? window.location.origin : '';

  if (code === 'auth/popup-closed-by-user') return 'Sign-in was cancelled.';
  if (code === 'auth/popup-blocked') {
    return 'Pop-up blocked. Allow pop-ups for this site or open the app on your phone.';
  }
  if (code === 'auth/unauthorized-domain') {
    return `This domain is not authorized. Add ${origin} in Firebase → Authentication → Settings → Authorized domains.`;
  }
  if (code === 'auth/operation-not-allowed') {
    return 'Google sign-in is disabled in Firebase. Enable it under Authentication → Sign-in method.';
  }
  if (
    message.includes('invalid_client') ||
    message.includes('no registered origin') ||
    message.includes('origin_mismatch') ||
    message.includes('redirect_uri_mismatch')
  ) {
    const redirectUri = typeof window !== 'undefined' ? getGoogleOAuthRedirectUri() : '';
    return `Google redirect URI mismatch. In Google Cloud → Web OAuth client → Authorized redirect URIs, add exactly: ${redirectUri} — also add JavaScript origin: ${origin}. Save and wait a few minutes, then redeploy Vercel if you changed env vars.`;
  }

  return error?.message || error?.error || 'Google sign-in failed. Please try again.';
}

function SigninScreen({
  onSignin,
  onEmailSignin,
  onEmailSignup,
  isBusy,
  error,
  isBootstrapping,
  isConfigured,
  isEmailConfigured,
}) {
  const [mode, setMode] = useState('google'); // 'google' | 'email-signin' | 'email-signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const setupOrigin = typeof window !== 'undefined' ? window.location.origin : '';
  const redirectUri = typeof window !== 'undefined' ? getGoogleOAuthRedirectUri() : '';

  if (isBootstrapping) {
    return (
      <section className="journey-screen center-screen">
        <div className="portrait-mark large">
          <Sparkles size={34} />
        </div>
        <p className="eyebrow">Secure your progress</p>
        <h1>Sign in to continue</h1>
        <p className="panel-copy">Checking your sign-in status…</p>
      </section>
    );
  }

  function handleEmailSubmit(event) {
    event.preventDefault();
    if (mode === 'email-signup') {
      onEmailSignup(email, password, fullName);
    } else {
      onEmailSignin(email, password);
    }
  }

  return (
    <section className="journey-screen center-screen">
      <div className="portrait-mark large">
        <Sparkles size={34} />
      </div>
      <p className="eyebrow">Secure your progress</p>
      <h1>Sign in to continue</h1>
      <p className="panel-copy">
        Save your streak, records, and progress securely.
      </p>

      {error ? <div className="auth-error">{error}</div> : null}
      {import.meta.env.DEV && isConfigured && mode === 'google' ? (
        <div className="auth-setup-hint">
          <p>Google Cloud → Web OAuth client:</p>
          <code>Origin: {setupOrigin}</code>
          <code>Redirect URI: {redirectUri}</code>
          {shouldUseGoogleRedirect() ? (
            <p className="auth-setup-hint__note">WebView detected — redirect mode active.</p>
          ) : null}
        </div>
      ) : null}

      {/* Google Sign-In */}
      {(mode === 'google') && (
        <>
          {isConfigured ? (
            <button className="google-button" type="button" onClick={onSignin} disabled={isBusy}>
              {isBusy ? 'Signing in…' : 'Continue with Google'}
            </button>
          ) : (
            <div className="auth-error">
              Google sign-in is not configured. Add <code>VITE_GOOGLE_OAUTH_CLIENT_ID</code> to{' '}
              <code>.env.local</code>.
            </div>
          )}

          {isEmailConfigured ? (
            <div className="auth-divider">
              <span>or</span>
            </div>
          ) : null}

          {isEmailConfigured ? (
            <button
              className="ghost-action wide"
              type="button"
              onClick={() => setMode('email-signin')}
              disabled={isBusy}
            >
              Sign in with Email
            </button>
          ) : null}
        </>
      )}

      {/* Email Sign-In / Sign-Up */}
      {(mode === 'email-signin' || mode === 'email-signup') && (
        <form className="email-auth-form" onSubmit={handleEmailSubmit}>
          {mode === 'email-signup' ? (
            <input
              type="text"
              placeholder="Full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              autoComplete="name"
            />
          ) : null}
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            autoComplete={mode === 'email-signup' ? 'new-password' : 'current-password'}
          />
          <button className="primary-action wide" type="submit" disabled={isBusy}>
            {isBusy
              ? 'Please wait…'
              : mode === 'email-signup'
              ? 'Create Account'
              : 'Sign In'}
          </button>
          <div className="auth-toggle-row">
            {mode === 'email-signin' ? (
              <>
                <span>No account?</span>
                <button type="button" className="link-button" onClick={() => setMode('email-signup')}>
                  Create one
                </button>
              </>
            ) : (
              <>
                <span>Already have an account?</span>
                <button type="button" className="link-button" onClick={() => setMode('email-signin')}>
                  Sign in
                </button>
              </>
            )}
          </div>
          <button
            type="button"
            className="link-button back-link"
            onClick={() => setMode('google')}
          >
            ← Back
          </button>
        </form>
      )}
    </section>
  );
}

function LifetimeOfferScreen({ onAccept, onSkip }) {
  return (
    <section className="journey-screen lifetime-offer-screen">
      <div className="offer-badge">
        <Sparkles size={14} />
        <span>One-Time Offer</span>
      </div>
      
      <div className="offer-hero">
        <div className="offer-icon">
          <BadgeCheck size={42} />
        </div>
        <h1>Lifetime Access</h1>
        <p className="offer-subtitle">Your complete recovery system, forever</p>
      </div>

      <div className="price-showcase">
        <div className="price-strike">
          <span>₹12,600/year</span>
        </div>
        <div className="price-main">
          <span className="price-currency">₹</span>
          <strong className="price-value">2,150</strong>
        </div>
        <p className="price-note">One-time payment · Lifetime ownership</p>
        <div className="savings-highlight">
          <Sparkles size={16} />
          <span>Save over ₹10,450 · 83% off</span>
        </div>
      </div>

      <div className="offer-benefits-clean">
        <h3>Everything included:</h3>
        <div className="benefits-list">
          <div className="benefit-row">
            <BadgeCheck size={20} />
            <span>Daily pledge & accountability</span>
          </div>
          <div className="benefit-row">
            <TimerReset size={20} />
            <span>90-second SOS urge reset</span>
          </div>
          <div className="benefit-row">
            <Leaf size={20} />
            <span>Meditation & spiritual practices</span>
          </div>
          <div className="benefit-row">
            <Bot size={20} />
            <span>AI recovery guide (24/7)</span>
          </div>
          <div className="benefit-row">
            <Target size={20} />
            <span>40-day transformation roadmap</span>
          </div>
          <div className="benefit-row">
            <HeartHandshake size={20} />
            <span>Private community access</span>
          </div>
        </div>
      </div>

      <div className="offer-guarantee-clean">
        <Lock size={18} />
        <p>No renewals · No hidden fees · Yours forever</p>
      </div>

      <div className="offer-actions-clean">
        <button className="offer-claim-button" onClick={onAccept}>
          <BadgeCheck size={20} />
          <span>Claim Lifetime Access</span>
        </button>
        <button className="offer-skip-button" onClick={onSkip}>
          Continue with current plan
        </button>
      </div>

      <p className="offer-notice">
        <CircleAlert size={14} />
        This offer appears only once
      </p>
    </section>
  );
}

function OpeningFocus({ level, score, pledgedToday, rescueActive, onPledge, onStartSos }) {
  return (
    <section className="opening-focus">
      <div>
        <p className="section-kicker">Opening check-in</p>
        <h2>{level || 'Moderate'} risk · {score || 0}/24 score</h2>
        <p>{pledgedToday ? 'Your pledge is complete. Keep the phone boundaries clean today.' : 'Start with pledge before anything else.'}</p>
      </div>
      <div className="opening-actions">
        <button
          className={pledgedToday ? 'completed' : ''}
          onClick={onPledge}
          disabled={pledgedToday}
        >
          <BadgeCheck size={16} />
          {pledgedToday ? 'Pledge taken' : 'Take pledge'}
        </button>
        <button
          className={rescueActive ? 'active' : ''}
          onClick={onStartSos}
        >
          {rescueActive ? <Pause size={16} /> : <Play size={16} />}
          {rescueActive ? 'Pause SOS' : 'Start SOS'}
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
  const [showSarthiModal, setShowSarthiModal] = useState(true);
  const prompts = ['I have an urge', 'I relapsed', 'I feel guilty', 'Give me a meditation'];

  function submit(event) {
    event.preventDefault();
    onSend(draft);
    setDraft('');
  }

  return (
    <section className="ai-panel page-panel">
      {/* Sarthi AI Coming Soon Modal */}
      {showSarthiModal && (
        <div className="modal-overlay" onClick={() => setShowSarthiModal(false)}>
          <div className="sarthi-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close-button top-left"
              onClick={() => setShowSarthiModal(false)}
              aria-label="Close modal"
            >
              ×
            </button>
            <div className="sarthi-coming-soon">
        <div className="sarthi-badge">
          <Sparkles size={16} />
          <span>Coming Soon</span>
        </div>
        <div className="sarthi-hero">
          <div className="sarthi-icon">
            <ShieldCheck size={32} />
          </div>
          <h2>Sarthi AI</h2>
          <p className="sarthi-tagline">Your divine guide in the battle against urges</p>
        </div>
        <div className="sarthi-description">
          <p>
            Just as <strong>Krishna guided Arjuna</strong> through the battlefield of Kurukshetra,
            <strong> Sarthi AI</strong> will guide you through your inner battles with wisdom from the Bhagavad Gita.
          </p>
          <div className="sarthi-features">
            <div className="sarthi-feature">
              <BookOpenText size={18} />
              <span>Wisdom from Mahabharata</span>
            </div>
            <div className="sarthi-feature">
              <Target size={18} />
              <span>Contextual guidance for urges</span>
            </div>
            <div className="sarthi-feature">
              <Sparkles size={18} />
              <span>Krishna's voice for your struggles</span>
            </div>
          </div>
          <blockquote className="sarthi-quote">
            <p>"कर्मण्येवाधिकारस्ते मा फलेषु कदाचन"</p>
            <cite>You have the right to perform your duty, but not to the fruits thereof.</cite>
          </blockquote>
        </div>
            </div>
          </div>
        </div>
      )}

      {/* Current AI: Prem Path */}
      <div className="ai-content-section">
        <div className="section-heading">
          <div>
            <p className="section-kicker">Available Now</p>
            <h2>Prem Path AI</h2>
          </div>
          <Bot size={22} />
        </div>
        <p className="panel-copy">A recovery coach inspired by Guruji's centered path. Get immediate help with urges, guilt, and daily discipline.</p>

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
      </div>
    </section>
  );
}

function GuruPanel({ quote, onNextQuote, currentIndex, totalQuotes }) {
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
        <div className="carousel-controls">
          <div className="carousel-dots">
            {Array.from({ length: totalQuotes }).map((_, index) => (
              <div
                key={index}
                className={`carousel-dot ${index === currentIndex ? 'active' : ''}`}
                aria-label={`Quote ${index + 1}`}
              />
            ))}
          </div>
          <button onClick={onNextQuote}>
            Next quote
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}

function Stat({ icon: Icon, label, value, subValue, tone, onClick }) {
  return (
    <article className={`stat-card ${tone} ${onClick ? 'clickable' : ''}`} onClick={onClick}>
      <Icon size={18} />
      <p>{label}</p>
      <strong>{value}</strong>
      {subValue ? <small className="stat-subvalue">{subValue}</small> : null}
    </article>
  );
}

function UrgeRescueModal({ secondsLeft }) {
  return (
    <div className="modal-backdrop sos-backdrop" role="dialog" aria-modal="true" aria-label="SOS Urge Rescue">
      <div className="sos-modal">
        <div className="section-heading">
          <div>
            <p className="section-kicker">SOS Urge Rescue</p>
            <h2>90-Second Reset</h2>
          </div>
        </div>

        <div className="sos-timer-display">
          <div className="timer-ring-large">
            <TimerReset size={48} />
            <strong>{formatTimer(secondsLeft)}</strong>
          </div>
          <h3>Hold steady for {secondsLeft} seconds</h3>
        </div>

        <div className="sos-instructions">
          <h4>Emergency Steps:</h4>
          <ol>
            <li>Put the phone down immediately</li>
            <li>Take 8 slow, deep breaths (4 in, hold 2, 6 out)</li>
            <li>Drink a full glass of water</li>
            <li>Repeat your sankalp once with conviction</li>
            <li>Move to a public place if needed</li>
          </ol>
        </div>

        <div className="sos-message">
          <p>This urge is temporary. Your commitment is stronger. Stay present.</p>
        </div>
      </div>
    </div>
  );
}

function RoadmapPanel({ items, progress, daysClean }) {
  const nextMilestone = items.find(item => item.status !== 'done');
  const completedCount = items.filter(item => item.status === 'done').length;
  const daysToNext = nextMilestone ? nextMilestone.day - daysClean : 0;

  return (
    <>
      {/* Hero Progress Card */}
      <section className="roadmap-hero">
        <div className="hero-stats">
          <div className="hero-stat">
            <div className="circular-progress">
              <svg viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" className="progress-bg" />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  className="progress-fill"
                  style={{
                    strokeDasharray: `${progress * 2.827} 282.7`,
                    transform: 'rotate(-90deg)',
                    transformOrigin: '50% 50%'
                  }}
                />
              </svg>
              <div className="progress-text">
                <strong>{progress}%</strong>
                <span>Complete</span>
              </div>
            </div>
          </div>
          <div className="hero-info">
            <h2>Day {daysClean} of 40</h2>
            <p className="hero-subtitle">
              {completedCount === items.length
                ? '🎉 All milestones unlocked!'
                : `${daysToNext} days until ${nextMilestone?.title || 'next milestone'}`}
            </p>
            <div className="milestone-badges">
              <div className="badge">
                <Target size={16} />
                <span>{completedCount}/{items.length}</span>
              </div>
              <div className="badge">
                <Flame size={16} />
                <span>{daysClean} days</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Milestones List */}
      <section className="roadmap-panel page-panel">
        <div className="section-heading">
          <div>
            <p className="section-kicker">Recovery Journey</p>
            <h2>Transformation Milestones</h2>
          </div>
        </div>
        <p className="panel-copy">Each milestone unlocks automatically as you progress. Complete the journey to rebuild your mind and life.</p>
        
        <div className="roadmap-list">
          {items.map((item, index) => (
            <article className={`roadmap-item ${item.status}`} key={item.day}>
              <div className="roadmap-number">{index + 1}</div>
              <div className="roadmap-content">
                <div className="roadmap-header">
                  <div>
                    <span className="roadmap-day">Day {item.day}</span>
                    <h3>{item.title}</h3>
                  </div>
                  <div className={`roadmap-badge ${item.status}`}>
                    {item.status === 'done' ? (
                      <>
                        <BadgeCheck size={18} />
                        <span>Done</span>
                      </>
                    ) : item.status === 'active' ? (
                      <>
                        <Target size={18} />
                        <span>Active</span>
                      </>
                    ) : (
                      <>
                        <Lock size={18} />
                        <span>Locked</span>
                      </>
                    )}
                  </div>
                </div>
                <p className="roadmap-detail">{item.detail}</p>
                {item.status === 'done' && (
                  <div className="roadmap-reward">
                    ✨ Milestone achieved! Keep going strong.
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
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

function SatsangPanel({ quote, onNextQuote, currentIndex, totalQuotes, completedPractices, todayKey, onToggle }) {
  const completedCount = practiceSeeds.filter(({ key }) =>
    completedPractices.includes(`${todayKey}:${key}`)
  ).length;
  const totalPractices = practiceSeeds.length;
  const progressPercent = Math.round((completedCount / totalPractices) * 100);

  return (
    <>
      <div className="meditate-hero">
        <div className="meditate-icon">
          <Leaf size={32} />
        </div>
        <h1 className="meditate-title">Meditation & Satsang</h1>
        <p className="meditate-subtitle">Spiritual practices for inner discipline and peace</p>
      </div>

      <GuruPanel quote={quote} onNextQuote={onNextQuote} currentIndex={currentIndex} totalQuotes={totalQuotes} />
      
      <section className="practice-summary">
        <div className="summary-header">
          <div>
            <p className="section-kicker">Today's Progress</p>
            <h2>Daily Practice Stack</h2>
          </div>
          <div className="progress-indicator">
            <strong>{completedCount}</strong>
            <span>/ {totalPractices}</span>
          </div>
        </div>
        <div className="progress-bar-large">
          <div className="progress-fill-large" style={{ width: `${progressPercent}%` }} />
        </div>
        <p className="summary-note">
          {completedCount === 0 && 'Begin with one practice to start building discipline'}
          {completedCount > 0 && completedCount < totalPractices && `${totalPractices - completedCount} practices remaining today`}
          {completedCount === totalPractices && '✨ All practices complete! Excellent discipline'}
        </p>
      </section>

      <section className="practice-panel-enhanced">
        <div className="practice-grid-enhanced">
          {practiceSeeds.map(({ icon: Icon, key, title, value }) => {
            const done = completedPractices.includes(`${todayKey}:${key}`);
            return (
              <button
                className={done ? 'practice-card-enhanced done' : 'practice-card-enhanced'}
                onClick={() => onToggle(key)}
                key={key}
              >
                <div className="practice-icon-circle">
                  <Icon size={24} />
                </div>
                <div className="practice-content">
                  <h3>{title}</h3>
                  <span>{done ? '✓ Completed' : value}</span>
                </div>
                {done && (
                  <div className="practice-check">
                    <BadgeCheck size={20} />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </section>

      <section className="meditation-tip">
        <div className="tip-icon">
          <Sparkles size={20} />
        </div>
        <div>
          <strong>Daily Discipline Tip</strong>
          <p>Complete these practices in order, ideally in the morning. Consistency builds the mental strength needed for recovery.</p>
        </div>
      </section>
    </>
  );
}

function MorePanel({
  communityJoined,
  onJoinCommunity,
  telegramUrl,
  subscription,
  authUser,
  onLogout,
}) {
  return (
    <>
      <div className="more-hero">
        <div className="more-icon">
          <HeartHandshake size={32} />
        </div>
        <h1 className="more-title">Community & Support</h1>
        <p className="more-subtitle">Connect with others and manage your account</p>
      </div>

      <section className="community-section">
        <div className="section-heading">
          <div>
            <p className="section-kicker">Join Us</p>
            <h2>Recovery Community</h2>
          </div>
          <HeartHandshake size={21} />
        </div>
        <p className="panel-copy">
          Connect with others on the same journey. Share experiences, get support, and stay accountable together.
        </p>
        <a
          className={communityJoined ? 'telegram-button joined' : 'telegram-button'}
          href={telegramUrl}
          target="_blank"
          rel="noreferrer"
          onClick={onJoinCommunity}
        >
          <div className="telegram-icon">
            <HeartHandshake size={24} />
          </div>
          <div className="telegram-content">
            <strong>{communityJoined ? 'Telegram Community' : 'Join Telegram Community'}</strong>
            <span>{communityJoined ? 'You\'re connected' : 'Free support & accountability'}</span>
          </div>
          <ChevronRight size={20} />
        </a>
      </section>

      <section className="account-section">
        <div className="section-heading">
          <div>
            <p className="section-kicker">Your Profile</p>
            <h2>Account Details</h2>
          </div>
          <UserRound size={21} />
        </div>
        
        <div className="account-info-card">
          <div className="info-row">
            <div className="info-icon">
              <UserRound size={20} />
            </div>
            <div className="info-content">
              <strong>{authUser?.name || 'Google User'}</strong>
              <span>{authUser?.email || 'Signed in with Google'}</span>
            </div>
          </div>
        </div>

        <div className="account-info-card">
          <div className="info-row">
            <div className="info-icon">
              <BadgeCheck size={20} />
            </div>
            <div className="info-content">
              <strong>{subscription?.label || 'No Plan'}</strong>
              <span>{subscription ? `${formatRupees(subscription.price)} · ${subscription.status || 'active'}` : 'Please subscribe'}</span>
            </div>
          </div>
        </div>

        <button className="logout-button" onClick={onLogout}>
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </section>

      <section className="resources-section">
        <div className="section-heading">
          <div>
            <p className="section-kicker">Quick Help</p>
            <h2>Recovery Resources</h2>
          </div>
          <Sparkles size={21} />
        </div>
        
        <div className="resource-cards">
          <div className="resource-card">
            <div className="resource-icon">
              <TimerReset size={24} />
            </div>
            <div className="resource-content">
              <strong>When Urges Strike</strong>
              <p>Go to Home → Use SOS 90-second reset immediately</p>
            </div>
          </div>

          <div className="resource-card">
            <div className="resource-icon">
              <Leaf size={24} />
            </div>
            <div className="resource-content">
              <strong>Daily Discipline</strong>
              <p>Visit Meditate tab and complete your spiritual practices</p>
            </div>
          </div>

          <div className="resource-card">
            <div className="resource-icon">
              <Bot size={24} />
            </div>
            <div className="resource-content">
              <strong>Need Guidance?</strong>
              <p>AI tab provides 24/7 support for any struggle or question</p>
            </div>
          </div>

          <div className="resource-card">
            <div className="resource-icon">
              <Target size={24} />
            </div>
            <div className="resource-content">
              <strong>Track Progress</strong>
              <p>Pledge tab shows your 40-day transformation roadmap</p>
            </div>
          </div>
        </div>
      </section>

      <div className="app-info">
        <p className="app-version">Reclaim · Version 1.0</p>
        <p className="app-tagline">Guruji's path to freedom and recovery</p>
      </div>
    </>
  );
}

function SavingsModal({ daysClean, moneySaved, quitDate, dailyCost, savingFor, onClose, onSave }) {
  const [draft, setDraft] = useState({
    dailyCost: dailyCost || 0,
  });

  function handleSave() {
    onSave({
      dailyCost: Number(draft.dailyCost || 0),
    });
  }

  // Generate day-wise breakdown
  const dayBreakdown = [];
  const startDate = new Date(quitDate);
  
  for (let i = 0; i < daysClean; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    dayBreakdown.push({
      day: i + 1,
      date: date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
      amount: Number(draft.dailyCost || 0),
    });
  }

  const totalSaved = dayBreakdown.reduce((sum, day) => sum + day.amount, 0);

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Savings details">
      <div className="savings-modal">
        <div className="section-heading">
          <div>
            <p className="section-kicker">Money Saved</p>
            <h2>{formatRupees(totalSaved)} Total</h2>
          </div>
          <button className="mini-button" type="button" onClick={onClose}>×</button>
        </div>

        {savingFor ? (
          <div className="savings-goal">
            <p>💰 Saving for: <strong>{savingFor}</strong></p>
          </div>
        ) : (
          <div className="savings-empty">
            <p>Set your savings goal in Settings (⚙️ icon)</p>
          </div>
        )}

        <div className="savings-config">
          <label>
            Daily cost (₹)
            <input
              type="number"
              min="0"
              placeholder="Amount saved per day"
              value={draft.dailyCost}
              onChange={(e) => setDraft({ ...draft, dailyCost: e.target.value })}
            />
          </label>
          <button className="primary-action" onClick={handleSave}>
            Update Daily Cost
          </button>
        </div>

        <div className="day-breakdown">
          <h3>Day-wise Breakdown ({daysClean} days)</h3>
          <div className="breakdown-list">
            {dayBreakdown.length > 0 ? (
              dayBreakdown.map((day) => (
                <div className="breakdown-row" key={day.day}>
                  <span>Day {day.day} · {day.date}</span>
                  <strong>{formatRupees(day.amount)}</strong>
                </div>
              ))
            ) : (
              <p className="empty-state">Start your streak to track daily savings!</p>
            )}
          </div>
        </div>

        <button className="ghost-action" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

function StatModal({ type, daysClean, maxStreak, moneySaved, clarity, relapses, quitDate, dailyCost, savingFor, completedPractices, onClose, onUpdateSavings }) {
  const getModalContent = () => {
    switch (type) {
      case 'Streak':
        return {
          icon: Flame,
          color: '#ffc46b',
          title: `${daysClean} Day Streak`,
          details: [
            { label: '🔥 Current streak', value: `${daysClean} day${daysClean === 1 ? '' : 's'}` },
            { label: '🏆 Best streak', value: `${maxStreak || 0} day${maxStreak === 1 ? '' : 's'}` },
            { label: '📅 Quit date', value: new Date(quitDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) },
            { label: '⏭ Next milestone', value: daysClean < 7 ? '7 days' : daysClean < 21 ? '21 days' : daysClean < 40 ? '40 days' : '90 days' },
          ],
          rulesTitle: 'How your streak is counted',
          rules: [
            '❌ Zero relapses since your quit date',
            '✅ At least 2 of 4 daily practices completed:',
            '   • 2 min breathing (8 rounds)',
            '   • Satsang clip (12 min)',
            '   • Journal (3 lines)',
            '   • No phone after 10:30 PM',
          ],
          message: daysClean === 1
            ? 'Great start! The first day is always the hardest. Keep going!'
            : daysClean < 7
            ? 'Building momentum. The first week is crucial — stay strong!'
            : daysClean < 21
            ? 'Past the first week! Keep protecting your progress.'
            : daysClean < 40
            ? 'Amazing! You\'re creating new neural pathways.'
            : 'Incredible! You\'re building a lasting transformation.',
        };
      case 'Saved':
        // This case is now handled by SavingsModal component
        return null;
      case 'Clarity': {
        // Recalculate for modal display
        const totalPractices = completedPractices.length;
        const practicesPerDay = daysClean > 0 ? totalPractices / daysClean : 0;
        const relapsePenalty = Math.min(20, relapses.length * 5);
        const timeRecovery = Math.min(70, (daysClean / 100) * 70);
        const practiceBonus = Math.min(30, practicesPerDay * 30);
        
        return {
          icon: TrendingUp,
          color: '#88c7ff',
          title: `${Math.round(clarity)}% Mental Clarity`,
          details: [
            { label: 'Current clarity', value: `${Math.round(clarity)}%` },
            { label: '📅 Time recovery (70% max)', value: `${Math.round(timeRecovery)}%` },
            { label: '🎯 Practice bonus (30% max)', value: `${Math.round(practiceBonus)}%` },
            { label: '❌ Relapse penalty', value: `-${relapsePenalty}%` },
            { label: 'Days clean', value: `${daysClean}/100 days` },
            { label: 'Total practices', value: totalPractices },
            { label: 'Avg practices/day', value: daysClean > 0 ? practicesPerDay.toFixed(1) : '0' },
          ],
          message: daysClean < 30
            ? '🧠 Brain fog clearing phase (Days 1-30): Early neuroplasticity begins. Focus on consistency.'
            : daysClean < 60
            ? '🌟 Dopamine rebalancing (Days 30-60): Neural pathways are rewiring. Keep building momentum.'
            : daysClean < 100
            ? '💪 Deep recovery phase (Days 60-100): Significant brain restoration. You\'re in the home stretch!'
            : '🎉 Full recovery achieved (100+ days): Your brain has rebuilt healthy neural pathways. Maintain with daily practices!',
        };
      }
      case 'Relapses':
        return {
          icon: ShieldCheck,
          color: '#ff9b9b',
          title: `${relapses.length} Relapses`,
          details: [
            { label: 'Total relapses', value: relapses.length },
            { label: 'Current streak', value: `${daysClean} days` },
            { label: 'Success rate', value: relapses.length === 0 ? '100%' : `${Math.round((daysClean / (daysClean + relapses.length)) * 100)}%` },
            { label: 'Last relapse', value: relapses.length > 0 ? new Date(relapses[0]).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'Never' },
          ],
          message: relapses.length === 0
            ? 'Perfect record! Keep protecting your streak with daily practices.'
            : 'Each relapse teaches you something. Learn the triggers and keep going.',
        };
      default:
        return null;
    }
  };

  const content = getModalContent();
  if (!content) return null;

  const Icon = content.icon;

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label={`${type} details`}>
      <div className="stat-modal">
        <div className="section-heading">
          <div>
            <p className="section-kicker">Recovery Stats</p>
            <h2>{content.title}</h2>
          </div>
          <button className="mini-button" type="button" onClick={onClose}>×</button>
        </div>
        
        <div className="stat-modal-content">
          <div className="stat-modal-icon" style={{ backgroundColor: `${content.color}20`, color: content.color }}>
            <Icon size={32} />
          </div>
          
          <div className="stat-details-list">
            {content.details.map((detail, index) => (
              <div className="stat-detail-row" key={index}>
                <span>{detail.label}</span>
                <strong>{detail.value}</strong>
              </div>
            ))}
          </div>

          {content.rules ? (
            <div className="streak-rules-card">
              <p className="streak-rules-title">{content.rulesTitle}</p>
              {content.rules.map((rule, i) => (
                <p className="streak-rules-line" key={i}>{rule}</p>
              ))}
            </div>
          ) : null}

          <p className="stat-modal-message">{content.message}</p>
        </div>

        <button className="ghost-action" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

function PledgeModal({ onConfirm, onClose }) {
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Daily pledge">
      <div className="pledge-modal">
        <div className="section-heading">
          <div>
            <p className="section-kicker">Daily Sankalp</p>
            <h2>Recovery Pledge</h2>
          </div>
          <button className="mini-button" type="button" onClick={onClose}>×</button>
        </div>
        
        <div className="pledge-content">
          <div className="pledge-icon">
            <BadgeCheck size={32} />
          </div>
          <div className="pledge-text">
            <p><strong>Today, I pledge to:</strong></p>
            <ul>
              <li>Protect my eyes and mind from triggering content</li>
              <li>Use the SOS rescue immediately when urges arise</li>
              <li>Complete at least one daily practice</li>
              <li>Keep my phone boundaries clean, especially at night</li>
              <li>Remember my sankalp and why I started this path</li>
            </ul>
            <p className="pledge-footer">I commit to these actions with full awareness and devotion to my recovery journey.</p>
          </div>
        </div>

        <div className="pledge-actions">
          <button className="primary-action wide" onClick={onConfirm}>
            <BadgeCheck size={18} />
            I take this pledge
          </button>
          <button className="ghost-action" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

function SettingsModal({ state, onClose, onSave, onReset, onLogout }) {
  const [draft, setDraft] = useState({
    quitDate: state.quitDate.slice(0, 10),
    savingFor: state.savingFor || '',
  });

  function submit(event) {
    event.preventDefault();
    onSave({
      ...state,
      quitDate: new Date(`${draft.quitDate}T00:00:00`).toISOString(),
      savingFor: draft.savingFor.trim(),
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
            required
          />
        </label>
        <label>
          Savings goal/purpose
          <input
            type="text"
            placeholder="E.g., New bike, Course fees, Family trip"
            value={draft.savingFor}
            onChange={(event) => setDraft({ ...draft, savingFor: event.target.value })}
            maxLength="50"
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
  const day = context.daysClean;
  const level = context.level || 'Moderate';
  const prefix = `Day ${day} · ${level} risk.`;

  // ── Urge / Temptation ───────────────────────────────────────────
  if (text.includes('urge') || text.includes('trigger') || text.includes('tempt') || text.includes('craving')) {
    const steps = [
      '1. Put the phone face-down RIGHT NOW.',
      '2. Stand up and move to a different room or outside.',
      '3. Drink a full glass of cold water slowly.',
      '4. Do 8 rounds of box breathing: 4 counts in · hold 2 · 6 counts out.',
      '5. Say your sankalp out loud once with full conviction.',
      '6. Text a friend or open the SOS timer in Home tab.',
    ];
    return `${prefix} An urge is a wave — it peaks in 90 seconds and fades on its own. Do NOT negotiate, do NOT bargain. Act immediately:\n\n${steps.join('\n')}\n\nUrges feel permanent but they never are. The moment you move your body, the urge loses 70% of its power. You have done this before. Do it again.`;
  }

  // ── Relapse ─────────────────────────────────────────────────────
  if (text.includes('relapse') || text.includes('failed') || text.includes('slip') || text.includes('fell')) {
    return `${prefix} A relapse is painful data, not a verdict on your character. Here is what to do right now:\n\n1. Log it honestly in the app — hiding it makes the next one more likely.\n2. Write down what happened: time, place, device, mood. That pattern is your real enemy.\n3. Remove or block whatever enabled it — delete the app, change the password, put the device in another room at night.\n4. Take tomorrow's pledge tonight, not tomorrow morning.\n5. Come back to day 1 without shame. Every expert on this path has reset. What separates them is they came back faster each time.\n\nGuruji says: one fall does not erase the climb. Stand up, wipe the dust, and walk again.`;
  }

  // ── Guilt / Shame ────────────────────────────────────────────────
  if (text.includes('guilt') || text.includes('shame') || text.includes('worthless') || text.includes('hate myself') || text.includes('bad person')) {
    return `${prefix} Guilt that becomes self-hate is the enemy of recovery — it creates the very emptiness that leads back to the habit. Here is the difference:\n\nHealthy guilt → "I did something I regret, I will correct it."\nToxic shame → "I am broken, what's the point."\n\nRight now:\n• Take a cold shower or splash cold water on your face.\n• Say out loud: "I am not this habit. I am bigger than this moment."\n• Do one small, clean action: make your bed, drink water, go for a 5-minute walk.\n• Write three lines in your journal about what you want your life to look like in 40 days.\n\nYou are not your worst moment. You are here, you are trying. That already makes you different from most.`;
  }

  // ── Boredom ──────────────────────────────────────────────────────
  if (text.includes('bored') || text.includes('nothing to do') || text.includes('free time') || text.includes('idle')) {
    return `${prefix} Boredom is one of the top three relapse triggers — your brain is used to filling empty moments with the habit. Here is what to do with unstructured time:\n\n• Physical: 20 push-ups, a walk outside, stretching.\n• Mental: Read 5 pages of a book, write in your journal, learn one new thing.\n• Social: Call a family member or friend — real conversation, not scrolling.\n• Spiritual: Listen to a satsang clip, recite a prayer, sit in silence for 5 minutes.\n\nBoredom is a signal that your life needs more richness, not more stimulation. Use this moment to build one of those four areas instead of escaping them.`;
  }

  // ── Stress / Anxiety ─────────────────────────────────────────────
  if (text.includes('stress') || text.includes('anxious') || text.includes('anxiety') || text.includes('pressure') || text.includes('overwhelm')) {
    return `${prefix} Stress is the second most common relapse trigger. Your nervous system is looking for a release — let's give it a clean one.\n\nImmediate relief (do this now):\n• 4-7-8 breathing: inhale 4, hold 7, exhale 8. Repeat 4 times.\n• Tense every muscle in your body for 5 seconds, then release completely.\n• Write down the ONE thing stressing you most. Just naming it reduces it by 40%.\n\nAfter 10 minutes:\n• Break the stressor into the smallest possible next action. Not "fix everything" — just "send one email" or "write one paragraph."\n• The habit never solved stress. It only delayed it and added shame on top.\n\nYou can handle this. You have handled harder things.`;
  }

  // ── Meditation / Calm ────────────────────────────────────────────
  if (text.includes('meditat') || text.includes('calm') || text.includes('peace') || text.includes('quiet') || text.includes('breathe')) {
    return `${prefix} A short practice you can do right now (5 minutes):\n\n1. Sit comfortably, close your eyes.\n2. Breathe in for 4 counts through your nose.\n3. Hold for 2 counts.\n4. Breathe out for 6 counts through your mouth.\n5. After 8 rounds, simply observe your breath without controlling it for 2 minutes.\n6. End by saying your sankalp silently three times.\n\nFor satsang: search for "Guruji bhajan" or any devotional audio you resonate with. Even 10 minutes of satsang rewires the mind away from craving and toward devotion. Make it part of your morning before you touch the phone for anything else.`;
  }

  // ── Isolation / Loneliness ───────────────────────────────────────
  if (text.includes('lonely') || text.includes('alone') || text.includes('no one') || text.includes('isolat')) {
    return `${prefix} Isolation is the third pillar of relapse — the habit thrives in private, in the dark, when you feel unseen. Break the isolation:\n\n• Call one person right now — family, friend, anyone. You do not have to explain your recovery. Just connect.\n• Join our Telegram community (More tab) — there are others on day 1, day 10, day 40, all walking this same path.\n• Go somewhere public: a chai stall, library, park. Physical presence with others breaks the spiral.\n\nRemember: the habit promised you company but kept you more alone. Real connection is the cure — even a 5-minute phone call counts.`;
  }

  // ── Sleep / Night ────────────────────────────────────────────────
  if (text.includes('sleep') || text.includes('night') || text.includes('late') || text.includes('insomnia') || text.includes('bed')) {
    return `${prefix} Late nights are a high-risk window for urges. Your willpower depletes through the day and is lowest after 10 PM. Protect this time:\n\nEvening protocol:\n• Phone charger in the hall or kitchen — not the bedroom.\n• No social media or YouTube after 10:30 PM.\n• Before bed: 5 min breathing + say your sankalp + write one line in your journal.\n• If you cannot sleep: do the breathing exercise lying down. Do NOT open the phone.\n\nYour brain needs the deep sleep cycles to rebuild dopamine receptors damaged by the habit. Protecting your nights is protecting your recovery.`;
  }

  // ── Progress / Motivation ────────────────────────────────────────
  if (text.includes('motivat') || text.includes('progress') || text.includes('how am i') || text.includes('worth it') || text.includes('give up')) {
    const dayMessage = day === 0
      ? 'You are at the beginning. Every expert was once here. The decision to start is 50% of the battle.'
      : day < 7
      ? `Day ${day} — you are through the hardest part. Most people give up in the first 72 hours. You did not.`
      : day < 21
      ? `Day ${day} — your brain is already rewiring. Dopamine receptors are starting to rebalance. You are past the peak withdrawal.`
      : day < 40
      ? `Day ${day} — you are in the deep recovery zone. Neural pathways for the habit are weakening. New ones are forming around discipline and clarity.`
      : `Day ${day} — extraordinary. You are in the top 3% of people who attempt this journey. Your brain has rebuilt significant capacity for focus, confidence, and peace.`;

    return `${dayMessage}\n\nThis is worth it because:\n• Your focus and memory are measurably improving.\n• Testosterone and confidence return around day 14-21.\n• Relationships and eye contact become easier.\n• The shame and fog that came with the habit are clearing.\n\nOne day at a time. You do not need to reach day 40 today. You only need to protect the next 90 minutes.`;
  }

  // ── No pledge taken ──────────────────────────────────────────────
  if (!context.pledgedToday) {
    return `${prefix} You have not taken today's pledge yet. That is your first action — everything else builds on it.\n\nGo to the Home tab → tap "Take Pledge" → read each line with full intention.\n\nThe pledge is not a formality. It is a daily decision to be conscious. People who take a daily pledge are 3x more consistent in recovery than those who only use willpower alone. Willpower runs out. A pledge reconnects you to your reason.`;
  }

  // ── Default / General ────────────────────────────────────────────
  const generalTips = [
    `${prefix} You have pledged today — that is your foundation. Now protect it:\n\n• Morning: breathing + satsang before phone.\n• Afternoon: if boredom hits, move your body.\n• Evening: journal 3 lines before 10 PM.\n• Night: phone away from the bedroom.\n\nThe habit does not disappear — you outgrow it by filling your life with better things. What is one area of your life you want to rebuild? Focus there today.`,
    `${prefix} A reminder of what you are building:\n\nDay 7 — fog clears, sleep improves.\nDay 14 — confidence and energy return.\nDay 21 — new habits are forming in your brain.\nDay 40 — you are a different person with a different relationship to your mind.\nDay 90 — full neurological recovery for most people.\n\nYou are not just quitting something. You are building someone. What does that person look like? Write it down tonight.`,
    `${prefix} The three enemies of your streak today are: boredom, isolation, and the thought "just this once."\n\nWhen boredom comes: move your body or learn something.\nWhen isolation comes: call someone or go somewhere.\nWhen "just this once" comes: remember it has never been just once. Use SOS immediately.\n\nYou already know what to do. Trust that knowledge.`,
  ];
  return generalTips[day % generalTips.length];
}

createRoot(document.getElementById('root')).render(<App />);
