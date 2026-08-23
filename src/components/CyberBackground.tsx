import React from 'react';

export const CyberBackground: React.FC = () => {
  return (
    <>
      {/* Background Sleek Grid */}
      <div 
        className="fixed inset-0 pointer-events-none -z-10 opacity-30 animate-grid"
        style={{
          backgroundImage: `
            linear-gradient(rgba(99, 102, 241, 0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99, 102, 241, 0.04) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }}
      />

      {/* Ambient Sleek Radial Glows */}
      <div className="fixed -top-40 -left-40 w-96 h-96 rounded-full bg-indigo-600/10 blur-[130px] pointer-events-none -z-10" />
      <div className="fixed top-1/3 -right-40 w-96 h-96 rounded-full bg-sky-500/10 blur-[140px] pointer-events-none -z-10" />
      <div className="fixed -bottom-40 left-1/3 w-96 h-96 rounded-full bg-indigo-500/10 blur-[140px] pointer-events-none -z-10" />

      {/* Sleek Scanning Accent Line */}
      <div className="fixed inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-400/25 to-transparent pointer-events-none z-50 animate-scan" />
    </>
  );
};

