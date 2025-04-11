
import React from 'react';
import { Link } from 'react-router-dom';
import { Book } from '@/types/book';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Star } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { s3Service } from '@/lib/aws-s3';

interface BookCardProps {
  book: Book;
}

const BookCard: React.FC<BookCardProps> = ({ book }) => {
  const { addToCart } = useCart();
  const coverUrl = s3Service.getPlaceholderCoverUrl(book.id);

  return (
    <Card className="book-card overflow-hidden h-full flex flex-col">
      <Link to={`/books/${book.id}`} className="group">
        <div className="relative aspect-[2/3] overflow-hidden">
          <img
            src={coverUrl}
            alt={`${book.title} cover`}
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
          />
          {book.featured && (
            <span className="absolute top-0 right-0 bg-bookstore-accent text-white text-xs px-2 py-1">
              Featured
            </span>
          )}
        </div>
      </Link>

      <CardContent className="pt-4 flex-grow">
        <Link to={`/books/${book.id}`}>
          <h3 className="font-serif font-medium text-lg line-clamp-2 hover:text-bookstore-primary transition-colors">
            {book.title}
          </h3>
        </Link>
        <p className="text-sm text-bookstore-secondary mt-1">{book.author}</p>
        <div className="flex items-center mt-2">
          <div className="flex items-center">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="ml-1 text-sm">{book.rating}</span>
          </div>
          <span className="ml-auto font-medium">${book.price.toFixed(2)}</span>
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <Button 
          onClick={() => addToCart(book)}
          className="w-full bg-bookstore-primary hover:bg-bookstore-primary/90 text-white"
        >
          <ShoppingCart className="h-4 w-4 mr-2" /> Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BookCard;
