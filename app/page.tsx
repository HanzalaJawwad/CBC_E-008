import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UserCheck, BarChart3, Users, BookOpen } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <UserCheck className="h-8 w-8 text-purple-600" />
              <h1 className="ml-2 text-2xl font-bold text-gray-900">AttendanceAI</h1>
            </div>
            <div>
              <Link href="/login">
                <Button variant="outline" className="mr-2">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button>Register</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
              Smart Attendance System
            </h2>
            <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
              Automate attendance tracking with facial recognition technology
            </p>
            <div className="mt-8 flex justify-center">
              <Link href="/demo">
                <Button size="lg" className="px-8 py-3 text-lg bg-purple-600 hover:bg-purple-700">
                  See it in action
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <UserCheck className="h-5 w-5 mr-2 text-purple-600" />
                  Facial Recognition
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Automatically recognize students and mark attendance using advanced facial recognition technology.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2 text-purple-600" />
                  Detailed Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Generate comprehensive reports and analytics on attendance patterns and student engagement.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2 text-purple-600" />
                  Student Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Easily manage student profiles, classes, and courses with our intuitive interface.
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          <div className="mt-16">
            <h3 className="text-2xl font-bold text-center mb-8">How It Works</h3>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="text-center">
                <div className="bg-purple-100 rounded-full p-4 inline-flex items-center justify-center mb-4">
                  <Users className="h-8 w-8 text-purple-600" />
                </div>
                <h4 className="text-lg font-medium">Register Students</h4>
                <p className="mt-2 text-gray-600">Add student profiles with facial data to the system</p>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 rounded-full p-4 inline-flex items-center justify-center mb-4">
                  <BookOpen className="h-8 w-8 text-purple-600" />
                </div>
                <h4 className="text-lg font-medium">Create Classes</h4>
                <p className="mt-2 text-gray-600">Set up courses and assign students to them</p>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 rounded-full p-4 inline-flex items-center justify-center mb-4">
                  <UserCheck className="h-8 w-8 text-purple-600" />
                </div>
                <h4 className="text-lg font-medium">Take Attendance</h4>
                <p className="mt-2 text-gray-600">Use the camera to automatically recognize and mark attendance</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500">© 2025 AttendanceAI. All rights reserved.</p>
            <div className="mt-4 md:mt-0">
              <Link href="/privacy" className="text-gray-500 hover:text-gray-700 mr-4">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-500 hover:text-gray-700">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
