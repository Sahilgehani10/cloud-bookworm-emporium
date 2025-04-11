
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { 
  DynamoDBDocumentClient, 
  ScanCommand, 
  GetCommand, 
  QueryCommand 
} from "@aws-sdk/lib-dynamodb";
import { awsConfig, isAwsConfigured } from './aws-config';
import { Book, BookCategory } from '../types/book';

// Initialize the DynamoDB client
const ddbClient = new DynamoDBClient(awsConfig);
const docClient = DynamoDBDocumentClient.from(ddbClient);

// Table name
const BOOKS_TABLE_NAME = "Books";

export const dynamoDbService = {
  // Get all books
  getAllBooks: async (): Promise<Book[]> => {
    if (isAwsConfigured()) {
      try {
        const command = new ScanCommand({
          TableName: BOOKS_TABLE_NAME
        });
        
        const response = await docClient.send(command);
        return response.Items as Book[];
      } catch (error) {
        console.error('Error fetching books from DynamoDB:', error);
        return mockBooks; // Fallback to mock data if there's an error
      }
    } else {
      console.log('AWS not configured, using mock book data');
      return mockBooks;
    }
  },
  
  // Get book by ID
  getBookById: async (id: string): Promise<Book | undefined> => {
    if (isAwsConfigured()) {
      try {
        const command = new GetCommand({
          TableName: BOOKS_TABLE_NAME,
          Key: { id }
        });
        
        const response = await docClient.send(command);
        return response.Item as Book;
      } catch (error) {
        console.error(`Error fetching book ${id} from DynamoDB:`, error);
        return mockBooks.find(book => book.id === id);
      }
    } else {
      return mockBooks.find(book => book.id === id);
    }
  },
  
  // Get books by category
  getBooksByCategory: async (category: BookCategory): Promise<Book[]> => {
    if (isAwsConfigured()) {
      try {
        // Assuming there's a GSI (Global Secondary Index) on category
        const command = new QueryCommand({
          TableName: BOOKS_TABLE_NAME,
          IndexName: "CategoryIndex",
          KeyConditionExpression: "category = :category",
          ExpressionAttributeValues: {
            ":category": category
          }
        });
        
        const response = await docClient.send(command);
        return response.Items as Book[];
      } catch (error) {
        console.error(`Error fetching books in category ${category}:`, error);
        return mockBooks.filter(book => book.category === category);
      }
    } else {
      return mockBooks.filter(book => book.category === category);
    }
  },
  
  // Search books
  searchBooks: async (query: string): Promise<Book[]> => {
    if (isAwsConfigured()) {
      try {
        // In a real application, you'd use a more sophisticated search service like Amazon OpenSearch
        // This is a simplified implementation using Scan with filter
        const command = new ScanCommand({
          TableName: BOOKS_TABLE_NAME,
          FilterExpression: "contains(#title, :query) OR contains(#author, :query)",
          ExpressionAttributeNames: {
            "#title": "title",
            "#author": "author"
          },
          ExpressionAttributeValues: {
            ":query": query.toLowerCase()
          }
        });
        
        const response = await docClient.send(command);
        return response.Items as Book[];
      } catch (error) {
        console.error(`Error searching books for "${query}":`, error);
        // Fallback to client-side filtering of mock data
        const lowercaseQuery = query.toLowerCase();
        return mockBooks.filter(book => 
          book.title.toLowerCase().includes(lowercaseQuery) || 
          book.author.toLowerCase().includes(lowercaseQuery)
        );
      }
    } else {
      // Client-side filtering of mock data
      const lowercaseQuery = query.toLowerCase();
      return mockBooks.filter(book => 
        book.title.toLowerCase().includes(lowercaseQuery) || 
        book.author.toLowerCase().includes(lowercaseQuery)
      );
    }
  }
};

// Mock book data (for fallback)
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
