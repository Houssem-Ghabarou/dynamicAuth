import app from './app.js';

app.listen(
  3001,
  '0.0.0.0', //  'localhost
  () => {
    console.log('Server is running on port 3001');
  }
);
