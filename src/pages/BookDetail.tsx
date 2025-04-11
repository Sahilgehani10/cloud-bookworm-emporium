
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { dynamoDbService } from '../lib/aws-dynamodb';
import { s3Service } from '../lib/aws-s3';
import { Book } from '../types/book';
import { useCart } from '../context/CartContext';
import { Button } from '@/components/ui/button';
import { 
  ShoppingCart, 
  Star, 
  Check, 
  X,
  Minus,
  Plus,
  ArrowLeft
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

const BookDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchBook = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        const bookData = await dynamoDbService.getBookById(id);
        if (bookData) {
          setBook(bookData);
        }
      } catch (error) {
        console.error('Failed to fetch book details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  const handleAddToCart = () => {
    if (book) {
      addToCart(book, quantity);
    }
  };

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-8">
            <Skeleton className="w-full md:w-1/3 aspect-[2/3]" />
            <div className="flex-1 space-y-4">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-4 w-1/4" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
              <Skeleton className="h-12 w-full md:w-1/2" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!book) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-serif mb-4">Book not found</h2>
          <p className="mb-8">The book you're looking for doesn't exist or has been removed.</p>
          <Link to="/books">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Books
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const coverUrl = s3Service.getPlaceholderCoverUrl(book.id);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <nav className="mb-6 text-sm breadcrumbs">
          <Link to="/" className="text-bookstore-secondary hover:text-bookstore-primary">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link to="/books" className="text-bookstore-secondary hover:text-bookstore-primary">
            Books
          </Link>
          <span className="mx-2">/</span>
          <span className="text-bookstore-primary">{book.title}</span>
        </nav>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Book Cover */}
          <div className="w-full md:w-1/3">
            <div className="sticky top-24 rounded-lg overflow-hidden shadow-lg">
              <img 
                src={coverUrl} 
                alt={`${book.title} cover`} 
                className="w-full object-cover"
              />
            </div>
          </div>

          {/* Book Details */}
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-serif font-medium text-bookstore-primary mb-2">
              {book.title}
            </h1>
            
            <p className="text-xl text-bookstore-secondary mb-4">by {book.author}</p>
            
            <div className="flex items-center mb-6">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i}
                    className={`h-5 w-5 ${i < Math.round(book.rating) 
                      ? 'fill-yellow-400 text-yellow-400' 
                      : 'text-gray-300'}`}
                  />
                ))}
                <span className="ml-2 text-sm">{book.rating} out of 5</span>
              </div>
            </div>
            
            <div className="mb-6">
              <div className="text-3xl font-medium mb-2">${book.price.toFixed(2)}</div>
              <div className="flex items-center">
                {book.inStock ? (
                  <span className="flex items-center text-green-600">
                    <Check className="h-5 w-5 mr-1" /> In Stock
                  </span>
                ) : (
                  <span className="flex items-center text-red-500">
                    <X className="h-5 w-5 mr-1" /> Out of Stock
                  </span>
                )}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Description</h3>
              <p className="text-gray-700">{book.description}</p>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Details</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex">
                  <span className="font-medium mr-2">Category:</span>
                  <Link 
                    to={`/categories/${book.category}`} 
                    className="text-bookstore-primary hover:underline"
                  >
                    {book.category.charAt(0).toUpperCase() + book.category.slice(1)}
                  </Link>
                </div>
                <div>
                  <span className="font-medium">Product ID:</span> {book.id}
                </div>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex flex-wrap gap-2">
                {book.tags.map(tag => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-center mb-4">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={decrementQuantity} 
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="mx-4 font-medium w-8 text-center">{quantity}</span>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={incrementQuantity}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              <Button 
                onClick={handleAddToCart} 
                disabled={!book.inStock}
                className="w-full sm:w-auto bg-bookstore-primary hover:bg-bookstore-primary/90 text-white py-6 h-auto"
              >
                <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BookDetail;
