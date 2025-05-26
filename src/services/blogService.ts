import {BlogsResponse} from '../types';

const BASE_URL = 'http://localhost:3000/api';

export const blogService = {
  async getBlogs(
    page: number = 1,
    limit: number = 10,
    tags: string[] = [],
  ): Promise<BlogsResponse> {
    try {
      let url = `${BASE_URL}/blogs?page=${page}&limit=${limit}`;

      if (tags.length > 0) {
        const tagsParam = tags.map(tag => encodeURIComponent(tag)).join(',');
        url += `&tags=${tagsParam}`;
      }

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: BlogsResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching blogs:', error);
      throw error;
    }
  },
};
