const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

// CORS middleware - разрешает запросы с любых источников (для разработки)
app.use(cors());

app.use(express.json()); // Middleware to parse JSON request bodies

// Раздача статических файлов из директории client/dist (продакшн сборка)
app.use(express.static(path.join(__dirname, 'client', 'dist')));

// Путь к файлу данных
const DATA_FILE = path.join(__dirname, 'data.json');

// Загрузка данных из файла при старте сервера
let myVariable = 0;
let soil_moisture = "50";
let last_watering = "10:20";
let remember = 1000;

function loadData() {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    const parsed = JSON.parse(data);
    myVariable = parsed.myVariable ?? 0;
    soil_moisture = parsed.soil_moisture ?? "50";
    last_watering = parsed.last_watering ?? "10:20";
    remember = parsed.remember ?? 1000;
    console.log('[DATA] Loaded from file:', parsed);
  } catch (err) {
    console.log('[DATA] File not found, using defaults');
  }
}

function saveData() {
  try {
    const data = { myVariable, soil_moisture, last_watering, remember };
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
    console.log('[DATA] Saved to file:', data);
  } catch (err) {
    console.error('[DATA] Could not save to file:', err.message);
  }
}

// Загружаем данные при старте
loadData();

// GET endpoint to display the current state in HTML
app.get('/', (req, res) => {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Server Status</title>
  <style>
    body { font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background-color: #f0f0f0; }
    .container { text-align: center; background-color: white; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
  </style>
</head>
<body>
  <div class="container">
    <h1>Current Values</h1>
    <p>myVariable: ${myVariable}</p>
    <p>Soil Moisture: ${soil_moisture}</p>
    <p>Last Watering: ${last_watering}</p>
    <p>Remember: ${remember}</p>
  </div>
</body>
</html>
  `;
  res.send(html);
});

// GET endpoints for each variable
app.get('/myVariable', (req, res) => {
  res.json({ value: myVariable });
});

app.get('/soil_moisture', (req, res) => {
  res.json({ value: soil_moisture });
});

app.get('/last_watering', (req, res) => {
  res.json({ value: last_watering });
});

// New GET endpoint for "remember"
app.get('/remember', (req, res) => {
  res.json({ value: remember });
});

// POST endpoint to update variables
app.post('/ljnkjdhui37rhufeh77fhyh744hf347yfh723ryhf78', (req, res) => {
  const body = req.body || {};
  console.log('[POST] Received:', JSON.stringify(body));

  if ('myVariable' in body) {
    myVariable = body.myVariable;
  }
  if ('soil_moisture' in body) {
    soil_moisture = body.soil_moisture;
  }
  if ('last_watering' in body) {
    last_watering = body.last_watering;
  }
  // If the request contains "remember", update the persistent variable.
  if ('remember' in body) {
    remember = body.remember;
  }
  // If calibration command is received, set "remember" to the current soil_moisture.
  if ('calibrate' in body && body.calibrate === true) {
    remember = parseInt(soil_moisture);
  }
  
  // Сохраняем данные в файл
  saveData();

  res.status(200).json({ success: true, myVariable, soil_moisture, last_watering, remember });
});

// Маршрут для раздачи index.html для всех остальных запросов (SPA fallback)
app.get('/{*path}', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
