'use client'

import { useState, useEffect, useRef } from 'react'
import { useDebounce } from '@/hooks/useDebounce'
import { SearchResult } from '@/types'

export default function SearchBar() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const debouncedQuery = useDebounce(query, 300)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (debouncedQuery.length >= 2) {
      fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`)
        .then(res => res.json())
        .then(data => {
          setResults(data.results)
          setIsOpen(true)
        })
    } else {
      setResults([])
      setIsOpen(false)
    }
  }, [debouncedQuery])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={wrapperRef} className="relative w-full max-w-xl">
      <div className="relative">
        <input
          type="search"
          placeholder="Hledat clanky..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-white border border-gray-200 shadow-lg rounded-lg z-50 max-h-80 overflow-y-auto">
          {results.map((r) => (
            <a
              key={r.url}
              href={r.url}
              className="block px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-0"
            >
              <div className="font-medium text-gray-900 text-sm">{r.title}</div>
              <div className="text-xs text-gray-500 mt-0.5">{r.description}</div>
            </a>
          ))}
        </div>
      )}

      {isOpen && debouncedQuery.length >= 2 && results.length === 0 && (
        <div className="absolute top-full mt-2 w-full bg-white border border-gray-200 shadow-lg rounded-lg z-50 p-4 text-sm text-gray-500 text-center">
          Zadne vysledky pro &quot;{debouncedQuery}&quot;
        </div>
      )}
    </div>
  )
}
