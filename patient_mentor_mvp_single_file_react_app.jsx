import React, { useEffect, useMemo, useState } from "react";
import { MessageCircle, LogIn, UserCircle, Heart, Send, Shield, Search, Sparkles, LogOut, CheckCircle2, ArrowRight, Sun, Moon, Filter, Building2 } from "lucide-react";

// ------------------------------------------------------------
// HealLink — single-file React app
// (Frontend-only; mocks data + logic you can wire to a backend later.)
// Pages: Login → Profile → Matches (with filters) → Chat
// Dark mode: toggle adds/removes `dark` on <html> and uses Tailwind's `dark:` variants.
// ------------------------------------------------------------

// --- Utilities ------------------------------------------------
const save = (k, v) => localStorage.setItem(k, JSON.stringify(v));
const load = (k, d) => {
  try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; }
};

const ALL_INTERESTS = [
  "anime", "gaming", "music", "reading", "cooking", "fitness", "pets",
  "travel", "movies", "art", "photography", "gardening"
];

const PROCEDURES = [
  "Liver transplant", "Kidney transplant", "Knee replacement",
  "Heart bypass", "Mastectomy", "C-section", "Appendectomy"
];

const LANGUAGES = ["English", "Spanish", "French", "Chinese", "Arabic", "Hindi"];

const TIMEZONES = [
  "America/New_York", "America/Chicago", "America/Denver", "America/Los_Angeles",
  "Europe/London", "Europe/Paris", "Asia/Tokyo", "Asia/Kolkata"
];

const AVAILABILITY = ["Mornings", "Afternoons", "Evenings", "Weekends"];

const STAGES = ["Before (pre-op)", "After (post-op < 6mo)", "After (post-op ≥ 6mo)"];

const HOSPITALS = [
  "Mount Sinai Hospital", "NYU Langone", "Cleveland Clinic", "Mayo Clinic",
  "Mass General", "UCSF Medical Center", "Johns Hopkins", "Stanford Health Care"
];

const GENDERS = ["Male", "Female", "Non-binary"];

// Simple compatible stage mapping (mentor should generally be “after …”) 
const stageCompatible = (menteeStage, mentorStage) => {
  if (menteeStage?.startsWith?.("Before")) return mentorStage?.startsWith?.("After");
  // mentee after → any mentor who is after, preferring ≥ 6mo
  return mentorStage?.startsWith?.("After");
};

// --- Mock mentor directory -----------------------------------
const MOCK_MENTORS = [
  {
    id: "m1", name: "Alex R.", gender: "Male", language: "English", timezone: "America/New_York",
    role: "mentor", procedure: "Liver transplant", stage: "After (post-op ≥ 6mo)", hospital: "Mount Sinai Hospital",
    interests: ["anime", "music", "cooking"], availability: ["Evenings", "Weekends"],
    intro: "I had a liver transplant in 2023; happy to share tips on meds & recovery.", rating: 4.9
  },
  {
    id: "m2", name: "Bianca T.", gender: "Female", language: "Spanish", timezone: "America/Chicago",
    role: "mentor", procedure: "Kidney transplant", stage: "After (post-op < 6mo)", hospital: "Cleveland Clinic",
    interests: ["reading", "travel", "art"], availability: ["Mornings", "Weekends"],
    intro: "Fresh kidney recipient—what helped me most was organizing meds & walks.", rating: 4.7
  },
  {
    id: "m3", name: "Chris L.", gender: "Male", language: "English", timezone: "America/Los_Angeles",
    role: "mentor", procedure: "Liver transplant", stage: "After (post-op < 6mo)", hospital: "UCSF Medical Center",
    interests: ["gaming", "anime", "movies"], availability: ["Evenings"],
    intro: "Gamer & transplant mentor. I can talk diet, fatigue, and daily routines.", rating: 4.6
  },
  {
    id: "m4", name: "Dee P.", gender: "Female", language: "French", timezone: "Europe/Paris",
    role: "mentor", procedure: "Heart bypass", stage: "After (post-op ≥ 6mo)", hospital: "Mass General",
    interests: ["fitness", "cooking", "travel"], availability: ["Mornings", "Afternoons"],
    intro: "Cardiac rehab nerd. Happy to share gentle workout ideas.", rating: 4.8
  },
  {
    id: "m5", name: "Evan S.", gender: "Male", language: "English", timezone: "America/Denver",
    role: "mentor", procedure: "Liver transplant", stage: "After (post-op ≥ 6mo)", hospital: "Mayo Clinic",
    interests: ["photography", "pets", "gardening"], availability: ["Afternoons", "Weekends"],
    intro: "Nature photography got me moving again—ask me anything.", rating: 4.5
  },
  {
    id: "m6", name: "Farah K.", gender: "Female", language: "Arabic", timezone: "Europe/London",
    role: "mentor", procedure: "Mastectomy", stage: "After (post-op ≥ 6mo)", hospital: "Johns Hopkins",
    interests: ["art", "reading", "music"], availability: ["Evenings"],
    intro: "Been there; you’re not alone. We can talk body image & support.", rating: 4.8
  },
  {
    id: "m7", name: "Taylor J.", gender: "Non-binary", language: "English", timezone: "America/Los_Angeles",
    role: "mentor", procedure: "Liver transplant", stage: "After (post-op ≥ 6mo)", hospital: "Stanford Health Care",
    interests: ["anime", "travel", "art"], availability: ["Evenings"],
    intro: "NB mentor—happy to talk identity, support, and practical tips.", rating: 4.8
  },
];

