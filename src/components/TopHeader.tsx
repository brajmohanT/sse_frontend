'use client'

import UsernameField from './UsernameField'
import ConnectionStatus from './ConnectionStatus'
import StatsPanel from './StatsPanel'
import { useEmojiStore } from '@/store/emojiStore'

export default function TopHeader() {
    const { onlineUsers } = useEmojiStore()

    return (
        <div className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-200/50">
            {/* Mobile Layout */}
            <div className="sm:hidden flex items-center justify-between px-4 py-2.5">
                <UsernameField />
                <div className="flex items-center gap-2">
                    <ConnectionStatus />
                    <StatsPanel />
                </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden sm:flex items-center justify-between px-6 py-3">
                {/* Left - Username */}
                <div className="flex-shrink-0">
                    <UsernameField />
                </div>

                {/* Center - App Title */}
                <div className="absolute left-1/2 transform -translate-x-1/2">
                    <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        🎉 <span>Emoji Party</span>
                    </h1>
                </div>

                {/* Right - Status and Stats */}
                <div className="flex items-center gap-4 flex-shrink-0">
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                        <span>👥</span>
                        <span>{onlineUsers}</span>
                    </div>
                    <StatsPanel />
                    <ConnectionStatus />
                </div>
            </div>
        </div>
    )
}
