import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import ChallengePage from './pages/ChallengePage';
import ScoreboardPage from './pages/ScoreboardPage';
import { GiRadioTower, GiFullMotorcycleHelmet, GiCheckeredFlag } from 'react-icons/gi';
import './App.css';

export default function App() {
  return (
    <Router>
      <div className="app-layout font-['Titillium_Web'] text-white">
        
        {/* Top F1 Navigation Bar */}
        <Navbar />

        {/* Routed Pages */}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/challenges" element={<ChallengePage />} />
            <Route path="/scoreboard" element={<ScoreboardPage />} />
            {/* Fallback to root */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Global F1 Pit Wall Footer */}
        <footer className="pitwall-footer border-t border-[#262638] bg-[#0A0A10]">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Brand and FIA Disclaimer */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-[#E10600] flex items-center justify-center font-['Orbitron'] font-black text-white text-xs">
                F1
              </div>
              <div className="flex flex-col">
                <span className="font-['Orbitron'] text-xs font-bold text-white tracking-wider">
                  F1 GRAND PRIX CYBERSECURITY ESCAPE ROOM
                </span>
                <span className="font-['Chakra_Petch'] text-[11px] text-[#7A7A90]">
                  Official Paddock Telemetry & Capture The Flag Platform
                </span>
              </div>
            </div>

            {/* Radio / Sector Status */}
            <div className="flex items-center gap-6 text-xs font-['Chakra_Petch'] text-[#8A8AA0]">
              <div className="flex items-center gap-1.5 text-[#00D26A]">
                <GiRadioTower className="text-sm" />
                <span>PIT WALL FREQ: 868.45 MHz</span>
              </div>
              <span className="hidden sm:inline">•</span>
              <div className="flex items-center gap-1 text-white/80">
                <GiCheckeredFlag className="text-[#FFD700]" />
                <span>FIA SAFETY PROTOCOL: STRICT</span>
              </div>
            </div>

            {/* Copyright */}
            <div className="text-[11px] font-['Chakra_Petch'] text-[#636378]">
              &copy; {new Date().getFullYear()} Scuderia CTF. Engineered for speed and security.
            </div>

          </div>
        </footer>

      </div>
    </Router>
  );
}
