"use client";

import React, { useState, useEffect } from "react";
import { collection, addDoc, getDocs, serverTimestamp, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";

// --- Type Definitions ---
interface Restaurant {
  id: string;
  name: string;
}

const CreateIssueForm: React.FC = () => {
  const { user, userName, role } = useAuth();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [restaurantId, setRestaurantId] = useState("");
  const [category, setCategory] = useState("Maintenance");
  const [priority, setPriority] = useState("Medium");
  
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ message: "", type: "" });

  // 🔹 Fetch restaurants depending on role
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const restaurantsRef = collection(db, "restaurants");

        if (role === "admin") {
          const snapshot = await getDocs(restaurantsRef);
          setRestaurants(snapshot.docs.map(doc => ({ id: doc.id, name: doc.data().name as string })));
        } else if (role === "manager") {
          const snapshot = await getDocs(query(restaurantsRef, where("managerId", "==", user?.uid)));
          setRestaurants(snapshot.docs.map(doc => ({ id: doc.id, name: doc.data().name as string })));
        } else if (role === "staff") {
          const snapshot = await getDocs(query(restaurantsRef, where("staffIds", "array-contains", user?.uid)));
          setRestaurants(snapshot.docs.map(doc => ({ id: doc.id, name: doc.data().name as string })));
        }
      } catch (error) {
        console.error("Failed to fetch restaurants:", error);
      }
    };
    if (user) fetchRestaurants();
  }, [role, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setFeedback({ message: "You must be logged in to submit an issue.", type: "error" });
      return;
    }
    if (!title || !restaurantId) {
      setFeedback({ message: "Please fill in all required fields.", type: "error" });
      return;
    }

    setLoading(true);
    setFeedback({ message: "", type: "" });

    try {
      const selectedRestaurant = restaurants.find(r => r.id === restaurantId);

      await addDoc(collection(db, "issues"), {
        title,
        description,
        restaurantId,
        restaurantName: selectedRestaurant?.name || "Unknown",
        category,
        priority,
        approvalStatus: "Pending", // 🔹 start with pending approval
        workStatus: "Open",        // 🔹 work starts as Open
        createdBy: user.uid,
        createdByName: userName,
        createdAt: serverTimestamp(),
        approvedByName: null,
        resolvedByName: null,
      });

      setFeedback({ message: "Issue logged successfully! Awaiting approval.", type: "success" });
      setTitle(""); setDescription(""); setRestaurantId(""); setCategory("Maintenance"); setPriority("Medium");
    } catch (err) {
      console.error("Error logging issue:", err);
      setFeedback({ message: "Failed to log issue. Please try again.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-lg space-y-6">
      {feedback.message && (
        <div className={`p-4 rounded-lg text-center font-semibold ${feedback.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {feedback.message}
        </div>
      )}
      
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Issue Title *</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="mt-1 w-full p-2 border rounded-md" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Select Restaurant *</label>
          <select value={restaurantId} onChange={(e) => setRestaurantId(e.target.value)} required className="mt-1 w-full p-2 border rounded-md bg-white">
            <option value="">-- Select a Restaurant --</option>
            {restaurants.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="mt-1 w-full p-2 border rounded-md"></textarea>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="mt-1 w-full p-2 border rounded-md bg-white">
            <option>Maintenance</option>
            <option>Security</option>
            <option>Utilities</option>
            <option>Compliance</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Priority</label>
          <select value={priority} onChange={(e) => setPriority(e.target.value)} className="mt-1 w-full p-2 border rounded-md bg-white">
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </div>
      </div>

      <button type="submit" disabled={loading || !user} className="w-full bg-[#DD0031] text-white font-bold py-3 px-4 rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
        {loading ? "Submitting..." : "Log New Issue"}
      </button>
    </form>
  );
};

export default CreateIssueForm;
