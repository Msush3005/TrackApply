'use client'

import { useState, useEffect } from 'react'
import StatusDropdown from './StatusDropdown'

export default function PlacementForm({ initial = {}, onSubmit, submitLabel = 'Save' }) {
  const [companyName, setCompanyName] = useState('')
  const [role, setRole] = useState('')
  const [status, setStatus] = useState('Applied')
  const [notes, setNotes] = useState('')
  const [appliedDate, setAppliedDate] = useState('')
  const [error, setError] = useState(null)

  useEffect(() => {
    if (initial) {
      setCompanyName(initial.companyName || '')
      setRole(initial.role || '')
      setStatus(initial.status || 'Applied')
      setNotes(initial.notes || '')
      setAppliedDate(initial.appliedDate ? new Date(initial.appliedDate).toISOString().slice(0, 10) : '')
    }
  }, [initial])

  const validate = () => {
    if (!companyName.trim()) return 'Company name is required'
    if (!role.trim()) return 'Role is required'
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    const v = validate()
    if (v) return setError(v)

    const payload = {
      companyName: companyName.trim(),
      role: role.trim(),
      status,
      notes: notes.trim(),
      appliedDate: appliedDate ? new Date(appliedDate).toISOString() : undefined,
    }

    try {
      await onSubmit(payload)
    } catch (err) {
      setError(err?.message || 'Unexpected error')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="text-sm text-red-600">{error}</div>}
      <div>
        <label className="block text-sm font-medium">Company</label>
        <input value={companyName} onChange={e => setCompanyName(e.target.value)} className="mt-1 block w-full border rounded p-2" />
      </div>
      <div>
        <label className="block text-sm font-medium">Role</label>
        <input value={role} onChange={e => setRole(e.target.value)} className="mt-1 block w-full border rounded p-2" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Status</label>
          <StatusDropdown value={status} onChange={setStatus} />
        </div>
        <div>
          <label className="block text-sm font-medium">Applied Date</label>
          <input type="date" value={appliedDate} onChange={e => setAppliedDate(e.target.value)} className="mt-1 block w-full border rounded p-2" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium">Notes</label>
        <textarea rows={3} value={notes} onChange={e => setNotes(e.target.value)} className="mt-1 block w-full border rounded p-2" />
      </div>
      <div className="flex justify-end">
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">{submitLabel}</button>
      </div>
    </form>
  )
}
