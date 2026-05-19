import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { useState, useMemo } from 'react'
import { useProducts } from '../../hooks/useProducts'
import { useTheme } from '../../contexts/ThemeContext'
import ProductCard from '../../components/product/ProductCard'
import Spinner from '../../components/ui/Spinner'
import { C } from '../../constants/theme'
import { CATEGORY_MAPPING } from '../../constants/products'

export default function CategoryPage() {
  // Extract category from URL and handle navigation/location
  const { category } = useParams()
  const { search } = useLocation()
  const navigate = useNavigate()

  // Custom hooks for global state
  const { isDarkMode } = useTheme()
  const { products, loading, error } = useProducts()

  // Parse URL search parameters (e.g., ?sub=Gaming)
  const queryParams = new URLSearchParams(search)
  const activeSub = queryParams.get('sub')

  // Local state for UI filters and sorting
  const [sortBy, setSortBy] = useState('newest')
  const [priceRange, setPriceRange] = useState('all')
  const [minRating, setMinRating] = useState(0)

  // Derived groups for landing page view
  /**
   * Grouping logic: Organize products belonging to the current category 
   * into 'all' and further into 'subs' (sub-categories).
   */
  const categoryData = useMemo(() => {
    const data = {
      all: [],
      subs: {}
    }
    products.forEach(p => {
      if (p.category === category) {
        data.all.push(p)
        if (p.subCategory) {
          if (!data.subs[p.subCategory]) data.subs[p.subCategory] = []
          data.subs[p.subCategory].push(p)
        }
      }
    })
    return data
  }, [products, category])

  // Products to display in the listing view
  /**
   * Filtering & Sorting Logic: 
   * Takes the category products and applies active sub-category, 
   * price filters, rating filters, and sorting choices.
   */
  const processedProducts = useMemo(() => {
    let result = categoryData.all

    if (activeSub) {
      result = result.filter(p => p.subCategory === activeSub)
    }

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
  }, [categoryData, activeSub, sortBy, priceRange, minRating])

  const hasSubs = Object.keys(categoryData.subs).length > 0
  const isLandingView = hasSubs && !activeSub

  const clearFilters = () => {
    setSortBy('newest')
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

          {category.toLowerCase() !== 'home' && (
            <>
              <span style={{ color: 'var(--text-hint)' }}>/</span>
              <button
                onClick={() => navigate(`/category/${category}`)}
                style={{ color: activeSub ? 'var(--text-sub)' : 'var(--text)', textTransform: 'uppercase' }}
              >
                {CATEGORY_MAPPING[category] || category}
              </button>
            </>
          )}

          {activeSub && (
            <>
              <span style={{ color: 'var(--text-hint)' }}>/</span>
              <span style={{ color: 'var(--text)', textTransform: 'uppercase' }}>{activeSub}</span>
            </>
          )}
        </div>

        {isLandingView ? (
          /* --- CATEGORY LANDING PAGE VIEW --- */
          <div className="fade-in">
            {/* Header with Background */}
            <div style={{
              background: C.primary,
              color: '#fff',
              padding: '60px 40px',
              borderRadius: 24,
              marginBottom: 40,
              backgroundImage: `linear-gradient(45deg, ${C.primary}, #6a11cb)`,
              boxShadow: 'var(--shadow-lg)'
            }}>
              <h1 style={{ fontSize: 48, fontWeight: 900, marginBottom: 12 }}>{category} Store</h1>
              <p style={{ fontSize: 18, opacity: 0.9 }}>Discover the best deals in {category.toLowerCase()} and much more.</p>
            </div>

            {/* Sub-category Icons */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 24, marginBottom: 60 }}>
              {Object.entries(categoryData.subs).map(([sub, items]) => (
                <div
                  key={sub}
                  onClick={() => navigate(`/category/${category}?sub=${sub}`)}
                  className="glass-card"
                  style={{
                    padding: 24,
                    borderRadius: 20,
                    textAlign: 'center',
                    cursor: 'pointer',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)'
                    e.currentTarget.style.borderColor = C.primary
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.borderColor = 'var(--border)'
                  }}
                >
                  <div style={{
                    width: 100,
                    height: 100,
                    margin: '0 auto 16px',
                    background: isDarkMode ? 'rgba(255,255,255,0.05)' : '#f8f9fa',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden'
                  }}>
                    <img src={items[0].image} style={{ width: '70%', height: '70%', objectFit: 'contain' }} alt={sub} />
                  </div>
                  <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text)' }}>{sub}</h3>
                  <p style={{ fontSize: 12, color: 'var(--text-sub)', marginTop: 4 }}>{items.length} Products</p>
                </div>
              ))}
            </div>

            {/* Featured Sub-sections */}
            {Object.entries(categoryData.subs).map(([sub, items]) => (
              <div key={sub} style={{ marginBottom: 60 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24 }}>
                  <h2 style={{ fontSize: 28, fontWeight: 900, color: 'var(--text)' }}>Top {sub}</h2>
                  <button
                    onClick={() => navigate(`/category/${category}?sub=${sub}`)}
                    style={{ color: C.primary, fontWeight: 800, fontSize: 14 }}
                  >
                    VIEW ALL →
                  </button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 24 }}>
                  {items.slice(0, 4).map(p => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* --- PRODUCT LISTING VIEW (Standard or Single Category) --- */
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
                  <h1 style={{ fontSize: 20, fontWeight: 900, textTransform: 'capitalize', color: 'var(--text)' }}>
                    {activeSub || CATEGORY_MAPPING[category] || category}
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
                    <option value="newest">Newest First</option>
                    <option value="priceLow">Price: Low to High</option>
                    <option value="priceHigh">Price: High to Low</option>
                    <option value="rating">Top Rated</option>
                  </select>
                </div>
              </div>

              {processedProducts.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '100px 0' }}>
                  <h3 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-hint)' }}>No products found</h3>
                  <p style={{ color: 'var(--text-sub)' }}>Try adjusting your filters.</p>
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
        )}
      </div>
    </div>
  )
}
