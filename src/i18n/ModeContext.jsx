import { createContext, useContext, useEffect, useMemo, useState } from "react";

const MODE_KEY = "kentshen_mode";

// The site has one warm-paper, Japanese-retro look. This toggle switches
// between two accent palettes — "green" (indigo-forward) and "amber"
// (vermillion-forward) — rather than light/dark; both are the same paper tone.
function detectDefaultMode() {
  try {
    const saved = window.localStorage.getItem(MODE_KEY);
    if (saved === "green" || saved === "amber") return saved;
  } catch (e) {
    /* ignore */
  }
  return "green";
}

const ModeContext = createContext(null);

export function ModeProvider({ children }) {
  const [mode, setMode] = useState(detectDefaultMode);

  useEffect(() => {
    document.documentElement.setAttribute("data-mode", mode);
    try {
      window.localStorage.setItem(MODE_KEY, mode);
    } catch (e) {
      /* ignore */
    }
  }, [mode]);

  const toggleMode = () => setMode((prev) => (prev === "amber" ? "green" : "amber"));

  const value = useMemo(() => ({ mode, toggleMode }), [mode]);

  return <ModeContext.Provider value={value}>{children}</ModeContext.Provider>;
}

export function useMode() {
  const ctx = useContext(ModeContext);
  if (!ctx) throw new Error("useMode must be used within ModeProvider");
  return ctx;
}
