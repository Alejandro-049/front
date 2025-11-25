export default function DashboardCard({ title, icon, description, onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-white shadow-md p-6 rounded-lg border-2 border-red-700 hover:shadow-lg hover:border-yellow-500 
                 transition text-left w-full"
    >
      <h3 className="text-xl font-bold flex items-center gap-2 text-red-700">
        {icon} {title}
      </h3>
      <p className="text-gray-600 mt-2 text-sm">{description}</p>
    </button>
  );
}
