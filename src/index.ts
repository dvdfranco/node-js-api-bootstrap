import express from 'express';
import { getAllUsers, createUser, updateUser, searchByEmail, deleteUser } from './controllers/userController';

const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (_req, res) => {
  res.send('Hello, Bootstrap Node.JS API!');
});

app.get('/api/users', getAllUsers);
app.post('/api/users', createUser);
app.put('/api/users/:id', updateUser);
app.get('/api/users/searchByEmail', searchByEmail);
app.delete('/api/users/:id', deleteUser);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});