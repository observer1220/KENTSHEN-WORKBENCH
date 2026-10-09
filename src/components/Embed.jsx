import ThreadsEmbed from "./ThreadsEmbed";

function youtubeId(u) {
  const h = u.hostname.replace(/^www\./, "");
  if (h === "youtu.be") return u.pathname.slice(1) || null;
  if (h === "youtube.com" || h === "m.youtube.com") {
    if (u.pathname === "/watch") return u.searchParams.get("v");
    const m = u.pathname.match(/^\/(?:shorts|embed|live)\/([\w-]+)/);
    if (m) return m[1];
  }
  return null;
}

function isThreadsPost(u) {
  const h = u.hostname.replace(/^www\./, "");
  return (h === "threads.com" || h === "threads.net") && /\/post\//.test(u.pathname);
}

// Embeds a URL by provider: Threads post, YouTube video, or (anything else)
// a link card. There is no server to fetch Open Graph data from, so a link
// card shows the hostname plus an optional title/description written in the
// ::embed[url | title | description] line.
export default function Embed({ url, title, desc }) {
  let u;
  try {
    u = new URL(url);
  } catch {
    return null;
  }

  if (isThreadsPost(u)) {
    return (
      <div className="embed embed-threads">
        <ThreadsEmbed url={url} />
      </div>
    );
  }

  const yt = youtubeId(u);
  if (yt) {
    return (
      <div className="embed embed-video">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${yt}`}
          title={title || "YouTube video"}
          loading="lazy"
          allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <a className="embed embed-card" href={url} target="_blank" rel="noopener noreferrer">
      <span className="embed-host">{u.hostname.replace(/^www\./, "")}</span>
      <span className="embed-title">{title || url}</span>
      {desc && <span className="embed-desc">{desc}</span>}
      <span className="embed-go" aria-hidden="true">
        ↗
      </span>
    </a>
  );
}