// --- Icebreaker based on shared interests / context -----------
const INTEREST_OPENERS = {
  anime: "You both mentioned anime—maybe ask what show helped them through recovery.",
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

const makeIcebreaker = (shared, context) => {
  const key = shared[0];
  if (key && INTEREST_OPENERS[key]) return INTEREST_OPENERS[key];
  if (context?.procedure) {
    return `You share the ${context.procedure} journey—maybe start with what week you’re on and any med side‑effects.`;
  }
  return "Say hi and share why you signed up; one small question is enough to start.";
};

// --- Matching -------------------------------------------------
const scoreMentor = (profile, mentor) => {
  let score = 0;
  if (!mentor || mentor.role !== "mentor") return -1;
  if (mentor.procedure === profile.procedure) score += 100; else score -= 5;
  if (stageCompatible(profile.stage, mentor.stage)) score += 50;
  if (mentor.language === profile.language) score += 15;
  if (profile.availability?.some(a => mentor.availability.includes(a))) score += 10;
  const shared = (profile.interests || []).filter(i => mentor.interests.includes(i));
  score += shared.length * 12; // soft boost per interest
  return score;
};

const pickTopMentors = (profile, mentors, n = 9) => {
  const withScores = mentors.map(m => ({ m, s: scoreMentor(profile, m) }))
    .filter(({ s }) => s > 0)
    .sort((a, b) => b.s - a.s);
  return withScores.slice(0, n).map(({ m }) => m);
};

// --- UI atoms -------------------------------------------------
const Tag = ({ label, onRemove }) => (
  <span className="inline-flex items-center gap-1 rounded-full border px-3 py-1 text-sm dark:border-neutral-700 dark:text-neutral-300">
    {label}
    {onRemove && (
      <button className="-mr-1 rounded-full p-1 hover:bg-gray-100 dark:hover:bg-neutral-800" onClick={onRemove} aria-label={`Remove ${label}`}>
        ×
      </button>
    )}
  </span>
);

const Card = ({ children, className = "" }) => (
  <div className={"rounded-2xl shadow-sm border bg-white p-5 dark:bg-neutral-900 dark:border-neutral-800 " + className}>{children}</div>
);

const Field = ({ label, children, hint }) => (
  <label className="block">
    <div className="mb-1 text-sm text-gray-600 dark:text-neutral-400">{label}</div>
    {children}
    {hint && <div className="mt-1 text-xs text-gray-500 dark:text-neutral-500">{hint}</div>}
  </label>
);

const inputClass = "w-full rounded-xl border px-3 py-2 dark:bg-neutral-950 dark:border-neutral-700 dark:text-neutral-200 placeholder:dark:text-neutral-500";
const selectClass = inputClass;
const checkboxWrap = "inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm dark:border-neutral-700";
const ghostBtn = "rounded-xl border px-3 py-2 text-sm dark:border-neutral-700";
const primaryBtn = "rounded-xl bg-black px-4 py-2 text-white dark:bg-white dark:text-black";
const secondaryBtn = "rounded-xl border px-4 py-2 dark:border-neutral-700";

// --- Pages ----------------------------------------------------
function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const can = email.includes("@");
  return (
    <div className="mx-auto max-w-md space-y-6">
      <Card>
        <div className="flex items-center gap-2 text-xl font-semibold"><LogIn className="h-5 w-5"/> Log in / Sign up</div>
        <div className="mt-4 space-y-4">
          <Field label="Email">
            <input className={inputClass} value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com"/>
          </Field>
          <Field label="Password">
            <input type="password" className={inputClass} value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••"/>
          </Field>
          <button disabled={!can} onClick={()=>onLogin({ email })} className={`w-full ${primaryBtn} disabled:opacity-40`}>Continue</button>
          <p className="text-xs text-gray-500 dark:text-neutral-500">We’ll create your account on first login.</p>
        </div>
      </Card>
      <Card>
        <div className="flex items-center gap-2"><Shield className="h-5 w-5"/><span className="font-medium">Code of Conduct</span></div>
        <p className="mt-2 text-sm text-gray-600 dark:text-neutral-400">Be kind. No medical advice. Share personal experience only. If in crisis, call local emergency services.</p>
      </Card>
    </div>
  );
}

