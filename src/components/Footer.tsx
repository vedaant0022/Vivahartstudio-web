"use client"

import type React from "react"

import { useState } from "react"
import { Link } from "react-router-dom"  
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { toast } from "react-toastify"   
import {
  Heart,
  Mail,
  Phone,
  MapPin,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  Send,
  Sparkles,
  Gift,
  Award,
  Shield,
  Truck,
} from "lucide-react"

export default function Footer() {
  const [email, setEmail] = useState("")
  const [isSubscribing, setIsSubscribing] = useState(false)

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsSubscribing(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast.success("Successfully Subscribed! 🎉", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      })
      setEmail("")
    } catch (error) {
      toast.error("Subscription Failed", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      })
    } finally {
      setIsSubscribing(false)
    }
  }


  const features = [
    { icon: Shield, text: "Secure Payments" },
    { icon: Truck, text: "Free Shipping*" },
    { icon: Award, text: "Quality Assured" },
    { icon: Gift, text: "Gift Wrapping" },
  ]

  return (
    <footer className="relative bg-gradient-to-br from-amber-900 via-orange-900 to-red-900 text-white overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-yellow-400/20 to-orange-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-red-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-amber-300/10 to-orange-300/10 rounded-full blur-3xl"></div>
      </div>

      {/* Floating Decorative Hearts */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="absolute animate-float"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          >
            <Heart
              className={`text-pink-300/30 ${Math.random() > 0.5 ? "w-4 h-4" : "w-6 h-6"} animate-pulse`}
              fill="currentColor"
            />
          </div>
        ))}
      </div>

      <div className="relative z-10">
        {/* Top Section with Features */}
        <div className="border-b border-white/20 py-8">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3 group">
                  <div className="p-3 bg-white/10 backdrop-blur-sm rounded-2xl group-hover:bg-white/20 transition-all duration-300">
                    <feature.icon className="w-6 h-6 text-yellow-300" />
                  </div>
                  <span className="font-medium text-white/90">{feature.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
              {/* Brand Section */}
              <div className="lg:col-span-1">
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl shadow-lg">
                      <Sparkles className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">Vivah Art Studio</h2>
                      <p className="text-yellow-300 text-sm font-medium">Crafting Beautiful Moments</p>
                    </div>
                  </div>
                  <p className="text-white/80 leading-relaxed mb-6">
                    At Vivah Arts Studio, we celebrate the beauty of Indian festivals through handcrafted rakhis and
                    curated festive products made with love and tradition. Each piece reflects culture, emotions, and
                    the joy of giving.
                  </p>
                </div>


              </div>

              {/* Quick Links */}
              <div>
                {/* Contact Info */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-white/80">
                    <Phone className="w-4 h-4 text-yellow-300" />
                    <span>+91 98765 43210</span>
                  </div>
                  <div className="flex items-center gap-3 text-white/80">
                    <Mail className="w-4 h-4 text-yellow-300" />
                    <span>hello@vivahartstudio.com</span>
                  </div>
                  <div className="flex items-start gap-3 text-white/80">
                    <MapPin className="w-4 h-4 text-yellow-300 mt-1" />
                    <span>123 Craft Street, Mumbai, Maharashtra 400001</span>
                  </div>
                </div>

                {/* Social Links */}
                <div className="flex gap-4">
                  {[
                    { icon: Instagram, href: "https://instagram.com", color: "hover:bg-pink-500" },
                    { icon: Facebook, href: "https://facebook.com", color: "hover:bg-blue-500" },
                    { icon: Twitter, href: "https://twitter.com", color: "hover:bg-sky-500" },
                    { icon: Youtube, href: "https://youtube.com", color: "hover:bg-red-500" },
                  ].map((social, index) => (
                    <a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`p-3 bg-white/10 backdrop-blur-sm rounded-xl ${social.color} transition-all duration-300 hover:scale-110 hover:shadow-lg group`}
                    >
                      <social.icon className="w-5 h-5 text-white group-hover:text-white" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Categories */}

              {/* Newsletter */}
              <div>
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Mail className="w-5 h-5 text-yellow-300" />
                  Stay Connected
                </h3>
                <p className="text-white/80 mb-6 leading-relaxed">
                  Subscribe to get special offers, free giveaways, and exclusive updates on our latest collections!
                </p>

                {/* Newsletter Benefits */}
                <div className="mt-6 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-white/70">
                    <div className="w-1.5 h-1.5 bg-yellow-300 rounded-full"></div>
                    <span>Exclusive festival offers</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-white/70">
                    <div className="w-1.5 h-1.5 bg-yellow-300 rounded-full"></div>
                    <span>Early access to new collections</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-white/70">
                    <div className="w-1.5 h-1.5 bg-yellow-300 rounded-full"></div>
                    <span>Crafting tips and tutorials</span>
                  </div>
                </div>
              </div>
              <div>
              <form onSubmit={handleSubscribe} className="space-y-4">
                  <div className="relative">
                    <Input
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full h-12 pl-4 pr-12 bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-xl text-white placeholder:text-white/60 focus:border-yellow-300 focus:ring-yellow-300"
                      required
                    />
                    <Mail className="absolute right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/60" />
                  </div>
                  <Button
                    type="submit"
                    disabled={isSubscribing}
                    className="w-full h-12 bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    {isSubscribing ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Subscribing...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Send className="w-4 h-4" />
                        Subscribe Now
                      </div>
                    )}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/20 py-8">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2 text-white/80">
                <Heart className="w-4 h-4 text-pink-300" fill="currentColor" />
                <span>© 2025 Blue9 Technologies. All rights reserved.</span>
              </div>
              <div className="flex items-center gap-6 text-sm text-white/70">
                <Link to="/terms" className="hover:text-yellow-300 transition-colors duration-300">
                  Terms of Service
                </Link>
                <Link to="/privacy" className="hover:text-yellow-300 transition-colors duration-300">
                  Privacy Policy
                </Link>
                  <Link to="/cookies" className="hover:text-yellow-300 transition-colors duration-300">
                  Cookie Policy
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for floating animation */}
      <style >{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
    </footer>
  )
}
