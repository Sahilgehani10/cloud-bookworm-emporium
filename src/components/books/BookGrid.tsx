
import React from 'react';
import { Book } from '@/types/book';
import BookCard from './BookCard';

interface BookGridProps {
  books: Book[];
  title?: string;
}

const BookGrid: React.FC<BookGridProps> = ({ books, title }) => {
  return (
    <div className="py-6">
      {title && (
        <h2 className="text-2xl md:text-3xl font-serif mb-6 text-bookstore-primary">{title}</h2>
      )}
      
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
        {books.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </div>
  );
};

export default BookGrid;
