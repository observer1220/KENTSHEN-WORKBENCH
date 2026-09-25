import { useLocale } from "../i18n/LocaleContext";

// Linktree-style layout: one flat, vertical stack of link cards — a
// full-width thumbnail (the product's own 1200x630 og-image, so its text
// stays legible) on top, title + tagline below. Replaces the earlier
// horizontal gallery/carousel, which turned out to be too much visual
// noise for what is, at heart, a list of links.
export default function LinkList() {
  const { data } = useLocale();

  return (
    <div className="linklist">
      {data.products.map((p) => (
        <LinkRow key={p.id} product={p} data={data} />
      ))}
    </div>
  );
}

function LinkRow({ product, data }) {
  const url = product.links && product.links[0] && product.links[0].url;

  return (
    <a className="linkrow" href={url} target="_blank" rel="noopener">
      {product.thumbnail && (
        <div className="linkrow-thumb">
          <img src={product.thumbnail} alt="" loading="lazy" />
        </div>
      )}
      <div className="linkrow-body">
        <div className="linkrow-title">
          {product.title} <span className="kind">{product.kind}</span>
          <span className="linkrow-arrow" aria-hidden="true">
            →
          </span>
        </div>
        <p className="linkrow-desc">{product.tagline || product.desc}</p>
      </div>
    </a>
  );
}
