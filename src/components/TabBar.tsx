/**
 * Responsive navigation: a collapsible vertical sidebar on desktop and a
 * compact bottom bar with a secondary-screen menu on small screens.
 */
import type { ComponentType } from 'react';
import type { MoreView, TabId } from '../types';
import {
  IconBook,
  IconChart,
  IconChat,
  IconGear,
  IconGround,
  IconHands,
  IconHome,
  IconJournal,
  IconLeaf,
  IconMore,
} from './icons';

type NavEntry =
  | { tab: TabId; label: string; Icon: ComponentType<{ className?: string }> }
  | {
      view: Exclude<MoreView, null>;
      label: string;
      Icon: ComponentType<{ className?: string }>;
    };

const TABS: { id: TabId; label: string; Icon: ComponentType<{ className?: string }> }[] = [
  { id: 'home', label: 'Home', Icon: IconHome },
  { id: 'journal', label: 'Journal', Icon: IconJournal },
  { id: 'practice', label: 'Practice', Icon: IconLeaf },
  { id: 'learn', label: 'Learn', Icon: IconBook },
  { id: 'chat', label: 'Chat', Icon: IconChat },
  { id: 'more', label: 'More', Icon: IconMore },
];

const DESKTOP_ENTRIES: NavEntry[] = [
  { tab: 'home', label: 'Home', Icon: IconHome },
  { tab: 'journal', label: 'Journal', Icon: IconJournal },
  { tab: 'practice', label: 'Practice', Icon: IconLeaf },
  { tab: 'learn', label: 'Learn', Icon: IconBook },
  { tab: 'chat', label: 'Chat', Icon: IconChat },
  { view: 'episodes', label: 'Episode tracker', Icon: IconChart },
  { view: 'faith', label: 'Faith corner', Icon: IconHands },
  { view: 'emergency-map', label: 'Nearby hospitals', Icon: IconGround },
  { view: 'settings', label: 'Settings', Icon: IconGear },
];

const MORE_ITEMS: {
  view: Exclude<MoreView, null>;
  label: string;
  hint: string;
  Icon: ComponentType<{ className?: string }>;
}[] = [
  { view: 'episodes', label: 'Episode tracker', hint: 'A calm record of what passed', Icon: IconChart },
  { view: 'faith', label: 'Faith corner', hint: 'Optional space for reflection', Icon: IconHands },
  { view: 'emergency-map', label: 'Nearby hospitals', hint: 'Find hospitals near you', Icon: IconGround },
  { view: 'settings', label: 'Settings', hint: 'Appearance, profile, and safety', Icon: IconGear },
];

