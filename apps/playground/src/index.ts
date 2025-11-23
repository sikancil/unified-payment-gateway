import express from 'express';

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello from Indopay Playground!');
});

app.listen(port, () => {
  console.log(`Playground app listening on port ${port}`);
});
