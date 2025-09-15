"use client";

import { useState } from "react";
import {
  Building2,
  Wrench,
  ClipboardList,
  Users,
  ShieldCheck,
  CreditCard,
  Settings,
} from "lucide-react";

// --- Import your components ---
import DashboardOverview from "@/components/dashboard/overview/DashboardOverview";
import RestaurantList from "./RestaurantList";
import OpenIssuesLog from "@/components/dashboard/OpenIssuesLog";

// --- Import new chart components ---
import LineChartCard from "@/components/dashboard/charts/LineChartCard";
import DonutChartCard from "@/components/dashboard/charts/DonutChartCard";
import UrgentIssuesList from "../dashboard/issueslistcomp/IssuesListComp";

// --- Dummy components for sections you will build later ---
const Facilities = () => <div className="p-4 text-center text-gray-500">Facilities component will be displayed here.</div>;
const Suppliers = () => <div className="p-4 text-center text-gray-500">Suppliers & Contractors component will be displayed here.</div>;
const Inspections = () => <div className="p-4 text-center text-gray-500">Inspections component will be displayed here.</div>;
const Responsibilities = () => <div className="p-4 text-center text-gray-500">Responsibilities & Payments component will be displayed here.</div>;
const Warranty = () => <div className="p-4 text-center text-gray-500">Warranty & Equipment component will be displayed here.</div>;

// --- Define all dashboard sections with their corresponding components ---
const sections = [
  { id: "restaurants", title: "My Restaurants", icon: Building2, component: <RestaurantList /> },
  { id: "facilities", title: "Facilities", icon: Settings, component: <Facilities /> },
  { id: "issues", title: "Issues & Logs", icon: Wrench, component: <OpenIssuesLog /> },
  { id: "suppliers", title: "Suppliers & Contractors", icon: Users, component: <Suppliers /> },
  { id: "inspections", title: "Inspections", icon: ClipboardList, component: <Inspections /> },
  { id: "responsibilities", title: "Responsibilities & Payments", icon: CreditCard, component: <Responsibilities /> },
  { id: "warranty", title: "Warranty & Equipment", icon: ShieldCheck, component: <Warranty /> },
];

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState<string | null>("restaurants");

  const ActiveComponent = sections.find(
    (section) => section.id === activeSection
  )?.component;

  return (
    <div className="p-6 md:p-8 space-y-8 bg-gray-50 min-h-screen">
      {/* 1. Dashboard Overview */}
      <DashboardOverview />

      {/* 2. Urgent Reports and Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LineChartCard />
        <DonutChartCard />
        
      </div>
<div>
  <UrgentIssuesList />
</div>
      {/* 3. Clickable cards to navigate between management sections */}
      <div>
         <h2 className="text-2xl font-bold text-gray-800 mb-4">Management</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <div
                key={section.id}
                className={`cursor-pointer rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 bg-white ${
                  activeSection === section.id ? "ring-2 ring-red-600 ring-offset-2" : "hover:scale-105"
                }`}
                onClick={() =>
                  setActiveSection(activeSection === section.id ? null : section.id)
                }
              >
                <div className="bg-gradient-to-br from-gray-900 to-gray-700 text-white p-4 flex items-center gap-4">
                  <Icon className="h-6 w-6" />
                  <h3 className="font-bold text-lg">{section.title}</h3>
                </div>
                <div className="p-4 text-sm text-gray-600 h-16">
                    <p>Click to view and manage your {section.title.toLowerCase()}.</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* 4. Dynamically render the content of the currently active section */}
      {activeSection && ActiveComponent && (
        <div className="rounded-xl shadow-lg bg-white p-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">
            {sections.find((s) => s.id === activeSection)?.title}
          </h2>
          {ActiveComponent}
        </div>
      )}
    </div>
  );
}