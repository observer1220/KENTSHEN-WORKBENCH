import { Link, useParams } from "react-router-dom";
import { useLocale } from "../i18n/LocaleContext";
import CategorySection from "../components/CategorySection";

export default function CategoryPage() {
  const { category } = useParams();
  const { data } = useLocale();

  return (
    <>
      <Link className="backlink" to="/">
        {data.ui.backLink}
      </Link>
      <CategorySection category={category} showNote={category === "skills"} />
    </>
  );
}
