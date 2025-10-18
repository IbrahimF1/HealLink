// Shared constants and utility functions for HealLink MVP

// --- Interests, Procedures, Languages, etc. ---
export const ALL_INTERESTS = [
  "anime",
  "gaming",
  "music",
  "reading",
  "cooking",
  "fitness",
  "pets",
  "travel",
  "movies",
  "art",
  "photography",
  "gardening",
];

export const PROCEDURES = [
  "Liver transplant",
  "Kidney transplant",
  "Knee replacement",
  "Heart bypass",
  "Mastectomy",
  "C-section",
  "Appendectomy",
];

export const LANGUAGES = [
  "English",
  "Spanish",
  "French",
  "Chinese",
  "Arabic",
  "Hindi",
];

export const TIMEZONES = [
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Paris",
  "Asia/Tokyo",
  "Asia/Kolkata",
];

export const AVAILABILITY = ["Mornings", "Afternoons", "Evenings", "Weekends"];

export const STAGES = [
  "Before (pre-op)",
  "After (post-op < 6mo)",
  "After (post-op ≥ 6mo)",
];

export const HOSPITALS = [
  "Mount Sinai Hospital",
  "NYU Langone",
  "Cleveland Clinic",
  "Mayo Clinic",
  "Mass General",
  "UCSF Medical Center",
  "Johns Hopkins",
  "Stanford Health Care",
];

export const GENDERS = ["Male", "Female", "Non-binary"];

// --- Stage compatibility utility ---
export function stageCompatible(menteeStage, mentorStage) {
  if (menteeStage?.startsWith?.("Before"))
    return mentorStage?.startsWith?.("After");
  return mentorStage?.startsWith?.("After");
}

// --- Mock mentor directory ---
export const MOCK_MENTORS = [
  {
    id: "m1",
    name: "Alex R.",
    gender: "Male",
    language: "English",
    timezone: "America/New_York",
    role: "mentor",
    procedure: "Liver transplant",
    stage: "After (post-op ≥ 6mo)",
    hospital: "Mount Sinai Hospital",
    interests: ["anime", "music", "cooking"],
    availability: ["Evenings", "Weekends"],
    intro:
      "I had a liver transplant in 2023; happy to share tips on meds & recovery.",
    rating: 4.9,
  },
  {
    id: "m2",
    name: "Bianca T.",
    gender: "Female",
    language: "Spanish",
    timezone: "America/Chicago",
    role: "mentor",
    procedure: "Kidney transplant",
    stage: "After (post-op < 6mo)",
    hospital: "Cleveland Clinic",
    interests: ["reading", "travel", "art"],
    availability: ["Mornings", "Weekends"],
    intro:
      "Fresh kidney recipient—what helped me most was organizing meds & walks.",
    rating: 4.7,
  },
  {
    id: "m3",
    name: "Chris L.",
    gender: "Male",
    language: "English",
    timezone: "America/Los_Angeles",
    role: "mentor",
    procedure: "Liver transplant",
    stage: "After (post-op < 6mo)",
    hospital: "UCSF Medical Center",
    interests: ["gaming", "anime", "movies"],
    availability: ["Evenings"],
    intro:
      "Gamer & transplant mentor. I can talk diet, fatigue, and daily routines.",
    rating: 4.6,
  },
  {
    id: "m4",
    name: "Dee P.",
    gender: "Female",
    language: "French",
    timezone: "Europe/Paris",
    role: "mentor",
    procedure: "Heart bypass",
    stage: "After (post-op ≥ 6mo)",
    hospital: "Mass General",
    interests: ["fitness", "cooking", "travel"],
    availability: ["Mornings", "Afternoons"],
    intro: "Cardiac rehab nerd. Happy to share gentle workout ideas.",
    rating: 4.8,
  },
  {
    id: "m5",
    name: "Evan S.",
    gender: "Male",
    language: "English",
    timezone: "America/Denver",
    role: "mentor",
    procedure: "Liver transplant",
    stage: "After (post-op ≥ 6mo)",
    hospital: "Mayo Clinic",
    interests: ["photography", "pets", "gardening"],
    availability: ["Afternoons", "Weekends"],
    intro: "Nature photography got me moving again—ask me anything.",
    rating: 4.5,
  },
  {
    id: "m6",
    name: "Farah K.",
    gender: "Female",
    language: "Arabic",
    timezone: "Europe/London",
    role: "mentor",
    procedure: "Mastectomy",
    stage: "After (post-op ≥ 6mo)",
    hospital: "Johns Hopkins",
    interests: ["art", "reading", "music"],
    availability: ["Evenings"],
    intro: "Been there; you’re not alone. We can talk body image & support.",
    rating: 4.8,
  },
  {
    id: "m7",
    name: "Taylor J.",
    gender: "Non-binary",
    language: "English",
    timezone: "America/Los_Angeles",
    role: "mentor",
    procedure: "Liver transplant",
    stage: "After (post-op ≥ 6mo)",
    hospital: "Stanford Health Care",
    interests: ["anime", "travel", "art"],
    availability: ["Evenings"],
    intro: "NB mentor—happy to talk identity, support, and practical tips.",
    rating: 4.8,
  },
];

// --- Icebreaker suggestions ---
export const INTEREST_OPENERS = {
  anime:
    "You both mentioned anime—maybe ask what show helped them through recovery.",
  gaming: "You both enjoy gaming—what cozy game worked well post-op?",
  music: "You both like music—favorite calm playlist for tough days?",
  reading: "You both read—any book recs that made hospital time easier?",
  cooking: "You both cook—go-to easy recipe during recovery?",
  fitness: "You both value fitness—what gentle movement helped first?",
  pets: "You both love pets—did caring for a pet affect recovery?",
  travel: "You both travel—tips for first trip after surgery?",
  movies: "You both watch movies—any comfort films for bad days?",
  art: "You both like art—creative activities that reduced stress?",
  photography: "You both do photography—walk ideas to rebuild stamina?",
  gardening: "You both garden—light tasks safe in early weeks?",
};

export function makeIcebreaker(shared, context) {
  const key = shared[0];
  if (key && INTEREST_OPENERS[key]) return INTEREST_OPENERS[key];
  if (context?.procedure) {
    return `You share the ${context.procedure} journey—maybe start with what week you’re on and any med side‑effects.`;
  }
  return "Say hi and share why you signed up; one small question is enough to start.";
}

// --- Matching utilities ---
export function scoreMentor(profile, mentor) {
  let score = 0;
  if (!mentor || mentor.role !== "mentor") return -1;
  if (mentor.procedure === profile.procedure) score += 100;
  else score -= 5;
  if (stageCompatible(profile.stage, mentor.stage)) score += 50;
  if (mentor.language === profile.language) score += 15;
  if (profile.availability?.some((a) => mentor.availability.includes(a)))
    score += 10;
  const shared = (profile.interests || []).filter((i) =>
    mentor.interests.includes(i),
  );
  score += shared.length * 12;
  return score;
}

export function pickTopMentors(profile, mentors, n = 9) {
  const withScores = mentors
    .map((m) => ({ m, s: scoreMentor(profile, m) }))
    .filter(({ s }) => s > 0)
    .sort((a, b) => b.s - a.s);
  return withScores.slice(0, n).map(({ m }) => m);
}

// --- Local storage helpers ---
export function save(k, v) {
  localStorage.setItem(k, JSON.stringify(v));
}

export function load(k, d) {
  try {
    const v = localStorage.getItem(k);
    return v ? JSON.parse(v) : d;
  } catch {
    return d;
  }
}
