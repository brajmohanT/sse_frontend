import { create } from 'zustand'
import { EmojiInstance, EmojiThrow } from '@/types/emoji'

interface EmojiStore {
  // Connection state
  isConnected: boolean
  connectionError: string | null
  lastHeartbeat: number

  // Emoji state
  activeEmojis: EmojiInstance[]
  selectedEmoji: string
  throwHistory: EmojiThrow[]

  // User state
  onlineUsers: number
  userId: string

  // Actions
  setConnection: (connected: boolean, error?: string) => void
  setHeartbeat: (timestamp: number) => void
  addEmoji: (emoji: EmojiInstance) => void
  removeEmojis: (emojiIds: string[]) => void
  updateEmojiPosition: (id: string, x: number, y: number, vx?: number, vy?: number) => void
  setSelectedEmoji: (emoji: string) => void
  setUserCount: (count: number) => void
  throwEmoji: (emoji: string, x: number, y: number) => void
  clearOldEmojis: () => void
}

// Generate a unique user ID
const generateUserId = () => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

export const useEmojiStore = create<EmojiStore>((set, get) => ({
  // Initial state
  isConnected: false,
  connectionError: null,
  lastHeartbeat: Date.now(),
  activeEmojis: [],
  selectedEmoji: '🎉',
  throwHistory: [],
  onlineUsers: 0,
  userId: generateUserId(),

  // Actions
  setConnection: (connected, error) => 
    set({ isConnected: connected, connectionError: error || null }),

  setHeartbeat: (timestamp) => 
    set({ lastHeartbeat: timestamp }),

  addEmoji: (emoji) => 
    set((state) => ({
      activeEmojis: [...state.activeEmojis, emoji]
    })),

  removeEmojis: (emojiIds) =>
    set((state) => ({
      activeEmojis: state.activeEmojis.filter(emoji => !emojiIds.includes(emoji.id))
    })),

  updateEmojiPosition: (id, x, y, vx, vy) =>
    set((state) => ({
      activeEmojis: state.activeEmojis.map(emoji =>
        emoji.id === id ? { ...emoji, x, y, vx, vy } : emoji
      )
    })),

  setSelectedEmoji: (emoji) => 
    set({ selectedEmoji: emoji }),

  setUserCount: (count) => 
    set({ onlineUsers: count }),

  throwEmoji: (emoji, x, y) => {
    const newThrow: EmojiThrow = {
      emoji,
      x,
      y,
      userId: get().userId,
      timestamp: Date.now()
    }
    
    set((state) => ({
      throwHistory: [...state.throwHistory.slice(-99), newThrow] // Keep last 100 throws
    }))
  },

  clearOldEmojis: () => {
    const now = Date.now()
    const maxAge = 60000 // 60 seconds
    
    set((state) => ({
      activeEmojis: state.activeEmojis.filter(emoji => 
        now - emoji.timestamp < maxAge
      )
    }))
  }
}))
