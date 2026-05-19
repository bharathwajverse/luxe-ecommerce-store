import { C, FONTS } from '../../constants/theme'

// Order summary sidebar - shows cart items and total price
export default function OrderSummary({ cart, cartTotal, primaryAction }) {
  /**
   * Calculate the total quantity of all items in the cart.
   * This is used to display the count next to "Price".
   */
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0)

  return (
    <div style={{
      background: 'var(--bg-card)',
      boxShadow: 'var(--shadow)',
      border: '1px solid var(--border)',
      position: 'sticky',
      top: 80,
      borderRadius: 4,
    }}>
      <h2 style={{
        fontSize: 16,
        fontWeight: 700,
        color: 'var(--text-sub)',
        padding: '16px 24px',
        borderBottom: '1px solid var(--border)',
        textTransform: 'uppercase',
      }}>
        Price Details
      </h2>

      <div style={{ padding: 24 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Price breakdown: Base price, Discount (simulated), and final Total */}
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 16, color: 'var(--text)' }}>Price ({totalItems} item{totalItems !== 1 ? 's' : ''})</span>
            <span style={{ fontSize: 16, color: 'var(--text)' }}>₹{(cartTotal * 1.4).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 16, color: 'var(--text)' }}>Discount</span>
            <span style={{ fontSize: 16, color: C.green }}>- ₹{(cartTotal * 0.4).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 20, borderBottom: '1px dashed var(--border)' }}>
            <span style={{ fontSize: 16, color: 'var(--text)' }}>Delivery Charges</span>
            <span style={{ fontSize: 16, color: C.green }}>FREE</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
            <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)' }}>Total Amount</span>
            <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)' }}>₹{cartTotal.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Action button (like "Proceed to Checkout") */}
        {primaryAction && (
          <button
            onClick={primaryAction.onClick}
            style={{
              width: '100%',
              padding: '16px 24px',
              background: C.secondary,
              border: 'none',
              borderRadius: 2,
              color: '#fff',
              cursor: 'pointer',
              fontSize: 15,
              fontWeight: 700,
              marginTop: 30,
              boxShadow: '0 1px 2px 0 rgba(0,0,0,.2)',
            }}
          >
            {primaryAction.label.toUpperCase()}
          </button>
        )}
      </div>
    </div>
  )
}
