import '../styles/globals.css'
'use client'
import { useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { v4 as uuidv4 } from 'uuid'
import './globals.css'

export default function Home() {
  const [title, setTitle] = useState('Event Squad – Neighborhood Party')
  const [location, setLocation] = useState('Maple Grove Park Pavilion')
  const [about, setAbout] = useState('Bundle up! Crafts, snacks, a short movie.')
  const [theme, setTheme] = useState('#4F46E5')     // primary
  const [accent, setAccent] = useState('#F97316')    // accent
  const [headerImage, setHeaderImage] = useState('') // optional banner image
  const [creating, setCreating] = useState(false)
  const [shareCode, setShareCode] = useState<string | null>(null)

  async function createEvent() {
    setCreating(true)
    const code = uuidv4().slice(0, 8)
    const { error } = await supabase.from('events').insert({
      share_code: code,
      title,
      location,
      about,
      theme_color: theme,
      accent_color: accent,
      header_image: headerImage || null
    })
    setCreating(false)
    if (!error) setShareCode(code)
    else alert(error.message)
  }

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-semibold">EventSquad</h1>
      <p className="small mt-1">Create an event and share a link. Customize colors and header image for the vibe.</p>

      <div className="card mt-5 space-y-3">
        <input className="input" value={title} onChange={e=>setTitle(e.target.value)} placeholder="Event title" />
        <input className="input" value={location} onChange={e=>setLocation(e.target.value)} placeholder="Location" />
        <textarea className="input" value={about} onChange={e=>setAbout(e.target.value)} placeholder="About the event" />

        <div className="grid grid-cols-2 gap-3">
          <label className="small">Primary Color
            <input className="input mt-1" type="color" value={theme} onChange={e=>setTheme(e.target.value)} />
          </label>
          <label className="small">Accent Color
            <input className="input mt-1" type="color" value={accent} onChange={e=>setAccent(e.target.value)} />
          </label>
        </div>
        <input className="input" value={headerImage} onChange={e=>setHeaderImage(e.target.value)} placeholder="Header image URL (optional)" />

        <button className="btn primary" onClick={createEvent} disabled={creating}>{creating? 'Creating…' : 'Create event'}</button>
      </div>

      {shareCode && (
        <div className="card mt-4">
          <div className="small">Share this link with attendees:</div>
          <div className="mt-2 font-mono">/e/{shareCode}</div>
          <Link className="link mt-3 inline-block" href={`/e/${shareCode}`}>Open event page →</Link>
        </div>
      )}
    </main>
  )
}
