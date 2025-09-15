"use client";

import React from "react";
import Link from "next/link";
import { useIssues } from "@/hooks/useIssues"; 

const OpenIssuesLog: React.FC = () => {
  const { issues, loading } = useIssues(10);

  if (loading) {
    return (
      <div className="p-4 text-sm text-center text-gray-500">
        Loading actionable items...
      </div>
    );
  }

  if (issues.length === 0) {
    return (
        <p className="text-sm text-center text-gray-500 py-4">No open issues to display at the moment.</p>
    );
  }

  return (
    <ul className="space-y-2">
      {issues.map((issue) => (
        <li key={issue.id}>
          <Link
            href={`/issues/${issue.id}`}
            className="flex items-start gap-3 hover:bg-gray-50 p-2 rounded-md transition"
          >
            <span className="text-red-500 text-lg mt-0.5">•</span>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800 truncate">
                {issue.title}
              </p>
              <p className="text-xs text-gray-500">{issue.restaurantName}</p>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default OpenIssuesLog;