import { useLocale } from "../i18n/LocaleContext";
import ExploreGrid from "../components/ExploreGrid";
import { renderMdLite } from "../utils/markdown";

export default function HomePage() {
  const { data } = useLocale();

  return (
    <>
      <section className="hero">
        <p>{renderMdLite(data.ui.hero.statement)}</p>
        <p className="sub">{data.ui.hero.sub}</p>
      </section>
      <ExploreGrid />
    </>
  );
}
