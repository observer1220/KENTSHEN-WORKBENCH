import { useLocale } from "../i18n/LocaleContext";
import { Link } from "../router";

export default function Header() {
  const { data } = useLocale();
  const nav = data.ui.nav;

  return (
    <header className="bar">
      <Link className="brand" to="/" aria-label="Kent Shen">
        KENT <span>SHEN</span>
      </Link>
      <nav className="nav">
        <Link to="/#works">{nav.works}</Link>
        <Link to="/blog">{nav.blog}</Link>
        <Link to="/contact">{nav.contact}</Link>
      </nav>
    </header>
  );
}