function ProfilePage({ profile, setProfile, onContinue }) {
  const [interestInput, setInterestInput] = useState("");
  const [accepted, setAccepted] = useState(load("coc_accepted", false));
  const can = profile.role && profile.procedure && profile.stage && profile.language && profile.hospital && (profile.interests||[]).length>0 && accepted;

  const addInterest = (v) => {
    if (!v) return; const curr = new Set(profile.interests || []); curr.add(v);
    setProfile({ ...profile, interests: Array.from(curr) }); setInterestInput("");
  };
  const removeInterest = (v) => setProfile({ ...profile, interests: (profile.interests||[]).filter(i=>i!==v) });

  useEffect(()=>save("coc_accepted", accepted),[accepted]);

  return (
    <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-5">
      <div className="md:col-span-3 space-y-6">
        <Card>
          <div className="flex items-center gap-2 text-lg font-semibold"><UserCircle className="h-5 w-5"/> Your Profile</div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Field label="I am a…">
              <select className={selectClass} value={profile.role||""} onChange={e=>setProfile({...profile, role:e.target.value})}>
                <option value="">Select</option>
                <option value="mentee">Mentee (seeking support)</option>
                <option value="mentor">Mentor (volunteer)</option>
              </select>
            </Field>
            <Field label="Primary language">
              <select className={selectClass} value={profile.language||""} onChange={e=>setProfile({...profile, language:e.target.value})}>
                <option value="">Select</option>
                {LANGUAGES.map(l=> <option key={l} value={l}>{l}</option>)}
              </select>
            </Field>
            <Field label="Procedure">
              <select className={selectClass} value={profile.procedure||""} onChange={e=>setProfile({...profile, procedure:e.target.value})}>
                <option value="">Select</option>
                {PROCEDURES.map(p=> <option key={p} value={p}>{p}</option>)}
              </select>
            </Field>
            <Field label="Stage">
              <select className={selectClass} value={profile.stage||""} onChange={e=>setProfile({...profile, stage:e.target.value})}>
                <option value="">Select</option>
                {STAGES.map(s=> <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>
            <Field label="Time zone">
              <select className={selectClass} value={profile.timezone||"America/New_York"} onChange={e=>setProfile({...profile, timezone:e.target.value})}>
                {TIMEZONES.map(tz=> <option key={tz} value={tz}>{tz}</option>)}
              </select>
            </Field>
            <Field label="Hospital">
              <select className={selectClass} value={profile.hospital||""} onChange={e=>setProfile({...profile, hospital:e.target.value})}>
                <option value="">Select</option>
                {HOSPITALS.map(h=> <option key={h} value={h}>{h}</option>)}
              </select>
              <div className="mt-1 text-xs text-gray-500 dark:text-neutral-500">Used for filters like <b>My hospital only</b>.</div>
            </Field>
            <Field label="Availability">
              <div className="flex flex-wrap gap-2">
                {AVAILABILITY.map(a=> (
                  <label key={a} className={checkboxWrap}>
                    <input type="checkbox" checked={profile.availability?.includes(a)||false} onChange={e=>{
                      const set = new Set(profile.availability||[]);
                      if (e.target.checked) set.add(a); else set.delete(a);
                      setProfile({...profile, availability: Array.from(set)});
                    }}/>
                    {a}
                  </label>
                ))}
              </div>
            </Field>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-2 text-lg font-semibold"><Heart className="h-5 w-5"/> Interests</div>
          <div className="mt-3 flex flex-wrap gap-2">
            {(profile.interests||[]).map(i=> <Tag key={i} label={i} onRemove={()=>removeInterest(i)}/>) }
          </div>
          <div className="mt-4 flex gap-2">
            <input className={inputClass + " flex-1"} value={interestInput} onChange={e=>setInterestInput(e.target.value)} placeholder="Type an interest (e.g., anime)"/>
            <button className={secondaryBtn} onClick={()=>addInterest(interestInput.trim().toLowerCase())}>Add</button>
            <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500 dark:text-neutral-500"><Sparkles className="h-4 w-4"/> or pick:</div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {ALL_INTERESTS.map(opt => (
              <button key={opt} className="rounded-full border px-3 py-1 text-sm hover:bg-gray-50 dark:border-neutral-700 dark:hover:bg-neutral-800" onClick={()=>addInterest(opt)}>{opt}</button>
            ))}
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-2"><Shield className="h-5 w-5"/><span className="font-medium">Agree to the Code of Conduct</span></div>
          <label className="mt-3 flex items-center gap-2 text-sm">
            <input type="checkbox" checked={accepted} onChange={e=>setAccepted(e.target.checked)} />
            I agree to be respectful, avoid medical advice, and keep messages private.
          </label>
        </Card>
        <div className="flex justify-end gap-3">
          <button className={secondaryBtn} onClick={()=>{ save("profile", profile); alert("Saved!"); }}>Save</button>
          <button disabled={!can} className={`${primaryBtn} px-5 disabled:opacity-40`} onClick={()=>{ save("profile", profile); onContinue(); }}>Find matches <ArrowRight className="ml-2 inline h-4 w-4"/></button>
        </div>
      </div>
      <div className="md:col-span-2 space-y-6">
        <Card>
          <div className="font-semibold">Tips</div>
          <ul className="mt-2 list-disc pl-5 text-sm text-gray-600 dark:text-neutral-400">
            <li>Pick your exact procedure for better matches.</li>
            <li>Stage matters: pre‑op mentees usually match with post‑op mentors.</li>
            <li>Shared hobbies (e.g., <b>anime</b>) make first messages easier.</li>
          </ul>
        </Card>
        <Card>
          <div className="font-semibold">What we store</div>
          <div className="mt-2 text-sm text-gray-600 dark:text-neutral-400">Email, profile, interests, and chat. You can request deletion anytime.</div>
        </Card>
      </div>
    </div>
  );
}

