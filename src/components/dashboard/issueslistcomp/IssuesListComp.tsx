"use client";

import React from "react";
import Link from "next/link";
import { useIssues } from "@/hooks/useIssues"; 
import { AlertTriangle, ArrowRight } from "lucide-react";

const UrgentIssuesList: React.FC = () => {
  // Fetch the top 3 most recent issues
  const { issues, loading } = useIssues(3);

  // A helper to format the date (assuming 'createdAt' is available from your hook)
  const formatDate = (date: any) => {
    if (date && typeof date.toDate === 'function') {
      return date.toDate().toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' });
    }
    return "N/A";
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden h-full">
      {/* Red Header */}
      <div className="bg-red-600 text-white p-4 flex items-center gap-3">
        <AlertTriangle className="h-6 w-6" />
        <h3 className="text-xl font-bold">URGENT</h3>
      </div>

      {/* Issues List */}
      <div className="p-2">
        {loading ? (
          <div className="text-center py-10 text-gray-500">Loading issues...</div>
        ) : issues.length === 0 ? (
          <div className="text-center py-10 text-gray-500">No urgent issues.</div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {issues.map((issue) => (
              <li key={issue.id}>
                <Link href={`/issues/${issue.id}`} className="block hover:bg-gray-50 transition duration-150">
                  <div className="flex items-center justify-between p-4">
                    <div className="flex-1 pr-4">
                      <p className="text-xs font-semibold text-[#718EBF] truncate">
                        {issue.title}
                        <span className="text-xs text-[#718EBF] font-normal ml-2">({issue.restaurantName})</span>
                      </p>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-1">
                        {issue.description || "No description provided."}
                      </p>
                    </div>
                    <div className="text-sm text-gray-500 whitespace-nowrap">
                      {/* Assuming your 'issue' object has a 'createdAt' timestamp */}
                      {formatDate((issue as any).createdAt)}
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* "See All" Footer */}
      <div className="border-t border-gray-200">
        <Link href="/issues" className="block p-4 text-center text-sm font-medium text-blue-600 hover:bg-gray-50 transition duration-150">
           <div className="flex items-center justify-center gap-2">
                See All
                <ArrowRight className="h-4 w-4" />
           </div>
        </Link>
      </div>
    </div>
  );
};

export default UrgentIssuesList;
