import { useState } from "react";
import { LocaleProvider } from "./i18n/LocaleContext";
import { ModeProvider } from "./i18n/ModeContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ProductList from "./components/ProductList";
import ContactPage from "./components/ContactPage";

export default function App() {
  const [view, setView] = useState("home"); // "home" | "contact"

  return (
    <LocaleProvider>
      <ModeProvider>
        <div className="wrap" id="top">
          <Header />
          {view === "contact" ? (
            <ContactPage onBack={() => setView("home")} />
          ) : (
            <ProductList />
          )}
          <Footer onContactClick={() => setView("contact")} />
        </div>
      </ModeProvider>
    </LocaleProvider>
  );
}
