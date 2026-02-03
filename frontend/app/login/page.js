"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { post } from '../../lib/api'

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Valid email is required';
    if (!password) return 'Password is required';
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const v = validate();
    if (v) return setError(v);

    setLoading(true);
    try {
      await post('/api/auth/login', { email, password });
      router.push('/');
    } catch (err) {
      if (err && err.errors) setError(err.errors.map(e => e.msg).join(', '));
      else if (err && err.message) setError(err.message);
      else setError('Unexpected error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-6 bg-white rounded shadow">
        <h1 className="text-2xl font-bold mb-4">Log in</h1>
        {error && <div className="mb-4 text-sm text-red-600">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input type="email" className="mt-1 block w-full border rounded p-2" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium">Password</label>
            <input type="password" className="mt-1 block w-full border rounded p-2" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <div>
            <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white p-2 rounded">
              {loading ? 'Logging in...' : 'Log in'}
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}
