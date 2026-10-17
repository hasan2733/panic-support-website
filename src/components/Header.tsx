import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogoMark } from './ui';
import { IconBook, IconChat, IconHome, IconJournal, IconLeaf, IconMore, IconGround } from './icons';

const NAV_ITEMS = [
  { id: 'home', label: 'Home', Icon: IconHome },
  { id: 'journal', label: 'Journal', Icon: IconJournal },
  { id: 'practice', label: 'Practice', Icon: IconLeaf },
  { id: 'learn', label: 'Learn', Icon: IconBook },
  { id: 'chat', label: 'Chat', Icon: IconChat },
  { id: 'more', label: 'More', Icon: IconMore },
];

export default function Header() {
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navOpen, setNavOpen] = useState(true);

  const handleLogout = () => {
    window.location.href = '/';
  };

  const navLinks = (mobile = false) =>
    NAV_ITEMS.map((item) => (
      <a
        key={item.id}
        href={`#${item.id}`}
        onClick={() => {
          setMobileMenuOpen(false);
          setNavOpen(false);
        }}
        className={`flex items-center gap-3 rounded-full px-3 py-2 text-sm font-medium text-mist-500 transition-colors hover:bg-glow-500/10 hover:text-glow-300 ${
          mobile ? 'w-full justify-center' : ''
        }`}
      >
        <item.Icon className="h-4 w-4" />
        <span>{item.label}</span>
      </a>
    ));

  return (
    <>
      {/* Main header - visible on all screen sizes */}
      <header className="sticky top-0 z-30 border-b border-night-700/70 bg-white/85 backdrop-blur-xl">
        <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <a href="#home" className="flex shrink-0 items-center gap-3" aria-label="Panic Support home">
            <LogoMark size="sm" />
            <span className="hidden font-display text-lg font-medium text-mist-50 sm:inline">
              Panic Support
            </span>
          </a>

          {/* Vertical nav bar - hidden on small screens, visible on lg+ */}
          <nav aria-label="Main navigation" className="hidden lg:flex items-stretch">
            <button
              onClick={() => setNavOpen(!navOpen)}
              className="hidden h-10 w-10 items-center justify-center rounded-full border border-night-700 text-mist-300 hover:bg-night-900 lg:flex"
              aria-label={navOpen ? 'Close navigation' : 'Open navigation'}
            >
              <span className="text-lg font-bold text-glow-300" aria-hidden="true">
                (=)
              </span>
            </button>
            <div className={`flex flex-col gap-1 rounded-full border border-night-700 bg-night-900/50 p-2 transition-all ${
              navOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
            }`}>
              {navLinks()}
            </div>
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            {user ? (
              <button
                onClick={handleLogout}
                className="rounded-full px-4 py-2 text-sm font-semibold text-mist-300 hover:bg-night-900"
              >
                Sign out
              </button>
            ) : (
              <>
                <a
                  href="#"
                  className="rounded-full px-4 py-2 text-sm font-semibold text-mist-300 hover:bg-night-900"
                >
                  Sign in
                </a>
                <a
                  href="#"
                  className="rounded-full bg-glow-400 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-glow-700"
                >
                  Sign up
                </a>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            aria-expanded={mobileMenuOpen}
            aria-controls="header-mobile-menu"
            className="grid h-10 w-10 place-items-center rounded-full border border-night-700 text-mist-300 hover:bg-night-900 lg:hidden"
          >
            <span className="sr-only">{mobileMenuOpen ? 'Close menu' : 'Open menu'}</span>
            <svg className="h-5 w-5" stroke="currentColor" fill="none" viewBox="0 0 24 24" aria-hidden="true">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m6 6 12 12M18 6 6 18" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu - vertical, slides down */}
        {mobileMenuOpen && (
          <div id="header-mobile-menu" className="border-t border-night-700/70 bg-white px-4 pb-4 pt-2 lg:hidden">
            <nav aria-label="Mobile navigation" className="flex flex-col gap-1">
              {navLinks(true)}
            </nav>
            <div className="mt-3 grid grid-cols-2 gap-2 border-t border-night-700/70 pt-3">
              {user ? (
                <button
                  onClick={handleLogout}
                  className="col-span-2 rounded-full bg-night-900 px-4 py-2.5 text-sm font-semibold text-mist-300"
                >
                  Sign out
                </button>
              ) : (
                <>
                  <a href="#" className="rounded-full border border-night-700 px-4 py-2.5 text-center text-sm font-semibold text-mist-300">
                    Sign in
                  </a>
                  <a href="#" className="rounded-full bg-glow-400 px-4 py-2.5 text-center text-sm font-semibold text-white">
                    Sign up
                  </a>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Floating Emergency Alert Button */}
      <button
        onClick={() => {
          const event = new CustomEvent('open-emergency-alert');
          window.dispatchEvent(event);
        }}
        aria-label="Emergency alert"
        className="fixed z-50 right-4 top-4 h-14 w-14 rounded-full bg-rosesoft-300 hover:bg-rosesoft-300/80 text-white shadow-lg flex items-center justify-center transition-all"
      >
        <IconGround className="h-6 w-6" />
      </button>
    </>
  );
}
