import { createContext, useContext, useState, useEffect, useCallback } from 'react'

/* ── IndexedDB helpers ─────────────────────────────────────────── */
const DB_NAME    = 'sheeptrack_media'
const STORE_NAME = 'videos'
const DB_VERSION = 1

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION)
    req.onupgradeneeded = e => {
      const db = e.target.result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' })
      }
    }
    req.onsuccess  = e => resolve(e.target.result)
    req.onerror    = e => reject(e.target.error)
  })
}

/* ── context ───────────────────────────────────────────────────── */
const MediaContext = createContext(null)

export function MediaProvider({ children }) {
  const [videos, setVideos]   = useState([])
  const [loading, setLoading] = useState(true)

  /* load on mount */
  useEffect(() => {
    openDB().then(db => {
      const tx    = db.transaction(STORE_NAME, 'readonly')
      const store = tx.objectStore(STORE_NAME)
      const req   = store.getAll()
      req.onsuccess = () => {
        const items = req.result.map(v => ({
          ...v,
          url: URL.createObjectURL(new Blob([v.data], { type: v.type })),
        }))
        setVideos(items)
        setLoading(false)
      }
      req.onerror = () => setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const addVideo = useCallback(async (file) => {
    const id     = `${Date.now()}_${Math.random().toString(36).slice(2)}`
    const buffer = await file.arrayBuffer()
    const record = {
      id,
      name:    file.name,
      type:    file.type,
      size:    file.size,
      addedAt: new Date().toISOString(),
      data:    buffer,
    }
    const db = await openDB()
    await new Promise((res, rej) => {
      const tx = db.transaction(STORE_NAME, 'readwrite')
      tx.objectStore(STORE_NAME).put(record)
      tx.oncomplete = res
      tx.onerror    = rej
    })
    const url = URL.createObjectURL(new Blob([buffer], { type: file.type }))
    setVideos(prev => [{ ...record, url }, ...prev])
  }, [])

  const removeVideo = useCallback(async (id) => {
    const db = await openDB()
    await new Promise((res, rej) => {
      const tx = db.transaction(STORE_NAME, 'readwrite')
      tx.objectStore(STORE_NAME).delete(id)
      tx.oncomplete = res
      tx.onerror    = rej
    })
    setVideos(prev => {
      const found = prev.find(v => v.id === id)
      if (found?.url) URL.revokeObjectURL(found.url)
      return prev.filter(v => v.id !== id)
    })
  }, [])

  return (
    <MediaContext.Provider value={{ videos, loading, addVideo, removeVideo }}>
      {children}
    </MediaContext.Provider>
  )
}

export function useMedia() {
  return useContext(MediaContext)
}
