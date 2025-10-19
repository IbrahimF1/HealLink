import React from 'react';

export const Card = ({ children, className = "" }) => (
  <div className={"rounded-2xl shadow-sm border bg-white p-5 dark:bg-neutral-900 dark:border-neutral-800 " + className}>{children}</div>
);