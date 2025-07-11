"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronLeft, ChevronRight, Heart } from "lucide-react"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
// import allRakhi from '../assets/image/allRakhi.jpg'
import useAuthStore, { selectIsAuthenticated } from '../stores/useAuthStore'

interface Subcategory {
  _id: string
  name: string
  image?: string
}

interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  images: string[]
  category: string
  subcategory: string
  salePercentage?: number
  year: string
  stock: number
}

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
}

export default function CategoriesSection() {
  const [selectedSubcategory, setSelectedSubcategory] = useState("all")
  const [subcategories, setSubcategories] = useState<Subcategory[]>([
    { _id: "all", name: "ALL RAKHIS", image: "/placeholder.svg?height=80&width=80" },
  ])
  const [products, setProducts] = useState<Product[]>([])
  const [visibleRows, setVisibleRows] = useState(3)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [wishlist, setWishlist] = useState<Set<string>>(new Set()) // State to track wishlist items
  const scrollRef = useRef<HTMLDivElement>(null)
  
  // Use auth store
  const isAuthenticated = useAuthStore(selectIsAuthenticated)

  // Fetch subcategories for Rakhi category on mount
  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        setLoading(true)
        const response = await fetch(
          "https://vivahartstudio-backend.onrender.com/api/inventory/categories/686ee620362a1457eb452471/subcategories"
        )
        const data = await response.json()
        if (Array.isArray(data)) {
          setSubcategories([
            { _id: "all", name: "ALL RAKHIS", image: '../assets/image/allRakhi.jpg' },
            ...data.map((subcat: any) => ({
              _id: subcat._id,
              name: subcat.name,
              image: subcat.backgroundImage?.url || "/placeholder.svg?height=80&width=80",
            })),
          ])
        } else {
          setError("Failed to fetch subcategories")
        }
      } catch (err) {
        setError("Error fetching subcategories")
      } finally {
        setLoading(false)
      }
    }
    fetchSubcategories()
  }, [])

  // Fetch products based on selected subcategory
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const url = new URL("https://vivahartstudio-backend.onrender.com/api/inventory/products")
        url.searchParams.append("page", "1")
        url.searchParams.append("limit", "100")
        url.searchParams.append("sort", "-createdAt")
        url.searchParams.append("category", "686ee620362a1457eb452471")
        if (selectedSubcategory !== "all") {
          url.searchParams.append("subcategory", selectedSubcategory)
        }

        const response = await fetch(url)
        const data = await response.json()
        if (data.status === "success") {
          setProducts(
            data.data.map((item: any) => ({
              id: item._id,
              name: item.name,
              price: Number(item.sellingPrice),
              originalPrice: item.originalPrice || Number(item.sellingPrice) * 1.2,
              images: item.images?.map((img: any) => img.url) || ["/placeholder.svg?height=300&width=300"],
              category: item.category?.name || "Rakhi",
              subcategory: item.subcategory?.name || "",
              salePercentage: item.originalPrice
                ? Math.round(((item.originalPrice - Number(item.sellingPrice)) / item.originalPrice) * 100)
                : undefined,
              year: "Edit 2025",
              stock: item.totalStock,
            }))
          )
        } else {
          setError("Failed to fetch products")
        }
      } catch (err) {
        setError("Error fetching products")
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [selectedSubcategory])

  // Add to cart function
  const addToCart = async (product: Product) => {
    const newItem: CartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.images[0] || "/placeholder.svg?height=100&width=100",
    }

    if (isAuthenticated) {
      try {
        const response = await fetch('https://vivahartstudio-backend.onrender.com/api/users/cart/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({ productId: product.id, quantity: 1 }),
        })
        const data = await response.json()
        if (data.status !== 'success') {
          window.location.reload()
        }
      } catch (err) {
        setError('Error adding product to cart')
      }
    } else {
      const savedCart = localStorage.getItem('cartItems')
      const cartItems: CartItem[] = savedCart ? JSON.parse(savedCart) : []
      const existingItem = cartItems.find((item) => item.id === product.id)
      if (existingItem) {
        cartItems.forEach((item) => {
          if (item.id === product.id) {
            item.quantity += 1
          }
        })
      } else {
        cartItems.push(newItem)
      }
      localStorage.setItem('cartItems', JSON.stringify(cartItems))
    }
  }

  // Toggle wishlist function
  const toggleWishlist = async (productId: string) => {
    if (!isAuthenticated) {
      setError("Please log in to manage your wishlist")
      return
    }

    const token = localStorage.getItem('token')
    const isInWishlist = wishlist.has(productId)

    try {
      const method = isInWishlist ? 'DELETE' : 'POST'
      const endpoint = `https://vivahartstudio-backend.onrender.com/api/users/wishlist/${isInWishlist ? 'remove' : 'add'}`
      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ productId }),
      })

      const data = await response.json()
      if (data.status === 'success') {
        setWishlist((prev) => {
          const newWishlist = new Set(prev)
          if (isInWishlist) {
            newWishlist.delete(productId)
          } else {
            newWishlist.add(productId)
          }
          return newWishlist
        })
      } else {
        setError(`Failed to ${isInWishlist ? 'remove from' : 'add to'} wishlist`)
      }
    } catch (err) {
      setError(`Error ${isInWishlist ? 'removing from' : 'adding to'} wishlist`)
    }
  }

  const filteredProducts =
    selectedSubcategory === "all"
      ? products
      : products.filter((product) => product.subcategory === subcategories.find((sub) => sub._id === selectedSubcategory)?.name)

  const productsPerRow = 4
  const visibleProducts = filteredProducts.slice(0, visibleRows * productsPerRow)
  const hasMoreProducts = filteredProducts.length > visibleProducts.length

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -200, behavior: "smooth" })
    }
  }

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 200, behavior: "smooth" })
    }
  }

  const handleViewMore = () => {
    setVisibleRows((prev) => prev + 3)
  }

  const handleSubcategoryChange = (subcategoryId: string) => {
    setSelectedSubcategory(subcategoryId)
    setVisibleRows(3)
  }

  return (
    <div className="max-w-8xl mx-auto p-4 relative bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {loading && <p className="text-center">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}
      <div className="absolute inset-0 opacity-5 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23d97706' fillOpacity='0.1'%3E%3Cpath d='M30 30c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20zm0 0c0 11.046 8.954 20 20 20s20-8.954 20-20-8.954-20-20-20-20 8.954-20 20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
      </div>

      {/* Subcategory Slider */}
      <div className="relative mb-8">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-0 z-10 bg-white shadow-md rounded-full"
            onClick={scrollLeft}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          <div
            ref={scrollRef}
            className="flex gap-[90px] overflow-x-auto scrollbar-hide px-12 py-4"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {subcategories.map((subcategory) => (
              <div
                key={subcategory._id}
                className={`flex flex-col items-center cursor-pointer transition-all duration-200 ${
                  selectedSubcategory === subcategory._id ? "scale-105" : "hover:scale-105"
                }`}
                onClick={() => handleSubcategoryChange(subcategory._id)}
              >
                <div
                  className={`w-30 h-30 rounded-full border-2 overflow-hidden mb-2 ${
                    selectedSubcategory === subcategory._id
                      ? "border-purple-500 shadow-lg"
                      : "border-pink-200 hover:border-purple-300"
                  }`}
                >
                  <img
                    src={subcategory.image || "/placeholder.svg"}
                    alt={subcategory.name}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span
                  className={`text-xs font-medium text-center whitespace-nowrap ${
                    selectedSubcategory === subcategory._id ? "text-purple-600" : "text-gray-700"
                  }`}
                >
                  {subcategory.name}
                </span>
              </div>
            ))}
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 z-10 bg-white shadow-md rounded-full"
            onClick={scrollRight}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        {visibleProducts.map((product) => (
          <div
            key={product.id}
            className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-amber-200 transform hover:-translate-y-1"
          >
            <div className="relative aspect-square bg-gradient-to-br from-amber-50 to-orange-50 overflow-hidden">              
              {product.salePercentage && (
                <Badge className="absolute top-3 right-3 z-10 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold px-3 py-1 rounded-full shadow-lg">
                  {product.salePercentage}% OFF
                </Badge>
              )}

              <div className="absolute top-3 left-3 z-10">
                <span className="text-xs bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-gray-700 font-medium shadow-sm">
                  {product.year}
                </span>
              </div>
              <button
                onClick={() => toggleWishlist(product.id)}
                className="absolute top-3 left-1/2 transform -translate-x-1/2 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:shadow-md transition-all duration-300 hover:scale-110"
              >
                <Heart
                  className={`w-4 h-4 transition-colors duration-300 ${
                    wishlist.has(product.id) ? "fill-red-500 text-red-500" : "text-gray-600 hover:text-red-500"
                  }`}
                />
              </button>

              <img
                src={product.images[0] || "/placeholder.svg"}
                alt={product.name}
                width={300}
                height={300}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-3 line-clamp-2 min-h-[3rem] text-base leading-tight group-hover:text-amber-800 transition-colors duration-300">
                {product.name}
              </h3>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xl font-bold text-gray-900">₹{product.price.toFixed(2)}</span>
                {product.originalPrice && (
                  <span className="text-sm text-gray-500 line-through">₹{product.originalPrice.toFixed(2)}</span>
                )}
                {product.salePercentage && (
                  <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                    Save ₹{((product.originalPrice || 0) - product.price).toFixed(0)}
                  </span>
                )}
              </div>
              <div className="mb-4">
                {product.stock > 0 ? (
                  <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full font-medium">
                    {product.stock} in stock
                  </span>
                ) : (
                  <span className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded-full font-medium">
                    Out of stock
                  </span>
                )}
              </div>

              <button
                onClick={() => {
                  console.log("Button clicked:", product);
                  addToCart(product);
                }}
                disabled={product.stock === 0}
                className={`w-full font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                  product.stock === 0
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed hover:scale-100"
                    : "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg hover:shadow-xl"
                }`}
              >
                
                {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* View More Button */}
      {hasMoreProducts && (
        <div className="text-center">
          <Button
            onClick={handleViewMore}
            variant="outline"
            className="px-8 py-2 border-purple-200 text-purple-600 hover:bg-purple-50 bg-transparent"
          >
            View More Products
          </Button>
        </div>
      )}

      {/* No Products Message */}
      {filteredProducts.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No products found in this category.</p>
        </div>
      )}
    </div>
  )
}