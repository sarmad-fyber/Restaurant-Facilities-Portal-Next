"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { collection, getDocs, doc, getDoc, query, where, Timestamp } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { FiMapPin, FiUser, FiUsers, FiCalendar } from "react-icons/fi";
import { BsFilePerson } from "react-icons/bs";

// --- Type Definitions ---
type RestaurantStatus = "Open" | "Planning" | "Maintenance" | "Closed";

interface Restaurant {
  id: string;
  name: string;
  status: RestaurantStatus;
  address?: string;
  city?: string;
  state?: string;
  managerId: string;
  supervisorIds?: string[];
  linkedContractorIds?: string[];
  createdAt: Timestamp;
}

interface User {
  name: string;
  email: string;
}

// --- Helper Functions ---
const getStatusStyles = (status: RestaurantStatus) => {
  switch (status) {
    case "Open": return "bg-green-100 text-green-800 border border-green-200";
    case "Planning": return "bg-blue-100 text-blue-800 border border-blue-200";
    case "Maintenance": return "bg-yellow-100 text-yellow-800 border border-yellow-200";
    case "Closed": return "bg-red-100 text-red-800 border border-red-200";
    default: return "bg-gray-100 text-gray-800 border border-gray-200";
  }
};

const ManagerRestaurantList: React.FC = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [users, setUsers] = useState<{ [key: string]: User }>({});
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<RestaurantStatus | "All">("All");

  // 🔹 Auth Watcher
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // 🔹 Fetch Manager's Restaurants
  useEffect(() => {
    const fetchManagerData = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        // Only fetch restaurants for this manager
        const q = query(collection(db, "restaurants"), where("managerId", "==", currentUser.uid));
        const snapshot = await getDocs(q);

        const restaurantList: Restaurant[] = snapshot.docs.map(
          (docSnap) => ({ id: docSnap.id, ...docSnap.data() } as Restaurant)
        );
        setRestaurants(restaurantList);

        // Collect related user IDs
        const userIds = new Set<string>();
        restaurantList.forEach(r => {
          if (r.managerId) userIds.add(r.managerId);
          r.supervisorIds?.forEach(id => userIds.add(id));
          r.linkedContractorIds?.forEach(id => userIds.add(id));
        });

        const userPromises = Array.from(userIds).map(id => getDoc(doc(db, "users", id)));
        const userDocs = await Promise.all(userPromises);

        const userData: { [key: string]: User } = {};
        userDocs.forEach(userDoc => {
          if (userDoc.exists()) {
            userData[userDoc.id] = userDoc.data() as User;
          }
        });
        setUsers(userData);

      } catch (err) {
        console.error("Error fetching manager restaurants:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchManagerData();
  }, [currentUser]);

  // 🔹 Filtering
  const filteredRestaurants = useMemo(() => {
    return restaurants
      .filter(r => statusFilter === "All" || r.status === statusFilter)
      .filter(r => r.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [restaurants, searchQuery, statusFilter]);

  // 🔹 Render
  if (loading) {
    return <p className="text-center text-gray-500 mt-10">Loading your restaurants...</p>;
  }

  if (!currentUser) {
    return <p className="text-center text-gray-500 mt-10">Please log in to see your assigned restaurants.</p>;
  }

  const filterButtons: (RestaurantStatus | "All")[] = ["All", "Open", "Planning", "Maintenance", "Closed"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">My Restaurants</h1>
        <p className="text-gray-500">View, search, and filter restaurants assigned to you.</p>
      </div>

      {/* Search + Filters */}
      <div className="bg-white p-4 rounded-xl shadow space-y-4">
        <input
          type="text"
          placeholder="Search by restaurant name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#DD0031]"
        />
        <div className="flex flex-wrap gap-2">
          {filterButtons.map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1 text-sm font-medium rounded-full transition ${
                statusFilter === status
                  ? "bg-[#DD0031] text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Restaurant Grid */}
      {filteredRestaurants.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredRestaurants.map((restaurant) => {
            const managerName = restaurant.managerId ? (users[restaurant.managerId]?.name || "Unassigned") : "Unassigned";
            const supervisorId = restaurant.supervisorIds?.[0];
            const supervisorName = supervisorId ? (users[supervisorId]?.name || "N/A") : "N/A";
            const contractorCount = restaurant.linkedContractorIds?.length || 0;
            const createdDate = restaurant.createdAt?.toDate().toLocaleDateString() || "N/A";
            const fullAddress = [restaurant.address, restaurant.city, restaurant.state].filter(Boolean).join(", ");

            return (
              <Link key={restaurant.id} href={`/restaurant/${restaurant.id}`}>
                <div className="bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-lg hover:border-[#DD0031] transition p-5 cursor-pointer h-full flex flex-col">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-bold text-[#DD0031] pr-2">
                      {restaurant.name}
                    </h3>
                    <span className={`flex-shrink-0 inline-block px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${getStatusStyles(restaurant.status)}`}>
                      {restaurant.status}
                    </span>
                  </div>

                  {/* Location */}
                  <div className="flex items-start text-sm text-gray-600 mb-3">
                    <FiMapPin className="flex-shrink-0 mr-2 mt-0.5 text-gray-400" />
                    <span>{fullAddress || "No address provided"}</span>
                  </div>

                  {/* Details Section */}
                  <div className="space-y-2 text-sm text-gray-700 border-t pt-3 mt-auto">
                    <div className="flex items-center">
                      <FiUser className="mr-2 text-gray-500" />
                      <strong>Manager:</strong><span className="ml-1 truncate">{managerName}</span>
                    </div>

                    {supervisorId && (
                      <div className="flex items-center">
                        <FiUsers className="mr-2 text-gray-500" />
                        <strong>Supervisor:</strong><span className="ml-1 truncate">{supervisorName}</span>
                      </div>
                    )}

                    <div className="flex items-center">
                      <BsFilePerson className="mr-2 text-gray-500" />
                      <strong>Contractors:</strong><span className="ml-1">{contractorCount}</span>
                    </div>

                    <div className="flex items-center text-xs text-gray-500 pt-2">
                      <FiCalendar className="mr-2" />
                      <span>Added: {createdDate}</span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="text-center text-gray-500 bg-white p-10 rounded-xl shadow">
          <p>No restaurants assigned to you yet.</p>
        </div>
      )}
    </div>
  );
};

export default ManagerRestaurantList;
