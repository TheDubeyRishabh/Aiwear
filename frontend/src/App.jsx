import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Shop from "./pages/Shop";
import AiTryOn from "./pages/AiTryOn";

function App() {
  return (
    <>
      <Navbar />
      <div className="pt-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/shop" element={<ProtectedRoute><Shop /></ProtectedRoute>} />
          <Route path="/aitryon" element={<ProtectedRoute><AiTryOn /></ProtectedRoute>} />
          <Route path="*" element={
            <div className="min-h-screen flex items-center justify-center">
              <h1 className="text-3xl" style={{ fontFamily: "var(--font-display)" }}>404 — NOT FOUND</h1>
            </div>
          } />
        </Routes>
      </div>
      <Footer />
    </>
  );
}

export default App;
