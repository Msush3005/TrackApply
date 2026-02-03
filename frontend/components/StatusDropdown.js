'use client'

export default function StatusDropdown({ value, onChange, className = '' }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)} className={`mt-1 block w-full border rounded p-2 ${className}`}>
      <option value="Applied">Applied</option>
      <option value="Interview">Interview</option>
      <option value="Rejected">Rejected</option>
      <option value="Offer">Offer</option>
    </select>
  )
}
