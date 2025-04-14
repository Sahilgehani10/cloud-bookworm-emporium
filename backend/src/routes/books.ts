
import express from 'express';
import { dynamoDbService } from '../services/dynamodb-service';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const books = await dynamoDbService.getAllBooks();
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch books' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const book = await dynamoDbService.getBookById(req.params.id);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch book' });
  }
});

router.post('/', async (req, res) => {
  try {
    const newBook = await dynamoDbService.createBook(req.body);
    res.status(201).json(newBook);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create book' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updatedBook = await dynamoDbService.updateBook(req.params.id, req.body);
    res.json(updatedBook);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update book' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await dynamoDbService.deleteBook(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete book' });
  }
});

router.get('/category/:category', async (req, res) => {
  try {
    const books = await dynamoDbService.getBooksByCategory(req.params.category);
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch books by category' });
  }
});

router.get('/search', async (req, res) => {
  try {
    const query = req.query.q as string;
    const books = await dynamoDbService.searchBooks(query);
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: 'Failed to search books' });
  }
});

export { router as booksRouter };