export default function TabBar({
  tab,
  moreView,
  onTab,
  moreOpen,
  onMoreOpen,
  onMoreSelect,
  navExpanded,
  onNavToggle,
}: {
  tab: TabId;
  moreView: MoreView;
  onTab: (t: TabId) => void;
  moreOpen: boolean;
  onMoreOpen: (open: boolean) => void;
  onMoreSelect: (v: Exclude<MoreView, null>) => void;
  navExpanded: boolean;
  onNavToggle: () => void;
}) {
  const desktopButton = (entry: NavEntry) => {
    const active = 'tab' in entry ? tab === entry.tab && moreView === null : moreView === entry.view;
    return (
      <button
        key={'tab' in entry ? entry.tab : entry.view}
        onClick={() => 'tab' in entry ? onTab(entry.tab) : onMoreSelect(entry.view)}
        aria-current={active ? 'page' : undefined}
        title={entry.label}
        className={`flex min-h-11 w-full items-center gap-3 rounded-2xl px-3 text-left text-sm font-semibold transition-colors ${
          active
            ? 'bg-glow-500/25 text-mist-50 shadow-sm'
            : 'text-mist-300 hover:bg-white/40 hover:text-mist-50'
        } ${navExpanded ? '' : 'justify-center px-0'}`}
      >
        <entry.Icon className="h-5 w-5 shrink-0" />
        {navExpanded ? <span>{entry.label}</span> : <span className="sr-only">{entry.label}</span>}
      </button>
    );
  };

  return (
    <>
      {moreOpen && (
        <div
          className="fixed inset-0 z-40 bg-mist-50/25 backdrop-blur-[2px] lg:hidden"
          onClick={() => onMoreOpen(false)}
        >
          <div
            className="absolute bottom-[calc(5.5rem+env(safe-area-inset-bottom))] left-3 right-3 rounded-3xl border border-night-700 bg-night-800 p-2 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            {MORE_ITEMS.map((item) => (
              <button
                key={item.view}
                onClick={() => onMoreSelect(item.view)}
                className="flex w-full items-center gap-3 rounded-2xl px-3.5 py-3 text-left text-mist-50 hover:bg-white/40"
              >
                <span className="grid h-10 w-10 place-items-center rounded-2xl border border-glow-400/30 bg-glow-500/20 text-glow-700">
                  <item.Icon className="h-[18px] w-[18px]" />
                </span>
                <span>
                  <span className="block font-medium">{item.label}</span>
                  <span className="mt-0.5 block text-xs text-mist-500">{item.hint}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      <aside
        aria-label="Main navigation"
        className={`fixed left-4 top-4 bottom-4 z-40 hidden flex-col rounded-[1.7rem] border border-night-700 bg-night-800 p-2 shadow-[0_16px_48px_rgba(0,0,0,0.22)] transition-[width] lg:flex ${
          navExpanded ? 'w-60' : 'w-[4.5rem]'
        }`}
      >
        <button
          type="button"
          onClick={onNavToggle}
          aria-label={navExpanded ? 'Collapse navigation' : 'Expand navigation'}
          aria-expanded={navExpanded}
          className={`mb-3 flex h-11 shrink-0 items-center rounded-2xl border border-night-700 text-mist-50 hover:bg-white/40 ${
            navExpanded ? 'justify-between px-3' : 'justify-center'
          }`}
        >
          {navExpanded && <span className="text-sm font-semibold text-mist-50">Navigation</span>}
          <span aria-hidden="true" className="rounded-lg bg-glow-500/25 px-1.5 py-0.5 font-mono text-lg font-bold text-mist-50"> (=) </span>
        </button>
        <nav className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto">
          {DESKTOP_ENTRIES.map((entry, index) => (
            <div key={'tab' in entry ? entry.tab : entry.view}>
              {index === 5 && <div className="my-2 border-t border-white/10" />}
              {desktopButton(entry)}
            </div>
          ))}
        </nav>
      </aside>

      <nav
        aria-label="Mobile navigation"
        className="fixed bottom-3 left-3 right-3 z-40 lg:hidden"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="mx-auto max-w-5xl rounded-[1.7rem] border border-night-700 bg-night-800 px-1.5 py-1.5 shadow-[0_12px_36px_rgba(36,56,43,0.18)]">
          <div className="grid grid-cols-6">
            {TABS.map((item) => {
              const active = item.id === 'more'
                ? moreOpen || tab === 'more'
                : tab === item.id && moreView === null;
              return (
                <button
                  key={item.id}
                  onClick={() => item.id === 'more' ? onMoreOpen(!moreOpen) : onTab(item.id)}
                  aria-current={active && item.id !== 'more' ? 'page' : undefined}
                  aria-expanded={item.id === 'more' ? moreOpen : undefined}
                  className={`relative flex flex-col items-center gap-1 py-2 text-[10px] font-medium tracking-wide ${
                    active ? 'text-mist-50' : 'text-mist-300 hover:text-mist-50'
                  }`}
                >
                  {active && <span className="absolute inset-x-1.5 top-1 bottom-1 rounded-2xl border border-glow-400/40 bg-glow-500/25" />}
                  <item.Icon className="relative h-[18px] w-[18px]" />
                  <span className="relative">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>
    </>
  );
}
