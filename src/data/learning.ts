/**
 * Learning library content.
 *
 * Summaries and key takeaways are written in our own words — we do NOT copy
 * full copyrighted books or workbooks. Each resource links to its official
 * source where the full material lives.
 */

export interface LearningResource {
  id: string;
  title: string;
  source: string;
  sourceUrl: string;
  tagline: string;
  summary: string[];
  keyPoints: string[];
}

export const LEARNING_RESOURCES: LearningResource[] = [
  {
    id: 'cci-panic',
    title: 'When Panic Attacks',
    source: 'Centre for Clinical Interventions (CCI), Western Australia',
    sourceUrl: 'https://www.cci.health.wa.gov.au/Resources/Looking-After-Yourself/Panic',
    tagline: 'A free CBT workbook: how panic develops and how to dismantle it.',
    summary: [
      'This free workbook explains panic as a misfiring of the body\u2019s alarm system: harmless physical sensations get interpreted as catastrophic threats ("I\u2019m dying", "I\u2019m losing control"), which spikes fear, which intensifies the sensations — the panic cycle.',
      'It walks you through identifying your own catastrophic interpretations, testing them against evidence, dropping "safety behaviours" (things you do to prevent the feared catastrophe, which secretly keep the fear alive), and gradually facing avoided situations.',
    ],
    keyPoints: [
      'Panic is the alarm system firing without real danger — uncomfortable but not dangerous.',
      'Catastrophic misinterpretation of body sensations is the engine of the panic cycle.',
      'Safety behaviours (always carrying water, never being alone, distraction rituals) maintain panic long-term.',
      'Thought challenging: collect evidence for and against the feared outcome, then write a balanced alternative.',
      'Gradual exposure to avoided situations, done step by step, rebuilds confidence.',
      'Setbacks are part of recovery — have a maintenance plan for them.',
    ],
  },
  {
    id: 'cci-worry',
    title: 'What? Me Worry?!',
    source: 'Centre for Clinical Interventions (CCI), Western Australia',
    sourceUrl: 'https://www.cci.health.wa.gov.au/Resources/Looking-After-Yourself/Worry-and-Rumination',
    tagline: 'A free workbook for persistent worry and intolerance of uncertainty.',
    summary: [
      'Many people with panic disorder also live with a background hum of worry — about health, the future, and "what if" scenarios. This workbook targets the worry process itself rather than each individual worry.',
      'It introduces attention training, the difference between productive problem-solving and unproductive rumination, and experiments for responding differently when the mind demands certainty.',
    ],
    keyPoints: [
      'Worry feels useful but mostly functions as avoidance of uncertainty.',
      'Separate solvable problems (make a plan) from unsolvable hypotheticals (let go).',
      'Attention training: deliberately shifting focus weakens worry\u2019s grip.',
      'Challenge positive beliefs about worry ("worrying keeps me prepared").',
      'Postpone worry to a scheduled "worry time" instead of engaging on demand.',
    ],
  },
  {
    id: 'cci-health-anxiety',
    title: 'Health Anxiety',
    source: 'Centre for Clinical Interventions (CCI), Western Australia',
    sourceUrl: 'https://www.cci.health.wa.gov.au/Resources/Looking-After-Yourself/Health-Anxiety',
    tagline: 'For when body sensations trigger frightening health interpretations.',
    summary: [
      'Health anxiety and panic overlap heavily: a skipped heartbeat or dizzy spell gets read as evidence of serious illness, prompting checking, reassurance-seeking, and doctor visits that calm things briefly but reinforce the cycle.',
      'The workbook maps your own vicious cycle — triggers, misinterpretations, checking behaviours — and replaces them with tolerance of uncertainty and attention redirected outward.',
    ],
    keyPoints: [
      'Body vigilance (scanning for symptoms) manufactures the sensations it fears.',
      'Reassurance-seeking gives short relief and long-term maintenance of anxiety.',
      'Learn the difference between a sensation and its catastrophic meaning.',
      'Reduce checking gradually; track urges without automatically obeying them.',
      'Tolerating "I can\u2019t be 100% sure" is the core skill.',
    ],
  },
  {
    id: 'who-stress',
    title: 'Doing What Matters in Times of Stress',
    source: 'World Health Organization (WHO)',
    sourceUrl: 'https://www.who.int/publications/i/item/9789240003927',
    tagline: 'An illustrated, practical guide to grounding and living by your values.',
    summary: [
      'This free 132-page illustrated guide from the WHO teaches five core skills: grounding yourself in the present, unhooking from difficult thoughts, making room for painful feelings instead of fighting them, treating yourself with kindness, and acting on your values even while discomfort is present.',
      'It is not panic-specific, which is its strength — it trains the general capacity to carry difficult inner experiences while living a meaningful life.',
    ],
    keyPoints: [
      'Grounding: slow down and connect with the present through your senses.',
      'Unhooking: notice difficult thoughts as passing mental events, not commands.',
      'Make room: allow painful feelings to be present without struggling against them.',
      'Self-kindness: respond to yourself as you would to a struggling friend.',
      'Values: choose small actions guided by what matters to you, even with anxiety present.',
    ],
  },
  {
    id: 'nhs-panic',
    title: 'Panic — Self-Help Guide',
    source: 'NHS (UK National Health Service)',
    sourceUrl: 'https://www.nhs.uk/mental-health/conditions/panic-disorder/',
    tagline: 'A clear explainer of the panic cycle plus CBT-based self-help steps.',
    summary: [
      'The NHS guide explains panic attacks plainly: why they happen, the role of adrenaline, and how thoughts and avoidance behaviours keep them going.',
      'It offers practical CBT-based methods — understanding the panic cycle, breathing and relaxation, challenging anxious thoughts, and facing feared situations gradually — plus guidance on when to seek professional help.',
    ],
    keyPoints: [
      'Panic attacks are adrenaline surges; they peak and pass, usually within minutes.',
      'Understanding the fight-or-flight response demystifies the symptoms.',
      'Avoidance shrinks your world; gradual facing expands it again.',
      'Keep a simple record of attacks to spot patterns and progress.',
      'Seek professional help if panic is frequent, or if avoidance is growing.',
    ],
  },
];

