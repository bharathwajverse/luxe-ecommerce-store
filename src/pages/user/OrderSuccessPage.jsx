import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { C } from '../../constants/theme'

export default function OrderSuccessPage() {
  const navigate = useNavigate()
  const location = useLocation()
  
  // Retrieve the order details passed from the CheckoutPage via navigation state.
  const order = location.state?.order

  /**
   * Safety check: If the user refreshes or visits this URL directly 
   * without an active order in state, redirect them to the home page.
   */
  useEffect(() => {
    if (!order) {
      navigate('/', { replace: true })
    }
  }, [order, navigate])

  if (!order) return null

  return (
    <div style={{
      background: 'var(--bg)',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 16px',
    }}>
      <div className="fade-in" style={{ maxWidth: 640, width: '100%' }}>
        {/* Success Card */}
        <div style={{
          background: 'var(--bg-card)',
          borderRadius: 28,
          boxShadow: 'var(--shadow-lg)',
          overflow: 'hidden',
          border: '1px solid var(--border)',
        }}>
          {/* Green Header */}
          <div style={{
            background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
            padding: '48px 40px',
            textAlign: 'center',
          }}>
            {/* Animated Check */}
            <div style={{
              width: 80,
              height: 80,
              background: 'rgba(255,255,255,0.2)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
            }}>
              <svg style={{ width: 48, height: 48, fill: '#fff' }} viewBox="0 0 24 24">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
              </svg>
            </div>
            <h1 style={{ fontSize: 32, fontWeight: 900, color: '#fff', marginBottom: 8 }}>
              Order Placed!
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 16 }}>
              Thank you for shopping with FlipShop 🎉
            </p>
          </div>

          {/* Order Details */}
          <div style={{ padding: '32px 40px' }}>
            {/* Order ID */}
            <div style={{
              background: 'var(--bg)',
              borderRadius: 14,
              padding: '16px 20px',
              marginBottom: 24,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              border: '1px solid var(--border)',
            }}>
              <div>
                <p style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-sub)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Order ID</p>
                <p style={{ fontSize: 16, fontWeight: 900, color: 'var(--text)', fontFamily: 'monospace' }}>{order.id}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-sub)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Date</p>
                <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>
                  {new Date(order.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                </p>
              </div>
            </div>

            {/* Delivery Address */}
            <div style={{ marginBottom: 24 }}>
              <h3 style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-sub)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>Delivering To</h3>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: C.primary + '20',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                }}>
                  <svg style={{ width: 18, height: 18, fill: C.primary }} viewBox="0 0 24 24">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                  </svg>
                </div>
                <div>
                  <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 2 }}>{order.address.name}</p>
                  <p style={{ fontSize: 13, color: 'var(--text-sub)' }}>
                    {order.address.street}, {order.address.city}, {order.address.state} – {order.address.zip}
                  </p>
                </div>
              </div>
            </div>

            {/* Items */}
            <div style={{ marginBottom: 24 }}>
              <h3 style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-sub)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>
                Items Ordered ({order.items.length})
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {order.items.map(item => (
                  <div key={item.id} style={{
                    display: 'flex', alignItems: 'center', gap: 14,
                    padding: '12px 16px',
                    background: 'var(--bg)',
                    borderRadius: 12,
                    border: '1px solid var(--border)',
                  }}>
                    <div style={{
                      width: 52, height: 52, borderRadius: 10,
                      background: '#fff', border: '1px solid var(--border)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0, padding: 4
                    }}>
                      <img src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</p>
                      <p style={{ fontSize: 12, color: 'var(--text-sub)' }}>Qty: {item.qty}</p>
                    </div>
                    <p style={{ fontSize: 14, fontWeight: 800, color: 'var(--text)', flexShrink: 0 }}>
                      ₹{(item.price * item.qty).toLocaleString('en-IN')}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '16px 20px',
              background: C.primary + '10',
              borderRadius: 12,
              marginBottom: 32,
              border: `1px solid ${C.primary}30`,
            }}>
              <span style={{ fontSize: 16, fontWeight: 800, color: 'var(--text)' }}>Total Paid</span>
              <span style={{ fontSize: 20, fontWeight: 900, color: C.primary }}>
                ₹{order.totalAmount.toLocaleString('en-IN')}
              </span>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 16 }}>
              <button
                onClick={() => navigate('/orders')}
                style={{
                  flex: 1,
                  padding: '14px',
                  borderRadius: 12,
                  border: `2px solid ${C.primary}`,
                  color: C.primary,
                  fontWeight: 800,
                  fontSize: 14,
                  background: 'transparent',
                }}
                onMouseEnter={e => e.currentTarget.style.background = C.primary + '15'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                View Order History
              </button>
              <button
                onClick={() => navigate('/')}
                style={{
                  flex: 1,
                  padding: '14px',
                  borderRadius: 12,
                  background: C.primary,
                  color: '#fff',
                  fontWeight: 800,
                  fontSize: 14,
                }}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
