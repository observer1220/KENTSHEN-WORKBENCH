import { useEffect } from "react";
import { useLocale } from "../i18n/LocaleContext";

// Official Threads oEmbed: a <blockquote data-text-post-permalink> that
// embed.js scans for and hydrates into the real post iframe. The blockquote's
// own content is just the pre-hydration/no-JS fallback (a plain link).
let scriptLoadPromise = null;
function loadThreadsScript() {
  if (scriptLoadPromise) return scriptLoadPromise;
  scriptLoadPromise = new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://www.threads.com/embed.js";
    script.async = true;
    script.onload = resolve;
    script.onerror = resolve;
    document.body.appendChild(script);
  });
  return scriptLoadPromise;
}

export default function ThreadsEmbed({ url }) {
  const { data } = useLocale();

  useEffect(() => {
    loadThreadsScript();
  }, []);

  return (
    <div className="threads-embed-frame">
      <blockquote className="text-post-media threads-embed" data-text-post-permalink={url} data-text-post-version="0">
        <a href={url} target="_blank" rel="noopener noreferrer">
          {data.ui.threadsFallback}
        </a>
      </blockquote>
    </div>
  );
}
