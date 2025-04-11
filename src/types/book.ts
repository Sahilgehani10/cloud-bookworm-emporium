
export type BookCategory = 
  | 'fiction' 
  | 'non-fiction' 
  | 'sci-fi' 
  | 'fantasy' 
  | 'mystery' 
  | 'romance'
  | 'thriller'
  | 'biography'
  | 'history'
  | 'children';

export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  price: number;
  rating: number;
  imageKey: string;
  category: BookCategory;
  inStock: boolean;
  featured: boolean;
  tags: string[];
}

export interface CartItem {
  book: Book;
  quantity: number;
}

export interface Category {
  id: BookCategory;
  name: string;
  description: string;
}
