"use client"

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { authService, type User } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface UserData {
  account: any;
  profile: User;
}

export function useAuth() {
  const queryClient = useQueryClient()
  const router = useRouter()

  // Get current user query
  const { data: user, isLoading, error } = useQuery({
    queryKey: ['user'],
    queryFn: authService.getCurrentUser,
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

  // Sign in mutation
  const signInMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authService.signIn(email, password),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] })
      toast.success('Signed in successfully!')
      router.push('/dashboard')
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to sign in')
    },
  })

  // Sign up mutation
  const signUpMutation = useMutation({
    mutationFn: ({
      email,
      password,
      firstName,
      lastName,
      phone,
      city,
      country,
    }: {
      email: string
      password: string
      firstName: string
      lastName: string
      phone?: string
      city?: string
      country?: string
    }) => authService.createAccount(email, password, firstName, lastName, phone, city, country),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] })
      toast.success('Account created successfully!')
      router.push('/dashboard')
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to create account')
    },
  })

  // Sign out mutation
  const signOutMutation = useMutation({
    mutationFn: authService.signOut,
    onSuccess: () => {
      queryClient.setQueryData(['user'], null)
      queryClient.clear()
      toast.success('Signed out successfully!')
      router.push('/')
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to sign out')
    },
  })

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: ({
      userId,
      data,
    }: {
      userId: string
      data: {
        email?: string
        firstName?: string
        lastName?: string
        phone?: string
        city?: string
        country?: string
        profileImage?: string
      }
    }) => authService.updateProfile(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] })
      toast.success('Profile updated successfully!')
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to update profile')
    },
  })

  return {
    user: user as UserData | null,
    isLoading,
    error,
    isAuthenticated: !!user,
    signIn: signInMutation.mutate,
    signUp: signUpMutation.mutate,
    signOut: signOutMutation.mutate,
    updateProfile: updateProfileMutation.mutate,
    isSigningIn: signInMutation.isPending,
    isSigningUp: signUpMutation.isPending,
    isSigningOut: signOutMutation.isPending,
    isUpdatingProfile: updateProfileMutation.isPending,
  }
}
