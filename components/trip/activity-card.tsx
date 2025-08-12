"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Clock, 
  DollarSign, 
  MapPin, 
  Edit, 
  Trash2,
  Camera,
  Utensils,
  ShoppingBag,
  Activity,
  Music,
  Car,
  Home
} from "lucide-react"

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

interface ActivityCardProps {
  activity: ActivityItem
  stopName?: string
  onEdit?: (activity: ActivityItem) => void
  onDelete?: (activityId: string) => void
  showActions?: boolean
  compact?: boolean
}

const categoryIcons = {
  sightseeing: Camera,
  food: Utensils,
  entertainment: Music,
  shopping: ShoppingBag,
  outdoor: Activity,
  culture: Camera,
  transport: Car,
  accommodation: Home,
  other: Activity,
}

const categoryColors = {
  sightseeing: "bg-blue-100 text-blue-800",
  food: "bg-orange-100 text-orange-800",
  entertainment: "bg-purple-100 text-purple-800",
  shopping: "bg-green-100 text-green-800",
  outdoor: "bg-emerald-100 text-emerald-800",
  culture: "bg-indigo-100 text-indigo-800",
  transport: "bg-gray-100 text-gray-800",
  accommodation: "bg-yellow-100 text-yellow-800",
  other: "bg-slate-100 text-slate-800",
}

export function ActivityCard({ 
  activity, 
  stopName, 
  onEdit, 
  onDelete, 
  showActions = true,
  compact = false 
}: ActivityCardProps) {
  const IconComponent = categoryIcons[activity.category as keyof typeof categoryIcons]
  
  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}h ${mins > 0 ? `${mins}m` : ''}`
    }
    return `${mins}m`
  }

  if (compact) {
    return (
      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center flex-1">
          <IconComponent className="w-4 h-4 text-muted-foreground mr-2" />
          <div className="flex-1">
            <div className="font-medium text-sm">{activity.name}</div>
            <div className="text-xs text-muted-foreground">
              {new Date(activity.scheduledDate).toLocaleDateString()} at {formatTime(activity.scheduledTime)}
              {activity.location && ` • ${activity.location}`}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {activity.cost > 0 && (
            <Badge variant="outline" className="text-xs">
              ${activity.cost}
            </Badge>
          )}
          {showActions && (
            <>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => onEdit?.(activity)}
              >
                <Edit className="w-3 h-3" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => onDelete?.(activity.$id)}
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
      <div className="flex items-center flex-1">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white mr-4">
          <IconComponent className="w-5 h-5 text-gray-600" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-medium">{activity.name}</h4>
            <Badge className={categoryColors[activity.category as keyof typeof categoryColors]}>
              {activity.category}
            </Badge>
          </div>
          <div className="text-sm text-muted-foreground space-y-1">
            <div className="flex items-center gap-4">
              <span className="flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                {formatTime(activity.scheduledTime)} ({formatDuration(activity.duration)})
              </span>
              {stopName && (
                <span className="flex items-center">
                  <MapPin className="w-3 h-3 mr-1" />
                  {stopName}
                </span>
              )}
              {activity.cost > 0 && (
                <span className="flex items-center">
                  <DollarSign className="w-3 h-3 mr-1" />
                  ${activity.cost.toFixed(2)}
                </span>
              )}
            </div>
            {activity.location && (
              <p className="text-xs">{activity.location}</p>
            )}
            {activity.description && (
              <p className="text-xs">{activity.description}</p>
            )}
          </div>
        </div>
      </div>
      {showActions && (
        <div className="flex items-center gap-2 ml-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit?.(activity)}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete?.(activity.$id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  )
}

export { categoryIcons, categoryColors }
export type { ActivityItem }
