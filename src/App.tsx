/**
 * App shell: auth gating, bottom tab navigation, Panic Mode overlay,
 * and a floating "need help now" button visible on every screen.
 */
import { useState } from 'react';
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
import { IconHelp } from './components/icons';
import { LogoMark } from './components/ui';
import type { MoreView, TabId } from './types';

function Shell() {
  const { user, loading } = useAuth();
  const [tab, setTab] = useState<TabId>('home');
  const [moreOpen, setMoreOpen] = useState(false);
  const [moreView, setMoreView] = useState<MoreView>(null);
  const [panicOpen, setPanicOpen] = useState(false);

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

  if (!user) return <AuthScreen />;

  const goTab = (t: TabId) => {
    setTab(t);
    setMoreView(null);
    setMoreOpen(false);
    window.scrollTo({ top: 0 });
  };

  const goMore = (v: Exclude<MoreView, null>) => {
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
        return <AIChat onTab={goTab} />;
      case 'more':
        return null;
    }
  };

  return (
    <div className="min-h-dvh">
      {renderTab()}

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

      <TabBar
        tab={tab}
        onTab={goTab}
        moreOpen={moreOpen}
        onMoreOpen={setMoreOpen}
        onMoreSelect={goMore}
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
