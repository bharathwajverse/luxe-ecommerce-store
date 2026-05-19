import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../../hooks/useCart'
import { useAuth } from '../../hooks/useAuth'
import { C, FONTS, inputStyle, inputErrorStyle } from '../../constants/theme'
import { validateShipping, validatePayment, formatCard, formatExpiry, generateOrderId } from '../../utils/validators'
import { getOrdersKey } from '../../contexts/AuthContext'
import FormField from '../../components/ui/FormField'
import OrderSummary from '../../components/cart/OrderSummary'

// Steps in the checkout process
let STEPS = ['Shipping', 'Payment', 'Review']

export default function CheckoutPage() {
  // Access global state for cart and user information
  let { cart, cartTotal, clearCart } = useCart()
  let { user } = useAuth()
  let navigate = useNavigate()

  // Track the current step in the 3-step checkout process
  let [step, setStep] = useState(1)

  // Form data
  let [form, setForm] = useState({
    name: user?.name || '',
    address: '',
    city: '',
    state: '',
    zip: '',
    card: '',
    expiry: '',
    cvv: '',
  })
  let [errors, setErrors] = useState({})

  // Update a single form field
  function updateField(fieldName, value) {
    setForm(function (oldForm) {
      return { ...oldForm, [fieldName]: value }
    })
  }

  // Go to next step (with validation)
  /**
   * Advances to the next step after validating the current step's inputs.
   */
  function handleNext() {
    let newErrors = {}

    if (step === 1) newErrors = validateShipping(form)
    if (step === 2) newErrors = validatePayment(form)

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setErrors({})
    setStep(step + 1)
  }

  // Go back one step
  function handleBack() {
    setStep(step - 1)
  }

  // Place the order
  /**
   * Finalizes the order, saves it to localStorage, clears the cart, 
   * and redirects the user to the success page.
   */
  function handlePlaceOrder() {
    // Generate a unique, readable order ID
    const newOrderId = `ORD-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 5).toUpperCase()}`
    
    const newOrder = {
      id: newOrderId,
      date: new Date().toISOString(),
      status: "confirmed",
      items: cart,
      totalAmount: cartTotal,
      address: {
        name: form.name,
        street: form.address,
        city: form.city,
        state: form.state,
        zip: form.zip
      }
    }

    // Persist the order in the user's order history
    const ordersKey = getOrdersKey(user?.email)
    const existingOrders = JSON.parse(localStorage.getItem(ordersKey) || '[]')
    localStorage.setItem(ordersKey, JSON.stringify([newOrder, ...existingOrders]))

    // Cleanup and complete the process
    clearCart()
    navigate('/order-success', { state: { order: newOrder } })
  }

  // ---- CHECKOUT FORM ----

  return (
    <div className="container" style={{ paddingTop: 40, paddingBottom: 80 }}>
      <h1 style={{ fontSize: 28, color: C.text, marginBottom: 36 }}>
        Checkout
      </h1>

      {/* ---- STEPPER (shows which step you're on) ---- */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 44, maxWidth: 600 }}>
        {STEPS.map(function (label, index) {
          let stepNumber = index + 1
          let isDone = stepNumber < step
          let isCurrent = stepNumber === step

          return (
            <div key={label} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {/* Step circle */}
                <div style={{
                  width: 30,
                  height: 30,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 13,
                  fontWeight: 700,
                  background: isDone ? C.green : isCurrent ? C.primary : '#fff',
                  color: isDone || isCurrent ? '#fff' : C.textSub,
                  border: '1px solid ' + (isDone ? C.green : isCurrent ? C.primary : C.border),
                }}>
                  {isDone ? '✓' : stepNumber}
                </div>
                {/* Step label */}
                <span style={{
                  fontSize: 14,
                  fontWeight: isCurrent ? 700 : 400,
                  color: isCurrent ? C.text : C.textSub,
                }}>
                  {label}
                </span>
              </div>

              {/* Connector line between steps */}
              {index < STEPS.length - 1 && (
                <div style={{
                  flex: 1,
                  height: 1,
                  background: isDone ? C.green : C.border,
                  margin: '0 12px',
                }} />
              )}
            </div>
          )
        })}
      </div>

      {/* ---- TWO COLUMN LAYOUT ---- */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 28, alignItems: 'start' }}>

        {/* Form panel */}
        <div style={{
          background: '#fff',
          border: '1px solid #dbdbdb',
          boxShadow: '0 1px 1px 0 rgba(0,0,0,.1)',
          padding: 32,
        }}>

          {/* Step 1: Shipping */}
          {step === 1 && (
            <>
              <h2 style={{ fontSize: 20, color: C.text, marginBottom: 26 }}>
                Shipping Address
              </h2>
              <FormField label="Full Name" error={errors.name}>
                <input value={form.name}
                  onChange={function (e) { updateField('name', e.target.value) }}
                  placeholder="John Doe"
                  style={errors.name ? inputErrorStyle : inputStyle} />
              </FormField>
              <FormField label="Street Address" error={errors.address}>
                <input value={form.address}
                  onChange={function (e) { updateField('address', e.target.value) }}
                  placeholder="123 Main Street"
                  style={errors.address ? inputErrorStyle : inputStyle} />
              </FormField>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 14 }}>
                <FormField label="City" error={errors.city}>
                  <input value={form.city}
                    onChange={function (e) { updateField('city', e.target.value) }}
                    placeholder="New York"
                    style={errors.city ? inputErrorStyle : inputStyle} />
                </FormField>
                <FormField label="State" error={errors.state}>
                  <input value={form.state}
                    onChange={function (e) { updateField('state', e.target.value) }}
                    placeholder="NY"
                    style={errors.state ? inputErrorStyle : inputStyle} />
                </FormField>
                <FormField label="ZIP" error={errors.zip}>
                  <input value={form.zip}
                    onChange={function (e) { updateField('zip', e.target.value) }}
                    placeholder="10001"
                    maxLength={6}
                    style={errors.zip ? inputErrorStyle : inputStyle} />
                </FormField>
              </div>
            </>
          )}

          {/* Step 2: Payment */}
          {step === 2 && (
            <>
              <h2 style={{ fontSize: 20, color: C.text, marginBottom: 26 }}>
                Payment Details
              </h2>
              <FormField label="Card Number" error={errors.card}>
                <input value={form.card}
                  onChange={function (e) { updateField('card', formatCard(e.target.value)) }}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  style={errors.card ? inputErrorStyle : inputStyle} />
              </FormField>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <FormField label="Expiry (MM/YY)" error={errors.expiry}>
                  <input value={form.expiry}
                    onChange={function (e) { updateField('expiry', formatExpiry(e.target.value)) }}
                    placeholder="12/26"
                    maxLength={5}
                    style={errors.expiry ? inputErrorStyle : inputStyle} />
                </FormField>
                <FormField label="CVV" error={errors.cvv}>
                  <input value={form.cvv}
                    onChange={function (e) { updateField('cvv', e.target.value.replace(/\D/g, '').slice(0, 3)) }}
                    placeholder="123"
                    maxLength={3}
                    type="password"
                    style={errors.cvv ? inputErrorStyle : inputStyle} />
                </FormField>
              </div>

              {/* Security note */}
              <div style={{
                background: C.blueBg,
                border: '1px solid ' + C.primary + '30',
                borderRadius: 2,
                padding: '12px 16px',
                fontSize: 12,
                color: C.primary,
              }}>
                🔒 Your payment information is secure. (Demo mode — no real charges.)
              </div>
            </>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <>
              <h2 style={{ fontSize: 20, color: C.text, marginBottom: 26 }}>
                Review Your Order
              </h2>

              {/* Shipping info */}
              <div style={{ background: '#f9f9f9', border: '1px solid #dbdbdb', borderRadius: 2, padding: '14px 18px', marginBottom: 14 }}>
                <p style={{ fontSize: 11, color: C.primary, textTransform: 'uppercase', fontWeight: 700, marginBottom: 10 }}>Shipping to</p>
                <p style={{ fontSize: 14, color: C.text }}>{form.name}</p>
                <p style={{ fontSize: 14, color: C.textSub }}>
                  {form.address}, {form.city}, {form.state} {form.zip}
                </p>
              </div>

              {/* Payment info */}
              <div style={{ background: '#f9f9f9', border: '1px solid #dbdbdb', borderRadius: 2, padding: '14px 18px', marginBottom: 14 }}>
                <p style={{ fontSize: 11, color: C.primary, textTransform: 'uppercase', fontWeight: 700, marginBottom: 10 }}>Payment method</p>
                <p style={{ fontSize: 14, color: C.text }}>
                  Card ending in <strong>{form.card.replace(/\s/g, '').slice(-4)}</strong> · Expires {form.expiry}
                </p>
              </div>

              {/* Items */}
              <div style={{ background: '#f9f9f9', border: '1px solid #dbdbdb', borderRadius: 2, padding: '14px 18px', marginBottom: 14 }}>
                <p style={{ fontSize: 11, color: C.primary, textTransform: 'uppercase', fontWeight: 700, marginBottom: 10 }}>
                  Items ({cart.length})
                </p>
                {cart.map(function (item) {
                  return (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span style={{ fontSize: 13, color: C.textSub }}>
                        {item.title.slice(0, 38)} ×{item.qty}
                      </span>
                      <span style={{ fontSize: 13, color: C.text, fontWeight: 600 }}>
                        ₹{(item.price * item.qty).toLocaleString('en-IN')}
                      </span>
                    </div>
                  )
                })}
              </div>
            </>
          )}

          {/* ---- NAVIGATION BUTTONS ---- */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 28 }}>
            {step > 1 ? (
              <button onClick={handleBack} style={{
                padding: '12px 22px',
                background: 'transparent',
                border: '1px solid ' + C.border,
                borderRadius: 2,
                color: C.textSub,
                cursor: 'pointer',
                fontSize: 14,
              }}>
                ← Back
              </button>
            ) : <div />}

            {step < 3 ? (
              <button onClick={handleNext} style={{
                padding: '12px 30px',
                background: C.secondary,
                border: 'none',
                borderRadius: 2,
                color: '#fff',
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: 700,
              }}>
                CONTINUE
              </button>
            ) : (
              <button onClick={handlePlaceOrder} style={{
                padding: '13px 34px',
                background: C.secondary,
                border: 'none',
                borderRadius: 2,
                color: '#fff',
                cursor: 'pointer',
                fontSize: 15,
                fontWeight: 700,
              }}>
                PLACE ORDER
              </button>
            )}
          </div>
        </div>

        {/* Order Summary sidebar */}
        <OrderSummary cart={cart} cartTotal={cartTotal} />
      </div>
    </div>
  )
}
