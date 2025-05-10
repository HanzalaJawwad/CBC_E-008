"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UserCheck, Camera, CheckCircle, AlertCircle, RefreshCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function TakeAttendance() {
  const { toast } = useToast()
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isCapturing, setIsCapturing] = useState(false)
  const [recognizedStudents, setRecognizedStudents] = useState<string[]>([])
  const [selectedCourse, setSelectedCourse] = useState("")
  const [processingAttendance, setProcessingAttendance] = useState(false)

  // Mock data
  const courses = [
    { id: "cs101", name: "Computer Science 101" },
    { id: "ds202", name: "Data Structures" },
    { id: "ai303", name: "Artificial Intelligence" },
    { id: "db404", name: "Database Systems" },
  ]

  // Mock student data that would be recognized
  const mockStudents = ["John Smith", "Emily Johnson", "Michael Williams", "Jessica Brown", "David Jones"]

  useEffect(() => {
    // Clean up function to stop camera when component unmounts
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
        tracks.forEach((track) => track.stop())
      }
    }
  }, [])

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user",
        },
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setIsCapturing(true)
      }
    } catch (err) {
      console.error("Error accessing camera:", err)
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please check permissions.",
        variant: "destructive",
      })
    }
  }

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach((track) => track.stop())
      videoRef.current.srcObject = null
      setIsCapturing(false)
    }
  }

  const captureFrame = () => {
    if (!selectedCourse) {
      toast({
        title: "Course Required",
        description: "Please select a course before taking attendance.",
        variant: "destructive",
      })
      return
    }

    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d")
      if (context) {
        // Set canvas dimensions to match video
        canvasRef.current.width = videoRef.current.videoWidth
        canvasRef.current.height = videoRef.current.videoHeight

        // Draw the current video frame on the canvas
        context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height)

        // In a real app, we would now process this image with facial recognition
        // For this demo, we'll simulate recognition with a timeout
        simulateFacialRecognition()
      }
    }
  }

  const simulateFacialRecognition = () => {
    setProcessingAttendance(true)

    // Simulate processing delay
    setTimeout(() => {
      // Randomly select 2-4 students from our mock data to simulate recognition
      const numberOfStudents = Math.floor(Math.random() * 3) + 2
      const shuffled = [...mockStudents].sort(() => 0.5 - Math.random())
      const recognized = shuffled.slice(0, numberOfStudents)

      setRecognizedStudents(recognized)
      setProcessingAttendance(false)

      toast({
        title: "Attendance Captured",
        description: `Recognized ${recognized.length} students in the frame.`,
      })
    }, 2000)
  }

  const resetAttendance = () => {
    setRecognizedStudents([])
  }

  const saveAttendance = () => {
    if (recognizedStudents.length === 0) {
      toast({
        title: "No Students Recognized",
        description: "Please capture attendance first.",
        variant: "destructive",
      })
      return
    }

    // In a real app, we would save this data to a database
    toast({
      title: "Attendance Saved",
      description: `Saved attendance for ${recognizedStudents.length} students in ${courses.find((c) => c.id === selectedCourse)?.name}.`,
    })

    // Reset after saving
    resetAttendance()
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
          <h2 className="text-xl font-semibold text-gray-800">Take Attendance</h2>
          <div>
            <Link href="/dashboard">
              <Button variant="outline">Back to Dashboard</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Camera Feed</CardTitle>
                <CardDescription>Position students in the frame for recognition</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <div className="relative w-full aspect-video bg-black rounded-md overflow-hidden">
                  {!isCapturing && (
                    <div className="absolute inset-0 flex items-center justify-center text-white">
                      <div className="text-center">
                        <Camera className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>Camera is off</p>
                        <Button onClick={startCamera} className="mt-4 bg-purple-600 hover:bg-purple-700">
                          Start Camera
                        </Button>
                      </div>
                    </div>
                  )}
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className={`w-full h-full object-cover ${!isCapturing ? "hidden" : ""}`}
                  />
                  {processingAttendance && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <div className="text-center text-white">
                        <RefreshCw className="h-12 w-12 mx-auto mb-2 animate-spin" />
                        <p>Processing...</p>
                      </div>
                    </div>
                  )}
                </div>
                <canvas ref={canvasRef} className="hidden" />
              </CardContent>
              <CardFooter className="flex justify-between">
                {isCapturing ? (
                  <>
                    <Button variant="outline" onClick={stopCamera}>
                      Stop Camera
                    </Button>
                    <Button
                      onClick={captureFrame}
                      disabled={processingAttendance}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      Capture Attendance
                    </Button>
                  </>
                ) : (
                  <Button onClick={startCamera} className="ml-auto bg-purple-600 hover:bg-purple-700">
                    Start Camera
                  </Button>
                )}
              </CardFooter>
            </Card>
          </div>

          <div>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Class Details</CardTitle>
                <CardDescription>Select the course for attendance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Course</label>
                    <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a course" />
                      </SelectTrigger>
                      <SelectContent>
                        {courses.map((course) => (
                          <SelectItem key={course.id} value={course.id}>
                            {course.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Date</label>
                    <div className="p-2 border rounded-md bg-gray-50">{new Date().toLocaleDateString()}</div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Time</label>
                    <div className="p-2 border rounded-md bg-gray-50">{new Date().toLocaleTimeString()}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recognized Students</CardTitle>
                <CardDescription>
                  {recognizedStudents.length > 0
                    ? `${recognizedStudents.length} students recognized`
                    : "No students recognized yet"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {recognizedStudents.length > 0 ? (
                  <ul className="space-y-2">
                    {recognizedStudents.map((student, index) => (
                      <li key={index} className="flex items-center p-2 border rounded-md">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                        {student}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="flex flex-col items-center justify-center py-6 text-center text-gray-500">
                    <AlertCircle className="h-10 w-10 mb-2 opacity-50" />
                    <p>No students have been recognized yet.</p>
                    <p className="text-sm mt-1">Capture attendance to recognize students.</p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={resetAttendance} disabled={recognizedStudents.length === 0}>
                  Reset
                </Button>
                <Button
                  onClick={saveAttendance}
                  disabled={recognizedStudents.length === 0}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Save Attendance
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
