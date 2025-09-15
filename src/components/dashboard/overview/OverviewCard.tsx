// components/dashboard/overview/OverviewCard.tsx
import React from 'react';

interface OverviewCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
}

const OverviewCard: React.FC<OverviewCardProps> = ({ title, value, icon: Icon }) => {
  return (
    <div className="bg-white p-5 rounded-xl shadow-md flex items-center space-x-4">
      <div className="bg-red-100 p-3 rounded-full">
        <Icon className="h-6 w-6 text-red-600" />
      </div>
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
};

export default OverviewCard;