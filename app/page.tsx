"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import {
  Globe,
  MapPin,
  Calendar,
  Users,
  Star,
  Plane,
  Camera,
  Heart,
  TrendingUp,
  ArrowRight,
  Check,
  Play,
  Sparkles,
  Mountain,
  Waves,
  Sun,
  Quote,
} from "lucide-react"
import Link from "next/link"

// Animated counter hook
const useCountUp = (end: number, duration: number = 2000) => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let startTime: number
    let animationFrame: number

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)
      
      setCount(Math.floor(progress * end))
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [end, duration])

  return count
}

// Floating animation component
const FloatingElement = ({ children, delay = 0, className = "" }: any) => {
  return (
    <div 
      className={`animate-float ${className}`}
      style={{ 
        animationDelay: `${delay}s`,
        animationDuration: '6s',
        animationIterationCount: 'infinite',
      }}
    >
      {children}
    </div>
  )
}

export default function LandingPage() {
  const router = useRouter()
  const [isVisible, setIsVisible] = useState(false)
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  const tripCount = useCountUp(12500)
  const userCount = useCountUp(8900)
  const destinationCount = useCountUp(195)

  useEffect(() => {
    setIsVisible(true)
    
    // Testimonial rotation
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    
    return () => clearInterval(interval)
  }, [])

  const features = [
    {
      icon: Globe,
      title: "Global Destinations",
      description: "Explore 195+ countries with personalized recommendations"
    },
    {
      icon: Calendar,
      title: "Smart Planning",
      description: "Itinerary suggestions and scheduling"
    },
    {
      icon: Users,
      title: "Travel Community",
      description: "Connect with fellow travelers and share experiences"
    },
    {
      icon: TrendingUp,
      title: "Budget Tracking",
      description: "Real-time expense tracking and budget optimization"
    }
  ]

  const destinations = [
    {
      name: "Tokyo, Japan",
      image: "/tokyo-skyline-night.png",
      rating: 4.9,
      trips: "2.3k",
      tag: "Cultural"
    },
    {
      name: "Santorini, Greece",
      image: "/santorini-sunset.png",
      rating: 4.8,
      trips: "1.8k",
      tag: "Romantic"
    },
    {
      name: "Bali, Indonesia",
      image: "/bali-temple.png",
      rating: 4.7,
      trips: "3.1k",
      tag: "Adventure"
    }
  ]

  const testimonials = [
    {
      text: "GlobeTrotter made planning my dream trip to India effortless. The suggestions were spot-on!",
      author: "Sarah Chen",
      role: "Digital Nomad",
      avatar: "/woman-profile.png"
    },
    {
      text: "The budget tracking feature saved me hundreds of dollars. I knew exactly where my money was going.",
      author: "Mike Rodriguez", 
      role: "Travel Blogger",
      avatar: "/man-profile.png"
    },
    {
      text: "I've connected with amazing travelers through the community. It's like having local friends everywhere!",
      author: "Emma Thompson",
      role: "Adventure Seeker", 
      avatar: "/woman-profile-two.png"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 overflow-hidden">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <FloatingElement delay={0} className="absolute top-20 left-10 text-blue-200 opacity-50">
          <Plane className="w-8 h-8" />
        </FloatingElement>
        <FloatingElement delay={1} className="absolute top-40 right-20 text-orange-200 opacity-50">
          <Mountain className="w-12 h-12" />
        </FloatingElement>
        <FloatingElement delay={2} className="absolute bottom-40 left-20 text-blue-300 opacity-50">
          <Waves className="w-10 h-10" />
        </FloatingElement>
        <FloatingElement delay={3} className="absolute bottom-20 right-10 text-yellow-300 opacity-50">
          <Sun className="w-8 h-8" />
        </FloatingElement>
      </div>

      

      {/* Hero Section */}
      <section className="relative z-10 px-4 py-20">
        <div className="max-w-7xl mx-auto text-center">
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full text-blue-700 text-sm font-medium mb-8">
              <Sparkles className="w-4 h-4 mr-2" />
              #1 Travel Planning Platform
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Your Next
              <span className="bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
                {" "}Adventure{" "}
              </span>
              Starts Here
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Plan extraordinary trips with recommendations, connect with travelers worldwide, 
              and turn your wanderlust into unforgettable memories.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link href="/auth/signup">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600 text-white shadow-lg px-8 py-4 text-lg">
                  Start Planning Now
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {tripCount.toLocaleString()}+
                </div>
                <div className="text-gray-600">Trips Planned</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-orange-500 mb-2">
                  {userCount.toLocaleString()}+
                </div>
                <div className="text-gray-600">Happy Travelers</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">
                  {destinationCount}+
                </div>
                <div className="text-gray-600">Countries</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 px-4 py-20 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Plan the Perfect Trip
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From initial inspiration to final memories, we've got every step of your journey covered.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className={`group transform transition-all duration-500 hover:scale-105 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <feature.icon className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      

      {/* Testimonials */}
      <section className="relative z-10 px-4 py-20 bg-gradient-to-r from-blue-600 to-orange-500">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-16">
            What Travelers Say About Us
          </h2>

          <div className="relative">
            <Card className="border-0 shadow-2xl bg-white/10 backdrop-blur-sm text-white">
              <CardContent className="p-8">
                <Quote className="w-12 h-12 text-white/50 mx-auto mb-6" />
                <p className="text-xl leading-relaxed mb-6">
                  "{testimonials[currentTestimonial].text}"
                </p>
                <div className="flex items-center justify-center">
                  <img 
                    src={testimonials[currentTestimonial].avatar}
                    alt={testimonials[currentTestimonial].author}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div className="text-left">
                    <div className="font-semibold">
                      {testimonials[currentTestimonial].author}
                    </div>
                    <div className="text-white/70 text-sm">
                      {testimonials[currentTestimonial].role}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Testimonial indicators */}
            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentTestimonial ? 'bg-white' : 'bg-white/30'
                  }`}
                  onClick={() => setCurrentTestimonial(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-4 py-20 bg-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Start Your Adventure?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of travelers who trust GlobeTrotter to plan their perfect trips. 
            Start planning your next adventure today.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/auth/signup">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600 text-white shadow-lg px-8 py-4 text-lg">
                Get Started Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            
          </div>

          <div className="mt-8 flex items-center justify-center text-gray-400 text-sm">
            <Check className="w-4 h-4 mr-2" />
            Free to get started • No credit card required • Cancel anytime
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-4 py-12 bg-gray-900 border-t border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-orange-500 rounded-lg flex items-center justify-center">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">GlobeTrotter</span>
            </div>
            
            <div className="text-gray-400 text-sm">
              © 2024 GlobeTrotter. All rights reserved.
            </div>
          </div>
        </div>
      </footer>

      {/* Custom CSS for animations */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-10px) rotate(2deg); }
          66% { transform: translateY(5px) rotate(-2deg); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
