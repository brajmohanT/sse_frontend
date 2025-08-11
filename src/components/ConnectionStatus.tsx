'use client'

import { useEmojiStore } from '@/store/emojiStore'
import { motion } from 'framer-motion'

export default function ConnectionStatus() {
    const { isConnected, onlineUsers, lastHeartbeat } = useEmojiStore()

    const isHealthy = isConnected && (Date.now() - lastHeartbeat < 10000)

    return (
        <div className="fixed top-4 left-4 z-50">
            <motion.div
                initial={{ y: -30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-white/95 backdrop-blur-sm rounded-lg shadow-md border border-white/30 px-3 py-2"
            >
                <div className="flex items-center gap-2 text-sm">
                    <div className={`w-2 h-2 rounded-full ${isHealthy ? 'bg-green-500' : 'bg-red-500'}`}>
                        {isHealthy && (
                            <motion.div
                                className="w-2 h-2 rounded-full bg-green-400"
                                animate={{ scale: [1, 1.3, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            />
                        )}
                    </div>
                    <span className="text-gray-700 font-medium">
                        {onlineUsers} online
                    </span>
                </div>
            </motion.div>
        </div>
    )
}
