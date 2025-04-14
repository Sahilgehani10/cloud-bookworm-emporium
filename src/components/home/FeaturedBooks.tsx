
import React, { useState, useEffect } from 'react';
import { Book } from '@/types/book';
import BookGrid from '../books/BookGrid';
import { dynamoDbService } from '@/lib/aws-dynamodb';
import { Skeleton } from '@/components/ui/skeleton';

const FeaturedBooks = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadFeaturedBooks = async () => {
      try {
        const allBooks = await dynamoDbService.getAllBooks();
        const featuredBooks = allBooks.filter(book => book.featured);
        setBooks(featuredBooks);
      } catch (error) {
        console.error('Failed to load featured books:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFeaturedBooks();
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
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
      <BookGrid books={books} title="Featured Books" />
    </div>
  );
};

export default FeaturedBooks;
