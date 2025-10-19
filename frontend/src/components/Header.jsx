// frontend/src/components/Header.jsx
import React from 'react';
import { LogOut, Sun, Moon, Settings } from 'lucide-react';

// Import the SVG as a URL and render it with <img> to avoid needing svgr plugin
import LogoUrl from '../assets/logo.svg';

export const Header = ({ user, onLogout, theme, toggleTheme, navigate }) => {
  const homeRoute = user ? 'matches' : 'landing';

  return (
    <header className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur dark:bg-neutral-950/70 dark:border-neutral-800">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <button onClick={() => navigate(homeRoute)} className="flex items-center gap-2">
          {/* 
            --- STEP 2: Use the SVG as a component ---
            - We replace the <img> tag with our new <Logo /> component.
            - We add `fill-black` to set the default color.
            - We add `dark:fill-white` to change the color to white ONLY in dark mode.
            - The other classes for scaling and hover effects remain the same.
          */}
          <img
            src={LogoUrl}
            alt="HealLink Logo"
            className="h-8 w-auto scale-[2.5] transition-transform duration-200 ease-in-out hover:scale-[2.75] dark:invert"
          />
        </button>

        <div className="flex items-center gap-4">
          {user && user.id && (
            <nav className="hidden sm:flex items-center gap-4">
              <button 
                onClick={() => navigate('profile')}
                className="text-sm hover:text-blue-600 dark:hover:text-blue-400"
              >
                Profile
              </button>
              <button 
                onClick={() => navigate('matches')}
                className="text-sm hover:text-blue-600 dark:hover:text-blue-400"
              >
                Matches
              </button>
              <button 
                onClick={() => navigate('messages')}
                className="text-sm hover:text-blue-600 dark:hover:text-blue-400"
              >
                Messages
              </button>
            </nav>
          )}
          <div className="flex items-center gap-2">
            <button onClick={toggleTheme} className="rounded-xl border p-2 text-sm dark:border-neutral-700" aria-label="Toggle dark mode">
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            {user ? (
              <>
                <button onClick={() => navigate('settings')} className="rounded-xl border p-2 text-sm dark:border-neutral-700" aria-label="Settings">
                  <Settings className="h-4 w-4" />
                </button>
                <button onClick={onLogout} className="inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-sm dark:border-neutral-700">
                  <LogOut className="h-4 w-4" /> 
                  <span className="hidden sm:inline">{user.email}</span>
                </button>
              </>
            ) : (
              <span className="text-sm text-gray-500 dark:text-neutral-500">Not signed in</span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};