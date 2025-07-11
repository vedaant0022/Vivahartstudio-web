"use client"

import { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { CheckCircle, Package, Clock, Home, Download, Share2, MapPin, IndianRupee } from "lucide-react"
import { Button } from "../components/ui/button"
import { Card, CardContent } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Separator } from "../components/ui/separator"
import FullScreenLoader from "../components/Fullscreenloder"

interface OrderItem {
  product: {
    _id: string
    name: string
    images: Array<{
      url: string
      key: string
      _id: string
    }>
    description: string
    shortDescription: string
    sellingPrice: string
    totalStock: number
    isActive: boolean
  }
  quantity: number
  price: number
  _id: string
}

interface ShippingAddress {
  street: string
  city: string
  state: string
  postalCode: string
  country: string
}

interface OrderDetails {
  _id: string
  user: string
  items: OrderItem[]
  totalAmount?: number
  shippingCharges?: number
  paymentMethod: string
  paymentStatus: string
  razorpayOrderId: string
  status: string
  deliveryStatus: string
  shippingAddress: ShippingAddress
  createdAt: string
  updatedAt: string
}

export default function OrderConfirmation() {
  const [countdown, setCountdown] = useState(15)
  const [isRedirecting, setIsRedirecting] = useState(false)
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { orderId, transactionId } = useLocation().state || {}
  const navigate = useNavigate()

  // Fetch order details
  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) {
        setError("Order ID not provided")
        setLoading(false)
        return
      }

      try {
        const token = localStorage.getItem("token")
        const response = await fetch(`http://43.204.212.179:8585/api/orders/${orderId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch order details")
        }

        const data = await response.json()
        console.log('Order Details:', data); // Debug log
        setOrderDetails(data)
      } catch (err) {
        setError("Failed to load order details")
        console.error("Error fetching order:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchOrderDetails()
  }, [orderId])

  // Countdown timer
  useEffect(() => {
    if (loading) return

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setIsRedirecting(true)
          setTimeout(() => {
            navigate("/")
          }, 500)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [navigate, loading])

  const handleGoHome = () => {
    setIsRedirecting(true)
    navigate("/")
  }

  const handleViewOrder = () => {
    navigate("/profile?tab=orders")
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Safe number formatting function
  const formatPrice = (value?: number) => {
    return value ? value.toFixed(2) : "0.00"
  }

  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }, []);
  if (isLoading) {
    return <FullScreenLoader message="Loading your experience..." isVisible={isLoading} />;
  }

  if (error || !orderDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-rose-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Unable to Load Order</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={handleGoHome} className="bg-gradient-to-r from-amber-500 to-orange-500">
              Go to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-green-200/30 to-emerald-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-teal-200/30 to-green-200/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-emerald-100/20 to-green-100/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="absolute top-20 left-20 animate-bounce">
        <div className="p-3 bg-gradient-to-r from-green-400 to-emerald-400 rounded-2xl shadow-lg rotate-12">
          <CheckCircle className="h-6 w-6 text-white" />
        </div>
      </div>
      <div className="absolute top-40 right-32 animate-pulse">
        <div className="p-2 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-xl shadow-lg -rotate-12">
          <Package className="h-5 w-5 text-white" />
        </div>
      </div>
      <div className="absolute bottom-32 left-32 animate-bounce delay-300">
        <div className="p-3 bg-gradient-to-r from-teal-400 to-green-500 rounded-2xl shadow-lg rotate-45">
          <CheckCircle className="h-6 w-6 text-white" />
        </div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-4xl">
          <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-xl rounded-3xl overflow-hidden transform animate-in slide-in-from-bottom-4 duration-700">
            <div className="h-2 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-400"></div>

            <CardContent className="p-8 md:p-12">
              <div className="text-center mb-8">
                <div className="relative mb-6">
                  <div className="w-24 h-24 mx-auto bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-2xl animate-in zoom-in-50 duration-500 delay-200">
                    <CheckCircle className="w-12 h-12 text-white" />
                  </div>
                  <div className="absolute inset-0 w-24 h-24 mx-auto bg-gradient-to-r from-green-400 to-emerald-400 rounded-full animate-ping opacity-20"></div>
                </div>

                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Order Confirmed! 🎉</h1>
                <p className="text-xl text-gray-600 mb-2">Thank you for your purchase!</p>
                <p className="text-gray-500">Your order has been successfully placed and is being processed.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Package className="w-5 h-5 text-green-600" />
                    Order Information
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Order ID:</span>
                      <span className="font-mono font-semibold text-gray-900">#{orderDetails._id.slice(-8)}</span>
                    </div>
                    {transactionId && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Transaction ID:</span>
                        <span className="font-mono font-semibold text-gray-900">#{transactionId.slice(-8)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Razorpay Order ID:</span>
                      <span className="font-mono font-semibold text-gray-900">{orderDetails.razorpayOrderId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Method:</span>
                      <span className="font-semibold text-gray-900">{orderDetails.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Order Date:</span>
                      <span className="font-semibold text-gray-900">{formatDate(orderDetails.createdAt)}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <IndianRupee className="w-5 h-5 text-blue-600" />
                    Payment Summary
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="font-semibold text-gray-900 flex items-center">
                        <IndianRupee className="w-3 h-3" />
                        {formatPrice(orderDetails.totalAmount)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping:</span>
                      <span className="font-semibold text-gray-900 flex items-center">
                        <IndianRupee className="w-3 h-3" />
                        {formatPrice(orderDetails.shippingCharges)}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg">
                      <span className="font-semibold text-gray-900">Total Paid:</span>
                      <span className="font-bold text-green-600 flex items-center">
                        <IndianRupee className="w-4 h-4" />
                        {formatPrice(
                          orderDetails.totalAmount != null && orderDetails.shippingCharges != null
                            ? orderDetails.totalAmount + orderDetails.shippingCharges
                            : undefined
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Status:</span>
                      <Badge
                        className={
                          orderDetails.paymentStatus === "Completed"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }
                      >
                        {orderDetails.paymentStatus}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5 text-amber-600" />
                  Order Items ({orderDetails.items.length})
                </h3>
                <div className="space-y-4">
                  {orderDetails.items.map((item) => (
                    <div
                      key={item._id}
                      className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200 shadow-sm"
                    >
                      <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={item.product.images[0]?.url || "/placeholder.svg"}
                          alt={item.product.name}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{item.product.name}</h4>
                        <p className="text-sm text-gray-600">{item.product.shortDescription}</p>
                        <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900 flex items-center">
                          <IndianRupee className="w-4 h-4" />
                          {formatPrice(item.price)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-purple-600" />
                  Shipping Address
                </h3>
                <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                  <div className="text-gray-700">
                    <p className="font-medium">{orderDetails.shippingAddress.street}</p>
                    <p>
                      {orderDetails.shippingAddress.city}, {orderDetails.shippingAddress.state}
                    </p>
                    <p>
                      {orderDetails.shippingAddress.postalCode}, {orderDetails.shippingAddress.country}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-8">
                <h3 className="font-semibold text-amber-900 mb-3 flex items-center justify-center gap-2">
                  <Clock className="w-5 h-5" />
                  What happens next?
                </h3>
                <div className="text-sm text-amber-800 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                    <span>Order confirmation email sent to your registered email</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                    <span>Your order will be processed within 24 hours</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                    <span>You'll receive tracking details once shipped</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button
                  onClick={handleViewOrder}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Package className="w-4 h-4 mr-2" />
                  View Order Details
                </Button>
                <Button
                  onClick={handleGoHome}
                  variant="outline"
                  className="flex-1 border-2 border-green-200 hover:border-green-400 hover:bg-green-50 text-green-700 font-semibold py-3 rounded-xl transition-all duration-300 bg-transparent"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Continue Shopping
                </Button>
              </div>

              <div className="flex justify-center gap-4 mb-8">
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-green-600">
                  <Download className="w-4 h-4 mr-2" />
                  Download Receipt
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-green-600">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Order
                </Button>
              </div>

              <div className="text-center">
                {!isRedirecting ? (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <p className="text-blue-800 text-sm">
                      <Clock className="w-4 h-4 inline mr-2" />
                      Redirecting to home page in <span className="font-bold text-blue-900 text-lg">{countdown}</span>{" "}
                      seconds...
                    </p>
                  </div>
                ) : (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <p className="text-green-800 text-sm">
                      <CheckCircle className="w-4 h-4 inline mr-2" />
                      Redirecting to home page...
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="text-center mt-8">
            <p className="text-gray-600 text-sm">
              Need help? Contact us at{" "}
              <a href="mailto:support@vivahartstudio.com" className="text-green-600 hover:text-green-700 font-semibold">
                support@vivahartstudio.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}