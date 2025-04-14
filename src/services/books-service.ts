
import { Book } from '@/types/book';
import { apiClient } from './api-client';

export const booksService = {
  getAllBooks: () => apiClient.get('/api/books'),
  getBookById: (id: string) => apiClient.get(`/api/books/${id}`),
  createBook: (book: Omit<Book, 'id'>) => apiClient.post('/api/books', book),
  updateBook: (id: string, book: Partial<Book>) => apiClient.put(`/api/books/${id}`, book),
  deleteBook: (id: string) => apiClient.delete(`/api/books/${id}`),
  getBooksByCategory: (category: string) => apiClient.get(`/api/books/category/${category}`),
  searchBooks: (query: string) => apiClient.get(`/api/books/search?q=${query}`),
};
