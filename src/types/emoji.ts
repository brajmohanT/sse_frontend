export interface EmojiInstance {
  id: string
  emoji: string
  x: number
  y: number
  userId: string
  timestamp: number
  vx?: number // velocity x
  vy?: number // velocity y
}

export interface EmojiThrow {
  emoji: string
  x: number
  y: number
  userId: string
  timestamp: number
}

export interface SSEEvent {
  type: 'emoji-throw' | 'user-count' | 'emoji-cleanup' | 'heartbeat'
  data: EmojiThrow | { count: number } | { emojiIds: string[] } | { timestamp: number }
}

export interface EmojiThrowEvent extends SSEEvent {
  type: 'emoji-throw'
  data: EmojiThrow
}

export interface UserCountEvent extends SSEEvent {
  type: 'user-count'
  data: { count: number }
}

export interface EmojiCleanupEvent extends SSEEvent {
  type: 'emoji-cleanup'
  data: { emojiIds: string[] }
}

export interface HeartbeatEvent extends SSEEvent {
  type: 'heartbeat'
  data: { timestamp: number }
}