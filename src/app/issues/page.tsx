"use client";

import React from "react";
import DashboardLayout from "@/layout/dashboardlayout";
import IssueList from "@/components/issues/IssueList";

const IssuesPage: React.FC = () => {
  return (
    <DashboardLayout>
      <IssueList />
    </DashboardLayout>
  );
};

export default IssuesPage;