import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Map, Navigation, Check, ChevronRight } from 'lucide-react';
import { TelematicsSimulator } from './TelematicsSimulator';
import { JobCompletionModal } from './JobCompletionModal';

type JobState = 'ASSIGNED' | 'DISPATCHED' | 'ARRIVED_AT_FARM' | 'WORK_STARTED' | 'WORK_COMPLETED';

export const ActiveJobExecution: React.FC = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [jobState, setJobState] = useState<JobState>('ASSIGNED');
  const [showCompletion, setShowCompletion] = useState(false);

  // Mock data for the view
  const job = {
    farmerName: 'Ramesh Patel',
    village: 'Sehore Village, MP',
    farmSize: 5,
    task: 'Ploughing',
    crop: 'Wheat',
    lat: 23.2599,
    lng: 77.4126
  };

  const advanceState = () => {
    if (jobState === 'ASSIGNED') setJobState('DISPATCHED');
    else if (jobState === 'DISPATCHED') setJobState('ARRIVED_AT_FARM');
    else if (jobState === 'ARRIVED_AT_FARM') setJobState('WORK_STARTED');
    else if (jobState === 'WORK_STARTED') setShowCompletion(true);
  };

  const completeJob = (otp: string) => {
    setJobState('WORK_COMPLETED');
    setShowCompletion(false);
    // In real app, push to Supabase here
    setTimeout(() => {
      navigate('/operator');
    }, 1500);
  };

  const openGoogleMaps = () => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${job.lat},${job.lng}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col pb-24">
      {/* Header */}
      <header className="bg-slate-900 p-4 sticky top-0 z-10 flex items-center gap-4 shadow-md">
        <button onClick={() => navigate('/operator')} className="p-2 bg-slate-800 rounded-full text-slate-300">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="font-bold text-lg leading-tight">Active Booking</h1>
          <p className="text-slate-400 text-xs">ID: {bookingId}</p>
        </div>
      </header>

      <main className="flex-1 p-4 flex flex-col gap-6">
        {/* State Machine UI */}
        <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 flex items-center justify-between text-xs font-semibold">
          {['ASSIGNED', 'DISPATCHED', 'ARRIVED', 'STARTED', 'DONE'].map((s, idx) => (
            <React.Fragment key={s}>
              <div className="flex flex-col items-center gap-1">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  idx <= ['ASSIGNED', 'DISPATCHED', 'ARRIVED_AT_FARM', 'WORK_STARTED', 'WORK_COMPLETED'].indexOf(jobState)
                    ? 'bg-emerald-500 text-white shadow-[0_0_10px_rgba(16,185,129,0.5)]'
                    : 'bg-slate-800 text-slate-600'
                }`}>
                  {idx < ['ASSIGNED', 'DISPATCHED', 'ARRIVED_AT_FARM', 'WORK_STARTED', 'WORK_COMPLETED'].indexOf(jobState) ? <Check className="w-3 h-3" /> : idx + 1}
                </div>
              </div>
              {idx < 4 && <div className={`flex-1 h-0.5 ${idx < ['ASSIGNED', 'DISPATCHED', 'ARRIVED_AT_FARM', 'WORK_STARTED', 'WORK_COMPLETED'].indexOf(jobState) ? 'bg-emerald-500' : 'bg-slate-800'}`} />}
            </React.Fragment>
          ))}
        </div>

        {/* Job Info */}
        <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 bg-emerald-900/40 text-emerald-400 rounded-bl-2xl text-xs font-bold border-b border-l border-emerald-900/50">
            {job.task.toUpperCase()}
          </div>
          <h2 className="text-2xl font-bold mb-1">{job.farmerName}</h2>
          <p className="text-slate-400 text-sm mb-4 flex items-center gap-1">
            <Map className="w-4 h-4" /> {job.village}
          </p>
          <div className="flex gap-4">
            <div className="bg-slate-950 px-3 py-2 rounded-lg text-sm border border-slate-800 text-center flex-1">
              <span className="block text-slate-400 text-xs">Farm Size</span>
              <span className="font-bold text-white">{job.farmSize} Acres</span>
            </div>
            <div className="bg-slate-950 px-3 py-2 rounded-lg text-sm border border-slate-800 text-center flex-1">
              <span className="block text-slate-400 text-xs">Crop</span>
              <span className="font-bold text-white">{job.crop}</span>
            </div>
          </div>
        </div>

        {/* Navigation Map Mock / Trigger */}
        {(jobState === 'ASSIGNED' || jobState === 'DISPATCHED') && (
          <button 
            onClick={openGoogleMaps}
            className="bg-blue-600 hover:bg-blue-700 p-4 rounded-2xl flex items-center justify-between shadow-lg shadow-blue-900/20 active:scale-95 transition-transform"
          >
            <div className="flex items-center gap-3 font-bold text-lg text-white">
              <Navigation className="w-6 h-6" />
              Navigate to Farm
            </div>
            <ChevronRight className="w-6 h-6 text-blue-300" />
          </button>
        )}

        {/* Telemetry (Visible when working) */}
        {jobState === 'WORK_STARTED' && (
          <TelematicsSimulator machineId="mock-machine" bookingId={bookingId} />
        )}
      </main>

      {/* Main Action Area (Thumb friendly bottom) */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-slate-950/90 backdrop-blur-md border-t border-slate-900">
        <button 
          onClick={advanceState}
          disabled={jobState === 'WORK_COMPLETED'}
          className={`w-full h-16 rounded-2xl text-xl font-black shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2 ${
            jobState === 'ASSIGNED' ? 'bg-sky-600 text-white' :
            jobState === 'DISPATCHED' ? 'bg-amber-500 text-amber-950' :
            jobState === 'ARRIVED_AT_FARM' ? 'bg-emerald-600 text-white' :
            jobState === 'WORK_STARTED' ? 'bg-rose-600 text-white' :
            'bg-slate-800 text-slate-500'
          }`}
        >
          {jobState === 'ASSIGNED' && 'MARK DISPATCHED'}
          {jobState === 'DISPATCHED' && 'ARRIVED AT FARM'}
          {jobState === 'ARRIVED_AT_FARM' && 'START ENGINE & WORK'}
          {jobState === 'WORK_STARTED' && 'COMPLETE JOB'}
          {jobState === 'WORK_COMPLETED' && 'COMPLETED'}
        </button>
      </div>

      {showCompletion && (
        <JobCompletionModal 
          onClose={() => setShowCompletion(false)}
          onComplete={completeJob}
          summary={{ hours: 2.5, fuel: 18.2, acres: job.farmSize }}
        />
      )}
    </div>
  );
};
