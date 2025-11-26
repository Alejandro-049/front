export default function DashboardCard({ title, icon, description, onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-white shadow-md p-6 rounded-lg border-2 border-red-700 hover:shadow-lg hover:border-yellow-500 
                 transition text-left w-full flex flex-col justify-between"
    >
      <div className="flex items-center gap-2">
        <div className="w-2 h-8 bg-yellow-500 rounded mr-3" />
        <h3 className="text-xl font-bold flex items-center gap-2 text-red-700">{icon} {title}</h3>
      </div>
      <p className="text-gray-600 mt-4 text-sm">{description}</p>
    </button>
  );
}
