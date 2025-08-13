export const config = {
  // SSE Server Configuration
  SSE_SERVER_URL: process.env.NEXT_PUBLIC_SSE_SERVER_URL || 'http://localhost:3000',
  
  // Emoji Configuration
  EMOJI_MAX_AGE: 30000, // 30 seconds (reduced from 60)
  EMOJI_CLEANUP_INTERVAL: 2000, // 2 seconds (reduced from 5)
  MAX_EMOJIS_ON_SCREEN: 25, // Max 25 emojis (new limit)
  
  // Physics Configuration
  GRAVITY: 2,
  FRICTION: 0.98,
  BOUNCE_DAMPING: 0.7,
  
  // Connection Configuration
  HEARTBEAT_TIMEOUT: 10000, // 10 seconds
  RECONNECT_DELAY: 3000, // 3 seconds
  
  // Popular emojis for the picker
  POPULAR_EMOJIS: [
    '🎉', '😂', '❤️', '🚀', '🔥', '⭐', '🎈', '🌟',
    '💫', '🎊', '🎯', '⚡', '💖', '🌈', '🦄', '🍕',
    '🎵', '🎸', '🏆', '💎', '🌺', '🦋', '🐱', '🐶'
  ]
}

export default config
