import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { ShieldCheck, Cpu, Database, Sliders, Activity, Scale } from 'lucide-react';

export const AdminLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-surface-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Outlet />
      </main>
    </div>
  );
};
