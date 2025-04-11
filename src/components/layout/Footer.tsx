
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-bookstore-primary text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-serif mb-4">Cloud Bookworm</h3>
            <p className="text-gray-300">
              Your premier online bookstore powered by AWS cloud technology. 
              Find your next great read with us.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-serif mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/books" className="text-gray-300 hover:text-white">
                  Books
                </Link>
              </li>
              <li>
                <Link to="/categories" className="text-gray-300 hover:text-white">
                  Categories
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white">
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-xl font-serif mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="text-gray-300 hover:text-white">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link to="/returns" className="text-gray-300 hover:text-white">
                  Returns & Refunds
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-300 hover:text-white">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="text-xl font-serif mb-4">Connect With Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="mailto:info@cloudbookworm.com" className="text-gray-300 hover:text-white">
                <Mail className="h-6 w-6" />
              </a>
            </div>
            <div className="mt-4">
              <p className="text-gray-300">Subscribe to our newsletter</p>
              <form className="mt-2 flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="px-4 py-2 w-full text-sm text-gray-900 rounded-l focus:outline-none"
                />
                <button
                  type="submit"
                  className="bg-bookstore-accent px-4 py-2 text-white text-sm font-medium rounded-r hover:bg-opacity-90"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Cloud Bookworm. All rights reserved.</p>
          <p className="mt-2">
            Powered by AWS S3, DynamoDB, and Cognito
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
