const express = require('express');
const mongoose = require('mongoose');
const doctorRoutes = require('./routes/doctors');

const app = express();
const PORT = 3000;
const path = require('path');


// Connect to MongoDB
mongoose.connect('mongodb://localhost/your-database-name', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });



// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}))

// // Define the route to serve the index.html file
// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'index.html'));
//   });

// Routes
app.use('/api', doctorRoutes);



// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
