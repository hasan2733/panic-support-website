/**
 * Faith Corner content — FIXED and verified. Never generate, invent, or
 * paraphrase Quranic verses, hadith, or duas anywhere else in the app.
 * Only the content below may appear in religious contexts.
 */

export const VERSE = {
  surah: 'Surah Ash-Sharh (94), verses 5–6',
  arabic: 'فَإِنَّ مَعَ الْعُسْرِ يُسْرًا إِنَّ مَعَ الْعُسْرِ يُسْرًا',
  english:
    'Indeed, there is ease with hardship. Most certainly, there is ease with hardship.',
  attribution: "Translation by Zafar Ishaq Ansari, Towards Understanding the Qur'an",
  sourceUrl: 'https://quran.com/94:5-6',
  sourceLabel: 'Check the source at quran.com',
};

export interface Dua {
  id: string;
  arabic: string;
  transliteration: string;
  translation: string;
  source: string;
}

export interface QuranReading {
  id: string;
  title: string;
  reference: string;
  arabic: string;
  english: string;
  sourceUrl: string;
  audioUrl: string;
  audioLabel: string;
}

/** Quran text and Sahih International translation, with Alafasy recitations. */
export const QURAN_READINGS: QuranReading[] = [
  {
    id: 'al-fatiha',
    title: 'Surah Al-Fatiha',
    reference: 'Qur’an 1:1–7',
    arabic:
      'بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ ۞ ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَـٰلَمِينَ ۞ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ ۞ مَـٰلِكِ يَوْمِ ٱلدِّينِ ۞ إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ ۞ ٱهْدِنَا ٱلصِّرَٰطَ ٱلْمُسْتَقِيمَ ۞ صِرَٰطَ ٱلَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ ٱلْمَغْضُوبِ عَلَيْهِمْ وَلَا ٱلضَّآلِّينَ',
    english:
      'In the name of Allah, the Entirely Merciful, the Especially Merciful. All praise is due to Allah, Lord of the worlds — the Entirely Merciful, the Especially Merciful, Sovereign of the Day of Recompense. It is You we worship and You we ask for help. Guide us to the straight path — the path of those upon whom You have bestowed favor, not of those who have earned Your anger or of those who are astray.',
    sourceUrl: 'https://quran.com/1',
    audioUrl:
      'https://download.quranicaudio.com/qdc/mishari_al_afasy/murattal/1.mp3',
    audioLabel: 'Listen to Surah Al-Fatiha',
  },
  {
    id: 'al-asr',
    title: 'Surah Al-Asr',
    reference: 'Qur’an 103:1–3',
    arabic:
      'وَٱلْعَصْرِ ۞ إِنَّ ٱلْإِنسَـٰنَ لَفِى خُسْرٍ ۞ إِلَّا ٱلَّذِينَ ءَامَنُوا۟ وَعَمِلُوا۟ ٱلصَّـٰلِحَـٰتِ وَتَوَاصَوْا۟ بِٱلْحَقِّ وَتَوَاصَوْا۟ بِٱلصَّبْرِ',
    english:
      'By time, indeed, mankind is in loss, except for those who have believed and done righteous deeds and advised each other to truth and advised each other to patience.',
    sourceUrl: 'https://quran.com/103',
    audioUrl:
      'https://download.quranicaudio.com/qdc/mishari_al_afasy/murattal/103.mp3',
    audioLabel: 'Listen to Surah Al-Asr',
  },
  {
    id: 'al-ikhlas',
    title: 'Surah Al-Ikhlas',
    reference: 'Qur’an 112:1–4 · first of the 3 Quls',
    arabic:
      'قُلْ هُوَ ٱللَّهُ أَحَدٌ ۞ ٱللَّهُ ٱلصَّمَدُ ۞ لَمْ يَلِدْ وَلَمْ يُولَدْ ۞ وَلَمْ يَكُن لَّهُۥ كُفُوًا أَحَدٌ',
    english:
      'Say, “He is Allah, [who is] One, Allah, the Eternal Refuge. He neither begets nor is born, nor is there to Him any equivalent.”',
    sourceUrl: 'https://quran.com/112',
    audioUrl:
      'https://download.quranicaudio.com/qdc/mishari_al_afasy/murattal/112.mp3',
    audioLabel: 'Listen to Surah Al-Ikhlas',
  },
  {
    id: 'al-falaq',
    title: 'Surah Al-Falaq',
    reference: 'Qur’an 113:1–5 · second of the 3 Quls',
    arabic:
      'قُلْ أَعُوذُ بِرَبِّ ٱلْفَلَقِ ۞ مِن شَرِّ مَا خَلَقَ ۞ وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ ۞ وَمِن شَرِّ ٱلنَّفَّـٰثَـٰتِ فِى ٱلْعُقَدِ ۞ وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ',
    english:
      'Say, “I seek refuge in the Lord of daybreak, from the evil of that which He created, and from the evil of darkness when it settles, and from the evil of the blowers in knots, and from the evil of an envier when he envies.”',
    sourceUrl: 'https://quran.com/113',
    audioUrl:
      'https://download.quranicaudio.com/qdc/mishari_al_afasy/murattal/113.mp3',
    audioLabel: 'Listen to Surah Al-Falaq',
  },
  {
    id: 'an-nas',
    title: 'Surah An-Nas',
    reference: 'Qur’an 114:1–6 · third of the 3 Quls',
    arabic:
      'قُلْ أَعُوذُ بِرَبِّ ٱلنَّاسِ ۞ مَلِكِ ٱلنَّاسِ ۞ إِلَـٰهِ ٱلنَّاسِ ۞ مِن شَرِّ ٱلْوَسْوَاسِ ٱلْخَنَّاسِ ۞ ٱلَّذِى يُوَسْوِسُ فِى صُدُورِ ٱلنَّاسِ ۞ مِنَ ٱلْجِنَّةِ وَٱلنَّاسِ',
    english:
      'Say, “I seek refuge in the Lord of mankind, the Sovereign of mankind, the God of mankind, from the evil of the retreating whisperer — who whispers [evil] into the breasts of mankind — from among the jinn and mankind.”',
    sourceUrl: 'https://quran.com/114',
    audioUrl:
      'https://download.quranicaudio.com/qdc/mishari_al_afasy/murattal/114.mp3',
    audioLabel: 'Listen to Surah An-Nas',
  },
];

