import Loader from "../components/loader"

interface FullScreenLoaderProps {
  message?: string
  isVisible?: boolean
}

export default function FullScreenLoader({
  message = "Loading your experience...",
  isVisible = true,
}: FullScreenLoaderProps) {
  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23d97706' fillOpacity='0.1'%3E%3Cpath d='M30 30c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20zm0 0c0 11.046 8.954 20 20 20s20-8.954 20-20-8.954-20-20-20-20 8.954-20 20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
      </div>

      {/* Floating decorative elements */}
      <div className="absolute top-20 left-20 animate-float">
        <div className="w-4 h-4 bg-amber-400 rounded-full opacity-60"></div>
      </div>
      <div className="absolute top-40 right-32 animate-float delay-1000">
        <div className="w-6 h-6 bg-orange-400 rounded-full opacity-40"></div>
      </div>
      <div className="absolute bottom-32 left-32 animate-float delay-500">
        <div className="w-3 h-3 bg-yellow-400 rounded-full opacity-50"></div>
      </div>
      <div className="absolute bottom-20 right-20 animate-float delay-1500">
        <div className="w-5 h-5 bg-amber-500 rounded-full opacity-30"></div>
      </div>

      {/* Main loader */}
      <div className="relative z-10">
        <Loader size="xl" message={message} />

        {/* Brand name */}
        <div className="text-center mt-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-600 via-orange-600 to-yellow-600 bg-clip-text text-transparent">
            Vivah Art Studio
          </h1>
          <p className="text-amber-700 mt-2 font-medium">Crafting Beautiful Moments</p>
        </div>
      </div>

      {/* Custom CSS for floating animation */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
