import { Link } from 'react-router-dom'

import { CATEGORIES } from '../constants/products'

/**
 * Static Footer component that displays brand information, 
 * quick navigation links, and copyright info.
 */
export default function Footer() {
  const footerCategories = CATEGORIES.filter(c => c !== 'all').slice(0, 5)

  return (
    <footer style={{
      background: '#172337',
      padding: '60px 24px 40px',
      color: '#fff',
    }}>
      <div className="container" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 48,
      }}>
        {/* Brand info */}
        <div>
          <h4 style={{
            color: '#fff',
            fontSize: 24,
            marginBottom: 20,
            fontStyle: 'italic',
            fontWeight: 800,
          }}>
            FlipShop
          </h4>
          <p style={{ fontSize: 14, lineHeight: 1.6, maxWidth: 300, color: '#878787' }}>
            Premium e-commerce experience. From tech to fashion, we deliver the best products at great prices.
          </p>
        </div>

        {/* Shop links */}
        <div>
          <h5 style={{ color: '#878787', fontSize: 14, marginBottom: 20, fontWeight: 600, textTransform: 'uppercase' }}>
            Shop
          </h5>
          <ul style={{ listStyle: 'none', padding: 0, fontSize: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {footerCategories.map(cat => (
              <li key={cat}>
                <Link to={`/category/${cat}`} style={{ color: '#fff', textDecoration: 'none', transition: 'opacity 0.2s' }} onMouseEnter={e => e.target.style.opacity = '0.7'} onMouseLeave={e => e.target.style.opacity = '1'}>
                  {cat}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Help links */}
        <div>
          <h5 style={{ color: '#878787', fontSize: 14, marginBottom: 20, fontWeight: 600, textTransform: 'uppercase' }}>
            Help
          </h5>
          <ul style={{ listStyle: 'none', padding: 0, fontSize: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <li><Link to="#" style={{ color: '#fff', textDecoration: 'none' }}>Shipping Policy</Link></li>
            <li><Link to="#" style={{ color: '#fff', textDecoration: 'none' }}>Returns & Refunds</Link></li>
            <li><Link to="#" style={{ color: '#fff', textDecoration: 'none' }}>FAQs</Link></li>
          </ul>
        </div>

        {/* Copyright */}
        <div>
          <h5 style={{ color: '#878787', fontSize: 14, marginBottom: 20, fontWeight: 600, textTransform: 'uppercase' }}>
            Connect
          </h5>
          <p style={{ fontSize: 12, marginTop: 20, color: '#878787' }}>
            © 2026 FlipShop India. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
