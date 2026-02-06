import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { Route } from "./components/Route";

import { HomePage } from "./pages/Home";
import { SearchPage } from "./pages/Search";
import { NotFoundPage } from "./pages/404";

function App() {
  return (
    <>
      <Header />
      <Route path="/" component={HomePage} />
      <Route path="/search" component={SearchPage} />
      <Route path="*" component={NotFoundPage} />
      <Footer />
    </>
  );
}

export default App;
