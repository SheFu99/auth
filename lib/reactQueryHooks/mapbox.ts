

export async function fetchMapboxSuggestions(
    searchQuery: string,
    accessToken: string
  ) {
    if (!searchQuery.trim()) return []
  
    const endpoint = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
      searchQuery
    )}.json?access_token=${accessToken}&autocomplete=true&limit=5`
  
    const res = await fetch(endpoint)
    if (!res.ok) {
      throw new Error('Error fetching suggestions from Mapbox')
    }
  
    const data = await res.json()
    return data?.features ?? []
  }
  