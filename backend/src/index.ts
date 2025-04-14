
import express from 'express';
import cors from 'cors';
import { booksRouter } from './routes/books';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/books', booksRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
