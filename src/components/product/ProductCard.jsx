import { useNavigate } from 'react-router-dom'
import { useCart } from '../../hooks/useCart'
import { useWishlist } from '../../contexts/WishlistContext'
import { useToast } from '../../contexts/ToastContext'
import Stars from '../ui/Stars'

export default function ProductCard({ product }) {
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const { isInWishlist, toggleWishlist } = useWishlist()
  const { showToast } = useToast()
  
  /**
   * Helper logic for the card: 
   * - Calculates a fixed 40% discount for display purposes.
   * - Checks if the product is already in the user's wishlist.
   */
  const discount = Math.round(((product.price * 1.4 - product.price) / (product.price * 1.4)) * 100)
  const isFavorite = isInWishlist(product.id)

  return (
    <div 
      className="scale-in premium-card"
      style={{
        background: 'var(--bg-card)',
        borderRadius: 16,
        padding: 16,
        cursor: 'pointer',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        border: '1px solid var(--border)',
        overflow: 'hidden',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
      onClick={() => navigate(`/product/${product.id}`)}
    >
      {/* Offer Badge */}
      {product.offer && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          background: 'var(--green)',
          color: '#fff',
          padding: '4px 10px',
          fontSize: 11,
          fontWeight: 800,
          borderBottomRightRadius: 12,
          zIndex: 15,
          textTransform: 'uppercase',
          boxShadow: '2px 2px 8px rgba(0,0,0,0.1)'
        }}>
          {product.offerLabel}
        </div>
      )}

      {/* Wishlist Toggle Button (Stops propagation to prevent card click) */}
      <button 
        onClick={(e) => {
          e.stopPropagation()
          toggleWishlist(product)
          showToast(
            isFavorite
              ? 'Removed from wishlist'
              : `${product.title.length > 30 ? product.title.slice(0, 30) + '...' : product.title} added to wishlist`,
            'wishlist'
          )
        }}
        style={{
          position: 'absolute',
          top: 12,
          right: 12,
          zIndex: 10,
          background: isFavorite ? 'rgba(255, 97, 97, 0.1)' : 'rgba(0, 0, 0, 0.05)',
          width: 36,
          height: 36,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          border: isFavorite ? '1px solid rgba(255, 97, 97, 0.2)' : '1px solid transparent'
        }}
      >
        <svg 
          style={{ 
            width: 20, 
            height: 20, 
            fill: isFavorite ? 'var(--red)' : 'none', 
            stroke: isFavorite ? 'var(--red)' : 'var(--text-sub)', 
            strokeWidth: 2 
          }} 
          viewBox="0 0 24 24"
        >
          <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </button>

      {/* Product Image */}
      <div style={{ 
        height: 180, 
        marginBottom: 16, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: 10,
        background: '#fff',
        borderRadius: 12,
      }}>
        <img 
          src={product.image} 
          alt={product.title} 
          style={{ 
            maxHeight: '100%', 
            maxWidth: '100%', 
            objectFit: 'contain',
            transition: 'transform 0.5s ease'
          }} 
          onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
          onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
        />
      </div>

      {/* Product Info */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: 0.5 }}>{product.category}</span>
          <Stars rating={product.rating.rate} count={product.rating.count} />
        </div>
        
        <h3 style={{ 
          fontSize: 15, 
          fontWeight: 600, 
          marginBottom: 8, 
          color: 'var(--text)',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          lineHeight: 1.4,
          height: 42
        }}>
          {product.title}
        </h3>

        <div style={{ marginTop: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <span style={{ fontSize: 20, fontWeight: 900, color: 'var(--text)' }}>₹{product.price.toLocaleString('en-IN')}</span>
            <span style={{ fontSize: 13, textDecoration: 'line-through', color: 'var(--text-hint)' }}>₹{(product.price * 1.4).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
            <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--green)' }}>{discount}% OFF</span>
          </div>

          {/* Add to Cart Button (Stops propagation to prevent card click) */}
          <button 
            className="add-to-cart-btn"
            style={{
              width: '100%',
              background: 'var(--primary)',
              color: '#fff',
              padding: '10px',
              borderRadius: 10,
              fontWeight: 700,
              fontSize: 14,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              boxShadow: '0 4px 12px rgba(74, 144, 226, 0.2)',
            }}
            onClick={(e) => {
              e.stopPropagation()
              addToCart(product)
              showToast(`${product.title.length > 30 ? product.title.slice(0, 30) + '...' : product.title} added to cart`, 'success')
            }}
          >
            <svg style={{ width: 18, height: 18, fill: 'currentColor' }} viewBox="0 0 24 24">
              <path d="M11 9h2V6h3V4h-3V1h-2v3H8v2h3v3zm-4 9c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2zm-8.9-5h7.45c.75 0 1.41-.41 1.75-1.03L21.42 4.59c.17-.3.08-.67-.21-.84-.09-.05-.19-.08-.3-.08H5.21l-.94-2H1v2h2l3.6 7.59-1.35 2.44C5.06 14.09 5 14.53 5 15c0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25 0-.05.01-.09.03-.12L8.1 13z" />
            </svg>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}
