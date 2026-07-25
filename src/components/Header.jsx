import { useLocale } from "../i18n/LocaleContext";
import { useMode } from "../i18n/ModeContext";
import { TerminalIcon } from "./Icons";

export default function Header() {
  const { data, toggleLang } = useLocale();
  const { mode, toggleMode } = useMode();

  return (
    <header>
      <div className="headerbar">
        <div>
          <a className="brandlink glitch-hover" href="#top" aria-label="Kent Shen" data-text="KENT SHEN">
            <h1 className="brand" id="brandTitle">
              KENT
              <br />
              <span>SHEN</span>
            </h1>
          </a>
        </div>
        <div className="headertools">
          <a className="aboutlink" href="#about">
            {data.ui.aboutLink}
          </a>
          <button className="langbtn" type="button" onClick={toggleLang} aria-label="Switch language">
            EN / 中
          </button>
          <button
            className="modebtn"
            type="button"
            onClick={toggleMode}
            aria-label={mode === "amber" ? "Switch to green phosphor" : "Switch to amber phosphor"}
          >
            <TerminalIcon />
          </button>
        </div>
      </div>
    </header>
  );
}
