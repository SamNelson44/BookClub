-- 006: Helper views

-- Idea Pool: books with vote count and suggester name
CREATE OR REPLACE VIEW public.idea_pool_books AS
SELECT
  b.*,
  p.name         AS suggested_by_name,
  COUNT(v.id)    AS vote_count
FROM public.books b
LEFT JOIN public.profiles p ON p.id = b.suggested_by
LEFT JOIN public.votes v    ON v.book_id = b.id
WHERE b.status = 'idea'
GROUP BY b.id, p.name;

-- Dashboard: progress rows for the current book with member info
CREATE OR REPLACE VIEW public.dashboard_progress AS
SELECT
  pr.*,
  p.name         AS member_name,
  p.avatar_url,
  b.page_count,
  b.title        AS book_title,
  ROUND(
    (pr.current_page::NUMERIC / NULLIF(b.page_count, 0)) * 100,
    1
  ) AS percent_read
FROM public.progress pr
JOIN public.profiles p ON p.id = pr.user_id
JOIN public.books b    ON b.id = pr.book_id
WHERE b.status = 'current';

-- NOTE: After running all migrations, promote the first user to host:
-- UPDATE profiles SET role = 'host' WHERE id = 'YOUR_USER_UUID';
