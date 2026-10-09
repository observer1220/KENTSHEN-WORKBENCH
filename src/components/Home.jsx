import { useEffect, useRef, useState } from "react";
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
  const floatRef = useRef(null);
  const imgRef = useRef(null);

  const q = query.trim().toLowerCase();
  const items = q ? data.products.filter((p) => matches(p, q)) : data.products;

  // Cursor-following poster, fine pointers only. Touch devices have no
  // hover, so each row shows its thumbnail inline instead (see CSS).
  useEffect(() => {
    if (!window.matchMedia?.("(hover: hover) and (pointer: fine)").matches) return;
    const fl = floatRef.current;
    let tx = 0, ty = 0, x = 0, y = 0, raf = 0;
    const tick = () => {
      x += (tx - x) * 0.16;
      y += (ty - y) * 0.16;
      fl.style.transform = `translate(${x}px, ${y}px) rotate(${((tx - x) * 0.04).toFixed(2)}deg)`;
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.3 ? requestAnimationFrame(tick) : 0;
    };
    const move = (e) => {
      tx = e.clientX + 28;
      ty = e.clientY - fl.offsetHeight / 2;
      if (!raf) raf = requestAnimationFrame(tick);
    };
    // listen on the whole section so filtering (which remounts the <ul>) can't drop the listeners
    const list = fl.parentElement;
    const over = (e) => {
      const li = e.target.closest("li[data-thumb]");
      if (!li) {
        fl.classList.remove("on");
        return;
      }
      imgRef.current.src = li.dataset.thumb;
      fl.classList.add("on");
      move(e);
    };
    const leave = () => fl.classList.remove("on");
    list.addEventListener("mouseover", over);
    list.addEventListener("mousemove", move);
    list.addEventListener("mouseleave", leave);
    return () => {
      list.removeEventListener("mouseover", over);
      list.removeEventListener("mousemove", move);
      list.removeEventListener("mouseleave", leave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

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
              <li key={p.id} data-thumb={p.thumbnail}>
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

      <div className="float" ref={floatRef} aria-hidden="true">
        <img ref={imgRef} alt="" />
      </div>
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
