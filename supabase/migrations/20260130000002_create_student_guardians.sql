-- Student guardians: parent/guardian contact per student (multiple per student).
-- Students manage their own rows; teachers can read guardians for students in their classes.
create table if not exists public.student_guardians (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references auth.users(id) on delete cascade,
  email text not null,
  phone text,
  relationship text,
  created_at timestamptz not null default now(),
  updated_at timestamptz
);

comment on table public.student_guardians is 'Guardian contact info for students; students add/edit, teachers read-only for students in their classes';

create index if not exists idx_student_guardians_student_id on public.student_guardians(student_id);

alter table public.student_guardians enable row level security;

-- Students: full CRUD on their own guardians only
drop policy if exists "Students can manage own guardians" on public.student_guardians;
create policy "Students can manage own guardians"
  on public.student_guardians
  for all
  using (student_id = auth.uid())
  with check (student_id = auth.uid());

-- Teachers: select only for students enrolled in a class they teach
drop policy if exists "Teachers can read guardians of their class students" on public.student_guardians;
create policy "Teachers can read guardians of their class students"
  on public.student_guardians
  for select
  using (
    exists (
      select 1 from public.enrollments e
      join public.classes c on c.id = e.class_id
      where e.student_id = student_guardians.student_id
        and c.teacher_id = auth.uid()
    )
  );
