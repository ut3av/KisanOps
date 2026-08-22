import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Tractor, Clock, MapPin, ChevronRight, CheckCircle2, Droplet, UserCircle2 } from 'lucide-react';

export const OperatorDashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Header Profile */}
      <div className="bg-slate-900 text-white p-6 rounded-b-3xl shadow-xl">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 bg-slate-700 rounded-full flex items-center justify-center border-2 border-emerald-500">
            <UserCircle2 className="w-8 h-8 text-slate-300" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Raju Operator</h1>
            <p className="text-emerald-400 text-sm font-semibold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></span>
              Online • Assigned Machine
            </p>
          </div>
        </div>

        <div className="bg-slate-800 rounded-2xl p-4 border border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-900/50 p-2 rounded-lg">
              <Tractor className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-200">Mahindra 575 DI</div>
              <div className="text-xs text-slate-400 font-mono">ID: MH-575-BPL</div>
            </div>
          </div>
        </div>
      </div>

      <main className="p-4 flex flex-col gap-6 -mt-4">
        {/* Today's Summary */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 text-center">
            <Clock className="w-5 h-5 mx-auto mb-1 text-sky-500" />
            <div className="font-black text-xl text-slate-800">4.5</div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Hours</div>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 text-center">
            <CheckCircle2 className="w-5 h-5 mx-auto mb-1 text-emerald-500" />
            <div className="font-black text-xl text-slate-800">2</div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Trips</div>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 text-center">
            <Droplet className="w-5 h-5 mx-auto mb-1 text-amber-500" />
            <div className="font-black text-xl text-slate-800">32<span className="text-xs">L</span></div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Fuel</div>
          </div>
        </div>

        {/* Active Duty Card */}
        <div>
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Up Next</h2>
          <div 
            onClick={() => navigate('/operator/job/BKG-1092')}
            className="bg-emerald-600 rounded-3xl p-5 text-white shadow-xl shadow-emerald-900/20 active:scale-[0.98] transition-transform cursor-pointer"
          >
            <div className="flex justify-between items-start mb-4">
              <span className="bg-emerald-700/50 px-3 py-1 rounded-lg text-xs font-bold border border-emerald-500/30">
                DISPATCH PENDING
              </span>
              <span className="text-emerald-200 text-sm font-bold">14:30 PM</span>
            </div>
            
            <h3 className="text-2xl font-black mb-1">Ramesh Patel</h3>
            <p className="flex items-center gap-1 text-emerald-100 text-sm mb-4">
              <MapPin className="w-4 h-4" /> Sehore Village, MP (4.2 km away)
            </p>
            
            <div className="bg-emerald-700/30 rounded-xl p-3 flex gap-4 text-sm border border-emerald-600/50 mb-4">
              <div className="flex-1">
                <span className="block text-emerald-300 text-xs">Task</span>
                <span className="font-bold">Ploughing</span>
              </div>
              <div className="flex-1 border-l border-emerald-600/50 pl-4">
                <span className="block text-emerald-300 text-xs">Details</span>
                <span className="font-bold">5 Acres • Wheat</span>
              </div>
            </div>

            <div className="flex items-center justify-between font-bold">
              <span>Start Job Execution</span>
              <div className="w-8 h-8 bg-white text-emerald-600 rounded-full flex items-center justify-center">
                <ChevronRight className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
