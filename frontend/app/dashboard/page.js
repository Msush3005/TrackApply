"use client"

import { useEffect, useMemo, useReducer, useState } from 'react'
import { get, post, put, del } from '../../lib/api'
import StatusChart from '../../components/StatusChart'
import EditApplicationModal from '../../components/EditApplicationModal'
import DeleteConfirmation from '../../components/DeleteConfirmation'
import useDebounce from '../../lib/useDebounce'

const initialState = { placements: [] }

function reducer(state, action) {
  switch (action.type) {
    case 'set':
      return { ...state, placements: action.payload }
    case 'add':
      return { ...state, placements: [action.payload, ...state.placements] }
    case 'update':
      return { ...state, placements: state.placements.map(p => p._id === action.payload._id ? action.payload : p) }
    case 'remove':
      return { ...state, placements: state.placements.filter(p => p._id !== action.payload) }
    default:
      return state
  }
}

export default function DashboardPage() {
  const [state, dispatch] = useReducer(reducer, initialState)
  const [analytics, setAnalytics] = useState({ Applied: 0, Interview: 0, Rejected: 0, Offer: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // UI state
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 300)
  const [statusFilter, setStatusFilter] = useState('All')
  const [sortBy, setSortBy] = useState('appliedDate_desc')

  // Modals
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [toDelete, setToDelete] = useState(null)

  useEffect(() => {
    let mounted = true
    const fetchData = async () => {
      try {
        const [pRes, aRes] = await Promise.all([
          get('/api/placements'),
          get('/api/placements/analytics')
        ])
        if (!mounted) return
        dispatch({ type: 'set', payload: pRes.placements || [] })
        setAnalytics(aRes.byStatus || { Applied: 0, Interview: 0, Rejected: 0, Offer: 0 })
      } catch (err) {
        setError(err.message || 'Failed to load data')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
    return () => { mounted = false }
  }, [])

  const fetchAnalytics = async () => {
    try {
      const aRes = await get('/api/placements/analytics')
      setAnalytics(aRes.byStatus || { Applied: 0, Interview: 0, Rejected: 0, Offer: 0 })
    } catch (err) {
      // ignore
    }
  }

  // CRUD handlers
  const handleAdd = () => {
    setEditing(null)
    setModalOpen(true)
  }

  const handleEdit = (placement) => {
    setEditing(placement)
    setModalOpen(true)
  }

  const handleSave = async (payload) => {
    if (editing) {
      const res = await put(`/api/placements/${editing._id}`, payload)
      dispatch({ type: 'update', payload: res.placement })
    } else {
      const res = await post('/api/placements', payload)
      dispatch({ type: 'add', payload: res.placement })
    }
    await fetchAnalytics()
  }

  const handleDelete = (placement) => {
    setToDelete(placement)
    setConfirmOpen(true)
  }

  const confirmDelete = async () => {
    if (!toDelete) return
    await del(`/api/placements/${toDelete._id}`)
    dispatch({ type: 'remove', payload: toDelete._id })
    setConfirmOpen(false)
    setToDelete(null)
    await fetchAnalytics()
  }

  // Derived view: search, filter, sort
  const filtered = useMemo(() => {
    const q = (debouncedSearch || '').trim().toLowerCase()
    let list = state.placements.slice()

    if (statusFilter && statusFilter !== 'All') {
      list = list.filter(p => p.status === statusFilter)
    }

    if (q) {
      list = list.filter(p => (p.companyName || '').toLowerCase().includes(q) || (p.role || '').toLowerCase().includes(q))
    }

    const cmpDate = (a, b, key, asc = false) => {
      const da = a[key] ? new Date(a[key]).getTime() : 0
      const db = b[key] ? new Date(b[key]).getTime() : 0
      return asc ? da - db : db - da
    }

    switch (sortBy) {
      case 'appliedDate_asc':
        list.sort((a, b) => cmpDate(a, b, 'appliedDate', true)); break
      case 'appliedDate_desc':
        list.sort((a, b) => cmpDate(a, b, 'appliedDate', false)); break
      case 'updatedAt_asc':
        list.sort((a, b) => cmpDate(a, b, 'updatedAt', true)); break
      case 'updatedAt_desc':
        list.sort((a, b) => cmpDate(a, b, 'updatedAt', false)); break
      default:
        break
    }

    return list
  }, [state.placements, debouncedSearch, statusFilter, sortBy])

  if (loading) return <div className="p-8">Loading...</div>
  if (error) return <div className="p-8 text-red-600">{error}</div>

  const total = Object.values(analytics).reduce((s, v) => s + (v || 0), 0)

  return (
    <main className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2 w-full max-w-2xl">
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by company or role" className="flex-1 border rounded p-2" />
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="border rounded p-2">
            <option value="All">All</option>
            <option value="Applied">Applied</option>
            <option value="Interview">Interview</option>
            <option value="Rejected">Rejected</option>
            <option value="Offer">Offer</option>
          </select>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="border rounded p-2">
            <option value="appliedDate_desc">Applied date (newest)</option>
            <option value="appliedDate_asc">Applied date (oldest)</option>
            <option value="updatedAt_desc">Last updated (newest)</option>
            <option value="updatedAt_asc">Last updated (oldest)</option>
          </select>
        </div>
        <div>
          <button onClick={handleAdd} className="bg-blue-600 text-white px-4 py-2 rounded">Add Application</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold">Applications ({filtered.length})</h2>
          <div className="mt-4 space-y-3">
            {filtered.length === 0 && <div className="text-gray-600">No applications match your criteria</div>}
            {filtered.map((p) => (
              <div key={p._id} className="border p-3 rounded flex justify-between items-start">
                <div>
                  <div className="font-semibold">{p.companyName} — {p.role}</div>
                  <div className="text-sm text-gray-500">Status: {p.status} • Applied: {p.appliedDate ? new Date(p.appliedDate).toLocaleDateString() : '—'}</div>
                  {p.notes && <div className="mt-2 text-sm text-gray-700">{p.notes}</div>}
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <div className="text-sm text-gray-500">{p.updatedAt ? new Date(p.updatedAt).toLocaleString() : ''}</div>
                  <div className="flex space-x-2">
                    <button onClick={() => handleEdit(p)} className="px-3 py-1 border rounded text-sm">Edit</button>
                    <button onClick={() => handleDelete(p)} className="px-3 py-1 border rounded text-sm text-red-600">Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold">Status Distribution</h2>
          <div className="mt-4 w-full h-64 flex items-center justify-center">
            <StatusChart data={analytics} />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="p-2 bg-gray-50 rounded">
              <div className="text-sm text-gray-500">Total</div>
              <div className="font-bold text-2xl">{total}</div>
            </div>
            {['Applied', 'Interview', 'Rejected', 'Offer'].map((s) => (
              <div key={s} className="p-2 bg-gray-50 rounded">
                <div className="text-sm text-gray-500">{s}</div>
                <div className="font-bold">{analytics[s] || 0}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <EditApplicationModal open={modalOpen} initial={editing} onClose={() => setModalOpen(false)} onSave={handleSave} />
      <DeleteConfirmation open={confirmOpen} title="Delete application" message={`Delete ${toDelete?.companyName} — ${toDelete?.role}?`} onConfirm={confirmDelete} onCancel={() => setConfirmOpen(false)} />
    </main>
  )
}
