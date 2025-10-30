-- Turn on RLS
alter table public.events enable row level security;
alter table public.tasks enable row level security;
alter table public.food_items enable row level security;
alter table public.equipment enable row level security;
alter table public.slots enable row level security;
alter table public.polls enable row level security;
alter table public.poll_options enable row level security;

-- Public read for events by share_code
create policy "public read events" on public.events
for select using (true);

-- Basic write-open model (prototype): allow insert/update/delete for anyone (share-link). Tighten later.
create policy "open insert events" on public.events for insert with check (true);
create policy "open update events" on public.events for update using (true);
create policy "open delete events" on public.events for delete using (true);

create policy "public read tasks" on public.tasks for select using (true);
create policy "open write tasks" on public.tasks for all using (true) with check (true);

create policy "public read food" on public.food_items for select using (true);
create policy "open write food" on public.food_items for all using (true) with check (true);

create policy "public read equipment" on public.equipment for select using (true);
create policy "open write equipment" on public.equipment for all using (true) with check (true);

create policy "public read slots" on public.slots for select using (true);
create policy "open write slots" on public.slots for all using (true) with check (true);

create policy "public read polls" on public.polls for select using (true);
create policy "open write polls" on public.polls for all using (true) with check (true);

create policy "public read poll_options" on public.poll_options for select using (true);
create policy "open write poll_options" on public.poll_options for all using (true) with check (true);

-- ⚠️ SECURITY NOTE:
-- These policies are intentionally open for quick prototyping.
-- Before production, switch to authenticated users and restrict writes to:
--  - event creator (manager) or
--  - users with valid per-event token/role in a join table.
