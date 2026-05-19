import { C } from '../../constants/theme'

/**
 * A reusable rating component that displays 5 stars.
 * It fills stars based on the numeric rating and shows the total review count.
 */
export default function Stars({ rating, count }) {
  // Round the rating to decide how many stars to fill
  let filledStars = Math.round(rating)

  return (
    <span style={{ display: 'inline-flex', gap: 4, alignItems: 'center' }}>
      {/* Render 5 stars */}
      {[1, 2, 3, 4, 5].map(function (starNumber) {
        // Fill star if its number is <= rounded rating
        let fillColor = starNumber <= filledStars ? '#ffc107' : 'var(--border)'

        return (
          <svg key={starNumber} width="14" height="14" viewBox="0 0 24 24" fill={fillColor}>
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        )
      })}

      {/* Show rating number and review count */}
      <span style={{ fontSize: 13, color: 'var(--text-sub)', marginLeft: 2, fontWeight: 600 }}>
        {rating ? rating.toFixed(1) : '0.0'}
        {count !== undefined && (
          <span style={{ color: 'var(--text-hint)', fontWeight: 400 }}> ({count})</span>
        )}
      </span>
    </span>
  )
}
