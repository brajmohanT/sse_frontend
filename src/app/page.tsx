'use client'

import EmojiPicker from '@/components/EmojiPicker'
import EmojiCanvas from '@/components/EmojiCanvas'
import TopHeader from '@/components/TopHeader'

export default function Home() {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Top Header with Username, Stats, and Connection */}
      <TopHeader />

      {/* Main Canvas */}
      <EmojiCanvas />

      {/* Emoji Picker at bottom */}
      <EmojiPicker />
    </div>
  )
}