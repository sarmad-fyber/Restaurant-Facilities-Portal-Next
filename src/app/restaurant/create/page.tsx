"use client";

import React, { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase"; // Ensure this path is correct
import CreateRestaurantForm from "@/components/admin/CreateRestaurantForm"; // Ensure this path is correct
import DashboardLayout from "@/layout/dashboardlayout"; // Ensure this path is correct

// A generic interface for different user roles
interface User {
  uid: string;
  name: string;
  email: string;
}

const CreateRestaurantPage = () => {
  const [managers, setManagers] = useState<User[]>([]);
  const [supervisors, setSupervisors] = useState<User[]>([]);
  const [contractors, setContractors] = useState<User[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllUserRoles = async () => {
      try {
        // Helper function to query users based on a specific role
        const getUsersByRole = async (role: string): Promise<User[]> => {
          const usersRef = collection(db, "users");
          const q = query(usersRef, where("role", "==", role));
          const snapshot = await getDocs(q);
          if (snapshot.empty) {
            console.warn(`No users found with role: ${role}`);
            return []; // Return empty array if no users found
          }
          return snapshot.docs.map(doc => ({
            uid: doc.id,
            name: doc.data().name || 'Unnamed User',
            email: doc.data().email,
          }));
        };

        // Fetch all required roles in parallel for better performance
        const [managerList, supervisorList, contractorList] = await Promise.all([
          getUsersByRole("Manager"),
          getUsersByRole("Supervisor"),
          getUsersByRole("Contractor"),
        ]);

        setManagers(managerList);
        setSupervisors(supervisorList);
        setContractors(contractorList);

      } catch (err: any) {
        console.error("Firebase error fetching user roles:", err);
        setError("Failed to load required user data. Please check your Firestore security rules and ensure the 'users' collection is structured correctly.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllUserRoles();
  }, []); // Empty dependency array ensures this runs only once on mount

  // Render a loading state while fetching data
  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <p className="text-xl font-medium text-gray-600">Loading essential data...</p>
        </div>
      </DashboardLayout>
    );
  }

  // Render an error state if fetching failed
  if (error) {
    return (
      <DashboardLayout>
        <div className="m-auto max-w-2xl p-6 bg-red-50 border border-red-200 rounded-lg">
          <h2 className="text-xl font-bold text-red-800">Error</h2>
          <p className="text-red-700 mt-2">{error}</p>
        </div>
      </DashboardLayout>
    );
  }

  // Render the page with the form once data is ready
  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Register a New Restaurant</h1>
            <p className="text-gray-500 mt-1">Fill out the form below to add a new property to the system.</p>
          </div>
          <CreateRestaurantForm
            managers={managers}
            supervisors={supervisors}
            contractors={contractors}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CreateRestaurantPage;