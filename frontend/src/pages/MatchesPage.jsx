import React, { useState, useEffect } from 'react';
import { Search, Sparkles, MessageSquare } from 'lucide-react';
import { Card } from '../components/Card';
import { findMatch, getMentorChats } from '../api/apiClient';

const primaryBtn = "rounded-xl bg-black px-4 py-2 text-white dark:bg-white dark:text-black";

export function MatchesPage({ user, onMatchFound, onEnterChat }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mentorChats, setMentorChats] = useState([]);

  // If the user is a mentor, fetch their connections periodically
  useEffect(() => {
    if (user.role === 'mentor') {
      const fetchChats = async () => {
        try {
          const chats = await getMentorChats(user.id);
          setMentorChats(chats);
        } catch (err) {
          console.error("Failed to fetch mentor chats", err);
        }
      };
      
      fetchChats(); // Fetch immediately
      const interval = setInterval(fetchChats, 5000); // And then refresh every 5 seconds
      
      return () => clearInterval(interval); // Cleanup on unmount
    }
  }, [user.id, user.role]);

  const handleFindMatch = async () => {
    if (user.role === 'mentor') return;

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
    <div className="mx-auto max-w-2xl space-y-6">
      <Card className="text-center">
        <div className="flex w-full justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-neutral-800">
            <Search className="h-6 w-6"/>
          </div>
        </div>
        <h1 className="mt-4 text-xl font-semibold">
          {user.role === 'mentee' ? "Ready to find your mentor?" : "Your Mentor Dashboard"}
        </h1>
        <p className="mt-2 text-gray-600 dark:text-neutral-400">
          {user.role === 'mentee' 
            ? "Click the button below to use our secure, AI-powered matching system. We'll analyze your profile to find the mentor who best fits your journey and interests."
            : "Thank you for volunteering! Your profile is now visible to mentees seeking support."
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

      {user.role === 'mentor' && (
        <Card className="text-left">
          <h2 className="font-semibold text-lg flex items-center gap-2"><MessageSquare className="h-5 w-5"/> Your Connections</h2>
          {mentorChats.length > 0 ? (
            <div className="mt-4 space-y-3">
              <p className="text-sm text-gray-500">Mentees who have matched with you are listed below. Click to chat.</p>
              {mentorChats.map(mentee => (
                <div key={mentee.id} className="flex items-center justify-between p-3 rounded-lg border dark:border-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-800/50">
                  <div>
                    <div className="font-medium">{mentee.name}</div>
                    <div className="text-xs text-gray-500">{mentee.procedure}</div>
                  </div>
                  <button onClick={() => onEnterChat(mentee)} className={primaryBtn}>Chat</button>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-3 text-sm text-gray-500">When a mentee connects with you, they will appear here. The list will refresh automatically.</p>
          )}
        </Card>
      )}
    </div>
  );
}
