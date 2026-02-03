'use client'

export default function DeleteConfirmation({ open, title = 'Delete', message = 'Are you sure?', onConfirm, onCancel }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center">
      <div className="absolute inset-0 bg-black opacity-30" onClick={onCancel}></div>
      <div className="relative bg-white rounded shadow p-6 w-full max-w-md z-50">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="mt-2 text-sm text-gray-700">{message}</p>
        <div className="mt-4 flex justify-end space-x-2">
          <button onClick={onCancel} className="px-4 py-2 rounded border">Cancel</button>
          <button onClick={onConfirm} className="px-4 py-2 rounded bg-red-600 text-white">Delete</button>
        </div>
      </div>
    </div>
  )
}
