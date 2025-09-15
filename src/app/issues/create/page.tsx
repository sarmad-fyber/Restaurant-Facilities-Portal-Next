"use client";

import React from "react";
import DashboardLayout from "@/layout/dashboardlayout";
import CreateIssueForm from "@/components/issues/CreateIssueForm";
import { useAuth } from "@/context/AuthContext";

const LogNewIssuePage: React.FC = () => {
  const { authLoading } = useAuth();

  if (authLoading) {
    return (
      <DashboardLayout>
        <div className="text-center p-10">
          <p className="text-gray-500">Loading...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Log a New Issue</h1>
          <p className="text-gray-500 mt-1">Report a problem. It will be sent to a manager for approval.</p>
        </div>
        <CreateIssueForm />
      </div>
    </DashboardLayout>
  );
};

export default LogNewIssuePage;
