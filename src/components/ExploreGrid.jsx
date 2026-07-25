import { Link } from "react-router-dom";
import { useLocale } from "../i18n/LocaleContext";

const CATEGORY_ORDER = ["extensions", "apps", "games", "services", "skills"];

export default function ExploreGrid() {
  const { data } = useLocale();

  return (
    <section className="explore">
      <div className="explore-grid">
        {CATEGORY_ORDER.map((cat) => {
          if (!data.ui.sections[cat]) return null;
          const count = data.products.filter((p) => p.category === cat).length;
          const countLabel = (data.ui.explore.itemsLabel || "{n}").replace("{n}", count);
          return (
            <Link key={cat} className="explore-card" to={`/${cat}`}>
              <div className="explore-label">{data.ui.sections[cat]}</div>
              <div className="explore-count">{countLabel}</div>
              <div className="explore-arrow">→</div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
