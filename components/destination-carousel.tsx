"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, MapPin, Star } from "lucide-react"

interface Destination {
  id: string
  name: string
  country: string
  image: string
  rating: number
  description: string
}

const destinations: Destination[] = [
  
  {
    id: "1",
    name: "Goa",
    country: "India",
    image: "/goa.png",
    rating: 4.6,
    description: "Beautiful beaches and vibrant nightlife",
  },
  
  {
    id: "2",
    name: "Jaipur",
    country: "India",
    image: "/jaipur_webp.webp",
    rating: 4.5,
    description: "Pink city with royal palaces",
  },
  {
    id: "3",
    name: "Kerala",
    country: "India",
    image: "/kerela.png",
    rating: 4.7,
    description: "God's own country with backwaters",
  },
  
  {
    id: "4",
    name: "Rajasthan",
    country: "India",
    image: "/rajasthan_royal_webp.webp",
    rating: 4.6,
    description: "Royal heritage and desert adventures",
  },
  
  
  {
    id: "5",
    name: "Udaipur",
    country: "India",
    image: "/udaipur_png.png",
    rating: 4.8,
    description: "City of lakes and royal palaces",
  },
]

export default function DestinationCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex === destinations.length - 1 ? 0 : prevIndex + 1))
    }, 4000)

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? destinations.length - 1 : currentIndex - 1)
    setIsAutoPlaying(false)
  }

  const goToNext = () => {
    setCurrentIndex(currentIndex === destinations.length - 1 ? 0 : currentIndex + 1)
    setIsAutoPlaying(false)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
    setIsAutoPlaying(false)
  }

  return (
    <div className="relative w-full">
      <div className="overflow-hidden rounded-lg">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {destinations.map((destination) => (
            <div key={destination.id} className="w-full flex-shrink-0">
              <Card className="overflow-hidden">
                <div className="relative h-64 md:h-80">
                  <img
                    src={destination.image || "/placeholder.svg"}
                    alt={destination.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/diverse-travel-destinations.png"
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-2xl font-bold mb-1">{destination.name}</h3>
                        <div className="flex items-center text-sm mb-2">
                          <MapPin className="w-4 h-4 mr-1" />
                          {destination.country}
                        </div>
                        <p className="text-sm opacity-90">{destination.description}</p>
                      </div>
                      <div className="flex items-center bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                        <Star className="w-4 h-4 text-yellow-400 mr-1" />
                        <span className="text-sm font-medium">{destination.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <Button
        variant="outline"
        size="icon"
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm hover:bg-white/90"
        onClick={goToPrevious}
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm hover:bg-white/90"
        onClick={goToNext}
      >
        <ChevronRight className="w-4 h-4" />
      </Button>

      {/* Dots Indicator */}
      <div className="flex justify-center space-x-2 mt-4">
        {destinations.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentIndex ? "bg-blue-600" : "bg-gray-300 hover:bg-gray-400"
            }`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </div>
  )
}