'use client'

import PlacementForm from './PlacementForm'

export default function EditApplicationModal({ open, initial, onClose, onSave }) {
  if (!open) return null

  const handleSubmit = async (payload) => {
    await onSave(payload)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center">
      <div className="absolute inset-0 bg-black opacity-30" onClick={onClose}></div>
      <div className="relative bg-white rounded shadow p-6 w-full max-w-2xl z-50">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{initial ? 'Edit Application' : 'Add Application'}</h3>
          <button onClick={onClose} className="text-gray-600">Close</button>
        </div>
        <div className="mt-4">
          <PlacementForm initial={initial} onSubmit={handleSubmit} submitLabel={initial ? 'Save changes' : 'Add application'} />
        </div>
      </div>
    </div>
  )
}
