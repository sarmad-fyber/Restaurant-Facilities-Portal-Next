"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import DashboardLayout from "@/layout/dashboardlayout";

// Expanded interface to match all fields from the form
interface Restaurant {
  id: string;
  name: string;
  description: string;
  size: string;
  cuisineType: string;
  phone: string;
  email: string;
  website: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  openingHours: string;
  closingHours: string;
  status: "Open" | "Planning" | "Maintenance" | "Closed";
  managerId: string;
}

// Helper function for consistent status styling
const getStatusStyles = (status: Restaurant["status"]) => {
  switch (status) {
    case "Open":
      return "bg-green-100 text-green-700";
    case "Planning":
      return "bg-blue-100 text-blue-700";
    case "Maintenance":
      return "bg-yellow-100 text-yellow-700";
    case "Closed":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-200 text-gray-600";
  }
};

export default function RestaurantDetailsPage() {
  const params = useParams();
  const { id } = params;
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchRestaurant = async () => {
      try {
        const docRef = doc(db, "restaurants", id as string);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setRestaurant({ id: docSnap.id, ...docSnap.data() } as Restaurant);
        } else {
          console.log("No such document!");
        }
      } catch (err) {
        console.error("Error fetching restaurant:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, [id]);

  if (loading) return <p className="text-center text-gray-500 mt-10">Loading Restaurant Details...</p>;
  if (!restaurant) return <p className="text-center text-gray-500 mt-10">Restaurant not found.</p>;

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl shadow-lg p-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-[#DD0031]">{restaurant.name}</h1>
            <p className="text-lg text-gray-600 mt-1">{restaurant.cuisineType}</p>
          </div>
          <span
            className={`px-4 py-1.5 rounded-full text-sm font-semibold capitalize ${getStatusStyles(restaurant.status)}`}
          >
            {restaurant.status}
          </span>
        </div>

        {/* Description */}
        {restaurant.description && (
           <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">About</h2>
              <p className="text-gray-700">{restaurant.description}</p>
           </div>
        )}

        {/* Details Grid */}
        <div className="grid md:grid-cols-2 gap-6 border-t pt-6">
          {/* Left Column */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">General Information</h3>
            <div className="space-y-2 text-sm">
              <p><strong>Size:</strong> {restaurant.size || 'N/A'}</p>
              <p><strong>Phone:</strong> {restaurant.phone || 'N/A'}</p>
              <p><strong>Email:</strong> {restaurant.email || 'N/A'}</p>
              <p><strong>Website:</strong> <a href={restaurant.website} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">{restaurant.website || 'N/A'}</a></p>
              <p><strong>Hours:</strong> {restaurant.openingHours} - {restaurant.closingHours}</p>
            </div>
          </div>
          
          {/* Right Column */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Location</h3>
            <div className="space-y-2 text-sm">
                <p>{restaurant.addressLine1}</p>
                {restaurant.addressLine2 && <p>{restaurant.addressLine2}</p>}
                <p>{restaurant.city}, {restaurant.state} {restaurant.postalCode}</p>
                <p>{restaurant.country}</p>
            </div>
          </div>
        </div>

        {/* Placeholder for future features */}
        <div className="mt-8 pt-6 border-t">
          <h2 className="text-xl font-semibold mb-2">Linked Issues & Facilities</h2>
          <div className="bg-gray-50 border rounded-lg p-4 text-center">
            <p className="text-gray-500">Facility management features coming soon...</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}