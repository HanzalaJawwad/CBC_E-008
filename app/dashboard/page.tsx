"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserCheck, BarChart3, Users, BookOpen, Settings, LogOut, Calendar, Clock } from "lucide-react"
import { Progress } from "@/components/ui/progress"

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  // Mock data for dashboard
  const recentClasses = [
    { id: 1, name: "Computer Science 101", time: "9:00 AM - 10:30 AM", attendance: 85 },
    { id: 2, name: "Data Structures", time: "11:00 AM - 12:30 PM", attendance: 92 },
    { id: 3, name: "Artificial Intelligence", time: "2:00 PM - 3:30 PM", attendance: 78 },
  ]

  const upcomingClasses = [
    { id: 4, name: "Database Systems", time: "9:00 AM - 10:30 AM", date: "Tomorrow" },
    { id: 5, name: "Web Development", time: "11:00 AM - 12:30 PM", date: "Tomorrow" },
    { id: 6, name: "Machine Learning", time: "2:00 PM - 3:30 PM", date: "May 12, 2025" },
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md hidden md:block">
        <div className="p-6">
          <div className="flex items-center">
            <UserCheck className="h-6 w-6 text-purple-600" />
            <h1 className="ml-2 text-xl font-bold text-gray-900">AttendanceAI</h1>
          </div>
        </div>
        <nav className="mt-6">
          <Link href="/dashboard" className="flex items-center px-6 py-3 bg-purple-50 text-purple-700">
            <BarChart3 className="h-5 w-5 mr-3" />
            Dashboard
          </Link>
          <Link href="/dashboard/attendance" className="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50">
            <UserCheck className="h-5 w-5 mr-3" />
            Take Attendance
          </Link>
          <Link href="/dashboard/students" className="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50">
            <Users className="h-5 w-5 mr-3" />
            Students
          </Link>
          <Link href="/dashboard/courses" className="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50">
            <BookOpen className="h-5 w-5 mr-3" />
            Courses
          </Link>
          <Link href="/dashboard/settings" className="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50">
            <Settings className="h-5 w-5 mr-3" />
            Settings
          </Link>
          <div className="border-t border-gray-200 mt-6 pt-4">
            <Link href="/" className="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50">
              <LogOut className="h-5 w-5 mr-3" />
              Logout
            </Link>
          </div>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow">
          <div className="px-6 py-4">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          </div>
        </header>

        <main className="p-6">
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="attendance">Attendance</TabsTrigger>
              <TabsTrigger value="students">Students</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">Total Students</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">248</div>
                    <p className="text-xs text-green-500 mt-1">+12 this semester</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">Average Attendance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">87%</div>
                    <p className="text-xs text-green-500 mt-1">+3% from last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">Active Courses</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">12</div>
                    <p className="text-xs text-gray-500 mt-1">Current semester</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Classes</CardTitle>
                    <CardDescription>Attendance for recent classes</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentClasses.map((cls) => (
                        <div key={cls.id} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="font-medium">{cls.name}</h4>
                              <p className="text-sm text-gray-500 flex items-center">
                                <Clock className="h-3 w-3 mr-1" /> {cls.time}
                              </p>
                            </div>
                            <span className="text-sm font-medium">{cls.attendance}%</span>
                          </div>
                          <Progress value={cls.attendance} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Upcoming Classes</CardTitle>
                    <CardDescription>Schedule for upcoming classes</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {upcomingClasses.map((cls) => (
                        <div
                          key={cls.id}
                          className="flex justify-between items-start pb-4 border-b border-gray-100 last:border-0 last:pb-0"
                        >
                          <div>
                            <h4 className="font-medium">{cls.name}</h4>
                            <p className="text-sm text-gray-500 flex items-center mt-1">
                              <Clock className="h-3 w-3 mr-1" /> {cls.time}
                            </p>
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="h-3 w-3 mr-1" />
                            {cls.date}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="attendance" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Attendance Overview</CardTitle>
                  <CardDescription>Monthly attendance statistics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80 flex items-center justify-center bg-gray-50 rounded-md">
                    <p className="text-gray-500">Attendance chart would be displayed here</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="students" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Student Overview</CardTitle>
                  <CardDescription>Student performance and attendance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80 flex items-center justify-center bg-gray-50 rounded-md">
                    <p className="text-gray-500">Student data would be displayed here</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
