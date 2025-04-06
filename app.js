const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());  // Middleware to parse JSON request bodies

let myVariable = "0";
let soil_moisture = "50";
let last_watering = "10:20";


// New GET endpoint for the root URL to display the value in HTML
app.get('/', (req, res) => {
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>myVariable Value</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background-color: #f0f0f0;
        }
        .container {
            text-align: center;
            background-color: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>The value of myVariable is: ${myVariable}</h1>
    </div>
</body>
</html>
    `;
    res.send(html);
});

// Existing GET endpoint to output the current value as JSON
app.get('/myVariable', (req, res) => {
    res.json({ value: myVariable });
});

app.get('/soil_moisture', (req, res) => {
    res.json({ value: soil_moisture });
});

app.get('/last_watering', (req, res) => {
    res.json({ value: last_watering });
});

// Updated POST endpoint to update and output the current value
app.post('/update', (req, res) => {
    const newValue = req.body.myVariable;  // Expecting { "myVariable": <value> } in the request body
    if (typeof newValue === 'number') {
        myVariable = newValue;  // Update the variable
        res.status(200).json({ success: true, value: myVariable });  // Added output of current value
    } else {
        res.status(400).json({ error: 'Invalid value' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
