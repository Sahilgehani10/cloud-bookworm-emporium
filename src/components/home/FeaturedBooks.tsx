
import React, { useState, useEffect } from 'react';
import { Book } from '@/types/book';
import BookGrid from '../books/BookGrid';
import { dynamoDbService } from '@/lib/aws-dynamodb';
import { Skeleton } from '@/components/ui/skeleton';
import { Cloud, AlertCircle } from 'lucide-react';
import { isAwsConfigured } from '@/lib/aws-config';
import { Alert, AlertDescription } from "@/components/ui/alert";

const FeaturedBooks = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState('');
  const isConnected = isAwsConfigured();

  useEffect(() => {
    const loadFeaturedBooks = async () => {
      setIsLoading(true);
      try {
        setLoadingMessage('Connecting to AWS DynamoDB...');
        console.log('🌐 Fetching books from AWS DynamoDB...');
        
        const allBooks = await dynamoDbService.getAllBooks();
        console.log('📚 Retrieved', allBooks.length, 'books from', isConnected ? 'AWS DynamoDB' : 'mock data');
        
        setLoadingMessage('Filtering featured books...');
        const featuredBooks = allBooks.filter(book => book.featured);
        console.log('⭐ Found', featuredBooks.length, 'featured books');
        
        setBooks(featuredBooks);
      } catch (error) {
        console.error('Failed to load featured books:', error);
        setLoadingMessage('Error loading books');
      } finally {
        setIsLoading(false);
      }
    };

    loadFeaturedBooks();
  }, [isConnected]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center gap-2 mb-4">
          <Cloud className="h-5 w-5 animate-pulse text-bookstore-primary" />
          <span className="text-sm text-bookstore-primary">{loadingMessage}</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-serif mb-8 text-bookstore-primary">Featured Books</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex flex-col space-y-3">
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {isConnected ? (
        <Alert className="mb-4 bg-green-50 text-green-700 border-green-200">
          <Cloud className="h-4 w-4" />
          <AlertDescription>
            Successfully fetched {books.length} featured books from AWS DynamoDB
          </AlertDescription>
        </Alert>
      ) : (
        <Alert className="mb-4 bg-yellow-50 text-yellow-700 border-yellow-200">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Using mock data - Configure AWS to fetch real data
          </AlertDescription>
        </Alert>
      )}
      <BookGrid books={books} title="Featured Books" />
    </div>
  );
};

export default FeaturedBooks;
