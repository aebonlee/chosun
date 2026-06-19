-- 조선대 교원 교육 — 교육 신청 테이블
-- 공유 Supabase 프로젝트(hcmgdztsgjvzcyxyayaj) 내에서 chosun_ 접두사 사용

create table if not exists public.chosun_applications (
  id             bigint generated always as identity primary key,
  name           text not null,
  department     text not null,
  position       text,
  email          text not null,
  phone          text,
  research_topic text,
  note           text,
  created_at     timestamptz not null default now()
);

alter table public.chosun_applications enable row level security;

-- 익명(anon) 사용자가 신청서를 제출(insert)할 수 있도록 허용
drop policy if exists "chosun_anon_insert" on public.chosun_applications;
create policy "chosun_anon_insert"
  on public.chosun_applications
  for insert
  to anon
  with check (true);

-- 읽기는 기본적으로 막아둠 (관리자만 SQL/대시보드에서 조회).
-- 필요 시 service_role 또는 인증된 운영자 정책을 별도 추가.
