import React, { useMemo, useState } from "react";
import {
  Filter,
  Building2,
  Search,
  CheckCircle2,
  MessageCircle,
  Sparkles,
} from "lucide-react";
import {
  ALL_INTERESTS,
  PROCEDURES,
  LANGUAGES,
  TIMEZONES,
  AVAILABILITY,
  STAGES,
  HOSPITALS,
  GENDERS,
  MOCK_MENTORS,
  pickTopMentors,
} from "../constants_mvp";
import Tag from "../components/Tag";
import Card from "../components/Card";
import Field from "../components/Field";

/**
 * MatchesPage — MVP version
 * Props:
 * - profile: user profile object
 * - onChoose: function(mentor) called when user picks a mentor to chat
 */
export default function MatchesPage({ profile, onChoose }) {
  const [gender, setGender] = useState("Any"); // Any | Male | Female | Non-binary
  const [hospitals, setHospitals] = useState([]); // string[]
  const [myHospitalOnly, setMyHospitalOnly] = useState(false);

  // Filter mentors based on selected filters
  const filtered = useMemo(() => {
    let arr = [...MOCK_MENTORS];
    if (gender !== "Any")
      arr = arr.filter(
        (m) => (m.gender || "").toLowerCase() === gender.toLowerCase(),
      );
    if (hospitals.length)
      arr = arr.filter((m) => hospitals.includes(m.hospital));
    if (myHospitalOnly && profile.hospital)
      arr = arr.filter((m) => m.hospital === profile.hospital);
    return arr;
  }, [gender, hospitals, myHospitalOnly, profile.hospital]);

  // Pick top mentors using matching logic
  const topMentors = useMemo(
    () => pickTopMentors(profile, filtered, 9),
    [profile, filtered],
  );
  const noResults = topMentors.length === 0;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xl font-semibold">
          <Search className="h-5 w-5" /> Suggested mentors
        </div>
        <div className="text-sm text-gray-600 dark:text-neutral-400">
          Procedure: <b>{profile.procedure || "—"}</b> · Stage:{" "}
          <b>{profile.stage || "—"}</b>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex items-center gap-2 text-sm font-medium">
          <Filter className="h-4 w-4" /> Filters
        </div>
        <div className="mt-3 grid gap-4 md:grid-cols-3">
          <Field label="Mentor gender">
            <div className="flex flex-wrap gap-2">
              {["Any", ...GENDERS].map((g) => (
                <button
                  key={g}
                  onClick={() => setGender(g)}
                  className={`rounded-xl px-3 py-1.5 text-sm border dark:border-neutral-700 ${
                    gender === g
                      ? "bg-black text-white dark:bg-white dark:text-black"
                      : ""
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </Field>
          <Field label="Hospitals">
            <div className="flex flex-wrap gap-2">
              {HOSPITALS.map((h) => (
                <label
                  key={h}
                  className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm dark:border-neutral-700"
                >
                  <input
                    type="checkbox"
                    checked={hospitals.includes(h)}
                    onChange={(e) => {
                      const set = new Set(hospitals);
                      if (e.target.checked) set.add(h);
                      else set.delete(h);
                      setHospitals(Array.from(set));
                    }}
                  />
                  {h}
                </label>
              ))}
            </div>
          </Field>
          <Field label=" ">
            <label className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm dark:border-neutral-700">
              <input
                type="checkbox"
                checked={myHospitalOnly}
                onChange={(e) => setMyHospitalOnly(e.target.checked)}
              />
              <span className="inline-flex items-center gap-1">
                <Building2 className="h-4 w-4" /> My hospital only
                {profile.hospital ? `: ${profile.hospital}` : ""}
              </span>
            </label>
            <div className="mt-1 text-xs text-gray-500 dark:text-neutral-500">
              Change your hospital in Profile.
            </div>
          </Field>
        </div>
        {(gender !== "Any" || hospitals.length > 0 || myHospitalOnly) && (
          <div className="mt-3 flex flex-wrap gap-2">
            {gender !== "Any" && (
              <Tag
                label={`Gender: ${gender}`}
                onRemove={() => setGender("Any")}
              />
            )}
            {myHospitalOnly && (
              <Tag
                label={`My hospital: ${profile.hospital || "—"}`}
                onRemove={() => setMyHospitalOnly(false)}
              />
            )}
            {hospitals.map((h) => (
              <Tag
                key={h}
                label={h}
                onRemove={() => setHospitals(hospitals.filter((x) => x !== h))}
              />
            ))}
          </div>
        )}
        {(gender !== "Any" || hospitals.length > 0 || myHospitalOnly) && (
          <div className="mt-3">
            <button
              onClick={() => {
                setGender("Any");
                setHospitals([]);
                setMyHospitalOnly(false);
              }}
              className="rounded-xl border px-3 py-2 text-sm dark:border-neutral-700"
            >
              Clear all
            </button>
          </div>
        )}
      </Card>

      {noResults && (
        <Card>
          <div className="text-gray-700 dark:text-neutral-300">
            No mentors match your filters. Try switching gender to <b>Any</b>,
            unchecking <b>My hospital only</b>, or picking different hospitals.
          </div>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        {topMentors.map((m) => (
          <Card key={m.id}>
            <div className="flex items-start justify-between">
              <div>
                <div className="text-lg font-semibold">{m.name}</div>
                <div className="text-xs text-gray-500 dark:text-neutral-500">
                  {m.gender} · {m.language} · {m.timezone}
                </div>
                <div className="mt-1 inline-flex items-center gap-1 text-xs text-gray-600 dark:text-neutral-400">
                  <Building2 className="h-3.5 w-3.5" /> {m.hospital}
                </div>
              </div>
              <div className="rounded-full bg-emerald-50 px-2 py-1 text-xs text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4" /> {m.rating.toFixed(1)}
              </div>
            </div>
            <div className="mt-2 text-sm text-gray-700 dark:text-neutral-300">
              {m.intro}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {m.interests.map((i) => (
                <Tag key={i} label={i} />
              ))}
            </div>
            <button
              onClick={() => onChoose(m)}
              className="mt-4 w-full rounded-xl bg-black px-4 py-2 text-white dark:bg-white dark:text-black"
            >
              Start chatting
            </button>
          </Card>
        ))}
      </div>
    </div>
  );
}
