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
  // If user has a profile, use their info; otherwise, use onboarding defaults
  const initialProfile = user.id ? {
    email: user.email,
    name: user.name,
    age: user.age,
    gender: user.gender,
    role: user.role,
    procedure: user.procedure,
    stage: user.stage,
    language: user.language,
    timezone: user.timezone,
    hospital: user.hospital,
    interests: user.interests || [],
    availability: user.availability || ['weekday_morning', 'weekday_evening'],
    intro: user.intro,
  } : {
    email: user.email,
    name: "",
    age: "",
    gender: "prefer_not_to_say",
    role: 'mentee',
    procedure: '',
    stage: '',
    language: 'English',
    timezone: 'America/New_York',
    hospital: '',
    interests: [],
    availability: ['weekday_morning', 'weekday_evening'],
    intro: '',
  };

  const [profile, setProfile] = useState(initialProfile);
  const [editMode, setEditMode] = useState(!user.id); // If onboarding, start in edit mode
  const [interestInput, setInterestInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const canContinue = 
    profile.name && 
    profile.role && 
    profile.procedure && 
    profile.stage && 
    profile.language &&
    profile.timezone &&
    profile.hospital &&
    profile.intro;

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

  const validateProfile = () => {
    const requiredFields = ['name', 'age', 'gender', 'role', 'procedure', 'stage', 'language', 'timezone', 'hospital', 'intro'];
    const missingFields = requiredFields.filter(field => !profile[field]);
    if (missingFields.length > 0) {
      return `Please fill in all required fields: ${missingFields.join(', ')}`;
    }
    if (profile.age < 18) {
      return "You must be at least 18 years old to use this platform";
    }
    return null;
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    
    // Validate profile before submitting
    const validationError = validateProfile();
    if (validationError) {
      setError(validationError);
      setLoading(false);
      return;
    }

    try {
      const completeProfile = await createUser(profile);
      console.log('Profile saved successfully:', completeProfile);
      if (onProfileComplete) {
        onProfileComplete(completeProfile);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.detail || err.message || "Failed to save profile. Please try again.";
      setError(errorMessage);
      console.error('Profile save error:', err);
    } finally {
      setLoading(false);
    }
  };

  // If not in edit mode and user has a profile, show read-only view
  if (user.id && !editMode) {
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <Card>
          <div className="flex items-center gap-2 text-lg font-semibold"><UserCircle className="h-5 w-5" /> Your Profile</div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Field label="Your Name"><div>{profile.name}</div></Field>
            <Field label="Age"><div>{profile.age}</div></Field>
            <Field label="Gender"><div>{profile.gender}</div></Field>
            <Field label="Role"><div>{profile.role}</div></Field>
            <Field label="Procedure"><div>{profile.procedure}</div></Field>
            <Field label="Stage"><div>{profile.stage}</div></Field>
            <Field label="Primary language"><div>{profile.language}</div></Field>
            <Field label="Timezone"><div>{profile.timezone}</div></Field>
            <Field label="Hospital"><div>{profile.hospital}</div></Field>
          </div>
          <div className="mt-4">
            <Field label="About"><div>{profile.intro}</div></Field>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-2 text-lg font-semibold"><Heart className="h-5 w-5"/> Your Interests</div>
          <div className="mt-3 flex flex-wrap gap-2">
            {profile.interests && profile.interests.length > 0 ? profile.interests.map(i=> <Tag key={i} label={i}/>) : <span className="text-gray-500">No interests listed.</span>}
          </div>
        </Card>
        <div className="flex justify-end gap-3 items-center">
          <button className={`${primaryBtn} px-5`} onClick={() => setEditMode(true)}>
            Edit Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Header Section */}
      <div className="text-center space-y-2 py-4">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-neutral-100">Complete Your Profile</h1>
        <p className="text-lg text-gray-600 dark:text-neutral-400">Help us find your perfect match</p>
      </div>

      <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-neutral-900 dark:to-neutral-950 border-2 dark:border-neutral-700 shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/40">
            <UserCircle className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Your Profile</h2>
            <p className="text-sm text-gray-500 dark:text-neutral-400">The more details, the better the match</p>
          </div>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Field label="Your Name"><input className={inputClass} value={profile.name} onChange={e => handleUpdate('name', e.target.value)} placeholder="e.g., Alex Doe" /></Field>
            <Field label="Age">
              <input 
                type="number" 
                className={inputClass} 
                value={profile.age} 
                onChange={e => handleUpdate('age', parseInt(e.target.value) || "")} 
                placeholder="Your age" 
                min="18" 
                max="120"
              />
            </Field>
            <Field label="Gender">
              <select className={selectClass} value={profile.gender} onChange={e => handleUpdate('gender', e.target.value)}>
                <option value="prefer_not_to_say">Prefer not to say</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </Field>
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
       <Card className="bg-white/70 dark:bg-neutral-900/70 backdrop-blur-sm border border-gray-200 dark:border-neutral-800 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-pink-100 dark:bg-pink-900/40">
              <Heart className="h-6 w-6 text-pink-600 dark:text-pink-400"/>
            </div>
            <div>
              <h2 className="text-xl font-semibold">Your Interests</h2>
              <p className="text-sm text-gray-500 dark:text-neutral-400">Help us match you with similar people</p>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {profile.interests.length > 0 ? profile.interests.map(i=> <Tag key={i} label={i} onRemove={()=>removeInterest(i)}/>) : <p className="text-sm text-gray-500 dark:text-neutral-400">No interests added yet</p>}
          </div>
          <div className="mt-4 flex gap-2">
            <input className={inputClass + " flex-1"} value={interestInput} onChange={e=>setInterestInput(e.target.value)} placeholder="Type an interest" onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addInterest(interestInput))}/>
            <button className={secondaryBtn + " hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors"} onClick={()=>addInterest(interestInput)}>Add</button>
          </div>
           <div className="mt-4">
             <p className="text-xs text-gray-500 dark:text-neutral-400 mb-2">Quick add:</p>
             <div className="flex flex-wrap gap-2">
              {ALL_INTERESTS.filter(i => !profile.interests.includes(i)).map(opt => (
                <button key={opt} className="rounded-full border px-3 py-1 text-sm hover:bg-indigo-50 dark:border-neutral-700 dark:hover:bg-indigo-900/20 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors" onClick={()=>addInterest(opt)}>{opt}</button>
              ))}
            </div>
          </div>
      </Card>
      
      {/* Submit Section */}
      <div className="flex justify-between items-center p-6 rounded-2xl bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-neutral-900 dark:to-neutral-800 border border-indigo-200 dark:border-neutral-700">
        <div>
          <h3 className="font-semibold text-lg">Ready to find your match?</h3>
          <p className="text-sm text-gray-600 dark:text-neutral-400">Complete your profile to get started</p>
        </div>
        <div className="flex gap-3 items-center">
          {error && (
            <div className="rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-2">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}
          <button disabled={!canContinue || loading} className={`${primaryBtn} px-6 py-3 disabled:opacity-40 hover:scale-[1.02] transition-transform shadow-lg font-semibold`} onClick={handleSubmit}>
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white dark:border-black border-t-transparent"></div>
                Saving...
              </span>
            ) : (
              <span className="inline-flex items-center gap-2">
                Save and Find Matches <ArrowRight className="h-5 w-5" />
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}