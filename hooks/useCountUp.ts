'use client'

import { useState, useEffect } from 'react'

export function useCountUp(target: number, duration: number = 800) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    const startTime = Date.now()
    const start = 0

    const animate = () => {
      const now = Date.now()
      const progress = Math.min((now - startTime) / duration, 1)
      const eased = 1 - (1 - progress) ** 2
      const current = start + (target - start) * eased
      setValue(current)
      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setValue(target)
      }
    }

    const id = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(id)
  }, [target, duration])

  return value
}
