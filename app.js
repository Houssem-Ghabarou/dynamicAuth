import express from 'express';
import authRouter from './routes/authV2Routes.js';

const app = express();

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.use('/authv2', authRouter);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
