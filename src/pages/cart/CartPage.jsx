import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../../hooks/useCart'
import { useAuth } from '../../hooks/useAuth'
import { C, FONTS } from '../../constants/theme'
import QtyControl from '../../components/product/QtyControl'
import OrderSummary from '../../components/cart/OrderSummary'

export default function CartPage() {
  // Global context hooks for cart and authentication
  let { cart, removeFromCart, updateQty, cartTotal } = useCart()
  let { isAuthenticated } = useAuth()
  
  let navigate = useNavigate()

  /**
   * If the cart is empty, displays a placeholder message 
   * with a link to browse products.
   */
  if (cart.length === 0) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '72vh',
        flexDirection: 'column',
        gap: 16,
        textAlign: 'center',
        padding: 24,
      }}>
        <h2 style={{ fontFamily: FONTS.serif, fontSize: 30, color: C.text }}>
          Your cart is empty
        </h2>
        <p style={{ fontSize: 15, color: C.textSub }}>
          Browse our collection and add items you love.
        </p>
        <button
          onClick={function () { navigate('/') }}
          style={{
            marginTop: 8,
            padding: '12px 32px',
            background: C.primary,
            border: 'none',
            borderRadius: 2,
            color: '#fff',
            cursor: 'pointer',
            fontSize: 14,
            fontWeight: 700,
          }}
        >
          Browse Products
        </button>
      </div>
    )
  }

  // Count total items
  let totalItems = 0
  for (let i = 0; i < cart.length; i++) {
    totalItems = totalItems + cart[i].qty
  }

  return (
    <div className="container" style={{ paddingTop: 40, paddingBottom: 80 }}>
      <h1 style={{ fontSize: 28, color: C.text, marginBottom: 36 }}>
        My Cart{' '}
        <span style={{ fontSize: 18, color: C.textSub, fontWeight: 400 }}>
          ({totalItems})
        </span>
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 28, alignItems: 'start' }}>

        {/* Cart items list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0, background: '#fff', boxShadow: '0 1px 1px 0 rgba(0,0,0,.2)', border: '1px solid #dbdbdb' }}>
          {cart.map(function (item) {
            return (
              <div key={item.id} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 18,
                background: '#fff',
                borderBottom: '1px solid #f0f0f0',
                padding: 24,
              }}>
                {/* Item image */}
                <div style={{
                  width: 110,
                  height: 110,
                  background: '#ffffff',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <img src={item.image} alt={item.title}
                    style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                </div>

                {/* Item info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{
                    fontSize: 16,
                    color: C.text,
                    fontWeight: 500,
                    marginBottom: 8,
                  }}>
                    {item.title}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 20, color: C.text, fontWeight: 700 }}>
                      ₹{item.price.toLocaleString('en-IN')}
                    </span>
                    <span style={{ fontSize: 14, textDecoration: 'line-through', color: '#878787' }}>
                      ₹{(item.price * 1.4).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                </div>

                {/* Quantity and remove */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 15, flexShrink: 0 }}>
                  <QtyControl
                    qty={item.qty}
                    onChange={function (newQty) { updateQty(item.id, newQty) }}
                    size="sm"
                  />
                  <button
                    onClick={function () { removeFromCart(item.id) }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: C.text,
                      cursor: 'pointer',
                      fontSize: 14,
                      fontWeight: 700,
                    }}
                  >
                    REMOVE
                  </button>
                </div>
              </div>
            )
          })}

          {/* Continue shopping link */}
          <button
            onClick={function () { navigate('/') }}
            style={{
              marginTop: 4,
              background: 'none',
              border: 'none',
              color: C.textSub,
              cursor: 'pointer',
              fontSize: 13,
              padding: 0,
            }}
          >
            ← Continue Shopping
          </button>
        </div>

        {/* Order summary sidebar */}
        <OrderSummary
          cart={cart}
          cartTotal={cartTotal}
          primaryAction={{
            label: isAuthenticated ? 'Proceed to Checkout' : 'Sign In to Checkout',
            onClick: function () {
              navigate(isAuthenticated ? '/checkout' : '/login')
            },
          }}
        />
      </div>
    </div>
  )
}
