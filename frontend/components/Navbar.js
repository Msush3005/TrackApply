'use client'

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`, { method: 'POST', credentials: 'include' });
    } catch (err) {
      // ignore
    }
    router.push('/login');
  };

  return (
    <nav className="w-full border-b bg-white">
      <div className="max-w-4xl mx-auto p-4 flex items-center justify-between">
        <Link href="/" className="font-semibold">Job Application Tracker</Link>
        <div className="space-x-4 text-sm">
          <Link href="/dashboard" className="text-blue-600">Dashboard</Link>
          <Link href="/signup" className="text-blue-600">Sign Up</Link>
          <Link href="/login" className="text-blue-600">Log In</Link>
          <button onClick={handleLogout} className="text-gray-600">Logout</button>
        </div>
      </div>
    </nav>
  )
}
