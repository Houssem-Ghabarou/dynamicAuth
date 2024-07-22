import express from 'express';
import authRouter from './routes/authV2Routes.js';
import cors from 'cors';
const app = express();

app.get('/', (req, res) => {
  res.send({
    message: 'Welcome to the Auth API',
  });
});

//urlencoded
app.use(express.urlencoded({ extended: true }));
//json
app.use(express.json());
app.use(
  cors({
    origin: '*',
  })
);
app.use('/api/authv2', authRouter);

//fake post request api that returs an error
app.post('/api/fake', (req, res) => {
  res.status(400).json({});
});

export default app;
