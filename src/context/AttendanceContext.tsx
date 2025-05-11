import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { toast } from "@/hooks/use-toast";
import { Student } from "@/types/attendance";

interface AttendanceContextType {
  students: Student[];
  presentStudents: string[];
  addStudent: (name: string) => void;
  deleteStudent: (id: string) => void;
  markPresent: (name: string) => void;
  startAttendance: () => void;
  endAttendance: () => void;
  isAttendanceActive: boolean;
  saveAttendanceLog: () => void;
  backupData: () => void;
  autoRestoreStudents: () => void;
  isProcessing: boolean;
}

const AttendanceContext = createContext<AttendanceContextType | undefined>(
  undefined
);

export function useAttendance() {
  const context = useContext(AttendanceContext);
  if (context === undefined) {
    throw new Error("useAttendance must be used within an AttendanceProvider");
  }
  return context;
}

interface AttendanceProviderProps {
  children: ReactNode;
}

export function AttendanceProvider({ children }: AttendanceProviderProps) {
  const [students, setStudents] = useState<Student[]>([]);
  const [presentStudents, setPresentStudents] = useState<string[]>([]);
  const [isAttendanceActive, setIsAttendanceActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);

  // Load saved students from localStorage on mount
  useEffect(() => {
    autoRestoreStudents();
  }, []); // Empty dependency array ensures it runs only once

  const autoRestoreStudents = () => {
    const savedStudents = localStorage.getItem("attendance_students");
    if (savedStudents) {
      try {
        const parsedStudents = JSON.parse(savedStudents);
        setStudents(parsedStudents);
        console.log(
          "Auto-restored students from local storage",
          parsedStudents
        );
      } catch (error) {
        console.error("Failed to parse saved students:", error);
        toast({
          title: "Error",
          description: "Failed to restore student data",
          variant: "destructive",
        });
      }
    }
  };

  // Save students to localStorage when updated
  useEffect(() => {
    if (students.length > 0) {
      localStorage.setItem("attendance_students", JSON.stringify(students));
    }
  }, [students]);

  const addStudent = (name: string) => {
    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Student name cannot be empty",
        variant: "destructive",
      });
      return;
    }

    // Check for duplicate names
    if (
      students.some(
        (student) => student.name.toLowerCase() === name.toLowerCase()
      )
    ) {
      toast({
        title: "Error",
        description: `Student "${name}" already exists`,
        variant: "destructive",
      });
      return;
    }

    setStudents((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        name,
        dateAdded: new Date().toISOString(),
        attendanceCount: 0,
        lastPresent: null,
      },
    ]);

    toast({
      title: "Success",
      description: `Student "${name}" added successfully`,
    });
  };

  const deleteStudent = (id: string) => {
    // Find student before deletion to include name in confirmation message
    const studentToDelete = students.find((s) => s.id === id);
    if (!studentToDelete) return;

    setStudents((prev) => prev.filter((student) => student.id !== id));

    // Also remove from present students list if active
    if (isAttendanceActive && presentStudents.includes(studentToDelete.name)) {
      setPresentStudents((prev) =>
        prev.filter((name) => name !== studentToDelete.name)
      );
    }

    toast({
      title: "Success",
      description: `Student "${studentToDelete.name}" deleted successfully`,
    });
  };

  const markPresent = (name: string) => {
    if (!isAttendanceActive) {
      console.log("Cannot mark attendance: No active session");
      return;
    }

    console.log("Marking student as present:", name);

    if (!presentStudents.includes(name)) {
      console.log("Adding student to present list:", name);
      setPresentStudents((prev) => [...prev, name]);

      // Update student attendance count with current timestamp
      setStudents((prev) =>
        prev.map((student) => {
          if (student.name === name) {
            console.log("Updating attendance count for:", student.name);
            return {
              ...student,
              attendanceCount: student.attendanceCount + 1,
              lastPresent: new Date().toISOString(),
            };
          }
          return student;
        })
      );
    } else {
      console.log("Student already marked present:", name);
    }
  };

  const startAttendance = () => {
    if (students.length === 0) {
      toast({
        title: "Warning",
        description: "No students registered yet",
        variant: "destructive",
      });
      return;
    }

    console.log("Starting attendance session");
    setPresentStudents([]);
    setIsAttendanceActive(true);
    setSessionStartTime(new Date());

    toast({
      title: "Attendance Started",
      description: "Scanning for students...",
    });
  };

  const endAttendance = () => {
    console.log(
      "Ending attendance session, students present:",
      presentStudents
    );
    setIsAttendanceActive(false);

    toast({
      title: "Attendance Ended",
      description: `${presentStudents.length} students marked present`,
    });
  };

  const saveAttendanceLog = () => {
    if (presentStudents.length === 0) {
      toast({
        title: "Warning",
        description: "No attendance data to save",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Save attendance data to localStorage with full date time
      const attendanceData = {
        date: new Date().toISOString(),
        totalStudents: students.length,
        presentStudents: presentStudents,
        absentStudents: students
          .filter((student) => !presentStudents.includes(student.name))
          .map((student) => student.name),
        sessionStartTime:
          sessionStartTime?.toISOString() || new Date().toISOString(),
        sessionEndTime: new Date().toISOString(),
      };

      // Get existing logs or create new array
      const existingLogs = JSON.parse(
        localStorage.getItem("attendance_logs") || "[]"
      );
      existingLogs.unshift(attendanceData); // Add new log at the beginning
      localStorage.setItem("attendance_logs", JSON.stringify(existingLogs));

      toast({
        title: "Success",
        description: "Attendance log saved successfully",
      });
    } catch (error) {
      console.error("Failed to save attendance log:", error);
      toast({
        title: "Error",
        description: "Failed to save attendance log",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setSessionStartTime(null);
    }
  };

  const backupData = () => {
    setIsProcessing(true);

    try {
      // Create a backup object with all data
      const backup = {
        students,
        logs: JSON.parse(localStorage.getItem("attendance_logs") || "[]"),
        backupDate: new Date().toISOString(),
      };

      // Convert to JSON string and create blob
      const backupStr = JSON.stringify(backup, null, 2);
      const blob = new Blob([backupStr], { type: "application/json" });

      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      // Generate filename with current date
      const dateStr = new Date().toISOString().split("T")[0];
      link.download = `attendance_backup_${dateStr}.json`;

      // Trigger download and cleanup
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Backup Created",
        description: "Data backup downloaded successfully",
      });
    } catch (error) {
      console.error("Failed to create backup:", error);
      toast({
        title: "Error",
        description: "Failed to create backup",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <AttendanceContext.Provider
      value={{
        students,
        presentStudents,
        addStudent,
        deleteStudent,
        markPresent,
        startAttendance,
        endAttendance,
        isAttendanceActive,
        saveAttendanceLog,
        backupData,
        autoRestoreStudents,
        isProcessing,
      }}
    >
      {children}
    </AttendanceContext.Provider>
  );
}
