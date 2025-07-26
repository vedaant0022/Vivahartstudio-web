"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronLeft, ChevronRight, Heart, Minus, Plus, ShoppingCart, Eye, X, Check } from "lucide-react"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import useAuthStore, { selectIsAuthenticated } from '../stores/useAuthStore'
import { Card } from "./ui/card"
import { CardContent } from "./ui/card"
import rakhi from '../assets/image/rakhi.png'
import { toast } from "react-toastify"
import { baseURL } from "../utils/api"

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
  shortDescription: string
  subcategory: string
  salePercentage?: number
  year: string
  stock: number
}

interface ProductQuantity {
  [productId: string]: number
}

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
}

interface ImagePreviewModal {
  isOpen: boolean
  imageUrl: string
  productName: string
}

interface CartSuccessModal {
  isOpen: boolean
  productName: string
  productImage: string
  quantity: number
}

export default function CategoriesSection() {
  const [selectedSubcategory, setSelectedSubcategory] = useState("all")
  const [subcategories, setSubcategories] = useState<Subcategory[]>([
    { _id: "all", name: "ALL RAKHIS", image: rakhi },
  ])
  const [products, setProducts] = useState<Product[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [productsPerPage] = useState(12) // Number of products per page
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [wishlist, setWishlist] = useState<Set<string>>(new Set())
  const scrollRef = useRef<HTMLDivElement>(null)
  const [quantities, setQuantities] = useState<ProductQuantity>({})
  const isAuthenticated = useAuthStore(selectIsAuthenticated)
  const [imagePreview, setImagePreview] = useState<ImagePreviewModal>({
    isOpen: false,
    imageUrl: "",
    productName: ""
  })
  const [cartSuccess, setCartSuccess] = useState<CartSuccessModal>({
    isOpen: false,
    productName: "",
    productImage: "",
    quantity: 0
  })

  // Fetch subcategories for Rakhi category on mount
  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        setLoading(true)
        const response = await fetch(
          `${baseURL}/api/inventory/categories/686ee620362a1457eb452471/subcategories`
        )
        const data = await response.json()
        if (Array.isArray(data)) {
          setSubcategories([
            { _id: "all", name: "ALL RAKHIS", image: rakhi },
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

  // Fetch products based on selected subcategory and current page
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const url = new URL(`${baseURL}/api/inventory/products`)
        url.searchParams.append("page", currentPage.toString())
        url.searchParams.append("limit", productsPerPage.toString())
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
          setTotalPages(Math.ceil(data.total / productsPerPage))
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
  }, [selectedSubcategory, currentPage, productsPerPage])

  // Add to cart function
  const addToCart = async (product: Product) => {
    const quantity = quantities[product.id] || 1;

    const newItem: CartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      image: product.images[0] || "/placeholder.svg?height=100&width=100",
    };

    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await fetch(`${baseURL}/api/users/cart/add`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ 
            productId: [product.id], 
            quantity: [quantity] 
          }),
        });
        const data = await response.json();
        if (data.status !== 'success') {
          window.location.reload();
        } else {
          toast.success('Product added to cart');
        }
      } catch (err) {
        setError('Error adding product to cart');
      }
    } else {
      // Handle non-logged in users - store in localStorage
      const savedCart = localStorage.getItem('cartItems');
      let cartItems: CartItem[] = [];
      
      try {
        cartItems = savedCart ? JSON.parse(savedCart) : [];
        if (!Array.isArray(cartItems)) {
          cartItems = [];
        }
      } catch (e) {
        console.error('Error parsing cart data:', e);
        cartItems = [];
      }
      
      const existingItemIndex = cartItems.findIndex(item => item.id === product.id);
      
      if (existingItemIndex !== -1) {
        cartItems[existingItemIndex].quantity += quantity;
      } else {
        cartItems.push(newItem);
      }
      
      try {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        // Show success modal instead of toast for non-logged in users
        setCartSuccess({
          isOpen: true,
          productName: product.name,
          productImage: product.images[0] || "/placeholder.svg?height=100&width=100",
          quantity: quantity
        });
        
        // Auto close after 3 seconds
        setTimeout(() => {
          setCartSuccess(prev => ({ ...prev, isOpen: false }));
        }, 3000);
        
        window.dispatchEvent(new Event('storage'));
      } catch (e) {
        console.error('Error saving cart data:', e);
        toast.error('Failed to add product to cart');
      }
    }
  };

  const updateQuantity = (productId: string, change: number) => {
    setQuantities((prev) => {
      const currentQuantity = prev[productId] || 1
      const newQuantity = Math.max(1, Math.min(10, currentQuantity + change))
      return {
        ...prev,
        [productId]: newQuantity,
      }
    })
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
      const endpoint = `${baseURL}/api/users/wishlist/${isInWishlist ? 'remove' : 'add'}`
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

  const handleSubcategoryChange = (subcategoryId: string) => {
    setSelectedSubcategory(subcategoryId)
    setCurrentPage(1) // Reset to first page when changing subcategory
  }

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
      {loading && <p className="text-center">Loading...</p>}
    }
  }

  // Add function to handle image preview
  const handleImagePreview = (imageUrl: string, productName: string) => {
    setImagePreview({
      isOpen: true,
      imageUrl,
      productName
    })
  }

  // Add function to close preview
  const closeImagePreview = () => {
    setImagePreview({
      isOpen: false,
      imageUrl: "",
      productName: ""
    })
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

      {/* Add Image Preview Modal */}
      {imagePreview.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80" onClick={closeImagePreview}>
          <div 
            className="relative w-full max-h-[90vh] md:max-w-3xl bg-white rounded-3xl overflow-hidden shadow-2xl transform transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute top-4 right-4 z-10">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full bg-white/90 backdrop-blur-sm hover:bg-white"
                onClick={closeImagePreview}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            <div className="relative w-full h-full max-h-[80vh] overflow-hidden">
              <img
                src={imagePreview.imageUrl}
                alt={imagePreview.productName}
                className="w-full h-full object-contain"
                style={{ maxHeight: 'calc(90vh - 120px)' }}
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 md:p-6">
                <h3 className="text-lg md:text-xl font-semibold text-white">{imagePreview.productName}</h3>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cart Success Modal */}
      {cartSuccess.isOpen && (
        <div className="fixed bottom-4 right-4 z-[100] animate-in slide-in-from-bottom-4 duration-300">
          <div className="bg-white rounded-2xl shadow-2xl p-4 border-2 border-green-100 max-w-sm">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 bg-green-100 rounded-xl p-2">
                <Check className="w-6 h-6 text-green-600" />
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900 mb-1">Added to Cart!</h4>
                <div className="flex items-center gap-3 mb-2">
                  <img 
                    src={cartSuccess.productImage} 
                    alt={cartSuccess.productName}
                    className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                  />
                  <div>
                    <p className="text-sm text-gray-600 line-clamp-1">{cartSuccess.productName}</p>
                    <p className="text-sm font-medium text-gray-900">Quantity: {cartSuccess.quantity}</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setCartSuccess(prev => ({ ...prev, isOpen: false }))}
                className="flex-shrink-0 p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>
        </div>
      )}

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
        {products.map((product) => {
          const currentQuantity = quantities[product.id] || 1

          return (
            <Card
              key={product.id}
              className="group bg-white/95 backdrop-blur-sm border-2 border-amber-100 hover:border-amber-300 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
            >
              <div className="relative aspect-square bg-gradient-to-br from-amber-50 to-orange-50 overflow-hidden">
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className="absolute top-4 right-4 z-20 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110"
                >
                  <Heart
                    className={`w-4 h-4 transition-colors duration-300 ${
                      wishlist.has(product.id) ? "fill-red-500 text-red-500" : "text-gray-600 hover:text-red-500"
                    }`}
                  />
                </button>

                {/* Add Eye Button */}
                <button 
                  onClick={() => handleImagePreview(product.images[0] || "/placeholder.svg", product.name)}
                  className="absolute top-16 right-4 z-20 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110"
                >
                  <Eye className="w-4 h-4 text-gray-600 hover:text-amber-600" />
                </button>

                <img
                  src={product.images[0] || "/placeholder.svg"}
                  alt={product.name}
                  width={400}
                  height={400}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="absolute bottom-4 left-4 z-20">
                  {product.stock > 0 ? (
                    <Badge className="bg-green-100 text-green-800 border border-green-200">
                      {product.stock} in stock
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
                    ₹{Number.parseFloat(product.price.toString()).toFixed(2)}
                  </span>
                  <span className="text-lg text-gray-500 line-through">
                    ₹{product.originalPrice?.toFixed(2)}
                  </span>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-gray-700">Quantity:</span>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      className="w-8 h-8 rounded-full border-2 border-amber-200 hover:border-amber-400 hover:bg-amber-50 bg-transparent"
                      onClick={() => updateQuantity(product.id, -1)}
                      disabled={currentQuantity <= 1}
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <span className="w-8 text-center font-semibold text-lg">{currentQuantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="w-8 h-8 rounded-full border-2 border-amber-200 hover:border-amber-400 hover:bg-amber-50 bg-transparent"
                      onClick={() => updateQuantity(product.id, 1)}
                      disabled={currentQuantity >= 10}
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

                <Button
                  className={`w-full font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                    product.stock === 0
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed hover:scale-100"
                      : "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg hover:shadow-xl"
                  }`}
                  onClick={() => addToCart(product)}
                  disabled={product.stock === 0}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  {product.stock === 0 ? "Out of Stock" : `Add ${currentQuantity} to Cart`}
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="bg-white border-amber-200 hover:bg-amber-50 z-10"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              className={`${
                currentPage === page
                  ? "bg-amber-500 text-white hover:bg-amber-600"
                  : "bg-white border-amber-200 hover:bg-amber-50"
              } z-10`}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </Button>
          ))}
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="bg-white border-amber-200 hover:bg-amber-50 z-10"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* No Products Message */}
      {products.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No products found in this category.</p>
        </div>
      )}
    </div>
  )
}