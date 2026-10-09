import { useEffect, useState } from "react";
import { useLocale } from "../i18n/LocaleContext";
import { Link } from "../router";
import { renderMdLite } from "../utils/markdown";

// Kaohsiung and Taipei share a time zone, so Intl only knows "Asia/Taipei".
const clockFmt = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Asia/Taipei",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

function Clock() {
  const [now, setNow] = useState(() => clockFmt.format(new Date()));
  useEffect(() => {
    const id = setInterval(() => setNow(clockFmt.format(new Date())), 1000);
    return () => clearInterval(id);
  }, []);
  return <strong className="clock">{now}</strong>;
}

function Hero() {
  const { data } = useLocale();
  const h = data.ui.hero;

  return (
    <section className="hero">
      <span className="mono">{h.eyebrow}</span>
      <h1>{renderMdLite(h.title)}</h1>
      <p className="lede">{h.lede}</p>
      <div className="facts">
        <div>
          <span className="mono">{h.facts.works}</span>
          <strong>{data.products.length}</strong>
        </div>
        <div>
          <span className="mono">{h.facts.deploy}</span>
          <strong>Cloudflare Workers</strong>
        </div>
        <div>
          <span className="mono">{h.facts.time}</span>
          <Clock />
        </div>
      </div>
    </section>
  );
}

function matches(p, q) {
  return [p.title, p.kind, p.tagline, p.desc].join(" ").toLowerCase().includes(q);
}

function WorksIndex() {
  const { data } = useLocale();
  const w = data.ui.works;
  const [query, setQuery] = useState("");

  const q = query.trim().toLowerCase();
  const items = q ? data.products.filter((p) => matches(p, q)) : data.products;


  return (
    <section id="works" aria-labelledby="works-h">
      <div className="worksbar">
        <h2 id="works-h">{w.heading}</h2>
        <label className="search">
          <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={w.search}
            aria-label={w.search}
            autoComplete="off"
          />
        </label>
      </div>

      {items.length === 0 ? (
        <p className="muted works-empty">{w.empty}</p>
      ) : (
        <ul className="index">
          {items.map((p) => {
            const url = p.links && p.links[0] && p.links[0].url;
            return (
              <li key={p.id}>
                <a className="row" href={url} target="_blank" rel="noopener">
                  <span className="rname">{p.title}</span>
                  <span className="rmeta">
                    <span className="rkind">
                      {p.kind} · {p.date.slice(0, 4)}
                    </span>
                    <span className="rtag">{p.tagline}</span>
                  </span>
                  {p.thumbnail && (
                    <span className="inline-thumb">
                      <img src={p.thumbnail} alt="" loading="lazy" />
                    </span>
                  )}
                </a>
              </li>
            );
          })}
        </ul>
      )}

    </section>
  );
}

function BigLinks() {
  const { data } = useLocale();
  const h = data.ui.home;

  return (
    <section className="duo">
      <Link className="big" to="/blog">
        <div>
          <h3>{h.blog.title}</h3>
          <p>{h.blog.desc}</p>
        </div>
        <span className="go">kentshen.com/blog →</span>
      </Link>
      <Link className="big" to="/contact">
        <div>
          <h3>{h.contact.title}</h3>
          <p>{h.contact.desc}</p>
        </div>
        <span className="go">{h.contact.go}</span>
      </Link>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <Hero />
      <WorksIndex />
      <BigLinks />
    </>
  );
}
