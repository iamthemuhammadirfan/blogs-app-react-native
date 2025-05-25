export interface Author {
  _id: string;
  name: string;
  slug: string;
  first_name: string;
  last_name: string;
  bio: string;
  profile_pic_url?: string;
}

export interface Blog {
  _id: string;
  title: string;
  content: string;
  slug: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  sub_title: string;
  isPublished: boolean;
  views: number;
  author: Author;
}

export interface Pagination {
  current_page: number;
  total_pages: number;
  total_items: number;
  items_per_page: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface BlogsResponse {
  success: boolean;
  data: {
    data: Blog[];
    pagination: Pagination;
  };
  message: string;
}