export const AYATUL_KURSI: QuranReading = {
  id: 'ayatul-kursi',
  title: 'Ayatul Kursi',
  reference: 'Qur’an 2:255',
  arabic:
    'ٱللَّهُ لَآ إِلَـٰهَ إِلَّا هُوَ ٱلْحَىُّ ٱلْقَيُّومُ ۚ لَا تَأْخُذُهُۥ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُۥ مَا فِى ٱلسَّمَـٰوَٰتِ وَمَا فِى ٱلْأَرْضِ ۗ مَن ذَا ٱلَّذِى يَشْفَعُ عِندَهُۥٓ إِلَّا بِإِذْنِهِۦ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَىْءٍ مِّنْ عِلْمِهِۦٓ إِلَّا بِمَا شَآءَ ۚ وَسِعَ كُرْسِيُّهُ ٱلسَّمَـٰوَٰتِ وَٱلْأَرْضَ ۖ وَلَا يَـُٔودُهُۥ حِفْظُهُمَا ۚ وَهُوَ ٱلْعَلِىُّ ٱلْعَظِيمُ',
  english:
    'Allah — there is no deity except Him, the Ever-Living, the Self-Sustaining. Neither drowsiness overtakes Him nor sleep. To Him belongs whatever is in the heavens and whatever is on the earth. Who is it that can intercede with Him except by His permission? He knows what is presently before them and what will be after them, and they encompass not a thing of His knowledge except for what He wills. His Kursi extends over the heavens and the earth, and their preservation tires Him not. And He is the Most High, the Most Great.',
  sourceUrl: 'https://quran.com/2/255',
  audioUrl: 'https://audio.qurancdn.com/Alafasy/mp3/002255.mp3',
  audioLabel: 'Listen to Ayatul Kursi',
};

export const DUA_YUNUS: Dua = {
  id: 'dua-yunus',
  arabic:
    'لَّآ إِلَـٰهَ إِلَّآ أَنتَ سُبْحَـٰنَكَ إِنِّى كُنتُ مِنَ ٱلظَّـٰلِمِينَ',
  transliteration:
    'Lā ilāha illā anta, subḥānaka innī kuntu minaẓ-ẓālimīn.',
  translation:
    'There is no deity except You; exalted are You. Indeed, I have been of the wrongdoers.',
  source: 'Qur’an 21:87 · the supplication of Prophet Yunus (Jonah)',
};

