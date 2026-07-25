import { useEffect, useRef, useState } from "react";
import { useLocale } from "../i18n/LocaleContext";

const SEEN_KEY = "kentshen_intro_seen";
const CHAR_DELAY = 18; // ms per character typed
const LINE_PAUSE = 220; // ms pause between lines
const HOLD_AFTER = 500; // ms to hold the finished screen before fading out

export default function BootSequence({ children }) {
  const { data } = useLocale();
  const lines = data.ui.boot?.lines || [];
  const skipLabel = data.ui.boot?.skip || "SKIP";

  const [active, setActive] = useState(() => {
    try {
      if (window.sessionStorage.getItem(SEEN_KEY)) return false;
    } catch (e) {
      /* ignore */
    }
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return false;
    }
    return true;
  });
  const [fading, setFading] = useState(false);
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const timeoutRef = useRef(null);

  function finish() {
    if (fading) return;
    setFading(true);
    try {
      window.sessionStorage.setItem(SEEN_KEY, "1");
    } catch (e) {
      /* ignore */
    }
    window.setTimeout(() => setActive(false), 320);
  }

  useEffect(() => {
    if (!active || fading || lines.length === 0) return undefined;

    if (lineIndex >= lines.length) {
      timeoutRef.current = window.setTimeout(finish, HOLD_AFTER);
      return () => window.clearTimeout(timeoutRef.current);
    }

    const currentLine = lines[lineIndex];
    if (charIndex < currentLine.length) {
      timeoutRef.current = window.setTimeout(() => setCharIndex((c) => c + 1), CHAR_DELAY);
    } else {
      timeoutRef.current = window.setTimeout(() => {
        setLineIndex((l) => l + 1);
        setCharIndex(0);
      }, LINE_PAUSE);
    }
    return () => window.clearTimeout(timeoutRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, fading, lineIndex, charIndex, lines.length]);

  useEffect(() => {
    if (!active) return undefined;
    function handleKey(e) {
      if (e.key === "Enter" || e.key === "Escape") finish();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  if (!active) return children;

  return (
    <>
      <div
        className={"boot-overlay" + (fading ? " is-fading" : "")}
        onClick={finish}
        role="button"
        tabIndex={0}
        aria-label={skipLabel}
      >
        <div className="boot-terminal">
          {lines.slice(0, lineIndex).map((line, i) => (
            <div className="boot-line is-done" key={i}>
              &gt; {line}
            </div>
          ))}
          {lineIndex < lines.length && (
            <div className="boot-line">
              &gt; {lines[lineIndex].slice(0, charIndex)}
              <span className="cursor-blink">_</span>
            </div>
          )}
        </div>
        <div className="boot-skip">{skipLabel}</div>
      </div>
      {children}
    </>
  );
}
