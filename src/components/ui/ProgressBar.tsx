"use client";

import React from "react";

interface ProgressBarProps {
  isLoading: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-1 z-50 overflow-hidden bg-red-200">
      <div className="h-full bg-[#DD0031] w-full transform origin-left animate-slide"></div>
    </div>
  );
};

export default ProgressBar;