import React, { useState } from 'react';
import { UserCircle, Heart, Trash2 } from 'lucide-react';
import { Card } from '../components/Card';
import { Field } from '../components/Field';
import { Tag } from '../components/Tag';
import { updateUser, deleteUser } from '../api/apiClient';
import { PROCEDURES, LANGUAGES, STAGES, HOSPITALS, ALL_INTERESTS } from '../constants';

const inputClass = "w-full rounded-xl border px-3 py-2 dark:bg-neutral-950 dark:border-neutral-700 dark:text-neutral-200 placeholder:dark:text-neutral-500";
const selectClass = inputClass;
const primaryBtn = "rounded-xl bg-black px-4 py-2 text-white dark:bg-white dark:text-black";
const secondaryBtn = "rounded-xl border px-4 py-2 dark:border-neutral-700";

export function SettingsPage({ user, onProfileUpdate, onLogout }) {
  const [profile, setProfile] = useState(user);
  const [interestInput, setInterestInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
      const updatedProfile = await updateUser(user.id, profile);
      onProfileUpdate(updatedProfile);
      alert("Profile updated successfully!");
    } catch (err) {
      setError("Failed to update profile. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      setLoading(true);
      setError("");
      try {
        await deleteUser(user.id);
        alert("Account deleted successfully.");
        onLogout();
      } catch (err) {
        setError("Failed to delete account. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>
      
      <Card>
        <div className="flex items-center gap-2 text-lg font-semibold"><UserCircle className="h-5 w-5" /> Your Profile</div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Field label="Your Name"><input className={inputClass} value={profile.name} onChange={e => handleUpdate('name', e.target.value)} /></Field>
            <Field label="I am a…">
              <select className={selectClass} value={profile.role} onChange={e => handleUpdate('role', e.target.value)}>
                <option value="mentee">Mentee</option><option value="mentor">Mentor</option>
              </select>
            </Field>
            <Field label="Procedure"><select className={selectClass} value={profile.procedure} onChange={e => handleUpdate('procedure', e.target.value)}>{PROCEDURES.map(p => <option key={p} value={p}>{p}</option>)}</select></Field>
            <Field label="Stage"><select className={selectClass} value={profile.stage} onChange={e => handleUpdate('stage', e.target.value)}>{STAGES.map(s => <option key={s} value={s}>{s}</option>)}</select></Field>
            <Field label="Primary language"><select className={selectClass} value={profile.language} onChange={e => handleUpdate('language', e.target.value)}>{LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}</select></Field>
            <Field label="Hospital"><select className={selectClass} value={profile.hospital} onChange={e => handleUpdate('hospital', e.target.value)}>{HOSPITALS.map(h => <option key={h} value={h}>{h}</option>)}</select></Field>
        </div>
        <div className="mt-4">
          <Field label="A little about yourself (for matching)">
            <textarea className={inputClass} rows="4" value={profile.intro} onChange={e => handleUpdate('intro', e.target.value)} />
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
        <button disabled={loading} className={`${primaryBtn} px-5`} onClick={handleSubmit}>
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <Card>
        <h2 className="text-lg font-semibold text-red-600 dark:text-red-500">Danger Zone</h2>
        <div className="mt-4 flex items-center justify-between p-4 border border-red-500/50 rounded-lg">
          <div>
            <h3 className="font-medium">Delete Account</h3>
            <p className="text-sm text-gray-500 dark:text-neutral-400">Permanently remove your account and all associated data.</p>
          </div>
          <button disabled={loading} onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white rounded-lg px-4 py-2 text-sm inline-flex items-center gap-2">
            <Trash2 className="h-4 w-4" /> Delete
          </button>
        </div>
      </Card>
    </div>
  );
}