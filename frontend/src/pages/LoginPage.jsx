import React, { useState } from "react";
import { LogIn, Shield } from "lucide-react";
import Card from "../components/Card";
import Field from "../components/Field";

// Tailwind utility classes for MVP
const inputClass =
  "w-full rounded-xl border px-3 py-2 dark:bg-neutral-950 dark:border-neutral-700 dark:text-neutral-200 placeholder:dark:text-neutral-500";
const primaryBtn =
  "rounded-xl bg-black px-4 py-2 text-white dark:bg-white dark:text-black";
const secondaryBtn = "rounded-xl border px-4 py-2 dark:border-neutral-700";

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const can = email.includes("@");

  return (
    <div className="mx-auto max-w-md space-y-6">
      <Card>
        <div className="flex items-center gap-2 text-xl font-semibold">
          <LogIn className="h-5 w-5" /> Log in / Sign up
        </div>
        <div className="mt-4 space-y-4">
          <Field label="Email">
            <input
              className={inputClass}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
            />
          </Field>
          <Field label="Password">
            <input
              type="password"
              className={inputClass}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </Field>
          <button
            disabled={!can}
            onClick={() => onLogin({ email })}
            className={`w-full ${primaryBtn} disabled:opacity-40`}
          >
            Continue
          </button>
          <p className="text-xs text-gray-500 dark:text-neutral-500">
            We’ll create your account on first login.
          </p>
        </div>
      </Card>
      <Card>
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          <span className="font-medium">Code of Conduct</span>
        </div>
        <p className="mt-2 text-sm text-gray-600 dark:text-neutral-400">
          Be kind. No medical advice. Share personal experience only. If in
          crisis, call local emergency services.
        </p>
      </Card>
    </div>
  );
}
