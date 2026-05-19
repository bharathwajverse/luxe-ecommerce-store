import { C } from '../../constants/theme'

/**
 * A reusable wrapper for form inputs that includes a label and 
 * optional error message display.
 */
export default function FormField({ label, error, children }) {
  return (
    <div style={{ marginBottom: 18 }}>
      {/* Label */}
      <label style={{
        display: 'block',
        fontSize: 11,
        color: C.textSub,
        fontWeight: 700,
        letterSpacing: 0.8,
        marginBottom: 7,
        textTransform: 'uppercase',
      }}>
        {label}
      </label>

      {/* Input (passed as children) */}
      {children}

      {/* Error message */}
      {error && (
        <p style={{ fontSize: 12, color: C.red, marginTop: 5 }}>
          {error}
        </p>
      )}
    </div>
  )
}
