import React, { useState, useEffect } from 'react';
import { ctfdApi } from '../services/ctfdApi';
import {
  GiTrophyCup,
  GiCheckeredFlag,
  GiSpeedometer,
  GiFullMotorcycleHelmet,
  GiStopwatch,
  GiLaurelsTrophy,
} from 'react-icons/gi';
import { FaSync, FaMedal, FaBroadcastTower } from 'react-icons/fa';

export default function ScoreboardPage() {
  const [standings, setStandings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [countdown, setCountdown] = useState(30);

  const fetchScoreboard = async () => {
    try {
      const data = await ctfdApi.getScoreboard();
      setStandings(data);
    } catch (err) {
      console.error('Failed to load scoreboard:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchScoreboard();

    // Auto-refresh interval (every 30 seconds)
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          fetchScoreboard();
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleManualRefresh = () => {
    setRefreshing(true);
    setCountdown(30);
    fetchScoreboard();
  };

  // Top 3 Podium Drivers
  const p1 = standings[0];
  const p2 = standings[1];
  const p3 = standings[2];

  return (
    <div className="min-h-[calc(100vh-85px)] carbon-fiber-bg py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header & Broadcast Timing Bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#2B2B3E] pb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-[#E10600] text-white text-[10px] font-['Orbitron'] font-black px-2 py-0.5 rounded tracking-widest uppercase">
                FIA OFFICIAL TIMING
              </span>
              <span className="text-xs font-['Chakra_Petch'] text-[#8F8FA3] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#00D26A] animate-ping" />
                TRANSPONDER TELEMETRY LIVE
              </span>
            </div>
            <h1 className="font-['Orbitron'] font-black text-3xl sm:text-4xl text-white tracking-wide uppercase">
              WORLD DRIVER <span className="text-[#E10600] glow-red-text">STANDINGS</span>
            </h1>
            <p className="font-['Chakra_Petch'] text-sm text-[#8F8FA3] mt-1">
              Live classification of drivers and constructors competing in the Monza Paddock Grand Prix.
            </p>
          </div>

          {/* Auto Refresh Ticker */}
          <div className="flex items-center gap-3 bg-[#111119] border border-[#262638] px-4 py-2 rounded-xl">
            <span className="text-xs font-['Chakra_Petch'] text-[#8F8FA3]">
              Next telemetry refresh: <strong className="text-white">{countdown}s</strong>
            </span>
            <button
              onClick={handleManualRefresh}
              title="Refresh Standings"
              className={`p-2 rounded-lg bg-[#202030] hover:bg-[#E10600] text-[#8F8FA3] hover:text-white transition-all ${
                refreshing ? 'animate-spin text-[#E10600]' : ''
              }`}
            >
              <FaSync className="text-xs" />
            </button>
          </div>
        </div>

        {/* Podium Section (P2, P1, P3) */}
        {!loading && standings.length >= 3 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end pt-4 max-w-4xl mx-auto">
            
            {/* P2 - Silver */}
            <div className="order-2 md:order-1 bg-gradient-to-t from-[#161622] to-[#1D1D2C] border-t-4 border-[#C0C0C0] border-x border-b border-[#2C2C3E] rounded-xl p-5 text-center shadow-xl transform md:translate-y-4">
              <div className="w-14 h-14 rounded-full bg-[#C0C0C0]/20 border-2 border-[#C0C0C0] mx-auto flex items-center justify-center text-[#C0C0C0] text-2xl mb-3 shadow-[0_0_15px_rgba(192,192,192,0.4)]">
                <FaMedal />
              </div>
              <span className="font-['Orbitron'] text-xs font-black text-[#C0C0C0] tracking-widest block">
                POSITION 02
              </span>
              <h3 className="font-['Orbitron'] font-bold text-lg text-white mt-1 truncate">
                {p2?.name}
              </h3>
              <p className="font-['Chakra_Petch'] text-xs text-[#8F8FA3] truncate mb-3">
                {p2?.team}
              </p>
              <div className="inline-block bg-[#0D0D14] px-4 py-1 rounded-lg border border-[#272738] font-['Orbitron'] font-black text-sm text-white">
                {p2?.score} <span className="text-[10px] text-[#8F8FA3]">PTS</span>
              </div>
            </div>

            {/* P1 - Gold (Winner) */}
            <div className="order-1 md:order-2 bg-gradient-to-t from-[#1F1B14] via-[#221C16] to-[#2B2317] border-t-4 border-[#FFD700] border-x border-b border-[#FFD700]/40 rounded-xl p-6 text-center shadow-[0_0_35px_rgba(255,215,0,0.25)] relative transform md:-translate-y-4">
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-[#FFD700] text-black font-['Orbitron'] font-black text-[10px] px-3 py-0.5 rounded-full shadow-lg tracking-widest uppercase">
                LEADER OF THE PACK
              </div>
              <div className="w-16 h-16 rounded-full bg-[#FFD700]/25 border-2 border-[#FFD700] mx-auto flex items-center justify-center text-[#FFD700] text-3xl mb-3 shadow-[0_0_20px_rgba(255,215,0,0.6)]">
                <GiTrophyCup />
              </div>
              <span className="font-['Orbitron'] text-xs font-black text-[#FFD700] tracking-widest block">
                POLE POSITION 01
              </span>
              <h2 className="font-['Orbitron'] font-black text-xl text-white mt-1 truncate glow-gold-text">
                {p1?.name}
              </h2>
              <p className="font-['Chakra_Petch'] text-xs text-[#FFD700]/80 truncate mb-4">
                {p1?.team}
              </p>
              <div className="inline-block bg-[#FFD700]/15 px-5 py-1.5 rounded-lg border border-[#FFD700]/40 font-['Orbitron'] font-black text-base text-[#FFD700]">
                {p1?.score} <span className="text-xs text-white/70">PTS</span>
              </div>
            </div>

            {/* P3 - Bronze */}
            <div className="order-3 md:order-3 bg-gradient-to-t from-[#161622] to-[#1D1D2C] border-t-4 border-[#CD7F32] border-x border-b border-[#2C2C3E] rounded-xl p-5 text-center shadow-xl transform md:translate-y-8">
              <div className="w-14 h-14 rounded-full bg-[#CD7F32]/20 border-2 border-[#CD7F32] mx-auto flex items-center justify-center text-[#CD7F32] text-2xl mb-3 shadow-[0_0_15px_rgba(205,127,50,0.4)]">
                <FaMedal />
              </div>
              <span className="font-['Orbitron'] text-xs font-black text-[#CD7F32] tracking-widest block">
                POSITION 03
              </span>
              <h3 className="font-['Orbitron'] font-bold text-lg text-white mt-1 truncate">
                {p3?.name}
              </h3>
              <p className="font-['Chakra_Petch'] text-xs text-[#8F8FA3] truncate mb-3">
                {p3?.team}
              </p>
              <div className="inline-block bg-[#0D0D14] px-4 py-1 rounded-lg border border-[#272738] font-['Orbitron'] font-black text-sm text-white">
                {p3?.score} <span className="text-[10px] text-[#8F8FA3]">PTS</span>
              </div>
            </div>

          </div>
        )}

        {/* F1 TV Broadcast Timing Tower Table */}
        <div className="timing-tower shadow-2xl">
          
          {/* Header Row */}
          <div className="timing-row timing-header">
            <div>POS</div>
            <div>NO</div>
            <div>DRIVER & CONSTRUCTOR</div>
            <div>CHAMPIONSHIP PTS</div>
            <div className="timing-hide-mobile">SOLVES</div>
            <div className="timing-hide-mobile">INTERVAL</div>
          </div>

          {/* Table Data Rows */}
          {loading ? (
            <div className="py-20 text-center">
              <GiSpeedometer className="text-4xl text-[#E10600] animate-spin mx-auto mb-3" />
              <span className="font-['Orbitron'] text-xs text-[#8F8FA3] tracking-widest uppercase">
                CALIBRATING TRANSPONDER SECTORS...
              </span>
            </div>
          ) : standings.length === 0 ? (
            <div className="py-16 text-center text-[#8F8FA3] font-['Chakra_Petch']">
              No telemetry classifications registered yet.
            </div>
          ) : (
            standings.map((driver) => {
              const isLeader = driver.pos === 1;
              const isTop3 = driver.pos <= 3;

              return (
                <div
                  key={driver.id || driver.pos}
                  className={`timing-row ${isLeader ? 'leader' : ''}`}
                >
                  {/* Position Pill */}
                  <div className="flex items-center">
                    <span
                      className={`font-['Orbitron'] font-black text-sm px-2 py-0.5 rounded ${
                        driver.pos === 1
                          ? 'bg-[#FFD700] text-black shadow-[0_0_10px_rgba(255,215,0,0.8)]'
                          : driver.pos === 2
                          ? 'bg-[#C0C0C0] text-black'
                          : driver.pos === 3
                          ? 'bg-[#CD7F32] text-black'
                          : 'text-[#8F8FA3]'
                      }`}
                    >
                      P{driver.pos}
                    </span>
                  </div>

                  {/* Car Number with Livery Color Accent */}
                  <div className="flex items-center gap-2">
                    <div
                      style={{ backgroundColor: driver.liveryColor || '#E10600' }}
                      className="w-1.5 h-6 rounded-full"
                    />
                    <span className="font-['Orbitron'] font-bold text-sm text-white">
                      {driver.carNumber || driver.pos}
                    </span>
                  </div>

                  {/* Driver Name & Constructor */}
                  <div className="flex flex-col pr-4">
                    <div className="flex items-center gap-2">
                      <span className="font-['Orbitron'] font-bold text-sm sm:text-base text-white tracking-wide truncate">
                        {driver.name}
                      </span>
                      {driver.fastestLap && (
                        <span
                          title="DHL Fastest Lap"
                          className="sector-badge sector-purple text-[10px]"
                        >
                          FASTEST LAP
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-['Chakra_Petch'] text-[#8F8FA3] truncate">
                      {driver.team}
                    </span>
                  </div>

                  {/* Points */}
                  <div>
                    <span className="font-['Orbitron'] font-black text-sm sm:text-base text-[#FFD700]">
                      {driver.score}
                    </span>
                    <span className="text-[11px] font-['Chakra_Petch'] text-[#8F8FA3] ml-1">
                      PTS
                    </span>
                  </div>

                  {/* Pit Solves */}
                  <div className="timing-hide-mobile font-['Chakra_Petch'] text-sm text-white">
                    <span className="bg-[#1C1C2A] px-2.5 py-1 rounded border border-[#2D2D42]">
                      {driver.solves || 0} Solves
                    </span>
                  </div>

                  {/* Interval / Gap */}
                  <div className="timing-hide-mobile font-['JetBrains_Mono'] text-xs font-bold">
                    <span
                      className={
                        isLeader ? 'text-[#00D26A]' : 'text-[#8F8FA3]'
                      }
                    >
                      {driver.gap || (isLeader ? 'LEADER' : '-')}
                    </span>
                  </div>
                </div>
              );
            })
          )}

        </div>

      </div>
    </div>
  );
}
