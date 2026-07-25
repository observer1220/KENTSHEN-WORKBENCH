import { useLocale } from "../i18n/LocaleContext";

export default function Footer() {
  const { data } = useLocale();
  const links = data.ui.about.links || {};

  return (
    <footer id="about">
      <div className="about-title">{data.ui.about.label}</div>
      {data.ui.about.body && <p>{data.ui.about.body}</p>}
      <div className="foot-links">
        {Object.keys(links).map((key) =>
          links[key] ? (
            <a key={key} href="#">
              {links[key]}
            </a>
          ) : null
        )}
      </div>
      <div className="colophon">{data.ui.colophon}</div>
    </footer>
  );
}
