import { Search, X } from "lucide-react";

export default function SearchBar({ onSearch, onFilterToggle, query, setQuery }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <div className="bg-white border-b sticky top-0 z-10">
      <div className="p-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Buscar material por título..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full border rounded px-4 py-2 pr-10"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              <Search size={20} />
            </button>
          </div>
          <button
            type="button"
            onClick={onFilterToggle}
            className="bg-red-700 text-white px-4 py-2 rounded hover:bg-red-800 font-semibold"
          >
            Filtros
          </button>
        </form>
      </div>
    </div>
  );
}
