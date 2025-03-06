const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());  // Middleware to parse JSON request bodies

let myVariable = 42;  // Example variable to update

// Existing GET endpoint (if present)
app.get('/variable', (req, res) => {
    res.json({ value: myVariable });
});

// New POST endpoint for /update
app.post('/update', (req, res) => {
    const newValue = req.body.myVariable;  // Expecting { "myVariable": <value> } in the request body
    if (typeof newValue === 'number') {
        myVariable = newValue;  // Update the variable
        res.status(200).json({ success: true });
    } else {
        res.status(400).json({ error: 'Invalid value' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
