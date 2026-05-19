import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useCart } from '../hooks/useCart'
import { useTheme } from '../contexts/ThemeContext'
import { useWishlist } from '../contexts/WishlistContext'
import { useProducts } from '../hooks/useProducts'
import { C } from '../constants/theme'

export default function Navbar() {
  // Global context hooks for user data, cart, wishlist, and theme
  let { user, logout } = useAuth()
  let { cartCount } = useCart()
  let { wishlist } = useWishlist()
  let { isDarkMode, toggleTheme } = useTheme()

  // Navigation and location hooks
  let navigate = useNavigate()
  let location = useLocation()

  // Local state for UI components
  const [showDropdown, setShowDropdown] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const { products } = useProducts()
  const [showSearchDropdown, setShowSearchDropdown] = useState(false)

  /**
   * Syncs the search input with the URL query parameter 'q'.
   * Clears the input if the user navigates away from the search page.
   */
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const q = params.get('q')
    if (q) {
      setSearchQuery(q)
    } else if (location.pathname !== '/search') {
      setSearchQuery('')
    }
  }, [location])

  /**
   * Filters products based on the search query for the quick-results dropdown.
   */
  const quickResults = searchQuery.trim().length >= 2
    ? products.filter(p =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 6)
    : []

  /**
   * Navigates to the search results page when the user presses Enter or clicks Search.
   */
  const handleSearch = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      if (searchQuery.trim()) {
        setShowSearchDropdown(false)
        navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      }
    }
  }

  return (
    <nav className="glass" style={{
      position: 'sticky',
      top: 0,
      zIndex: 200,
      background: isDarkMode ? 'rgba(26, 29, 41, 0.85)' : C.primary,
      color: '#fff',
      boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
      backdropFilter: 'blur(10px)',
      borderBottom: isDarkMode ? '1px solid var(--border)' : 'none'
    }}>
      {/* Main navbar row */}
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        height: 72,
        gap: 32,
      }}>
        {/* Logo Section */}
        <button
          onClick={() => navigate('/')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            minWidth: 170,
            cursor: 'pointer'
          }}
        >
          <div style={{
            background: '#fff',
            width: 40,
            height: 40,
            borderRadius: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
          }}>
            <svg style={{ width: 22, height: 22, color: C.primary }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <span style={{
              fontSize: 22,
              fontWeight: 900,
              color: '#fff',
              lineHeight: 1,
              letterSpacing: -0.5,
            }}>
              FLIP<span style={{ color: '#ffe500' }}>SHOP</span>
            </span>
            <span style={{
              fontSize: 9,
              color: 'rgba(255,255,255,0.7)',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: 1.5,
              marginTop: 4
            }}>
              INDIA'S PREMIUM
            </span>
          </div>
        </button>

        {/* Search Bar - Premium Glass Look */}
        <div style={{ flex: 1, position: 'relative', maxWidth: 600 }}>
          <input
            type="text"
            placeholder="Search for products, brands and more..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setShowSearchDropdown(true)
            }}
            onKeyDown={handleSearch}
            onBlur={() => setTimeout(() => setShowSearchDropdown(false), 200)}
            onFocus={() => setShowSearchDropdown(true)}
            style={{
              width: '100%',
              padding: '12px 48px 12px 20px',
              borderRadius: 12,
              border: '1px solid transparent',
              outline: 'none',
              fontSize: 15,
              background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(255, 255, 255, 0.95)',
              color: isDarkMode ? '#fff' : '#333',
              boxShadow: '0 2px 15px rgba(0,0,0,0.05)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          />
          <div
            onClick={handleSearch}
            style={{
              position: 'absolute',
              right: 16,
              top: '50%',
              transform: 'translateY(-50%)',
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer'
            }}
          >
            <svg style={{ width: 20, height: 20, fill: isDarkMode ? '#888' : C.primary }} viewBox="0 0 24 24">
              <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
            </svg>
          </div>

          {/* Instant Search Results Dropdown */}
          {showSearchDropdown && quickResults.length > 0 && (
            <div className="fade-in" style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              left: 0,
              right: 0,
              background: 'var(--bg-card)',
              borderRadius: 16,
              boxShadow: '0 10px 40px rgba(0,0,0,0.25)',
              overflow: 'hidden',
              zIndex: 1000,
              border: '1px solid var(--border)',
              padding: '8px 0'
            }}>
              {quickResults.map(p => (
                <div
                  key={p.id}
                  onClick={() => {
                    navigate(`/product/${p.id}`)
                    setShowSearchDropdown(false)
                    setSearchQuery('')
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    padding: '12px 20px',
                    cursor: 'pointer',
                    transition: '0.2s',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{ width: 48, height: 48, borderRadius: 8, background: '#fff', padding: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border)' }}>
                    <img src={p.image} style={{ width: '100%', height: '100%', objectFit: 'contain' }} alt={p.title} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 2 }}>{p.title}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-sub)', fontWeight: 600 }}>{p.category}</div>
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: C.primary }}>₹{p.price.toLocaleString()}</div>
                </div>
              ))}

            </div>
          )}
        </div>

        {/* Right side buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, minWidth: 'fit-content' }}>


          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            style={{
              background: 'rgba(255,255,255,0.1)',
              width: 40,
              height: 40,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff'
            }}
          >
            {isDarkMode ? (
              <svg style={{ width: 20, height: 20, fill: 'currentColor' }} viewBox="0 0 24 24">
                <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58a.996.996 0 00-1.41 0 .996.996 0 000 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37a.996.996 0 00-1.41 0 .996.996 0 000 1.41l1.06 1.06c.39.39 1.03.39 1.41 0a.996.996 0 000-1.41l-1.06-1.06zm1.06-12.37a.996.996 0 000-1.41.996.996 0 00-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36a.996.996 0 000-1.41.996.996 0 00-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z" />
              </svg>
            ) : (
              <svg style={{ width: 20, height: 20, fill: 'currentColor' }} viewBox="0 0 24 24">
                <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.81.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z" />
              </svg>
            )}
          </button>

          {/* Wishlist */}
          <button
            onClick={() => navigate('/wishlist')}
            style={{ color: '#fff', position: 'relative', display: 'flex', alignItems: 'center', gap: 8 }}
          >
            <div style={{ position: 'relative' }}>
              <svg style={{ width: 24, height: 24, fill: 'none', stroke: '#fff', strokeWidth: 2 }} viewBox="0 0 24 24">
                <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {wishlist.length > 0 && (
                <span style={{ position: 'absolute', top: -6, right: -6, background: C.secondary, color: '#fff', fontSize: 10, minWidth: 18, height: 18, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, border: '2px solid ' + (isDarkMode ? '#1a1d29' : C.primary) }}>
                  {wishlist.length}
                </span>
              )}
            </div>
          </button>

          {/* Login/Logout */}
          {user ? (
            <div style={{ position: 'relative' }}>
              <div
                onClick={() => setShowDropdown(!showDropdown)}
                style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', background: 'rgba(255,255,255,0.1)', padding: '6px 16px', borderRadius: 20 }}
              >
                <div style={{ width: 24, height: 24, borderRadius: '50%', background: C.secondary, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 900 }}>
                  {(user.name || user.email || 'U')[0].toUpperCase()}
                </div>
                <span style={{ fontSize: 14, fontWeight: 700 }}>{(user.name || user.email).split(' ')[0]}</span>
                <svg style={{ width: 16, height: 16, fill: '#fff', transform: showDropdown ? 'rotate(180deg)' : 'none', transition: '0.3s' }} viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z" /></svg>
              </div>

              {showDropdown && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: 12,
                  background: 'var(--bg-card)',
                  borderRadius: 12,
                  boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
                  minWidth: 180,
                  padding: 8,
                  zIndex: 300,
                  border: '1px solid var(--border)'
                }}>
                  <button
                    onClick={() => { navigate('/orders'); setShowDropdown(false) }}
                    style={{ width: '100%', textAlign: 'left', padding: '12px 16px', borderRadius: 8, fontSize: 14, color: 'var(--text)', fontWeight: 600 }}
                  >
                    My Orders
                  </button>
                  <button
                    onClick={() => { logout(); setShowDropdown(false); navigate('/'); }}
                    style={{ width: '100%', textAlign: 'left', padding: '12px 16px', borderRadius: 8, fontSize: 14, color: 'var(--red)', fontWeight: 600 }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => navigate('/login')}
              style={{
                background: '#fff',
                borderRadius: 8,
                color: C.primary,
                padding: '10px 32px',
                fontSize: 15,
                fontWeight: 800,
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
              }}
            >
              Login
            </button>
          )}

          {/* Cart */}
          <button
            onClick={() => navigate('/cart')}
            style={{
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              fontSize: 15,
              fontWeight: 700,
              background: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
              padding: '8px 16px',
              borderRadius: 20
            }}
          >
            <div style={{ position: 'relative' }}>
              <svg style={{ width: 22, height: 22, fill: '#fff' }} viewBox="0 0 24 24">
                <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" />
              </svg>
              {cartCount > 0 && (
                <span style={{ position: 'absolute', top: -10, right: -10, background: '#ff6161', color: '#fff', fontSize: 10, padding: '2px 6px', borderRadius: 10, border: '2px solid ' + (isDarkMode ? '#1a1d29' : C.primary), fontWeight: 900 }}>
                  {cartCount}
                </span>
              )}
            </div>
            Cart
          </button>
        </div>
      </div>
    </nav>
  )
}
