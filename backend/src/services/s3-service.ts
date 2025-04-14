import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { S3_BUCKET_NAME, awsConfig, isAwsConfigured } from '../../src/lib/aws-config';

// Initialize the S3 client
const s3Client = new S3Client(awsConfig);

export const s3Service = {
  // Get book cover image URL
  getImageUrl: (imageKey: string): string => {
    if (!imageKey) return '';
    
    if (isAwsConfigured()) {
      // Generate a URL for the S3 object (this is a public URL)
      return `https://${S3_BUCKET_NAME}.s3.amazonaws.com/${imageKey}`;
      
      // For private objects, you would generate a presigned URL instead
      // That code would look like:
      // const command = new GetObjectCommand({
      //   Bucket: S3_BUCKET_NAME,
      //   Key: imageKey
      // });
      // return getSignedUrl(s3Client, command, { expiresIn: 3600 });
    } else {
      // Fallback to placeholder image when AWS is not configured
      return s3Service.getPlaceholderCoverUrl(imageKey);
    }
  },
  
  // For demo purposes, we're using placeholder cover images
  getPlaceholderCoverUrl: (bookId: string): string => {
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
