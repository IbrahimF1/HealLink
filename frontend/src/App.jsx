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
  const [chatState, setChatState] = useState(load('chatState', null));
  const [theme, setTheme] = useState(load('theme', 'light'));

  // Effects to save state to localStorage whenever it changes
  useEffect(() => { save('user', user); }, [user]);
  useEffect(() => { save('route', route); }, [route]);
  useEffect(() => { save('chatState', chatState); }, [chatState]);
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
    // For a mentee, the "other user" is the mentor.
    setChatState({
      otherUser: matchData.mentor,
      introduction: matchData.introduction
    });
    setRoute('chat');
  };

  const handleEnterChat = (mentee) => {
    // For a mentor, the "other user" is the mentee.
    setChatState({
      otherUser: mentee,
      introduction: `This is the start of your conversation with ${mentee.name}.`
    });
    setRoute('chat');
  };

  const handleLogout = () => {
    setUser(null);
    setRoute('login');
    setChatState(null);
    localStorage.clear();
  };
  
  const toggleTheme = () => setTheme(t => (t === 'light' ? 'dark' : 'light'));

  // --- Simple Router Logic ---
  const renderPage = () => {
    if (user && !user.id && route !== 'profile') {
        return <ProfilePage user={user} onProfileComplete={handleProfileComplete} />
    }
      
    switch (route) {
      case 'profile':
        return user ? <ProfilePage user={user} onProfileComplete={handleProfileComplete} /> : <LoginPage onLogin={handleLogin} />;
      case 'matches':
        return user ? <MatchesPage user={user} onMatchFound={handleMatchFound} onEnterChat={handleEnterChat} /> : <LoginPage onLogin={handleLogin} />;
      case 'chat':
        return user && chatState ? (
          <ChatPage 
            currentUser={user} 
            otherUser={chatState.otherUser} 
            introduction={chatState.introduction} 
            onExit={() => { setChatState(null); setRoute('matches'); }} 
          />
        ) : <MatchesPage user={user} onMatchFound={handleMatchFound} onEnterChat={handleEnterChat} />;
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
