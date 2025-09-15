import React from "react";
import { Users, Settings } from "lucide-react";

const AdminSection: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow p-6 space-y-4">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <Users className="text-red-600" size={20} /> Admin Panel
      </h2>
      <p className="text-gray-600">Manage users, roles, and system settings.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 border rounded-lg hover:shadow">
          <h3 className="font-semibold">User Management</h3>
          <p className="text-sm text-gray-500">Add, edit, and delete users.</p>
        </div>
        <div className="p-4 border rounded-lg hover:shadow">
          <h3 className="font-semibold flex gap-1">
            <Settings size={16} /> System Settings
          </h3>
          <p className="text-sm text-gray-500">Control global configurations.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminSection;
