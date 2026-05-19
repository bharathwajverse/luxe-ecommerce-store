import { useLocation, useNavigate } from 'react-router-dom'
import { useState, useMemo, useEffect } from 'react'
import { useProducts } from '../../hooks/useProducts'
import { useTheme } from '../../contexts/ThemeContext'
import ProductCard from '../../components/product/ProductCard'
import Spinner from '../../components/ui/Spinner'
import { C } from '../../constants/theme'

export default function SearchPage() {
  const { search } = useLocation()
  const navigate = useNavigate()
  const { isDarkMode } = useTheme()
  const { products, loading, error } = useProducts()
  
  const queryParams = new URLSearchParams(search)
  const query = queryParams.get('q') || ''

  // Filter & Sort States
  const [sortBy, setSortBy] = useState('relevance')
  const [priceRange, setPriceRange] = useState('all')
  const [minRating, setMinRating] = useState(0)

  /**
   * Resets all filters (sort, price, rating) whenever the user 
   * initiates a new search query.
   */
  useEffect(() => {
    setSortBy('relevance')
    setPriceRange('all')
    setMinRating(0)
  }, [query])

  /**
   * Initial Filtering: Searches for the query string within product 
   * titles, descriptions, categories, and brands.
   */
  const searchResults = useMemo(() => {
    if (!query) return []
    const lowQuery = query.toLowerCase()
    return products.filter(p => 
      p.title.toLowerCase().includes(lowQuery) || 
      p.description.toLowerCase().includes(lowQuery) ||
      p.category.toLowerCase().includes(lowQuery) ||
      (p.subCategory && p.subCategory.toLowerCase().includes(lowQuery)) ||
      (p.brand && p.brand.toLowerCase().includes(lowQuery))
    )
  }, [products, query])

  /**
   * Secondary Processing: Applies price/rating filters and sorting 
   * options to the current search results.
   */
  const processedProducts = useMemo(() => {
    let result = [...searchResults]

    // Apply Price Filter
    if (priceRange === 'under2k') result = result.filter(p => p.price < 2000)
    if (priceRange === '2kto10k') result = result.filter(p => p.price >= 2000 && p.price <= 10000)
    if (priceRange === 'over10k') result = result.filter(p => p.price > 10000)

    // Apply Rating Filter
    if (minRating > 0) result = result.filter(p => p.rating.rate >= minRating)

    // Apply Sorting
    if (sortBy === 'priceLow') result.sort((a, b) => a.price - b.price)
    if (sortBy === 'priceHigh') result.sort((a, b) => b.price - a.price)
    if (sortBy === 'rating') result.sort((a, b) => b.rating.rate - a.rating.rate)
    if (sortBy === 'newest') result.sort((a, b) => b.id - a.id)

    return result
  }, [searchResults, sortBy, priceRange, minRating])

  const clearFilters = () => {
    setSortBy('relevance')
    setPriceRange('all')
    setMinRating(0)
  }

  if (loading) return <Spinner />
  if (error) return <div className="container" style={{ padding: 80, textAlign: 'center', color: C.red }}>{error}</div>

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', padding: '20px 0' }}>
      <div className="container">
        {/* Breadcrumbs */}
        <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12, fontSize: 13, fontWeight: 700 }}>
          <button onClick={() => navigate('/')} style={{ color: 'var(--text-sub)' }}>HOME</button>
          <span style={{ color: 'var(--text-hint)' }}>/</span>
          <span style={{ color: 'var(--text)', textTransform: 'uppercase' }}>SEARCH RESULTS</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 32, alignItems: 'start' }} className="fade-in">
          {/* Sidebar Filters */}
          <aside className="glass" style={{ background: 'var(--bg-card)', padding: 24, borderRadius: 20, boxShadow: 'var(--shadow)', border: '1px solid var(--border)', position: 'sticky', top: 100 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ fontSize: 18, fontWeight: 900 }}>Filters</h2>
              <button onClick={clearFilters} style={{ color: C.primary, fontSize: 12, fontWeight: 800 }}>CLEAR ALL</button>
            </div>

            <div style={{ marginBottom: 32 }}>
              <h3 style={{ fontSize: 14, fontWeight: 800, marginBottom: 16, color: 'var(--text-sub)' }}>PRICE</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { label: 'All Prices', value: 'all' },
                  { label: 'Under ₹2,000', value: 'under2k' },
                  { label: '₹2,000 - ₹10,000', value: '2kto10k' },
                  { label: 'Over ₹10,000', value: 'over10k' }
                ].map(opt => (
                  <label key={opt.value} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 14 }}>
                    <input 
                      type="radio" 
                      name="price" 
                      checked={priceRange === opt.value} 
                      onChange={() => setPriceRange(opt.value)}
                      style={{ accentColor: C.primary }}
                    />
                    <span style={{ color: priceRange === opt.value ? 'var(--text)' : 'var(--text-sub)', fontWeight: priceRange === opt.value ? 700 : 400 }}>{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <h3 style={{ fontSize: 14, fontWeight: 800, marginBottom: 16, color: 'var(--text-sub)' }}>RATINGS</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[4.5, 4, 3].map(rating => (
                  <label key={rating} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 14 }}>
                    <input 
                      type="radio" 
                      name="rating" 
                      checked={minRating === rating} 
                      onChange={() => setMinRating(rating)}
                      style={{ accentColor: C.primary }}
                    />
                    <span style={{ color: minRating === rating ? 'var(--text)' : 'var(--text-sub)', fontWeight: minRating === rating ? 700 : 400 }}>{rating}★ & above</span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Listing Content */}
          <div>
            <div className="glass" style={{ background: 'var(--bg-card)', padding: '20px 24px', borderRadius: 16, marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid var(--border)' }}>
              <div>
                <h1 style={{ fontSize: 20, fontWeight: 900, color: 'var(--text)' }}>
                  Results for "{query}"
                </h1>
                <p style={{ fontSize: 13, color: 'var(--text-sub)' }}>Showing {processedProducts.length} products</p>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-hint)' }}>Sort By:</span>
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  style={{ background: 'var(--bg)', border: '1px solid var(--border)', padding: '8px 12px', borderRadius: 8, fontSize: 14, fontWeight: 700, color: 'var(--text)', outline: 'none' }}
                >
                  <option value="relevance">Relevance</option>
                  <option value="newest">Newest First</option>
                  <option value="priceLow">Price: Low to High</option>
                  <option value="priceHigh">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>
            </div>

            {processedProducts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '100px 0' }}>
                <svg style={{ width: 80, height: 80, fill: 'var(--text-hint)', marginBottom: 24 }} viewBox="0 0 24 24">
                  <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                </svg>
                <h3 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-hint)' }}>Sorry, no results found!</h3>
                <p style={{ color: 'var(--text-sub)', marginTop: 8 }}>Please check the spelling or try searching for something else.</p>
                <button 
                  onClick={() => navigate('/')}
                  style={{ marginTop: 24, background: C.primary, color: '#fff', padding: '12px 32px', borderRadius: 8, fontWeight: 800 }}
                >
                  Back to Home
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 24 }}>
                {processedProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
