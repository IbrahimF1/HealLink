import React, { useState, useEffect } from 'react';
import { Search, Sparkles, MessageSquare, Filter, X } from 'lucide-react';
import { Card } from '../components/Card';
import { findMatch, getMentorChats, getAllUsers } from '../api/apiClient';

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

  // Filtering logic for mentors
  const filteredMentors = mentors.filter(m => {
    if (filters.gender && filters.gender !== "" && m.gender !== filters.gender) return false;
    if (filters.hospital && filters.hospital !== "" && m.hospital !== filters.hospital) return false;
    if (filters.language && filters.language !== "" && m.language !== filters.language) return false;
    if (filters.age_min && m.age < parseInt(filters.age_min)) return false;
    if (filters.age_max && m.age > parseInt(filters.age_max)) return false;
    return true;
  });

  const handleFindMatch = async () => {
    if (user.role === 'mentor') return;

    setLoading(true);
    setError("");
    try {
      // Clean up filters by removing empty values
      const activeFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => 
          value !== "" && value !== null && 
          (Array.isArray(value) ? value.length > 0 : true)
        )
      );

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
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Hero Card */}
      <Card className="relative overflow-hidden text-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-neutral-900 dark:via-neutral-900 dark:to-neutral-950 border-2 dark:border-neutral-700 shadow-xl">
        {/* Decorative background */}
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
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white dark:border-black border-t-transparent"></div>
                    Searching...
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2">
                    <Sparkles className="h-5 w-5" /> Find My Best Match
                  </span>
                )}
              </button>
              <button 
                onClick={() => setShowFilters(!showFilters)} 
                className="rounded-xl border-2 border-indigo-300 dark:border-indigo-700 px-5 py-3 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 inline-flex items-center gap-2 transition-all font-semibold text-indigo-700 dark:text-indigo-300"
              >
                <Filter className="h-5 w-5" />
                Refine Search
              </button>
            </div>

            {/* Active Filters Display */}
            {(filters.age_min || filters.age_max || filters.gender || filters.language || filters.hospital) && (
              <div className="mt-4 flex flex-wrap gap-2 items-center justify-center">
                <span className="text-sm text-gray-600 dark:text-neutral-400 font-medium">Active filters:</span>
                {filters.age_min && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-indigo-100 dark:bg-indigo-900/30 px-3 py-1 text-sm text-indigo-700 dark:text-indigo-300">
                    Age min: {filters.age_min}
                    <button onClick={() => setFilters({...filters, age_min: ''})} className="hover:bg-indigo-200 dark:hover:bg-indigo-800 rounded-full p-0.5">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {filters.age_max && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-indigo-100 dark:bg-indigo-900/30 px-3 py-1 text-sm text-indigo-700 dark:text-indigo-300">
                    Age max: {filters.age_max}
                    <button onClick={() => setFilters({...filters, age_max: ''})} className="hover:bg-indigo-200 dark:hover:bg-indigo-800 rounded-full p-0.5">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {filters.gender && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-indigo-100 dark:bg-indigo-900/30 px-3 py-1 text-sm text-indigo-700 dark:text-indigo-300">
                    Gender: {filters.gender}
                    <button onClick={() => setFilters({...filters, gender: ''})} className="hover:bg-indigo-200 dark:hover:bg-indigo-800 rounded-full p-0.5">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {filters.language && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-indigo-100 dark:bg-indigo-900/30 px-3 py-1 text-sm text-indigo-700 dark:text-indigo-300">
                    Language: {filters.language}
                    <button onClick={() => setFilters({...filters, language: ''})} className="hover:bg-indigo-200 dark:hover:bg-indigo-800 rounded-full p-0.5">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {filters.hospital && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-indigo-100 dark:bg-indigo-900/30 px-3 py-1 text-sm text-indigo-700 dark:text-indigo-300">
                    Hospital: {filters.hospital}
                    <button onClick={() => setFilters({...filters, hospital: ''})} className="hover:bg-indigo-200 dark:hover:bg-indigo-800 rounded-full p-0.5">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                <button 
                  onClick={() => setFilters({age_min: '', age_max: '', gender: '', procedure: '', stage: '', language: '', hospital: ''})}
                  className="text-sm text-red-600 dark:text-red-400 hover:underline font-medium"
                >
                  Clear all
                </button>
              </div>
            )}

            {/* Inline Filter Panel */}
            {showFilters && (
              <div className="mt-6 animate-in slide-in-from-top duration-300">
                <div className="rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-neutral-800 dark:to-neutral-900 border-2 border-indigo-200 dark:border-indigo-800 p-6 shadow-lg">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 dark:bg-indigo-500 shadow-lg">
                        <Filter className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-neutral-100">Filter Options</h3>
                        <p className="text-sm text-gray-600 dark:text-neutral-400">Customize your mentor search</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setShowFilters(false)}
                      className="rounded-full p-2 hover:bg-white/50 dark:hover:bg-neutral-700 transition-colors"
                      aria-label="Close filters"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Filter Grid */}
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Age Range */}
                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-gray-700 dark:text-neutral-200 flex items-center gap-2">
                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-indigo-200 dark:bg-indigo-900/50 text-xs font-bold text-indigo-700 dark:text-indigo-300 flex-shrink-0">1</span>
                        Age Range
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          placeholder="Min"
                          className="w-full min-w-0 rounded-xl border-2 border-white/50 dark:border-neutral-700 bg-white/80 dark:bg-neutral-950 px-3 py-2.5 text-sm focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900/50 transition-all"
                          value={filters.age_min}
                          onChange={e => setFilters({...filters, age_min: e.target.value})}
                        />
                        <span className="text-gray-500 dark:text-neutral-400 flex-shrink-0">-</span>
                        <input
                          type="number"
                          placeholder="Max"
                          className="w-full min-w-0 rounded-xl border-2 border-white/50 dark:border-neutral-700 bg-white/80 dark:bg-neutral-950 px-3 py-2.5 text-sm focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900/50 transition-all"
                          value={filters.age_max}
                          onChange={e => setFilters({...filters, age_max: e.target.value})}
                        />
                      </div>
                    </div>
                    
                    {/* Gender */}
                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-gray-700 dark:text-neutral-200 flex items-center gap-2">
                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-purple-200 dark:bg-purple-900/50 text-xs font-bold text-purple-700 dark:text-purple-300 flex-shrink-0">2</span>
                        Gender
                      </label>
                      <select 
                        className="w-full rounded-xl border-2 border-white/50 dark:border-neutral-700 bg-white/80 dark:bg-neutral-950 px-3 py-2.5 text-sm focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900/50 transition-all"
                        value={filters.gender}
                        onChange={e => setFilters({...filters, gender: e.target.value})}
                      >
                        <option value="">Any Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    {/* Language */}
                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-gray-700 dark:text-neutral-200 flex items-center gap-2">
                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-pink-200 dark:bg-pink-900/50 text-xs font-bold text-pink-700 dark:text-pink-300 flex-shrink-0">3</span>
                        Language
                      </label>
                      <select 
                        className="w-full rounded-xl border-2 border-white/50 dark:border-neutral-700 bg-white/80 dark:bg-neutral-950 px-3 py-2.5 text-sm focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900/50 transition-all"
                        value={filters.language}
                        onChange={e => setFilters({...filters, language: e.target.value})}
                      >
                        <option value="">Any Language</option>
                        <option value="English">English</option>
                        <option value="Spanish">Spanish</option>
                        <option value="Mandarin">Mandarin</option>
                        <option value="French">French</option>
                        <option value="German">German</option>
                      </select>
                    </div>

                    {/* Hospital */}
                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-gray-700 dark:text-neutral-200 flex items-center gap-2">
                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-cyan-200 dark:bg-cyan-900/50 text-xs font-bold text-cyan-700 dark:text-cyan-300 flex-shrink-0">4</span>
                        Hospital
                      </label>
                      <select 
                        className="w-full rounded-xl border-2 border-white/50 dark:border-neutral-700 bg-white/80 dark:bg-neutral-950 px-3 py-2.5 text-sm focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900/50 transition-all"
                        value={filters.hospital}
                        onChange={e => setFilters({...filters, hospital: e.target.value})}
                      >
                        <option value="">Any Hospital</option>
                        <option value="Hospital A">Hospital A</option>
                        <option value="Hospital B">Hospital B</option>
                        <option value="Hospital C">Hospital C</option>
                      </select>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-6 flex gap-3 justify-end">
                    <button 
                      onClick={() => {
                        setFilters({age_min: '', age_max: '', gender: '', procedure: '', stage: '', language: '', hospital: ''});
                      }}
                      className="rounded-xl border-2 border-white/50 dark:border-neutral-700 bg-white/50 dark:bg-neutral-800 px-5 py-2.5 text-sm font-semibold text-gray-700 dark:text-neutral-200 hover:bg-white dark:hover:bg-neutral-700 transition-all"
                    >
                      Reset Filters
                    </button>
                    <button 
                      onClick={() => setShowFilters(false)}
                      className="rounded-xl bg-indigo-600 hover:bg-indigo-700 px-6 py-2.5 text-sm text-white font-semibold transition-all hover:scale-[1.02] shadow-lg inline-flex items-center gap-2"
                    >
                      <Filter className="h-4 w-4" />
                      Apply Filters
                    </button>
                  </div>
                </div>
              </div>
            )}
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