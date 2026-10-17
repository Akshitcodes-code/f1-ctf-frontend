import React, { useState, useEffect } from 'react';
import { ctfdApi } from '../services/ctfdApi';
import ChallengeCard from '../components/ChallengeCard';
import FlagSubmit from '../components/FlagSubmit';
import {
  GiCarWheel,
  GiCheckeredFlag,
  GiSpeedometer,
  GiWrench,
  GiRadioTower,
} from 'react-icons/gi';
import { FaLock, FaLockOpen, FaFilter, FaSync } from 'react-icons/fa';

export default function ChallengePage() {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [filterCompound, setFilterCompound] = useState('ALL');
  const [refreshing, setRefreshing] = useState(false);

  const fetchChallenges = async () => {
    try {
      const data = await ctfdApi.getChallenges();
      // Ensure sorted by order or id for sequential escape room flow
      data.sort((a, b) => (a.order || a.id) - (b.order || b.id));
      setChallenges(data);
    } catch (err) {
      console.error('Failed to load challenges:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchChallenges();
  }, []);

  const handleManualRefresh = () => {
    setRefreshing(true);
    fetchChallenges();
  };

  const handleSolveSuccess = async (challengeId) => {
    // Re-fetch challenges to unlock next sequential pit stop
    await fetchChallenges();
  };

  // Sequential Unlock Mechanic:
  // Challenge at index i is unlocked IF:
  // i === 0 (first pit stop is always unlocked)
  // OR the previous challenge (index i - 1) is solved!
  const isChallengeLocked = (index) => {
    if (index === 0) return false;
    const previousChallenge = challenges[index - 1];
    return !previousChallenge?.solved_by_me;
  };

  // Calculations
  const solvedCount = challenges.filter((c) => c.solved_by_me).length;
  const totalPoints = challenges.reduce(
    (sum, c) => (c.solved_by_me ? sum + c.value : sum),
    0
  );
  const maxPossiblePoints = challenges.reduce((sum, c) => sum + c.value, 0);
  const progressPercent = challenges.length
    ? Math.round((solvedCount / challenges.length) * 100)
    : 0;

  // Filter
  const filteredChallenges = challenges.filter((c) => {
    if (filterCompound === 'ALL') return true;
    return c.tireCompound?.toUpperCase() === filterCompound;
  });

  return (
    <div className="min-h-[calc(100vh-85px)] carbon-fiber-bg py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Pit Lane Header */}
        <div className="bg-[#14141F] border border-[#27273A] rounded-2xl p-6 shadow-2xl relative overflow-hidden">
          
          <div className="curb-strip absolute top-0 inset-x-0" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-2">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-['Orbitron'] text-xs font-black text-[#E10600] uppercase tracking-widest bg-[#E10600]/15 px-2.5 py-0.5 rounded">
                  MONZA PIT LANE
                </span>
                <span className="font-['Chakra_Petch'] text-xs text-[#8F8FA3]">
                  ESCAPE ROOM PROGRESSION
                </span>
              </div>
              <h1 className="font-['Orbitron'] font-black text-2xl sm:text-3xl text-white tracking-wide">
                CIRCUIT PIT STOPS // SECTORS
              </h1>
              <p className="font-['Titillium_Web'] text-sm text-[#A0A0B5] mt-1 max-w-xl">
                Clear each telemetry obstacle in sequence. Once the pit crew services your vehicle at each stop, the track marshals will green-flag the next sector!
              </p>
            </div>

            {/* Quick Stats Banner */}
            <div className="flex items-center gap-4 bg-[#0D0D14] p-4 rounded-xl border border-[#222233]">
              <div className="text-center px-3 border-r border-[#252538]">
                <span className="text-[10px] font-['Chakra_Petch'] text-[#8F8FA3] uppercase block">
                  SECTORS CLEARED
                </span>
                <span className="font-['Orbitron'] font-black text-xl text-white">
                  {solvedCount} / {challenges.length}
                </span>
              </div>

              <div className="text-center px-3">
                <span className="text-[10px] font-['Chakra_Petch'] text-[#8F8FA3] uppercase block">
                  POINTS ACCUMULATED
                </span>
                <span className="font-['Orbitron'] font-black text-xl text-[#FFD700]">
                  {totalPoints} <span className="text-xs text-white/60">PTS</span>
                </span>
              </div>

              <button
                onClick={handleManualRefresh}
                title="Refresh Telemetry"
                className={`p-2.5 rounded-lg bg-[#1E1E2C] hover:bg-[#E10600] text-[#8F8FA3] hover:text-white transition-all border border-[#2B2B3E] ${
                  refreshing ? 'animate-spin text-[#E10600]' : ''
                }`}
              >
                <FaSync />
              </button>
            </div>
          </div>

          {/* Sequential Escape Room Visual Track Bar */}
          <div className="mt-6 pt-4 border-t border-[#222233]">
            <div className="flex items-center justify-between text-xs font-['Orbitron'] text-[#8F8FA3] mb-2">
              <span className="flex items-center gap-2">
                <GiSpeedometer className="text-[#00D26A] text-sm" />
                TELEMETRY RECOVERY PROGRESS
              </span>
              <span className="text-[#00D26A] font-bold">{progressPercent}% RECOVERED</span>
            </div>

            <div className="relative w-full h-3 bg-[#0B0B10] rounded-full overflow-hidden border border-[#222235]">
              <div
                style={{ width: `${progressPercent}%` }}
                className="h-full bg-gradient-to-r from-[#E10600] via-[#FFD700] to-[#00D26A] shadow-[0_0_15px_rgba(225,6,0,0.8)] transition-all duration-700"
              />
            </div>

            {/* Diagnostic Tokens Rack (Escape Room Tokens) */}
            <div className="mt-6 p-4 rounded-xl bg-[#0B0B12] border border-[#232338]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#E10600] animate-ping" />
                  <span className="font-['Orbitron'] text-xs font-bold text-white uppercase tracking-wider">
                    OFFICIAL DIAGNOSTIC TOKEN RACK
                  </span>
                </div>
                <span className="font-['Chakra_Petch'] text-xs text-[#8F8FA3]">
                  Formula: <strong className="text-[#00D26A]">T1 + T4 + T3 + T5 + T2</strong>
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {[
                  { id: 1, label: 'TOKEN 1 (Word)', tag: 'RSS', desc: 'Hex Frequency' },
                  { id: 2, label: 'TOKEN 2 (Trivia)', tag: '161', desc: 'Ferrari+Max #' },
                  { id: 3, label: 'TOKEN 3 (Line #)', tag: '7', desc: 'Python Bug' },
                  { id: 4, label: 'TOKEN 4 (Error)', tag: 'SYN', desc: 'Error Tag' },
                  { id: 5, label: 'TOKEN 5 (Spec)', tag: 'SF', desc: 'Chassis Code' },
                ].map((token, idx) => {
                  const challengeMatch = challenges[idx];
                  const isSolved = challengeMatch?.solved_by_me;
                  return (
                    <div
                      key={token.id}
                      className={`p-3 rounded-lg border text-center transition-all ${
                        isSolved
                          ? 'bg-[#00D26A]/10 border-[#00D26A]/60 shadow-[0_0_15px_rgba(0,210,106,0.3)]'
                          : 'bg-[#12121A] border-[#252538]'
                      }`}
                    >
                      <span className="text-[10px] font-['Chakra_Petch'] text-[#8F8FA3] block">
                        {token.label}
                      </span>
                      <div className="font-['Orbitron'] font-black text-lg my-1">
                        {isSolved ? (
                          <span className="text-[#00D26A] tracking-wider">{token.tag}</span>
                        ) : (
                          <span className="text-white/20 tracking-widest">---</span>
                        )}
                      </div>
                      <span className="text-[9px] font-['Chakra_Petch'] text-[#6A6A80] block">
                        {isSolved ? 'LOCKED & SYNCED' : token.desc}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Stepper Dots */}
            <div className="flex justify-between items-center mt-4 px-1">
              {challenges.map((c, idx) => {
                const locked = isChallengeLocked(idx);
                const solved = c.solved_by_me;
                return (
                  <div
                    key={c.id}
                    onClick={() => !locked && setSelectedChallenge(c)}
                    className={`flex flex-col items-center cursor-pointer transition-all ${
                      locked ? 'opacity-40 cursor-not-allowed' : 'hover:scale-110'
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center font-['Orbitron'] text-xs font-bold border-2 transition-all ${
                        solved
                          ? 'bg-[#00D26A] text-black border-[#79FFA8] shadow-[0_0_12px_rgba(0,210,106,0.6)]'
                          : locked
                          ? 'bg-[#181824] text-white/40 border-[#2A2A3C]'
                          : 'bg-[#E10600] text-white border-white shadow-[0_0_12px_rgba(225,6,0,0.6)] animate-pulse'
                      }`}
                    >
                      {solved ? '✓' : idx + 1}
                    </div>
                    <span className="hidden sm:inline text-[10px] font-['Chakra_Petch'] mt-1 text-[#8F8FA3]">
                      {idx === 5 ? 'Master Hash' : `Round ${Math.floor(idx/2)+1}`}
                    </span>
                  </div>
                );
              })}
            </div>

          </div>

        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <FaFilter className="text-[#E10600] text-xs" />
            <span className="text-xs font-['Orbitron'] font-bold text-white uppercase tracking-wider">
              Tire Compounds:
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {['ALL', 'SOFT', 'MEDIUM', 'HARD', 'WET'].map((compound) => (
              <button
                key={compound}
                onClick={() => setFilterCompound(compound)}
                className={`px-3 py-1 rounded text-xs font-['Orbitron'] font-bold tracking-wider transition-all border ${
                  filterCompound === compound
                    ? 'bg-[#E10600] text-white border-[#E10600] shadow-[0_0_10px_rgba(225,6,0,0.5)]'
                    : 'bg-[#141420] text-[#8F8FA3] border-[#29293B] hover:text-white hover:border-[#404058]'
                }`}
              >
                {compound}
              </button>
            ))}
          </div>
        </div>

        {/* Pit Stop Challenge Grid */}
        {loading ? (
          <div className="py-24 text-center">
            <GiCarWheel className="text-5xl text-[#E10600] animate-spin mx-auto mb-4" />
            <span className="font-['Orbitron'] text-sm text-[#8F8FA3] tracking-widest uppercase">
              TUNING PIT WALL SENSORS...
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredChallenges.map((challenge) => {
              // Locate real index in full array to enforce sequential locking
              const originalIndex = challenges.findIndex((c) => c.id === challenge.id);
              const locked = isChallengeLocked(originalIndex);

              return (
                <ChallengeCard
                  key={challenge.id}
                  challenge={challenge}
                  isLocked={locked}
                  onOpenModal={(c) => setSelectedChallenge(c)}
                />
              );
            })}
          </div>
        )}

      </div>

      {/* Flag Submit Modal */}
      {selectedChallenge && (
        <FlagSubmit
          challenge={selectedChallenge}
          onClose={() => setSelectedChallenge(null)}
          onSolveSuccess={handleSolveSuccess}
        />
      )}
    </div>
  );
}
