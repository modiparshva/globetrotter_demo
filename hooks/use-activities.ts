"use client"

import { useState, useCallback } from "react"
import { databases, DATABASE_ID, ACTIVITIES_COLLECTION_ID } from "@/lib/appwrite"
import { ID, Query } from "appwrite"
import { toast } from "sonner"

interface ActivityItem {
  $id: string
  stopId: string
  name: string
  description: string
  scheduledDate: string
  scheduledTime: string
  duration: number
  cost: number
  location: string
  category: string
  $createdAt: string
  $updatedAt: string
}

interface NewActivityData {
  stopId: string
  name: string
  description: string
  scheduledDate: string
  scheduledTime: string
  duration: number
  cost: number
  location: string
  category: string
}

export function useActivities() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fetchActivitiesByStopId = useCallback(async (stopId: string): Promise<ActivityItem[]> => {
    try {
      setIsLoading(true)
      const response = await databases.listDocuments(
        DATABASE_ID,
        ACTIVITIES_COLLECTION_ID,
        [
          Query.equal('stopId', stopId),
          Query.orderAsc('scheduledDate'),
          Query.orderAsc('scheduledTime')
        ]
      )
      return response.documents as unknown as ActivityItem[]
    } catch (error) {
      console.error(`Error fetching activities for stop ${stopId}:`, error)
      toast.error("Failed to load activities")
      return []
    } finally {
      setIsLoading(false)
    }
  }, [])

  const fetchActivitiesByStopIds = useCallback(async (stopIds: string[]): Promise<{ [stopId: string]: ActivityItem[] }> => {
    try {
      setIsLoading(true)
      const activitiesData: { [stopId: string]: ActivityItem[] } = {}
      
      for (const stopId of stopIds) {
        try {
          const activities = await fetchActivitiesByStopId(stopId)
          activitiesData[stopId] = activities
        } catch (error) {
          console.error(`Error fetching activities for stop ${stopId}:`, error)
          activitiesData[stopId] = []
        }
      }
      
      return activitiesData
    } catch (error) {
      console.error("Error fetching activities:", error)
      toast.error("Failed to load activities")
      return {}
    } finally {
      setIsLoading(false)
    }
  }, [fetchActivitiesByStopId])

  const fetchAllActivitiesForStops = useCallback(async (stopIds: string[]): Promise<ActivityItem[]> => {
    try {
      setIsLoading(true)
      const allActivities: ActivityItem[] = []
      
      for (const stopId of stopIds) {
        try {
          const activities = await fetchActivitiesByStopId(stopId)
          allActivities.push(...activities)
        } catch (error) {
          console.error(`Error fetching activities for stop ${stopId}:`, error)
        }
      }
      
      return allActivities
    } catch (error) {
      console.error("Error fetching all activities:", error)
      toast.error("Failed to load activities")
      return []
    } finally {
      setIsLoading(false)
    }
  }, [fetchActivitiesByStopId])

  const createActivity = useCallback(async (activityData: NewActivityData): Promise<ActivityItem | null> => {
    try {
      setIsSubmitting(true)
      
      const response = await databases.createDocument(
        DATABASE_ID,
        ACTIVITIES_COLLECTION_ID,
        ID.unique(),
        activityData
      )

      const newActivity = response as unknown as ActivityItem
      toast.success("Activity added successfully!")
      return newActivity
    } catch (error: any) {
      console.error("Error creating activity:", error)
      toast.error("Failed to add activity")
      return null
    } finally {
      setIsSubmitting(false)
    }
  }, [])

  const updateActivity = useCallback(async (activityId: string, updateData: Partial<NewActivityData>): Promise<ActivityItem | null> => {
    try {
      setIsSubmitting(true)
      
      const response = await databases.updateDocument(
        DATABASE_ID,
        ACTIVITIES_COLLECTION_ID,
        activityId,
        updateData
      )

      const updatedActivity = response as unknown as ActivityItem
      toast.success("Activity updated successfully!")
      return updatedActivity
    } catch (error: any) {
      console.error("Error updating activity:", error)
      toast.error("Failed to update activity")
      return null
    } finally {
      setIsSubmitting(false)
    }
  }, [])

  const deleteActivity = useCallback(async (activityId: string): Promise<boolean> => {
    try {
      await databases.deleteDocument(
        DATABASE_ID,
        ACTIVITIES_COLLECTION_ID,
        activityId
      )

      toast.success("Activity deleted successfully!")
      return true
    } catch (error: any) {
      console.error("Error deleting activity:", error)
      toast.error("Failed to delete activity")
      return false
    }
  }, [])

  const deleteActivitiesByStopId = useCallback(async (stopId: string): Promise<boolean> => {
    try {
      const activities = await fetchActivitiesByStopId(stopId)
      
      for (const activity of activities) {
        await deleteActivity(activity.$id)
      }

      return true
    } catch (error: any) {
      console.error("Error deleting activities for stop:", error)
      return false
    }
  }, [fetchActivitiesByStopId, deleteActivity])

  return {
    isLoading,
    isSubmitting,
    fetchActivitiesByStopId,
    fetchActivitiesByStopIds,
    fetchAllActivitiesForStops,
    createActivity,
    updateActivity,
    deleteActivity,
    deleteActivitiesByStopId,
  }
}

export type { ActivityItem, NewActivityData }
