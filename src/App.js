import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const Countries = lazy(() => import("./Components/CountryTable.js"));
const Weather = lazy(() => import("./Components/Weather"));

const App = () => {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Countries />} />
          <Route path="/weather" element={<Weather />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
