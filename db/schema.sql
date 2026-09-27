create table polls (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  created_at timestamptz not null default now(),
  closes_at timestamptz
);

create table options (
  id uuid primary key default gen_random_uuid(),
  poll_id uuid not null references polls(id) on delete cascade,
  label text not null,
  vote_count integer not null default 0
);
