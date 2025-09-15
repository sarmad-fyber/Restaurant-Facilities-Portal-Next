import ManagerRestaurantList from "@/components/manager/ManagerRestaurantList";

export default function ManagerDashboard() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-[#DD0031] mb-6">
        My Restaurants
      </h1>
      <ManagerRestaurantList />
    </div>
  );
}
