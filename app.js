// server.js
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Пример переменной, значение которой нужно прочитать
let myVariable = 42;

// Маршрут для получения значения переменной
app.get('/variable', (req, res) => {
  res.json({ value: myVariable });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
