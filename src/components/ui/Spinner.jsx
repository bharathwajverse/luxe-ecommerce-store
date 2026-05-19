import { C } from '../../constants/theme'

/**
 * A loading indicator component that displays a centered spinning circle.
 * Used across the app while fetching data or processing actions.
 */
export default function Spinner() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
    }}>
      <div style={{
        width: 40,
        height: 40,
        borderRadius: '50%',
        border: '3px solid ' + C.border,
        borderTopColor: C.primary,
        animation: 'spin 0.75s linear infinite',
      }} />
    </div>
  )
}
