import { useLocale } from "../i18n/LocaleContext";
import ProductEntry from "./ProductEntry";

// Flat, single-page list — no category tabs, no pagination. Revisit this
// once the catalog grows past a handful of items; the "category" field is
// still kept on each product in en.json/zh.json so re-introducing grouping
// later is just a rendering change, not a data migration.
export default function ProductList() {
  const { data } = useLocale();

  return (
    <section className="log">
      <div className="rail">
        {data.products.map((p) => (
          <ProductEntry key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
