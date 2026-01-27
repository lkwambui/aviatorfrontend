import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { GameProvider } from "./context/GameContext";

// Pages
import Aviator from "./pages/Aviator";

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <GameProvider>
          <Routes>
            {/* Public Routes - Landing page is the game */}
            <Route path="/aviator" element={<Aviator />} />
            <Route path="/" element={<Navigate to="/aviator" replace />} />
            <Route path="*" element={<Navigate to="/aviator" replace />} />
          </Routes>
        </GameProvider>
      </AuthProvider>
    </Router>
  );
}
