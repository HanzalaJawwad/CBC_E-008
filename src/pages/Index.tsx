import { AttendanceProvider } from "@/context/AttendanceContext";
import Dashboard from "@/components/Dashboard";
import ChatBot from "@/components/ChatBot";
import RegisteredStudents from "@/components/RegisteredStudents";
import AttendanceHistory from "@/components/AttendanceHistory";

const Index = () => {
  return (
    <AttendanceProvider>
      <div className="min-h-screen bg-slate-50">
        <Dashboard />
        <div className="container mx-auto py-6 space-y-6">
          <RegisteredStudents />
          <AttendanceHistory />
        </div>
        <ChatBot />
      </div>
    </AttendanceProvider>
  );
};

export default Index;
