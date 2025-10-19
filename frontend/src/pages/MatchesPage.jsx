import React, { useState, useEffect } from 'react';
import { Search, Sparkles, MessageSquare, Filter, X } from 'lucide-react';
import { Card } from '../components/Card';
import { findMatch, getMentorChats, getAllUsers } from '../api/apiClient';
import { AnimatePresence, motion } from 'framer-motion';
import { MatchLoadingAnimation } from '../components/MatchLoadingAnimation';

const primaryBtn = "rounded-xl bg-black px-4 py-2 text-white dark:bg-white dark:text-black hover:scale-[1.02] transition-transform shadow-lg";

export function MatchesPage({ user, onMatchFound, onEnterChat }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mentorChats, setMentorChats] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    age_min: "",
    age_max: "",
    gender: "",
    procedure: "",
    stage: "",
    language: "",
    hospital: ""
  });
  const [mentors, setMentors] = useState([]);
  const [mentorsLoading, setMentorsLoading] = useState(true);

  useEffect(() => {
    if (user.role === 'mentee') {
      async function fetchMentors() {
        setMentorsLoading(true);
        try {
          const allUsers = await getAllUsers();
          setMentors(allUsers.filter(u => u.role === 'mentor'));
        } catch (err) {
          setError("Failed to fetch mentors.");
        } finally {
          setMentorsLoading(false);
        }
      }
      fetchMentors();
    }
  }, [user.role]);

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
      
      fetchChats();
      const interval = setInterval(fetchChats, 5000);
      
      return () => clearInterval(interval);
    }
  }, [user.id, user.role]);

  const filteredMentors = mentors.filter(m => {
    if (filters.gender && filters.gender !== "" && m.gender !== filters.gender) return false;
    if (filters.hospital && filters.hospital !== "" && m.hospital !== filters.hospital) return false;
    if (filters.language && filters.language !== "" && m.language !== filters.language) return false;
    if (filters.age_min && m.age < parseInt(filters.age_min, 10)) return false;
    if (filters.age_max && m.age > parseInt(filters.age_max, 10)) return false;
    return true;
  });

  const handleFindMatch = async () => {
    if (user.role === 'mentor') return;

    setLoading(true);
    setError("");
    try {
      const activeFilters = Object.fromEntries(
        Object.entries(filters).filter(([, value]) => value !== "" && value !== null)
      );

      // Simulate a longer delay for the animation to be visible
      await new Promise(resolve => setTimeout(resolve, 2500));

      const matchData = await findMatch(user.id, activeFilters);
      onMatchFound(matchData);
    } catch (err) {
      setError("We couldn't find a suitable match right now. Please try again later or consider broadening your profile details.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {loading && <MatchLoadingAnimation />}
      </AnimatePresence>
      
      <motion.div 
        className="mx-auto max-w-6xl space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Hero Card */}
        <Card className="relative overflow-hidden text-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-neutral-900 dark:via-neutral-900 dark:to-neutral-950 border-2 dark:border-neutral-700 shadow-xl">
          {/* ... Hero content ... */}
          <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-indigo-200 blur-3xl opacity-20 dark:bg-indigo-700/20"></div>
          <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-purple-200 blur-3xl opacity-20 dark:bg-purple-700/20"></div>
          
          <div className="relative">
            <div className="flex w-full justify-center mb-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/70 ring-1 ring-indigo-200 backdrop-blur-sm dark:bg-neutral-800/60 dark:ring-neutral-700 shadow-lg">
                {user.role === 'mentee' ? <Search className="h-8 w-8 text-indigo-600 dark:text-indigo-400"/> : <MessageSquare className="h-8 w-8 text-indigo-600 dark:text-indigo-400"/>}
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-neutral-100 mb-3">
              {user.role === 'mentee' ? "Find Your Perfect Mentor" : "Your Mentor Dashboard"}
            </h1>
            <p className="text-lg text-gray-600 dark:text-neutral-400 max-w-2xl mx-auto">
              {user.role === 'mentee' 
                ? "Our AI-powered matching system analyzes your profile to find mentors who best fit your journey and interests."
                : "Thank you for volunteering! Your profile is now visible to mentees seeking support."
              }
            </p>
          {user.role === 'mentee' && (
            <>
              <div className="mt-6 flex justify-center gap-4 flex-wrap">
                <button onClick={handleFindMatch} disabled={loading} className={`${primaryBtn} px-6 py-3 disabled:opacity-50 font-semibold text-lg`}>
                  <span className="inline-flex items-center gap-2">
                    <Sparkles className="h-5 w-5" /> Find My Best Match
                  </span>
                </button>
                <button 
                  onClick={() => setShowFilters(!showFilters)} 
                  className="rounded-xl border-2 border-indigo-300 dark:border-indigo-700 px-5 py-3 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 inline-flex items-center gap-2 transition-all font-semibold text-indigo-700 dark:text-indigo-300"
                >
                  <Filter className="h-5 w-5" />
                  Refine Search
                </button>
              </div>
            </>
          )}
          {error && (
            <div className="mt-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}
          </div>
        </Card>

        {/* Mentor grid for mentees */}
        {user.role === 'mentee' && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-neutral-100 mb-2">Available Mentors</h2>
              <p className="text-gray-600 dark:text-neutral-400">Browse and connect with mentors who match your needs</p>
            </div>
            {mentorsLoading ? (
              <Card className="text-center py-12">
                <div className="inline-flex h-12 w-12 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600 dark:border-neutral-700 dark:border-t-indigo-400"></div>
                <p className="mt-4 text-gray-500">Loading mentors...</p>
              </Card>
            ) : filteredMentors.length === 0 ? (
              <Card className="text-center py-12">
                <Search className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500 text-lg">No mentors found matching your filters.</p>
                <p className="text-sm text-gray-400 mt-2">Try adjusting your filter criteria</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMentors.map(mentor => (
                  <Card key={mentor.id} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white dark:bg-neutral-900 border-2 dark:border-neutral-800">
                    <div className="flex flex-col h-full">
                      {/* --- FIX STARTS HERE: Restored mentor card content --- */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center text-white font-bold text-lg">
                            {(mentor.name || mentor.email).charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-semibold text-lg text-gray-900 dark:text-neutral-100">{mentor.name || mentor.email}</div>
                            <div className="text-xs text-gray-500 dark:text-neutral-400">{mentor.procedure}</div>
                          </div>
                        </div>
                        
                        <div className="space-y-2 mb-3">
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-neutral-400">
                            <span className="font-medium">Hospital:</span> {mentor.hospital}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-neutral-400">
                            <span className="font-medium">Language:</span> {mentor.language}
                          </div>
                        </div>
                        
                        <p className="text-sm text-gray-700 dark:text-neutral-300 mb-3 line-clamp-3">{mentor.intro}</p>
                        
                        {mentor.interests && mentor.interests.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-3">
                            {mentor.interests.slice(0, 3).map(i => (
                              <span key={i} className="rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-3 py-1 text-xs font-medium">{i}</span>
                            ))}
                            {mentor.interests.length > 3 && (
                              <span className="rounded-full bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-neutral-400 px-3 py-1 text-xs">+{mentor.interests.length - 3}</span>
                            )}
                          </div>
                        )}
                      </div>
                      {/* --- FIX ENDS HERE --- */}
                      
                      <button 
                        onClick={() => onEnterChat(mentor)} 
                        className="mt-4 w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 px-4 py-3 text-white font-semibold dark:bg-indigo-500 dark:hover:bg-indigo-600 transition-colors inline-flex items-center justify-center gap-2 shadow-lg group-hover:shadow-xl"
                      >
                        <MessageSquare className="h-4 w-4" />
                        Start Chatting
                      </button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Mentor dashboard */}
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
      </motion.div>
    </>
  );
}