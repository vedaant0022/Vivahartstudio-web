"use client"

import type React from "react"
import { useNavigate } from "react-router-dom"
import { X, User, Heart, ShoppingCart, Gift, Sparkles, Crown, Star } from "lucide-react"
import { Button } from "./button"

interface LoginReminderModalProps {
  isOpen: boolean
  onClose: () => void
}

export const LoginReminderModal: React.FC<LoginReminderModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate()

  if (!isOpen) return null

  const handleSignIn = (e: React.MouseEvent) => {
    e.stopPropagation()
    navigate("/authpage")
    onClose()
  }

  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Enhanced Backdrop */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-black/40 via-purple/20 to-amber-900/30 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div 
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden transform animate-in zoom-in-95 duration-300"
        onClick={handleModalClick}
      >
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-amber-200/30 to-orange-200/30 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-tr from-purple-200/30 to-pink-200/30 rounded-full blur-3xl"></div>
        </div>

        {/* Floating Decorative Icons */}
        <div className="absolute top-6 left-6 animate-bounce">
          <div className="p-2 bg-gradient-to-r from-amber-400 to-orange-400 rounded-xl shadow-lg rotate-12">
            <Crown className="h-4 w-4 text-white" />
          </div>
        </div>
        <div className="absolute top-8 right-16 animate-pulse">
          <div className="p-1.5 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg shadow-lg -rotate-12">
            <Sparkles className="h-3 w-3 text-white" />
          </div>
        </div>
        <div className="absolute bottom-8 left-8 animate-bounce delay-300">
          <div className="p-1.5 bg-gradient-to-r from-pink-400 to-rose-400 rounded-lg shadow-lg rotate-45">
            <Star className="h-3 w-3 text-white" />
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200 hover:scale-110"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header Section */}
        <div className="relative pt-8 pb-6 px-8 text-center">
          {/* Main Icon */}
          <div className="relative mb-6">
            <div className="w-20 h-20 mx-auto bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-2xl animate-in zoom-in-50 duration-500 delay-200">
              <User className="w-10 h-10 text-white" />
            </div>
            <div className="absolute inset-0 w-20 h-20 mx-auto bg-gradient-to-r from-amber-400 to-orange-400 rounded-full animate-ping opacity-20"></div>
          </div>

          {/* Title */}
          <h3 className="text-2xl font-bold text-gray-900 mb-3 animate-in slide-in-from-bottom-4 duration-500 delay-300">
            Welcome Back! 👋
          </h3>

          {/* Subtitle */}
          <p className="text-gray-600 leading-relaxed animate-in slide-in-from-bottom-4 duration-500 delay-400">
            Sign in to unlock your personalized shopping experience and access exclusive features!
          </p>
        </div>

        {/* Features Section */}
        <div className="px-8 pb-6">
          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-100 animate-in slide-in-from-left-4 duration-500 delay-500">
              <div className="p-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg shadow-sm">
                <ShoppingCart className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Save Your Cart</p>
                <p className="text-xs text-gray-600">Keep items safe across devices</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100 animate-in slide-in-from-right-4 duration-500 delay-600">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg shadow-sm">
                <Heart className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Create Wishlist</p>
                <p className="text-xs text-gray-600">Save favorites for later</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100 animate-in slide-in-from-left-4 duration-500 delay-700">
              <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg shadow-sm">
                <Gift className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Exclusive Offers</p>
                <p className="text-xs text-gray-600">Get member-only discounts</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="relative px-8 pb-8 space-y-3">
          <Button
            onClick={handleSignIn}
            className="relative w-full bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-600 hover:via-orange-600 hover:to-red-600 text-white font-semibold py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all delay-800"
          >
            <User className="w-5 h-5 mr-2" />
            Sign In to Your Account
          </Button>

          <Button
            onClick={(e) => {
              e.stopPropagation()
              onClose()
            }}
            variant="outline"
            className="relative w-full border-2 border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 py-4 rounded-2xl transition-all duration-300 font-medium animate-in slide-in-from-bottom-4 delay-900 bg-transparent"
          >
            Continue as Guest
          </Button>
        </div>

        {/* Bottom Decorative Element */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500"></div>
      </div>

      {/* Custom CSS for animations */}
        <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(180deg); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
