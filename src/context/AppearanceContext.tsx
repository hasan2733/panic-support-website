import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

export type Theme = 'day' | 'night' | 'read';
export type FontSize = 'normal' | 'large' | 'larger';

interface Appearance {
  theme: Theme;
  fontSize: FontSize;
  setTheme: (theme: Theme) => void;
  setFontSize: (fontSize: FontSize) => void;
}

const STORAGE_KEY = 'psw_appearance';
const AppearanceContext = createContext<Appearance | null>(null);

function readAppearance(): Pick<Appearance, 'theme' | 'fontSize'> {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const value = JSON.parse(saved) as { theme?: string; fontSize?: string };
      return {
        theme: value.theme === 'night' || value.theme === 'read' ? value.theme : 'day',
        fontSize:
          value.fontSize === 'large' || value.fontSize === 'larger'
            ? value.fontSize
            : 'normal',
      };
    }
  } catch {
    // Invalid or unavailable local preferences fall back to the accessible defaults.
  }
  return { theme: 'day', fontSize: 'normal' };
}

export function AppearanceProvider({ children }: { children: ReactNode }) {
  const [appearance, setAppearance] = useState(readAppearance);

  useEffect(() => {
    document.documentElement.dataset.theme = appearance.theme;
    document.documentElement.dataset.fontSize = appearance.fontSize;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appearance));
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', appearance.theme === 'night' ? '#101713' : appearance.theme === 'read' ? '#f4efe2' : '#f7f8f4');
  }, [appearance]);

  const value: Appearance = {
    ...appearance,
    setTheme: (theme) => setAppearance((current) => ({ ...current, theme })),
    setFontSize: (fontSize) =>
      setAppearance((current) => ({ ...current, fontSize })),
  };

  return (
    <AppearanceContext.Provider value={value}>
      {children}
    </AppearanceContext.Provider>
  );
}

export function useAppearance(): Appearance {
  const value = useContext(AppearanceContext);
  if (!value) {
    throw new Error('useAppearance must be used inside <AppearanceProvider>');
  }
  return value;
}
