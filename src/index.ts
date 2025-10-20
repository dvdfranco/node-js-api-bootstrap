import express from 'express';
import { getAllCategories, updateCategory, searchCategoryByName } from './controllers/categoryController';

const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello, Pockety!');
});

app.get('/api/categories', getAllCategories);
app.put('/api/categories/:id', updateCategory);
app.get('/api/categories/search', searchCategoryByName);


app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});