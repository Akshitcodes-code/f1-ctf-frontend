import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  GiFullMotorcycleHelmet,
  GiCheckeredFlag,
  GiSpeedometer,
  GiTrophyCup,
  GiRaceCar,
  GiCarWheel,
} from 'react-icons/gi';
import { FaPlay, FaRedo, FaLock, FaTerminal, FaShieldAlt } from 'react-icons/fa';

export default function LandingPage() {
  const [lightsCount, setLightsCount] = useState(0);
  const [isRaceStarted, setIsRaceStarted] = useState(false);
  const [isStartingSequence, setIsStartingSequence] = useState(false);

  // F1 5-Red-Lights Race Start Sequence Simulation
  const startLightsSequence = () => {
    setIsStartingSequence(true);
    setIsRaceStarted(false);
    setLightsCount(0);

    // Light up 1 by 1
    const timeouts = [];
    for (let i = 1; i <= 5; i++) {
      timeouts.push(
        setTimeout(() => {
          setLightsCount(i);
        }, i * 900)
      );
    }

    // Random pause between 1.5s to 3s after 5 lights, then LIGHTS OUT
    const randomPause = 4500 + Math.floor(Math.random() * 1200);
    timeouts.push(
      setTimeout(() => {
        setLightsCount(0);
        setIsRaceStarted(true);
        setIsStartingSequence(false);
      }, randomPause)
    );
  };

  useEffect(() => {
    startLightsSequence();
  }, []);

  return (
    <div className="relative min-h-[calc(100vh-85px)] carbon-fiber-bg overflow-hidden flex flex-col justify-between">
      
      {/* Background Speed Lines Overlay */}
      <div className="absolute inset-0 speed-lines opacity-70 pointer-events-none" />

      {/* Hero Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 flex-1 flex flex-col items-center justify-center text-center">
        
        {/* Race Start Lights Gantry */}
        <div className="mb-10 flex flex-col items-center">
          <div className="starting-lights-container">
            {[1, 2, 3, 4, 5].map((gantryIndex) => (
              <div key={gantryIndex} className="f1-light-gantry">
                <div
                  className={`f1-light-bulb ${
                    lightsCount >= gantryIndex ? 'active' : ''
                  }`}
                />
                <div
                  className={`f1-light-bulb ${
                    lightsCount >= gantryIndex ? 'active' : ''
                  }`}
                />
              </div>
            ))}
          </div>

          {/* Race Status Radio Transmission */}
          <div className="mt-4 flex items-center gap-3">
            {isStartingSequence ? (
              <span className="font-['Orbitron'] text-xs font-bold tracking-widest text-[#FFB800] uppercase animate-pulse">
                GRID FORMATION // REVS CLIMBING // LIGHTS SEQUENCE ACTIVE...
              </span>
            ) : isRaceStarted ? (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex items-center gap-2 bg-[#E10600]/20 border border-[#E10600] px-4 py-1.5 rounded-full"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-[#00D26A] animate-ping" />
                <span className="font-['Orbitron'] text-sm sm:text-base font-black tracking-widest text-white uppercase glow-red-text">
                  LIGHTS OUT AND AWAY WE GO!
                </span>
              </motion.div>
            ) : (
              <span className="font-['Orbitron'] text-xs text-[#8F8FA3] uppercase tracking-wider">
                STANDBY ON GRID
              </span>
            )}

            <button
              onClick={startLightsSequence}
              title="Restart Lights Sequence"
              className="p-1.5 rounded-full bg-[#252538] hover:bg-[#E10600] text-[#8F8FA3] hover:text-white transition-all text-xs"
            >
              <FaRedo />
            </button>
          </div>
        </div>

        {/* Hero Title and Typography */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#E10600]/15 border border-[#E10600]/40 text-[#E10600] font-['Orbitron'] text-xs font-bold uppercase tracking-widest mb-4">
            <GiRaceCar className="text-base" />
            Interactive Hackathon Escape Room Challenge
          </div>

          <h1 className="font-['Orbitron'] font-black text-4xl sm:text-6xl md:text-7xl text-white tracking-tight uppercase leading-none mb-6">
            CODE RED: <span className="text-[#E10600] glow-red-text">PIT LANE LOCKDOWN</span>
          </h1>

          <p className="font-['Titillium_Web'] text-base sm:text-xl text-[#A5A5BC] max-w-3xl mx-auto leading-relaxed mb-8">
            During Lap 45 of the Grand Prix, the lead race team's pit wall terminal and telemetry feed were struck by a cyber-attack. The driver's communications are bricked and the automatic pit-release command is disabled. The car is forced to box in <strong>30 minutes</strong>! Clear 3 diagnostic checkpoints, gather 5 tokens, and inject the <strong>Master Serial Passkey</strong>.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/challenges"
              className="btn-f1 text-base px-8 py-3.5 shadow-[0_0_30px_rgba(225,6,0,0.5)] group"
            >
              <GiCarWheel className="text-xl group-hover:rotate-180 transition-transform duration-500" />
              <span>Enter Pit Lane</span>
            </Link>

            <Link
              to="/scoreboard"
              className="btn-f1-outline text-base px-8 py-3.5 group"
            >
              <GiTrophyCup className="text-xl text-[#FFD700] group-hover:scale-110 transition-transform" />
              <span>Race Standings</span>
            </Link>
          </div>
        </motion.div>

        {/* Escape Room 3-Pillar Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 w-full max-w-5xl text-left">
          
          <div className="bg-[#171724]/90 border border-[#2B2B3E] rounded-xl p-6 relative overflow-hidden group hover:border-[#E10600] transition-colors">
            <div className="w-12 h-12 rounded-lg bg-[#E10600]/15 border border-[#E10600]/30 text-[#E10600] flex items-center justify-center text-xl mb-4 group-hover:bg-[#E10600] group-hover:text-white transition-all">
              <FaLock />
            </div>
            <h3 className="font-['Orbitron'] font-bold text-lg text-white mb-2">
              Sequential Pit Stops
            </h3>
            <p className="font-['Chakra_Petch'] text-sm text-[#8F8FA3] leading-relaxed">
              True escape room mechanic. Each sector unlocks only after clearing the previous telemetry pit stop challenge.
            </p>
          </div>

          <div className="bg-[#171724]/90 border border-[#2B2B3E] rounded-xl p-6 relative overflow-hidden group hover:border-[#00D26A] transition-colors">
            <div className="w-12 h-12 rounded-lg bg-[#00D26A]/15 border border-[#00D26A]/30 text-[#00D26A] flex items-center justify-center text-xl mb-4 group-hover:bg-[#00D26A] group-hover:text-black transition-all">
              <GiSpeedometer />
            </div>
            <h3 className="font-['Orbitron'] font-bold text-lg text-white mb-2">
              Live Timing Tower
            </h3>
            <p className="font-['Chakra_Petch'] text-sm text-[#8F8FA3] leading-relaxed">
              Modeled after the official Formula 1 broadcast timing graphics with sector deltas, lap gaps, and fastest laps.
            </p>
          </div>

          <div className="bg-[#171724]/90 border border-[#2B2B3E] rounded-xl p-6 relative overflow-hidden group hover:border-[#FFD700] transition-colors">
            <div className="w-12 h-12 rounded-lg bg-[#FFD700]/15 border border-[#FFD700]/30 text-[#FFD700] flex items-center justify-center text-xl mb-4 group-hover:bg-[#FFD700] group-hover:text-black transition-all">
              <GiCheckeredFlag />
            </div>
            <h3 className="font-['Orbitron'] font-bold text-lg text-white mb-2">
              Podium Finish
            </h3>
            <p className="font-['Chakra_Petch'] text-sm text-[#8F8FA3] leading-relaxed">
              Reach the final chequered flag transponder to escape the circuit and claim the World Driver Championship trophy.
            </p>
          </div>

        </div>

      </div>

      {/* Bottom Track Telemetry Bar */}
      <div className="relative z-10 bg-[#0B0B11] border-t border-[#202030] py-3 px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between text-xs font-['Chakra_Petch'] text-[#8F8FA3] gap-4">
          <div className="flex items-center gap-6">
            <span>CIRCUIT: AUTODROMO NAZIONALE MONZA</span>
            <span className="hidden sm:inline">CIRCUIT LENGTH: 5.793 KM</span>
            <span className="hidden md:inline">PIT STOPS: 6 SECTORS</span>
          </div>

          <div className="flex items-center gap-4 text-white">
            <span>TRACK TEMP: <strong className="text-[#FFB800]">42.8°C</strong></span>
            <span>AIR TEMP: <strong className="text-[#00E5FF]">28.4°C</strong></span>
            <span className="text-[#00D26A] font-bold">DRS DETECT 1: ACTIVE</span>
          </div>
        </div>
      </div>

    </div>
  );
}
