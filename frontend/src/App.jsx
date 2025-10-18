import React, { useEffect, useState } from 'react';
import { LoginPage } from './pages/LoginPage';
import { ProfilePage } from './pages/ProfilePage';
import { MatchesPage } from './pages/MatchesPage';
import { ChatPage } from './pages/ChatPage';
import { Header } from './components/Header';

// Helper functions for localStorage
const save = (k, v) => localStorage.setItem(k, JSON.stringify(v));
const load = (k, d) => {
  try {
    const v = localStorage.getItem(k);
    return v ? JSON.parse(v) : d;
  } catch {
    return d;
  }
};

export default function App() {
  const [user, setUser] = useState(load('user', null));
  const [route, setRoute] = useState(load('route', 'login'));
  const [match, setMatch] = useState(load('match', null));
  const [theme, setTheme] = useState(load('theme', 'light'));

  // Effects to save state to localStorage whenever it changes
  useEffect(() => { save('user', user); }, [user]);
  useEffect(() => { save('route', route); }, [route]);
  useEffect(() => { save('match', match); }, [match]);
  useEffect(() => {
    save('theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  // --- State Transition Handlers ---
  const handleLogin = (userData) => {
    setUser(userData);
    setRoute('profile');
  };

  const handleProfileComplete = (profileData) => {
    setUser(profileData);
    setRoute('matches');
  };
  
  const handleMatchFound = (matchData) => {
      setMatch(matchData);
      setRoute('chat');
  };

  const handleLogout = () => {
    setUser(null);
    setRoute('login');
    setMatch(null);
    localStorage.clear();
  };
  
  const toggleTheme = () => setTheme(t => (t === 'light' ? 'dark' : 'light'));

  // --- Simple Router Logic ---
  const renderPage = () => {
    // If user object exists but has no ID, they MUST complete their profile.
    if (user && !user.id && route !== 'profile') {
        return <ProfilePage user={user} onProfileComplete={handleProfileComplete} />
    }
      
    switch (route) {
      case 'profile':
        return user ? <ProfilePage user={user} onProfileComplete={handleProfileComplete} /> : <LoginPage onLogin={handleLogin} />;
      case 'matches':
        return user ? <MatchesPage user={user} onMatchFound={handleMatchFound} /> : <LoginPage onLogin={handleLogin} />;
      case 'chat':
        // If a match exists, show chat. Otherwise, redirect to matches page.
        return match ? <ChatPage match={match} onExit={() => setRoute('matches')} /> : <MatchesPage user={user} onMatchFound={handleMatchFound} />;
      case 'login':
      default:
        return <LoginPage onLogin={handleLogin} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 dark:bg-neutral-950 dark:text-neutral-200">
      <Header user={user} onLogout={handleLogout} theme={theme} toggleTheme={toggleTheme} />
      <main className="mx-auto max-w-6xl px-4 py-8">
        {renderPage()}
      </main>
    </div>
  );
}