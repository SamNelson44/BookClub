-- 002: Books table

CREATE TABLE public.books (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title        TEXT NOT NULL,
  author       TEXT NOT NULL,
  genre        TEXT,
  page_count   INTEGER NOT NULL CHECK (page_count > 0),
  description  TEXT,
  cover_url    TEXT,
  suggested_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  status       book_status NOT NULL DEFAULT 'idea',
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;

CREATE POLICY "books_select_authenticated"
  ON public.books FOR SELECT TO authenticated USING (true);

CREATE POLICY "books_insert_authenticated"
  ON public.books FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = suggested_by);

CREATE POLICY "books_update_host"
  ON public.books FOR UPDATE TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'host')
  );

CREATE POLICY "books_delete_host"
  ON public.books FOR DELETE TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'host')
  );
