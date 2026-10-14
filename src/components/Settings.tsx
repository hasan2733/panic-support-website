/**
 * Settings: OpenRouter API key, safety plan, data export, delete-all,
 * disclaimer, and sign out.
 */
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useAppearance } from '../context/AppearanceContext';
import {
  exportUserData,
  getUserDoc,
  setUserDoc,
  wipeUserData,
} from '../lib/db';
import type { PlanDoc } from '../types';
import { getStoredKey, getStoredModel } from './AIChat';
import {
  Card,
  Field,
  GhostButton,
  PageHeader,
  PrimaryButton,
  SafetyNote,
  Screen,
} from './ui';

const KEY_STORAGE = 'psw_openrouter_key';
const MODEL_STORAGE = 'psw_openrouter_model';

export default function Settings() {
  const { user, logOut } = useAuth();
  const { theme, fontSize, setTheme, setFontSize } = useAppearance();
  const uid = user?.uid ?? null;

  // OpenRouter key (stored ONLY in this browser's localStorage).
  const [key, setKey] = useState('');
  const [keySaved, setKeySaved] = useState(false);
  const [model, setModel] = useState('');

  // Safety plan (stored in Firestore under the user's own tree).
  const [steps, setSteps] = useState('');
  const [contacts, setContacts] = useState('');
  const [emergency, setEmergency] = useState('');
  const [planMsg, setPlanMsg] = useState('');

  const [exportMsg, setExportMsg] = useState('');
  const [confirmWipe, setConfirmWipe] = useState(false);

  useEffect(() => {
    setKeySaved(getStoredKey().length > 0);
    setModel(getStoredModel());
    if (!uid) return;
    getUserDoc<PlanDoc>(uid, 'plans', 'safety-plan').then((p) => {
      if (!p) return;
      try {
        const parsed = JSON.parse(p.body) as {
          steps?: string;
          contacts?: string;
          emergency?: string;
        };
        setSteps(parsed.steps ?? '');
        setContacts(parsed.contacts ?? '');
        setEmergency(parsed.emergency ?? '');
      } catch {
        /* ignore malformed plan */
      }
    });
  }, [uid]);

  const saveKey = () => {
    if (key.trim()) {
      localStorage.setItem(KEY_STORAGE, key.trim());
      setKey('');
      setKeySaved(true);
    }
  };
  const clearKey = () => {
    localStorage.removeItem(KEY_STORAGE);
    setKeySaved(false);
  };
  const saveModel = () => {
    localStorage.setItem(MODEL_STORAGE, model.trim() || 'openai/gpt-oss-20b:free');
  };

  const savePlan = async () => {
    if (!uid) return;
    await setUserDoc(uid, 'plans', 'safety-plan', {
      title: 'Safety plan',
      body: JSON.stringify({ steps, contacts, emergency }),
      updatedAt: Date.now(),
    });
    setPlanMsg('Safety plan saved.');
    window.setTimeout(() => setPlanMsg(''), 3000);
  };

  const doExport = async () => {
    if (!uid) return;
    const data = await exportUserData(uid);
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `panic-support-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setExportMsg('Downloaded your data as JSON.');
    window.setTimeout(() => setExportMsg(''), 3000);
  };

  const doWipe = async () => {
    if (!uid) return;
    await wipeUserData(uid);
    setConfirmWipe(false);
    // Also clear local chat settings for a full reset.
    localStorage.removeItem(KEY_STORAGE);
    setKeySaved(false);
  };

  return (
    <Screen>
      <PageHeader
        kicker="Account"
        title="Settings"
        sub="Your keys stay in this browser. Your notes stay in your account."
      />

      <Card className="mb-4">
        <h3 className="mb-1 font-display text-lg text-mist-50">Appearance & reading</h3>
        <p className="mb-4 text-sm leading-relaxed text-mist-500">
          These preferences apply throughout the app and stay saved on this device.
        </p>
        <Field label="Theme">
          <select
            value={theme}
            onChange={(event) => {
              const value = event.currentTarget.value;
              if (value === 'day' || value === 'night' || value === 'read') {
                setTheme(value);
              }
            }}
            aria-label="Color theme"
          >
            <option value="day">Day — light and fresh</option>
            <option value="night">Night — low-light colors</option>
            <option value="read">Read — warm paper tones</option>
          </select>
        </Field>
        <Field label="Text size" hint="Choose a comfortable size. Larger sizes also increase spacing.">
          <select
            value={fontSize}
            onChange={(event) => {
              const value = event.currentTarget.value;
              if (value === 'normal' || value === 'large' || value === 'larger') {
                setFontSize(value);
              }
            }}
            aria-label="Text size"
          >
            <option value="normal">Normal</option>
            <option value="large">Large</option>
            <option value="larger">Extra large</option>
          </select>
        </Field>
      </Card>

      <Card className="mb-4">
        <h3 className="font-display text-lg text-mist-50 mb-1">AI chat key</h3>
        <p className="text-xs text-mist-600 mb-3 leading-relaxed">
          Your own free OpenRouter API key. Stored only in this browser, shown
          masked, never sent anywhere except OpenRouter.
        </p>
        {keySaved ? (
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm text-glow-300">●●●●●●●● saved ✓</span>
            <button
              onClick={clearKey}
              className="text-xs text-rosesoft-300/80"
            >
              Remove key
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <input
              type="password"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="sk-or-v1-…"
              autoComplete="off"
            />
            <button
              onClick={saveKey}
              disabled={!key.trim()}
              className="shrink-0 rounded-2xl bg-glow-400 hover:bg-glow-300 disabled:opacity-50 text-night-950 font-semibold px-4"
            >
              Save
            </button>
          </div>
        )}
        <Field label="Model" hint="Must be a model your key can access.">
          <div className="flex gap-2">
            <input
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="openai/gpt-oss-20b:free"
              autoComplete="off"
            />
            <button
              onClick={saveModel}
              className="shrink-0 rounded-2xl border border-white/10 text-mist-300 text-sm px-4 hover:bg-white/5"
            >
              Save
            </button>
          </div>
        </Field>
      </Card>

      {/* Safety plan */}
      <Card className="mb-4">
        <h3 className="font-display text-lg text-mist-50 mb-1">Safety plan</h3>
        <p className="text-xs text-mist-600 mb-3 leading-relaxed">
          Write this when calm. In a hard moment it reminds you of your own
          words, people, and options.
        </p>
        <Field label="My coping steps">
          <textarea
            rows={4}
            value={steps}
            onChange={(e) => setSteps(e.target.value)}
            placeholder={'1. Slow breathing: in 4, out 6\n2. Step outside for air\n3. Call…'}
          />
        </Field>
        <Field label="Trusted contacts">
          <textarea
            rows={2}
            value={contacts}
            onChange={(e) => setContacts(e.target.value)}
            placeholder="Names and phone numbers of people you trust."
          />
        </Field>
        <Field label="Emergency notes" hint="e.g. local emergency number, clinic address.">
          <textarea
            rows={2}
            value={emergency}
            onChange={(e) => setEmergency(e.target.value)}
            placeholder="e.g. National emergency: 999"
          />
        </Field>
        <PrimaryButton onClick={savePlan}>Save safety plan</PrimaryButton>
        {planMsg && <p className="text-sm text-glow-300 mt-2">{planMsg}</p>}
      </Card>

      {/* Data controls */}
      <Card className="mb-4">
        <h3 className="font-display text-lg text-mist-50 mb-1">Your data</h3>
        <p className="text-xs text-mist-600 mb-3 leading-relaxed">
          Everything is stored under your account only. Export a copy anytime;
          deletion is permanent.
        </p>
        <div className="space-y-2">
          <GhostButton onClick={doExport}>Export all data (JSON)</GhostButton>
          {exportMsg && <p className="text-sm text-glow-300">{exportMsg}</p>}
          {!confirmWipe ? (
            <GhostButton danger onClick={() => setConfirmWipe(true)}>
              Delete all my data…
            </GhostButton>
          ) : (
            <div className="rounded-2xl border border-rosesoft-300/30 p-3.5">
              <p className="text-sm text-rosesoft-300 mb-3 leading-relaxed">
                This permanently deletes every journal entry, episode, note and
                message. This cannot be undone.
              </p>
              <div className="flex gap-2">
                <GhostButton onClick={() => setConfirmWipe(false)}>
                  Cancel
                </GhostButton>
                <button
                  onClick={doWipe}
                  className="w-full rounded-2xl bg-rosesoft-300/80 hover:bg-rosesoft-300 text-night-950 text-sm font-semibold px-4 py-2.5"
                >
                  Yes, delete everything
                </button>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Disclaimer */}
      <Card className="mb-4">
        <h3 className="font-display text-lg text-mist-50 mb-2">Important</h3>
        <p className="text-sm text-mist-300 leading-relaxed">
          This app is a personal support tool. It is not medical advice, not a
          diagnosis, and not a replacement for professional treatment. It never
          recommends changing or stopping prescribed medication. If you notice
          new or severe physical symptoms, seek urgent medical evaluation rather
          than assuming they are anxiety.
        </p>
      </Card>

      <Card className="mb-6">
        <p className="text-sm text-mist-500 mb-1">Signed in as</p>
        <p className="text-sm text-mist-100 font-medium mb-4">{user?.email}</p>
        <GhostButton onClick={() => logOut()}>Sign out</GhostButton>
      </Card>

      <SafetyNote />
    </Screen>
  );
}
