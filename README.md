# 🎉 Real-Time Emoji Party

A highly interactive, real-time emoji throwing game built with Next.js 15, React 19, Zustand, and Framer Motion. Users can join instantly, pick emojis, and throw them onto a shared canvas where everyone sees the action in real-time via Server-Sent Events (SSE).

## ✨ Features

- **Real-time multiplayer**: Multiple users can throw emojis simultaneously
- **Smooth animations**: Physics-based bouncing and floating with Framer Motion
- **Responsive design**: Works on desktop and mobile devices
- **No authentication**: Jump in and start playing immediately
- **Live statistics**: See online user count and emoji popularity
- **Auto-cleanup**: Emojis fade out after 60 seconds to prevent overwhelming

## 🚀 Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **State Management**: Zustand
- **Animations**: Framer Motion
- **Styling**: Tailwind CSS
- **Real-time**: Server-Sent Events (SSE)
- **Backend**: Separate Node.js server (not included)

## 🏗️ Architecture

```
Frontend (Next.js) - Port 3001
├── EmojiPicker - Grid of selectable emojis
├── EmojiCanvas - Main playground with physics
├── AnimatedEmoji - Individual emoji with animations
├── ConnectionStatus - SSE connection indicator
├── StatsPanel - Live statistics display
└── SSEConnection - Real-time event handling

Backend (Node.js) - Port 3000
├── /api/emoji-stream - SSE endpoint
├── /api/emoji-throw - Broadcast emoji throws
└── /api/active-users - User count updates
```

## 🎮 How to Play

1. **Select an Emoji**: Choose from the emoji picker at the top
2. **Throw Emojis**: Click anywhere on the screen to throw your selected emoji
3. **Watch the Magic**: See emojis from all users bouncing around with physics
4. **Join the Party**: The more users, the more chaotic and fun it gets!

## 🔧 Setup & Installation

### Prerequisites
- Node.js 18+ 
- Separate SSE server running on port 3000 (with the required endpoints)

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:3001` (or next available port).

### Required SSE Server Endpoints

Your Node.js server should implement these endpoints:

```typescript
// SSE stream endpoint
GET /api/emoji-stream
// Events: emoji-throw, user-count, emoji-cleanup, heartbeat

// Emoji throw endpoint  
POST /api/emoji-throw
// Body: { emoji, x, y, userId, timestamp }
```

## 🎨 Configuration

Edit `src/config/index.ts` to customize:

- **Server URL**: Change SSE server endpoint
- **Physics**: Adjust gravity, friction, bouncing
- **Timings**: Emoji lifespan, cleanup intervals
- **Emojis**: Modify available emoji selection

## 📱 Components Overview

### `EmojiPicker`
- Grid of popular emojis
- Hover and selection animations
- Shows currently selected emoji

### `EmojiCanvas` 
- Full-screen interactive canvas
- Handles click events for throwing
- Manages SSE connection

### `AnimatedEmoji`
- Individual emoji with physics
- Bouncing off screen boundaries
- Gradual fade-out over time

### `ConnectionStatus`
- Real-time connection indicator
- Shows online user count
- Error handling and reconnection

### `StatsPanel`
- Live emoji statistics
- Popular emoji rankings
- Total throw counts

## 🔌 SSE Events

The app listens for these Server-Sent Events:

```typescript
// New emoji thrown by any user
emoji-throw: { emoji, x, y, userId, timestamp }

// Updated user count
user-count: { count: number }

// Remove old emojis
emoji-cleanup: { emojiIds: string[] }

// Connection keep-alive
heartbeat: { timestamp: number }
```

## 🎯 Performance Optimizations

- **Emoji pooling**: Efficient emoji lifecycle management
- **Viewport culling**: Only animate visible elements
- **Throttled updates**: 60fps animation loop
- **Auto cleanup**: Prevents memory leaks
- **Connection recovery**: Automatic SSE reconnection

## 🌐 Browser Support

- **Desktop**: Chrome, Firefox, Safari, Edge
- **Mobile**: iOS Safari, Chrome Mobile, Samsung Internet
- **SSE Support**: All modern browsers (IE 11+ with polyfill)

## 🚀 Deployment

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 🎉 Contributing

Feel free to contribute! Areas for improvement:

- **Sound effects** for emoji throws
- **User avatars** and customization  
- **Emoji trails** and particle effects
- **Gesture controls** for mobile
- **Emoji reactions** to existing emojis

## 📄 License

MIT License - feel free to use in your own projects!
