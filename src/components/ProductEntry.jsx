import { useState } from "react";
import { useLocale } from "../i18n/LocaleContext";
import { renderMdLite } from "../utils/markdown";

export default function ProductEntry({ product }) {
  const { data } = useLocale();
  const statusKey = product.status || "planned";
  const statusLabel = data.ui.statusLabels[statusKey] || statusKey;
  const isPlanned = statusKey === "planned";
  const isSkill = product.category === "skills";

  return (
    <article
      className={"entry" + (isPlanned ? " is-planned" : "") + (isSkill ? " is-skill" : "")}
      data-status={statusKey}
    >
      <div className="entry-meta">
        <span>{product.date || "—"}</span>
        <span className="status-tag">{statusLabel}</span>
      </div>

      <h3>
        {product.title}{" "}
        <span className="kind">{product.kind}</span>
      </h3>

      <p className="desc">{renderMdLite(product.desc)}</p>

      {isSkill ? (
        <SkillExtras product={product} data={data} />
      ) : (
        product.links &&
        product.links.length > 0 && (
          <div className="links">
            {product.links.map((link, i) => {
              const label = data.ui.linkLabels[link.label] || link.label;
              const external = link.url && link.url !== "#";
              return (
                <a
                  key={i}
                  href={link.url}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noopener" : undefined}
                >
                  {label}
                </a>
              );
            })}
          </div>
        )
      )}
    </article>
  );
}

function SkillExtras({ product, data }) {
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <>
      <div className={"skill-shot" + (imgFailed ? " is-placeholder" : "")}>
        {imgFailed ? (
          <span>{data.ui.skillsMeta.screenshotPending}</span>
        ) : (
          <img
            alt={`${product.title} screenshot`}
            loading="lazy"
            src={`/assets/skills/${product.id}.png`}
            onError={() => setImgFailed(true)}
          />
        )}
      </div>

      {product.triggers && product.triggers.length > 0 && (
        <div className="triggers">
          <span className="triggers-label">{data.ui.skillsMeta.triggerLabel}:</span>
          {product.triggers.map((t, i) => (
            <span className="trigger-chip" key={i}>
              &ldquo;{t}&rdquo;
            </span>
          ))}
        </div>
      )}

      {product.cta && product.cta.url && (
        <div className="links">
          <a href={product.cta.url} target="_blank" rel="noopener">
            {data.ui.skillsMeta.ctaLabel}
          </a>
        </div>
      )}
    </>
  );
}
