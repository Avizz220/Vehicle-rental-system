import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Input, InputProps } from './Input'
import clsx from 'clsx'

export interface SearchBarProps extends Omit<InputProps, 'onChange'> {
  onSearch?: (value: string) => void
  suggestions?: string[]
  debounceMs?: number
  showSearchIcon?: boolean
}

export const SearchBar = ({
  onSearch,
  suggestions = [],
  debounceMs = 300,
  showSearchIcon = true,
  className,
  ...props
}: SearchBarProps) => {
  const [value, setValue] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([])
  const timeoutRef = useRef<NodeJS.Timeout>()
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (value && suggestions.length > 0) {
      const filtered = suggestions.filter((s) =>
        s.toLowerCase().includes(value.toLowerCase())
      )
      setFilteredSuggestions(filtered)
      setShowSuggestions(filtered.length > 0)
    } else {
      setShowSuggestions(false)
    }
  }, [value, suggestions])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setValue(newValue)

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      onSearch?.(newValue)
    }, debounceMs)
  }

  const handleSuggestionClick = (suggestion: string) => {
    setValue(suggestion)
    onSearch?.(suggestion)
    setShowSuggestions(false)
  }

  const searchIcon = (
    <svg
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  )

  return (
    <div ref={containerRef} className="relative w-full">
      <Input
        {...props}
        value={value}
        onChange={handleChange}
        leftIcon={showSearchIcon ? searchIcon : undefined}
        className={className}
      />
      <AnimatePresence>
        {showSuggestions && filteredSuggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto"
          >
            {filteredSuggestions.map((suggestion, index) => (
              <motion.div
                key={index}
                whileHover={{ backgroundColor: '#f3f4f6' }}
                className="px-4 py-2 cursor-pointer text-sm text-gray-700 border-b border-gray-100 last:border-b-0"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
