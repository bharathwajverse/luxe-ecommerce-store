import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProducts } from '../../hooks/useProducts'
import ProductCard from '../../components/product/ProductCard'
import Spinner from '../../components/ui/Spinner'
import { C } from '../../constants/theme'
import { CATEGORY_MAPPING } from '../../constants/products'

export default function OffersPage() {
  const { products, loading } = useProducts()
  const navigate = useNavigate()
  const [timeLeft, setTimeLeft] = useState('12:45:08')

  // Timer logic matching HomePage
  /**
   * Countdown timer logic: Updates the 'Ending In' time every second 
   * until midnight.
   */
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      const hours = 23 - now.getHours()
      const mins = 59 - now.getMinutes()
      const secs = 59 - now.getSeconds()
      setTimeLeft(`${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`)
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Filter and group products by category
  /**
   * Filters all products to find those with specific "offer" criteria 
   * (e.g., price < 2k, high rating, or explicit offer flag) and groups them by category.
   */
  const categorizedOffers = useMemo(() => {
    const offers = products.filter(p => p.price < 2000 || p.rating.rate >= 4.5 || p.offer === true)
    const groups = {}
    offers.forEach(p => {
      if (!groups[p.category]) groups[p.category] = []
      groups[p.category].push(p)
    })
    return groups
  }, [products])

  if (loading) return <Spinner />

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', paddingBottom: 80 }}>
      {/* Banner Strips */}
      <div style={{ background: 'linear-gradient(90deg, #2874f0 0%, #047bd5 100%)', color: '#fff', padding: '12px 0', textAlign: 'center', fontWeight: 800, fontSize: 14, letterSpacing: 1 }}>
        🔥 MEGA SAVINGS STARTING NOW · UP TO 70% OFF ACROSS CATEGORIES 🔥
      </div>
      
      <div className="container" style={{ paddingTop: 40 }}>
        {/* Main Offer Hero */}
        <div style={{ 
          background: 'linear-gradient(135deg, #fb641b 0%, #ff8c52 100%)',
          padding: '60px 40px',
          borderRadius: 24,
          marginBottom: 48,
          color: '#fff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 20px 40px rgba(251, 100, 27, 0.2)'
        }}>
          <div style={{ textAlign: 'left' }}>
            <h1 style={{ fontSize: 56, fontWeight: 900, marginBottom: 12, letterSpacing: -1.5 }}>The Big Deal Week</h1>
            <p style={{ fontSize: 20, opacity: 0.9, fontWeight: 600 }}>Unbeatable offers on your favorite brands</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: 14, fontWeight: 800, textTransform: 'uppercase', marginBottom: 8, opacity: 0.8 }}>Ending In</p>
            <div style={{ fontSize: 42, fontWeight: 900, fontFamily: 'monospace', background: 'rgba(0,0,0,0.2)', padding: '10px 24px', borderRadius: 16 }}>
              {timeLeft}
            </div>
          </div>
        </div>

        {/* Categories Sections */}
        {Object.entries(categorizedOffers).map(([category, items]) => (
          <section key={category} style={{ marginBottom: 60 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24, borderBottom: '1px solid var(--border)', paddingBottom: 16 }}>
              <div>
                <h2 style={{ fontSize: 28, fontWeight: 900, color: 'var(--text)', textTransform: 'capitalize' }}>
                  Best of {CATEGORY_MAPPING[category] || category.replace(/-/g, ' ')}
                </h2>
                <p style={{ color: 'var(--text-sub)', fontSize: 15 }}>Curated deals just for you</p>
              </div>
              <button 
                onClick={() => navigate(`/category/${category}`)}
                style={{ background: C.primary, color: '#fff', padding: '10px 24px', borderRadius: 8, fontWeight: 800, fontSize: 13 }}
              >
                Explore All {CATEGORY_MAPPING[category] || category.replace(/-/g, ' ')}
              </button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 24 }}>
              {items.slice(0, 4).map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Footer Banner */}
      <div style={{ marginTop: 40, background: 'linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)', color: '#fff', padding: '40px 0', textAlign: 'center' }}>
        <h2 style={{ fontSize: 32, fontWeight: 900, marginBottom: 12 }}>New Offers Every Hour</h2>
        <p style={{ opacity: 0.8, fontSize: 16 }}>Stay tuned for the biggest drops of the season</p>
      </div>
    </div>
  )
}
