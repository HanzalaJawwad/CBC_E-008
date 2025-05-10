"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { UserCheck, User, Mail, Lock, School } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function RegisterPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    agreeTerms: false,
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      agreeTerms: checked,
    }))
  }

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      role: value,
    }))
  }

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword || !formData.role) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match. Please try again.",
        variant: "destructive",
      })
      return
    }

    if (!formData.agreeTerms) {
      toast({
        title: "Terms Required",
        description: "Please agree to the terms and conditions.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    // Simulate registration process
    setTimeout(() => {
      setIsLoading(false)

      toast({
        title: "Registration Successful",
        description: "Your account has been created. You can now sign in.",
      })

      router.push("/login")
    }, 1500)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <UserCheck className="h-12 w-12 text-purple-600" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">AttendanceAI</h2>
          <p className="mt-2 text-sm text-gray-600">Create an account to get started</p>
        </div>

        <Card>
          <form onSubmit={handleRegister}>
            <CardHeader>
              <CardTitle>Create Account</CardTitle>
              <CardDescription>Enter your information to create an account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <Input
                    id="name"
                    name="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    className="pl-10"
                    required
                  />
                  <div className="absolute left-3 top-2.5 text-gray-400">
                    <User className="h-5 w-5" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-10"
                    required
                  />
                  <div className="absolute left-3 top-2.5 text-gray-400">
                    <Mail className="h-5 w-5" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="pl-10"
                    required
                  />
                  <div className="absolute left-3 top-2.5 text-gray-400">
                    <Lock className="h-5 w-5" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="pl-10"
                    required
                  />
                  <div className="absolute left-3 top-2.5 text-gray-400">
                    <Lock className="h-5 w-5" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <div className="relative">
                  <Select value={formData.role} onValueChange={handleSelectChange}>
                    <SelectTrigger id="role" className="pl-10">
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="teacher">Teacher</SelectItem>
                      <SelectItem value="admin">Administrator</SelectItem>
                      <SelectItem value="staff">Staff</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="absolute left-3 top-2.5 text-gray-400">
                    <School className="h-5 w-5" />
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="terms" checked={formData.agreeTerms} onCheckedChange={handleCheckboxChange} />
                <label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I agree to the{" "}
                  <Link href="/terms" className="text-purple-600 hover:text-purple-500">
                    terms and conditions
                  </Link>
                </label>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Create account"}
              </Button>
              <div className="text-center text-sm">
                Already have an account?{" "}
                <Link href="/login" className="font-medium text-purple-600 hover:text-purple-500">
                  Sign in
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>

        <div className="text-center text-sm text-gray-500">
          <Link href="/" className="font-medium text-purple-600 hover:text-purple-500">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}
