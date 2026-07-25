import { useLocale } from "../i18n/LocaleContext";

export default function Pagination({ current, total, onChange }) {
  const { data } = useLocale();
  if (total <= 1) return null;

  return (
    <div className="pagination">
      <div className="pagination-controls">
        <button
          type="button"
          className="pagebtn"
          disabled={current <= 1}
          onClick={() => onChange(Math.max(1, current - 1))}
        >
          {data.ui.pagination.prev}
        </button>
        <span className="pageindicator">
          {current} / {total}
        </span>
        <button
          type="button"
          className="pagebtn"
          disabled={current >= total}
          onClick={() => onChange(Math.min(total, current + 1))}
        >
          {data.ui.pagination.next}
        </button>
      </div>
    </div>
  );
}
