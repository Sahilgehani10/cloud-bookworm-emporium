
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShoppingCart, 
  Search, 
  Menu, 
  X, 
  User,
  LogIn,
  LogOut,
  BookOpen
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { cognitoService } from '@/lib/aws-cognito';
import { Input } from '@/components/ui/input';

const Header = () => {
  const { cartCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const isAuthenticated = cognitoService.isAuthenticated();
  const username = cognitoService.getUsername();
  const isAdmin = cognitoService.isAdmin();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  const handleSignOut = async () => {
    await cognitoService.signOut();
    window.location.href = '/';
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleSearch = () => setIsSearchOpen(!isSearchOpen);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-serif font-bold text-bookstore-primary">Cloud</span>
              <span className="text-2xl font-serif text-bookstore-accent ml-1">Bookworm</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-bookstore-secondary hover:text-bookstore-primary px-3 py-2 font-medium">
              Home
            </Link>
            <Link to="/books" className="text-bookstore-secondary hover:text-bookstore-primary px-3 py-2 font-medium">
              Books
            </Link>
            <Link to="/categories" className="text-bookstore-secondary hover:text-bookstore-primary px-3 py-2 font-medium">
              Categories
            </Link>
            <Link to="/about" className="text-bookstore-secondary hover:text-bookstore-primary px-3 py-2 font-medium">
              About
            </Link>
            {isAdmin && (
              <Link to="/admin/books" className="text-bookstore-accent hover:text-bookstore-accent/80 px-3 py-2 font-medium flex items-center">
                <BookOpen className="h-4 w-4 mr-1" />
                Manage Books
              </Link>
            )}
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" size="icon" onClick={toggleSearch}>
              <Search className="h-5 w-5" />
            </Button>

            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-bookstore-accent rounded-full w-5 h-5 flex items-center justify-center text-xs text-white">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <Link to="/account">
                  <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                    <User className="h-4 w-4" />
                    <span>{username}</span>
                  </Button>
                </Link>
                <Button variant="ghost" size="icon" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Link to="/login">
                <Button variant="outline" size="sm" className="flex items-center space-x-1">
                  <LogIn className="h-4 w-4" />
                  <span>Sign In</span>
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Button variant="ghost" size="icon" onClick={toggleMenu}>
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Search Bar (conditionally rendered) */}
        {isSearchOpen && (
          <div className="py-4 border-t border-gray-100 animate-fade-in">
            <form onSubmit={handleSearch} className="flex space-x-2">
              <Input
                type="text"
                placeholder="Search for books..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" variant="default">
                Search
              </Button>
              <Button type="button" variant="ghost" size="icon" onClick={toggleSearch}>
                <X className="h-5 w-5" />
              </Button>
            </form>
          </div>
        )}

        {/* Mobile Menu (conditionally rendered) */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-100 animate-fade-in">
            <div className="px-2 pt-2 pb-4 space-y-1">
              <Link
                to="/"
                className="block px-3 py-2 rounded-md text-base font-medium text-bookstore-secondary hover:bg-bookstore-background"
                onClick={toggleMenu}
              >
                Home
              </Link>
              <Link
                to="/books"
                className="block px-3 py-2 rounded-md text-base font-medium text-bookstore-secondary hover:bg-bookstore-background"
                onClick={toggleMenu}
              >
                Books
              </Link>
              <Link
                to="/categories"
                className="block px-3 py-2 rounded-md text-base font-medium text-bookstore-secondary hover:bg-bookstore-background"
                onClick={toggleMenu}
              >
                Categories
              </Link>
              <Link
                to="/about"
                className="block px-3 py-2 rounded-md text-base font-medium text-bookstore-secondary hover:bg-bookstore-background"
                onClick={toggleMenu}
              >
                About
              </Link>
              {isAdmin && (
                <Link
                  to="/admin/books"
                  className="block px-3 py-2 rounded-md text-base font-medium text-bookstore-accent hover:bg-bookstore-background"
                  onClick={toggleMenu}
                >
                  Manage Books
                </Link>
              )}
              <Link
                to="/cart"
                className="block px-3 py-2 rounded-md text-base font-medium text-bookstore-secondary hover:bg-bookstore-background"
                onClick={toggleMenu}
              >
                Cart ({cartCount})
              </Link>
              {isAuthenticated ? (
                <>
                  <Link
                    to="/account"
                    className="block px-3 py-2 rounded-md text-base font-medium text-bookstore-secondary hover:bg-bookstore-background"
                    onClick={toggleMenu}
                  >
                    My Account
                  </Link>
                  <Button
                    variant="ghost"
                    className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-bookstore-secondary hover:bg-bookstore-background"
                    onClick={() => {
                      handleSignOut();
                      toggleMenu();
                    }}
                  >
                    Sign Out
                  </Button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="block px-3 py-2 rounded-md text-base font-medium text-bookstore-secondary hover:bg-bookstore-background"
                  onClick={toggleMenu}
                >
                  Sign In
                </Link>
              )}

              <div className="pt-2">
                <form onSubmit={handleSearch} className="flex space-x-2">
                  <Input
                    type="text"
                    placeholder="Search for books..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit" variant="default">
                    <Search className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
