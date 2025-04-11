
import { S3_BUCKET_NAME } from './aws-config';

// Simulated S3 service for storing and retrieving book cover images
export const s3Service = {
  // Get book cover image URL
  getImageUrl: (imageKey: string): string => {
    // In a real implementation, this would generate a valid S3 URL
    return `https://${S3_BUCKET_NAME}.s3.amazonaws.com/${imageKey}`;
  },
  
  // For demo purposes, we're using placeholder cover images
  getPlaceholderCoverUrl: (bookId: string): string => {
    // Using placeholder images by ID (would normally come from S3)
    const placeholders = [
      'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=300',
      'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=300',
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=300',
      'https://images.unsplash.com/photo-1589998059171-988d887df646?q=80&w=300',
      'https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=300',
      'https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=300'
    ];
    
    // Use the hash of the ID to pick a consistent image for each book
    const index = Math.abs(bookId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % placeholders.length;
    return placeholders[index];
  }
};
