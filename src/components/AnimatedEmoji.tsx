'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { EmojiInstance } from '@/types/emoji'
import { config } from '@/config'

interface AnimatedEmojiProps {
    emoji: EmojiInstance
}

export default function AnimatedEmoji({ emoji }: AnimatedEmojiProps) {
    const [position, setPosition] = useState({ x: emoji.x, y: emoji.y })
    const [velocity, setVelocity] = useState({ vx: emoji.vx || 0, vy: emoji.vy || 0 })

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
    }, [velocity.vx, velocity.vy])

    // Calculate age for fade out
    const age = Date.now() - emoji.timestamp
    const opacity = Math.max(0, 1 - (age / config.EMOJI_MAX_AGE))

    return (
        <motion.div
            data-emoji-id={emoji.id}
            className="fixed pointer-events-none z-40 select-none"
            style={{
                left: position.x,
                top: position.y,
                opacity
            }}
            initial={{ scale: 0, rotate: 0 }}
            animate={{
                scale: 1,
                rotate: [0, 3, -3, 0], // Reduced rotation for performance
            }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{
                scale: { type: "spring", stiffness: 300, damping: 20 },
                rotate: { duration: 4, repeat: Infinity, ease: "easeInOut" } // Slower rotation
            }}
        >
            <div className="flex flex-col items-center transform -translate-x-1/2 -translate-y-1/2">
                <div className="text-2xl sm:text-4xl">
                    {emoji.emoji}
                </div>
                <div className="mt-1 px-2 py-1 bg-black/70 text-white text-xs font-medium rounded-md">
                    {emoji.username}
                </div>
            </div>
        </motion.div>
    )
}
