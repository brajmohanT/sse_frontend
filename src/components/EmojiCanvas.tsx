'use client'

import { useEmojiStore } from '@/store/emojiStore'
import { useSSEConnection } from '@/hooks/useSSEConnection'
import { useEffect } from 'react'
import AnimatedEmoji from './AnimatedEmoji'
import { AnimatePresence } from 'framer-motion'
import { config } from '@/config'

export default function EmojiCanvas() {
    const {
        activeEmojis,
        selectedEmoji,
        throwEmoji,
        clearOldEmojis
    } = useEmojiStore()

    const { sendEmojiThrow } = useSSEConnection(config.SSE_SERVER_URL)    // Clean up old emojis periodically
    useEffect(() => {
        const interval = setInterval(clearOldEmojis, 5000) // Every 5 seconds
        return () => clearInterval(interval)
    }, [clearOldEmojis])

    const handleCanvasClick = async (event: React.MouseEvent<HTMLDivElement>) => {
        const rect = event.currentTarget.getBoundingClientRect()
        const x = event.clientX - rect.left
        const y = event.clientY - rect.top

        // Add to local store immediately for responsiveness
        throwEmoji(selectedEmoji, x, y)

        // Send to server for broadcasting
        await sendEmojiThrow(selectedEmoji, x, y)
    }

    return (
        <div
            className="fixed inset-0 w-full h-full cursor-crosshair bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100"
            onClick={handleCanvasClick}
        >
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="w-full h-full bg-[radial-gradient(circle_at_25px_25px,rgba(255,255,255,0.3)_2px,transparent_0)]"
                    style={{ backgroundSize: '50px 50px' }}>
                </div>
            </div>

            {/* Animated emojis */}
            <AnimatePresence>
                {activeEmojis.map((emoji) => (
                    <AnimatedEmoji key={emoji.id} emoji={emoji} />
                ))}
            </AnimatePresence>

            {/* Click instruction overlay */}
            {activeEmojis.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none px-4">
                    <div className="text-center text-gray-500 max-w-sm">
                        <div className="text-4xl sm:text-6xl mb-4">🎯</div>
                        <h2 className="text-lg sm:text-2xl font-bold mb-2">Tap to throw emojis!</h2>
                        <p className="text-sm sm:text-lg hidden sm:block">Pick an emoji above and start the party!</p>
                    </div>
                </div>
            )}
        </div>
    )
}
