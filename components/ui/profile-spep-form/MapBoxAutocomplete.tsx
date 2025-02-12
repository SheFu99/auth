import * as React from 'react'
import { useQuery } from '@tanstack/react-query'

import { cn } from '@/lib/utils'
import useDebounce from '@/hooks/use-debounce'
import { fetchMapboxSuggestions } from '@/lib/reactQueryHooks/mapbox'
import { BarLoader } from 'react-spinners'
import { MapPin } from 'lucide-react'

interface MapboxAutocompleteProps {
  accessToken: string
  onSelect?: (place: any) => void
  debounceDelay?: number
}

export function MapboxAutocomplete({
  accessToken,
  onSelect,
  debounceDelay = 300,
}: MapboxAutocompleteProps) {
  const [searchTerm, setSearchTerm] = React.useState('')
  const [isOpen, setIsOpen] = React.useState(false)

  // Debounce the searchTerm
  const debouncedSearchTerm = useDebounce({ value: searchTerm, delay: debounceDelay })

  // Fetch suggestions with TanStack Query
  const {
    data: suggestions = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['mapboxSuggestions', debouncedSearchTerm],
    queryFn: () => fetchMapboxSuggestions(debouncedSearchTerm, accessToken),
    // enabled: Boolean(debouncedSearchTerm.trim()),
  })

  // Handle selecting a suggestion
  const handleSelect = (place: any) => {
    setSearchTerm(place.place_name)
    setIsOpen(false)
    onSelect?.(place)
  }

  // On input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)
    setIsOpen(!!value.trim()) // show dropdown only if there's input
  }

  // Optionally, close the dropdown on blur
  const handleBlur = () => {
    // If you want the dropdown to close when the user clicks away, uncomment:
    setIsOpen(false)
  }

  return (
    <div className="relative w-full " onBlur={handleBlur}>
      {/* Search input */}
      <div className="flex  items-center border border-white rounded-md p-2 dark:bg-black w-full relative">
      {/* Icon inside the flex container */}
      <MapPin className="text-gray-400 relative" />

      {/* Input with no extra padding needed */}
      <input 
        value={searchTerm}
        onChange={handleInputChange}
        placeholder="Search location..."
        className="bg-transparent outline-none ml-2 text-white w-full placeholder:text-white/50 placeholder:text-sm"
      />
    </div>
      {/* Suggestions Dropdown */}
      {isOpen && suggestions.length > 0 && (
        <div
          className={cn(
            'absolute top-full left-0 z-10 mt-1 w-full rounded-md',
            'border border-neutral-700 bg-neutral-800 text-white'
          )}
        >
          {isLoading ? (
            <div className="p-4 text-sm text-gray-300"><BarLoader color='white'/>            </div>
          ) : isError ? (
            <div className="p-4 text-sm text-red-400">
              {(error as Error)?.message ?? 'Error fetching suggestions'}
            </div>
          ) : (
            <ul className="max-h-60 overflow-y-auto divide-y divide-gray-700">
              {suggestions.map((item: any) => (
                <li
                  key={item.id}
                  onMouseDown={() => handleSelect(item)}
                  className="px-4 py-2 cursor-pointer hover:bg-neutral-700"
                >
                  {item.place_name}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* No results (shown if user typed something but got no suggestions) */}
      {isOpen && !isLoading && !isError && suggestions.length === 0 && debouncedSearchTerm.trim() && (
        <div
          className={cn(
            'absolute top-full left-0 z-10 mt-1 w-full rounded-md',
            'border border-neutral-700 bg-neutral-800 text-white p-4 text-sm text-gray-300'
          )}
        >
          No results found
        </div>
      )}
    </div>
  )
}
