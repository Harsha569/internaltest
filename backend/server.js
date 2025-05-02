
require('dotenv').config();
const express    = require('express');
const mongoose   = require('mongoose');
const cors       = require('cors');
const bookmarksRoute = require('./routes/markroutes');

const app = express();
app.use(cors());
app.use(express.json());

const mongoURI = process.env.MONGODB_URI;
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log(' Connected to MongoDB Atlas'))
  .catch(err => console.error(' MongoDB connection error:', err));

app.use('/api/bookmarks', bookmarksRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
