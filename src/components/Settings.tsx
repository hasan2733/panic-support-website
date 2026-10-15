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
import {
  clearSyncedSettings,
  getStoredKey,
  getStoredModel,
  pushSyncedSettings,
  setSyncPref,
  useSyncedSettings,
} from '../hooks/useSyncedSettings';
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
  const { enabled: syncedSettings, error: syncError } = useSyncedSettings(uid);

  // OpenRouter key (local by default; account-synced when enabled).
  const [key, setKey] = useState('');
  const [keySaved, setKeySaved] = useState(false);
  const [model, setModel] = useState('');
  const [sync, setSync] = useState(false);
  const [syncActionError, setSyncActionError] = useState('');

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

  useEffect(() => {
    setSync(syncedSettings);
    setKeySaved(getStoredKey().length > 0);
    setModel(getStoredModel());
  }, [syncedSettings]);

  const saveKey = async () => {
    const trimmed = key.trim();
    if (!trimmed) return;
    localStorage.setItem(KEY_STORAGE, trimmed);
    setKey('');
    setKeySaved(true);
    setSyncActionError('');
    if (sync) {
      try {
        await pushSyncedSettings(uid, trimmed, getStoredModel());
      } catch (error) {
        setSyncActionError(
          `Key saved on this device, but could not sync: ${
            error instanceof Error ? error.message : 'Unknown error.'
          }`,
        );
      }
    }
  };
  const clearKey = async () => {
    setSyncActionError('');
    if (sync) {
      try {
        await clearSyncedSettings(uid);
        setSync(false);
        setSyncPref(false);
      } catch (error) {
        setSyncActionError(
          `Could not remove the synced key: ${
            error instanceof Error ? error.message : 'Unknown error.'
          }`,
        );
        return;
      }
    }
    localStorage.removeItem(KEY_STORAGE);
    setKeySaved(false);
  };
  const saveModel = async () => {
    const value = model.trim() || 'openai/gpt-oss-20b:free';
    localStorage.setItem(MODEL_STORAGE, value);
    setSyncActionError('');
    if (sync) {
      try {
        await pushSyncedSettings(uid, getStoredKey(), value);
      } catch (error) {
        setSyncActionError(
          `Model saved on this device, but could not sync: ${
            error instanceof Error ? error.message : 'Unknown error.'
          }`,
        );
      }
    }
  };
  const toggleSync = async (on: boolean) => {
    setSyncActionError('');
    setSync(on);
    setSyncPref(on);
    try {
      if (on) {
        // Push the current key/model so other signed-in devices can read them.
        await pushSyncedSettings(uid, getStoredKey(), getStoredModel());
      } else {
        await clearSyncedSettings(uid);
      }
    } catch (error) {
      setSync(!on);
      setSyncPref(!on);
      setSyncActionError(
        `Could not ${on ? 'enable' : 'disable'} account sync: ${
          error instanceof Error ? error.message : 'Unknown error.'
        }`,
      );
    }
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
    await clearSyncedSettings(uid);
    setConfirmWipe(false);
    // Also clear local chat settings for a full reset.
    localStorage.removeItem(KEY_STORAGE);
    localStorage.removeItem(MODEL_STORAGE);
    setKeySaved(false);
    setSync(false);
    setSyncPref(false);
  };

  return (
    <Screen>
      <PageHeader
        kicker="Account"
        title="Settings"
        sub="Your keys stay on this device unless you enable account sync. Your notes stay in your account."
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
          Your own OpenRouter API key. Stored in this browser by default. If
          account sync is enabled, it is also stored in your private account
          settings and copied to your signed-in devices. The key is sent to
          OpenRouter when you chat.
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
        <div className="mt-4 rounded-2xl border border-white/5 p-3.5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm text-mist-100 font-medium">Sync across devices</p>
              <p className="text-xs text-mist-600 mt-0.5 leading-relaxed">
                Save your key + model to your account so other devices where you
                sign in can read them. Your account settings are protected by
                your sign-in. Enable this on the device that already has your
                key; other signed-in devices will load the saved settings automatically.
              </p>
            </div>
            <button
              onClick={() => toggleSync(!sync)}
              className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border transition-colors ${
                sync ? 'bg-glow-400 border-glow-400' : 'bg-night-700 border-white/10'
              }`}
              aria-pressed={sync}
            >
              <span
                className={`absolute top-0.5 h-6 w-6 rounded-full bg-night-950 transition-transform ${
                  sync ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>
        </div>
        {(syncError || syncActionError) && (
          <p className="mt-2 text-xs text-rosesoft-300">
            {syncActionError || `Could not load synced chat settings: ${syncError}`}
          </p>
        )}
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
