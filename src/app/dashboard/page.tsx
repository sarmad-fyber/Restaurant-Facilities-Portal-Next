"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import DashboardLayout from "@/layout/dashboardlayout";
import RestaurantList from "@/components/admin/RestaurantList";
import ManagerDashboard from "@/components/manager/main";
import OpenIssuesLog from "@/components/dashboard/OpenIssuesLog";  
import AdminDashboard from "@/components/admin/main";

const RoleDashboardCard = ({ title, description }: { title: string, description: string }) => (
  <div className="bg-white shadow rounded-xl p-6"><h2 className="text-xl font-bold text-gray-800">{title}</h2><p className="text-gray-600 mt-2">{description}</p></div>
);

const DashboardPage: React.FC = () => {
  const { role, userName, authLoading } = useAuth();

  if (authLoading) {
    return <DashboardLayout><div className="flex justify-center items-center h-[60vh]"><p className="text-gray-500 text-lg">Loading Dashboard...</p></div></DashboardLayout>;
  }

  const renderDashboardContent = () => {
    switch (role) {
      case "admin": return <AdminDashboard />;
      case "manager": return <ManagerDashboard />;
      case "staff": return <RoleDashboardCard title="Staff Portal" description="View your daily tasks, schedules, and report issues here." />;
      case "supervisor": return <RoleDashboardCard title="Supervisor Dashboard" description="Oversee team tasks, approve reports, and manage restaurant operations." />;
      case "contractor": return <RoleDashboardCard title="Contractor Portal" description="Access assigned work orders, upload reports, and view project details." />;
      default: return <div className="bg-yellow-50 p-4"><p className="font-bold text-yellow-800">You are logged in as {role}.</p></div>;
    }
  };
 
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* <div className="bg-white shadow rounded-xl p-6">
          <h1 className="text-2xl font-bold text-gray-800">Welcome back, {userName || "User"} 👋</h1>
          <p className="text-gray-500 capitalize">You are logged in as: <span className="font-medium text-gray-900">{role || "Unknown"}</span></p>
        </div> */}

      {(role === 'admin' || role === 'manager' || role === 'supervisor')   /* && <OpenIssuesLog />} */}

        {renderDashboardContent()}
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;