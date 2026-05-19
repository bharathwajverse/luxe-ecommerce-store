import { useWishlist } from '../../contexts/WishlistContext'
import ProductCard from '../../components/product/ProductCard'
import { C } from '../../constants/theme'
import { useNavigate } from 'react-router-dom'

/**
 * Displays a list of products that the user has saved to their wishlist.
 * Provides a quick view of favorites and a link to return to shopping.
 */
export default function WishlistPage() {
  const { wishlist } = useWishlist()
  const navigate = useNavigate()

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', padding: '40px 0' }}>
      <div className="container">
        <div style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: 32, fontWeight: 900, color: 'var(--text)', marginBottom: 8 }}>My Wishlist</h1>
            <p style={{ color: 'var(--text-sub)' }}>You have {wishlist.length} items saved for later</p>
          </div>
          <button 
            onClick={() => navigate('/')}
            style={{ color: C.primary, fontWeight: 800, fontSize: 14 }}
          >
            CONTINUE SHOPPING
          </button>
        </div>

        {wishlist.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '80px 20px', 
            background: 'var(--bg-card)', 
            borderRadius: 24,
            boxShadow: 'var(--shadow)'
          }}>
            <div style={{ marginBottom: 32, display: 'flex', justifyContent: 'center' }}>
              <div style={{ 
                width: 120, 
                height: 120, 
                borderRadius: '50%', 
                background: 'var(--primary-light)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}>
                <svg style={{ width: 64, height: 64, fill: 'var(--primary)', opacity: 0.8 }} viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </div>
            </div>
            <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 12 }}>Your wishlist is empty</h2>
            <p style={{ color: 'var(--text-sub)', marginBottom: 32 }}>Save items you like to find them easily later!</p>
            <button 
              onClick={() => navigate('/')}
              style={{ 
                background: C.primary, 
                color: '#fff', 
                padding: '14px 40px', 
                borderRadius: 12, 
                fontWeight: 800 
              }}
            >
              Discover Products
            </button>
          </div>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', 
            gap: 24 
          }}>
            {wishlist.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
