import { C } from '../../constants/theme'

/**
 * A reusable UI component that displays a small, colored badge.
 * Typically used for labels or categories.
 */
export default function Badge({ children }) {
  return (
    <span style={{
      background: C.primary,
      color: '#fff',
      padding: '4px 10px',
      borderRadius: 2,
      fontSize: 12,
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    }}>
      {children}
    </span>
  )
}
