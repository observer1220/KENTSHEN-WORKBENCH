import { useLocale } from "../i18n/LocaleContext";

export default function Footer({ onContactClick }) {
  const { data } = useLocale();
  const links = data.ui.about.links || {};

  return (
    <footer id="about">
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
    </footer>
  );
}
