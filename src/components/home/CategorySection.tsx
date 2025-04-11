
import React from 'react';
import { Link } from 'react-router-dom';
import { BookCategory, Category } from '@/types/book';
import { 
  BookOpen, 
  Bookmark, 
  Globe, 
  Rocket, 
  Shield, 
  Heart,
  UserRound,
  Clock,
  FileText, 
  Baby
} from 'lucide-react';

const categories: Category[] = [
  {
    id: 'fiction',
    name: 'Fiction',
    description: 'Novels and short stories that come from the imagination'
  },
  {
    id: 'non-fiction',
    name: 'Non-Fiction',
    description: 'Literature based on facts and real events'
  },
  {
    id: 'sci-fi',
    name: 'Science Fiction',
    description: 'Speculative fiction based on scientific concepts'
  },
  {
    id: 'fantasy',
    name: 'Fantasy',
    description: 'Stories featuring magic and supernatural elements'
  },
  {
    id: 'mystery',
    name: 'Mystery',
    description: 'Suspenseful stories centered around a crime or puzzle'
  },
  {
    id: 'romance',
    name: 'Romance',
    description: 'Stories focused on romantic relationships'
  },
  {
    id: 'thriller',
    name: 'Thriller',
    description: 'Suspenseful, exciting stories designed to thrill'
  },
  {
    id: 'biography',
    name: 'Biography',
    description: 'Accounts of someone\'s life written by someone else'
  },
  {
    id: 'history',
    name: 'History',
    description: 'Books about events from the past'
  },
  {
    id: 'children',
    name: 'Children\'s',
    description: 'Books designed for young readers'
  }
];

const categoryIcons: Record<BookCategory, React.ReactNode> = {
  fiction: <BookOpen className="h-6 w-6" />,
  'non-fiction': <FileText className="h-6 w-6" />,
  'sci-fi': <Rocket className="h-6 w-6" />,
  fantasy: <Bookmark className="h-6 w-6" />,
  mystery: <Shield className="h-6 w-6" />,
  romance: <Heart className="h-6 w-6" />,
  thriller: <Clock className="h-6 w-6" />,
  biography: <UserRound className="h-6 w-6" />,
  history: <Globe className="h-6 w-6" />,
  children: <Baby className="h-6 w-6" />
};

const CategorySection = () => {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif font-medium text-bookstore-primary mb-4">
            Browse by Category
          </h2>
          <p className="text-bookstore-secondary max-w-2xl mx-auto">
            Explore our comprehensive collection organized by genre to find exactly what you're looking for.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((category) => (
            <Link 
              key={category.id} 
              to={`/categories/${category.id}`}
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col items-center text-center"
            >
              <div className="text-bookstore-primary mb-2">
                {categoryIcons[category.id as BookCategory]}
              </div>
              <h3 className="font-serif text-lg font-medium mb-1">
                {category.name}
              </h3>
              <p className="text-sm text-gray-500 line-clamp-2">
                {category.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
