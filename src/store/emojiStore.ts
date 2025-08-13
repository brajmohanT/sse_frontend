import { create } from 'zustand'
import { EmojiInstance, EmojiThrow } from '@/types/emoji'
import { config } from '@/config'

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
  username: string | null
  isUsernameSet: boolean

  // Actions
  setConnection: (connected: boolean, error?: string) => void
  setHeartbeat: (timestamp: number) => void
  addEmoji: (emoji: EmojiInstance) => void
  removeEmojis: (emojiIds: string[]) => void
  updateEmojiPosition: (id: string, x: number, y: number, vx?: number, vy?: number) => void
  setSelectedEmoji: (emoji: string) => void
  setUserCount: (count: number) => void
  setUsername: (username: string) => void
  throwEmoji: (emoji: string, x: number, y: number) => void
  clearOldEmojis: () => void
}

// Generate a unique user ID
const generateUserId = () => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

const loadUsernameFromStorage = (): { username: string | null; isUsernameSet: boolean } => {
  if (typeof window === 'undefined') return { username: null, isUsernameSet: false }
  
  try {
    const stored = localStorage.getItem('emojiPartyUsername')
    if (stored && stored.length >= 3 && stored.length <= 5) {
      return { username: stored, isUsernameSet: true }
    }
  } catch (error) {
    console.warn('Failed to load username from localStorage:', error)
  }
  
  return { username: null, isUsernameSet: false }
}

// Save username to localStorage
const saveUsernameToStorage = (username: string) => {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.setItem('emojiPartyUsername', username)
  } catch (error) {
    console.warn('Failed to save username to localStorage:', error)
  }
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
  username: loadUsernameFromStorage().username,
  isUsernameSet: loadUsernameFromStorage().isUsernameSet,

  // Actions
  setConnection: (connected, error) => 
    set({ isConnected: connected, connectionError: error || null }),

  setHeartbeat: (timestamp) => 
    set({ lastHeartbeat: timestamp }),

  addEmoji: (emoji) => 
    set((state) => {
      let newActiveEmojis = [...state.activeEmojis, emoji]
      
      // Limit max emojis on screen
      if (newActiveEmojis.length > config.MAX_EMOJIS_ON_SCREEN) {
        // Remove oldest emojis first
        newActiveEmojis = newActiveEmojis
          .sort((a, b) => b.timestamp - a.timestamp)
          .slice(0, config.MAX_EMOJIS_ON_SCREEN)
      }
      
      return { activeEmojis: newActiveEmojis }
    }),

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

  setUsername: (username) => {
    saveUsernameToStorage(username)
    set({ username, isUsernameSet: true })
  },

  throwEmoji: (emoji, x, y) => {
    const state = get()
    const newThrow: EmojiThrow = {
      emoji,
      x,
      y,
      userId: state.userId,
      username: state.username || 'Guest',
      timestamp: Date.now()
    }
    
    // Only add to throw history, don't add to activeEmojis
    // The emoji will be added when it comes back from SSE server
    set((state) => ({
      throwHistory: [...state.throwHistory.slice(-99), newThrow] // Keep last 100 throws
    }))
  },

  clearOldEmojis: () => {
    const now = Date.now()
    
    set((state) => ({
      activeEmojis: state.activeEmojis.filter(emoji => 
        now - emoji.timestamp < config.EMOJI_MAX_AGE
      )
    }))
  }
}))
