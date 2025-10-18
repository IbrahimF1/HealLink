import React from "react";

/**
 * Card — simple container for HealLink MVP
 * Props:
 * - children: ReactNode (content inside the card)
 * - className: string (optional extra classes)
 */
export default function Card({ children, className = "" }) {
  return (
    <div
      className={
        "rounded-2xl shadow-sm border bg-white p-5 dark:bg-neutral-900 dark:border-neutral-800 " +
        className
      }
    >
      {children}
    </div>
  );
}
