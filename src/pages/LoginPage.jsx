import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ctfdApi } from '../services/ctfdApi';
import {
  GiFullMotorcycleHelmet,
  GiRaceCar,
  GiSteeringWheel,
  GiCheckeredFlag,
} from 'react-icons/gi';
import { FaLock, FaUser, FaEnvelope, FaIdCard, FaExclamationCircle } from 'react-icons/fa';

const F1_TEAMS = [
  { name: 'Scuderia Ferrari HP', color: '#E80020' },
  { name: 'Oracle Red Bull Racing', color: '#1E41FF' },
  { name: 'Mercedes-AMG Petronas F1 Team', color: '#00D2BE' },
  { name: 'McLaren Formula 1 Team', color: '#FF8000' },
  { name: 'Aston Martin Aramco F1 Team', color: '#229971' },
  { name: 'BWT Alpine F1 Team', color: '#0090FF' },
  { name: 'Williams Racing', color: '#005AFF' },
  { name: 'Visa Cash App RB F1 Team', color: '#6692FF' },
  { name: 'Stake F1 Team Kick Sauber', color: '#52E252' },
  { name: 'MoneyGram Haas F1 Team', color: '#B6BABD' },
];

export default function LoginPage() {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedTeam, setSelectedTeam] = useState(F1_TEAMS[0].name);
  const [carNumber, setCarNumber] = useState('44');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        const res = await ctfdApi.register(username, email, password);
        if (res.success) {
          navigate('/challenges');
        } else {
          setError(res.message || 'Registration rejected by Race Control.');
        }
      } else {
        const res = await ctfdApi.login(username, password);
        if (res.success) {
          navigate('/challenges');
        } else {
          setError(res.message || 'Driver authentication failed. Check credentials.');
        }
      }
    } catch (err) {
      setError('Telemetry server connection error. Verify CTFd service.');
    } finally {
      setLoading(false);
    }
  };

  const currentTeamObj = F1_TEAMS.find((t) => t.name === selectedTeam) || F1_TEAMS[0];

  return (
    <div className="min-h-[calc(100vh-85px)] carbon-fiber-bg py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Side: FIA Super Licence Driver Card Preview */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="w-full max-w-sm bg-gradient-to-br from-[#1E1E2C] to-[#111119] border-2 border-[#33334A] rounded-2xl p-6 shadow-[0_0_40px_rgba(0,0,0,0.8)] relative overflow-hidden">
            
            {/* Top FIA Bar */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="bg-[#E10600] text-white text-[10px] font-['Orbitron'] font-black px-2 py-0.5 rounded">
                  FIA
                </span>
                <span className="font-['Orbitron'] text-xs font-bold text-white tracking-widest uppercase">
                  SUPER LICENCE
                </span>
              </div>
              <span className="font-['JetBrains_Mono'] text-[10px] text-[#FFD700]">
                2026 SEASON
              </span>
            </div>

            {/* Driver Identity */}
            <div className="flex items-center gap-4 mb-5">
              <div
                style={{ borderColor: currentTeamObj.color }}
                className="w-16 h-16 rounded-xl bg-[#0D0D14] border-2 flex items-center justify-center text-3xl text-white shadow-lg relative overflow-hidden"
              >
                <GiFullMotorcycleHelmet />
                <div
                  style={{ background: currentTeamObj.color }}
                  className="absolute bottom-0 inset-x-0 h-1.5"
                />
              </div>

              <div>
                <span className="text-[10px] font-['Chakra_Petch'] text-[#8F8FA3] uppercase tracking-wider block">
                  DRIVER CALL SIGN
                </span>
                <h3 className="font-['Orbitron'] font-black text-lg text-white tracking-wider truncate max-w-[170px]">
                  {username || 'ROOKIE PILOT'}
                </h3>
                <span
                  style={{ color: currentTeamObj.color }}
                  className="font-['Chakra_Petch'] text-xs font-bold truncate block max-w-[170px]"
                >
                  {selectedTeam}
                </span>
              </div>
            </div>

            {/* Telemetry Stats */}
            <div className="grid grid-cols-2 gap-2 bg-[#0B0B12] rounded-lg p-3 border border-[#222233] mb-4 text-xs font-['Chakra_Petch']">
              <div>
                <span className="text-[#8F8FA3] block text-[10px]">CAR NUMBER</span>
                <span className="font-['Orbitron'] font-black text-white text-base">
                  #{carNumber}
                </span>
              </div>
              <div>
                <span className="text-[#8F8FA3] block text-[10px]">LICENCE CLASS</span>
                <span className="font-['Orbitron'] font-black text-[#00D26A] text-base">
                  GRADE A
                </span>
              </div>
            </div>

            {/* Fake Barcode Graphic */}
            <div className="pt-2 border-t border-white/10 flex items-center justify-between">
              <div className="h-6 w-36 bg-[repeating-linear-gradient(90deg,#8F8FA3_0px,#8F8FA3_2px,transparent_2px,transparent_5px,#8F8FA3_5px,#8F8FA3_8px)] opacity-60" />
              <span className="font-mono text-[9px] text-[#8F8FA3]">
                SEC-PADDOCK-PASS
              </span>
            </div>

          </div>

          <div className="mt-4 text-center">
            <span className="text-xs font-['Chakra_Petch'] text-[#8F8FA3] flex items-center justify-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#00D26A] animate-pulse" />
              GARAGE TELEMETRY GATEWAY CONNECTED
            </span>
          </div>
        </div>

        {/* Right Side: Garage Entry Form */}
        <div className="lg:col-span-7 bg-[#161622] border-2 border-[#2C2C40] rounded-2xl p-8 shadow-2xl relative">
          
          {/* Header Switcher */}
          <div className="flex items-center justify-between border-b border-[#2B2B3E] pb-4 mb-6">
            <div className="flex items-center gap-2">
              <GiSteeringWheel className="text-2xl text-[#E10600]" />
              <h2 className="font-['Orbitron'] font-black text-xl text-white tracking-wider">
                {isRegister ? 'ROOKIE DRIVER REGISTRATION' : 'GARAGE ACCESS LOGIN'}
              </h2>
            </div>

            {/* Toggle Tabs */}
            <div className="flex bg-[#0D0D14] p-1 rounded-lg border border-[#252538]">
              <button
                type="button"
                onClick={() => {
                  setIsRegister(false);
                  setError('');
                }}
                className={`px-3 py-1 text-xs font-['Orbitron'] font-bold rounded transition-all ${
                  !isRegister
                    ? 'bg-[#E10600] text-white shadow-md'
                    : 'text-[#8F8FA3] hover:text-white'
                }`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsRegister(true);
                  setError('');
                }}
                className={`px-3 py-1 text-xs font-['Orbitron'] font-bold rounded transition-all ${
                  isRegister
                    ? 'bg-[#E10600] text-white shadow-md'
                    : 'text-[#8F8FA3] hover:text-white'
                }`}
              >
                Register
              </button>
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-6 p-3 rounded-xl bg-[#E10600]/15 border border-[#E10600] text-[#FF5A5A] text-xs font-['Chakra_Petch'] flex items-center gap-2">
              <FaExclamationCircle className="text-base flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Username / Call Sign */}
            <div>
              <label className="block text-xs font-['Orbitron'] font-bold text-white uppercase tracking-wider mb-1.5">
                Driver Call Sign (Username)
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. Verstappen, Hamilton, Norris"
                  className="w-full bg-[#0D0D15] border border-[#2F2F45] focus:border-[#E10600] rounded-xl py-3 px-4 pl-10 text-white font-['Titillium_Web'] text-sm focus:outline-none focus:ring-1 focus:ring-[#E10600] transition-colors placeholder:text-[#555566]"
                />
                <FaUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8F8FA3] text-sm" />
              </div>
            </div>

            {/* Email (Registration only) */}
            {isRegister && (
              <div>
                <label className="block text-xs font-['Orbitron'] font-bold text-white uppercase tracking-wider mb-1.5">
                  FIA Paddock Communications (Email)
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="driver@formula1.racing"
                    className="w-full bg-[#0D0D15] border border-[#2F2F45] focus:border-[#E10600] rounded-xl py-3 px-4 pl-10 text-white font-['Titillium_Web'] text-sm focus:outline-none focus:ring-1 focus:ring-[#E10600] transition-colors placeholder:text-[#555566]"
                  />
                  <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8F8FA3] text-sm" />
                </div>
              </div>
            )}

            {/* Team Selection & Car Number (Registration only) */}
            {isRegister && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-['Orbitron'] font-bold text-white uppercase tracking-wider mb-1.5">
                    Constructor Team
                  </label>
                  <select
                    value={selectedTeam}
                    onChange={(e) => setSelectedTeam(e.target.value)}
                    className="w-full bg-[#0D0D15] border border-[#2F2F45] focus:border-[#E10600] rounded-xl py-3 px-3 text-white font-['Titillium_Web'] text-sm focus:outline-none transition-colors"
                  >
                    {F1_TEAMS.map((team, idx) => (
                      <option key={idx} value={team.name} className="bg-[#12121A]">
                        {team.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-['Orbitron'] font-bold text-white uppercase tracking-wider mb-1.5">
                    Car #
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="99"
                    value={carNumber}
                    onChange={(e) => setCarNumber(e.target.value)}
                    className="w-full bg-[#0D0D15] border border-[#2F2F45] focus:border-[#E10600] rounded-xl py-3 px-3 text-white font-['Orbitron'] text-center text-sm focus:outline-none transition-colors"
                  />
                </div>
              </div>
            )}

            {/* Password */}
            <div>
              <label className="block text-xs font-['Orbitron'] font-bold text-white uppercase tracking-wider mb-1.5">
                Pit Radio Encryption Key (Password)
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#0D0D15] border border-[#2F2F45] focus:border-[#E10600] rounded-xl py-3 px-4 pl-10 text-white font-['Titillium_Web'] text-sm focus:outline-none focus:ring-1 focus:ring-[#E10600] transition-colors placeholder:text-[#555566]"
                />
                <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8F8FA3] text-sm" />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-f1 py-3.5 text-sm shadow-[0_0_20px_rgba(225,6,0,0.4)]"
              >
                {loading
                  ? 'COMMUNICATING WITH PIT WALL...'
                  : isRegister
                  ? 'ACTIVATE SUPER LICENCE // JOIN GRID'
                  : 'AUTHORIZE GARAGE ENTRY // DRIVE'}
              </button>
            </div>

          </form>

        </div>

      </div>
    </div>
  );
}
