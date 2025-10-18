import React from "react";

/**
 * Tag — pill-style label with optional remove button
 * Props:
 * - label: string (text to display)
 * - onRemove: function (optional, called when remove button is clicked)
 */
export default function Tag({ label, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border px-3 py-1 text-sm dark:border-neutral-700 dark:text-neutral-300">
      {label}
      {onRemove && (
        <button
          className="-mr-1 rounded-full p-1 hover:bg-gray-100 dark:hover:bg-neutral-800"
          onClick={onRemove}
          aria-label={`Remove ${label}`}
          type="button"
        >
          ×
        </button>
      )}
    </span>
  );
}
