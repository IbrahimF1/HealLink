import React, { useState, useEffect } from "react";
import { UserCircle, Heart, Shield, ArrowRight, Sparkles } from "lucide-react";
import {
  ALL_INTERESTS,
  PROCEDURES,
  LANGUAGES,
  TIMEZONES,
  AVAILABILITY,
  STAGES,
  HOSPITALS,
  save,
  load,
} from "../constants_mvp";
import Card from "../components/Card";
import Tag from "../components/Tag";
import Field from "../components/Field";

/**
 * ProfilePage — HealLink MVP version
 * Props:
 * - profile: object (user profile state)
 * - setProfile: function (update profile state)
 * - onContinue: function (called when user clicks "Find matches")
 */
export default function ProfilePage({ profile, setProfile, onContinue }) {
  const [interestInput, setInterestInput] = useState("");
  const [accepted, setAccepted] = useState(load("coc_accepted", false));
  const can =
    profile.role &&
    profile.procedure &&
    profile.stage &&
    profile.language &&
    profile.hospital &&
    (profile.interests || []).length > 0 &&
    accepted;

  const addInterest = (v) => {
    if (!v) return;
    const curr = new Set(profile.interests || []);
    curr.add(v);
    setProfile({ ...profile, interests: Array.from(curr) });
    setInterestInput("");
  };
  const removeInterest = (v) =>
    setProfile({
      ...profile,
      interests: (profile.interests || []).filter((i) => i !== v),
    });

  useEffect(() => save("coc_accepted", accepted), [accepted]);

  const inputClass =
    "w-full rounded-xl border px-3 py-2 dark:bg-neutral-950 dark:border-neutral-700 dark:text-neutral-200 placeholder:dark:text-neutral-500";
  const selectClass = inputClass;
  const checkboxWrap =
    "inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm dark:border-neutral-700";
  const secondaryBtn = "rounded-xl border px-4 py-2 dark:border-neutral-700";
  const primaryBtn =
    "rounded-xl bg-black px-4 py-2 text-white dark:bg-white dark:text-black";

  return (
    <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-5">
      <div className="md:col-span-3 space-y-6">
        <Card>
          <div className="flex items-center gap-2 text-lg font-semibold">
            <UserCircle className="h-5 w-5" /> Your Profile
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Field label="I am a…">
              <select
                className={selectClass}
                value={profile.role || ""}
                onChange={(e) =>
                  setProfile({ ...profile, role: e.target.value })
                }
              >
                <option value="">Select</option>
                <option value="mentee">Mentee (seeking support)</option>
                <option value="mentor">Mentor (volunteer)</option>
              </select>
            </Field>
            <Field label="Primary language">
              <select
                className={selectClass}
                value={profile.language || ""}
                onChange={(e) =>
                  setProfile({ ...profile, language: e.target.value })
                }
              >
                <option value="">Select</option>
                {LANGUAGES.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Procedure">
              <select
                className={selectClass}
                value={profile.procedure || ""}
                onChange={(e) =>
                  setProfile({ ...profile, procedure: e.target.value })
                }
              >
                <option value="">Select</option>
                {PROCEDURES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Stage">
              <select
                className={selectClass}
                value={profile.stage || ""}
                onChange={(e) =>
                  setProfile({ ...profile, stage: e.target.value })
                }
              >
                <option value="">Select</option>
                {STAGES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Time zone">
              <select
                className={selectClass}
                value={profile.timezone || "America/New_York"}
                onChange={(e) =>
                  setProfile({ ...profile, timezone: e.target.value })
                }
              >
                {TIMEZONES.map((tz) => (
                  <option key={tz} value={tz}>
                    {tz}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Hospital">
              <select
                className={selectClass}
                value={profile.hospital || ""}
                onChange={(e) =>
                  setProfile({ ...profile, hospital: e.target.value })
                }
              >
                <option value="">Select</option>
                {HOSPITALS.map((h) => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                ))}
              </select>
              <div className="mt-1 text-xs text-gray-500 dark:text-neutral-500">
                Used for filters like <b>My hospital only</b>.
              </div>
            </Field>
            <Field label="Availability">
              <div className="flex flex-wrap gap-2">
                {AVAILABILITY.map((a) => (
                  <label key={a} className={checkboxWrap}>
                    <input
                      type="checkbox"
                      checked={profile.availability?.includes(a) || false}
                      onChange={(e) => {
                        const set = new Set(profile.availability || []);
                        if (e.target.checked) set.add(a);
                        else set.delete(a);
                        setProfile({
                          ...profile,
                          availability: Array.from(set),
                        });
                      }}
                    />
                    {a}
                  </label>
                ))}
              </div>
            </Field>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-2 text-lg font-semibold">
            <Heart className="h-5 w-5" /> Interests
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {(profile.interests || []).map((i) => (
              <Tag key={i} label={i} onRemove={() => removeInterest(i)} />
            ))}
          </div>
          <div className="mt-4 flex gap-2">
            <input
              className={inputClass + " flex-1"}
              value={interestInput}
              onChange={(e) => setInterestInput(e.target.value)}
              placeholder="Type an interest (e.g., anime)"
            />
            <button
              className={secondaryBtn}
              onClick={() => addInterest(interestInput.trim().toLowerCase())}
            >
              Add
            </button>
            <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500 dark:text-neutral-500">
              <Sparkles className="h-4 w-4" /> or pick:
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {ALL_INTERESTS.map((opt) => (
              <button
                key={opt}
                className="rounded-full border px-3 py-1 text-sm hover:bg-gray-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
                onClick={() => addInterest(opt)}
              >
                {opt}
              </button>
            ))}
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            <span className="font-medium">Agree to the Code of Conduct</span>
          </div>
          <label className="mt-3 flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
            />
            I agree to be respectful, avoid medical advice, and keep messages
            private.
          </label>
        </Card>
        <div className="flex justify-end gap-3">
          <button
            className={secondaryBtn}
            onClick={() => {
              save("profile", profile);
              alert("Saved!");
            }}
          >
            Save
          </button>
          <button
            disabled={!can}
            className={`${primaryBtn} px-5 disabled:opacity-40`}
            onClick={() => {
              save("profile", profile);
              onContinue();
            }}
          >
            Find matches <ArrowRight className="ml-2 inline h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="md:col-span-2 space-y-6">
        <Card>
          <div className="font-semibold">Tips</div>
          <ul className="mt-2 list-disc pl-5 text-sm text-gray-600 dark:text-neutral-400">
            <li>Pick your exact procedure for better matches.</li>
            <li>
              Stage matters: pre‑op mentees usually match with post‑op mentors.
            </li>
            <li>
              Shared hobbies (e.g., <b>anime</b>) make first messages easier.
            </li>
          </ul>
        </Card>
        <Card>
          <div className="font-semibold">What we store</div>
          <div className="mt-2 text-sm text-gray-600 dark:text-neutral-400">
            Email, profile, interests, and chat. You can request deletion
            anytime.
          </div>
        </Card>
      </div>
    </div>
  );
}
