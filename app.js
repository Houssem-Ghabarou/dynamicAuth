import express from 'express';
import authRouter from './routes/authV2Routes.js';
import cors from 'cors';
const app = express();

app.get('/', (req, res) => {
  res.send('Hello World');
});

//json
app.use(express.json());
app.use(
  cors({
    origin: '*',
  })
);
app.use('/api/auth', authRouter);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
