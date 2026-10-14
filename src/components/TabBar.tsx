/**
 * Bottom tab bar for phone-first navigation.
 * "More" opens a small menu with the secondary screens.
 */
import type { ComponentType } from 'react';
import type { MoreView, TabId } from '../types';
import {
  IconBook,
  IconChart,
  IconChat,
  IconGear,
  IconHands,
  IconHome,
  IconJournal,
  IconLeaf,
  IconMore,
} from './icons';

const TABS: { id: TabId; label: string; Icon: ComponentType<{ className?: string }> }[] = [
  { id: 'home', label: 'Home', Icon: IconHome },
  { id: 'journal', label: 'Journal', Icon: IconJournal },
  { id: 'practice', label: 'Practice', Icon: IconLeaf },
  { id: 'learn', label: 'Learn', Icon: IconBook },
  { id: 'chat', label: 'Chat', Icon: IconChat },
  { id: 'more', label: 'More', Icon: IconMore },
];

const MORE_ITEMS: {
  view: Exclude<MoreView, null>;
  label: string;
  hint: string;
  Icon: ComponentType<{ className?: string }>;
}[] = [
  { view: 'episodes', label: 'Episode tracker', hint: 'A calm record of what passed', Icon: IconChart },
  { view: 'faith', label: 'Faith corner', hint: 'Optional space for reflection', Icon: IconHands },
  { view: 'settings', label: 'Settings', hint: 'Keys, plan, and your data', Icon: IconGear },
];

export default function TabBar({
  tab,
  onTab,
  moreOpen,
  onMoreOpen,
  onMoreSelect,
}: {
  tab: TabId;
  onTab: (t: TabId) => void;
  moreOpen: boolean;
  onMoreOpen: (open: boolean) => void;
  onMoreSelect: (v: Exclude<MoreView, null>) => void;
}) {
  return (
    <>
      {moreOpen && (
        <div
          className="fixed inset-0 z-40 bg-mist-50/25 backdrop-blur-[2px]"
          onClick={() => onMoreOpen(false)}
        >
          <div
            className="absolute bottom-[calc(5.5rem+env(safe-area-inset-bottom))] left-3 right-3 rounded-3xl p-2 glass-dock sm:left-auto sm:right-auto sm:mx-auto sm:w-80 lg:bottom-auto lg:top-[5.25rem]"
            onClick={(e) => e.stopPropagation()}
          >
            {MORE_ITEMS.map((item) => (
              <button
                key={item.view}
                onClick={() => onMoreSelect(item.view)}
                className="w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-left text-mist-100 hover:bg-night-900"
              >
                <span className="w-10 h-10 rounded-2xl bg-glow-500/10 text-glow-300 grid place-items-center">
                  <item.Icon className="w-[18px] h-[18px]" />
                </span>
                <span>
                  <span className="block font-medium">{item.label}</span>
                  <span className="block text-xs text-mist-500 mt-0.5">{item.hint}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      <nav
        className="fixed bottom-3 left-3 right-3 z-40 lg:bottom-auto lg:left-5 lg:right-5 lg:top-5"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="mx-auto max-w-5xl rounded-[1.7rem] px-1.5 py-1.5 glass-dock lg:rounded-2xl lg:px-3 lg:py-2">
          <div className="grid grid-cols-6">
            {TABS.map((t) => {
              const active =
                t.id === 'more'
                  ? tab === 'more' || moreOpen
                  : tab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() =>
                    t.id === 'more' ? onMoreOpen(!moreOpen) : onTab(t.id)
                  }
                  aria-current={active && t.id !== 'more' ? 'page' : undefined}
                  aria-expanded={t.id === 'more' ? moreOpen : undefined}
                  className={`relative flex flex-col items-center gap-1 py-2 text-[10px] tracking-wide font-medium lg:flex-row lg:justify-center lg:gap-2 lg:px-3 lg:text-xs ${
                    active ? 'text-glow-300' : 'text-mist-600 hover:text-mist-300'
                  }`}
                >
                  {active && (
                    <span className="absolute inset-x-1.5 top-1 bottom-1 rounded-2xl bg-glow-400/12" />
                  )}
                  <t.Icon className="relative w-[18px] h-[18px]" />
                  <span className="relative">{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>
    </>
  );
}
