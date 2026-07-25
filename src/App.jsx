import { LocaleProvider } from "./i18n/LocaleContext";
import { ModeProvider } from "./i18n/ModeContext";
import BootSequence from "./components/BootSequence";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ProductList from "./components/ProductList";

export default function App() {
  return (
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
