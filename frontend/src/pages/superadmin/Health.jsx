import React, { useState } from 'react';
import { 
  Activity, Server, Database, HardDrive, Cpu, 
  CheckCircle2, AlertCircle, RefreshCw, Radio, Shield, Terminal
} from 'lucide-react';

export const SystemHealthTab = () => {
  const [isPinging, setIsPinging] = useState(false);

  const logs = [
    { timestamp: '16:42:10', level: 'INFO', service: 'AUTH-SVC', message: 'JWT token issued for user-super-1 (SUPER_ADMIN)' },
    { timestamp: '16:40:02', level: 'INFO', service: 'PAYMENT-GATEWAY', message: 'Stripe webhook received: payment_intent.succeeded (₹1,499.00)' },
    { timestamp: '16:38:45', level: 'INFO', service: 'TENANT-ROUTER', message: 'Tenant domain resolution apextech.edu -> tenant-inst-1' },
    { timestamp: '16:35:12', level: 'INFO', service: 'VIDEO-CDN', message: 'HLS stream buffer generated for lesson les-1' },
    { timestamp: '16:30:00', level: 'HEALTH', service: 'CRON-MONITOR', message: 'Database connection pool healthy. Active: 2, Idle: 8' }
  ];

  const handlePing = () => {
    setIsPinging(true);
    setTimeout(() => {
      setIsPinging(false);
      alert('All cluster services responded in 14ms! Status: Optimal.');
    }, 800);
  };

  return (
    <div className="space-y-6">
      
      {}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">System Infrastructure & Health</h2>
            <span className="px-2.5 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold rounded-full flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> 99.99% Operational
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Realtime server telemetry, MySQL connection pool, Redis cache hit rates, video streaming CDNs, and audit trail.
          </p>
        </div>

        <button 
          onClick={handlePing}
          disabled={isPinging}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-indigo-500/25 flex items-center gap-2 transition-all self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isPinging ? 'animate-spin' : ''}`} />
          Run Health Diagnostics
        </button>
      </div>

      {}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Server className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Normal
            </span>
          </div>
          <div>
            <span className="text-xs text-slate-400 font-bold uppercase">Node.js REST API</span>
            <div className="text-2xl font-black text-slate-900 mt-0.5">14 ms</div>
            <p className="text-[10px] text-slate-500 mt-1">Average response latency</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Connected
            </span>
          </div>
          <div>
            <span className="text-xs text-slate-400 font-bold uppercase">MySQL Connection Pool</span>
            <div className="text-2xl font-black text-slate-900 mt-0.5">2 / 10 Active</div>
            <p className="text-[10px] text-slate-500 mt-1">Max capacity 10 connections</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <HardDrive className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Optimal
            </span>
          </div>
          <div>
            <span className="text-xs text-slate-400 font-bold uppercase">CloudFront Video CDN</span>
            <div className="text-2xl font-black text-slate-900 mt-0.5">99.4% Hit</div>
            <p className="text-[10px] text-slate-500 mt-1">Edge cache efficiency</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Secure
            </span>
          </div>
          <div>
            <span className="text-xs text-slate-400 font-bold uppercase">WAF & DDoS Shield</span>
            <div className="text-2xl font-black text-slate-900 mt-0.5">0 Threats</div>
            <p className="text-[10px] text-slate-500 mt-1">Zero malicious requests detected</p>
          </div>
        </div>

      </div>

      {}
      <div className="bg-slate-950 rounded-3xl p-6 border border-slate-800 text-slate-300 font-mono text-xs shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-white">Live Platform Audit Logs</span>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-slate-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Streaming</span>
          </div>
        </div>

        <div className="space-y-2 max-h-60 overflow-y-auto">
          {logs.map((l, idx) => (
            <div key={idx} className="flex items-start gap-3 text-[11px] py-1 border-b border-slate-900/60">
              <span className="text-slate-500">{l.timestamp}</span>
              <span className={`font-bold px-1.5 py-0.2 rounded text-[9px] ${
                l.level === 'HEALTH' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'
              }`}>
                {l.level}
              </span>
              <span className="text-indigo-400 font-semibold">{l.service}:</span>
              <span className="text-slate-300 flex-1">{l.message}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
