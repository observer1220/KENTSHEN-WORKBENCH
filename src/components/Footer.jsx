import { useLocale } from "../i18n/LocaleContext";

export default function Footer({ onContactClick }) {
  const { data } = useLocale();
  const links = data.ui.about.links || {};

  return (
    <footer id="about">
      <div className="about-title">{data.ui.about.label}</div>
      {data.ui.about.body && <p>{data.ui.about.body}</p>}
      <div className="foot-links">
        {links.contact && (
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onContactClick();
            }}
          >
            {links.contact}
          </a>
        )}
      </div>
      <div className="colophon">{data.ui.colophon}</div>
    </footer>
  );
}