export const DUA_YUNUS_AUDIO =
  'https://audio.qurancdn.com/Alafasy/mp3/021087.mp3';

export interface IsmeAzamSupplication {
  id: string;
  title: string;
  reference: string;
  arabic: string;
  english: string;
  banglaPronunciation?: string;
  banglaMeaning?: string;
  sourceUrl: string;
  audioUrl?: string;
  audioLabel?: string;
}

export const ISME_AZAM_SUPPLICATIONS: IsmeAzamSupplication[] = [
  {
    id: 'one-god',
    title: 'The One God',
    reference: 'Qur’an 2:163',
    arabic:
      'وَإِلَـٰهُكُمْ إِلَـٰهٌ وَٰحِدٌ ۖ لَّآ إِلَـٰهَ إِلَّا هُوَ ٱلرَّحْمَـٰنُ ٱلرَّحِيمُ',
    english:
      'And your God is one God. There is no deity [worthy of worship] except Him, the Entirely Merciful, the Especially Merciful.',
    banglaPronunciation:
      'ওয়া ইলাহুকুম ইলাহু ওয়াহিদ, লা ইলাহা ইল্লা হুয়ার রাহমানুর রাহিম।',
    banglaMeaning:
      'আর তোমাদের উপাস্য একমাত্র উপাস্য (আল্লাহ)। তিনি ব্যতিত আর কোনো (সত্যিকার) উপাস্য নেই, তিনি পরম করুণাময়, অতিশয় দয়ালু।',
    sourceUrl: 'https://quran.com/2/163',
    audioUrl: 'https://audio.qurancdn.com/Alafasy/mp3/002163.mp3',
    audioLabel: 'Listen to Qur’an 2:163',
  },
  {
    id: 'al-hayyul-qayyum',
    title: 'The Ever-Living, the Self-Sustaining',
    reference: 'Qur’an 2:255 · Sunan Abi Dawud 1496',
    arabic: 'اللّٰهُ لَاۤ اِلٰهَ اِلَّا هُوَ ۙ الْحَيُّ الْقَيُّومُ',
    english:
      'Allah—there is no deity except Him, the Ever-Living, the Self-Sustaining.',
    banglaPronunciation:
      'আল্লাহু লা ইলাহা ইল্লাহহুয়াল হাইয়ুল ক্বাইয়ুম।',
    banglaMeaning:
      'আল্লাহ তিনিই, যিনি ছাড়া কোনো মাবুদ নেই। তিনি চিরঞ্জীব, (সমগ্র জগতের) নিয়ন্ত্রক।',
    sourceUrl: 'https://sunnah.com/abudawud:1496',
    audioUrl: 'https://audio.qurancdn.com/Alafasy/mp3/002255.mp3',
    audioLabel: 'Listen to Ayatul Kursi, Qur’an 2:255',
  },
  {
    id: 'allahumma-inni-asaluka',
    title: 'A supplication reported from Anas',
    reference: 'Jami` at-Tirmidhi 3544',
    arabic:
      'اللَّهُمَّ إِنِّي أَسْأَلُكَ بِأَنِّي أَشْهَدُ أَنَّكَ أَنْتَ اللَّهُ لَا إِلَهَ إِلَّا أَنْتَ الْأَحَدُ الصَّمَدُ الَّذِي لَمْ يَلِدْ وَلَمْ يُولَدْ وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ',
    english:
      'O Allah, I ask You by my testimony that You are Allah; there is no deity except You, the One, the Eternal Refuge, who neither begets nor is born, and to whom none is comparable.',
    banglaPronunciation:
      'আল্লাহুম্মা ইন্নি আসআলুকা বিআন্নি আশহাদু আন্নাকা আনতা আল্লাহু লা ইলাহা ইল্লা আনতাল আহাদুস সামাদুল্লাজি লাম ইয়ালিদ ওয়া লাম ইউলাদ ওয়া লাম ইকুল্লাহু কুফুওয়ান আহাদ।',
    banglaMeaning:
      'হে আল্লাহ! আমি তোমার কাছে প্রার্থনা করছি আর সাক্ষ্য দিচ্ছি, তুমিই একমাত্র আল্লাহ, তুমি ছাড়া অন্য কোনো মাবুদ নেই, তুমি একক সত্তা, স্বয়ংসম্পূর্ণ, যিনি কাউকে জন্ম দেননি এবং তাকেও কেউ জন্ম দেয়নি, আর তাঁর সমকক্ষ কেউ নেই।',
    sourceUrl: 'https://sunnah.com/tirmidhi:3544',
  },
];

