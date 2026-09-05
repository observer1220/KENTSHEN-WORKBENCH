import Gallery from "./Gallery";

// Horizontal scroll-snap gallery — no category tabs, no pagination. The
// "category" field is still kept on each product in en.json/zh.json so
// re-introducing grouping later is just a rendering change, not a data
// migration.
export default function ProductList() {
  return (
    <section className="log">
      <Gallery />
    </section>
  );
}
