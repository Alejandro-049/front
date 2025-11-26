import { Menu, X, Users, BookOpen, Building, Briefcase, Search, Upload } from "lucide-react";
import { useState } from "react";

export default function Sidebar({ currentPage, onNavigate, userRole }) {
  const [isOpen, setIsOpen] = useState(false);

  const adminMenuItems = [
    { label: "Buscar Material", page: "buscar", icon: Search },
    { label: "Mis Materiales", page: "mis-materiales", icon: BookOpen },
    { label: "Universidades", page: "universidades", icon: Building },
    { label: "Profesores", page: "profesores", icon: Users },
    { label: "Asignaturas", page: "asignaturas", icon: BookOpen },
  ];

  const userMenuItems = [
    { label: "Buscar Material", page: "buscar", icon: Search },
    { label: "Mis Materiales", page: "mis-materiales", icon: BookOpen },
    { label: "Asignaturas", page: "asignaturas", icon: BookOpen },
    { label: "Profesores", page: "profesores", icon: Users },
    { label: "Universidades", page: "universidades", icon: Building },
  ];

  const menuItems = userRole === "admin" ? adminMenuItems : userMenuItems;

  return (
    <>
      {/* Toggle button para móvil */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-20 left-4 z-40 md:hidden bg-red-700 text-white p-2 rounded hover:bg-red-800"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-16 w-64 bg-red-700 text-white h-screen overflow-y-auto transition-transform duration-300 z-30 md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <nav className="p-6 space-y-2">
          <div className="mb-6">
            <button
              onClick={() => { onNavigate('dashboard'); setIsOpen(false); }}
              className="text-left w-full px-3 py-2 rounded transition hover:bg-yellow-500 hover:text-red-700 cursor-pointer"
              aria-label="Ir al inicio"
            >
              <h2 className="text-lg font-semibold text-white">UniclouD</h2>
              <p className="text-xs text-yellow-200 mt-1">
                {userRole === "admin" ? "Panel Administrador" : "Usuario"}
              </p>
            </button>
          </div>

          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.page;
            return (
              <button
                key={item.page}
                onClick={() => {
                  onNavigate(item.page);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded transition ${
                  isActive
                    ? "bg-yellow-500 text-red-700 font-semibold"
                    : "text-white hover:bg-red-600"
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Overlay para móvil */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-20 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
