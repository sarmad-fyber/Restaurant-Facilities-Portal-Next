"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

const EditRestaurantPage = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    cuisineType: "",
    city: "",
    country: "",
    status: "active",
  });

  useEffect(() => {
    const fetchRestaurant = async () => {
      if (!id) return;
      const docRef = doc(db, "restaurants", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setFormData(docSnap.data() as any);
      }
    };
    fetchRestaurant();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    const docRef = doc(db, "restaurants", id);
    await updateDoc(docRef, formData);

    alert("Restaurant updated successfully!");
    router.push("/restaurants");
  };

  return (
    <div className="max-w-2xl mx-auto bg-white shadow rounded-2xl p-6 mt-6">
      <h1 className="text-2xl font-bold text-[#DD0031] mb-4">
        Edit Restaurant Settings
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Restaurant Name"
          className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-[#DD0031]"
        />
        <input
          name="cuisineType"
          value={formData.cuisineType}
          onChange={handleChange}
          placeholder="Cuisine Type"
          className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-[#DD0031]"
        />
        <input
          name="city"
          value={formData.city}
          onChange={handleChange}
          placeholder="City"
          className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-[#DD0031]"
        />
        <input
          name="country"
          value={formData.country}
          onChange={handleChange}
          placeholder="Country"
          className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-[#DD0031]"
        />

        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-[#DD0031]"
        >
          <option value="active">Active</option>
          <option value="planning">Planning</option>
          <option value="maintenance">Maintenance</option>
          <option value="closed">Closed</option>
        </select>

        <button
          type="submit"
          className="w-full py-2 px-4 rounded-xl bg-[#DD0031] text-white hover:bg-[#b80029] transition"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditRestaurantPage;
