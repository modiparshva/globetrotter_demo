"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  LayoutDashboard, 
  Users, 
  MapPin, 
  TrendingUp, 
  Settings, 
  LogOut,
  Menu,
  X,
  Shield,
  BarChart3,
  Globe,
  User,
  ChevronDown
} from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "User Management", href: "/admin/users", icon: Users },
  { name: "Trip Analytics", href: "/admin/trips", icon: MapPin },
  { name: "Cities & Activities", href: "/admin/cities", icon: Globe },
  { name: "Advanced Analytics", href: "/admin/analytics", icon: BarChart3 },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const { user, signOut } = useAuth();
  const router = useRouter();
  

  const handleLogout = () => {
    signOut()
  }

  useEffect(() => {
    if(!user.isAdmin) {
      router.replace('/');
    }
  }, [user])

  // Get user initials for avatar fallback
  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? "block" : "hidden"}`}>
        <div className="fixed inset-0 bg-black bg-opacity-25" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center">
              <Shield className="w-8 h-8 text-blue-600 mr-2" />
              <span className="font-bold text-xl">Admin Panel</span>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          <nav className="p-4 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex min-h-0 flex-1 flex-col bg-white shadow-lg">
          <div className="flex h-16 items-center px-6 border-b bg-gradient-to-r from-blue-600 to-orange-500">
            <Shield className="w-8 h-8 text-white mr-3" />
            <span className="font-bold text-xl text-white">GlobeTrotter Admin</span>
          </div>
          <div className="flex-1 overflow-y-auto">
            <nav className="p-4 space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    pathname === item.href
                      ? "bg-blue-100 text-blue-700 border border-blue-200"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex-shrink-0 p-4 border-t">
            <div className="flex items-center justify-between">
              {user ? (
                <>
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.profile.profileImage || "/placeholder-user.jpg"} alt={`${user.profile.firstName} ${user.profile.lastName}`} />
                      <AvatarFallback className="bg-blue-100 text-blue-700">
                        {getUserInitials(`${user.profile.firstName} ${user.profile.lastName}`)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-700">{user.profile.firstName} {user.profile.lastName}</p>
                      <p className="text-xs text-gray-500">{user.profile.email}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" title="Logout" onClick={handleLogout}>
                    <LogOut className="w-4 h-4" />
                  </Button>
                </>
              ) : (
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-gray-400">--</span>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-500">Loading...</p>
                      <p className="text-xs text-gray-400">Please wait</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" title="Logout" disabled>
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-40 flex h-16 items-center gap-x-4 border-b bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </Button>

          <div className="flex flex-1 items-center justify-between">
            <div className="flex items-center gap-x-4">
              <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                🇮🇳 India Travel Platform
              </Badge>
            </div>
            
            <div className="flex items-center gap-x-4">
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                System Healthy
              </Badge>
              <Link href="/dashboard">
                <Button variant="outline" size="sm">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  View Live Site
                </Button>
              </Link>
              
              {/* User Profile Dropdown */}
              {user && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2 h-8 px-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.profile.profileImage || "/placeholder-user.jpg"} alt={`${user.profile.firstName} ${user.profile.lastName}`} />
                        <AvatarFallback className="bg-blue-100 text-blue-700">
                          {getUserInitials(`${user.profile.firstName} ${user.profile.lastName}`)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="hidden sm:flex sm:flex-col sm:items-start">
                        <span className="text-sm font-medium text-gray-900">{user.profile.firstName} {user.profile.lastName}</span>
                        <span className="text-xs text-gray-500">{user.profile.email}</span>
                      </div>
                      <ChevronDown className="h-4 w-4 text-gray-500" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.profile.firstName} {user.profile.lastName}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user.profile.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/admin" className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}