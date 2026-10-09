import { LocaleProvider } from "./i18n/LocaleContext";
import { RouterProvider, useRouter } from "./router";
import Header from "./components/Header";
import Home from "./components/Home";
import { BlogList, BlogPost } from "./components/BlogPage";
import ContactPage from "./components/ContactPage";

function Page() {
  const { path } = useRouter();
  if (path === "/blog") return <BlogList />;
  if (path.startsWith("/blog/")) return <BlogPost slug={decodeURIComponent(path.slice(6))} />;
  if (path === "/contact") return <ContactPage />;
  return <Home />;
}

export default function App() {
  return (
    <LocaleProvider>
      <RouterProvider>
        <div className="wrap" id="top">
          <Header />
          <Page />
          <footer className="foot mono">
            <span>© 2026 Kent Shen</span>
            <span>kentshen.com</span>
          </footer>
        </div>
      </RouterProvider>
    </LocaleProvider>
  );
}
