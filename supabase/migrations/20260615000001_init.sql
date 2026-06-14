-- =========================================================================
-- Milaan — Phase 0 schema + Row Level Security
--
-- LEGAL: confirm with counsel before production (DPDP Act 2023, Aadhaar
-- handling). Compliance rules baked into this schema (Spec §3):
--   * full Aadhaar number / ID image / raw biometric frames are NEVER stored
--   * only aadhaar_hash (one-way, unique) + masked last-4 are kept
--   * verification keeps a face_template REFERENCE, never an image
--   * sensitive identity/biometric/score fields are owner + service_role only
-- =========================================================================
create extension if not exists pgcrypto;

-- ---------- enums ----------
create type user_status      as enum ('onboarding', 'verified', 'suspended');
create type verif_status     as enum ('pending', 'passed', 'failed');
create type match_status      as enum ('active', 'pending', 'archived', 'blocked');
create type mod_status        as enum ('pending', 'approved', 'rejected');
create type swipe_direction   as enum ('like', 'pass', 'superlike');
create type report_status     as enum ('open', 'reviewing', 'resolved', 'dismissed');

-- =========================================================================
-- users  (SENSITIVE — owner + service_role only; NEVER publicly readable)
-- =========================================================================
create table public.users (
  id              uuid primary key references auth.users(id) on delete cascade,
  phone           text unique,
  status          user_status not null default 'onboarding',
  -- LEGAL: masked last-4 + one-way hash ONLY. Full Aadhaar must never reach DB.
  masked_aadhaar  text check (masked_aadhaar ~ '^\d{4}$'),
  aadhaar_hash    text unique,
  -- 18+ hard gate (Spec §3/§4.4): no under-18 row can exist.
  dob             date check (dob <= (current_date - interval '18 years')),
  gender          text,
  last_active     timestamptz,
  created_at      timestamptz not null default now()
);
-- NOTE: `age` is intentionally NOT stored. A generated column can't use now()/
-- age() (not IMMUTABLE); age is derived in the public_profiles view below.
create index users_status_idx on public.users (status);

-- =========================================================================
-- verification  (SENSITIVE — owner + service_role only)
-- =========================================================================
create table public.verification (
  user_id          uuid primary key references public.users(id) on delete cascade,
  identity_status  verif_status not null default 'pending',
  liveness_status  verif_status not null default 'pending',
  face_match_score numeric(4,3) check (face_match_score between 0 and 1),
  -- LEGAL: opaque template reference, NEVER a raw biometric image.
  face_template    text,
  completed_at     timestamptz
);

-- =========================================================================
-- profiles  (PUBLIC-readable, non-sensitive fields)
-- =========================================================================
create table public.profiles (
  user_id       uuid primary key references public.users(id) on delete cascade,
  name          text not null,
  bio           text,
  looking_for   text,
  interests     text[] not null default '{}',
  values        jsonb  not null default '{}',
  instagram     text,
  linkedin      text,
  snapchat      text,
  location_lat  double precision,   -- Phase 2: migrate to geography(Point,4326)
  location_lng  double precision,
  preferences   jsonb  not null default '{}',
  updated_at    timestamptz not null default now()
);

-- =========================================================================
-- photos
-- =========================================================================
create table public.photos (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references public.users(id) on delete cascade,
  storage_path      text not null,            -- Supabase Storage object path
  face_match_score  numeric(4,3) check (face_match_score between 0 and 1),
  moderation_status mod_status not null default 'pending',
  "order"           int not null default 0,
  created_at        timestamptz not null default now(),
  unique (user_id, "order")
);
create index photos_user_idx on public.photos (user_id);

-- =========================================================================
-- swipes
-- =========================================================================
create table public.swipes (
  id          uuid primary key default gen_random_uuid(),
  swiper_id   uuid not null references public.users(id) on delete cascade,
  target_id   uuid not null references public.users(id) on delete cascade,
  direction   swipe_direction not null,
  created_at  timestamptz not null default now(),
  unique (swiper_id, target_id),
  check (swiper_id <> target_id)
);
create index swipes_target_idx on public.swipes (target_id);

-- =========================================================================
-- matches  (canonical user_a < user_b => exactly one row per pair)
-- =========================================================================
create table public.matches (
  id               uuid primary key default gen_random_uuid(),
  user_a           uuid not null references public.users(id) on delete cascade,
  user_b           uuid not null references public.users(id) on delete cascade,
  status           match_status not null default 'active',
  created_at       timestamptz not null default now(),
  last_activity_at timestamptz not null default now(),
  check (user_a < user_b),
  unique (user_a, user_b)
);
create index matches_user_a_idx on public.matches (user_a);
create index matches_user_b_idx on public.matches (user_b);

-- =========================================================================
-- messages
-- =========================================================================
create table public.messages (
  id          uuid primary key default gen_random_uuid(),
  match_id    uuid not null references public.matches(id) on delete cascade,
  sender_id   uuid not null references public.users(id) on delete cascade,
  body        text,
  image_path  text,
  created_at  timestamptz not null default now(),
  read_at     timestamptz,
  check (body is not null or image_path is not null)
);
create index messages_match_idx on public.messages (match_id, created_at);

-- =========================================================================
-- scores  (SENSITIVE — owner read only; never shown to others, Spec §6)
-- =========================================================================
create table public.scores (
  user_id        uuid primary key references public.users(id) on delete cascade,
  quality_score  numeric(6,3) not null default 0,
  components     jsonb not null default '{}',
  exposure_count int not null default 0,
  decay_factor   numeric(4,3) not null default 1.0,
  updated_at     timestamptz not null default now()
);

