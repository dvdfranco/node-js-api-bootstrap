import express from 'express';
import { getAllUsers, createUser, updateUser, searchByEmail, deleteUser } from './controllers/userController';
import { authLogin, authenticateToken, refreshToken } from './controllers/authController';
import dotenv from 'dotenv';

const app = express();
const port = 3000;

dotenv.config();

app.use(express.json());

app.get('/', (_req, res) => {
  res.send('Hello, Bootstrap Node.JS API!');
});

app.post('/api/auth/login', authLogin);
app.post('/api/auth/token', refreshToken);

app.get('/api/users', authenticateToken, getAllUsers);
app.post('/api/users', authenticateToken, createUser);
app.put('/api/users/:id', authenticateToken, updateUser);
app.get('/api/users/searchByEmail', authenticateToken, searchByEmail);
app.delete('/api/users/:id', deleteUser);

app.post('/api/setup', async (_req: express.Request, res: express.Response) => {
  res.json({ ok: true, message: "TODO: Setup" });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});