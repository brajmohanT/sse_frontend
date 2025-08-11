'use client'

import { useEmojiStore } from '@/store/emojiStore'
import { motion } from 'framer-motion'

export default function StatsPanel() {
    const { activeEmojis, selectedEmoji } = useEmojiStore()

    return (
        <div className="fixed top-4 right-4 z-50">
            <motion.div
                initial={{ y: -30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-white/95 backdrop-blur-sm rounded-lg shadow-md border border-white/30 p-3"
            >
                {/* Selected emoji and count */}
                <div className="flex items-center gap-3">
                    <div className="text-2xl">{selectedEmoji}</div>
                    <div className="text-right">
                        <div className="text-lg font-bold text-gray-800">{activeEmojis.length}</div>
                        <div className="text-xs text-gray-500">emojis</div>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
