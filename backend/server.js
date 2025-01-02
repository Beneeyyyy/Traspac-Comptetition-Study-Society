// Points routes
app.use('/api/points', require('./routes/points'));

// Start server
const PORT = process.env.PORT || 3000; 