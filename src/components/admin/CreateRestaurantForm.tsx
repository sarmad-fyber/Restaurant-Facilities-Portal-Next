"use client";

import React, { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase"; // Ensure this path is correct

// Define types for component props
interface User {
  uid: string;
  name: string;
}
interface CreateRestaurantFormProps {
  managers: User[];
  supervisors: User[];
  contractors: User[];
}

const CreateRestaurantForm: React.FC<CreateRestaurantFormProps> = ({
  managers,
  supervisors,
  contractors,
}) => {
  // A comprehensive state object for the entire form
  const initialFormData = {
    // Section 1
    name: "",
    restaurantCode: "",
    status: "Planning",
    type: "Dine-in",
    cuisine: "",
    // Section 2
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    contactPersonName: "",
    contactNumberPrimary: "",
    email: "",
    // Section 7
    managerId: "",
    supervisorIds: [] as string[],
    linkedContractorIds: [] as string[],
    // Section 8
    openingDate: "",
    operatingHours: "",
    notes: "",
    // Minimum required amenities
    amenities: ['Kitchen Equipment', 'Toilets', 'Parking', 'Lighting'],
  };

  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ message: "", type: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      amenities: checked
        ? [...prev.amenities, value]
        : prev.amenities.filter(item => item !== value),
    }));
  };

   const handleMultiSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, options } = e.target;
    const selectedValues = Array.from(options)
      .filter(option => option.selected)
      .map(option => option.value);
    setFormData(prev => ({...prev, [name]: selectedValues}));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Simple validation for minimum required fields
    if (!formData.name || !formData.address || !formData.contactPersonName || !formData.contactNumberPrimary || !formData.managerId) {
      setFeedback({ message: "Please fill in all required fields marked with *", type: "error" });
      return;
    }

    setLoading(true);
    setFeedback({ message: "", type: "" });

    try {
      await addDoc(collection(db, "restaurants"), {
        ...formData,
        createdAt: serverTimestamp(),
      });
      setFeedback({ message: "Restaurant registered successfully!", type: "success" });
      setFormData(initialFormData);
    } catch (err) {
      console.error("Error adding restaurant:", err);
      setFeedback({ message: "Failed to register restaurant. Please try again.", type: "error" });
    } finally {
      setLoading(false);
    }
  };
  
  const allAmenities = ['Kitchen Equipment', 'Toilets', 'Parking', 'Lighting', 'Plumbing', 'HVAC', 'Fire Safety', 'Security Systems', 'Signage'];

  // Reusable styles
  const inputStyle = "mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500";
  const labelStyle = "block text-sm font-medium text-gray-700";
  const fieldsetStyle = "border p-4 pt-2 rounded-lg space-y-4";
  const legendStyle = "text-lg font-semibold px-2 text-gray-800";

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 md:p-8 rounded-2xl shadow-lg">
      {feedback.message && (
        <div className={`p-4 rounded-lg text-center font-semibold ${feedback.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {feedback.message}
        </div>
      )}

      {/* Section 1: Basic Restaurant Info */}
      <fieldset className={fieldsetStyle}>
        <legend className={legendStyle}>1. Basic Information</legend>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className={labelStyle}>Restaurant Name <span className="text-red-500">*</span></label>
            <input name="name" value={formData.name} onChange={handleChange} required className={inputStyle} />
          </div>
          <div>
            <label className={labelStyle}>Status</label>
            <select name="status" value={formData.status} onChange={handleChange} className={inputStyle}>
              <option value="Planning">Planning</option>
              <option value="Open">Open</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
        </div>
      </fieldset>

      {/* Section 2: Location & Contact */}
      <fieldset className={fieldsetStyle}>
         <legend className={legendStyle}>2. Location & Contact</legend>
         <div className="grid md:grid-cols-2 gap-4">
            <div>
                <label className={labelStyle}>Street Address <span className="text-red-500">*</span></label>
                <input name="address" value={formData.address} onChange={handleChange} required className={inputStyle} />
            </div>
            <div>
                <label className={labelStyle}>Contact Person <span className="text-red-500">*</span></label>
                <input name="contactPersonName" value={formData.contactPersonName} onChange={handleChange} required className={inputStyle} />
            </div>
             <div>
                <label className={labelStyle}>Contact Phone <span className="text-red-500">*</span></label>
                <input name="contactNumberPrimary" value={formData.contactNumberPrimary} onChange={handleChange} required className={inputStyle} />
            </div>
            <div>
                <label className={labelStyle}>Email Address</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} className={inputStyle} />
            </div>
         </div>
      </fieldset>
      
      {/* Section 4: Amenities (Minimum Required) */}
       <fieldset className={fieldsetStyle}>
          <legend className={legendStyle}>4. Basic Facilities</legend>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {allAmenities.map(amenity => (
                <label key={amenity} className="flex items-center space-x-2 cursor-pointer">
                    <input
                        type="checkbox"
                        value={amenity}
                        checked={formData.amenities.includes(amenity)}
                        onChange={handleCheckboxChange}
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-sm text-gray-700">{amenity}</span>
                </label>
            ))}
          </div>
       </fieldset>

      {/* Section 7: Staff & Management Assignment */}
      <fieldset className={fieldsetStyle}>
        <legend className={legendStyle}>7. Staff & Management</legend>
        <div className="grid md:grid-cols-2 gap-6">
            <div>
                <label className={labelStyle}>Assigned Manager <span className="text-red-500">*</span></label>
                <select name="managerId" value={formData.managerId} onChange={handleChange} required className={inputStyle}>
                    <option value="">-- Select a Manager --</option>
                    {managers.length > 0 ? managers.map(m => (
                        <option key={m.uid} value={m.uid}>{m.name}</option>
                    )) : <option disabled>No managers available</option>}
                </select>
            </div>
            <div>
                <label className={labelStyle}>Assigned Supervisor(s) (optional)</label>
                <select name="supervisorIds" value={formData.supervisorIds} onChange={handleMultiSelectChange} multiple className={`${inputStyle} h-24`}>
                    {supervisors.length > 0 ? supervisors.map(s => (
                        <option key={s.uid} value={s.uid}>{s.name}</option>
                    )) : <option disabled>No supervisors available</option>}
                </select>
            </div>
             <div className="md:col-span-2">
                <label className={labelStyle}>Linked Contractor(s) (optional)</label>
                <select name="linkedContractorIds" value={formData.linkedContractorIds} onChange={handleMultiSelectChange} multiple className={`${inputStyle} h-24`}>
                    {contractors.length > 0 ? contractors.map(c => (
                        <option key={c.uid} value={c.uid}>{c.name}</option>
                    )) : <option disabled>No contractors available</option>}
                </select>
            </div>
        </div>
      </fieldset>
      
      <button type="submit" disabled={loading} className="w-full bg-[#DD0031] text-white font-bold py-3 px-4 rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
        {loading ? "Saving Restaurant..." : "Register Restaurant"}
      </button>
    </form>
  );
};

export default CreateRestaurantForm;