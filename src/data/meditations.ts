/**
 * The three guided audio meditations.
 * Audio files live in src/assets/audio/ (already generated).
 * Transcripts below are the spoken scripts, embedded so they work offline.
 */
import calmBreathingMp3 from '../assets/audio/calm-breathing.mp3';
import muscleRelaxationMp3 from '../assets/audio/muscle-relaxation.mp3';
import groundingMeditationMp3 from '../assets/audio/grounding-meditation.mp3';

export interface Meditation {
  id: string;
  title: string;
  minutes: number;
  description: string;
  audioSrc: string;
  transcript: string[];
}

export const MEDITATIONS: Meditation[] = [
  {
    id: 'calm-breathing',
    title: 'Calm Breathing',
    minutes: 5,
    description:
      'A gentle guided breathing practice — slow breaths in through the nose, longer breaths out through the mouth.',
    audioSrc: calmBreathingMp3,
    transcript: [
      'Welcome to this calm breathing practice. Find a comfortable position, sitting or lying down. Let your shoulders drop away from your ears. You can keep your eyes open with a soft gaze, or gently close them, whichever feels safer for you right now.',
      'We are going to breathe together, slowly and gently. There is nothing to force here. Your breath does not need to be deep. Just let it be easy.',
      'Begin by breathing in through your nose for a slow count of four. One. Two. Three. Four. Now let the breath flow out through your mouth for a slow count of six. One. Two. Three. Four. Five. Six.',
      'Again, breathe in. One. Two. Three. Four. And breathe out, letting your body soften. One. Two. Three. Four. Five. Six.',
      'Notice the gentle rise of your chest, and the soft fall as you breathe out. Each out-breath is a chance to let go of a little tension.',
      'Breathe in. One. Two. Three. Four. Breathe out. One. Two. Three. Four. Five. Six.',
      'If your mind wanders to worried thoughts, that is completely normal. You do not need to fight the thoughts. Just notice them, and kindly return your attention to the breath.',
      'Breathe in. One. Two. Three. Four. Breathe out. One. Two. Three. Four. Five. Six.',
      'Feel your feet resting on the ground, or your body supported by the chair beneath you. You are safe in this moment.',
      'Breathe in. One. Two. Three. Four. Breathe out, a little longer this time. One. Two. Three. Four. Five. Six.',
      'Let your jaw relax. Let the small muscles around your eyes soften. There is nowhere else you need to be.',
      'Breathe in. One. Two. Three. Four. Breathe out. One. Two. Three. Four. Five. Six.',
      'You are doing well. There is no perfect way to do this. Simply being here, breathing, is enough.',
      'Breathe in. One. Two. Three. Four. Breathe out. One. Two. Three. Four. Five. Six.',
      'Now, for these last few breaths, breathe at your own natural pace. No counting. Just gentle, easy breaths, in and out.',
      'Notice how your body feels now, compared to when we began. Perhaps a little calmer. Perhaps a little softer. Whatever you feel is okay.',
      'When you are ready, slowly bring your awareness back to the room around you. Wiggle your fingers and toes. Take one more full, easy breath in, and let it go.',
      'Well done. You gave yourself these minutes of calm, and you can return to this practice whenever you wish.',
    ],
  },
  {
    id: 'muscle-relaxation',
    title: 'Progressive Muscle Relaxation',
    minutes: 10,
    description:
      'Tense and release each muscle group, teaching your body what true relaxation feels like.',
    audioSrc: muscleRelaxationMp3,
    transcript: [
      'Welcome to this progressive muscle relaxation practice. This exercise will guide you to gently tense and then release different muscle groups, helping your body learn what true relaxation feels like. Find a comfortable position, sitting or lying down. Loosen any tight clothing. Let your arms rest at your sides.',
      'We will begin with your hands. Breathe in, and make a tight fist with both hands. Squeeze, squeeze, hold it. Notice the tension in your fingers and hands. Now breathe out and release. Let your fingers spread open and relax completely. Notice the difference between tension and relaxation. Let your hands feel heavy and warm.',
      'Now bring your attention to your forearms and upper arms. Breathe in, and bend your arms, tensing your biceps as if you are showing your muscles. Hold the tension. Feel it in your arms. Now breathe out and release, letting your arms fall back down, completely loose. Notice the pleasant heaviness as the tension drains away.',
      'Move to your shoulders. Breathe in, and lift your shoulders up toward your ears. Squeeze them tight. Hold it, hold it. Feel all the tension you carry there. Now breathe out and drop your shoulders down. Let them melt away from your ears. Enjoy the feeling of release.',
      'Now your face. Scrunch up all the muscles in your face. Squeeze your eyes shut, clench your jaw, wrinkle your forehead. Hold that tight, uncomfortable feeling. Now breathe out and release everything. Let your jaw hang slightly open. Smooth your forehead. Let your tongue rest softly. Feel your whole face become calm and smooth.',
      'Gently press the back of your head into the surface beneath you, tensing your neck. Hold it. Now release, and let your neck and head rest heavy and supported.',
      'Take a deep, easy breath in, and tighten your chest and stomach muscles. Hold the tension across your torso. Now breathe out and release. Let your belly soften and rise and fall naturally with your breath.',
      'Now your legs. Straighten them and tense your thigh muscles. Press your knees together slightly. Hold the tension in your thighs. Now release. Let your legs sink heavy into the surface beneath you.',
      'Point your toes away from you, tensing your calves and feet. Hold it. Feel the tightness. Now breathe out and release. Let your feet relax completely.',
      'Finally, take a slow breath in, and gently tense your whole body all at once, from your toes to your face. Hold it for a moment. Now breathe out with a sigh, and let everything go. Feel yourself sinking into deep, comfortable relaxation.',
      'Rest here for a few breaths. Scan your body slowly from your feet to the top of your head. If you notice any spot still holding tension, breathe into that area, and let it soften as you breathe out.',
      'You have given your body a chance to reset. Remember this feeling of release. Your muscles now know the way back to calm, and you can guide them here whenever you need.',
      'When you are ready, begin to wake your body gently. Wiggle your fingers and toes. Roll your shoulders slowly. Stretch in any way that feels good. Take one more deep, refreshing breath in, and let it out slowly.',
      'Well done. Carry this sense of ease with you into the rest of your day.',
    ],
  },
  {
    id: 'grounding-meditation',
    title: 'Five Senses Grounding',
    minutes: 7,
    description:
      'A guided journey through sight, touch, sound, smell and taste to anchor you in the present moment.',
    audioSrc: groundingMeditationMp3,
    transcript: [
      'Welcome to this grounding meditation. When anxiety rises, our attention often gets pulled into worried thoughts about the future. This practice gently brings your attention back to the present moment, using your five senses. You can do this sitting or standing, with your eyes open.',
      'We will move through five steps together. Take your time with each one. There is no rush.',
      'Step one. Notice five things you can see. Look slowly around you. Name them quietly in your mind. Perhaps the color of the wall. A shadow on the floor. The shape of a nearby object. Light coming through a window. Just observe, without judging. Five things you can see.',
      'Step two. Notice four things you can touch or feel. The texture of your clothes against your skin. The surface beneath your hands. The temperature of the air on your face. The weight of your feet on the ground. Four things you can feel, right here, right now.',
      'Step three. Notice three things you can hear. Listen carefully. Perhaps distant traffic. The hum of an appliance. Your own breathing. A bird outside. You do not need to find pleasant sounds, just notice what is there. Three things you can hear.',
      'Step four. Notice two things you can smell. Breathe in gently through your nose. Perhaps the scent of your room. A faint smell of food, or soap, or fresh air. If you cannot detect anything strong, simply notice the neutral smell of the air itself. Two things you can smell.',
      'Step five. Notice one thing you can taste. Perhaps the lingering taste of a recent drink. Or simply the neutral taste inside your mouth. Take a slow sip of water if you have some nearby, and notice it fully. One thing you can taste.',
      'Now pause. You have just traveled through all five senses. Notice where your attention is now. It is here, in this room, in this moment. The worried thoughts may still be nearby, but you are anchored in the present.',
      'Let us do one more gentle round, a little quicker this time. Name five things you see. Four things you feel. Three things you hear. Two things you smell. One thing you taste. Take your time.',
      'Feel your feet on the ground. Feel the steadiness of the surface holding you up. You are here. You are safe in this moment.',
      'Anxiety tells us we are in danger, but right now, in this present moment, look around you. You are okay. This feeling will pass, as all feelings do.',
      'When you are ready, take one slow, full breath in, and let it out completely. Gently stretch, or simply sit quietly for a moment longer.',
      'Well done. You can return to this five senses practice anytime you need to come back to the present.',
    ],
  },
];
