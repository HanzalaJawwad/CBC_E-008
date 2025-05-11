import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar, Check, X, FileText, File } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AttendanceLog } from "@/types/attendance";
import { toast } from "@/hooks/use-toast";

const AttendanceHistory = () => {
  const [logs, setLogs] = useState<AttendanceLog[]>([]);
  const [selectedLog, setSelectedLog] = useState<AttendanceLog | null>(null);

  useEffect(() => {
    // Load attendance logs from localStorage
    const savedLogs = localStorage.getItem("attendance_logs");
    if (savedLogs) {
      try {
        const parsedLogs = JSON.parse(savedLogs);
        setLogs(parsedLogs);

        // Select most recent log by default if available
        if (parsedLogs.length > 0) {
          setSelectedLog(parsedLogs[0]);
        }
      } catch (error) {
        console.error("Failed to parse logs:", error);
      }
    }
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const exportAttendanceToCsv = (log: AttendanceLog) => {
    // Create CSV content
    const headers = ["Student Name", "Status"];
    const rows = [
      ...log.presentStudents.map((name) => [name, "Present"]),
      ...log.absentStudents.map((name) => [name, "Absent"]),
    ];

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `attendance_${formatDate(log.date)
        .replace(/,/g, "")
        .replace(/ /g, "_")}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Success",
      description: "Attendance exported as CSV file",
    });
  };

  const exportAttendanceToTxt = (log: AttendanceLog) => {
    // Create text content
    const dateFormatted = formatDate(log.date);
    let textContent = `Attendance Report - ${dateFormatted}\n`;
    textContent += `Total Students: ${log.totalStudents}\n\n`;

    textContent += "PRESENT STUDENTS:\n";
    textContent +=
      log.presentStudents.length > 0
        ? log.presentStudents.map((name) => `- ${name}`).join("\n")
        : "None";

    textContent += "\n\nABSENT STUDENTS:\n";
    textContent +=
      log.absentStudents.length > 0
        ? log.absentStudents.map((name) => `- ${name}`).join("\n")
        : "None";

    textContent += `\n\nAttendance rate: ${Math.round(
      (log.presentStudents.length / log.totalStudents) * 100
    )}%`;

    // Create download link
    const blob = new Blob([textContent], { type: "text/plain;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `attendance_${dateFormatted.replace(/,/g, "").replace(/ /g, "_")}.txt`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Success",
      description: "Attendance exported as text file",
    });
  };

  const exportAttendanceToPdf = (log: AttendanceLog) => {
    // We're using a simple approach to create PDF-like content
    // For a real PDF, you'd typically use a library like jspdf or pdfmake
    // This implementation creates a clean HTML page that can be printed as PDF

    const dateFormatted = formatDate(log.date);
    const attendanceRate = Math.round(
      (log.presentStudents.length / log.totalStudents) * 100
    );

    // Create HTML content with good styling
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Attendance Report - ${dateFormatted}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 40px;
            color: #333;
          }
          h1 {
            color: #1a56db;
            margin-bottom: 10px;
          }
          .summary {
            margin-bottom: 30px;
            font-size: 16px;
          }
          .stat {
            font-weight: bold;
            color: #1a56db;
          }
          .section {
            margin-bottom: 20px;
          }
          h2 {
            color: #333;
            border-bottom: 1px solid #ddd;
            padding-bottom: 5px;
          }
          ul {
            padding-left: 25px;
          }
          li {
            margin-bottom: 5px;
          }
          .present {
            color: #047857;
          }
          .absent {
            color: #dc2626;
          }
          .footer {
            margin-top: 40px;
            font-size: 12px;
            color: #666;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <h1>Attendance Report</h1>
        <div class="summary">
          <p>Date: <span class="stat">${dateFormatted}</span></p>
          <p>Total Students: <span class="stat">${log.totalStudents}</span></p>
          <p>Attendance Rate: <span class="stat">${attendanceRate}%</span></p>
        </div>

        <div class="section">
          <h2 class="present">Present Students (${
            log.presentStudents.length
          })</h2>
          ${
            log.presentStudents.length > 0
              ? `<ul>
              ${log.presentStudents.map((name) => `<li>${name}</li>`).join("")}
            </ul>`
              : "<p>None</p>"
          }
        </div>

        <div class="section">
          <h2 class="absent">Absent Students (${log.absentStudents.length})</h2>
          ${
            log.absentStudents.length > 0
              ? `<ul>
              ${log.absentStudents.map((name) => `<li>${name}</li>`).join("")}
            </ul>`
              : "<p>None</p>"
          }
        </div>

        <div class="footer">
          Generated on ${new Date().toLocaleString()}
        </div>
      </body>
      </html>
    `;

    // Open a new window with the HTML content
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      // Allow time for styles to load then print
      setTimeout(() => {
        printWindow.print();
        // Optional: close the window after print dialog closes
        // printWindow.close();
      }, 500);

      toast({
        title: "PDF Ready",
        description:
          "Attendance report opened in new tab ready for printing as PDF",
      });
    } else {
      toast({
        title: "Error",
        description: "Please allow pop-ups to generate PDF report",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle>Attendance Logs</CardTitle>
          <CardDescription>Select a date to view details</CardDescription>
        </CardHeader>
        <CardContent>
          {logs.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              No attendance logs available
            </div>
          ) : (
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {logs.map((log, index) => (
                <button
                  key={`${log.date}-${index}`}
                  className={`w-full flex justify-between items-center p-3 rounded-md text-left ${
                    selectedLog && selectedLog.date === log.date
                      ? "bg-primary/10 border border-primary/30"
                      : "bg-slate-50 hover:bg-slate-100"
                  }`}
                  onClick={() => setSelectedLog(log)}
                >
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(log.date)}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {log.presentStudents.length}/{log.totalStudents}
                  </span>
                </button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Attendance Details</CardTitle>
          <CardDescription>
            {selectedLog
              ? `Log for ${formatDate(selectedLog.date)}`
              : "Select a log to view details"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!selectedLog ? (
            <div className="py-12 text-center text-muted-foreground">
              No log selected
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">Attendance Rate</p>
                  <p className="text-3xl font-bold">
                    {Math.round(
                      (selectedLog.presentStudents.length /
                        selectedLog.totalStudents) *
                        100
                    )}
                    %
                  </p>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">Export</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Export Options</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => exportAttendanceToPdf(selectedLog)}
                    >
                      <File className="mr-2 h-4 w-4" />
                      <span>Export as PDF</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => exportAttendanceToTxt(selectedLog)}
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      <span>Export as Text</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => exportAttendanceToCsv(selectedLog)}
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      <span>Export as CSV</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <h3 className="flex items-center gap-2 mb-2 font-medium">
                    <Check className="w-4 h-4 text-emerald-500" />
                    Present ({selectedLog.presentStudents.length})
                  </h3>
                  <div className="bg-slate-50 rounded-md p-2 max-h-[240px] overflow-y-auto">
                    {selectedLog.presentStudents.length > 0 ? (
                      <ul className="space-y-1">
                        {selectedLog.presentStudents.map((name, index) => (
                          <li
                            key={`present-${index}`}
                            className="p-2 bg-white rounded text-sm"
                          >
                            {name}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-center py-4 text-muted-foreground text-sm">
                        No students present
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="flex items-center gap-2 mb-2 font-medium">
                    <X className="w-4 h-4 text-rose-500" />
                    Absent ({selectedLog.absentStudents.length})
                  </h3>
                  <div className="bg-slate-50 rounded-md p-2 max-h-[240px] overflow-y-auto">
                    {selectedLog.absentStudents.length > 0 ? (
                      <ul className="space-y-1">
                        {selectedLog.absentStudents.map((name, index) => (
                          <li
                            key={`absent-${index}`}
                            className="p-2 bg-white rounded text-sm"
                          >
                            {name}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-center py-4 text-muted-foreground text-sm">
                        No students absent
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendanceHistory;
