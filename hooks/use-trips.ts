"use client"

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { tripService, type Trip, type Activity, type Expense } from '@/lib/trips'
import { useAuth } from './use-auth'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export function useTrips() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  // Get user trips
  const { data: trips, isLoading: isLoadingTrips } = useQuery({
    queryKey: ['trips', user?.account.$id],
    queryFn: () => tripService.getUserTrips(user!.account.$id),
    enabled: !!user?.account.$id,
  })

  // Create trip mutation
  const createTripMutation = useMutation({
    mutationFn: (tripData: {
      name: string
      description: string
      destination: string
      startDate: string
      endDate: string
      budget?: number
      image?: string
    }) => tripService.createTrip(user!.account.$id, {
      ...tripData,
      budget: tripData.budget || 0,
      status: 'planning',
      image: tripData.image || '',
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] })
      toast.success('Trip created successfully!')
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to create trip')
    },
  })

  // Update trip mutation
  const updateTripMutation = useMutation({
    mutationFn: ({ tripId, data }: { tripId: string, data: any }) =>
      tripService.updateTrip(tripId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] })
      queryClient.invalidateQueries({ queryKey: ['trip'] })
      toast.success('Trip updated successfully!')
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to update trip')
    },
  })

  // Delete trip mutation
  const deleteTripMutation = useMutation({
    mutationFn: tripService.deleteTrip,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] })
      toast.success('Trip deleted successfully!')
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to delete trip')
    },
  })

  return {
    trips: trips || [],
    isLoadingTrips,
    createTrip: createTripMutation.mutate,
    updateTrip: updateTripMutation.mutate,
    deleteTrip: deleteTripMutation.mutate,
    isCreatingTrip: createTripMutation.isPending,
    isUpdatingTrip: updateTripMutation.isPending,
    isDeletingTrip: deleteTripMutation.isPending,
  }
}

export function useTrip(tripId: string) {
  const queryClient = useQueryClient()

  // Get single trip
  const { data: trip, isLoading: isLoadingTrip } = useQuery({
    queryKey: ['trip', tripId],
    queryFn: () => tripService.getTrip(tripId),
    enabled: !!tripId,
  })

  // Get trip activities
  const { data: activities, isLoading: isLoadingActivities } = useQuery({
    queryKey: ['activities', tripId],
    queryFn: () => tripService.getTripActivities(tripId),
    enabled: !!tripId,
  })

  // Get trip expenses
  const { data: expenses, isLoading: isLoadingExpenses } = useQuery({
    queryKey: ['expenses', tripId],
    queryFn: () => tripService.getTripExpenses(tripId),
    enabled: !!tripId,
  })

  // Create activity mutation
  const createActivityMutation = useMutation({
    mutationFn: (activityData: {
      name: string
      description: string
      location: string
      date: string
      time: string
      cost: number
      category: string
    }) => tripService.createActivity(tripId, activityData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities', tripId] })
      toast.success('Activity created successfully!')
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to create activity')
    },
  })

  // Create expense mutation
  const createExpenseMutation = useMutation({
    mutationFn: (expenseData: {
      description: string
      amount: number
      category: string
      date: string
      activityId?: string
    }) => tripService.createExpense(tripId, expenseData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses', tripId] })
      toast.success('Expense created successfully!')
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to create expense')
    },
  })

  // Share trip mutation
  const shareTripMutation = useMutation({
    mutationFn: (expiresAt?: string) => tripService.shareTrip(tripId, expiresAt),
    onSuccess: (sharedTrip) => {
      const shareUrl = `${window.location.origin}/shared/${sharedTrip.token}`
      navigator.clipboard.writeText(shareUrl)
      toast.success('Trip shared! Link copied to clipboard.')
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to share trip')
    },
  })

  return {
    trip,
    activities: activities || [],
    expenses: expenses || [],
    isLoadingTrip,
    isLoadingActivities,
    isLoadingExpenses,
    createActivity: createActivityMutation.mutate,
    createExpense: createExpenseMutation.mutate,
    shareTrip: shareTripMutation.mutate,
    isCreatingActivity: createActivityMutation.isPending,
    isCreatingExpense: createExpenseMutation.isPending,
    isSharingTrip: shareTripMutation.isPending,
  }
}

export function useSharedTrip(token: string) {
  const { data: sharedTripData, isLoading } = useQuery({
    queryKey: ['sharedTrip', token],
    queryFn: () => tripService.getSharedTrip(token),
    enabled: !!token,
    retry: false,
  })

  return {
    trip: sharedTripData?.trip,
    sharedTrip: sharedTripData?.sharedTrip,
    isLoading,
  }
}
