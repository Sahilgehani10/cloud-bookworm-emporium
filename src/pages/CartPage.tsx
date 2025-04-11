
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { useCart } from '../context/CartContext';
import { s3Service } from '../lib/aws-s3';
import { Button } from '@/components/ui/button';
import { 
  Trash2, 
  ShoppingBag, 
  Plus, 
  Minus,
  ArrowRight,
  ShoppingCart
} from 'lucide-react';

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart();

  if (cartItems.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <ShoppingCart className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h2 className="text-2xl font-serif mb-4">Your cart is empty</h2>
          <p className="mb-8">Looks like you haven't added any books to your cart yet.</p>
          <Link to="/books">
            <Button>Browse Books</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-serif font-medium text-bookstore-primary mb-8">
          Your Cart
        </h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 text-left">
                  <tr>
                    <th className="p-4">Product</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Quantity</th>
                    <th className="p-4">Total</th>
                    <th className="p-4 sr-only">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {cartItems.map((item) => {
                    const coverUrl = s3Service.getPlaceholderCoverUrl(item.book.id);
                    
                    return (
                      <tr key={item.book.id}>
                        <td className="p-4">
                          <div className="flex items-center space-x-4">
                            <Link to={`/books/${item.book.id}`} className="shrink-0">
                              <img
                                src={coverUrl}
                                alt={item.book.title}
                                className="w-16 h-20 object-cover rounded"
                              />
                            </Link>
                            <div>
                              <Link 
                                to={`/books/${item.book.id}`}
                                className="font-medium hover:text-bookstore-primary transition-colors"
                              >
                                {item.book.title}
                              </Link>
                              <p className="text-sm text-gray-500">{item.book.author}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          ${item.book.price.toFixed(2)}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => updateQuantity(item.book.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => updateQuantity(item.book.id, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </td>
                        <td className="p-4 font-medium">
                          ${(item.book.price * item.quantity).toFixed(2)}
                        </td>
                        <td className="p-4 text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeFromCart(item.book.id)}
                          >
                            <Trash2 className="h-5 w-5 text-red-500" />
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            
            <div className="mt-4 flex justify-between">
              <Button variant="outline" onClick={clearCart}>
                Clear Cart
              </Button>
              <Link to="/books">
                <Button variant="link">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-serif font-medium mb-4">Order Summary</h3>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>$0.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${(cartTotal * 0.05).toFixed(2)}</span>
                </div>
              </div>
              
              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between font-medium text-lg">
                  <span>Total</span>
                  <span>${(cartTotal + cartTotal * 0.05).toFixed(2)}</span>
                </div>
              </div>
              
              <Button className="w-full bg-bookstore-accent hover:bg-bookstore-accent/90 text-white py-6 h-auto">
                Proceed to Checkout
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              
              <div className="mt-4 text-sm text-center text-gray-500">
                <p>Secure Checkout powered by AWS</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CartPage;
