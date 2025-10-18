import React from "react";

/**
 * NavButton — simple navigation button for HealLink MVP
 * Props:
 * - label: string (button text)
 * - active: boolean (if true, highlights the button)
 * - onClick: function (click handler)
 */
export default function NavButton({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-xl px-3 py-1.5 text-sm ${
        active
          ? "bg-black text-white dark:bg-white dark:text-black"
          : "border dark:border-neutral-700"
      }`}
    >
      {label}
    </button>
  );
}
