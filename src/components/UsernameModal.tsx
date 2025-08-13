'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useEmojiStore } from '@/store/emojiStore'

export default function UsernameModal() {
    const [input, setInput] = useState('')
    const [error, setError] = useState('')
    const { setUsername } = useEmojiStore()

    const validateUsername = (value: string): boolean => {
        // Only allow letters, 3-5 characters
        const regex = /^[a-zA-Z]{3,5}$/
        return regex.test(value)
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.toUpperCase() // Convert to uppercase

        // Only allow letters and limit to 5 characters
        const filteredValue = value.replace(/[^A-Z]/g, '').slice(0, 5)

        setInput(filteredValue)

        if (filteredValue.length === 0) {
            setError('')
        } else if (filteredValue.length < 5) {
            setError('Username must be exactly 5 letters')
        } else if (validateUsername(filteredValue)) {
            setError('')
        } else {
            setError('Only letters allowed')
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (validateUsername(input)) {
            setUsername(input)
        }
    }

    const isValid = validateUsername(input)

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-auto"
            >
                <div className="text-center mb-6">
                    <div className="text-4xl mb-2">🎉</div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Join the Emoji Party!</h1>
                    <p className="text-gray-600">Enter your name to start throwing emojis</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                            Your Name (3-5 letters only)
                        </label>
                        <input
                            id="username"
                            type="text"
                            value={input}
                            onChange={handleInputChange}
                            placeholder="ALICE"
                            className={`
                w-full px-4 py-3 text-center text-xl font-bold uppercase tracking-wider
                border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500
                ${error
                                    ? 'border-red-300 bg-red-50'
                                    : isValid
                                        ? 'border-green-300 bg-green-50'
                                        : 'border-gray-300 bg-gray-50'
                                }
              `}
                            maxLength={5}
                            autoComplete="off"
                        />
                        {error && (
                            <p className="mt-2 text-sm text-red-600">{error}</p>
                        )}
                        {input.length > 0 && !error && (
                            <p className="mt-2 text-sm text-green-600">
                                {5 - input.length === 0 ? 'Perfect!' : `${5 - input.length} more letters needed`}
                            </p>
                        )}
                    </div>

                    <motion.button
                        type="submit"
                        disabled={!isValid}
                        className={`
              w-full py-3 px-6 rounded-xl font-bold text-lg transition-all duration-200
              ${isValid
                                ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }
            `}
                        whileTap={isValid ? { scale: 0.98 } : {}}
                    >
                        {isValid ? 'Join Party! 🚀' : 'Enter 5 Letters'}
                    </motion.button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-xs text-gray-500">
                        • Letters only (A-Z)<br />
                        • 3-5 characters<br />
                        • No spaces or numbers
                    </p>
                </div>
            </motion.div>
        </div>
    )
}
