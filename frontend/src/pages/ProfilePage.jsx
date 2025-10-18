// src/pages/ProfilePage.jsx
import React, { useState } from 'react';
import { UserCircle, Heart, ArrowRight } from 'lucide-react';
import { Card } from '../components/Card';
import { Field } from '../components/Field';
import { Tag } from '../components/Tag';
import { createUser, updateUser } from '../api/apiClient';
import { PROCEDURES, LANGUAGES, STAGES, HOSPITALS, ALL_INTERESTS } from '../constants';

const inputClass = "w-full rounded-xl border px-3 py-2 dark:bg-neutral-950 dark:border-neutral-700 dark:text-neutral-200 placeholder:dark:text-neutral-500";
const selectClass = inputClass;
const primaryBtn = "rounded-xl bg-black px-4 py-2 text-white dark:bg-white dark:text-black";
const secondaryBtn = "rounded-xl border px-4 py-2 dark:border-neutral-700";

export function ProfilePage({ user, onProfileComplete }) {
  const [profile, setProfile] = useState({
    email: user.email,
    name: "",
    role: 'mentee',
    procedure: '',
    stage: '',
    language: 'English',
    timezone: 'America/New_York',
    hospital: '',
    interests: [],
    availability: [],
    intro: '',
  });
  const [interestInput, setInterestInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const canContinue = profile.name && profile.role && profile.procedure && profile.stage && profile.intro;

  const handleUpdate = (field, value) => {
    setProfile(p => ({ ...p, [field]: value }));
  };
  
  const addInterest = (v) => {
    if (!v || profile.interests.includes(v)) return;
    handleUpdate('interests', [...profile.interests, v.trim().toLowerCase()]);
    setInterestInput("");
  };

  const removeInterest = (v) => {
    handleUpdate('interests', profile.interests.filter(i => i !== v));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const createdProfile = await createUser(profile);
      onProfileComplete(createdProfile);
    } catch (err) {
      setError("Failed to save profile. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Card>
        <div className="flex items-center gap-2 text-lg font-semibold"><UserCircle className="h-5 w-5" /> Your Profile</div>
        <p className="mt-2 text-sm text-gray-500 dark:text-neutral-400">Complete your profile to find the best match. The more details you provide, the better we can connect you.</p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Field label="Your Name"><input className={inputClass} value={profile.name} onChange={e => handleUpdate('name', e.target.value)} placeholder="e.g., Alex Doe" /></Field>
            <Field label="I am a…">
              <select className={selectClass} value={profile.role} onChange={e => handleUpdate('role', e.target.value)}>
                <option value="mentee">Mentee (seeking support)</option>
                <option value="mentor">Mentor (offering support)</option>
              </select>
            </Field>
            <Field label="Procedure"><select className={selectClass} value={profile.procedure} onChange={e => handleUpdate('procedure', e.target.value)}><option value="">Select...</option>{PROCEDURES.map(p => <option key={p} value={p}>{p}</option>)}</select></Field>
            <Field label="Stage"><select className={selectClass} value={profile.stage} onChange={e => handleUpdate('stage', e.target.value)}><option value="">Select...</option>{STAGES.map(s => <option key={s} value={s}>{s}</option>)}</select></Field>
            <Field label="Primary language"><select className={selectClass} value={profile.language} onChange={e => handleUpdate('language', e.target.value)}><option value="">Select...</option>{LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}</select></Field>
            <Field label="Hospital"><select className={selectClass} value={profile.hospital} onChange={e => handleUpdate('hospital', e.target.value)}><option value="">Select...</option>{HOSPITALS.map(h => <option key={h} value={h}>{h}</option>)}</select></Field>
        </div>
        <div className="mt-4">
          <Field label="A little about yourself (for matching)">
            <textarea className={inputClass} rows="4" value={profile.intro} onChange={e => handleUpdate('intro', e.target.value)} placeholder="Share a bit about your journey, hobbies, or what you're looking for... This helps our AI find a good match." />
          </Field>
        </div>
      </Card>
       <Card>
          <div className="flex items-center gap-2 text-lg font-semibold"><Heart className="h-5 w-5"/> Your Interests</div>
          <div className="mt-3 flex flex-wrap gap-2">
            {profile.interests.map(i=> <Tag key={i} label={i} onRemove={()=>removeInterest(i)}/>) }
          </div>
          <div className="mt-4 flex gap-2">
            <input className={inputClass + " flex-1"} value={interestInput} onChange={e=>setInterestInput(e.target.value)} placeholder="Type an interest"/>
            <button className={secondaryBtn} onClick={()=>addInterest(interestInput)}>Add</button>
          </div>
           <div className="mt-3 flex flex-wrap gap-2">
            {ALL_INTERESTS.filter(i => !profile.interests.includes(i)).map(opt => (
              <button key={opt} className="rounded-full border px-3 py-1 text-sm hover:bg-gray-50 dark:border-neutral-700 dark:hover:bg-neutral-800" onClick={()=>addInterest(opt)}>{opt}</button>
            ))}
          </div>
      </Card>
      <div className="flex justify-end gap-3 items-center">
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button disabled={!canContinue || loading} className={`${primaryBtn} px-5 disabled:opacity-40`} onClick={handleSubmit}>
          {loading ? 'Saving...' : <>Save and Find Matches <ArrowRight className="ml-2 inline h-4 w-4" /></>}
        </button>
      </div>
    </div>
  );
}