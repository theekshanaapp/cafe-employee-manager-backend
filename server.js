// const express = require('express');
// const cors = require('cors'); 
// const bodyParser = require('body-parser');
// const mongoose = require('mongoose');
// const cafeRoutes = require('./routes/cafes');
// const employeeRoutes = require('./routes/employees');

// const app = express();
// const port = process.env.PORT || 5001;

// // Middleware
// app.use(cors());
// app.use(bodyParser.json());
// app.use('/api/cafes', cafeRoutes);
// app.use('/api/employees', employeeRoutes);

// // MongoDB connection
// mongoose.connect('mongodb://localhost:27017/cafe-employee-manager', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// })
// .then(() => console.log('MongoDB connected'))
// .catch(err => console.error('MongoDB connection error:', err));

// // Start the server
// app.listen(port, () => {
//     console.log(`Server running on port ${port}`);
// });
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const cafeRoutes = require('./routes/cafes');
const employeeRoutes = require('./routes/employees');

const app = express();
const port = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/cafes', cafeRoutes);
app.use('/api/employees', employeeRoutes);

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/cafe-employee-manager', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Error handling middleware (optional)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
