
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { dynamoDbService } from '../lib/aws-dynamodb';
import { cognitoService } from '../lib/aws-cognito';
import { Book, BookCategory } from '../types/book';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import AdminBookForm from '@/components/admin/AdminBookForm';

const AdminBooksPage = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const navigate = useNavigate();

  // Check if user is admin
  useEffect(() => {
    if (!cognitoService.isAuthenticated()) {
      toast({
        title: "Authentication Required",
        description: "Please log in to access this page.",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }
    
    if (!cognitoService.isAdmin()) {
      toast({
        title: "Access Denied",
        description: "You do not have permission to access this page.",
        variant: "destructive",
      });
      navigate('/');
      return;
    }
  }, [navigate]);

  // Load books
  useEffect(() => {
    const fetchBooks = async () => {
      setIsLoading(true);
      try {
        const allBooks = await dynamoDbService.getAllBooks();
        setBooks(allBooks);
      } catch (error) {
        console.error('Failed to fetch books:', error);
        toast({
          title: "Error",
          description: "Failed to load books. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const handleCreateBook = () => {
    setSelectedBook(null);
    setIsFormOpen(true);
  };

  const handleEditBook = (book: Book) => {
    setSelectedBook(book);
    setIsFormOpen(true);
  };

  const handleDeleteBook = async (id: string) => {
    try {
      await dynamoDbService.deleteBook(id);
      setBooks(books.filter(book => book.id !== id));
      toast({
        title: "Success",
        description: "Book deleted successfully.",
      });
    } catch (error) {
      console.error('Failed to delete book:', error);
      toast({
        title: "Error",
        description: "Failed to delete book. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSaveBook = async (bookData: Omit<Book, 'id'> | Book) => {
    try {
      let savedBook: Book;
      
      if ('id' in bookData) {
        // Update existing book
        savedBook = await dynamoDbService.updateBook(bookData.id, bookData);
        setBooks(books.map(book => book.id === savedBook.id ? savedBook : book));
        toast({
          title: "Success",
          description: "Book updated successfully.",
        });
      } else {
        // Create new book
        savedBook = await dynamoDbService.createBook(bookData);
        setBooks([...books, savedBook]);
        toast({
          title: "Success",
          description: "Book created successfully.",
        });
      }
      
      setIsFormOpen(false);
    } catch (error) {
      console.error('Failed to save book:', error);
      toast({
        title: "Error",
        description: "Failed to save book. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl md:text-4xl font-serif font-medium text-bookstore-primary">
            Manage Books
          </h1>
          <Button onClick={handleCreateBook} className="bg-bookstore-primary hover:bg-bookstore-primary/90">
            <PlusCircle className="h-4 w-4 mr-2" />
            Add New Book
          </Button>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-16 w-16" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
                <Skeleton className="h-10 w-24" />
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Book
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Author
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {books.map((book) => (
                  <tr key={book.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded">
                          {/* Book cover image placeholder */}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{book.title}</div>
                          <div className="text-sm text-gray-500">ID: {book.id.substring(0, 8)}...</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {book.author}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {book.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${book.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditBook(book)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-800"
                          onClick={() => handleDeleteBook(book.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isFormOpen && (
        <AdminBookForm
          book={selectedBook}
          onSave={handleSaveBook}
          onCancel={() => setIsFormOpen(false)}
        />
      )}
    </Layout>
  );
};

export default AdminBooksPage;
