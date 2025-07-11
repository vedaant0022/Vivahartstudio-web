"use client"

import { useState, useEffect } from "react"
import {
  User,
  Mail,
  Phone,
  MapPin,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  CreditCard,
  Heart,
  Edit,
  Plus,
  Calendar,
  IndianRupee,
} from "lucide-react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Separator } from "../components/ui/separator"

interface Address {
  street: string
  city: string
  state: string
  postalCode: string
  country: string
  isDefault: boolean
  _id: string
}

interface WishlistItem {
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
  category: string
  subcategory: string
  totalStock: number
  isActive: boolean
}

interface UserProfile {
  _id: string
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  isEmailVerified: boolean
  isActive: boolean
  role: string
  wishlist: WishlistItem[]
  lastLogin: string
  addresses: Address[]
  cart: any[]
  createdAt: string
  updatedAt: string
}

interface OrderItem {
  product: any
  quantity: number
  price: number | string | undefined // Allow flexibility in API response
  _id: string
}

interface Order {
  _id: string
  user: string
  items: OrderItem[]
  totalAmount: number | string | undefined // Allow flexibility
  shippingCharges: number | string | undefined // Allow flexibility
  paymentMethod: string
  paymentStatus: string
  razorpayOrderId?: string
  status: string
  deliveryStatus: string
  shippingAddress: Address
  createdAt: string
  updatedAt: string
}

