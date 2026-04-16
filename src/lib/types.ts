export type BookStatus = "draft" | "idea" | "current" | "completed";

export interface Profile {
  id: string;
  name: string;
  role: "member" | "host";
  avatar_url: string | null;
  created_at: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  genre: string | null;
  page_count: number;
  description: string | null;
  cover_url: string | null;
  suggested_by: string | null;
  status: BookStatus;
  created_at: string;
}

export interface Progress {
  id: string;
  user_id: string;
  book_id: string;
  current_page: number;
  finished_at: string | null;
  updated_at: string;
}

export interface Vote {
  id: string;
  user_id: string;
  book_id: string;
  created_at: string;
}

export interface Comment {
  id: string;
  user_id: string;
  book_id: string;
  content: string;
  created_at: string;
  // Joined fields
  profile?: { name: string; avatar_url: string | null };
}

// View: idea_pool_books
export interface IdeaPoolBook extends Book {
  suggested_by_name: string | null;
  vote_count: number;
}

// View: dashboard_progress
export interface DashboardProgress extends Progress {
  member_name: string;
  avatar_url: string | null;
  page_count: number;
  book_title: string;
  percent_read: number;
}
