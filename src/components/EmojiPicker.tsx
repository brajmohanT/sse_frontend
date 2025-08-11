'use client'

import { useEmojiStore } from '@/store/emojiStore'
import { motion } from 'framer-motion'

const POPULAR_EMOJIS = [
    '🎉', '😂', '❤️', '🚀', '🔥', '⭐', '🎈', '🌟',
    '💫', '🎊', '🎯', '⚡', '💖', '🌈', '🦄', '🍕'
]

export default function EmojiPicker() {
    const { selectedEmoji, setSelectedEmoji } = useEmojiStore()

    return (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 w-full px-4">
            <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-white/30 p-3 mx-auto max-w-lg"
            >
                {/* Mobile: Horizontal scroll, Desktop: Grid */}
                <div className="sm:hidden">
                    {/* Mobile: Single row scrollable */}
                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                        {POPULAR_EMOJIS.map((emoji) => (
                            <motion.button
                                key={emoji}
                                onClick={() => setSelectedEmoji(emoji)}
                                className={`
                  flex-shrink-0 w-12 h-12 text-2xl rounded-xl transition-all duration-200
                  ${selectedEmoji === emoji
                                        ? 'bg-blue-500 shadow-md scale-110'
                                        : 'bg-gray-100 active:scale-95'
                                    }
                `}
                                whileTap={{ scale: 0.9 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            >
                                {emoji}
                            </motion.button>
                        ))}
                    </div>

                    {/* Selected emoji indicator for mobile */}
                    <div className="mt-2 text-center">
                        <span className="text-xs text-gray-600">Selected: </span>
                        <span className="text-lg">{selectedEmoji}</span>
                    </div>
                </div>

                {/* Desktop: Grid layout */}
                <div className="hidden sm:grid grid-cols-8 gap-2">
                    {POPULAR_EMOJIS.map((emoji) => (
                        <motion.button
                            key={emoji}
                            onClick={() => setSelectedEmoji(emoji)}
                            className={`
                w-12 h-12 text-2xl rounded-lg transition-all duration-200
                ${selectedEmoji === emoji
                                    ? 'bg-blue-500 shadow-md scale-110'
                                    : 'bg-gray-100 hover:bg-gray-200 active:scale-95'
                                }
              `}
                            whileTap={{ scale: 0.9 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        >
                            {emoji}
                        </motion.button>
                    ))}
                </div>
            </motion.div>
        </div>
    )
}
