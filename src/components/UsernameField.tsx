'use client'

import { useState, useEffect } from 'react'
import { useEmojiStore } from '@/store/emojiStore'

export default function UsernameField() {
    const { username, isUsernameSet, setUsername } = useEmojiStore()
    const [isEditing, setIsEditing] = useState(false)
    const [inputValue, setInputValue] = useState('')
    const [error, setError] = useState('')

    // Initialize editing state on mount if no username
    useEffect(() => {
        if (!isUsernameSet) {
            setIsEditing(true)
        }
    }, [isUsernameSet])

    const validateUsername = (value: string): boolean => {
        const trimmed = value.trim().toUpperCase()
        if (trimmed.length < 3 || trimmed.length > 5) {
            setError('Username must be 3-5 letters')
            return false
        }
        if (!/^[A-Z]+$/.test(trimmed)) {
            setError('Username must contain only letters')
            return false
        }
        setError('')
        return true
    }

    const handleSave = () => {
        if (validateUsername(inputValue)) {
            const trimmed = inputValue.trim().toUpperCase()
            setUsername(trimmed)
            setIsEditing(false)
            setInputValue('')
        }
    }

    const handleCancel = () => {
        setIsEditing(false)
        setInputValue('')
        setError('')
        // If no username was set, keep editing mode
        if (!isUsernameSet) {
            setIsEditing(true)
        }
    }

    const handleEdit = () => {
        setInputValue(username || '')
        setIsEditing(true)
        setError('')
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSave()
        } else if (e.key === 'Escape') {
            handleCancel()
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.toUpperCase()
        setInputValue(value)
        if (value.length > 0) {
            validateUsername(value)
        } else {
            setError('')
        }
    }

    if (isEditing) {
        return (
            <div className="flex items-center gap-2">
                <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyPress}
                            placeholder="Enter username (3-5 letters)"
                            className={`px-3 py-1.5 text-sm rounded-md min-w-[120px] w-[120px] transition-colors
                              bg-gray-100 border-0 focus:ring-0 focus:outline-none focus:bg-white
                              ${error ? 'bg-red-50 text-red-600' : ''}
                            `}
                            maxLength={5}
                            autoFocus
                        />
                        <button
                            onClick={handleSave}
                            disabled={!!error || !inputValue.trim()}
                            className="px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            ✓
                        </button>
                        {isUsernameSet && (
                            <button
                                onClick={handleCancel}
                                className="px-2 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600"
                            >
                                ✕
                            </button>
                        )}
                    </div>
                    {error && (
                        <span className="text-xs text-red-500 mt-1">{error}</span>
                    )}
                </div>
            </div>
        )
    }

    return (
        <div className="flex items-center gap-2">
            <div className="min-w-[120px] w-[120px] px-3 py-1.5 text-sm rounded-md bg-gray-50 flex items-center justify-between">
                <span className="text-gray-700 font-medium">
                    👤 {username}
                </span>
                <button
                    onClick={handleEdit}
                    className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                    title="Edit username"
                >
                    ✏️
                </button>
            </div>
        </div>
    )
}
