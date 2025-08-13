'use client'

import EmojiPicker from '@/components/EmojiPicker'
import EmojiCanvas from '@/components/EmojiCanvas'
import ConnectionStatus from '@/components/ConnectionStatus'
import StatsPanel from '@/components/StatsPanel'
import UsernameModal from '@/components/UsernameModal'
import { useEmojiStore } from '@/store/emojiStore'

export default function Home() {
  const { isUsernameSet } = useEmojiStore()

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Username Modal - shown when username not set */}
      {!isUsernameSet && <UsernameModal />}

      {/* Main Canvas */}
      <EmojiCanvas />

      {/* UI Overlays - only show when username is set */}
      {isUsernameSet && (
        <>
          <EmojiPicker />
          <ConnectionStatus />
          <StatsPanel />
        </>
      )}
    </div>
  )
}