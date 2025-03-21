const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const UserInput = require('./UserInput');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/chromeExtension', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB successfully');
});

// Routes
app.post('/api/input', async (req, res) => {
    try {
        const { input } = req.body;
        const newUserInput = new UserInput({
            input: input,
            timestamp: new Date()
        });
        
        await newUserInput.save();
        res.status(201).json({ message: 'Input saved successfully', data: newUserInput });
    } catch (error) {
        res.status(500).json({ message: 'Error saving input', error: error.message });
    }
});

app.get('/api/inputs', async (req, res) => {
    try {
        const inputs = await UserInput.find().sort({ timestamp: -1 });
        res.status(200).json(inputs);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching inputs', error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 