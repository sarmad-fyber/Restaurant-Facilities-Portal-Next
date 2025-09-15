"use client";

import { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  limit,
  orderBy,
  Query,
  DocumentData,
} from "firebase/firestore";
import { db } from "@/lib/firebase"; 
import { useAuth } from "@/context/AuthContext";

export interface ActionableIssue {
  id: string;
  title: string;
  restaurantName: string;
  status: string;
  description?: string;
}

export const useIssues = (issueLimit?: number) => {
  const { role } = useAuth();
  const [issues, setIssues] = useState<ActionableIssue[]>([]);
  const [loading, setLoading] = useState(true);
  const [logTitle, setLogTitle] = useState("Actionable Items");
  const [issueCount, setIssueCount] = useState(0);

  useEffect(() => {
    if (!role) {
        setLoading(false);
        return;
    };

    const fetchIssues = async () => {
      setLoading(true);
      let statusToQuery: string | null = null;

      if (role === "admin" || role === "manager") {
        statusToQuery = "Pending";
        setLogTitle("Pending Approvals");
      } else if (role === "coordinator") {
        statusToQuery = "Approved";
        setLogTitle("Awaiting Action");
      }

      if (!statusToQuery) {
        setLoading(false);
        return;
      }

      try {
        const issuesRef = collection(db, "issues");
        
        let q: Query<DocumentData> = query(
          issuesRef,
          where("status", "==", statusToQuery),
          orderBy("createdAt", "desc")
        );

        if (issueLimit) {
            q = query(q, limit(issueLimit));
        }

        const snapshot = await getDocs(q);
        const fetchedIssues = snapshot.docs.map(
            (doc) => ({ id: doc.id, ...doc.data() } as ActionableIssue)
        );
        
        setIssues(fetchedIssues);
        setIssueCount(snapshot.size);

      } catch (err) {
        console.error("Error fetching actionable issues:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, [role, issueLimit]);

  return { issues, issueCount, loading, logTitle };
};