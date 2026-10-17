import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ctfdApi } from '../services/ctfdApi';
import { GiCheckeredFlag, GiSpeedometer, GiTrophyCup, GiFullMotorcycleHelmet } from 'react-icons/gi';
import { FaUserCircle, FaSignOutAlt, FaLockOpen, FaBroadcastTower } from 'react-icons/fa';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);

  const fetchUser = async () => {
    try {
      const user = await ctfdApi.getCurrentUser();
      setCurrentUser(user);
    } catch (e) {
      setCurrentUser(null);
    }
  };

  useEffect(() => {
    fetchUser();
    // Refresh user state on storage event or route change
    window.addEventListener('storage', fetchUser);
    return () => window.removeEventListener('storage', fetchUser);
  }, [location.pathname]);

  const handleLogout = async () => {
    await ctfdApi.logout();
    setCurrentUser(null);
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-[#101018]/95 backdrop-blur-md border-b border-[#2C2C3E] shadow-2xl">
      {/* Red & White Racing Curb Strip */}
      <div className="curb-strip" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Grand Prix Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative flex items-center justify-center w-12 h-10 bg-[#E10600] text-white font-black italic rounded transform -skew-x-12 shadow-[0_0_15px_rgba(225,6,0,0.6)] group-hover:bg-[#FF1A1A] transition-all">
              <span className="text-xl tracking-tighter not-italic font-['Orbitron']">F1</span>
              <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-white transform rotate-45" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-['Orbitron'] font-black tracking-wider text-xl text-white group-hover:text-[#E10600] transition-colors">
                  GRAND PRIX
                </span>
                <span className="bg-[#E10600] text-[10px] font-['Orbitron'] font-bold px-1.5 py-0.5 rounded text-white tracking-widest">
                  CTF
                </span>
              </div>
              <span className="text-[10px] font-['Chakra_Petch'] uppercase tracking-[0.25em] text-[#8F8FA3] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00D26A] animate-ping" />
                Paddock Escape Room
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              to="/"
              className={`px-4 py-2 font-['Orbitron'] text-xs font-bold tracking-wider uppercase transition-all rounded transform -skew-x-6 flex items-center gap-2 ${
                isActive('/')
                  ? 'bg-[#E10600] text-white shadow-[0_0_15px_rgba(225,6,0,0.5)]'
                  : 'text-[#8F8FA3] hover:text-white hover:bg-[#1C1C29]'
              }`}
            >
              <GiSpeedometer className="text-base" />
              <span className="inline-block transform skew-x-6">Race Control</span>
            </Link>

            <Link
              to="/challenges"
              className={`px-4 py-2 font-['Orbitron'] text-xs font-bold tracking-wider uppercase transition-all rounded transform -skew-x-6 flex items-center gap-2 ${
                isActive('/challenges')
                  ? 'bg-[#E10600] text-white shadow-[0_0_15px_rgba(225,6,0,0.5)]'
                  : 'text-[#8F8FA3] hover:text-white hover:bg-[#1C1C29]'
              }`}
            >
              <FaLockOpen className="text-sm" />
              <span className="inline-block transform skew-x-6">Pit Stops</span>
            </Link>

            <Link
              to="/scoreboard"
              className={`px-4 py-2 font-['Orbitron'] text-xs font-bold tracking-wider uppercase transition-all rounded transform -skew-x-6 flex items-center gap-2 ${
                isActive('/scoreboard')
                  ? 'bg-[#E10600] text-white shadow-[0_0_15px_rgba(225,6,0,0.5)]'
                  : 'text-[#8F8FA3] hover:text-white hover:bg-[#1C1C29]'
              }`}
            >
              <GiTrophyCup className="text-base text-[#FFD700]" />
              <span className="inline-block transform skew-x-6">Standings</span>
            </Link>
          </nav>

          {/* Telemetry / Driver Status Pill */}
          <div className="flex items-center gap-3">
            {currentUser ? (
              <div className="flex items-center gap-3">
                {/* Driver Tag */}
                <div className="flex items-center bg-[#171724] border border-[#2E2E42] rounded-lg p-1.5 px-3">
                  {/* Car Number Circle */}
                  <div className="w-8 h-8 rounded-full bg-[#E10600] flex items-center justify-center font-['Orbitron'] font-black text-sm text-white shadow-md border border-white/20 mr-2">
                    {currentUser.carNumber || '44'}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="font-['Orbitron'] text-xs font-bold text-white tracking-wide truncate max-w-[130px]">
                      {currentUser.name}
                    </span>
                    <span className="font-['Chakra_Petch'] text-[11px] font-bold text-[#FFD700] tracking-wider">
                      {currentUser.score || 0} PTS
                    </span>
                  </div>
                </div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  title="Pit Exit / Log Out"
                  className="p-2.5 rounded-lg bg-[#222233] hover:bg-[#E10600] text-[#8F8FA3] hover:text-white transition-all border border-[#2E2E42]"
                >
                  <FaSignOutAlt className="text-sm" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="btn-f1 text-xs py-2 px-4 shadow-[0_0_15px_rgba(225,6,0,0.5)]"
              >
                <GiFullMotorcycleHelmet className="text-lg mr-1" />
                Garage Entry
              </Link>
            )}
          </div>

        </div>
      </div>

      {/* Live Sector Strip */}
      <div className="bg-[#0B0B11] border-t border-[#1C1C2A] px-4 py-1 flex items-center justify-between text-[11px] font-['Chakra_Petch'] text-[#8F8FA3]">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-[#00D26A] font-bold">
              <span className="w-2 h-2 rounded-full bg-[#00D26A] animate-pulse" />
              TRACK STATUS: GREEN FLAG
            </span>
            <span className="hidden sm:inline text-white/40">|</span>
            <span className="hidden sm:inline text-white/80">
              DRS: <span className="text-[#00D26A] font-bold">ENABLED</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="sector-badge sector-purple">S1: PURPLE</span>
            <span className="sector-badge sector-green">S2: 24.120s</span>
            <span className="sector-badge sector-yellow">S3: PIT OPEN</span>
          </div>
        </div>
      </div>
    </header>
  );
}
