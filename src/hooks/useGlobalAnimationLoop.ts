'use client'

import { useEffect, useRef } from 'react'
import { useEmojiStore } from '@/store/emojiStore'
import { config } from '@/config'

interface EmojiPhysics {
  id: string
  x: number
  y: number
  vx: number
  vy: number
  element?: HTMLElement
}

// Throttle function for store updates
const throttle = <T extends unknown[]>(func: (...args: T) => void, limit: number) => {
  let inThrottle: boolean
  return function(...args: T) {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

export const useGlobalAnimationLoop = () => {
  const animationIdRef = useRef<number | undefined>(undefined)
  const emojiPhysicsRef = useRef<Map<string, EmojiPhysics>>(new Map())
  const lastUpdateRef = useRef<number>(0)
  
  const { activeEmojis, updateEmojiPosition } = useEmojiStore()

  // Throttled store update function - only update every 100ms
  const throttledStoreUpdate = useRef(
    throttle((updates: Array<{id: string, x: number, y: number, vx: number, vy: number}>) => {
      updates.forEach(({id, x, y, vx, vy}) => {
        updateEmojiPosition(id, x, y, vx, vy)
      })
    }, 100)
  ).current

  // Initialize physics objects when emojis are added
  useEffect(() => {
    const currentPhysics = emojiPhysicsRef.current
    
    // Add new emojis to physics engine
    activeEmojis.forEach(emoji => {
      if (!currentPhysics.has(emoji.id)) {
        currentPhysics.set(emoji.id, {
          id: emoji.id,
          x: emoji.x,
          y: emoji.y,
          vx: emoji.vx || 0,
          vy: emoji.vy || 0,
        })
      }
    })

    // Remove deleted emojis from physics
    const activeIds = new Set(activeEmojis.map(e => e.id))
    for (const [id] of currentPhysics) {
      if (!activeIds.has(id)) {
        currentPhysics.delete(id)
      }
    }
  }, [activeEmojis])

  // Viewport culling helper
  const isInViewport = (x: number, y: number, buffer = 100): boolean => {
    return (
      x >= -buffer && 
      x <= window.innerWidth + buffer &&
      y >= -buffer && 
      y <= window.innerHeight + buffer
    )
  }

  // Main animation loop
  useEffect(() => {
    const animate = (currentTime: number) => {
      const deltaTime = Math.min((currentTime - lastUpdateRef.current) / 1000, 0.016) // Cap at 16ms
      lastUpdateRef.current = currentTime

      const physicsMap = emojiPhysicsRef.current
      const storeUpdates: Array<{id: string, x: number, y: number, vx: number, vy: number}> = []

      // Update physics for all emojis in one loop
      for (const [id, physics] of physicsMap) {
        // Skip if emoji is too far off-screen (viewport culling)
        if (!isInViewport(physics.x, physics.y, 200)) {
          continue
        }

        // Apply physics
        const friction = config.FRICTION
        const gravity = config.GRAVITY
        
        // Update velocity
        physics.vx *= friction
        physics.vy = physics.vy * friction + gravity

        // Update position
        physics.x += physics.vx * deltaTime * 60 // Normalize to 60fps
        physics.y += physics.vy * deltaTime * 60

        // Boundary collision
        const emojiSize = 40
        const bounceThreshold = config.BOUNCE_DAMPING

        if (physics.x <= emojiSize || physics.x >= window.innerWidth - emojiSize) {
          physics.vx *= -bounceThreshold
          physics.x = Math.max(emojiSize, Math.min(window.innerWidth - emojiSize, physics.x))
        }

        if (physics.y <= emojiSize || physics.y >= window.innerHeight - emojiSize) {
          physics.vy *= -bounceThreshold
          physics.y = Math.max(emojiSize, Math.min(window.innerHeight - emojiSize, physics.y))
        }

        // Collect updates for throttled store update
        storeUpdates.push({
          id,
          x: physics.x,
          y: physics.y,
          vx: physics.vx,
          vy: physics.vy
        })

        // Direct DOM update for smooth animation (bypasses React)
        const element = document.querySelector(`[data-emoji-id="${id}"]`) as HTMLElement
        if (element) {
          element.style.transform = `translate3d(${physics.x}px, ${physics.y}px, 0)`
        }
      }

      // Throttled store updates (for data consistency, not visual updates)
      if (storeUpdates.length > 0) {
        throttledStoreUpdate(storeUpdates)
      }

      animationIdRef.current = requestAnimationFrame(animate)
    }

    animationIdRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
      }
    }
  }, [throttledStoreUpdate, updateEmojiPosition])

  // Return physics data for components to use
  return {
    getEmojiPhysics: (id: string) => emojiPhysicsRef.current.get(id),
    isAnimating: () => !!animationIdRef.current
  }
}
