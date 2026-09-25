import LinkList from "./LinkList";

// Simple, flat list — no category tabs, no pagination. The "category"
// field is still kept on each product in en.json/zh.json so
// re-introducing grouping later is just a rendering change, not a data
// migration.
export default function ProductList() {
  return (
    <section className="log">
      <LinkList />
    </section>
  );
}
