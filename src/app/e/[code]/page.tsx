'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import type { Event, Task, FoodItem, Equipment, Slot, Poll, PollOption } from '@/lib/types'

function Section({ title, children }: { title: string, children: any }) {
  return <div className="card"><h3 className="font-semibold">{title}</h3><div className="mt-3">{children}</div></div>
}

export default function EventPage() {
  const { code } = useParams<{ code: string }>()
  const [evt, setEvt] = useState<Event | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [foods, setFoods] = useState<FoodItem[]>([])
  const [equip, setEquip] = useState<Equipment[]>([])
  const [slots, setSlots] = useState<Slot[]>([])
  const [polls, setPolls] = useState<(Poll & { options: PollOption[] })[]>([])
  const [name, setName] = useState('Guest')
  const [newFood, setNewFood] = useState('')

  useEffect(() => {
    async function load() {
      const { data: event } = await supabase.from('events').select('*').eq('share_code', code).single()
      setEvt(event as Event)
      if (!event) return
      const event_id = event.id
      const [{ data: t }, { data: f }, { data: e }, { data: s }, { data: p }] = await Promise.all([
        supabase.from('tasks').select('*').eq('event_id', event_id),
        supabase.from('food_items').select('*').eq('event_id', event_id),
        supabase.from('equipment').select('*').eq('event_id', event_id),
        supabase.from('slots').select('*').eq('event_id', event_id),
        supabase.from('polls').select('*, poll_options(*)').eq('event_id', event_id)
      ])
      setTasks((t||[]) as Task[])
      setFoods((f||[]) as FoodItem[])
      setEquip((e||[]) as Equipment[])
      setSlots((s||[]) as Slot[])
      setPolls(((p||[]) as any[]).map(row => ({ id: row.id, event_id: row.event_id, question: row.question, options: row.poll_options || [] })))
    }
    load()
  }, [code])

  async function claimFood(id: string) {
    const item = foods.find(f=>f.id===id); if(!item) return
    const claimed_by = item.claimed_by ? null : name
    await supabase.from('food_items').update({ claimed_by }).eq('id', id)
    setFoods(foods.map(f=> f.id===id ? { ...f, claimed_by } : f))
  }

  if (!evt) return <main className="max-w-5xl mx-auto p-6">Loading…</main>

  // Apply event theme colors via CSS vars
  const styleVars = {
    ['--theme' as any]: evt.theme_color || '#4F46E5',
    ['--accent' as any]: evt.accent_color || '#F97316',
  }

  return (
    <main className="max-w-5xl mx-auto p-0" style={styleVars as any}>
      {/* Header bar / banner */}
      <div className="w-full" style={{ background: 'var(--theme)' }}>
        <div className="relative">
          {evt.header_image ? (
            <div className="h-40 w-full overflow-hidden rounded-b-2xl">
              <img src={evt.header_image} alt="Event header" className="w-full h-full object-cover opacity-90" />
            </div>
          ) : (
            <div className="h-28" />
          )}
          <div className="absolute inset-0 flex items-end">
            <div className="px-6 py-4 text-white">
              <h1 className="text-2xl md:text-3xl font-semibold drop-shadow">{evt.title}</h1>
              {evt.location && <div className="text-sm opacity-90">{evt.location}</div>}
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <span className="badge">EventSquad</span>
          <input className="input w-48" value={name} onChange={e=>setName(e.target.value)} placeholder="Your name" />
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="card md:col-span-2">
            <p>{evt.about}</p>
            {evt.rsvp_details && <p className="small mt-2"><b>RSVP:</b> {evt.rsvp_details}</p>}
          </div>
          <Section title="Photo Dropbox">
            <p className="small">Upload photos to a shared album. (Signed upload URL via API)</p>
            <form onSubmit={async (e)=>{
              e.preventDefault()
              const file = (e.target as any).file.files[0]
              if (!file) return
              const path = `${evt.share_code}/${Date.now()}-${file.name}`
              const res = await fetch('/api/signed-upload', { method: 'POST', body: JSON.stringify({ filePath: path }) })
              const { signedUrl } = await res.json()
              const up = await fetch(signedUrl, { method: 'PUT', headers: { 'content-type': file.type }, body: file })
              alert(up.ok ? 'Uploaded!' : 'Upload failed')
            }} className="space-y-2">
              <input type="file" name="file" className="input" />
              <button className="btn primary" type="submit">Upload</button>
            </form>
            <p className="small mt-2">Tip: Share a QR linking to this page so guests can upload on-site.</p>
          </Section>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <Section title="Food & Recipes">
            <div className="space-y-2">
              {foods.map(f => (
                <div key={f.id} className="border rounded-xl p-3 flex items-center justify-between">
                  <div>
                    <div className="font-medium">{f.name}</div>
                    <div className="small">{f.recipe_type === 'link' ? f.recipe_link : f.recipe_notes}</div>
                    {f.allergens?.length ? <div className="small">Allergens: {f.allergens.join(', ')}</div> : null}
                  </div>
                  <button className="btn" onClick={()=>claimFood(f.id)}>
                    {f.claimed_by ? `Unclaim (${f.claimed_by})` : `I'll bring this`}
                  </button>
                </div>
              ))}
            </div>
            <form onSubmit={async (e)=>{
              e.preventDefault()
              if (!newFood.trim()) return
              const { data, error } = await supabase.from('food_items').insert({ event_id: evt.id, name: newFood, recipe_type: 'notes', recipe_notes: '' }).select('*').single()
              if (!error && data) {
                setFoods([...(foods||[]), data as FoodItem])
                setNewFood('')
              }
            }} className="mt-3 flex gap-2">
              <input className="input" value={newFood} onChange={e=>setNewFood(e.target.value)} placeholder="Add a food item (e.g., Chili)" />
              <button className="btn" type="submit">Add</button>
            </form>
          </Section>

          <Section title="Equipment & Games">
            <p className="small">Manager can add requests in DB; guests can claim to bring.</p>
            <div className="small">Populate rows in <code>equipment</code> for this event.</div>
          </Section>

          <Section title="Time Slots">
            <div className="small">Add rows in <code>slots</code> to populate volunteer slots for this event.</div>
          </Section>
        </div>

        <Section title="Polls">
          <div className="small">Rows in <code>polls</code> + <code>poll_options</code>. Guests click to vote (increments count).</div>
        </Section>
      </div>
    </main>
  )
}
