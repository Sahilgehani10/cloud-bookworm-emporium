import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { booksService } from '@/services/books-service';
import BookGrid from '../books/BookGrid';
import { Skeleton } from '@/components/ui/skeleton';

const FeaturedBooks = () => {
  const { data: books, isLoading } = useQuery({
    queryKey: ['books'],
    queryFn: booksService.getAllBooks,
    select: (data) => data.filter(book => book.featured),
  });

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
