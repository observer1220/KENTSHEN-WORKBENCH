import { useEffect, useRef } from "react";
import { useLocale } from "../i18n/LocaleContext";
import { renderMdLite } from "../utils/markdown";
import ThreadsEmbed from "./ThreadsEmbed";

// Horizontal scroll-snap gallery: one card per product, screenshot on top,
// details below, and (when the product has one) the Threads post that
// backs it up as user feedback sits under the card body.
//
// Mouse wheel over the gallery drives it like a carousel (vertical wheel
// motion is redirected into horizontal scroll) instead of scrolling the
// page — plain overflow-x-auto is easy to miss since a normal wheel only
// moves on the Y axis.
export default function Gallery() {
  const { data } = useLocale();
  const trackRef = useRef(null);

  const scrollByCards = (dir) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector(".gallery-card");
    const step = card ? card.getBoundingClientRect().width + 24 : track.clientWidth * 0.8;
    track.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  // React makes wheel listeners passive by default, so preventDefault() in
  // a JSX onWheel handler is silently ignored — a native, non-passive
  // listener is the only way to actually redirect the Y-axis scroll.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const onWheel = (e) => {
      if (track.scrollWidth <= track.clientWidth) return;
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      e.preventDefault();
      track.scrollLeft += e.deltaY;
    };
    track.addEventListener("wheel", onWheel, { passive: false });
    return () => track.removeEventListener("wheel", onWheel);
  }, []);

  // Coverflow-style depth: whichever card sits closest to the track's
  // center is pushed to full scale/opacity with a lifted shadow; cards
  // further off-center shrink and fade, so the "current" one visually
  // pops forward. Only the receding cards ever scale below 1 (the active
  // one stays at scale(1)) so nothing needs to overflow the scroll clip.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const cards = Array.from(track.querySelectorAll(".gallery-card"));
    let raf = null;

    const update = () => {
      raf = null;
      const trackRect = track.getBoundingClientRect();
      const center = trackRect.left + trackRect.width / 2;
      cards.forEach((card) => {
        const r = card.getBoundingClientRect();
        const cardCenter = r.left + r.width / 2;
        const dist = Math.min(1, Math.abs(cardCenter - center) / (trackRect.width / 2 + r.width / 2));
        const scale = 1 - dist * 0.1;
        const translateY = -8 + dist * 20;
        const opacity = 1 - dist * 0.35;
        card.style.transform = `translateY(${translateY.toFixed(1)}px) scale(${scale.toFixed(3)})`;
        card.style.opacity = opacity.toFixed(2);
        card.dataset.active = dist < 0.3 ? "true" : "false";
      });
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    };

    update();
    track.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      track.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="gallery">
      <button type="button" className="gallery-nav gallery-nav-prev" aria-label="Scroll left" onClick={() => scrollByCards(-1)}>
        ‹
      </button>
      <div className="gallery-track" ref={trackRef}>
        {data.products.map((p) => (
          <GalleryCard key={p.id} product={p} data={data} />
        ))}
      </div>
      <button type="button" className="gallery-nav gallery-nav-next" aria-label="Scroll right" onClick={() => scrollByCards(1)}>
        ›
      </button>
    </div>
  );
}

function GalleryCard({ product, data }) {
  const statusKey = product.status || "planned";
  const statusLabel = data.ui.statusLabels[statusKey] || statusKey;

  return (
    <article className="gallery-card" data-status={statusKey} data-id={product.id}>
      {product.screenshot && (
        <div className="gallery-card-media" data-fit={product.id === "elsewhere" ? "contain" : "cover"}>
          <img src={product.screenshot} alt={`${product.title} screenshot`} loading="lazy" />
        </div>
      )}

      <div className="gallery-card-body">
        <div className="entry-meta">
          <span>{product.date || "—"}</span>
          <span className="status-tag">{statusLabel}</span>
        </div>

        <h3>
          {product.title} <span className="kind">{product.kind}</span>
        </h3>

        <p className="desc">{renderMdLite(product.desc)}</p>

        {product.links && product.links.length > 0 && (
          <div className="links">
            {product.links.map((link, i) => {
              const label = data.ui.linkLabels[link.label] || link.label;
              const external = link.url && link.url !== "#";
              return (
                <a key={i} href={link.url} target={external ? "_blank" : undefined} rel={external ? "noopener" : undefined}>
                  {label}
                </a>
              );
            })}
          </div>
        )}
      </div>

      {product.feedback && (
        <div className="gallery-feedback">
          <div className="sectionlabel">{data.ui.feedbackLabel}</div>
          <ThreadsEmbed url={product.feedback} />
        </div>
      )}
    </article>
  );
}
