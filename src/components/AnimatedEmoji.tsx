'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { EmojiInstance } from '@/types/emoji'
import { useEmojiStore } from '@/store/emojiStore'

interface AnimatedEmojiProps {
    emoji: EmojiInstance
}

export default function AnimatedEmoji({ emoji }: AnimatedEmojiProps) {
    const [position, setPosition] = useState({ x: emoji.x, y: emoji.y })
    const [velocity, setVelocity] = useState({ vx: emoji.vx || 0, vy: emoji.vy || 0 })
    const updateEmojiPosition = useEmojiStore(state => state.updateEmojiPosition)

    useEffect(() => {
        let animationId: number

        const animate = () => {
            setPosition(prev => {
                const newVx = velocity.vx * 0.98 // Friction
                const newVy = velocity.vy * 0.98 + 2 // Gravity

                let newX = prev.x + newVx * 0.016 // 60fps
                let newY = prev.y + newVy * 0.016

                // Boundary bouncing
                const emojiSize = 40
                if (newX <= emojiSize || newX >= window.innerWidth - emojiSize) {
                    setVelocity(v => ({ ...v, vx: -v.vx * 0.7 }))
                    newX = Math.max(emojiSize, Math.min(window.innerWidth - emojiSize, newX))
                }

                if (newY <= emojiSize || newY >= window.innerHeight - emojiSize) {
                    setVelocity(v => ({ ...v, vy: -v.vy * 0.7 }))
                    newY = Math.max(emojiSize, Math.min(window.innerHeight - emojiSize, newY))
                } else {
                    setVelocity({ vx: newVx, vy: newVy })
                }

                // Update store
                updateEmojiPosition(emoji.id, newX, newY, newVx, newVy)

                return { x: newX, y: newY }
            })

            animationId = requestAnimationFrame(animate)
        }

        animationId = requestAnimationFrame(animate)

        return () => {
            if (animationId) {
                cancelAnimationFrame(animationId)
            }
        }
    }, [emoji.id, updateEmojiPosition, velocity.vx, velocity.vy])

    // Calculate age for fade out
    const age = Date.now() - emoji.timestamp
    const maxAge = 60000 // 60 seconds
    const opacity = Math.max(0, 1 - (age / maxAge))

    return (
        <motion.div
            className="fixed pointer-events-none z-40 select-none"
            style={{
                left: position.x,
                top: position.y,
                opacity
            }}
            initial={{ scale: 0, rotate: 0 }}
            animate={{
                scale: 1,
                rotate: [0, 5, -5, 0],
            }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{
                scale: { type: "spring", stiffness: 300, damping: 20 },
                rotate: { duration: 3, repeat: Infinity, ease: "easeInOut" }
            }}
        >
            <div className="text-2xl sm:text-4xl transform -translate-x-1/2 -translate-y-1/2">
                {emoji.emoji}
            </div>
        </motion.div>
    )
}
