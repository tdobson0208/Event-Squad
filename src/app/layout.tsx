import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'EventSquad',
  description: 'Collaborative event planning made simple.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
