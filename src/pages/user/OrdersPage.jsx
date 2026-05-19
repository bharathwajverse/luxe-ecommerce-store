import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { getOrdersKey } from '../../contexts/AuthContext'
import { C } from '../../constants/theme'

const STATUS_STEPS = ['confirmed', 'processing', 'shipped', 'delivered']

const STATUS_LABELS = {
  confirmed: 'Order Confirmed',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
}

const STATUS_COLORS = {
  confirmed: '#3b82f6',
  processing: '#f59e0b',
  shipped: '#8b5cf6',
  delivered: '#22c55e',
}

function StatusBadge({ status }) {
  const color = STATUS_COLORS[status] || '#888'
  return (
    <span style={{
      background: color + '20',
      color,
      padding: '4px 12px',
      borderRadius: 20,
      fontSize: 12,
      fontWeight: 800,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    }}>
      {STATUS_LABELS[status] || status}
    </span>
  )
}

export default function OrdersPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [expandedOrder, setExpandedOrder] = useState(null)
  const [orders, setOrders] = useState([])

  /**
   * Loads the user's order history from localStorage based on their email.
   * Scopes the data so users only see their own orders.
   */
  useEffect(() => {
    const key = getOrdersKey(user?.email)
    const stored = JSON.parse(localStorage.getItem(key) || '[]')
    setOrders(stored)
  }, [user])

  if (orders.length === 0) {
    return (
      <div style={{ background: 'var(--bg)', minHeight: '100vh', padding: '60px 16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="fade-in" style={{ textAlign: 'center' }}>
          <div style={{
            width: 120, height: 120, borderRadius: '50%',
            background: C.primary + '15',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 24px'
          }}>
            <svg style={{ width: 60, height: 60, fill: C.primary, opacity: 0.7 }} viewBox="0 0 24 24">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z" />
            </svg>
          </div>
          <h2 style={{ fontSize: 28, fontWeight: 900, color: 'var(--text)', marginBottom: 12 }}>No Orders Yet</h2>
          <p style={{ color: 'var(--text-sub)', marginBottom: 32, fontSize: 16 }}>
            Your order history will appear here after you make a purchase.
          </p>
          <button
            onClick={() => navigate('/')}
            style={{ background: C.primary, color: '#fff', padding: '14px 40px', borderRadius: 12, fontWeight: 800, fontSize: 15 }}
          >
            Start Shopping
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', padding: '40px 0 80px' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 32, fontWeight: 900, color: 'var(--text)', marginBottom: 8 }}>My Orders</h1>
          <p style={{ color: 'var(--text-sub)' }}>{orders.length} order{orders.length !== 1 ? 's' : ''} placed</p>
        </div>

        {/* Orders List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {orders.map(order => {
            const isExpanded = expandedOrder === order.id
            const statusIndex = STATUS_STEPS.indexOf(order.status)

            return (
              <div
                key={order.id}
                className="fade-in"
                style={{
                  background: 'var(--bg-card)',
                  borderRadius: 20,
                  border: '1px solid var(--border)',
                  boxShadow: 'var(--shadow)',
                  overflow: 'hidden',
                }}
              >
                {/* Order Header Summary Row (Click to Expand) */}
                <div
                  onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                  style={{
                    padding: '20px 28px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    gap: 16,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 20, flex: 1, minWidth: 0 }}>
                    {/* Visual collage of the first 3 items in the order */}
                    <div style={{ display: 'flex', flexShrink: 0 }}>
                      {order.items.slice(0, 3).map((item, i) => (
                        <div key={item.id} style={{
                          width: 48, height: 48,
                          borderRadius: 10,
                          border: '2px solid var(--bg-card)',
                          background: '#fff',
                          marginLeft: i > 0 ? -16 : 0,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          overflow: 'hidden',
                          zIndex: 3 - i,
                          position: 'relative',
                          padding: 4,
                        }}>
                          <img src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                        </div>
                      ))}
                    </div>

                    <div style={{ minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
                        <p style={{ fontSize: 13, fontWeight: 800, color: 'var(--text)', fontFamily: 'monospace' }}>{order.id}</p>
                        <StatusBadge status={order.status} />
                      </div>
                      <p style={{ fontSize: 13, color: 'var(--text-sub)' }}>
                        {new Date(order.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })} ·{' '}
                        {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexShrink: 0 }}>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-sub)', marginBottom: 2 }}>TOTAL</p>
                      <p style={{ fontSize: 18, fontWeight: 900, color: 'var(--text)' }}>₹{order.totalAmount.toLocaleString('en-IN')}</p>
                    </div>
                    <svg
                      style={{ width: 20, height: 20, fill: 'var(--text-hint)', transition: '0.3s', transform: isExpanded ? 'rotate(180deg)' : 'none' }}
                      viewBox="0 0 24 24"
                    >
                      <path d="M7 10l5 5 5-5z" />
                    </svg>
                  </div>
                </div>

                {/* Expanded: Tracker + Items */}
                {isExpanded && (
                  <div className="fade-in" style={{ borderTop: '1px solid var(--border)', padding: '28px 28px 24px' }}>
                    {/* Status Tracker */}
                    <div style={{ marginBottom: 32 }}>
                      <h3 style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-sub)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 20 }}>Order Status</h3>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 0 }}>
                        {STATUS_STEPS.map((step, i) => {
                          const isDone = i <= statusIndex
                          const color = isDone ? (STATUS_COLORS[order.status] || C.primary) : 'var(--border)'
                          return (
                            <div key={step} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                              <div style={{ width: '100%', display: 'flex', alignItems: 'center' }}>
                                {i > 0 && <div style={{ flex: 1, height: 3, background: isDone ? color : 'var(--border)', borderRadius: 2 }} />}
                                <div style={{
                                  width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                                  background: isDone ? color : 'var(--bg)',
                                  border: `3px solid ${isDone ? color : 'var(--border)'}`,
                                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  transition: '0.3s',
                                }}>
                                  {isDone && (
                                    <svg style={{ width: 14, height: 14, fill: '#fff' }} viewBox="0 0 24 24">
                                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                                    </svg>
                                  )}
                                </div>
                                {i < STATUS_STEPS.length - 1 && <div style={{ flex: 1, height: 3, background: i < statusIndex ? color : 'var(--border)', borderRadius: 2 }} />}
                              </div>
                              <p style={{ fontSize: 11, fontWeight: 700, marginTop: 8, color: isDone ? 'var(--text)' : 'var(--text-hint)', textAlign: 'center' }}>
                                {STATUS_LABELS[step]}
                              </p>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    {/* Delivery Address */}
                    <div style={{ marginBottom: 24, padding: '14px 18px', background: 'var(--bg)', borderRadius: 12, border: '1px solid var(--border)' }}>
                      <p style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-sub)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>Delivery Address</p>
                      <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>{order.address.name}</p>
                      <p style={{ fontSize: 13, color: 'var(--text-sub)' }}>
                        {order.address.street}, {order.address.city}, {order.address.state} – {order.address.zip}
                      </p>
                    </div>

                    {/* Items */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {order.items.map(item => (
                        <div
                          key={item.id}
                          onClick={() => navigate(`/product/${item.id}`)}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 14,
                            padding: '12px 16px',
                            background: 'var(--bg)',
                            borderRadius: 12,
                            border: '1px solid var(--border)',
                            cursor: 'pointer',
                            transition: '0.2s',
                          }}
                          onMouseEnter={e => e.currentTarget.style.borderColor = C.primary}
                          onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                        >
                          <div style={{
                            width: 52, height: 52, borderRadius: 10,
                            background: '#fff', border: '1px solid var(--border)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            flexShrink: 0, padding: 4
                          }}>
                            <img src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                          </div>
                          <div style={{ flex: 1 }}>
                            <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 2 }}>{item.title}</p>
                            <p style={{ fontSize: 12, color: 'var(--text-sub)' }}>Qty: {item.qty} · ₹{item.price.toLocaleString('en-IN')} each</p>
                          </div>
                          <p style={{ fontSize: 14, fontWeight: 800, color: 'var(--text)', flexShrink: 0 }}>
                            ₹{(item.price * item.qty).toLocaleString('en-IN')}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
