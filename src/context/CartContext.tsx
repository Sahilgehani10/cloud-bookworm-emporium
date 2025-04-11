
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Book, CartItem } from '../types/book';
import { toast } from '../components/ui/use-toast';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (book: Book, quantity?: number) => void;
  removeFromCart: (bookId: string) => void;
  updateQuantity: (bookId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  
  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem('bookstore_cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Failed to parse cart from localStorage', error);
      }
    }
  }, []);
  
  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('bookstore_cart', JSON.stringify(cartItems));
  }, [cartItems]);
  
  // Calculate cart total
  const cartTotal = cartItems.reduce((total, item) => total + (item.book.price * item.quantity), 0);
  
  // Calculate cart count (total number of items)
  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);
  
  // Add book to cart
  const addToCart = (book: Book, quantity = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.book.id === book.id);
      
      if (existingItem) {
        // Book is already in cart, update quantity
        return prevItems.map(item => 
          item.book.id === book.id 
            ? { ...item, quantity: item.quantity + quantity } 
            : item
        );
      } else {
        // Book is not in cart, add it
        return [...prevItems, { book, quantity }];
      }
    });
    
    toast({
      title: "Added to cart",
      description: `${book.title} added to your cart`,
    });
  };
  
  // Remove book from cart
  const removeFromCart = (bookId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.book.id !== bookId));
  };
  
  // Update book quantity in cart
  const updateQuantity = (bookId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(bookId);
      return;
    }
    
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.book.id === bookId ? { ...item, quantity } : item
      )
    );
  };
  
  // Clear cart
  const clearCart = () => {
    setCartItems([]);
  };
  
  return (
    <CartContext.Provider value={{ 
      cartItems, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart,
      cartTotal,
      cartCount
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  
  return context;
};
