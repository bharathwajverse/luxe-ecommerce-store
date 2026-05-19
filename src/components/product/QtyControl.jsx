import { C } from '../../constants/theme'

/**
 * A reusable UI component for adjusting item quantities.
 * Provides increment and decrement buttons with a disabled state for the minimum value.
 */
export default function QtyControl({ qty, onChange, size }) {
  // Button size based on 'sm' or default
  let buttonSize = size === 'sm' ? 30 : 38

  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      border: '1px solid ' + C.border,
      borderRadius: 9,
      overflow: 'hidden',
    }}>
      {/* Minus button */}
      <button
        onClick={function () { if (qty > 1) onChange(qty - 1) }}
        disabled={qty <= 1}
        style={{
          width: buttonSize,
          height: buttonSize,
          background: 'none',
          border: 'none',
          color: qty <= 1 ? C.border : C.text,
          cursor: qty <= 1 ? 'not-allowed' : 'pointer',
          fontSize: 18,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        −
      </button>

      {/* Current quantity */}
      <span style={{
        padding: '0 14px',
        fontSize: size === 'sm' ? 13 : 15,
        fontWeight: 600,
        color: C.text,
        borderLeft: '1px solid ' + C.border,
        borderRight: '1px solid ' + C.border,
        lineHeight: buttonSize + 'px',
        minWidth: 36,
        textAlign: 'center',
      }}>
        {qty}
      </span>

      {/* Plus button */}
      <button
        onClick={function () { onChange(qty + 1) }}
        style={{
          width: buttonSize,
          height: buttonSize,
          background: 'none',
          border: 'none',
          color: C.text,
          cursor: 'pointer',
          fontSize: 18,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        +
      </button>
    </div>
  )
}
