import DashboardCard from "../components/DashboardCard";

export default function Dashboard({ onNavigate }) {
  return (
    <div className="grid grid-cols-2 gap-6">
      <DashboardCard
        title="Universidades"
        description="Registrar y consultar universidades"
        onClick={() => onNavigate("universidades")}
      />

      <DashboardCard
        title="Profesores"
        description="Registrar profesores asociados"
        onClick={() => onNavigate("profesores")}
      />

      <DashboardCard
        title="Asignaturas"
        description="Gestionar asignaturas universitarias"
        onClick={() => onNavigate("asignaturas")}
      />

      <DashboardCard
        title="Subir Material"
        description="Cargar material académico"
        onClick={() => onNavigate("subir")}
      />

      <DashboardCard
        title="Buscar Material"
        description="Consultar recursos existentes"
        onClick={() => onNavigate("buscar")}
      />
    </div>
  );
}
