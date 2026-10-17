/**
 * App shell: auth gating, bottom tab navigation, Panic Mode overlay,
 * and a floating "need help now" button visible on every screen.
 * Also listens for emergency alert events.
 */
import { useEffect, useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import AuthScreen from './components/AuthScreen';
import Dashboard from './components/Dashboard';
import EpisodeTracker from './components/EpisodeTracker';
import FaithCorner from './components/FaithCorner';
import LearningLibrary from './components/LearningLibrary';
import PanicMode from './components/PanicMode';
import PracticeStudio from './components/PracticeStudio';
import Settings from './components/Settings';
import TabBar from './components/TabBar';
import AIChat from './components/AIChat';
import ThoughtJournal from './components/ThoughtJournal';
import { AppearanceProvider } from './context/AppearanceContext';
import { IconGround, IconHelp } from './components/icons';
import { LogoMark } from './components/ui';
import type { MoreView, TabId } from './types';
import { EmergencyMap } from './components/EmergencyMap';
import { EmergencyNotification } from './components/EmergencyNotification';

function Shell() {
  const { user, loading, authError } = useAuth();
  const [tab, setTab] = useState<TabId>('home');
  const [moreOpen, setMoreOpen] = useState(false);
  const [moreView, setMoreView] = useState<MoreView>(null);
  const [navExpanded, setNavExpanded] = useState(true);
  const [panicOpen, setPanicOpen] = useState(false);
  const [showEmergencyAlert, setShowEmergencyAlert] = useState(false);

  useEffect(() => {
    const handleEmergencyAlert = () => {
      setShowEmergencyAlert(true);
    };
    window.addEventListener('open-emergency-alert', handleEmergencyAlert);
    return () => {
      window.removeEventListener('open-emergency-alert', handleEmergencyAlert);
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <LogoMark size="lg" />
          </div>
          <p className="text-mist-500 text-sm">Settling into your space…</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthScreen startupError={authError} />;
  }

  const goTab = (t: TabId) => {
    setTab(t);
    setMoreView(null);
    setMoreOpen(false);
    window.scrollTo({ top: 0 });
  };

  const goMore = (v: Exclude<MoreView, null>) => {
    setTab('more');
    setMoreView(v);
    setMoreOpen(false);
    window.scrollTo({ top: 0 });
  };

  const openPanic = () => setPanicOpen(true);

  const renderMore = () => {
    switch (moreView) {
      case 'episodes':
        return <EpisodeTracker />;
      case 'faith':
        return <FaithCorner />;
      case 'settings':
        return <Settings />;
      case 'emergency-map':
        return <EmergencyMap />;
      default:
        return null;
    }
  };

  const renderTab = () => {
    if (moreView) return renderMore();
    switch (tab) {
      case 'home':
        return <Dashboard onTab={goTab} onPanic={openPanic} />;
      case 'journal':
        return <ThoughtJournal />;
      case 'practice':
        return <PracticeStudio />;
      case 'learn':
        return <LearningLibrary />;
      case 'chat':
        return <AIChat onSettings={() => goMore('settings')} />;
      case 'more':
        return null;
    }
  };

  return (
    <div className={`min-h-dvh transition-[padding] ${navExpanded ? 'lg:pl-64' : 'lg:pl-20'}`}>
      {renderTab()}

      <button
        type="button"
        onClick={() => setShowEmergencyAlert(true)}
        aria-label="Open emergency email alert"
        className="fixed right-4 top-4 z-40 grid h-12 w-12 place-items-center rounded-full border border-rosesoft-300/40 bg-rosesoft-300 text-white shadow-lg transition hover:bg-rosesoft-300/90"
      >
        <IconGround className="h-6 w-6" />
      </button>

      {!panicOpen && (
        <button
          onClick={openPanic}
          aria-label="Open a calm help space"
          className="fixed z-40 right-4 bottom-[calc(5.85rem+env(safe-area-inset-bottom))] h-12 pl-3 pr-4 rounded-full glass-dock text-glow-200 text-sm font-medium flex items-center gap-2 hover:bg-white/5"
        >
          <span className="w-7 h-7 rounded-full bg-glow-400/15 text-glow-300 grid place-items-center">
            <IconHelp className="w-4 h-4" />
          </span>
          Need help
        </button>
      )}

      {/* Emergency Alert Modal - shown when floating button is clicked */}
      {showEmergencyAlert && (
        <EmergencyNotification onClose={() => setShowEmergencyAlert(false)} />
      )}

      <TabBar
        tab={tab}
        moreView={moreView}
        onTab={goTab}
        moreOpen={moreOpen}
        onMoreOpen={setMoreOpen}
        onMoreSelect={goMore}
        navExpanded={navExpanded}
        onNavToggle={() => setNavExpanded((expanded) => !expanded)}
      />

      {panicOpen && (
        <PanicMode
          onClose={() => setPanicOpen(false)}
          onLogEpisode={() => {
            setPanicOpen(false);
            goMore('episodes');
          }}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AppearanceProvider>
      <AuthProvider>
        <Shell />
      </AuthProvider>
    </AppearanceProvider>
  );
}
