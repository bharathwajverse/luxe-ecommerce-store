import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useCart } from '../../hooks/useCart'
import { useWishlist } from '../../contexts/WishlistContext'
import { useProduct, useProducts } from '../../hooks/useProducts'
import { C } from '../../constants/theme'
import Spinner from '../../components/ui/Spinner'
import Stars from '../../components/ui/Stars'
import QtyControl from '../../components/product/QtyControl'
import ProductCard from '../../components/product/ProductCard'

export default function ProductDetailPage() {
  // Extract the product ID from the URL parameters
  const { id } = useParams()
  const navigate = useNavigate()
  
  // Custom hooks for cart, wishlist, and product data
  const { addMultipleToCart } = useCart()
  const { isInWishlist, toggleWishlist } = useWishlist()
  const { product, loading, error } = useProduct(id)
  const { products: allProducts } = useProducts()

  // Local state for quantity selection and "added to cart" feedback
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  /**
   * Adds the selected quantity of the product to the cart and shows temporary feedback.
   */
  const handleAddToCart = () => {
    addMultipleToCart(product, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  /**
   * Adds product to cart and immediately redirects to the cart page.
   */
  const handleBuyNow = () => {
    addMultipleToCart(product, qty)
    navigate('/cart')
  }

  // Dynamically compute discount %
  const discountPct = Math.round(((product?.price * 1.4 - product?.price) / (product?.price * 1.4)) * 100) || 29

  if (loading) return <Spinner />

  if (error || !product) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 24px', color: C.red }}>
        <h2 style={{ fontSize: 32, marginBottom: 16 }}>Oops!</h2>
        <p>This product doesn't seem to exist.</p>
        <button onClick={() => navigate('/')} style={{ marginTop: 24, padding: '12px 32px', background: C.primary, color: '#fff', borderRadius: 12, fontWeight: 800 }}>Back to Home</button>
      </div>
    )
  }

  /**
   * Filters all products to find others in the same category (excluding current product)
   * to display as related items.
   */
  const relatedProducts = allProducts.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4)
  
  // Check if current product is in the user's wishlist
  const isFavorite = isInWishlist(product.id)

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', transition: 'background 0.3s' }}>
      <div className="container" style={{ paddingTop: 40, paddingBottom: 100 }}>
        
        {/* Navigation / Breadcrumbs */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
          <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-sub)', fontWeight: 700, fontSize: 14 }}>
            <svg style={{ width: 18, height: 18, fill: 'currentColor' }} viewBox="0 0 24 24"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
            BACK TO BROWSE
          </button>
          
          <button 
            onClick={() => toggleWishlist(product)}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 8, 
              color: isFavorite ? C.red : 'var(--text-sub)', 
              fontWeight: 800, 
              fontSize: 14,
              background: 'var(--bg-card)',
              padding: '8px 20px',
              borderRadius: 20,
              boxShadow: 'var(--shadow)'
            }}
          >
            <svg style={{ width: 20, height: 20, fill: isFavorite ? C.red : 'none', stroke: isFavorite ? C.red : 'currentColor', strokeWidth: 2 }} viewBox="0 0 24 24">
              <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {isFavorite ? 'SAVED TO WISHLIST' : 'SAVE FOR LATER'}
          </button>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: 64,
          alignItems: 'start',
        }}>
          {/* Image Gallery Mock */}
          <div style={{ position: 'sticky', top: 120 }}>
            <div className="glass scale-in" style={{
              background: '#fff',
              borderRadius: 32,
              padding: 64,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-lg)',
              minHeight: 500,
            }}>
              <img src={product.image} alt={product.title} style={{ maxWidth: '100%', maxHeight: 400, objectFit: 'contain' }} />
            </div>
            {/* Thumbnail Mock */}
            <div style={{ display: 'flex', gap: 16, marginTop: 24, justifyContent: 'center' }}>
              {[1, 2, 3].map(i => (
                <div key={i} style={{ width: 80, height: 80, borderRadius: 16, border: '2px solid ' + (i === 1 ? C.primary : 'var(--border)'), background: '#fff', padding: 8, cursor: 'pointer' }}>
                  <img src={product.image} style={{ width: '100%', height: '100%', objectFit: 'contain' }} alt="thumb" />
                </div>
              ))}
            </div>
          </div>

          {/* Product Details Area */}
          <div className="fade-in">
            <span style={{ color: C.primary, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 2, fontSize: 13 }}>{product.category}</span>
            <h1 style={{ fontSize: 48, fontWeight: 900, color: 'var(--text)', margin: '16px 0 24px', lineHeight: 1.1, letterSpacing: -1.5 }}>{product.title}</h1>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 32 }}>
              <Stars rating={product.rating.rate} count={product.rating.count} />
              <div style={{ height: 20, width: 1, background: 'var(--border)' }}></div>
              <span style={{
                color: product.stock > 0 ? C.green : C.red,
                fontWeight: 800, fontSize: 14
              }}>
                {product.stock > 0 ? `IN STOCK (${product.stock} left)` : 'OUT OF STOCK'}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 40 }}>
              <span style={{ fontSize: 40, fontWeight: 900, color: 'var(--text)' }}>₹{product.price.toLocaleString('en-IN')}</span>
              <span style={{ fontSize: 20, textDecoration: 'line-through', color: 'var(--text-hint)' }}>₹{(product.price * 1.4).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
              <span style={{ background: C.greenBg, color: C.green, padding: '4px 12px', borderRadius: 8, fontWeight: 800, fontSize: 14 }}>{discountPct}% OFF</span>
            </div>

            <p style={{ fontSize: 18, color: 'var(--text-sub)', lineHeight: 1.8, marginBottom: 48 }}>{product.description}</p>

            <div style={{ background: 'var(--bg-card)', padding: 32, borderRadius: 24, boxShadow: 'var(--shadow)', marginBottom: 48 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
                <span style={{ fontWeight: 800, color: 'var(--text)' }}>Select Quantity</span>
                <QtyControl qty={qty} onChange={setQty} />
              </div>

              <div style={{ display: 'flex', gap: 16 }}>
                <button
                  onClick={handleAddToCart}
                  style={{
                    flex: 1,
                    padding: '20px',
                    background: C.primary,
                    color: '#fff',
                    borderRadius: 16,
                    fontWeight: 800,
                    fontSize: 16,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 12,
                    boxShadow: '0 10px 20px rgba(74, 144, 226, 0.3)',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <svg style={{ width: 20, height: 20, fill: 'currentColor' }} viewBox="0 0 24 24">
                    <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" />
                  </svg>
                  {added ? 'ADDED TO BAG' : 'ADD TO BAG'}
                </button>
                
                <button 
                  onClick={handleBuyNow}
                  disabled={product.stock === 0}
                  style={{ 
                    padding: '20px 32px', 
                    background: product.stock === 0 ? 'var(--border)' : 'var(--bg)', 
                    color: product.stock === 0 ? 'var(--text-hint)' : 'var(--text)', 
                    borderRadius: 16, 
                    fontWeight: 800, 
                    border: '1px solid var(--border)',
                    cursor: product.stock === 0 ? 'not-allowed' : 'pointer',
                  }}
                >
                  BUY NOW
                </button>
              </div>
            </div>

            {/* Premium Features List */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
              {[
                { 
                  icon: (
                    <svg style={{ width: 24, height: 24, stroke: 'var(--primary)', fill: 'none', strokeWidth: 2 }} viewBox="0 0 24 24">
                      <path d="M5 18h14M5 8h14M5 13h14M2 4h20v16H2V4z" />
                      <path d="M17 13l3 3-3 3" />
                    </svg>
                  ), 
                  label: 'Free Express Shipping' 
                },
                { 
                  icon: (
                    <svg style={{ width: 24, height: 24, stroke: 'var(--primary)', fill: 'none', strokeWidth: 2 }} viewBox="0 0 24 24">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      <path d="M9 12l2 2 4-4" />
                    </svg>
                  ), 
                  label: '2 Year Warranty' 
                },
                { 
                  icon: (
                    <svg style={{ width: 24, height: 24, stroke: 'var(--primary)', fill: 'none', strokeWidth: 2 }} viewBox="0 0 24 24">
                      <path d="M1 4v6h6M23 20v-6h-6" />
                      <path d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15" />
                    </svg>
                  ), 
                  label: '30 Day Returns' 
                },
                { 
                  icon: (
                    <svg style={{ width: 24, height: 24, stroke: 'var(--primary)', fill: 'none', strokeWidth: 2 }} viewBox="0 0 24 24">
                      <rect x="2" y="5" width="20" height="14" rx="2" />
                      <path d="M2 10h20M7 15h.01M11 15h2" />
                    </svg>
                  ), 
                  label: 'Secure Payment' 
                }
              ].map((f, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ 
                    width: 44, 
                    height: 44, 
                    borderRadius: 12, 
                    background: 'var(--primary-light)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center' 
                  }}>
                    {f.icon}
                  </div>
                  <span style={{ fontSize: 14, color: 'var(--text-sub)', fontWeight: 700 }}>{f.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div style={{ marginTop: 120 }}>
            <h2 style={{ fontSize: 32, fontWeight: 900, color: 'var(--text)', marginBottom: 40, letterSpacing: -1 }}>Related Products</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 32 }}>
              {relatedProducts.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
