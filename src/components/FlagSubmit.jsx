import React, { useState } from 'react';
import { ctfdApi } from '../services/ctfdApi';
import confetti from 'canvas-confetti';
import {
  FaTimes,
  FaFlag,
  FaCheckCircle,
  FaExclamationTriangle,
  FaBroadcastTower,
  FaFileDownload,
  FaLightbulb,
} from 'react-icons/fa';
import { GiSpeedometer, GiTrophyCup } from 'react-icons/gi';

export default function FlagSubmit({ challenge, onClose, onSolveSuccess }) {
  const [flag, setFlag] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  if (!challenge) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!flag.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await ctfdApi.submitFlag(challenge.id, flag);
      setResult(res);

      if (res.status === 'correct') {
        // Trigger F1 victory confetti
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#E10600', '#FFD700', '#FFFFFF', '#00D26A'],
        });

        if (onSolveSuccess) {
          onSolveSuccess(challenge.id);
        }
      }
    } catch (err) {
      setResult({
        success: false,
        status: 'error',
        message: 'Telemetry network error: Race Control connection lost.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      {/* Modal Dialog Styled as F1 Pit Wall Telemetry Station */}
      <div className="relative w-full max-w-2xl bg-[#14141F] border-2 border-[#2E2E44] rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col">
        
        {/* Top Header Gantry */}
        <div className="bg-[#0D0D14] p-4 px-6 border-b border-[#2A2A3D] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#E10600] flex items-center justify-center text-white shadow-[0_0_15px_rgba(225,6,0,0.5)]">
              <GiSpeedometer className="text-xl" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-['Orbitron'] text-xs font-black uppercase text-[#E10600] tracking-wider">
                  Pit Stop #{challenge.order || challenge.id}
                </span>
                <span className="text-xs text-[#8F8FA3] font-['Chakra_Petch']">
                  // {challenge.sector || 'Main Straight'}
                </span>
              </div>
              <h2 className="font-['Orbitron'] font-black text-xl text-white tracking-wide">
                {challenge.name}
              </h2>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="p-2 text-[#8F8FA3] hover:text-white hover:bg-[#252538] rounded-lg transition-colors"
          >
            <FaTimes className="text-lg" />
          </button>
        </div>

        {/* Curb Accent line */}
        <div className="curb-strip" />

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto max-h-[70vh] space-y-6">
          
          {/* Status Badges */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-['Orbitron'] text-xs font-black px-3 py-1 bg-[#FFD700]/15 text-[#FFD700] border border-[#FFD700]/30 rounded-md">
              VALUE: {challenge.value} PTS
            </span>
            <span className="font-['Chakra_Petch'] text-xs font-bold px-3 py-1 bg-[#1C1C2A] text-white border border-[#2E2E42] rounded-md">
              COMPOUND: {challenge.tireCompound || 'MEDIUM'}
            </span>
            <span className="font-['Chakra_Petch'] text-xs font-bold px-3 py-1 bg-[#1C1C2A] text-[#00D26A] border border-[#00D26A]/30 rounded-md">
              SOLVES: {challenge.solves || 0}
            </span>
          </div>

          {/* Mission Briefing / Challenge Description */}
          <div className="bg-[#0F0F17] border border-[#252538] rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3 text-xs font-['Orbitron'] text-[#8F8FA3] uppercase tracking-wider">
              <FaBroadcastTower className="text-[#E10600]" />
              Telemetry Briefing
            </div>
            <div className="font-['Titillium_Web'] text-sm text-[#D8D8E6] leading-relaxed whitespace-pre-wrap font-mono">
              {challenge.description || 'Analyze race telemetry and submit the flag sequence.'}
            </div>
          </div>

          {/* Files / Attachments if any */}
          {challenge.files && challenge.files.length > 0 && (
            <div className="bg-[#12121E] border border-[#2A2A3E] rounded-xl p-4">
              <span className="font-['Orbitron'] text-xs font-bold text-white mb-2 block uppercase tracking-wider">
                Telemetry Log Files
              </span>
              <div className="flex flex-col gap-2">
                {challenge.files.map((file, idx) => (
                  <a
                    key={idx}
                    href={file}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-xs font-mono text-[#00E5FF] hover:underline"
                  >
                    <FaFileDownload />
                    {file.split('/').pop()}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Submission Form */}
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <label className="block text-xs font-['Orbitron'] font-bold text-white uppercase tracking-wider">
              Pit Wall Flag Transponder
            </label>

            <div className="relative">
              <input
                type="text"
                value={flag}
                onChange={(e) => setFlag(e.target.value)}
                placeholder="F1{telemetry_secret_flag}"
                disabled={challenge.solved_by_me || loading}
                className="w-full bg-[#0A0A10] border-2 border-[#2E2E44] focus:border-[#E10600] rounded-xl py-3 px-4 text-white font-['JetBrains_Mono'] text-sm tracking-wide focus:outline-none focus:ring-2 focus:ring-[#E10600]/30 transition-all placeholder:text-[#555566]"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8F8FA3]">
                <FaFlag />
              </div>
            </div>

            {/* Radio Feedback Message */}
            {result && (
              <div
                className={`p-3.5 rounded-xl border flex items-center gap-3 font-['Chakra_Petch'] text-sm ${
                  result.status === 'correct'
                    ? 'bg-[#00D26A]/10 border-[#00D26A] text-[#00D26A]'
                    : 'bg-[#E10600]/10 border-[#E10600] text-[#FF5A5A]'
                }`}
              >
                {result.status === 'correct' ? (
                  <FaCheckCircle className="text-lg flex-shrink-0" />
                ) : (
                  <FaExclamationTriangle className="text-lg flex-shrink-0" />
                )}
                <div className="flex-1">
                  <span className="font-bold">
                    {result.status === 'correct' ? 'PIT STOP SUCCESS: ' : 'YELLOW FLAG: '}
                  </span>
                  {result.message}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="btn-f1-outline text-xs"
              >
                Exit Garage
              </button>

              <button
                type="submit"
                disabled={loading || !flag.trim()}
                className={`btn-f1 text-xs ${
                  loading ? 'opacity-70 cursor-wait' : ''
                }`}
              >
                {loading ? 'Transmitting...' : 'Transmit Telemetry Flag'}
              </button>
            </div>
          </form>

        </div>

        {/* Footer Carbon Detail */}
        <div className="bg-[#0D0D14] p-3 px-6 border-t border-[#252538] flex items-center justify-between text-[11px] font-['Chakra_Petch'] text-[#8F8FA3]">
          <span>FIA REGULATION: STRICT TIMING ENFORCED</span>
          <span>BOX BOX BOX</span>
        </div>

      </div>
    </div>
  );
}
