import {lazy, Suspense } from "react";
import { Routes, Route } from "react-router";

import { Header } from "./components/Header.jsx";
import { Footer } from "./components/Footer.jsx";

const HomePage = lazy(() => import("./pages/Home.jsx"));
const SearchPage = lazy(() => import("./pages/Search.jsx"));
const JobDetail = lazy(() => import("./pages/Detail.jsx"));
const Page404 = lazy(() => import("./pages/404.jsx"));

function App() {
  return (
    <>
      <Header />
      <Suspense fallback={<div style={{maxWidth:'1280px', margin:'0 auto', padding:'0 1rem'}}>Loading...</div>}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/jobs/:jobId" element={<JobDetail />} />
          {/* Agregamos una ruta comodín para manejar páginas no encontradas */}
          <Route path="*" element={<Page404 />} />
        </Routes>
      </Suspense>
      <Footer />
    </>
  );
}

export default App;
