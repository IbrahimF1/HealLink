// frontend/src/App.jsx
import React, { useEffect, useState } from 'react';
import { LoginPage } from './pages/LoginPage';
import { ProfilePage } from './pages/ProfilePage';
import { MatchesPage } from './pages/MatchesPage';
import { ChatPage } from './pages/ChatPage';
import { SettingsPage } from './pages/SettingsPage';
import { LandingPage } from './pages/LandingPage';
import { Header } from './components/Header';
import { getUserByEmail, createUser } from './api/apiClient';
import { MessagesPage } from './pages/MessagesPage';

const save = (k, v) => {
  try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* ignore */ }
};
const load = (k, d) => {
  try {
    const raw = localStorage.getItem(k);
    return raw ? JSON.parse(raw) : d;
  } catch (err) {
    console.warn('load() failed for key', k, err);
    return d;
  }
};

export default function App() {
  const [user, setUser] = useState(load('user', null));
  const [route, setRoute] = useState(() => user ? 'matches' : 'landing'); // Sensible default
  const [chatState, setChatState] = useState(load('chatState', null));
  const [theme, setTheme] = useState(load('theme', 'light'));

  const navigate = (r) => {
    setRoute(r);
    window.scrollTo(0, 0);
  };

  // --- CORRECTED LOGIN/SIGNUP LOGIC ---
  const handleLogin = async (email) => {
    try {
      console.log('Attempting login with:', email);
      const existingUser = await getUserByEmail(email);
      
      if (existingUser) {
        // User exists - log them in and go to matches
        console.log('Existing user found, logging in');
        setUser(existingUser);
        save('user', existingUser);  // Save to localStorage
        navigate('matches');
      } else {
        // New user - store email and go to profile creation
        console.log('New user, redirecting to profile creation');
        const partialUser = { email };
        setUser(partialUser);
        save('user', partialUser);  // Save partial user to localStorage
        navigate('profile');
      }
    } catch (err) {
      console.error('Login error:', err);
      // Clear any partial state
      setUser(null);
      save('user', null);
      // Rethrow so LoginPage can handle the error
      throw err;
    }
  };

  // This function is called ONLY after the ProfilePage has collected all the data.
  const handleProfileComplete = async (profileData) => {
    try {
      const newUser = await createUser(profileData);
      setUser(newUser);
      navigate('matches');
    } catch (error) {
      console.error("Signup failed:", error);
      // Optionally, show an error message on the ProfilePage
    }
  };
  // ------------------------------------

  const handleProfileUpdate = (updatedUser) => {
    setUser(updatedUser);
  };

  const handleLogout = () => {
    setUser(null);
    setChatState(null);
    // Clear localStorage to ensure a clean state
    localStorage.removeItem('user');
    localStorage.removeItem('route');
    localStorage.removeItem('chatState');
    navigate('landing');
  };

  const handleMatchFound = (matchData) => {
    setChatState({
      otherUser: matchData.mentor,
      introduction: matchData.introduction
    });
    navigate('chat');
  };

  const handleEnterChat = (mentee) => {
    setChatState({
      otherUser: mentee,
      introduction: `This is the start of your conversation with ${mentee.name}.`
    });
    navigate('chat');
  };

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
  };

  // Save state to localStorage whenever it changes
  useEffect(() => { save('user', user); }, [user]);
  useEffect(() => { save('route', route); }, [route]);
  useEffect(() => { save('chatState', chatState); }, [chatState]);
  useEffect(() => {
    save('theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const renderPage = () => {
    // If user is logged in but not onboarded, always show profile creation
    if (user && !user.id) {
      if (route !== 'profile' && route !== 'login') {
        // Force redirect to profile creation
        setRoute('profile');
        return null;
      }
      return <ProfilePage user={user} onProfileComplete={handleProfileComplete} />;
    }
    
    switch (route) {
      case 'landing':
        return <LandingPage navigate={navigate} />;
      case 'login':
        return <LoginPage onLogin={handleLogin} />;
      case 'profile':
        return user ? <ProfilePage user={user} onProfileComplete={handleProfileComplete} /> : <LoginPage onLogin={handleLogin} />;
      case 'settings':
        return user && user.id ? <SettingsPage user={user} onProfileUpdate={handleProfileUpdate} onLogout={handleLogout} /> : <LoginPage onLogin={handleLogin} />;
      case 'matches':
        return user && user.id ? <MatchesPage user={user} onMatchFound={handleMatchFound} onEnterChat={handleEnterChat} navigate={navigate} /> : <LoginPage onLogin={handleLogin} />;
      case 'messages':
        return user && user.id ? <MessagesPage user={user} onEnterChat={handleEnterChat} /> : <LoginPage onLogin={handleLogin} />;
      case 'chat':
        return user && user.id && chatState ? (
          <ChatPage 
            currentUser={user} 
            otherUser={chatState.otherUser} 
            introduction={chatState.introduction} 
            onExit={() => { setChatState(null); navigate('matches'); }} 
          />
        ) : <MatchesPage user={user} onMatchFound={handleMatchFound} onEnterChat={handleEnterChat} navigate={navigate} />;
      default:
        // Default to the landing page if no user is logged in
        return user && user.id ? <MatchesPage user={user} onMatchFound={handleMatchFound} onEnterChat={handleEnterChat} navigate={navigate} /> : <LandingPage navigate={navigate} />;
    }
  };

  return (
    <div className="min-h-screen font-sans text-gray-900 dark:text-neutral-200">
      <Header user={user} onLogout={handleLogout} theme={theme} toggleTheme={toggleTheme} navigate={navigate} />
      <main className="mx-auto max-w-6xl px-4 py-8">
        {renderPage()}
      </main>
    </div>
  );
}