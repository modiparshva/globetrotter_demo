"use client"

import { useQuery } from '@tanstack/react-query'
import { adminService } from '@/lib/admin'

export function useAdminStats() {
  return useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => adminService.getAdminStats(),
    refetchInterval: 30000, // Refetch every 30 seconds
  })
}

export function useAdminUsers() {
  return useQuery({
    queryKey: ['admin-users'],
    queryFn: () => adminService.getAllUsers(),
    refetchInterval: 60000, // Refetch every minute
  })
}

export function useAdminTrips() {
  return useQuery({
    queryKey: ['admin-trips'],
    queryFn: () => adminService.getAllTrips(),
    refetchInterval: 60000, // Refetch every minute
  })
}

export function usePopularDestinations() {
  return useQuery({
    queryKey: ['popular-destinations'],
    queryFn: () => adminService.getPopularDestinations(),
    refetchInterval: 300000, // Refetch every 5 minutes
  })
}