export default function UserProfile() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("profile")

  useEffect(() => {
    fetchUserProfile()
    fetchOrders()
  }, [])

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("https://vivahartstudio-backend.onrender.com/api/users/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await response.json()
      if (data.user) {
        setUserProfile(data.user)
      } else {
        setError("No user data received")
      }
    } catch (err) {
      setError("Failed to fetch user profile")
    }
  }

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("https://vivahartstudio-backend.onrender.com/api/orders/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await response.json()
      console.log("Orders API Response:", data) // Debug log
      if (Array.isArray(data)) {
        setOrders(data)
      } else {
        setError("Invalid orders data received")
      }
    } catch (err) {
      setError("Failed to fetch orders")
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "confirmed":
      case "processing":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "shipped":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return <Clock className="w-4 h-4" />
      case "confirmed":
      case "processing":
        return <Package className="w-4 h-4" />
      case "shipped":
        return <Truck className="w-4 h-4" />
      case "delivered":
        return <CheckCircle className="w-4 h-4" />
      case "cancelled":
        return <XCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatPrice = (value: number | string | undefined) => {
    const numValue = typeof value === "string" ? parseFloat(value) : value
    return numValue !== undefined && !isNaN(numValue) ? numValue.toFixed(2) : "0.00"
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-amber-800 font-medium">Loading your profile...</p>
        </div>
      </div>
    )
  }

  if (error || !userProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Profile</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto p-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-amber-900">
                {userProfile.firstName} {userProfile.lastName}
              </h1>
              <p className="text-amber-700">Welcome back to your account</p>
            </div>
          </div>
          <div className="w-32 h-1 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full"></div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8 bg-white/80 backdrop-blur-sm rounded-2xl p-1 border border-amber-200">
            <TabsTrigger
              value="profile"
              className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-500 data-[state=active]:text-white font-medium"
            >
              <User className="w-4 h-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger
              value="orders"
              className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-500 data-[state=active]:text-white font-medium"
            >
              <Package className="w-4 h-4 mr-2" />
              Orders ({orders.length})
            </TabsTrigger>
            <TabsTrigger
              value="addresses"
              className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-500 data-[state=active]:text-white font-medium"
            >
              <MapPin className="w-4 h-4 mr-2" />
              Addresses
            </TabsTrigger>
            <TabsTrigger
              value="wishlist"
              className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-500 data-[state=active]:text-white font-medium"
            >
              <Heart className="w-4 h-4 mr-2" />
              Wishlist ({userProfile.wishlist.length})
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Personal Information */}
              <Card className="bg-white/90 backdrop-blur-sm border border-amber-200 rounded-2xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-amber-900">
                    <User className="w-5 h-5" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-amber-600" />
                    <div>
                      <p className="font-medium text-gray-900">Full Name</p>
                      <p className="text-gray-600">
                        {userProfile.firstName} {userProfile.lastName}
                      </p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-amber-600" />
                    <div>
                      <p className="font-medium text-gray-900">Email Address</p>
                      <div className="flex items-center gap-2">
                        <p className="text-gray-600">{userProfile.email}</p>
                        {userProfile.isEmailVerified && (
                          <Badge className="bg-green-100 text-green-800 text-xs">Verified</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-amber-600" />
                    <div>
                      <p className="font-medium text-gray-900">Phone Number</p>
                      <p className="text-gray-600">{userProfile.phoneNumber}</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-amber-600" />
                    <div>
                      <p className="font-medium text-gray-900">Member Since</p>
                      <p className="text-gray-600">{formatDate(userProfile.createdAt)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Account Status */}
              <Card className="bg-white/90 backdrop-blur-sm border border-amber-200 rounded-2xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-amber-900">
                    <CheckCircle className="w-5 h-5" />
                    Account Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Account Status</span>
                    <Badge className={userProfile.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                      {userProfile.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Email Verification</span>
                    <Badge
                      className={
                        userProfile.isEmailVerified ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                      }
                    >
                      {userProfile.isEmailVerified ? "Verified" : "Pending"}
                    </Badge>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Account Type</span>
                    <Badge className="bg-blue-100 text-blue-800 capitalize">{userProfile.role}</Badge>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-gray-700 mb-1">Last Login</p>
                    <p className="text-sm text-gray-600">{formatDate(userProfile.lastLogin)}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            {orders.length === 0 ? (
              <Card className="bg-white/90 backdrop-blur-sm border border-amber-200 rounded-2xl">
                <CardContent className="p-12 text-center">
                  <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Orders Yet</h3>
                  <p className="text-gray-600 mb-6">
                    You haven't placed any orders yet. Start shopping to see your orders here.
                  </p>
                  <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
                    Start Shopping
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <Card key={order._id} className="bg-white/90 backdrop-blur-sm border border-amber-200 rounded-2xl">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-amber-900">Order #{order._id.slice(-8)}</CardTitle>
                          <p className="text-sm text-gray-600">{formatDate(order.createdAt)}</p>
                        </div>
                        <div className="text-right">
                          <Badge className={`${getStatusColor(order.status)} border`}>
                            {getStatusIcon(order.status)}
                            <span className="ml-1 capitalize">{order.status}</span>
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Order Items */}
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Items ({order.items.length})</h4>
                        <div className="space-y-2">
                          {order.items.map((item) => (
                            <div key={item._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div>
                                <p className="font-medium text-gray-900">
                                  {item.product?.name || "Product Name Not Available"}
                                </p>
                                <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
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

                      <Separator />

                      {/* Order Summary */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Payment Details</h4>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span>Subtotal:</span>
                              <span className="flex items-center">
                                <IndianRupee className="w-3 h-3" />
                                {formatPrice(order.totalAmount && order.shippingCharges
                                  ? Number(order.totalAmount) - Number(order.shippingCharges)
                                  : undefined)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Shipping:</span>
                              <span className="flex items-center">
                                <IndianRupee className="w-3 h-3" />
                                {formatPrice(order.shippingCharges)}
                              </span>
                            </div>
                            <div className="flex justify-between font-semibold">
                              <span>Total:</span>
                              <span className="flex items-center">
                                <IndianRupee className="w-3 h-3" />
                                {formatPrice(order.totalAmount)}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Delivery Details</h4>
                          <div className="space-y-1 text-sm">
                            <div className="flex items-center gap-2">
                              <CreditCard className="w-4 h-4 text-amber-600" />
                              <span>{order.paymentMethod}</span>
                              <Badge className={`${getStatusColor(order.paymentStatus)} text-xs`}>
                                {order.paymentStatus}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2">
                              <Truck className="w-4 h-4 text-amber-600" />
                              <span className="capitalize">{order.deliveryStatus}</span>
                            </div>
                            <div className="flex items-start gap-2 mt-2">
                              <MapPin className="w-4 h-4 text-amber-600 mt-0.5" />
                              <div className="text-xs">
                                <p>{order.shippingAddress.street}</p>
                                <p>
                                  {order.shippingAddress.city}, {order.shippingAddress.state}
                                </p>
                                <p>
                                  {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Addresses Tab */}
          <TabsContent value="addresses" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-amber-900">Saved Addresses</h2>
              <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
                <Plus className="w-4 h-4 mr-2" />
                Add New Address
              </Button>
            </div>

            {userProfile.addresses.length === 0 ? (
              <Card className="bg-white/90 backdrop-blur-sm border border-amber-200 rounded-2xl">
                <CardContent className="p-12 text-center">
                  <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Addresses Saved</h3>
                  <p className="text-gray-600 mb-6">Add your addresses to make checkout faster and easier.</p>
                  <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Address
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {userProfile.addresses.map((address) => (
                  <Card key={address._id} className="bg-white/90 backdrop-blur-sm border border-amber-200 rounded-2xl">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-amber-900 flex items-center gap-2">
                          <MapPin className="w-5 h-5" />
                          Address
                        </CardTitle>
                        {address.isDefault && <Badge className="bg-green-100 text-green-800">Default</Badge>}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-gray-700">
                        <p>{address.street}</p>
                        <p>
                          {address.city}, {address.state}
                        </p>
                        <p>{address.postalCode}</p>
                        <p>{address.country}</p>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        {!address.isDefault && (
                          <Button variant="outline" size="sm">
                            Set as Default
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Wishlist Tab */}
          <TabsContent value="wishlist" className="space-y-6">
            {userProfile.wishlist.length === 0 ? (
              <Card className="bg-white/90 backdrop-blur-sm border border-amber-200 rounded-2xl">
                <CardContent className="p-12 text-center">
                  <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Your Wishlist is Empty</h3>
                  <p className="text-gray-600 mb-6">Save items you love to your wishlist and shop them later.</p>
                  <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
                    Start Shopping
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {userProfile.wishlist.map((item) => (
                  <Card
                    key={item._id}
                    className="bg-white/90 backdrop-blur-sm border border-amber-200 rounded-2xl overflow-hidden group hover:shadow-lg transition-all duration-300"
                  >
                    <div className="relative aspect-square bg-gradient-to-br from-amber-50 to-orange-50">
                      <img
                        src={item.images[0]?.url || "/placeholder.svg"}
                        alt={item.name}
                        width={300}
                        height={300}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <button className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:shadow-md transition-all duration-300">
                        <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                      </button>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{item.name}</h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.shortDescription}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-amber-600 flex items-center">
                          <IndianRupee className="w-4 h-4" />
                          {formatPrice(item.sellingPrice)}
                        </span>
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                        >
                          Add to Cart
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}