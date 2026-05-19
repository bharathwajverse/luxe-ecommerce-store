import { useState, useMemo, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { C } from '../../constants/theme'
import { useProducts } from '../../hooks/useProducts'
import { useTheme } from '../../contexts/ThemeContext'
import { motion, AnimatePresence } from 'framer-motion'
import { CATEGORY_MAPPING, CATEGORIES } from '../../constants/products'
import ProductCard from '../../components/product/ProductCard'
import Spinner from '../../components/ui/Spinner'

/**
 * Static configuration for the hero slider banners.
 */
const CATEGORY_IMAGES = {
  'Electronics': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=60&w=128&h=128',
  'Fashion': 'https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?auto=format&fit=crop&q=60&w=128&h=128',
  'Beauty': 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=60&w=128&h=128',
  'Accessories': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=60&w=128&h=128',
  'Home': 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=60&w=128&h=128',
  'Sports': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=60&w=128&h=128'
}

const BANNERS = [
  { 
    id: 1, 
    color: '#2874f0', 
    title: 'Future Tech Sale', 
    sub: 'Next-gen devices at unbeatable prices',
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&q=80&w=2070',
    category: 'Electronics'
  },
  { 
    id: 2, 
    color: '#fb641b', 
    title: 'Autumn Collection', 
    sub: 'Elegant styles for the modern individual',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=2070',
    category: 'Fashion'
  },
  { 
    id: 3, 
    color: '#e91e63', 
    title: 'Beauty Essentials', 
    sub: 'Discover the secret to radiant skin',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc4033c8?auto=format&fit=crop&q=80&w=2070',
    category: 'Beauty'
  }
]

export default function HomePage() {
  const navigate = useNavigate()
  const { products, loading, error } = useProducts()
  const { isDarkMode } = useTheme()
  const [currentSlide, setCurrentSlide] = useState(0)

  /**
   * Helper to calculate the time remaining until midnight for the Deal of the Day.
   */
  function getTimeLeft() {
    const now = new Date()
    const h = (23 - now.getHours()).toString().padStart(2, '0')
    const m = (59 - now.getMinutes()).toString().padStart(2, '0')
    const s = (59 - now.getSeconds()).toString().padStart(2, '0')
    return `${h}:${m}:${s}`
  }
  const [timeLeft, setTimeLeft] = useState(getTimeLeft)
  // Refs for smooth scrolling
  const sectionsRef = useRef({})
  const dealsRef = useRef(null)
  const productsRef = useRef(null)

  /**
   * Groups products by category and sub-category for organized rendering.
   * This is memoized to prevent re-calculating on every render unless 'products' changes.
   */
  const productSections = useMemo(() => {
    const sections = {}
    products.forEach(p => {
      const cat = p.category
      const sub = p.subCategory
      
      if (!sections[cat]) {
        sections[cat] = { 
          items: [], 
          subs: {} 
        }
      }
      
      sections[cat].items.push(p)
      
      if (sub) {
        if (!sections[cat].subs[sub]) {
          sections[cat].subs[sub] = []
        }
        sections[cat].subs[sub].push(p)
      }
    })
    return sections
  }, [products])

  /**
   * Automatically advances the banner slider every 5 seconds.
   */
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % BANNERS.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [currentSlide])

  /**
   * Updates the countdown timer every second.
   */
  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(getTimeLeft()), 1000)
    return () => clearInterval(timer)
  }, [])

  /**
   * Smoothly scrolls to a specific component section on the page.
   */
  const scrollToSection = (ref) => {
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' })
    }
  }

  if (loading) return <Spinner />
  if (error) return <div style={{ textAlign: 'center', padding: 100, color: C.red }}>{error}</div>

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', paddingBottom: 80, transition: 'background 0.3s' }}>
      
      {/* Category Navigation Bar */}
      <div style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border)', marginBottom: 20, position: 'relative' }}>
        <div className="container" style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          padding: '20px 0', 
          overflowX: 'auto', 
          gap: 40
        }}>
          {CATEGORIES.filter(c => c !== 'all' && productSections[c]).map(cat => {
            const data = productSections[cat]
            return (
              <div 
                key={cat} 
                style={{ textAlign: 'center', cursor: 'pointer', minWidth: 80 }} 
                className="fade-in"
                onClick={() => navigate(`/category/${cat}`)}
              >
                <div style={{ 
                  width: 64, 
                  height: 64, 
                  margin: '0 auto 10px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  borderRadius: '50%',
                  background: isDarkMode ? 'rgba(255,255,255,0.05)' : '#f8f9fa',
                  transition: 'all 0.3s',
                  overflow: 'hidden',
                  border: `2px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : '#eee'}`
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px) scale(1.1)'
                  e.currentTarget.style.borderColor = C.primary
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)'
                  e.currentTarget.style.borderColor = isDarkMode ? 'rgba(255,255,255,0.1)' : '#eee'
                }}
                >
                   <img 
                    src={CATEGORY_IMAGES[cat] || data.items[0].image} 
                    onError={(e) => {
                      e.target.onerror = null; 
                      e.target.src = data.items[0].image;
                    }}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    alt={cat} 
                   />
                </div>
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)', textTransform: 'capitalize', display: 'block', whiteSpace: 'nowrap' }}>
                  {cat}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Cinematic Hero Slider */}
      <div className="container" style={{ marginBottom: 40 }}>
        <div style={{ position: 'relative', height: 500, overflow: 'hidden', borderRadius: 24, boxShadow: 'var(--shadow-lg)', background: '#000' }}>
          {/* Background Image Layer */}
          <AnimatePresence mode="popLayout">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, scale: 1.08 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundImage: `linear-gradient(to right, ${BANNERS[currentSlide].color}cc, transparent), url(${BANNERS[currentSlide].image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
          </AnimatePresence>

          {/* Content Layer */}
          <div style={{ position: 'relative', zIndex: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 80px', color: '#fff' }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                style={{ maxWidth: 650 }}
              >
                <span className="glass" style={{ padding: '6px 16px', borderRadius: 20, fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 24, display: 'inline-block' }}>
                  Featured Collection
                </span>
                <h1 style={{ fontSize: 72, fontWeight: 900, marginBottom: 16, color: '#fff', letterSpacing: -2, lineHeight: 0.95 }}>
                  {BANNERS[currentSlide].title}
                </h1>
                <p style={{ fontSize: 24, opacity: 0.9, marginBottom: 40, fontWeight: 400, maxWidth: 400 }}>
                  {BANNERS[currentSlide].sub}
                </p>
                <button 
                  onClick={() => navigate(`/category/${BANNERS[currentSlide].category}`)}
                  style={{ 
                    background: '#fff', 
                    color: '#000', 
                    padding: '18px 48px', 
                    borderRadius: 12, 
                    fontWeight: 900, 
                    fontSize: 16,
                    boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                    cursor: 'pointer',
                    transition: 'transform 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  SHOP NOW
                </button>
              </motion.div>
            </AnimatePresence>
          </div>
          
          {/* Navigation Dots */}
          <div style={{ position: 'absolute', bottom: 40, left: 80, display: 'flex', gap: 12, zIndex: 10 }}>
            {BANNERS.map((_, idx) => (
              <div
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                style={{
                  width: currentSlide === idx ? 48 : 12,
                  height: 6,
                  borderRadius: 3,
                  background: currentSlide === idx ? '#fff' : 'rgba(255,255,255,0.3)',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Deal of the Day Section */}
      <div className="container" ref={dealsRef}>
        <div className="glass" style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          padding: '24px 40px',
          borderRadius: 24,
          marginBottom: 40,
          background: isDarkMode ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.6)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
            <h2 style={{ fontSize: 28, fontWeight: 900, color: 'var(--text)', letterSpacing: -0.5 }}>DEAL OF THE DAY</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: C.redBg, padding: '8px 16px', borderRadius: 12 }}>
              <svg style={{ width: 20, height: 20, fill: C.red }} viewBox="0 0 24 24">
                <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
                <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
              </svg>
              <span style={{ fontSize: 16, fontWeight: 800, color: C.red, fontFamily: 'monospace' }}>{timeLeft}</span>
            </div>
          </div>
          <button 
            onClick={() => navigate('/offers')}
            style={{ 
              background: C.primary, 
              color: '#fff', 
              padding: '12px 32px', 
              borderRadius: 12, 
              fontWeight: 800, 
              fontSize: 14,
              boxShadow: '0 4px 12px rgba(74, 144, 226, 0.3)'
            }}
          >
            VIEW ALL OFFERS
          </button>
        </div>

        {/* Dynamic Product Sections */}
        <div ref={productsRef}>
          {CATEGORIES.filter(c => c !== 'all' && productSections[c]).map(cat => {
            const data = productSections[cat]
            return (
              <section 
                key={cat} 
                style={{ marginBottom: 60 }} 
                className="fade-in"
              >
                <div style={{ borderBottom: `4px solid ${C.primary}`, display: 'inline-block', marginBottom: 32 }}>
                  <h2 style={{ fontSize: 32, fontWeight: 900, textTransform: 'capitalize', color: 'var(--text)', paddingBottom: 8 }}>{cat}</h2>
                </div>
                
                {/* If Category has Sub-categories, render them as subsections */}
                {Object.keys(data.subs).length > 0 ? (
                  Object.entries(data.subs).map(([sub, items]) => (
                    <div key={sub} style={{ marginBottom: 40 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 20 }}>
                        <h3 style={{ fontSize: 22, fontWeight: 800, color: C.primary }}>{sub}</h3>
                        <button 
                          onClick={() => navigate(`/category/${cat}?sub=${sub}`)}
                          style={{ color: C.primary, fontWeight: 800, fontSize: 13 }}
                        >
                          VIEW ALL {sub.toUpperCase()} →
                        </button>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 24 }}>
                        {items.slice(0, 4).map(product => (
                          <ProductCard key={product.id} product={product} />
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 24 }}>
                    {data.items.slice(0, 8).map(product => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                )}
              </section>
            )
          })}
        </div>
      </div>
    </div>
  )
}
