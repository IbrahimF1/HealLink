import React from "react";

/**
 * Field — MVP form field wrapper for HealLink
 * Props:
 * - label: string (label text)
 * - children: form element(s)
 * - hint: optional string (extra info below field)
 */
export default function Field({ label, children, hint }) {
  return (
    <label className="block">
      {label && (
        <div className="mb-1 text-sm text-gray-600 dark:text-neutral-400">
          {label}
        </div>
      )}
      {children}
      {hint && (
        <div className="mt-1 text-xs text-gray-500 dark:text-neutral-500">
          {hint}
        </div>
      )}
    </label>
  );
}
