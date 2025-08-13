'use client'

import { useEmojiStore } from '@/store/emojiStore'
import { motion } from 'framer-motion'

export default function ConnectionStatus() {
    const { isConnected, lastHeartbeat } = useEmojiStore()

    const isHealthy = isConnected && (Date.now() - lastHeartbeat < 10000)

    return (
        <div className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${isHealthy ? 'bg-green-500' : 'bg-red-500'}`}>
                {isHealthy && (
                    <motion.div
                        className="w-2 h-2 rounded-full bg-green-400"
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                )}
            </div>
            <span className="text-xs sm:text-sm text-gray-600 font-medium">
                {isHealthy ? 'Connected' : 'Disconnected'}
            </span>
        </div>
    )
}
