/**
 * The 10 calming techniques shown in the Practice studio.
 * Each has filterable category, a suggested duration and step-by-step guidance.
 * These are standard, well-established anxiety-management techniques.
 */

export type TechniqueCategory =
  | 'breathing'
  | 'grounding'
  | 'muscle'
  | 'mindfulness'
  | 'cbt';

export interface Technique {
  id: string;
  name: string;
  category: TechniqueCategory;
  minutes: number;
  short: string;
  steps: string[];
}

export const TECHNIQUE_CATEGORIES: { id: TechniqueCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'breathing', label: 'Breathing' },
  { id: 'grounding', label: 'Grounding' },
  { id: 'muscle', label: 'Muscle relaxation' },
  { id: 'mindfulness', label: 'Mindfulness' },
  { id: 'cbt', label: 'CBT skills' },
];

export const TECHNIQUES: Technique[] = [
  {
    id: 'calm-breath-46',
    name: 'Calm 4–6 breathing',
    category: 'breathing',
    minutes: 5,
    short: 'Slow breathing with a longer out-breath to settle the body.',
    steps: [
      'Sit comfortably and let your shoulders drop.',
      'Breathe in gently through your nose for 4 counts.',
      'Breathe out slowly through your mouth for 6 counts.',
      'Do not force the breath — keep it easy and natural.',
      'Continue for a few minutes, letting each out-breath soften your body.',
    ],
  },
  {
    id: 'box-breathing',
    name: 'Box breathing',
    category: 'breathing',
    minutes: 5,
    short: 'Equal-count breathing to steady attention. Skip if breath focus bothers you.',
    steps: [
      'Breathe in through your nose for 4 counts.',
      'Hold gently for 4 counts (skip the hold if it feels uncomfortable).',
      'Breathe out through your mouth for 4 counts.',
      'Rest for 4 counts before the next breath.',
      'Repeat the box for several rounds.',
    ],
  },
  {
    id: 'five-senses',
    name: '5-4-3-2-1 grounding',
    category: 'grounding',
    minutes: 5,
    short: 'Anchor attention in the present moment using your five senses.',
    steps: [
      'Name 5 things you can see around you.',
      'Notice 4 things you can feel (texture, temperature, pressure).',
      'Listen for 3 things you can hear.',
      'Notice 2 things you can smell.',
      'Name 1 thing you can taste.',
    ],
  },
  {
    id: 'cold-water',
    name: 'Cold water reset',
    category: 'grounding',
    minutes: 2,
    short: 'Cold on the face can help slow a racing stress response.',
    steps: [
      'Splash cold water on your face, or hold a cold cloth to your cheeks.',
      'Alternatively, hold something cold (a chilled bottle) in your hands.',
      'Breathe normally while you do this — no need to change your breath.',
      'Notice the sensation and how your body responds over a minute or two.',
    ],
  },
  {
    id: 'pmr',
    name: 'Progressive muscle relaxation',
    category: 'muscle',
    minutes: 10,
    short: 'Tense and release each muscle group to teach the body what calm feels like.',
    steps: [
      'Start with your hands: make tight fists for 5 seconds, then release.',
      'Move to arms, shoulders, face, neck, chest, stomach, legs, and feet.',
      'Tense each group for about 5 seconds, then let go completely.',
      'Notice the contrast between tension and relaxation each time.',
      'Finish by tensing the whole body once, then releasing with a sigh.',
    ],
  },
  {
    id: 'shoulder-drop',
    name: 'Shoulder drop & jaw release',
    category: 'muscle',
    minutes: 3,
    short: 'A quick release for the two places stress hides most.',
    steps: [
      'Lift your shoulders to your ears, hold 5 seconds, then drop them.',
      'Repeat twice, letting them fall a little lower each time.',
      'Unclench your jaw; let your tongue rest softly off the roof of your mouth.',
      'Smooth your forehead and soften the muscles around your eyes.',
      'Take three easy breaths and notice the difference.',
    ],
  },
  {
    id: 'body-scan',
    name: 'Gentle body scan',
    category: 'mindfulness',
    minutes: 8,
    short: 'Move kind attention slowly through the body, without fixing anything.',
    steps: [
      'Close your eyes or soften your gaze.',
      'Bring attention to your feet. Just notice sensations there.',
      'Move slowly upward: legs, belly, chest, hands, shoulders, face.',
      'Wherever you find tension, breathe into that area and let it soften.',
      'There is nothing to fix — observing is the whole practice.',
    ],
  },
  {
    id: 'thought-labeling',
    name: 'Thought labeling',
    category: 'mindfulness',
    minutes: 5,
    short: 'Create distance from scary thoughts by naming them as events.',
    steps: [
      'When a frightening thought appears, silently say: "I notice I am having the thought that…"',
      'Label the kind of thought: "that is a worry thought" or "that is a what-if thought".',
      'Thoughts are mental events, not facts and not orders.',
      'Return attention to what you were doing, without arguing with the thought.',
    ],
  },
  {
    id: 'self-compassion',
    name: 'Self-compassion pause',
    category: 'mindfulness',
    minutes: 4,
    short: 'Respond to yourself the way you would to a frightened friend.',
    steps: [
      'Place a hand on your chest or somewhere soothing.',
      'Acknowledge: "This is a moment of suffering. Suffering is part of life."',
      'Offer yourself kindness: "May I be kind to myself right now."',
      'Ask: "What do I need in this moment?" and honor the answer if you can.',
    ],
  },
  {
    id: 'worry-time',
    name: 'Scheduled worry time',
    category: 'cbt',
    minutes: 10,
    short: 'Contain rumination by giving worry a fixed daily appointment.',
    steps: [
      'Choose a 10–15 minute "worry time" earlier in the day (not before bed).',
      'When worries pop up outside that time, note them down and postpone.',
      'During worry time, work through the list with your thought journal.',
      'Worries without a solution get parked for tomorrow\'s session.',
    ],
  },
];
