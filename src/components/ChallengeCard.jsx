import React from 'react';
import { FaLock, FaCheckCircle, FaFlagCheckered, FaTools, FaWrench, FaTachometerAlt } from 'react-icons/fa';
import { GiCarWheel, GiStopwatch } from 'react-icons/gi';

export default function ChallengeCard({
  challenge,
  isLocked,
  onOpenModal,
}) {
  const {
    id,
    name,
    category,
    value,
    solved_by_me,
    solves,
    tireCompound = 'MEDIUM',
    order,
    sector = 'Sector 1',
    tags = [],
  } = challenge;

  // Compound badge color
  const getCompoundClass = (compound) => {
    switch (compound?.toUpperCase()) {
      case 'SOFT':
        return 'compound-soft';
      case 'MEDIUM':
        return 'compound-medium';
      case 'HARD':
        return 'compound-hard';
      case 'WET':
        return 'compound-wet';
      default:
        return 'compound-intermediate';
    }
  };

  return (
    <div
      className={`relative rounded-xl border transition-all duration-300 overflow-hidden flex flex-col justify-between ${
        isLocked
          ? 'bg-[#12121B]/90 border-[#252538] opacity-65 cursor-not-allowed'
          : solved_by_me
          ? 'bg-[#131B16] border-[#00D26A]/50 shadow-[0_0_20px_rgba(0,210,106,0.15)] hover:border-[#00D26A]'
          : 'bg-[#181826] border-[#2E2E44] hover:border-[#E10600] hover:shadow-[0_0_25px_rgba(225,6,0,0.3)] hover:-translate-y-1'
      }`}
    >
      {/* Carbon fiber top bar */}
      <div className="h-1.5 w-full bg-gradient-to-r from-transparent via-[#E10600] to-transparent opacity-80" />

      {/* Lock Overlay if locked */}
      {isLocked && (
        <div className="absolute inset-0 bg-[#0A0A10]/75 backdrop-blur-[2px] z-20 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-14 h-14 rounded-full bg-[#1F1F2E] border-2 border-[#E10600] flex items-center justify-center text-[#E10600] shadow-[0_0_20px_rgba(225,6,0,0.4)] mb-3 animate-pulse">
            <FaLock className="text-xl" />
          </div>
          <span className="font-['Orbitron'] font-black text-sm text-white tracking-wider uppercase">
            Pit Stop Locked
          </span>
          <p className="font-['Chakra_Petch'] text-xs text-[#8F8FA3] mt-1 max-w-[200px]">
            Clear previous sector challenge to unlock garage service!
          </p>
        </div>
      )}

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between z-10">
        
        {/* Top Header: Pit Stop Number & Compound */}
        <div>
          <div className="flex items-center justify-between gap-2 mb-3">
            {/* Category / Pit Stop Tag */}
            <div className="flex items-center gap-2">
              <span className="font-['Orbitron'] text-[11px] font-black uppercase tracking-wider text-[#E10600] bg-[#E10600]/10 border border-[#E10600]/30 px-2 py-0.5 rounded">
                STOP #{order || id}
              </span>
              <span className="font-['Chakra_Petch'] text-xs text-[#8F8FA3] font-semibold truncate max-w-[130px]">
                {sector}
              </span>
            </div>

            {/* Compound tyre & Value */}
            <div className="flex items-center gap-2">
              <div
                title={`Tyre Compound: ${tireCompound}`}
                className={`compound-badge ${getCompoundClass(tireCompound)}`}
              >
                {tireCompound[0]}
              </div>
              <div className="font-['Orbitron'] font-black text-sm text-[#FFD700] bg-[#FFD700]/10 border border-[#FFD700]/30 px-2.5 py-0.5 rounded">
                {value} <span className="text-[10px] text-white/70">PTS</span>
              </div>
            </div>
          </div>

          {/* Challenge Title */}
          <h3 className="font-['Orbitron'] font-bold text-lg text-white group-hover:text-[#E10600] transition-colors leading-snug mb-2">
            {name}
          </h3>

          {/* Challenge Category */}
          <p className="text-xs font-['Chakra_Petch'] text-[#A0A0B2] uppercase tracking-wider mb-4 flex items-center gap-1.5">
            <FaTools className="text-[#E10600] text-xs" />
            {category}
          </p>
        </div>

        {/* Tags and Telemetry info */}
        <div className="mt-2 pt-3 border-t border-white/5">
          <div className="flex flex-wrap gap-1.5 mb-4">
            {tags.map((tag, i) => (
              <span
                key={i}
                className="text-[10px] font-['JetBrains_Mono'] px-2 py-0.5 rounded bg-[#101018] text-[#8F8FA3] border border-[#252535]"
              >
                #{tag}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between text-xs font-['Chakra_Petch'] text-[#8F8FA3] mb-4">
            <span className="flex items-center gap-1.5">
              <GiStopwatch className="text-[#00D26A] text-sm" />
              {solves} Pit Solves
            </span>
            {solved_by_me && (
              <span className="flex items-center gap-1 text-[#00D26A] font-bold">
                <FaCheckCircle /> CHECKERED FLAG
              </span>
            )}
          </div>

          {/* Action Button */}
          {solved_by_me ? (
            <button
              onClick={() => onOpenModal(challenge)}
              className="w-full py-2.5 px-4 rounded font-['Orbitron'] text-xs font-bold uppercase tracking-wider bg-[#00D26A]/15 text-[#00D26A] border border-[#00D26A]/40 hover:bg-[#00D26A] hover:text-black transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(0,210,106,0.2)]"
            >
              <FaFlagCheckered />
              Sector Complete // Review
            </button>
          ) : (
            <button
              onClick={() => onOpenModal(challenge)}
              disabled={isLocked}
              className={`w-full py-2.5 px-4 rounded font-['Orbitron'] text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                isLocked
                  ? 'bg-[#1C1C28] text-white/30 border border-white/10 cursor-not-allowed'
                  : 'bg-[#E10600] text-white hover:bg-[#FF1A1A] hover:shadow-[0_0_20px_rgba(225,6,0,0.6)] cursor-pointer'
              }`}
            >
              <FaWrench />
              BOX, BOX // Enter Pit
            </button>
          )}
        </div>

      </div>

      {/* Decorative Curb Line at bottom */}
      <div className="h-1 w-full bg-gradient-to-r from-[#E10600] via-[#FFD700] to-transparent opacity-40" />
    </div>
  );
}