export interface BookRec {
  id: string;
  title: string;
  author: string;
  why: string;
}

export const BOOK_RECS: BookRec[] = [
  {
    id: 'mastery-anxiety-panic',
    title: 'Mastery of Your Anxiety and Panic',
    author: 'David H. Barlow & Michelle G. Craske',
    why: 'The structured, treatment-oriented workbook behind the most researched panic program — best if you want a rigorous, step-by-step clinical approach.',
  },
  {
    id: 'overcoming-panic-agoraphobia',
    title: 'Overcoming Panic and Agoraphobia',
    author: 'Vijaya Manicavasagar & Derrick Silove',
    why: 'Practical CBT strategies specifically for panic and the places or situations you have started to fear and avoid.',
  },
  {
    id: 'panic-attacks-workbook',
    title: 'The Panic Attacks Workbook',
    author: 'David Carbonell',
    why: 'A compassionate, plain-spoken guide to understanding panic and practicing coping skills at your own pace.',
  },
  {
    id: 'mind-over-mood',
    title: 'Mind Over Mood',
    author: 'Dennis Greenberger & Christine A. Padesky',
    why: 'The classic workbook for thought records and cognitive restructuring — pairs perfectly with this app\u2019s Thought Journal.',
  },
  {
    id: 'anxiety-phobia-workbook',
    title: 'The Anxiety and Phobia Workbook',
    author: 'Edmund J. Bourne',
    why: 'A broad, encyclopedic collection of anxiety-management and relaxation exercises to explore beyond panic-specific tools.',
  },
];
