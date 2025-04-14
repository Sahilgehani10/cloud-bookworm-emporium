import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { 
  DynamoDBDocumentClient, 
  ScanCommand, 
  GetCommand, 
  QueryCommand,
  PutCommand,
  DeleteCommand,
  UpdateCommand
} from "@aws-sdk/lib-dynamodb";
import { awsConfig, isAwsConfigured } from '../../src/lib/aws-config';
import { Book, BookCategory } from '../../src/types/book';
import { v4 as uuidv4 } from 'uuid';

// Initialize the DynamoDB client
const ddbClient = new DynamoDBClient(awsConfig);
const docClient = DynamoDBDocumentClient.from(ddbClient);

// Table name
const BOOKS_TABLE_NAME = "Books";

export const dynamoDbService = {
  // Get all books
  getAllBooks: async (): Promise<Book[]> => {
    console.log("🌐 Fetching books from AWS DynamoDB...");
    
    if (isAwsConfigured()) {
      try {
        const command = new ScanCommand({
          TableName: BOOKS_TABLE_NAME
        });
        
        const response = await docClient.send(command);
        console.log(`📚 Retrieved ${response.Items?.length || 0} books from DynamoDB`);
        return response.Items as Book[];
      } catch (error) {
        console.error('Error fetching books from DynamoDB:', error);
        console.log("⚠️ Falling back to mock data due to DynamoDB error");
        return mockBooks;
      }
    } else {
      console.log("AWS not configured, using mock book data");
      console.log(`📚 Retrieved ${mockBooks.length} books from mock data`);
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
  
  // Create new book
  createBook: async (bookData: Omit<Book, 'id'>): Promise<Book> => {
    const newBook: Book = {
      ...bookData,
      id: uuidv4()
    };
    
    if (isAwsConfigured()) {
      try {
        const command = new PutCommand({
          TableName: BOOKS_TABLE_NAME,
          Item: newBook
        });
        
        await docClient.send(command);
        console.log(`Created new book: ${newBook.title}`);
        return newBook;
      } catch (error) {
        console.error('Error creating book in DynamoDB:', error);
        throw new Error('Failed to create book');
      }
    } else {
      // In mock mode, just add to the array (this won't persist on reload)
      mockBooks.push(newBook);
      console.log(`Created new book (mock): ${newBook.title}`);
      return newBook;
    }
  },
  
  // Update existing book
  updateBook: async (id: string, bookData: Partial<Book>): Promise<Book> => {
    if (isAwsConfigured()) {
      try {
        // First check if book exists
        const existingBook = await dynamoDbService.getBookById(id);
        if (!existingBook) {
          throw new Error(`Book with ID ${id} not found`);
        }
        
        // Create update expression dynamically based on provided fields
        const updateExpressionParts: string[] = [];
        const expressionAttributeValues: Record<string, any> = {};
        const expressionAttributeNames: Record<string, string> = {};
        
        Object.entries(bookData).forEach(([key, value]) => {
          if (key !== 'id') {
            updateExpressionParts.push(`#${key} = :${key}`);
            expressionAttributeValues[`:${key}`] = value;
            expressionAttributeNames[`#${key}`] = key;
          }
        });
        
        const updateExpression = `SET ${updateExpressionParts.join(', ')}`;
        
        const command = new UpdateCommand({
          TableName: BOOKS_TABLE_NAME,
          Key: { id },
          UpdateExpression: updateExpression,
          ExpressionAttributeValues: expressionAttributeValues,
          ExpressionAttributeNames: expressionAttributeNames,
          ReturnValues: 'ALL_NEW'
        });
        
        const response = await docClient.send(command);
        console.log(`Updated book: ${id}`);
        return response.Attributes as Book;
      } catch (error) {
        console.error(`Error updating book ${id} in DynamoDB:`, error);
        throw new Error('Failed to update book');
      }
    } else {
      // In mock mode
      const bookIndex = mockBooks.findIndex(book => book.id === id);
      if (bookIndex === -1) {
        throw new Error(`Book with ID ${id} not found`);
      }
      
      mockBooks[bookIndex] = {
        ...mockBooks[bookIndex],
        ...bookData
      };
      
      console.log(`Updated book (mock): ${id}`);
      return mockBooks[bookIndex];
    }
  },
  
  // Delete book
  deleteBook: async (id: string): Promise<boolean> => {
    if (isAwsConfigured()) {
      try {
        const command = new DeleteCommand({
          TableName: BOOKS_TABLE_NAME,
          Key: { id }
        });
        
        await docClient.send(command);
        console.log(`Deleted book: ${id}`);
        return true;
      } catch (error) {
        console.error(`Error deleting book ${id} from DynamoDB:`, error);
        throw new Error('Failed to delete book');
      }
    } else {
      // In mock mode
      const bookIndex = mockBooks.findIndex(book => book.id === id);
      if (bookIndex === -1) {
        throw new Error(`Book with ID ${id} not found`);
      }
      
      mockBooks.splice(bookIndex, 1);
      console.log(`Deleted book (mock): ${id}`);
      return true;
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
