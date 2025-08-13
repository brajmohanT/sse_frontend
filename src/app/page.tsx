'use client'

import EmojiPicker from '@/components/EmojiPicker'
import EmojiCanvas from '@/components/EmojiCanvas'
import ConnectionStatus from '@/components/ConnectionStatus'
import StatsPanel from '@/components/StatsPanel'

export default function Home() {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Main Canvas */}
      <EmojiCanvas />

      {/* UI Overlays */}
      <EmojiPicker />
      <ConnectionStatus />
      <StatsPanel />
    </div>
  )
}