import React, { useState } from 'react';
import { Search, Sparkles } from 'lucide-react';
import { Card } from '../components/Card';
import { findMatch } from '../api/apiClient';

const primaryBtn = "rounded-xl bg-black px-4 py-2 text-white dark:bg-white dark:text-black";

export function MatchesPage({ user, onMatchFound }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFindMatch = async () => {
    // Mentors cannot find matches
    if (user.role === 'mentor') {
        setError("As a mentor, your profile is now available for mentees to find. Thank you for your support!");
        return;
    }

    setLoading(true);
    setError("");
    try {
      const matchData = await findMatch(user.id);
      onMatchFound(matchData);
    } catch (err) {
      setError("We couldn't find a suitable match right now. Please try again later or consider broadening your profile details.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl text-center">
      <Card>
        <div className="flex w-full justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-neutral-800">
            <Search className="h-6 w-6"/>
          </div>
        </div>
        <h1 className="mt-4 text-xl font-semibold">
          {user.role === 'mentee' ? "Ready to find your mentor?" : "Your Mentor Profile is Active"}
        </h1>
        <p className="mt-2 text-gray-600 dark:text-neutral-400">
          {user.role === 'mentee' 
            ? "Click the button below to use our secure, AI-powered matching system. We'll analyze your profile to find the mentor who best fits your journey and interests."
            : "Thank you for volunteering! Your profile is now visible to mentees seeking support. We will notify you when a mentee connects with you."
          }
        </p>
        {user.role === 'mentee' && (
          <div className="mt-6">
            <button onClick={handleFindMatch} disabled={loading} className={`${primaryBtn} w-full md:w-auto px-6 py-3 disabled:opacity-50`}>
              {loading ? 'Searching...' : (
                <span className="inline-flex items-center gap-2">
                  <Sparkles className="h-5 w-5" /> Find My Best Match
                </span>
              )}
            </button>
          </div>
        )}
        {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
      </Card>
    </div>
  );
}