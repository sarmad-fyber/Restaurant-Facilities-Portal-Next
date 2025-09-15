// src/components/IssueList.tsx
"use client";

import React, { useEffect, useState } from "react";
import { collection, onSnapshot, updateDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";

interface Issue {
  id: string;
  title: string;
  restaurantName: string;
  approvalStatus: string;
  workStatus: string;
  createdByName?: string;
}

export default function IssueList() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const { user, role } = useAuth(); // ✅ get role from context

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "issues"), (snapshot) => {
      const data = snapshot.docs.map(
        (docSnap) =>
          ({
            id: docSnap.id,
            ...docSnap.data(),
          } as Issue)
      );
      setIssues(data);
    });

    return () => unsubscribe();
  }, []);

  const handleStatusChange = async (issueId: string, field: string, value: string) => {
    try {
      await updateDoc(doc(db, "issues", issueId), {
        [field]: value,
      });
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-gray-200 text-gray-800";
      case "Approved":
        return "bg-green-100 text-green-700";
      case "Rejected":
        return "bg-red-100 text-red-700";
      case "In-progress":
        return "bg-yellow-100 text-yellow-700";
      case "Done":
        return "bg-blue-100 text-blue-700";
      case "Resolved":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-gray-100 text-gray-500";
    }
  };

  return (
    <div className="overflow-x-auto rounded-xl shadow">
      <table className="min-w-full bg-white border">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Issue Details
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Manager Approval
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Coordinator Work
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Final Resolution
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {issues.map((issue, index) => (
            <tr key={issue.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
              {/* Issue Details */}
              <td className="px-6 py-4">
                <div className="font-semibold text-gray-900">{issue.title}</div>
                <div className="text-sm text-gray-500">{issue.restaurantName}</div>
              </td>

              {/* Manager Approval Column */}
              <td className="px-6 py-4">
                {(role === "admin" || role === "manager") && issue.approvalStatus === "Pending" ? (
                  <select
                    value={issue.approvalStatus}
                    onChange={(e) =>
                      handleStatusChange(issue.id, "approvalStatus", e.target.value)
                    }
                    className={`p-1.5 text-xs rounded-md border w-full ${getStatusStyles(
                      issue.approvalStatus
                    )}`}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approve</option>
                    <option value="Rejected">Reject</option>
                  </select>
                ) : (
                  <span
                    className={`px-2 py-1 font-semibold rounded-full text-xs ${getStatusStyles(
                      issue.approvalStatus
                    )}`}
                  >
                    {issue.approvalStatus}
                  </span>
                )}
              </td>

              {/* Coordinator Work Column */}
              <td className="px-6 py-4">
                {role === "coordinator" &&
                issue.approvalStatus === "Approved" &&
                issue.workStatus !== "Done" &&
                issue.workStatus !== "Resolved" ? (
                  <select
                    value={issue.workStatus}
                    onChange={(e) =>
                      handleStatusChange(issue.id, "workStatus", e.target.value)
                    }
                    className={`p-1.5 text-xs rounded-md border w-full ${getStatusStyles(
                      issue.workStatus
                    )}`}
                  >
                    <option value="Open">Open</option>
                    <option value="In-progress">Start Work</option>
                    <option value="Done">Mark as Done</option>
                  </select>
                ) : (
                  <span
                    className={`px-2 py-1 font-semibold rounded-full text-xs ${getStatusStyles(
                      issue.workStatus
                    )}`}
                  >
                    {issue.workStatus}
                  </span>
                )}
              </td>

              {/* Final Resolution Column */}
              <td className="px-6 py-4">
                {(role === "admin" || role === "manager") && issue.workStatus === "Done" ? (
                  <select
                    value={issue.workStatus}
                    onChange={(e) =>
                      handleStatusChange(issue.id, "workStatus", e.target.value)
                    }
                    className={`p-1.5 text-xs rounded-md border w-full ${getStatusStyles(
                      issue.workStatus
                    )}`}
                  >
                    <option value="Done">Done</option>
                    <option value="Resolved">Resolve</option>
                  </select>
                ) : (
                  <span
                    className={`px-2 py-1 font-semibold rounded-full text-xs ${getStatusStyles(
                      issue.workStatus
                    )}`}
                  >
                    {issue.workStatus === "Resolved" ? "Resolved" : "N/A"}
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
