import React from 'react';
import { LogOut, Sun, Moon } from 'lucide-react';

export const Header = ({ user, onLogout, theme, toggleTheme }) => {
  return (
    <header className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur dark:bg-neutral-950/70 dark:border-neutral-800">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-black text-white font-bold dark:bg-white dark:text-black">HL</div>
          <div className="text-lg font-semibold">HealLink</div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={toggleTheme} className="rounded-xl border p-2 text-sm dark:border-neutral-700" aria-label="Toggle dark mode">
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          {user ? (
            <button onClick={onLogout} className="inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-sm dark:border-neutral-700"><LogOut className="h-4 w-4" /> {user.email}</button>
          ) : (
            <span className="text-sm text-gray-500 dark:text-neutral-500">Not signed in</span>
          )}
        </div>
      </div>
    </header>
  );
};