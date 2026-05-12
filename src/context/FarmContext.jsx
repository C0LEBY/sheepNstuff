import { createContext, useContext, useState } from 'react'
import {
  sheep as initialSheep,
  areas as initialAreas,
  births as initialBirths,
  healthRecords as initialHealth,
  breedingRecords as initialBreeding,
  transactions as initialTransactions,
  tasks as initialTasks,
  deaths as initialDeaths,
  weightHistory as initialWeightHistory,
} from '../data/mockData'

const FarmContext = createContext(null)

export function FarmProvider({ children }) {
  const [sheep, setSheep]                   = useState(initialSheep)
  const [areas]                             = useState(initialAreas)
  const [births, setBirths]                 = useState(initialBirths)
  const [healthRecords, setHealthRecords]   = useState(initialHealth)
  const [breedingRecords, setBreedingRecords] = useState(initialBreeding)
  const [transactions, setTransactions]     = useState(initialTransactions)
  const [tasks, setTasks]                   = useState(initialTasks)
  const [deaths]                            = useState(initialDeaths)
  const [weightHistory]                     = useState(initialWeightHistory)
  const [toast, setToast]                   = useState(null)

  function showToast(message, type = 'success') {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  function addSheep(sheepData) {
    const newSheep = { ...sheepData, id: `SH${String(sheep.length + 100).padStart(3,'0')}` }
    setSheep(prev => [newSheep, ...prev])
    showToast(`${sheepData.tagNumber} added successfully`)
    return newSheep.id
  }

  function updateSheep(id, updates) {
    setSheep(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s))
    showToast('Sheep record updated')
  }

  function addBirth(birthData) {
    const id = `birth-${births.length + 1}`
    setBirths(prev => [{ ...birthData, id }, ...prev])
    showToast('Birth recorded successfully')
  }

  function addHealthRecord(record) {
    const id = `hr-${healthRecords.length + 1}`
    setHealthRecords(prev => [{ ...record, id }, ...prev])
    showToast('Treatment recorded')
  }

  function addBreedingRecord(record) {
    const id = `br-${breedingRecords.length + 1}`
    setBreedingRecords(prev => [{ ...record, id }, ...prev])
    showToast('Breeding record added')
  }

  function addTransaction(tx) {
    const id = `tx-${transactions.length + 1}`
    setTransactions(prev => [{ ...tx, id }, ...prev])
    showToast(tx.type === 'sale' ? 'Sale recorded' : 'Purchase recorded')
  }

  function toggleTask(id) {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t))
  }

  function addTask(taskData) {
    const id = `task-${tasks.length + 1}`
    setTasks(prev => [{ ...taskData, id, completed: false }, ...prev])
    showToast('Task added')
  }

  const activeSheep = sheep.filter(s => s.status !== 'sold' && s.status !== 'dead')

  const stats = {
    totalSheep: activeSheep.length,
    pregnantEwes: activeSheep.filter(s => s.status === 'pregnant').length,
    sickSheep: activeSheep.filter(s => s.status === 'sick').length,
    rams: activeSheep.filter(s => s.sex === 'ram').length,
    ewes: activeSheep.filter(s => s.sex === 'ewe').length,
    lambs: activeSheep.filter(s => s.sex === 'lamb').length,
    wethers: activeSheep.filter(s => s.sex === 'wether').length,
  }

  return (
    <FarmContext.Provider value={{
      sheep, activeSheep, areas, births, healthRecords,
      breedingRecords, transactions, tasks, deaths, weightHistory,
      stats, toast,
      addSheep, updateSheep, addBirth, addHealthRecord,
      addBreedingRecord, addTransaction, toggleTask, addTask,
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
