import { AlertCircle } from "lucide-react";

export default function Alert({ children, type = "info" }) {
  const styles = {
    success: "bg-green-50 border-green-300 text-green-800",
    error: "bg-red-50 border-red-300 text-red-800",
    info: "bg-yellow-50 border-yellow-300 text-yellow-800",
  };

  return (
    <div className={`p-4 mb-4 border rounded-lg ${styles[type]}`}>
      <div className="flex items-center gap-2">
        <AlertCircle size={20} />
        <div>{children}</div>
      </div>
    </div>
  );
}

