import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { supabase, mapRow, mapRows, toDb } from '../lib/supabase'
import { useUser } from './UserContext'

const FarmContext = createContext(null)

export function FarmProvider({ children }) {
  const { activeFarmId } = useUser()

  const [sheep,           setSheep]           = useState([])
  const [areas,           setAreas]           = useState([])
  const [births,          setBirths]          = useState([])
  const [healthRecords,   setHealthRecords]   = useState([])
  const [breedingRecords, setBreedingRecords] = useState([])
  const [transactions,    setTransactions]    = useState([])
  const [tasks,           setTasks]           = useState([])
  const [deaths,          setDeaths]          = useState([])
  const [loading,         setLoading]         = useState(false)
  const [toast,           setToast]           = useState(null)

  /* ── load all farm data when active farm changes ─────────── */
  const loadFarmData = useCallback(async (farmId) => {
    if (!farmId) {
      setSheep([]); setAreas([]); setBirths([])
      setHealthRecords([]); setBreedingRecords([])
      setTransactions([]); setTasks([]); setDeaths([])
      return
    }
    setLoading(true)
    const [
      { data: sheepRows },
      { data: areaRows },
      { data: birthRows },
      { data: healthRows },
      { data: breedingRows },
      { data: txRows },
      { data: taskRows },
      { data: deathRows },
    ] = await Promise.all([
      supabase.from('sheep').select('*').eq('farm_id', farmId).order('tag_number'),
      supabase.from('areas').select('*').eq('farm_id', farmId).order('name'),
      supabase.from('births').select('*').eq('farm_id', farmId).order('date', { ascending: false }),
      supabase.from('health_records').select('*').eq('farm_id', farmId).order('date', { ascending: false }),
      supabase.from('breeding_records').select('*').eq('farm_id', farmId).order('mating_date', { ascending: false }),
      supabase.from('transactions').select('*').eq('farm_id', farmId).order('date', { ascending: false }),
      supabase.from('tasks').select('*').eq('farm_id', farmId).order('due_date'),
      supabase.from('deaths').select('*').eq('farm_id', farmId).order('date', { ascending: false }),
    ])
    setSheep(mapRows(sheepRows))
    setAreas(mapRows(areaRows))
    setBirths(mapRows(birthRows))
    setHealthRecords(mapRows(healthRows))
    setBreedingRecords(mapRows(breedingRows))
    setTransactions(mapRows(txRows))
    setTasks(mapRows(taskRows))
    setDeaths(mapRows(deathRows))
    setLoading(false)
  }, [])

  useEffect(() => {
    loadFarmData(activeFarmId)
  }, [activeFarmId, loadFarmData])

  /* ── toast helper ─────────────────────────────────────────── */
  function showToast(message, type = 'success') {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  /* ── sheep CRUD ───────────────────────────────────────────── */
  async function addSheep(sheepData) {
    const { data, error } = await supabase
      .from('sheep')
      .insert({ ...toDb(sheepData), farm_id: activeFarmId })
      .select().single()
    if (error) { showToast('Failed to add sheep', 'error'); return null }
    const newSheep = mapRow(data)
    setSheep(prev => [newSheep, ...prev])
    showToast(`${sheepData.tagNumber} added successfully`)
    return newSheep.id
  }

  async function updateSheep(id, updates) {
    const { error } = await supabase.from('sheep').update(toDb(updates)).eq('id', id)
    if (error) { showToast('Failed to update sheep', 'error'); return }
    setSheep(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s))
    showToast('Sheep record updated')
  }

  async function deleteSheep(id) {
    await supabase.from('sheep').delete().eq('id', id)
    setSheep(prev => prev.filter(s => s.id !== id))
    showToast('Sheep removed')
  }

  /* ── areas CRUD ───────────────────────────────────────────── */
  async function addArea(areaData) {
    const { data, error } = await supabase
      .from('areas')
      .insert({ ...toDb(areaData), farm_id: activeFarmId })
      .select().single()
    if (error) { showToast('Failed to add area', 'error'); return null }
    const newArea = mapRow(data)
    setAreas(prev => [...prev, newArea].sort((a, b) => a.name.localeCompare(b.name)))
    showToast(`${areaData.name} added`)
    return newArea
  }

  async function updateArea(id, updates) {
    await supabase.from('areas').update(toDb(updates)).eq('id', id)
    setAreas(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a))
    showToast('Area updated')
  }

  async function deleteArea(id) {
    await supabase.from('areas').delete().eq('id', id)
    setAreas(prev => prev.filter(a => a.id !== id))
    showToast('Area deleted')
  }

  /* ── births ───────────────────────────────────────────────── */
  async function addBirth(birthData) {
    const { data, error } = await supabase
      .from('births')
      .insert({ ...toDb(birthData), farm_id: activeFarmId })
      .select().single()
    if (error) { showToast('Failed to record birth', 'error'); return }
    setBirths(prev => [mapRow(data), ...prev])
    showToast('Birth recorded successfully')
  }

  /* ── health records ───────────────────────────────────────── */
  async function addHealthRecord(record) {
    const { data, error } = await supabase
      .from('health_records')
      .insert({ ...toDb(record), farm_id: activeFarmId })
      .select().single()
    if (error) { showToast('Failed to record treatment', 'error'); return }
    setHealthRecords(prev => [mapRow(data), ...prev])
    showToast('Treatment recorded')
  }

  /* ── breeding records ─────────────────────────────────────── */
  async function addBreedingRecord(record) {
    const { data, error } = await supabase
      .from('breeding_records')
      .insert({ ...toDb(record), farm_id: activeFarmId })
      .select().single()
    if (error) { showToast('Failed to add breeding record', 'error'); return }
    setBreedingRecords(prev => [mapRow(data), ...prev])
    showToast('Breeding record added')
  }

  /* ── transactions ─────────────────────────────────────────── */
  async function addTransaction(tx) {
    const { data, error } = await supabase
      .from('transactions')
      .insert({ ...toDb(tx), farm_id: activeFarmId })
      .select().single()
    if (error) { showToast('Failed to record transaction', 'error'); return }
    setTransactions(prev => [mapRow(data), ...prev])
    showToast(tx.type === 'sale' ? 'Sale recorded' : 'Purchase recorded')
  }

  /* ── tasks ────────────────────────────────────────────────── */
  async function addTask(taskData) {
    const { data, error } = await supabase
      .from('tasks')
      .insert({ ...toDb(taskData), farm_id: activeFarmId, completed: false })
      .select().single()
    if (error) { showToast('Failed to add task', 'error'); return }
    setTasks(prev => [mapRow(data), ...prev])
    showToast('Task added')
  }

  async function toggleTask(id) {
    const task = tasks.find(t => t.id === id)
    if (!task) return
    const newVal = !task.completed
    await supabase.from('tasks').update({ completed: newVal }).eq('id', id)
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: newVal } : t))
  }

  async function deleteTask(id) {
    await supabase.from('tasks').delete().eq('id', id)
    setTasks(prev => prev.filter(t => t.id !== id))
    showToast('Task deleted')
  }

  /* ── derived ──────────────────────────────────────────────── */
  const activeSheep = sheep.filter(s => s.status !== 'sold' && s.status !== 'dead')

  const stats = {
    totalSheep:    activeSheep.length,
    pregnantEwes:  activeSheep.filter(s => s.status === 'pregnant').length,
    sickSheep:     activeSheep.filter(s => s.status === 'sick').length,
    rams:          activeSheep.filter(s => s.sex === 'ram').length,
    ewes:          activeSheep.filter(s => s.sex === 'ewe').length,
    lambs:         activeSheep.filter(s => s.sex === 'lamb').length,
    wethers:       activeSheep.filter(s => s.sex === 'wether').length,
  }

  /* weightHistory is not stored in DB yet — return empty map */
  const weightHistory = {}

  return (
    <FarmContext.Provider value={{
      sheep, activeSheep, areas, births, healthRecords,
      breedingRecords, transactions, tasks, deaths,
      weightHistory, stats, loading, toast,
      addSheep, updateSheep, deleteSheep,
      addArea, updateArea, deleteArea,
      addBirth,
      addHealthRecord,
      addBreedingRecord,
      addTransaction,
      addTask, toggleTask, deleteTask,
      refreshFarmData: () => loadFarmData(activeFarmId),
    }}>
      {children}
    </FarmContext.Provider>
  )
}

export function useFarm() {
  const ctx = useContext(FarmContext)
  if (!ctx) throw new Error('useFarm must be used inside FarmProvider')
  return ctx
}
