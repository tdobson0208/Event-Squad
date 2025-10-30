import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: NextRequest) {
  const { filePath } = await req.json()
  if (!filePath) return NextResponse.json({ error: 'filePath required' }, { status: 400 })

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.SUPABASE_SERVICE_ROLE!
  const supa = createClient(url, key)

  // NOTE: Requires Storage v2. If not available, fall back to policies allowing authenticated insert.
  const { data, error } = await supa.storage.from('event-photos').createSignedUploadUrl(filePath)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ signedUrl: data.signedUrl, path: data.path })
}
