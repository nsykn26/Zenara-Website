import React, { useRef, useEffect, useState } from 'react'

export default function TextScrollMarquee({
  children,
  baseVelocity = 1,
  direction = 'left',
  className = '',
  scrollDependent = true,
  delay = 0,
}) {
  const containerRef = useRef(null)
  const measureRef = useRef(null)
  const innerRef = useRef(null)
  const [copies, setCopies] = useState(2)

  // Compute how many copies of `children` we need to fill at least twice the container width
  useEffect(() => {
    function update() {
      const containerW = containerRef.current?.offsetWidth || 0
      const singleW = measureRef.current?.offsetWidth || 1
      const needed = Math.max(2, Math.ceil((containerW * 2) / singleW))
      setCopies(needed)
    }

    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [children])

  // Animation timing
  const duration = Math.max(8, 20 / Math.max(0.1, baseVelocity)) // seconds
  const animationDirection = direction === 'right' ? 'reverse' : 'normal'

  useEffect(() => {
    const el = innerRef.current
    if (!el) return
    el.style.animationPlayState = 'running'
  }, [copies])

  // Prepare arrays for one set and its duplicate (for seamless loop)
  const firstSet = Array.from({ length: copies })
  const secondSet = Array.from({ length: copies })

  return (
    <div ref={containerRef} className={`overflow-hidden whitespace-nowrap ${className}`} aria-live="off">
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .marquee-inner {
          display: inline-block;
          white-space: nowrap;
          will-change: transform;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
      `}</style>

      <div
        ref={innerRef}
        className="marquee-inner"
        style={{
          animationName: 'marquee',
          animationDuration: `${duration}s`,
          animationDirection,
          animationDelay: `${delay}ms`,
        }}
      >
        {/* measure span (first item) */}
        <span ref={measureRef} style={{ marginRight: '2rem', display: 'inline-block' }}>{children}</span>

        {/* render rest of first set */}
        {firstSet.slice(1).map((_, i) => (
          <span key={`a-${i}`} style={{ marginRight: '2rem', display: 'inline-block' }}>{children}</span>
        ))}

        {/* duplicate the set for seamless looping */}
        {secondSet.map((_, i) => (
          <span key={`b-${i}`} style={{ marginRight: '2rem', display: 'inline-block' }}>{children}</span>
        ))}
      </div>
    </div>
  )
}
