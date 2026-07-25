import { describe, it, expect, afterEach } from "vitest";
import { render, screen, within, fireEvent, cleanup } from "@testing-library/react";
import App from "../App";

afterEach(cleanup);

describe("single-page layout (default locale: zh)", () => {
  it("renders brand, no category nav, and all 4 products flat with no pagination", () => {
    render(<App />);
    expect(screen.getByText("KENT")).toBeTruthy();
    expect(document.documentElement.getAttribute("lang")).toBe("zh-Hant");
    expect(document.querySelector(".catnav")).toBeNull();
    expect(document.querySelector(".explore-grid")).toBeNull();
    expect(document.querySelector(".tagline")).toBeNull();
    expect(document.querySelector(".hero")).toBeNull();
    expect(document.querySelector(".boot-overlay")).toBeNull();

    const rail = document.querySelector(".rail");
    expect(rail.querySelectorAll(".entry").length).toBe(4);
    expect(document.querySelector(".pagination-controls")).toBeNull();

    expect(screen.getByText(/JPOP-LYRIC-SYNC-CHROME-EXTENSION/)).toBeTruthy();
    expect(screen.getByText(/PEAKS-OF-TAIWAN-WEB/)).toBeTruthy();
    expect(screen.getByText(/TW-STOCK-REPORT/)).toBeTruthy();
    expect(screen.getByText(/TRIP-PLANNER/)).toBeTruthy();

    // removed/hidden items should be gone
    expect(screen.queryByText(/JOB-ANALYZER/)).toBeNull();
    expect(screen.queryByText(/PEAKS-OF-TAIWAN-CHROME-EXTENSION/)).toBeNull();
    expect(screen.queryByText(/這禮拜去哪玩/)).toBeNull();
    expect(screen.queryByText("尚未命名")).toBeNull();
  });

  it("has no source-code link on the lyrics extension card", () => {
    render(<App />);
    expect(screen.queryByText(/原始碼|Source/)).toBeNull();
  });
});

describe("footer", () => {
  it("has no bio paragraph, no podcast link, and no GitHub link", () => {
    render(<App />);
    const footer = document.getElementById("about");
    expect(within(footer).queryByText(/趨勢科技|Trend Micro/)).toBeNull();
    expect(within(footer).queryByText(/資安解碼|Podcast/i)).toBeNull();
    expect(within(footer).queryByText(/GitHub/i)).toBeNull();
    expect(within(footer).getByText(/聯絡|Contact/)).toBeTruthy();
  });
});

describe("contact flow", () => {
  it("clicking Contact swaps in the contact form, and Back returns to the product list", () => {
    render(<App />);
    const contactLink = screen.getByText("聯絡");
    fireEvent.click(contactLink);

    expect(document.querySelector(".contact-form")).not.toBeNull();
    expect(document.querySelector(".rail")).toBeNull();

    const select = document.querySelector(".contact-form select");
    expect(select.children.length).toBe(2); // 產品回饋 / 客製化服務

    const backBtn = screen.getByText("← 返回");
    fireEvent.click(backBtn);
    expect(document.querySelector(".contact-form")).toBeNull();
    expect(document.querySelector(".rail")).not.toBeNull();
  });
});

describe("language toggle", () => {
  it("defaults to zh and switches to English on toggle", () => {
    render(<App />);
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
    render(<App />);
    const before = document.documentElement.getAttribute("data-mode");
    expect(before).toBe("green");
    const modeBtn = document.querySelector(".modebtn");
    fireEvent.click(modeBtn);
    expect(document.documentElement.getAttribute("data-mode")).toBe("amber");
  });
});
