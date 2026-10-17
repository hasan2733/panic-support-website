import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Card, Field, GhostButton, PrimaryButton } from './ui';
import { IconClose, IconGround, IconHeart, IconSend } from './icons';

const SYMPTOMS = [
  'Racing heart / palpitations',
  'Shortness of breath',
  'Chest pain or tightness',
  'Dizziness or lightheadedness',
  'Trembling or shaking',
  'Nausea or stomach upset',
  'Sweating or chills',
  'Feeling detached or unreal',
];

interface EmergencyContact {
  name: string;
  email: string;
}

function parseContacts(value: string): EmergencyContact[] {
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const named = line.match(/^(.*?)\s*<([^<>]+)>$/);
      return named
        ? { name: named[1].trim() || named[2].trim(), email: named[2].trim() }
        : { name: line, email: line };
    })
    .filter(({ email }) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
}

export function EmergencyNotification({ onClose }: { onClose: () => void }) {
  const { user } = useAuth();
  const contactsStorageKey = `psw_emergency_contacts_${user?.uid ?? 'guest'}`;
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
    accuracy: number;
  } | null>(null);
  const [locationError, setLocationError] = useState('');
  const [loading, setLoading] = useState(true);
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [note, setNote] = useState('');
  const [draftOpened, setDraftOpened] = useState(false);

  useEffect(() => {
    try {
      setContacts(parseContacts(localStorage.getItem(contactsStorageKey) ?? ''));
    } catch {
      setContacts([]);
    }

    if (!navigator.geolocation) {
      setLocationError('Location is not supported in this browser.');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
        setLoading(false);
      },
      (error) => {
        setLocationError(
          error.code === error.PERMISSION_DENIED
            ? 'Location permission was denied. Allow location access and reopen this alert to include it.'
            : `Could not get your current location: ${error.message}`,
        );
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 },
    );
  }, [contactsStorageKey]);

  const mailto = useMemo(() => {
    if (!location || contacts.length === 0) return '';
    const mapsLink = `https://www.google.com/maps/search/?api=1&query=${location.latitude},${location.longitude}`;
    const body = [
      `Emergency support requested by ${user?.displayName || user?.email || 'a Panic Support user'}.`,
      `Time: ${new Date().toLocaleString()}`,
      `Location: ${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)} (accuracy about ${Math.round(location.accuracy)} m)`,
      `Map: ${mapsLink}`,
      `Symptoms: ${symptoms.length ? symptoms.join(', ') : 'None selected'}`,
      `Note: ${note.trim() || 'None provided'}`,
      '',
      'Please contact me or check on me.',
    ].join('\n');
    const recipientList = contacts.map(({ email }) => email).join(',');
    return `mailto:${recipientList}?subject=${encodeURIComponent('Emergency support request')}&body=${encodeURIComponent(body)}`;
  }, [contacts, location, note, symptoms, user?.displayName, user?.email]);

  const toggleSymptom = (symptom: string) => {
    setSymptoms((current) =>
      current.includes(symptom)
        ? current.filter((item) => item !== symptom)
        : [...current, symptom],
    );
  };

  return (
    <div
      className="fixed inset-0 z-[60] overflow-y-auto bg-night-950/80 p-4 backdrop-blur-sm sm:grid sm:place-items-center"
      onClick={onClose}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="emergency-title"
        className="mx-auto my-4 w-full max-w-xl rounded-3xl border border-white/10 bg-night-900 p-5 shadow-2xl sm:my-0 sm:p-7"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-rosesoft-300">Emergency support</p>
            <h2 id="emergency-title" className="font-display text-2xl text-mist-50">Prepare an alert</h2>
            <p className="mt-2 text-sm leading-relaxed text-mist-400">
              We’ll open a pre-filled email to your saved contacts. Review it and press Send in your email app.
            </p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close emergency alert" className="rounded-full p-2 text-mist-400 hover:bg-white/5 hover:text-mist-100">
            <IconClose className="h-5 w-5" />
          </button>
        </div>

        <Card className="mb-4">
          <h3 className="mb-2 flex items-center gap-2 font-medium text-mist-100">
            <IconGround className="h-4 w-4 text-glow-300" />
            Current location
          </h3>
          {loading && <p role="status" className="text-sm text-mist-400">Requesting location permission…</p>}
          {locationError && <p role="alert" className="text-sm text-rosesoft-300">{locationError}</p>}
          {location && (
            <>
              <p className="text-sm text-mist-300">
                {location.latitude.toFixed(5)}, {location.longitude.toFixed(5)}
                <span className="ml-2 text-xs text-mist-500">±{Math.round(location.accuracy)} m</span>
              </p>
              <a
                className="mt-2 inline-block text-xs text-glow-300 underline"
                href={`https://www.google.com/maps/search/?api=1&query=${location.latitude},${location.longitude}`}
                target="_blank"
                rel="noreferrer"
              >
                Preview location on map
              </a>
            </>
          )}
        </Card>

        <Card className="mb-4">
          <h3 className="mb-3 flex items-center gap-2 font-medium text-mist-100">
            <IconHeart className="h-4 w-4 text-rosesoft-300" />
            Symptoms (optional)
          </h3>
          <div className="grid gap-2 sm:grid-cols-2">
            {SYMPTOMS.map((symptom) => (
              <label key={symptom} className="flex cursor-pointer items-center gap-2 text-sm text-mist-300">
                <input
                  type="checkbox"
                  checked={symptoms.includes(symptom)}
                  onChange={() => toggleSymptom(symptom)}
                />
                {symptom}
              </label>
            ))}
          </div>
        </Card>

        <Card className="mb-4">
          <Field label="What would you like them to know? (optional)">
            <textarea
              rows={3}
              maxLength={500}
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Add a short message or what you need right now."
            />
            <p className="mt-1 text-right text-xs text-mist-600">{note.length}/500</p>
          </Field>
        </Card>

        <Card className="mb-4">
          <h3 className="mb-2 font-medium text-mist-100">Recipients</h3>
          {contacts.length ? (
            <ul className="space-y-1 text-sm text-mist-400">
              {contacts.map((contact) => (
                <li key={contact.email}>{contact.name} <span className="text-mist-600">({contact.email})</span></li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-mist-400">
              No valid contacts saved. Add email addresses in Settings → Emergency email contacts.
            </p>
          )}
        </Card>

        {draftOpened && (
          <p role="status" className="mb-3 text-sm text-glow-300">
            Your email app should have opened a prepared draft. Check it and press Send there.
          </p>
        )}
        <div className="flex flex-col-reverse gap-2 sm:flex-row">
          <GhostButton onClick={onClose}>Cancel</GhostButton>
          <PrimaryButton
            disabled={loading || !location || !contacts.length}
            onClick={() => {
              if (mailto) {
                window.location.href = mailto;
                setDraftOpened(true);
              }
            }}
          >
            <span className="inline-flex items-center justify-center gap-2">
              <IconSend className="h-4 w-4" />
              Open pre-filled email
            </span>
          </PrimaryButton>
        </div>
        <p className="mt-3 text-center text-xs leading-relaxed text-mist-600">
          This app does not send email in the background. Your mail provider will ask you to confirm and send the message.
        </p>
      </section>
    </div>
  );
}
