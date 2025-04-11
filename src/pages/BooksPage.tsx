
import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import BookGrid from '../components/books/BookGrid';
import { dynamoDbService } from '../lib/aws-dynamodb';
import { Book, BookCategory } from '../types/book';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const BooksPage = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    const fetchBooks = async () => {
      setIsLoading(true);
      try {
        const allBooks = await dynamoDbService.getAllBooks();
        setBooks(allBooks);
        setFilteredBooks(allBooks);
      } catch (error) {
        console.error('Failed to fetch books:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooks();
  }, []);

  useEffect(() => {
    let result = books;
    
    // Apply category filter
    if (selectedCategory !== 'all') {
      result = result.filter(book => book.category === selectedCategory);
    }
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        book => 
          book.title.toLowerCase().includes(query) || 
          book.author.toLowerCase().includes(query)
      );
    }
    
    setFilteredBooks(result);
  }, [selectedCategory, searchQuery, books]);

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'fiction', name: 'Fiction' },
    { id: 'non-fiction', name: 'Non-Fiction' },
    { id: 'sci-fi', name: 'Science Fiction' },
    { id: 'fantasy', name: 'Fantasy' },
    { id: 'mystery', name: 'Mystery' },
    { id: 'thriller', name: 'Thriller' }
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-serif font-medium text-bookstore-primary mb-8">
          All Books
        </h1>

        {/* Filters */}
        <div className="mb-8 bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-serif mb-4">Filter Books</h2>
          <div className="grid gap-4 md:flex md:items-center md:space-x-4">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Search by title or author"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="w-full md:w-64">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="flex flex-col space-y-3">
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        ) : (
          <>
            {filteredBooks.length > 0 ? (
              <BookGrid books={filteredBooks} />
            ) : (
              <div className="text-center py-16">
                <h3 className="text-xl font-medium mb-2">No books found</h3>
                <p className="text-gray-500">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default BooksPage;
