"use client";

import React from 'react';
import OverviewCard from './OverviewCard'; 
import { Building2, AlertTriangle, CalendarCheck, ShieldAlert } from 'lucide-react';
import { useIssues } from '@/hooks/useIssues';

const DashboardOverview = () => {
  const { issueCount, loading: issuesLoading } = useIssues();

  const overviewData = {
    restaurants: 1,
    upcomingInspections: 7,
    expiringWarranties: 5,
  };

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Overview</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <OverviewCard
          title="Number of restaurants"
          value={overviewData.restaurants}
          icon={Building2}
        />
        
        <OverviewCard
          title="Active issues"
          value={issuesLoading ? '...' : issueCount}
          icon={AlertTriangle}
        />
        
        <OverviewCard
          title="Upcoming Inspections"
          value={overviewData.upcomingInspections}
          icon={CalendarCheck}
        />
        
        <OverviewCard
          title="Warranty items expiring"
          value={overviewData.expiringWarranties}
          icon={ShieldAlert}
        />
      </div>
    </div>
  );
};

export default DashboardOverview;