function MatchesPage({ profile, onChoose }) {
  const [gender, setGender] = useState("Any"); // Any | Male | Female | Non-binary
  const [hospitals, setHospitals] = useState([]); // string[]
  const [myHospitalOnly, setMyHospitalOnly] = useState(false);

  const filtered = useMemo(() => {
    let arr = [...MOCK_MENTORS];
    if (gender !== "Any") arr = arr.filter(m => (m.gender||"").toLowerCase() === gender.toLowerCase());
    if (hospitals.length) arr = arr.filter(m => hospitals.includes(m.hospital));
    if (myHospitalOnly && profile.hospital) arr = arr.filter(m => m.hospital === profile.hospital);
    return arr;
  }, [gender, hospitals, myHospitalOnly, profile.hospital]);

  const topMentors = useMemo(() => pickTopMentors(profile, filtered, 9), [profile, filtered]);
  const noResults = topMentors.length === 0;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xl font-semibold"><Search className="h-5 w-5"/> Suggested mentors</div>
        <div className="text-sm text-gray-600 dark:text-neutral-400">Procedure: <b>{profile.procedure||"—"}</b> · Stage: <b>{profile.stage||"—"}</b></div>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex items-center gap-2 text-sm font-medium"><Filter className="h-4 w-4"/> Filters</div>
        <div className="mt-3 grid gap-4 md:grid-cols-3">
          <Field label="Mentor gender">
            <div className="flex flex-wrap gap-2">
              {(["Any", ...GENDERS]).map(g => (
                <button key={g} onClick={()=>setGender(g)} className={`rounded-xl px-3 py-1.5 text-sm border dark:border-neutral-700 ${gender===g ? 'bg-black text-white dark:bg-white dark:text-black' : ''}`}>{g}</button>
              ))}
            </div>
          </Field>
          <Field label="Hospitals">
            <div className="flex flex-wrap gap-2">
              {HOSPITALS.map(h => (
                <label key={h} className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm dark:border-neutral-700">
                  <input type="checkbox" checked={hospitals.includes(h)} onChange={e=>{
                    const set = new Set(hospitals);
                    if (e.target.checked) set.add(h); else set.delete(h);
                    setHospitals(Array.from(set));
                  }}/>
                  {h}
                </label>
              ))}
            </div>
          </Field>
          <Field label=" ">
            <label className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm dark:border-neutral-700">
              <input type="checkbox" checked={myHospitalOnly} onChange={e=>setMyHospitalOnly(e.target.checked)} />
              <span className="inline-flex items-center gap-1"><Building2 className="h-4 w-4"/> My hospital only{profile.hospital ? `: ${profile.hospital}` : ''}</span>
            </label>
            <div className="mt-1 text-xs text-gray-500 dark:text-neutral-500">Change your hospital in Profile.</div>
          </Field>
        </div>
        {(gender!=="Any" || hospitals.length>0 || myHospitalOnly) && (
          <div className="mt-3 flex flex-wrap gap-2">
            {gender!=="Any" && <Tag label={`Gender: ${gender}`} onRemove={()=>setGender("Any")} />}
            {myHospitalOnly && <Tag label={`My hospital: ${profile.hospital||'—'}`} onRemove={()=>setMyHospitalOnly(false)} />}
            {hospitals.map(h => <Tag key={h} label={h} onRemove={()=>setHospitals(hospitals.filter(x=>x!==h))} />)}
          </div>
        )}
        {(gender!=="Any" || hospitals.length>0 || myHospitalOnly) && (
          <div className="mt-3">
            <button onClick={()=>{ setGender("Any"); setHospitals([]); setMyHospitalOnly(false); }} className={ghostBtn}>Clear all</button>
          </div>
        )}
      </Card>

      {noResults && (
        <Card>
          <div className="text-gray-700 dark:text-neutral-300">No mentors match your filters. Try switching gender to <b>Any</b>, unchecking <b>My hospital only</b>, or picking different hospitals.</div>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        {topMentors.map(m => (
          <Card key={m.id}>
            <div className="flex items-start justify-between">
              <div>
                <div className="text-lg font-semibold">{m.name}</div>
                <div className="text-xs text-gray-500 dark:text-neutral-500">{m.gender} · {m.language} · {m.timezone}</div>
                <div className="mt-1 inline-flex items-center gap-1 text-xs text-gray-600 dark:text-neutral-400"><Building2 className="h-3.5 w-3.5"/> {m.hospital}</div>
              </div>
              <div className="rounded-full bg-emerald-50 px-2 py-1 text-xs text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 flex items-center gap-1"><CheckCircle2 className="h-4 w-4"/> {m.rating.toFixed(1)}</div>
            </div>
            <div className="mt-2 text-sm text-gray-700 dark:text-neutral-300">{m.intro}</div>
            <div className="mt-3 flex flex-wrap gap-2">
              {m.interests.map(i=> <Tag key={i} label={i}/>) }
            </div>
            <button onClick={()=>onChoose(m)} className={`mt-4 w-full ${primaryBtn}`}>Start chatting</button>
          </Card>
        ))}
      </div>
    </div>
  );
}

function ChatPage({ self, mentor, context, onExit }) {
  const key = `chat_${mentor.id}`;
  const [messages, setMessages] = useState(load(key, []));
  const sharedInterests = (self.interests||[]).filter(i => mentor.interests.includes(i));
  const [input, setInput] = useState("");
  const [ice, setIce] = useState("");

  useEffect(()=> save(key, messages), [key, messages]);

  const send = () => {
    if (!input.trim()) return;
    setMessages([...messages, { from: "me", text: input.trim(), ts: Date.now() }]);
    setInput("");
    setTimeout(()=>{
      // Mock mentor echo
      setMessages(curr => [...curr, { from: "them", text: "Thanks for reaching out—happy to chat!", ts: Date.now() }]);
    }, 600);
  };

  const suggestIcebreaker = () => {
    const suggestion = makeIcebreaker(sharedInterests, context);
    setIce(suggestion);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      <Card>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-neutral-800"><UserCircle/></div>
            <div>
              <div className="font-semibold">{mentor.name}</div>
              <div className="text-xs text-gray-500 dark:text-neutral-500">{mentor.procedure} · {mentor.stage}</div>
            </div>
          </div>
          <button onClick={onExit} className={ghostBtn}>End chat</button>
        </div>
      </Card>

      <div className="rounded-2xl border bg-white p-4 dark:bg-neutral-900 dark:border-neutral-800">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-neutral-400">
            <MessageCircle className="h-4 w-4"/> In‑app messages
          </div>
          <button onClick={suggestIcebreaker} className="inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-sm hover:bg-gray-50 dark:border-neutral-700 dark:hover:bg-neutral-800"><Sparkles className="h-4 w-4"/> AI icebreaker</button>
        </div>

        {ice && (
          <div className="mb-3 rounded-xl border bg-amber-50 p-3 text-sm text-amber-900 dark:border-neutral-800 dark:bg-amber-900/20 dark:text-amber-200">
            <div className="mb-1 font-medium">Suggestion</div>
            {ice}
          </div>
        )}

        <div className="h-72 overflow-y-auto rounded-2xl border bg-gray-50 p-3 dark:bg-neutral-900 dark:border-neutral-800">
          {messages.length === 0 && (
            <div className="text-center text-sm text-gray-500 dark:text-neutral-500">No messages yet. Say hello!</div>
          )}
          <div className="space-y-2">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[70%] rounded-2xl px-3 py-2 text-sm ${m.from === "me" ? "bg-black text-white dark:bg-white dark:text-black" : "bg-white border dark:bg-neutral-900 dark:border-neutral-800"}`}>
                  {m.text}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-3 flex gap-2">
          <input className={inputClass + " flex-1"} value={input} onChange={e=>setInput(e.target.value)} placeholder="Write a message…"/>
          <button onClick={send} className={`inline-flex items-center gap-2 ${primaryBtn}`}><Send className="h-4 w-4"/> Send</button>
        </div>
      </div>

      <Card>
        <div className="text-sm text-gray-600 dark:text-neutral-400">Safety note: Mentors share lived experience only and do not provide medical advice.</div>
      </Card>
    </div>
  );
}

// --- App shell ------------------------------------------------
export default function App() {
  const [route, setRoute] = useState("login");
  const [user, setUser] = useState(load("user", null));
  const [profile, setProfile] = useState(load("profile", { role: "mentee", language: "English", timezone: "America/New_York", hospital: "Mount Sinai Hospital", interests: ["anime"], availability: ["Evenings"], }));
  const [activeMentor, setActiveMentor] = useState(null);
  const [theme, setTheme] = useState(load("theme", "light")); // "light" | "dark"

  useEffect(()=> { if (user) setRoute("profile"); }, []);
  useEffect(()=> save("user", user), [user]);
  useEffect(()=> save("profile", profile), [profile]);
  useEffect(()=> { // apply theme to <html>
    save("theme", theme);
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark"); else root.classList.remove("dark");
  }, [theme]);

  const logout = () => { setUser(null); setRoute("login"); };
  const toggleTheme = () => setTheme(t => t === "dark" ? "light" : "dark");

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-950 dark:text-neutral-200">
      <header className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur dark:bg-neutral-950/70 dark:border-neutral-800">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-black text-white font-bold dark:bg-white dark:text-black">HL</div>
            <div className="text-lg font-semibold">HealLink</div>
          </div>
          <nav className="hidden gap-2 md:flex">
            <NavButton label="Login" active={route==="login"} onClick={()=>setRoute("login")} />
            <NavButton label="Profile" active={route==="profile"} onClick={()=>setRoute("profile")} />
            <NavButton label="Matches" active={route==="matches"} onClick={()=>setRoute("matches")} />
            <NavButton label="Chat" active={route==="chat"} onClick={()=>setRoute("chat")} />
          </nav>
          <div className="flex items-center gap-2">
            <button onClick={toggleTheme} className="rounded-xl border px-3 py-1.5 text-sm dark:border-neutral-700" aria-label="Toggle dark mode">
              {theme === "dark" ? (<span className="inline-flex items-center gap-1"><Sun className="h-4 w-4"/> Light</span>) : (<span className="inline-flex items-center gap-1"><Moon className="h-4 w-4"/> Dark</span>)}
            </button>
            {user ? (
              <button onClick={logout} className="inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-sm dark:border-neutral-700"><LogOut className="h-4 w-4"/> {user.email}</button>
            ) : (
              <span className="text-sm text-gray-500 dark:text-neutral-500">Not signed in</span>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        {route === "login" && (
          <LoginPage onLogin={(u)=>{ setUser(u); setRoute("profile"); }} />
        )}

        {route === "profile" && (
          <ProfilePage profile={profile} setProfile={setProfile} onContinue={()=>setRoute("matches")} />
        )}

        {route === "matches" && (
          <MatchesPage profile={profile} onChoose={(m)=>{ setActiveMentor(m); setRoute("chat"); }} />
        )}

        {route === "chat" && (
          activeMentor ? (
            <ChatPage self={profile} mentor={activeMentor} context={{ procedure: profile.procedure }} onExit={()=>setRoute("matches")} />
          ) : (
            <Card>
              <div className="flex items-center gap-2 text-gray-700 dark:text-neutral-300"><MessageCircle className="h-5 w-5"/> No active chat</div>
              <div className="mt-2 text-sm text-gray-500 dark:text-neutral-500">Pick a mentor from Matches to start a conversation.</div>
              <button className={`${primaryBtn} mt-4`} onClick={()=>setRoute("matches")}>Go to Matches</button>
            </Card>
          )
        )}
      </main>

      <footer className="mt-8 border-t bg-white/70 dark:bg-neutral-950/70 dark:border-neutral-800">
        <div className="mx-auto max-w-6xl px-4 py-6 text-xs text-gray-500 dark:text-neutral-500">
          © {new Date().getFullYear()} HealLink · For demo purposes only · If you need urgent help, contact local emergency services.
        </div>
      </footer>
    </div>
  );
}

function NavButton({ label, active, onClick }) {
  return (
    <button onClick={onClick} className={`rounded-xl px-3 py-1.5 text-sm ${active ? "bg-black text-white dark:bg-white dark:text-black" : "border dark:border-neutral-700"}`}>{label}</button>
  );
}
