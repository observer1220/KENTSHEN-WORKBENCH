import { useState } from "react";
import { useLocale } from "../i18n/LocaleContext";
import ProductEntry from "./ProductEntry";
import Pagination from "./Pagination";

const PAGE_SIZE = 6; // entries per page — categories with fewer items than
                      // this simply never show pagination controls.

export default function CategorySection({ category, showNote }) {
  const { data } = useLocale();
  const [page, setPage] = useState(1);

  const items = data.products.filter((p) => p.category === category);
  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const current = Math.min(page, totalPages);
  const start = (current - 1) * PAGE_SIZE;
  const pageItems = items.slice(start, start + PAGE_SIZE);

  return (
    <section className="log" id={category}>
      <div className="sectionlabel">{data.ui.sections[category]}</div>
      {showNote && <p className="sectionnote">{data.ui.sections.skillsNote}</p>}
      <div className="rail">
        {pageItems.map((p) => (
          <ProductEntry key={p.id} product={p} />
        ))}
      </div>
      <Pagination current={current} total={totalPages} onChange={setPage} />
    </section>
  );
}
