const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const adminRoutes = require('./routes/admin'); // Ensure correct path

const app = express();
app.use(cors());
app.use(express.json());

// Mount admin routes under /api/admin
app.use('/api/admin', adminRoutes);

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/johnpcv', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected'))
.catch(err => console.error('MongoDB Connection Error:', err));

// Start server on port 5000
app.listen(5000, () => console.log('Server running on port 5000'));

router.post("/sample-projects", upload.single("videoFile"), async (req, res) => {
    // Code to handle video upload
});
