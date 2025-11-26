import { X } from "lucide-react";
import { useState } from "react";

export default function MultiSelect({ label, options, selected, onAdd, onRemove, required }) {
  const [openDropdown, setOpenDropdown] = useState(false);

  const availableOptions = options.filter(
    (opt) => !selected.includes(opt.id)
  );

  const selectedLabels = selected
    .map((id) => options.find((opt) => opt.id === id)?.label)
    .filter(Boolean);

  return (
    <div>
      <label className="block text-sm font-medium mb-2">
        {label} {required && "*"}
      </label>

      {/* Etiquetas seleccionadas */}
      <div className="mb-3 flex flex-wrap gap-2">
        {selectedLabels.map((label, idx) => (
          <div
            key={idx}
            className="bg-yellow-500 text-red-700 px-3 py-1 rounded-full flex items-center gap-2 font-semibold text-sm"
          >
            {label}
            <button
              type="button"
              onClick={() => onRemove(selected[idx])}
              className="hover:opacity-70"
              aria-label="Remover"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>

      {/* Dropdown para agregar */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpenDropdown(!openDropdown)}
          className="w-full border rounded px-3 py-2 text-left bg-white hover:bg-gray-50 flex justify-between items-center"
        >
          <span className="text-gray-600">
            {availableOptions.length > 0
              ? `Agregar ${label.toLowerCase()}`
              : "No hay más opciones"}
          </span>
          <span className="text-gray-400">▼</span>
        </button>

        {openDropdown && availableOptions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 border rounded bg-white shadow-lg z-10">
            {availableOptions.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  onAdd(opt.id);
                  setOpenDropdown(false);
                }}
                className="w-full text-left px-3 py-2 hover:bg-gray-100 border-b last:border-b-0"
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
