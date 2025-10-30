export type Event = {
  id: string
  share_code: string
  title: string
  date_start: string | null
  date_end: string | null
  location: string | null
  about: string | null
  rsvp_details: string | null
  manager_email: string | null
  theme_color: string | null
  accent_color: string | null
  header_image: string | null
}

export type Task = {
  id: string
  event_id: string
  title: string
  owner_name: string | null
  done: boolean
  type: 'task' | 'staffing'
}

export type FoodItem = {
  id: string
  event_id: string
  name: string
  claimed_by: string | null
  recipe_type: 'link' | 'notes'
  recipe_link: string | null
  recipe_notes: string | null
  allergens: string[] | null
}

export type Equipment = {
  id: string
  event_id: string
  name: string
  notes: string | null
  claimed_by: string | null
}

export type Slot = {
  id: string
  event_id: string
  label: string
  helper_name: string | null
}

export type Poll = { id: string; event_id: string; question: string }
export type PollOption = { id: string; poll_id: string; label: string; votes: number }