-- =========================================================================
-- reports / blocks  (safety, Spec §5)
-- =========================================================================
create table public.reports (
  id           uuid primary key default gen_random_uuid(),
  reporter_id  uuid not null references public.users(id) on delete cascade,
  reported_id  uuid not null references public.users(id) on delete cascade,
  reason       text not null,
  details      text,
  status       report_status not null default 'open',
  created_at   timestamptz not null default now(),
  check (reporter_id <> reported_id)
);
create index reports_reported_idx on public.reports (reported_id);

create table public.blocks (
  blocker_id  uuid not null references public.users(id) on delete cascade,
  blocked_id  uuid not null references public.users(id) on delete cascade,
  created_at  timestamptz not null default now(),
  primary key (blocker_id, blocked_id),
  check (blocker_id <> blocked_id)
);

-- =========================================================================
-- public_profiles VIEW — non-sensitive fields + DERIVED age.
-- Definer view (security_invoker = false): runs as its owner (postgres), so it
-- can read users.dob to COMPUTE age while callers can never reach dob directly.
-- Only verified users are exposed.
-- =========================================================================
create view public.public_profiles
  with (security_invoker = false) as
  select
    p.user_id,
    p.name,
    p.bio,
    p.looking_for,
    p.interests,
    p.instagram,
    p.linkedin,
    p.snapchat,
    u.gender,
    floor(extract(epoch from age(u.dob)) / 31557600)::int as age
  from public.profiles p
  join public.users u on u.id = p.user_id
  where u.status = 'verified';

grant select on public.public_profiles to authenticated;

-- =========================================================================
-- ROW LEVEL SECURITY
-- =========================================================================
alter table public.users        enable row level security;
alter table public.verification enable row level security;
alter table public.profiles     enable row level security;
alter table public.photos       enable row level security;
alter table public.swipes       enable row level security;
alter table public.matches      enable row level security;
alter table public.messages     enable row level security;
alter table public.scores       enable row level security;
alter table public.reports      enable row level security;
alter table public.blocks       enable row level security;

-- helper: is the current user a participant in this match?
create or replace function public.is_match_participant(m_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.matches m
    where m.id = m_id and (m.user_a = auth.uid() or m.user_b = auth.uid())
  );
$$;

-- ---------- users: owner-only (service_role bypasses RLS) ----------
create policy users_select_own on public.users
  for select using (id = auth.uid());
create policy users_insert_self on public.users
  for insert with check (id = auth.uid());
create policy users_update_own on public.users
  for update using (id = auth.uid()) with check (id = auth.uid());

-- ---------- verification: owner read; writes via service_role only ----------
create policy verification_select_own on public.verification
  for select using (user_id = auth.uid());

-- ---------- profiles: authenticated read; owner write ----------
create policy profiles_select_all on public.profiles
  for select using (auth.uid() is not null);
create policy profiles_insert_own on public.profiles
  for insert with check (user_id = auth.uid());
create policy profiles_update_own on public.profiles
  for update using (user_id = auth.uid()) with check (user_id = auth.uid());

-- ---------- photos: approved public-readable; owner full control of own ----------
create policy photos_select_public on public.photos
  for select using (moderation_status = 'approved' or user_id = auth.uid());
create policy photos_modify_own on public.photos
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- ---------- swipes: owner-only ----------
create policy swipes_select_own on public.swipes
  for select using (swiper_id = auth.uid());
create policy swipes_insert_own on public.swipes
  for insert with check (swiper_id = auth.uid());

-- ---------- matches: participants only ----------
create policy matches_select_participant on public.matches
  for select using (user_a = auth.uid() or user_b = auth.uid());
create policy matches_update_participant on public.matches
  for update using (user_a = auth.uid() or user_b = auth.uid());

-- ---------- messages: participants of the match only ----------
create policy messages_select_participant on public.messages
  for select using (public.is_match_participant(match_id));
create policy messages_insert_sender on public.messages
  for insert with check (sender_id = auth.uid() and public.is_match_participant(match_id));
create policy messages_update_participant on public.messages
  for update using (public.is_match_participant(match_id));

-- ---------- scores: owner read only; writes via service_role ----------
create policy scores_select_own on public.scores
  for select using (user_id = auth.uid());

-- ---------- reports: reporter inserts + reads own ----------
create policy reports_insert_own on public.reports
  for insert with check (reporter_id = auth.uid());
create policy reports_select_own on public.reports
  for select using (reporter_id = auth.uid());

-- ---------- blocks: owner-only ----------
create policy blocks_all_own on public.blocks
  for all using (blocker_id = auth.uid()) with check (blocker_id = auth.uid());

-- =========================================================================
-- GRANTS
-- RLS scopes ROWS, but a role still needs table-level DML privileges for the
-- policies to apply. This local stack does not auto-grant DML to authenticated,
-- so we grant explicitly: authenticated gets only the verbs each policy needs
-- (rows are then filtered by the policies above); service_role (trusted backend,
-- BYPASSRLS) gets everything. anon stays read-nothing (all access is post-auth).
-- =========================================================================
grant all on all tables in schema public to service_role;

grant select, insert, update on public.users        to authenticated;
grant select                 on public.verification to authenticated;
grant select, insert, update on public.profiles     to authenticated;
grant select, insert, update, delete on public.photos to authenticated;
grant select, insert         on public.swipes       to authenticated;
grant select, update         on public.matches      to authenticated;
grant select, insert, update on public.messages     to authenticated;
grant select                 on public.scores       to authenticated;
grant select, insert         on public.reports      to authenticated;
grant select, insert, delete on public.blocks       to authenticated;
-- public_profiles view SELECT already granted to authenticated above.
