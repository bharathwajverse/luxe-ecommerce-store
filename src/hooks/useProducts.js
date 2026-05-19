import { useState, useEffect } from 'react'
import api from '../services/api'

// Mapping of granular API categories to consolidated hierarchical "Flipkart-style" categories
const CATEGORY_MAP = {
  // Electronics
  'smartphones': { main: 'Electronics', sub: 'Mobiles' },
  'tablets': { main: 'Electronics', sub: 'Tablets' },
  'laptops': { main: 'Electronics', sub: 'Laptops' },
  'mobile-accessories': { main: 'Electronics', sub: 'Accessories' },
  
  // Fashion
  'mens-shirts': { main: 'Fashion', sub: "Men's Fashion" },
  'mens-shoes': { main: 'Fashion', sub: "Men's Fashion" },
  'womens-dresses': { main: 'Fashion', sub: "Women's Fashion" },
  'womens-shoes': { main: 'Fashion', sub: "Women's Fashion" },
  'tops': { main: 'Fashion', sub: "Women's Fashion" },
  
  // Accessories
  'mens-watches': { main: 'Accessories', sub: "Men's Accessories" },
  'sunglasses': { main: 'Accessories', sub: "Men's Accessories" },
  'womens-watches': { main: 'Accessories', sub: "Women's Accessories" },
  'womens-bags': { main: 'Accessories', sub: "Women's Accessories" },
  'womens-jewellery': { main: 'Accessories', sub: "Women's Accessories" },
  
  // Beauty & Care
  'beauty': { main: 'Beauty', sub: 'Cosmetics' },
  'fragrances': { main: 'Beauty', sub: 'Perfumes' },
  'skin-care': { main: 'Beauty', sub: 'Skincare' },
  
  // Home
  'home-decoration': { main: 'Home', sub: null },
  'furniture': { main: 'Home', sub: null },
  'kitchen-accessories': { main: 'Home', sub: null },
  
  // Sports
  'sports-accessories': { main: 'Sports', sub: null }
}

// Categories to explicitly remove
const EXCLUDED_CATEGORIES = ['groceries', 'motorcycle', 'vehicle', 'automotive']

// This function converts API data into the format our app uses
function formatProduct(item) {
  const mapped = CATEGORY_MAP[item.category] || { main: item.category, sub: null }
  
  // Convert price from USD to INR (approx 80x)
  let inrPrice = item.price * 80
  
  // Apply "Indian Price" normalization (round to nearest attractive number)
  if (inrPrice < 500) {
    inrPrice = Math.round(inrPrice / 10) * 10 - 1 // e.g., 489
  } else if (inrPrice < 2000) {
    inrPrice = Math.round(inrPrice / 50) * 50 - 1 // e.g., 1499
  } else if (inrPrice < 10000) {
    inrPrice = Math.round(inrPrice / 100) * 100 - 1 // e.g., 4999
  } else {
    inrPrice = Math.round(inrPrice / 500) * 500 - 10 // e.g., 24990
  }

  return {
    id: item.id,
    title: item.title,
    description: item.description,
    category: mapped.main, // Top-level category
    subCategory: mapped.sub, // Sub-category
    originalCategory: item.category,
    price: Math.max(99, inrPrice), // Ensure no price is too low
    image: item.thumbnail,
    brand: item.brand || 'Generic',
    stock: item.stock,
    rating: {
      rate: item.rating,
      count: item.reviews ? item.reviews.length : 0,
    },
  }
}

// Hook to fetch ALL products from the API
export function useProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(function () {
    let isCancelled = false

    async function fetchProducts() {
      try {
        setLoading(true)
        setError(null)

        let response = await api.get('/products?limit=0')
        let data = response.data

        if (!isCancelled) {
          let formattedProducts = data.products
            .filter(p => !EXCLUDED_CATEGORIES.includes(p.category))
            .map(formatProduct)
          setProducts(formattedProducts)
        }
      } catch (err) {
        if (!isCancelled) {
          setError('Failed to load products. Please try again.')
        }
      } finally {
        if (!isCancelled) {
          setLoading(false)
        }
      }
    }

    fetchProducts()

    return function () {
      isCancelled = true
    }
  }, [])

  return { products, loading, error }
}

// Hook to fetch a SINGLE product by its ID
export function useProduct(id) {
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(function () {
    if (!id) return

    let isCancelled = false

    async function fetchProduct() {
      try {
        setLoading(true)
        setError(null)

        let response = await api.get('/products/' + id)
        let data = response.data

        if (!isCancelled) {
          setProduct(formatProduct(data))
        }
      } catch (err) {
        if (!isCancelled) {
          setError('Product not found.')
        }
      } finally {
        if (!isCancelled) {
          setLoading(false)
        }
      }
    }

    fetchProduct()

    return function () {
      isCancelled = true
    }
  }, [id])

  return { product, loading, error }
}

// Hook to fetch all category names (TOP-LEVEL)
export function useCategories() {
  const [categories, setCategories] = useState(['all'])

  useEffect(function () {
    api
      .get('/products/categories')
      .then(function (response) {
        let mapped = response.data
          .filter(cat => !EXCLUDED_CATEGORIES.includes(cat.slug))
          .map(cat => (CATEGORY_MAP[cat.slug] ? CATEGORY_MAP[cat.slug].main : cat.slug))
        
        let uniqueCategories = Array.from(new Set(mapped))
        setCategories(['all', ...uniqueCategories])
      })
      .catch(function () {
        setCategories(['all'])
      })
  }, [])

  return categories
}
