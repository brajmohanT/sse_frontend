import { useEffect, useRef } from 'react'
import { useEmojiStore } from '@/store/emojiStore'
import { EmojiInstance, EmojiThrowEvent, UserCountEvent, EmojiCleanupEvent, HeartbeatEvent } from '@/types/emoji'
import { config } from '@/config'

export const useSSEConnection = (serverUrl: string = config.SSE_SERVER_URL) => {
  const eventSourceRef = useRef<EventSource | null>(null)
  const {
    setConnection,
    setHeartbeat,
    addEmoji,
    removeEmojis,
    setUserCount,
    userId
  } = useEmojiStore()

  useEffect(() => {
    // Create SSE connection
    const connectSSE = () => {
      try {
        const eventSource = new EventSource(`${serverUrl}/events/emoji-stream`)
        eventSourceRef.current = eventSource

        eventSource.onopen = () => {
          console.log('SSE connection opened')
          setConnection(true)
        }

        eventSource.onerror = (error) => {
          console.error('SSE connection error:', error)
          setConnection(false, 'Connection failed')
          
        //   // Attempt to reconnect after 3 seconds
        //   setTimeout(() => {
        //     if (!eventSourceRef.current || eventSourceRef.current.readyState === EventSource.CLOSED) {
        //       connectSSE()
        //     }
        //   }, 3000)
        }

        // Handle emoji-throw events
        eventSource.addEventListener('emoji-throw', (event) => {
          try {
            const data: EmojiThrowEvent['data'] = JSON.parse(event.data)
            
            // Create emoji instance with physics
            const emojiInstance: EmojiInstance = {
              id: `${data.userId}-${data.timestamp}`,
              emoji: data.emoji,
              x: data.x,
              y: data.y,
              userId: data.userId,
              timestamp: data.timestamp,
              vx: 200, // Random horizontal velocity
              vy: 200  // Random vertical velocity
            }
            
            addEmoji(emojiInstance)
          } catch (error) {
            console.error('Error parsing emoji-throw event:', error)
          }
        })

        // Handle user-count events
        eventSource.addEventListener('user-count', (event) => {
          try {
            const data: UserCountEvent['data'] = JSON.parse(event.data)
            setUserCount(data.count)
          } catch (error) {
            console.error('Error parsing user-count event:', error)
          }
        })

        // Handle emoji-cleanup events
        eventSource.addEventListener('emoji-cleanup', (event) => {
          try {
            const data: EmojiCleanupEvent['data'] = JSON.parse(event.data)
            removeEmojis(data.emojiIds)
          } catch (error) {
            console.error('Error parsing emoji-cleanup event:', error)
          }
        })

        // Handle heartbeat events
        eventSource.addEventListener('heartbeat', (event) => {
          try {
            const data: HeartbeatEvent['data'] = JSON.parse(event.data)
            setHeartbeat(data.timestamp)
          } catch (error) {
            console.error('Error parsing heartbeat event:', error)
          }
        })

      } catch (error) {
        console.error('Failed to create SSE connection:', error)
        setConnection(false, 'Failed to connect')
      }
    }

    connectSSE()

    // Cleanup on unmount
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close()
        eventSourceRef.current = null
      }
      setConnection(false)
    }
  }, [serverUrl, setConnection, setHeartbeat, addEmoji, removeEmojis, setUserCount, userId])

  // Function to send emoji throw to server
  const sendEmojiThrow = async (emoji: string, x: number, y: number) => {
    try {
      const response = await fetch(`${serverUrl}/api/emoji-throw`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emoji,
          x,
          y,
          userId,
          timestamp: Date.now()
        })
      })

      if (!response.ok) {
        throw new Error('Failed to send emoji throw')
      }
    } catch (error) {
      console.error('Error sending emoji throw:', error)
    }
  }

  return { sendEmojiThrow }
}
