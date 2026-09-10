-- Chouchou Birthday Website V3
-- Run this entire file in Supabase SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.answers (
  id uuid primary key default gen_random_uuid(),
  question_id text not null,
  question_text text not null,
  answer text not null check (char_length(answer) between 1 and 2000),
  page text,
  created_at timestamptz not null default now()
);

alter table public.answers enable row level security;

-- No public browser access to the answers table.
revoke all on table public.answers from anon;
revoke all on table public.answers from authenticated;

-- The private dashboard uses an authenticated user. Replace YOUR_ADMIN_USER_UUID
-- below with your Supabase Auth user's UUID.
grant select on table public.answers to authenticated;

drop policy if exists "Only the owner can read answers" on public.answers;
create policy "Only the owner can read answers"
on public.answers
for select
to authenticated
using ((select auth.uid()) = 'YOUR_ADMIN_USER_UUID'::uuid);

-- Inserts are intentionally NOT granted to anon/authenticated.
-- The submit-answer Edge Function writes using its server-side secret key.
