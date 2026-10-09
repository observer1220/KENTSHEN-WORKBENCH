import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import App from "../App";
import { toBlocks } from "../blog/posts";
import Embed from "../components/Embed";

beforeEach(() => {
  window.scrollTo = () => {};
  Element.prototype.scrollIntoView = () => {};
  window.history.pushState({}, "", "/");
});
afterEach(cleanup);

describe("home", () => {
  it("shows the one-line brand, hero, Kaohsiung label, nav, and all 6 works", () => {
    render(<App />);
    expect(document.querySelector(".brand").textContent).toBe("KENT SHEN");
    expect(document.documentElement.getAttribute("lang")).toBe("zh-Hant");
    expect(screen.getByText("高雄時間")).toBeTruthy();
    expect(screen.queryByText(/台北/)).toBeNull();
    expect(document.querySelector('.nav a[href="/blog"]')).not.toBeNull();
    expect(document.querySelectorAll(".index .row").length).toBe(6);

    for (const name of ["TAIWAN-BAIYUE", "TW-STOCK-REPORT", "UNDERCURRENT", "ELSEWHERE", "VEIL", "LYRIC-SYNC"]) {
      expect(screen.getByText(name)).toBeTruthy();
    }
    expect(screen.queryByText(/JOB-ANALYZER/)).toBeNull();
    expect(screen.queryByText(/TRIP-PLANNER/)).toBeNull();
    expect(document.querySelector(".langbtn")).toBeNull();
  });

  it("filters works with the search box", () => {
    render(<App />);
    const search = screen.getByRole("searchbox");
    fireEvent.change(search, { target: { value: "stock" } });
    expect(document.querySelectorAll(".index .row").length).toBe(1);
    fireEvent.change(search, { target: { value: "zzzz-no-such-work" } });
    expect(document.querySelectorAll(".index .row").length).toBe(0);
    expect(screen.getByText("找不到符合的作品。")).toBeTruthy();
  });
});

describe("blog", () => {
  it("lists posts with date and title at /blog, and opens a post with embeds", () => {
    render(<App />);
    fireEvent.click(document.querySelector('.nav a[href="/blog"]'));
    expect(window.location.pathname).toBe("/blog");
    expect(document.querySelectorAll(".postrow").length).toBeGreaterThan(0);
    expect(document.querySelector(".postrow time").textContent).toMatch(/^\d{4}\.\d{2}\.\d{2}$/);

    fireEvent.click(document.querySelector(".postrow"));
    expect(window.location.pathname).toMatch(/^\/blog\/[^/]+$/);
    expect(document.querySelector(".post-title")).not.toBeNull();
    expect(document.querySelector(".prose h2")).not.toBeNull();
    expect(document.querySelector(".embed-threads blockquote")).not.toBeNull();
    expect(document.querySelector(".embed-card")).not.toBeNull();

    fireEvent.click(screen.getByText("← 所有文章"));
    expect(window.location.pathname).toBe("/blog");
  });

  it("shows a not-found state for an unknown slug", () => {
    window.history.pushState({}, "", "/blog/does-not-exist");
    render(<App />);
    expect(screen.getByText("找不到這篇文章")).toBeTruthy();
  });
});

describe("toBlocks", () => {
  it("turns ::embed lines into embed blocks and keeps Markdown around them", () => {
    const blocks = toBlocks("# Hi\n\n::embed[https://example.com/a | Title | Desc]\n\ntext");
    expect(blocks.map((b) => b.type)).toEqual(["html", "embed", "html"]);
    expect(blocks[1]).toMatchObject({ url: "https://example.com/a", title: "Title", desc: "Desc" });
  });

  it("does not treat ::embed inside a code fence as an embed", () => {
    const blocks = toBlocks("```\n::embed[https://example.com]\n```");
    expect(blocks.map((b) => b.type)).toEqual(["html"]);
  });
});

describe("embeds by provider", () => {
  it("renders YouTube watch and youtu.be links as a privacy-enhanced iframe", () => {
    for (const url of ["https://www.youtube.com/watch?v=abc123XYZ_-", "https://youtu.be/abc123XYZ_-"]) {
      const { container, unmount } = render(<Embed url={url} />);
      expect(container.querySelector("iframe").getAttribute("src")).toBe("https://www.youtube-nocookie.com/embed/abc123XYZ_-");
      unmount();
    }
  });

  it("renders any other URL as a link card with host, title and description", () => {
    const { container } = render(<Embed url="https://www.example.com/post" title="A post" desc="About it" />);
    const card = container.querySelector("a.embed-card");
    expect(card.getAttribute("href")).toBe("https://www.example.com/post");
    expect(card.textContent).toContain("example.com");
    expect(card.textContent).toContain("A post");
    expect(card.textContent).toContain("About it");
  });
});

describe("contact flow", () => {
  it("opens the form at /contact and Back returns home", () => {
    render(<App />);
    fireEvent.click(document.querySelector('.nav a[href="/contact"]'));
    expect(window.location.pathname).toBe("/contact");
    expect(document.querySelector(".contact-form")).not.toBeNull();
    expect(document.querySelector(".index")).toBeNull();
    expect(document.querySelector(".contact-form select").children.length).toBe(2);

    fireEvent.click(screen.getByText("← 返回"));
    expect(document.querySelector(".contact-form")).toBeNull();
    expect(document.querySelector(".index")).not.toBeNull();
  });
});
