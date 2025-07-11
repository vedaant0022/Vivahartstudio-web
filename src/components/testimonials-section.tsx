"use client"

import { useState, useEffect } from "react"
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"

interface Testimonial {
  id: number
  name: string
  review: string
  rating: number
  image: string
  location?: string
  product?: string
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Aarti Sharma",
    review:
      "The handmade rakhi I ordered was absolutely beautiful and so unique! You can feel the love and effort put into the design. My brother loved it!",
    rating: 5,
    image: "/placeholder.svg?height=80&width=80",
    location: "Mumbai",
    product: "Handmade Rakhi",
  },
  {
    id: 2,
    name: "Rohan Mehta",
    review:
      "Great quality and fast delivery. The packaging was lovely, and the product matched the pictures perfectly. Will definitely order again for Diwali gifts!",
    rating: 5,
    image: "/placeholder.svg?height=80&width=80",
    location: "Delhi",
    product: "Festive Collection",
  },
  {
    id: 3,
    name: "Sneha Kulkarni",
    review:
      "Vivah Arts Studio has become my go-to place for festive shopping. Their rakhis are not just rakhis – they're little works of art!",
    rating: 5,
    image: "/placeholder.svg?height=80&width=80",
    location: "Pune",
    product: "Art Rakhis",
  },
  {
    id: 4,
    name: "Kavya Desai",
    review:
      "Loved the eco-friendly touch and attention to detail. The rakhi I ordered came with a sweet message card – such a thoughtful gesture!",
    rating: 5,
    image: "/placeholder.svg?height=80&width=80",
    location: "Bangalore",
    product: "Eco-Friendly Rakhi",
  },
  {
    id: 5,
    name: "Neha & Ankit",
    review:
      "We ordered bulk handmade rakhis for our office Raksha Bandhan event – everyone was impressed! Each one was different and beautifully made.",
    rating: 5,
    image: "/placeholder.svg?height=80&width=80",
    location: "Gurgaon",
    product: "Bulk Order",
  },
  {
    id: 6,
    name: "Priya Bhargava",
    review:
      "Their festive collection is so elegant and affordable. Got compliments on everything I ordered – especially the candles and gift boxes!",
    rating: 5,
    image: "/placeholder.svg?height=80&width=80",
    location: "Hyderabad",
    product: "Gift Collection",
  },
]

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    setIsAutoPlaying(false)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
    setIsAutoPlaying(false)
  }

  const goToTestimonial = (index: number) => {
    setCurrentIndex(index)
    setIsAutoPlaying(false)
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`w-5 h-5 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
    ))
  }

  return (
    <section className="py-16 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23d97706' fillOpacity='0.1'%3E%3Cpath d='M30 30c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20zm0 0c0 11.046 8.954 20 20 20s20-8.954 20-20-8.954-20-20-20-20 8.954-20 20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">


        {/* Main Testimonial Display */}
        <div className="relative max-w-4xl mx-auto mb-12">
          <Card className="bg-white/95 backdrop-blur-sm border-2 border-purple-200 shadow-2xl rounded-3xl overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-purple-400 via-yellow-500 to-orange-400"></div>
            <CardContent className="p-8 md:p-12">
              <div className="flex flex-col md:flex-row items-center gap-8">
                {/* Customer Image */}
                <div className="flex-shrink-0">
                  <div className="relative">
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-purple-200 shadow-lg">
                        <img
                        src={testimonials[currentIndex].image || "/placeholder.svg"}
                        alt={testimonials[currentIndex].name}
                        width={128}
                        height={128}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-400 to-orange-400 rounded-full p-2 shadow-lg">
                      <Quote className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </div>

                {/* Testimonial Content */}
                <div className="flex-1 text-center md:text-left">
                  <div className="flex justify-center md:justify-start mb-4">
                    {renderStars(testimonials[currentIndex].rating)}
                  </div>

                  <blockquote className="text-lg md:text-xl text-gray-700 mb-6 leading-relaxed italic">
                    "{testimonials[currentIndex].review}"
                  </blockquote>

                  <div className="space-y-2">
                    <h4 className="text-xl font-bold text-purple-900">{testimonials[currentIndex].name}</h4>
                    <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-2 text-sm text-purple-700">
                      {testimonials[currentIndex].location && (
                        <span className="flex items-center gap-1">📍 {testimonials[currentIndex].location}</span>
                      )}
                      {testimonials[currentIndex].product && (
                        <>
                          <span className="hidden sm:inline">•</span>
                          <span className="bg-purple-100 px-3 py-1 rounded-full font-medium">
                            {testimonials[currentIndex].product}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Navigation Arrows */}
          <Button
            variant="outline"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm border-2 border-purple-200 hover:bg-purple-50 shadow-lg"
            onClick={prevTestimonial}
          >
            <ChevronLeft className="w-6 h-6 text-purple-600" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm border-2 border-purple-200 hover:bg-purple-50 shadow-lg"
            onClick={nextTestimonial}
          >
            <ChevronRight className="w-6 h-6 text-purple-600" />
          </Button>
        </div>

        {/* Testimonial Dots */}
        <div className="flex justify-center gap-3 mb-12">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => goToTestimonial(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex ? "bg-purple-500 scale-125 shadow-lg" : "bg-purple-200 hover:bg-purple-300"
              }`}
            />
          ))}
        </div>

        {/* Stats Section */}

      </div>
    </section>
  )
}
