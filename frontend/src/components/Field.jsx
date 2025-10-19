import React from 'react';

export const Field = ({ label, children, hint }) => (
  <label className="block">
    <div className="mb-1 text-sm text-gray-600 dark:text-neutral-400">{label}</div>
    {children}
    {hint && <div className="mt-1 text-xs text-gray-500 dark:text-neutral-500">{hint}</div>}
  </label>
);