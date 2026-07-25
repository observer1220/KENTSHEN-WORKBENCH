import { describe, it, expect, afterEach } from "vitest";
import { render, screen, within, fireEvent, cleanup } from "@testing-library/react";
import { LocaleProvider } from "../i18n/LocaleContext";
import { ModeProvider } from "../i18n/ModeContext";
import BootSequence from "../components/BootSequence";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ProductList from "../components/ProductList";

afterEach(cleanup);

function renderApp() {
  return render(
    <LocaleProvider>
      <ModeProvider>
        <BootSequence>
          <div className="wrap" id="top">
            <Header />
            <ProductList />
            <Footer />
          </div>
        </BootSequence>
      </ModeProvider>
    </LocaleProvider>
  );
}

describe("single-page layout (default locale: zh)", () => {
  it("renders brand, no category nav, and all 5 products flat with no pagination", () => {
    renderApp();
    expect(screen.getByText("KENT")).toBeTruthy();
    expect(document.documentElement.getAttribute("lang")).toBe("zh-Hant");
    expect(document.querySelector(".catnav")).toBeNull();
    expect(document.querySelector(".explore-grid")).toBeNull();
    expect(document.querySelector(".tagline")).toBeNull();
    expect(document.querySelector(".hero")).toBeNull();

    const rail = document.querySelector(".rail");
    expect(rail.querySelectorAll(".entry").length).toBe(5);
    expect(document.querySelector(".pagination-controls")).toBeNull();

    expect(screen.getByText(/JPOP-LYRIC-SYNC-CHROME-EXTENSION/)).toBeTruthy();
    expect(screen.getByText(/PEAKS-OF-TAIWAN-WEB/)).toBeTruthy();
    expect(screen.getByText(/TW-STOCK-REPORT/)).toBeTruthy();
    expect(screen.getByText(/JOB-ANALYZER/)).toBeTruthy();
    expect(screen.getByText(/TRIP-PLANNER/)).toBeTruthy();

    // removed items should be gone
    expect(screen.queryByText(/PEAKS-OF-TAIWAN-CHROME-EXTENSION/)).toBeNull();
    expect(screen.queryByText(/這禮拜去哪玩/)).toBeNull();
    expect(screen.queryByText("尚未命名")).toBeNull();
  });
});

describe("footer", () => {
  it("has no bio paragraph and no podcast link", () => {
    renderApp();
    const footer = document.getElementById("about");
    expect(within(footer).queryByText(/趨勢科技|Trend Micro/)).toBeNull();
    expect(within(footer).queryByText(/資安解碼|Podcast/i)).toBeNull();
  });
});

describe("language toggle", () => {
  it("defaults to zh and switches to English on toggle", () => {
    renderApp();
    expect(document.documentElement.getAttribute("lang")).toBe("zh-Hant");
    expect(document.body.classList.contains("lang-zh")).toBe(true);

    const langBtn = screen.getByRole("button", { name: /switch language/i });
    fireEvent.click(langBtn);
    expect(document.documentElement.getAttribute("lang")).toBe("en");
    expect(document.body.classList.contains("lang-zh")).toBe(false);
  });
});

describe("phosphor palette toggle", () => {
  it("flips data-mode between green and amber", () => {
    renderApp();
    const before = document.documentElement.getAttribute("data-mode");
    expect(before).toBe("green");
    const modeBtn = document.querySelector(".modebtn");
    fireEvent.click(modeBtn);
    expect(document.documentElement.getAttribute("data-mode")).toBe("amber");
  });
});

describe("boot sequence", () => {
  it("renders the boot overlay on a fresh session", () => {
    window.sessionStorage.removeItem("kentshen_intro_seen");
    renderApp();
    expect(document.querySelector(".boot-overlay")).not.toBeNull();
    expect(document.querySelector(".boot-terminal")).not.toBeNull();
  });

  it("is skipped on repeat visits once sessionStorage flag is set", () => {
    window.sessionStorage.setItem("kentshen_intro_seen", "1");
    renderApp();
    expect(document.querySelector(".boot-overlay")).toBeNull();
    window.sessionStorage.removeItem("kentshen_intro_seen");
  });
});
