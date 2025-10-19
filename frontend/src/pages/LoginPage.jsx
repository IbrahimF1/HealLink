import React, { useState } from "react";
import { LogIn, Shield } from "lucide-react";
import { Card } from "../components/Card";
import { Field } from "../components/Field";
import icon from '../../public/icon.svg';
import { motion } from 'framer-motion';

const inputClass = "w-full rounded-xl border px-3 py-2 dark:bg-neutral-950 dark:border-neutral-700 dark:text-neutral-200 placeholder:dark:text-neutral-500";
const primaryBtn = "rounded-xl bg-black px-4 py-2 text-white dark:bg-white dark:text-black";

// Simplified Aurora Background Component
const AuroraBackground = ({ children }) => (
  <div className="relative w-full h-full">
    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))]"></div>
    {children}
  </div>
);

export function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const canSubmit = email.includes("@") && !loading;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setLoading(true);
    setError("");
    try {
      await onLogin(email);
    } catch (err) {
      setError("Could not connect to the server. Please try again.");
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <AuroraBackground>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-md space-y-6 pt-16"
      >
        <Card className="relative overflow-hidden bg-gradient-to-br from-indigo-50/50 via-white/80 to-purple-50/50 dark:from-neutral-900/80 dark:via-neutral-900/80 dark:to-neutral-950/80 backdrop-blur-lg border-2 dark:border-neutral-700 shadow-xl">
          <div className="relative">
            <div className="flex justify-center mb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: 360 }}
                transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
              >
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/70 ring-1 ring-indigo-200 backdrop-blur-sm dark:bg-neutral-800/60 dark:ring-neutral-700 shadow-lg">
                  <img src={icon} alt="HealLink Icon" className="h-12 w-12 dark:invert dark:brightness-0" />
                </div>
              </motion.div>
            </div>
            
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-neutral-100 mb-2">Welcome to HealLink</h1>
              <p className="text-gray-600 dark:text-neutral-400">Connect with mentors who understand your journey</p>
            </div>

            <div className="space-y-4">
              <Field label="Email Address">
                <input className={inputClass + " transition-all focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"} value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" type="email"/>
              </Field>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} disabled={!canSubmit} onClick={handleSubmit} className={`w-full ${primaryBtn} py-3 text-lg font-semibold disabled:opacity-40 transition-transform shadow-lg hover:shadow-xl`}>
                {loading ? (
                  <span className="inline-flex items-center gap-2"><div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>Checking...</span>
                ) : (
                  <span className="inline-flex items-center gap-2"><LogIn className="h-5 w-5" /> Continue</span>
                )}
              </motion.button>
              <p className="text-xs text-gray-500 dark:text-neutral-500 text-center leading-relaxed">
                If your email is in our system, you'll be logged in. Otherwise, you'll be asked to create a profile.
              </p>
              {error && (
                <div className="rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3">
                  <p className="text-sm text-red-600 dark:text-red-400 text-center">{error}</p>
                </div>
              )}
            </div>
          </div>
        </Card>

        <Card className="bg-white/70 dark:bg-neutral-900/70 backdrop-blur-sm border border-gray-200 dark:border-neutral-800 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/40"><Shield className="h-5 w-5 text-indigo-600 dark:text-indigo-400" /></div>
            <span className="font-semibold text-lg">Code of Conduct</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-neutral-400 leading-relaxed">
            Be kind. No medical advice. Share personal experience only. If in crisis, call local emergency services.
          </p>
        </Card>
      </motion.div>
    </AuroraBackground>
  );
}