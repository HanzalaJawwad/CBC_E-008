"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { UserCheck, Search, Plus, Edit, Trash2, UserPlus, Camera } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function StudentsPage() {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false)
  const [newStudent, setNewStudent] = useState({
    name: "",
    id: "",
    email: "",
    course: "",
  })

  // Mock student data
  const [students, setStudents] = useState([
    { id: "S001", name: "John Smith", email: "john.smith@example.edu", course: "Computer Science", attendance: "92%" },
    { id: "S002", name: "Emily Johnson", email: "emily.j@example.edu", course: "Data Structures", attendance: "88%" },
    {
      id: "S003",
      name: "Michael Williams",
      email: "m.williams@example.edu",
      course: "Artificial Intelligence",
      attendance: "95%",
    },
    {
      id: "S004",
      name: "Jessica Brown",
      email: "jessica.b@example.edu",
      course: "Database Systems",
      attendance: "78%",
    },
    { id: "S005", name: "David Jones", email: "david.jones@example.edu", course: "Web Development", attendance: "85%" },
    { id: "S006", name: "Sarah Davis", email: "sarah.d@example.edu", course: "Computer Science", attendance: "90%" },
    { id: "S007", name: "Robert Miller", email: "robert.m@example.edu", course: "Machine Learning", attendance: "82%" },
    {
      id: "S008",
      name: "Jennifer Wilson",
      email: "j.wilson@example.edu",
      course: "Data Structures",
      attendance: "93%",
    },
  ])

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.course.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleAddStudent = () => {
    // Validate form
    if (!newStudent.name || !newStudent.id || !newStudent.email || !newStudent.course) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields.",
        variant: "destructive",
      })
      return
    }

    // Add new student
    const updatedStudents = [
      ...students,
      {
        ...newStudent,
        attendance: "0%",
      },
    ]

    setStudents(updatedStudents)
    setIsAddStudentOpen(false)

    // Reset form
    setNewStudent({
      name: "",
      id: "",
      email: "",
      course: "",
    })

    toast({
      title: "Student Added",
      description: `${newStudent.name} has been added successfully.`,
    })
  }

  const handleDeleteStudent = (id: string) => {
    const updatedStudents = students.filter((student) => student.id !== id)
    setStudents(updatedStudents)

    toast({
      title: "Student Removed",
      description: "The student has been removed successfully.",
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/dashboard" className="flex items-center">
              <UserCheck className="h-6 w-6 text-purple-600" />
              <h1 className="ml-2 text-xl font-bold text-gray-900">AttendanceAI</h1>
            </Link>
          </div>
          <h2 className="text-xl font-semibold text-gray-800">Student Management</h2>
          <div>
            <Link href="/dashboard">
              <Button variant="outline">Back to Dashboard</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Students</CardTitle>
              <CardDescription>Manage student profiles and enrollment</CardDescription>
            </div>
            <Dialog open={isAddStudentOpen} onOpenChange={setIsAddStudentOpen}>
              <DialogTrigger asChild>
                <Button className="bg-purple-600 hover:bg-purple-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Student
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Student</DialogTitle>
                  <DialogDescription>
                    Enter the student details and capture their facial data for attendance recognition.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={newStudent.name}
                      onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="id">Student ID</Label>
                    <Input
                      id="id"
                      value={newStudent.id}
                      onChange={(e) => setNewStudent({ ...newStudent, id: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newStudent.email}
                      onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="course">Primary Course</Label>
                    <Input
                      id="course"
                      value={newStudent.course}
                      onChange={(e) => setNewStudent({ ...newStudent, course: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Facial Recognition Data</Label>
                    <div className="border rounded-md p-4 flex flex-col items-center justify-center bg-gray-50">
                      <Camera className="h-8 w-8 text-gray-400 mb-2" />
                      <Button variant="outline" size="sm">
                        Capture Face Data
                      </Button>
                      <p className="text-xs text-gray-500 mt-2">No facial data captured yet</p>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddStudentOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddStudent} className="bg-purple-600 hover:bg-purple-700">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Student
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <div className="flex items-center mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search students..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead>Attendance</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">{student.id}</TableCell>
                        <TableCell>{student.name}</TableCell>
                        <TableCell>{student.email}</TableCell>
                        <TableCell>{student.course}</TableCell>
                        <TableCell>{student.attendance}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteStudent(student.id)}>
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        No students found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="text-sm text-gray-500">
              Showing {filteredStudents.length} of {students.length} students
            </div>
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}
