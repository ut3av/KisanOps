import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';

export const CHCLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-surface-50 flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
        <Outlet />
      </main>
    </div>
  );
};
