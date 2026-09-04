// Palette-toggle icon: a hanko (seal stamp) ring, colored by whichever
// palette is currently active via `currentColor`. Both palettes are the
// same warm paper theme, just swapped indigo/vermillion emphasis, so the
// icon reads as "stamp with a different ink" rather than day/night.
export function TerminalIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="8.5"></circle>
      <circle cx="12" cy="12" r="4.2"></circle>
      <path d="M12 3.5v3.4M12 17.1v3.4M3.5 12h3.4M17.1 12h3.4" strokeWidth="1.2"></path>
    </svg>
  );
}
