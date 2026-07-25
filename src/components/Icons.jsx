// Terminal-style toggle icon: a CRT/monitor glyph, colored by whichever
// palette is currently active via `currentColor` — no literal sun/moon,
// since both modes are dark, just a different phosphor color.
export function TerminalIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="13" rx="1"></rect>
      <path d="M7 9.5l3 2-3 2"></path>
      <line x1="12" y1="13.5" x2="15" y2="13.5"></line>
      <line x1="8" y1="21" x2="16" y2="21"></line>
      <line x1="12" y1="17" x2="12" y2="21"></line>
    </svg>
  );
}
