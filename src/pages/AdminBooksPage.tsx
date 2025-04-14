import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { booksService } from '../services/books-service';
import { authService } from '../lib/auth-service';
import { Book } from '@/types/book';
import { Button } from '@/components/ui/button';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import AdminBookForm from '@/components/admin/AdminBookForm';

const AdminBooksPage = () => {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Check if user is admin
  React.useEffect(() => {
    if (!authService.isAuthenticated()) {
      toast({
        title: "Authentication Required",
        description: "Please log in to access this page.",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }
    
    if (!authService.isAdmin()) {
      toast({
        title: "Access Denied",
        description: "You do not have permission to access this page.",
        variant: "destructive",
      });
      navigate('/');
      return;
    }
  }, [navigate]);

  // Queries and Mutations
  const { data: books, isLoading } = useQuery({
    queryKey: ['books'],
    queryFn: booksService.getAllBooks,
  });

  const deleteMutation = useMutation({
    mutationFn: booksService.deleteBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      toast({
        title: "Success",
        description: "Book deleted successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete book. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleCreateBook = () => {
    setSelectedBook(null);
    setIsFormOpen(true);
  };

  const handleEditBook = (book: Book) => {
    setSelectedBook(book);
    setIsFormOpen(true);
  };

  const handleDeleteBook = async (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleSaveBook = async (bookData: Omit<Book, 'id'> | Book) => {
    try {
      if ('id' in bookData) {
        // Update existing book
        await booksService.updateBook(bookData.id, bookData);
        toast({
          title: "Success",
          description: "Book updated successfully.",
        });
      } else {
        // Create new book
        await booksService.createBook(bookData);
        toast({
          title: "Success",
          description: "Book created successfully.",
        });
      }
      
      queryClient.invalidateQueries({ queryKey: ['books'] });
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
          <div>Loading...</div>
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
                {books?.map((book) => (
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
                          disabled={deleteMutation.isLoading}
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
