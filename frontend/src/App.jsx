import React, { useEffect, useState } from "react";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import MatchesPage from "./pages/MatchesPage";
import ChatPage from "./pages/ChatPage";
import NavButton from "./components/NavButton";
import { save, load } from "./constants_mvp";

// Main App shell for HealLink MVP
export default function App() {
  const [route, setRoute] = useState("login");
  const [user, setUser] = useState(load("user", null));
  const [profile, setProfile] = useState(
    load("profile", {
      role: "mentee",
      language: "English",
      timezone: "America/New_York",
      hospital: "Mount Sinai Hospital",
      interests: ["anime"],
      availability: ["Evenings"],
    }),
  );
  const [activeMentor, setActiveMentor] = useState(null);
  const [theme, setTheme] = useState(load("theme", "light"));

  useEffect(() => {
    if (user) setRoute("profile");
  }, [user]);
  useEffect(() => save("user", user), [user]);
  useEffect(() => save("profile", profile), [profile]);
  useEffect(() => {
    save("theme", theme);
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
  }, [theme]);

  const logout = () => {
    setUser(null);
    setRoute("login");
    setActiveMentor(null);
  };
  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-950 dark:text-neutral-200">
      <header className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur dark:bg-neutral-950/70 dark:border-neutral-800">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-black text-white font-bold dark:bg-white dark:text-black">
              HL
            </div>
            <div className="text-lg font-semibold">HealLink</div>
          </div>
          <nav className="hidden gap-2 md:flex">
            <NavButton
              label="Login"
              active={route === "login"}
              onClick={() => setRoute("login")}
            />
            <NavButton
              label="Profile"
              active={route === "profile"}
              onClick={() => setRoute("profile")}
            />
            <NavButton
              label="Matches"
              active={route === "matches"}
              onClick={() => setRoute("matches")}
            />
            <NavButton
              label="Chat"
              active={route === "chat"}
              onClick={() => setRoute("chat")}
            />
          </nav>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="rounded-xl border px-3 py-1.5 text-sm dark:border-neutral-700"
              aria-label="Toggle dark mode"
            >
              {theme === "dark" ? (
                <span className="inline-flex items-center gap-1">Light</span>
              ) : (
                <span className="inline-flex items-center gap-1">Dark</span>
              )}
            </button>
            {user ? (
              <button
                onClick={logout}
                className="inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-sm dark:border-neutral-700"
              >
                {user.email}
              </button>
            ) : (
              <span className="text-sm text-gray-500 dark:text-neutral-500">
                Not signed in
              </span>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        {route === "login" && (
          <LoginPage
            onLogin={(u) => {
              setUser(u);
              setRoute("profile");
            }}
          />
        )}
        {route === "profile" && (
          <ProfilePage
            profile={profile}
            setProfile={setProfile}
            onContinue={() => setRoute("matches")}
          />
        )}
        {route === "matches" && (
          <MatchesPage
            profile={profile}
            onChoose={(m) => {
              setActiveMentor(m);
              setRoute("chat");
            }}
          />
        )}
        {route === "chat" &&
          (activeMentor ? (
            <ChatPage
              self={profile}
              mentor={activeMentor}
              context={{ procedure: profile.procedure }}
              onExit={() => setRoute("matches")}
            />
          ) : (
            <div className="text-center text-gray-500 dark:text-neutral-500">
              No active chat. Go to Matches to start a conversation.
            </div>
          ))}
      </main>
      <footer className="mt-8 border-t bg-white/70 dark:bg-neutral-950/70 dark:border-neutral-800">
        <div className="mx-auto max-w-6xl px-4 py-6 text-xs text-gray-500 dark:text-neutral-500">
          © {new Date().getFullYear()} HealLink · For demo purposes only · If
          you need urgent help, contact local emergency services.
        </div>
      </footer>
    </div>
  );
}
