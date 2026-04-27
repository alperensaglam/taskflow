-- ============================================================
-- TaskFlow — Supabase Database Schema
-- Run this entire script in Supabase SQL Editor (one shot)
-- ============================================================

-- 0. Enable UUID generation
create extension if not exists "uuid-ossp";

-- ============================================================
-- 1. BOARDS
-- ============================================================
create table public.boards (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  title       text not null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Index for fast lookup by owner
create index idx_boards_user_id on public.boards(user_id);

-- RLS: users can only CRUD their own boards
alter table public.boards enable row level security;

create policy "Users can view their own boards"
  on public.boards for select
  using (auth.uid() = user_id);

create policy "Users can create their own boards"
  on public.boards for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own boards"
  on public.boards for update
  using (auth.uid() = user_id);

create policy "Users can delete their own boards"
  on public.boards for delete
  using (auth.uid() = user_id);

-- ============================================================
-- 2. COLUMNS
-- ============================================================
create table public.columns (
  id          uuid primary key default uuid_generate_v4(),
  board_id    uuid not null references public.boards(id) on delete cascade,
  title       text not null,
  position    text not null,  -- fractional index string for ordering
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Index for fetching columns by board, sorted by position
create index idx_columns_board_position on public.columns(board_id, position);

-- RLS: users can only access columns within their own boards
alter table public.columns enable row level security;

create policy "Users can view columns of their boards"
  on public.columns for select
  using (
    exists (
      select 1 from public.boards
      where boards.id = columns.board_id
        and boards.user_id = auth.uid()
    )
  );

create policy "Users can create columns in their boards"
  on public.columns for insert
  with check (
    exists (
      select 1 from public.boards
      where boards.id = columns.board_id
        and boards.user_id = auth.uid()
    )
  );

create policy "Users can update columns in their boards"
  on public.columns for update
  using (
    exists (
      select 1 from public.boards
      where boards.id = columns.board_id
        and boards.user_id = auth.uid()
    )
  );

create policy "Users can delete columns in their boards"
  on public.columns for delete
  using (
    exists (
      select 1 from public.boards
      where boards.id = columns.board_id
        and boards.user_id = auth.uid()
    )
  );

-- ============================================================
-- 3. CARDS
-- ============================================================
create table public.cards (
  id          uuid primary key default uuid_generate_v4(),
  column_id   uuid not null references public.columns(id) on delete cascade,
  title       text not null,
  description text,
  position    text not null,  -- fractional index string for ordering
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Index for fetching cards by column, sorted by position
create index idx_cards_column_position on public.cards(column_id, position);

-- RLS: users can only access cards within columns of their own boards
alter table public.cards enable row level security;

create policy "Users can view cards in their boards"
  on public.cards for select
  using (
    exists (
      select 1 from public.columns
      join public.boards on boards.id = columns.board_id
      where columns.id = cards.column_id
        and boards.user_id = auth.uid()
    )
  );

create policy "Users can create cards in their boards"
  on public.cards for insert
  with check (
    exists (
      select 1 from public.columns
      join public.boards on boards.id = columns.board_id
      where columns.id = cards.column_id
        and boards.user_id = auth.uid()
    )
  );

create policy "Users can update cards in their boards"
  on public.cards for update
  using (
    exists (
      select 1 from public.columns
      join public.boards on boards.id = columns.board_id
      where columns.id = cards.column_id
        and boards.user_id = auth.uid()
    )
  );

create policy "Users can delete cards in their boards"
  on public.cards for delete
  using (
    exists (
      select 1 from public.columns
      join public.boards on boards.id = columns.board_id
      where columns.id = cards.column_id
        and boards.user_id = auth.uid()
    )
  );

-- ============================================================
-- 4. AUTO-UPDATE updated_at TRIGGER
-- ============================================================
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_boards_updated_at
  before update on public.boards
  for each row execute function public.handle_updated_at();

create trigger set_columns_updated_at
  before update on public.columns
  for each row execute function public.handle_updated_at();

create trigger set_cards_updated_at
  before update on public.cards
  for each row execute function public.handle_updated_at();
