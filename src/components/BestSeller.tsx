"use client"

import { useState, useEffect } from "react"
import { Heart, ShoppingCart, Eye, Plus, Minus, Star, TrendingUp } from "lucide-react"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import { Card, CardContent } from "../components/ui/card"
import { toast } from "react-toastify"
import InlineLoader from "./inline-loader"

interface Product {
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
  createdAt: string
  updatedAt: string
}

interface ProductQuantity {
  [productId: string]: number
}

export default function BestSellerSection() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [quantities, setQuantities] = useState<ProductQuantity>({})
  const [wishlist, setWishlist] = useState<Set<string>>(new Set())
  const [addingToCart, setAddingToCart] = useState<Set<string>>(new Set())

  // Fetch products from API
  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await fetch("https://vivahartstudio-backend.onrender.com/api/inventory/products")

      if (!response.ok) {
        throw new Error("Failed to fetch products")
      }

      const data = await response.json()

      // Randomly shuffle and select 8 products for best sellers (2 rows of 4)
      const shuffledProducts = data.data.sort(() => 0.5 - Math.random()) // Sort the data.data array
      const bestSellers = shuffledProducts.slice(0, 8)

      setProducts(bestSellers)

      // Initialize quantities to 1 for all products
      const initialQuantities: ProductQuantity = {}
      bestSellers.forEach((product: Product) => {
        initialQuantities[product._id] = 1
      })
      setQuantities(initialQuantities)
    } catch (err) {
      setError("Failed to load best sellers")
      console.error("Error fetching products:", err)
    } finally {
      setLoading(false)
    }
  }

  const updateQuantity = (productId: string, change: number) => {
    setQuantities((prev) => {
      const currentQuantity = prev[productId] || 1
      const newQuantity = Math.max(1, Math.min(10, currentQuantity + change)) // Min 1, Max 10
      return {
        ...prev,
        [productId]: newQuantity,
      }
    })
  }

  const addToCart = async (product: Product) => {
    const quantity = quantities[product._id] || 1

    try {
      setAddingToCart((prev) => new Set([...prev, product._id]))

      const token = localStorage.getItem("token")
      if (!token) {
        toast("Authentication Required: Please login to add items to cart", { type: "error" })
        return
      }

      const response = await fetch("https://vivahartstudio-backend.onrender.com/api/users/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: product._id, // Removed array
          quantity: quantity,     // Removed array
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to add to cart")
      }

      toast(`Added to Cart! 🛒: ${product.name} (${quantity}x) added to your cart`, { type: "success" })

      // Reset quantity to 1 after adding to cart
      setQuantities((prev) => ({
        ...prev,
        [product._id]: 1,
      }))
    } catch (err) {
      toast("Error: Failed to add item to cart. Please try again.", { type: "error" })
      console.error("Error adding to cart:", err)
    } finally {
      setAddingToCart((prev) => {
        const newSet = new Set(prev)
        newSet.delete(product._id)
        return newSet
      })
    }
  }

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const newWishlist = new Set(prev)
      if (newWishlist.has(productId)) {
        newWishlist.delete(productId)
        toast("Removed from Wishlist: Item removed from your wishlist", { type: "info" })
      } else {
        newWishlist.add(productId)
        toast("Added to Wishlist ❤️: Item added to your wishlist", { type: "success" })
      }
      return newWishlist
    })
  }

  const calculateDiscount = (sellingPrice: string) => {
    const price = Number.parseFloat(sellingPrice)
    const originalPrice = price * 1.25 // Assume 20% discount for demo
    const discount = Math.round(((originalPrice - price) / originalPrice) * 100)
    return { originalPrice, discount }
  }

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
        <div className="max-w-7xl mx-auto px-4">
          <InlineLoader message="Loading best sellers..." size="lg" />
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-16 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md mx-auto">
            <p className="text-red-600 font-medium">{error}</p>
            <Button onClick={fetchProducts} className="mt-4 bg-gradient-to-r from-amber-500 to-orange-500">
              Try Again
            </Button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23d97706' fillOpacity='0.1'%3E%3Cpath d='M30 30c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20zm0 0c0 11.046 8.954 20 20 20s20-8.954 20-20-8.954-20-20-20-20 8.954-20 20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
      </div>

      <div className="absolute top-20 left-20 animate-bounce">
        <div className="p-3 bg-gradient-to-r from-amber-400 to-orange-400 rounded-2xl shadow-lg rotate-12">
          <TrendingUp className="h-6 w-6 text-white" />
        </div>
      </div>
      <div className="absolute top-40 right-32 animate-pulse">
        <div className="p-2 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-xl shadow-lg -rotate-12">
          <Star className="h-5 w-5 text-white" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          {/* <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg mb-6">
            <TrendingUp className="w-5 h-5 text-amber-600" />
            <span className="text-amber-800 font-semibold">Best Sellers</span>
          </div> */}
          <h2 className="text-4xl md:text-5xl font-bold text-amber-900 mb-4">BEST SELLING RAKHIS</h2>
          <p className="text-xl text-amber-700 max-w-2xl mx-auto">
            Discover our most loved rakhi designs, handpicked by thousands of happy customers
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-orange-400 mx-auto mt-6"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {products.map((product, index) => {
            const { originalPrice, discount } = calculateDiscount(product.sellingPrice)
            const quantity = quantities[product._id] || 1
            const isAddingToCart = addingToCart.has(product._id)

            return (
              <Card
                key={product._id}
                className="group bg-white/95 backdrop-blur-sm border-2 border-amber-100 hover:border-amber-300 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
              >
                {index < 4 && (
                  <div className="absolute top-4 left-4 z-20">
                    <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold px-3 py-1 rounded-full shadow-lg">
                      🔥 Best Seller
                    </Badge>
                  </div>
                )}

                <div className="relative aspect-square bg-gradient-to-br from-amber-50 to-orange-50 overflow-hidden">
                  <Badge className="absolute top-4 right-4 z-20 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold px-3 py-1 rounded-full shadow-lg">
                    {discount}% OFF
                  </Badge>

                  <button
                    onClick={() => toggleWishlist(product._id)}
                    className="absolute top-16 right-4 z-20 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110"
                  >
                    <Heart
                      className={`w-4 h-4 transition-colors duration-300 ${
                        wishlist.has(product._id) ? "fill-red-500 text-red-500" : "text-gray-600 hover:text-red-500"
                      }`}
                    />
                  </button>

                  <button className="absolute top-28 right-4 z-20 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110 opacity-0 group-hover:opacity-100">
                    <Eye className="w-4 h-4 text-gray-600 hover:text-amber-600" />
                  </button>

                  <img
                    src={product.images[0]?.url || "/placeholder.svg"}
                    alt={product.name}
                    width={400}
                    height={400}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="absolute bottom-4 left-4 z-20">
                    {product.totalStock > 0 ? (
                      <Badge className="bg-green-100 text-green-800 border border-green-200">
                        {product.totalStock} in stock
                      </Badge>
                    ) : (
                      <Badge className="bg-red-100 text-red-800 border border-red-200">Out of stock</Badge>
                    )}
                  </div>
                </div>

                <CardContent className="p-6">
                  <h3 className="font-bold text-gray-900 mb-3 line-clamp-2 min-h-[3rem] text-lg leading-tight group-hover:text-amber-800 transition-colors duration-300">
                    {product.name}
                  </h3>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{product.shortDescription}</p>

                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-2xl font-bold text-gray-900">
                      ₹{Number.parseFloat(product.sellingPrice).toFixed(2)}
                    </span>
                    <span className="text-lg text-gray-500 line-through">₹{originalPrice.toFixed(2)}</span>
                    {/* <span className="text-sm font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                      Save ₹{(originalPrice - Number.parseFloat(product.sellingPrice)).toFixed(0)}
                    </span> */}
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-gray-700">Quantity:</span>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="icon"
                        className="w-8 h-8 rounded-full border-2 border-amber-200 hover:border-amber-400 hover:bg-amber-50 bg-transparent"
                        onClick={() => updateQuantity(product._id, -1)}
                        disabled={quantity <= 1}
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="w-8 text-center font-semibold text-lg">{quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="w-8 h-8 rounded-full border-2 border-amber-200 hover:border-amber-400 hover:bg-amber-50 bg-transparent"
                        onClick={() => updateQuantity(product._id, 1)}
                        disabled={quantity >= 10}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>

                  <Button
                    className={`w-full font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                      product.totalStock === 0
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed hover:scale-100"
                        : "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg hover:shadow-xl"
                    }`}
                    onClick={() => addToCart(product)}
                    disabled={product.totalStock === 0 || isAddingToCart}
                  >
                    {isAddingToCart ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Adding...
                      </div>
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        {product.totalStock === 0 ? "Out of Stock" : `Add ${quantity} to Cart`}
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>


      </div>
    </section>
  )
}