export const ISME_AZAM_QURAN_READINGS: QuranReading[] = [
  {
    id: 'ali-imran-2',
    title: 'Surah Aal-e-Imran',
    reference: 'Qur’an 3:2',
    arabic: 'ٱللَّهُ لَآ إِلَـٰهَ إِلَّا هُوَ ٱلْحَىُّ ٱلْقَيُّومُ',
    english:
      'Allah—there is no deity except Him, the Ever-Living, the Self-Sustaining.',
    sourceUrl: 'https://quran.com/3/2',
    audioUrl: 'https://audio.qurancdn.com/Alafasy/mp3/003002.mp3',
    audioLabel: 'Listen to Qur’an 3:2',
  },
  {
    id: 'taha-111',
    title: 'Surah Taha',
    reference: 'Qur’an 20:111',
    arabic:
      'وَعَنَتِ ٱلْوُجُوهُ لِلْحَىِّ ٱلْقَيُّومِ ۖ وَقَدْ خَابَ مَنْ حَمَلَ ظُلْمًا',
    english:
      'And [all] faces will be humbled before the Ever-Living, the Self-Sustaining. And he will have failed who carries injustice.',
    sourceUrl: 'https://quran.com/20/111',
    audioUrl: 'https://audio.qurancdn.com/Alafasy/mp3/020111.mp3',
    audioLabel: 'Listen to Qur’an 20:111',
  },
];

/** Well-known supplications for distress, from Hisnul Muslim (Fortress of the Muslim). */
export const DUAS: Dua[] = [
  {
    id: 'hammi-hazan',
    arabic:
      'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَالْعَجْزِ وَالْكَسَلِ، وَالْجُبْنِ وَالْبُخْلِ، وَضَلَعِ الدَّيْنِ، وَغَلَبَةِ الرِّجَالِ',
    transliteration:
      "Allahumma inni a'udhu bika min al-hammi wal-hazan, wal-'ajzi wal-kasal, wal-jubni wal-bukhl, wa dala'id-dayn, wa ghalabatir-rijal.",
    translation:
      'O Allah, I seek refuge in You from anxiety and sorrow, from weakness and laziness, from cowardice and miserliness, from being overwhelmed by debt and overpowered by people.',
    source: 'Hisnul Muslim (Fortress of the Muslim) — du\u2019a for distress',
  },
  {
    id: 'hayyu-qayyum',
    arabic: 'يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ',
    transliteration: 'Ya Hayyu Ya Qayyum, bi-rahmatika astaghith.',
    translation:
      'O Ever-Living, O Sustainer of all existence — by Your mercy I seek help.',
    source: 'Hisnul Muslim — reported in Jami\u2019 at-Tirmidhi',
  },
  {
    id: 'rahmataka-arju',
    arabic:
      'اللَّهُمَّ رَحْمَتَكَ أَرْجُو، فَلَا تَكِلْنِي إِلَى نَفْسِي طَرْفَةَ عَيْنٍ، وَأَصْلِحْ لِي شَأْنِي كُلَّهُ، لَا إِلَهَ إِلَّا أَنْتَ',
    transliteration:
      "Allahumma rahmataka arju, fala takilni ila nafsi tarfata 'ayn, wa aslih li sha'ni kullah, la ilaha illa Ant.",
    translation:
      'O Allah, I hope for Your mercy. Do not leave me to myself even for the blink of an eye. Set all my affairs right. There is no god but You.',
    source: 'Hisnul Muslim — reported in Sunan Abi Dawud',
  },
];

/** Gentle framing shown at the top of the Faith Corner. */
export const FAITH_INTRO =
  'An optional space for reflection and comfort. Faith and evidence-based treatment can support one another — feeling afraid is not a failing, and seeking help is not a lack of trust.';
