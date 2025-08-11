export const config = {
  // SSE Server Configuration
  SSE_SERVER_URL: process.env.NEXT_PUBLIC_SSE_SERVER_URL || 'http://localhost:3000',
  
  // Emoji Configuration
  EMOJI_MAX_AGE: 60000, // 60 seconds
  EMOJI_CLEANUP_INTERVAL: 5000, // 5 seconds
  MAX_EMOJIS_ON_SCREEN: 200,
  
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
