import {lazy, Suspense } from "react";
import { Routes, Route } from "react-router";

import { Header } from "./components/Header.jsx";
import { Footer } from "./components/Footer.jsx";

const HomePage = lazy(() => import("./pages/Home.jsx"));
const SearchPage = lazy(() => import("./pages/Search.jsx"));
const JobDetail = lazy(() => import("./pages/Detail.jsx"));

function App() {
  return (
    <>
      <Header />
      <Suspense fallback={<div style={{maxWidth:'1280px', margin:'0 auto', padding:'0 1rem'}}>Loading...</div>}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/jobs/:jobId" element={<JobDetail />} />
        </Routes>
      </Suspense>
      <Footer />
    </>
  );
}

export default App;
