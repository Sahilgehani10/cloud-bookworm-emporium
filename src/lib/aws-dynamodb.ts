
import { API_ENDPOINT } from './aws-config';
import { Book, BookCategory } from '../types/book';

// Simulated DynamoDB service for book inventory
export const dynamoDbService = {
  // Get all books (simulated)
  getAllBooks: async (): Promise<Book[]> => {
    // In a real implementation, this would make a fetch request to API Gateway
    // which would trigger a Lambda function to query DynamoDB
    
    // For demo purposes, we're returning mock data
    return mockBooks;
  },
  
  // Get book by ID (simulated)
  getBookById: async (id: string): Promise<Book | undefined> => {
    // In a real implementation, this would make a fetch request to API Gateway
    return mockBooks.find(book => book.id === id);
  },
  
  // Get books by category (simulated)
  getBooksByCategory: async (category: BookCategory): Promise<Book[]> => {
    return mockBooks.filter(book => book.category === category);
  },
  
  // Search books (simulated)
  searchBooks: async (query: string): Promise<Book[]> => {
    const lowercaseQuery = query.toLowerCase();
    return mockBooks.filter(book => 
      book.title.toLowerCase().includes(lowercaseQuery) || 
      book.author.toLowerCase().includes(lowercaseQuery)
    );
  }
};

// Mock book data (in a real app, this would come from DynamoDB)
const mockBooks: Book[] = [
  {
    id: '1',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    description: 'A novel of the Jazz Age that follows the life of the enigmatic Jay Gatsby and his love for Daisy Buchanan.',
    price: 12.99,
    rating: 4.5,
    imageKey: 'great-gatsby.jpg',
    category: 'fiction',
    inStock: true,
    featured: true,
    tags: ['classic', 'literary fiction', 'american']
  },
  {
    id: '2',
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    description: 'A powerful tale of racial injustice and loss of innocence in a small Southern town.',
    price: 11.99,
    rating: 4.8,
    imageKey: 'mockingbird.jpg',
    category: 'fiction',
    inStock: true,
    featured: true,
    tags: ['classic', 'literary fiction', 'american']
  },
  {
    id: '3',
    title: 'Sapiens: A Brief History of Humankind',
    author: 'Yuval Noah Harari',
    description: 'A survey of human history from the evolution of archaic human species to the 21st century.',
    price: 15.99,
    rating: 4.6,
    imageKey: 'sapiens.jpg',
    category: 'non-fiction',
    inStock: true,
    featured: true,
    tags: ['history', 'anthropology', 'science']
  },
  {
    id: '4',
    title: 'Dune',
    author: 'Frank Herbert',
    description: 'A sci-fi masterpiece set in a distant future amidst a feudal interstellar society.',
    price: 14.99,
    rating: 4.7,
    imageKey: 'dune.jpg',
    category: 'sci-fi',
    inStock: true,
    featured: false,
    tags: ['sci-fi', 'space opera', 'classic sci-fi']
  },
  {
    id: '5',
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    description: 'A fantasy novel about the adventures of hobbit Bilbo Baggins.',
    price: 13.99,
    rating: 4.9,
    imageKey: 'hobbit.jpg',
    category: 'fantasy',
    inStock: true,
    featured: false,
    tags: ['fantasy', 'adventure', 'classic']
  },
  {
    id: '6',
    title: 'Educated',
    author: 'Tara Westover',
    description: 'A memoir about a woman who leaves her survivalist family and goes on to earn a PhD from Cambridge University.',
    price: 16.99,
    rating: 4.7,
    imageKey: 'educated.jpg',
    category: 'non-fiction',
    inStock: true,
    featured: true,
    tags: ['memoir', 'education', 'biography']
  },
  {
    id: '7',
    title: 'The Silent Patient',
    author: 'Alex Michaelides',
    description: 'A psychological thriller about a woman who shoots her husband and then stops speaking.',
    price: 13.99,
    rating: 4.3,
    imageKey: 'silent-patient.jpg',
    category: 'thriller',
    inStock: true,
    featured: false,
    tags: ['thriller', 'mystery', 'psychological']
  },
  {
    id: '8',
    title: 'Where the Crawdads Sing',
    author: 'Delia Owens',
    description: 'A murder mystery and coming-of-age story about a girl growing up in the marshes of North Carolina.',
    price: 14.99,
    rating: 4.8,
    imageKey: 'crawdads.jpg',
    category: 'fiction',
    inStock: true,
    featured: true,
    tags: ['literary fiction', 'mystery', 'nature']
  }
];
