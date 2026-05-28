import { useState, useEffect, useCallback, useRef } from 'react'

const cache = new Map()

export function useApiCache(key, fetchFn, enabled = true) {
  const [data, setData] = useState(() => cache.has(key) ? cache.get(key) : null)
  const [loading, setLoading] = useState(() => !cache.has(key))
  const [error, setError] = useState(null)
  const mountedRef = useRef(true)

  const execute = useCallback(async (forceRefresh = false) => {
    if (!enabled) return

    if (!forceRefresh && cache.has(key)) {
      if (mountedRef.current) {
        setData(cache.get(key))
        setLoading(false)
      }
      return
    }

    try {
      setLoading(true)
      const result = await fetchFn()
      cache.set(key, result)
      if (mountedRef.current) {
        setData(result)
        setError(null)
      }
    } catch (err) {
      if (mountedRef.current) {
        setError(err)
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false)
      }
    }
  }, [key, fetchFn, enabled])

  useEffect(() => {
    mountedRef.current = true
    // eslint-disable-next-line react-hooks/set-state-in-effect
    execute()
    return () => {
      mountedRef.current = false
    }
  }, [execute])

  return { data, loading, error, refresh: () => execute(true) }
}

export function clearCache() {
  cache.clear()
}

export function clearCacheKey(key) {
  cache.delete(key)
}
