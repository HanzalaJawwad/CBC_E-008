
import { AttendanceProvider } from "@/context/AttendanceContext";
import Dashboard from "@/components/Dashboard";

const Index = () => {
  return (
    <AttendanceProvider>
      <div className="min-h-screen bg-slate-50">
        <Dashboard />
      </div>
    </AttendanceProvider>
  );
};

export default Index;
