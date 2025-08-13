'use client'

import { useEmojiStore } from '@/store/emojiStore'

export default function StatsPanel() {
    const { activeEmojis, selectedEmoji } = useEmojiStore()

    return (
        <div className="flex items-center gap-1">
            <span className="text-sm">{selectedEmoji}</span>
            <span className="text-xs sm:text-sm text-gray-600 font-medium">
                {activeEmojis.length}
            </span>
        </div>
    )
}
