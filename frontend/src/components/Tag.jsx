import React from 'react';

export const Tag = ({ label, onRemove }) => (
  <span className="inline-flex items-center gap-1 rounded-full border px-3 py-1 text-sm dark:border-neutral-700 dark:text-neutral-300">
    {label}
    {onRemove && (
      <button className="-mr-1 rounded-full p-1 hover:bg-gray-100 dark:hover:bg-neutral-800" onClick={onRemove} aria-label={`Remove ${label}`}>
        ×
      </button>
    )}
  </span>
);