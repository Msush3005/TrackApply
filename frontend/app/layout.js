import '../styles/globals.css'
import Navbar from '../components/Navbar'

export const metadata = {
  title: 'Job Application Tracker',
  description: 'Track job applications — frontend placeholder',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto p-4">{children}</div>
      </body>
    </html>
  )
}
