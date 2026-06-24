-- 조선대 전공 챗봇 대화 히스토리 테이블 (공유 Supabase 프로젝트, chosun_ 접두사)
-- Supabase Dashboard → SQL Editor에 붙여넣고 1회 실행하면 됩니다.

create table if not exists public.chosun_chat_logs (
  id          uuid        primary key default gen_random_uuid(),
  user_id     uuid        not null references auth.users (id) on delete cascade,
  department  text,
  provider    text,
  question    text        not null,
  answer      text        not null,
  created_at  timestamptz not null default now()
);

create index if not exists chosun_chat_logs_user_created_idx
  on public.chosun_chat_logs (user_id, created_at desc);

-- 행 수준 보안: 본인 대화만 읽고 쓸 수 있게
alter table public.chosun_chat_logs enable row level security;

drop policy if exists "chosun_chat_logs_select_own" on public.chosun_chat_logs;
create policy "chosun_chat_logs_select_own"
  on public.chosun_chat_logs for select
  using (auth.uid() = user_id);

drop policy if exists "chosun_chat_logs_insert_own" on public.chosun_chat_logs;
create policy "chosun_chat_logs_insert_own"
  on public.chosun_chat_logs for insert
  with check (auth.uid() = user_id);

drop policy if exists "chosun_chat_logs_delete_own" on public.chosun_chat_logs;
create policy "chosun_chat_logs_delete_own"
  on public.chosun_chat_logs for delete
  using (auth.uid() = user_id);
