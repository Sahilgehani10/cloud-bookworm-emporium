
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <div className="bg-gradient-to-r from-bookstore-primary to-[#2a4365] text-white">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 text-center md:text-left md:pr-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-4 animate-fade-in">
              Discover Your Next
              <br />
              <span className="text-bookstore-accent">Favorite Book</span>
            </h1>
            <p className="text-lg md:text-xl mb-6 text-gray-200 animate-slide-up" style={{animationDelay: '0.2s'}}>
              Cloud Bookworm brings you a vast collection of books, powered
              by cutting-edge AWS cloud technology.
            </p>
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 justify-center md:justify-start animate-slide-up" style={{animationDelay: '0.4s'}}>
              <Link to="/books">
                <Button className="bg-bookstore-accent hover:bg-bookstore-accent/90 text-white px-6 py-6 h-auto">
                  Browse Books
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/categories">
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-bookstore-primary px-6 py-6 h-auto">
                  View Categories
                </Button>
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 mt-8 md:mt-0">
            <div className="relative animate-fade-in" style={{animationDelay: '0.6s'}}>
              <div className="absolute -inset-4 bg-bookstore-accent/20 rounded-lg blur-lg"></div>
              <div className="relative rounded-lg overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=2000" 
                  alt="Bookshelf" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
