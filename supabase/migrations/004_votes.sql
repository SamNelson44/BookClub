-- 004: Votes table

CREATE TABLE public.votes (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  book_id    UUID NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, book_id)
);

ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "votes_select_authenticated"
  ON public.votes FOR SELECT TO authenticated USING (true);

CREATE POLICY "votes_insert_own"
  ON public.votes FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "votes_delete_own"
  ON public.votes FOR DELETE TO authenticated
  USING (auth.uid() = user_id);
