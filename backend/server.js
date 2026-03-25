const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');
const path     = require('path');
const fs       = require('fs');

const MONGO_URI = 'mongodb+srv://inkwelladmin:2W23TUyZXDl4IZ7c@inkwell.fry0kqj.mongodb.net/inkwell?retryWrites=true&w=majority&appName=inkwell';;
const JWT_SECRET = 'inkwell_secret_2025';
const EMAIL_USER = 'inkwellsupportteam@gmail.com';
const EMAIL_PASS = 'uwlbakny cxntaomv';
const GNEWS_KEY  = '3a5c725cee077ee1650caba57c123de5';

process.env.MONGO_URI  = MONGO_URI;
process.env.JWT_SECRET = JWT_SECRET;
process.env.EMAIL_USER = EMAIL_USER;
process.env.EMAIL_PASS = EMAIL_PASS;
process.env.GNEWS_KEY  = GNEWS_KEY;

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB connected to Atlas'))
  .catch(err => console.error('❌ DB error:', err));

if (!fs.existsSync('uploads')) fs.mkdirSync('uploads');

app.use('/api/auth',     require('./routes/auth'));
app.use('/api/posts',    require('./routes/posts'));
app.use('/api/comments', require('./routes/comments'));
app.use('/api',          require('./routes/forget'));
app.use('/api/news',     require('./routes/news'));

app.get('/', (req, res) => res.json({ message: 'Inkwell API running 🚀' }));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`🚀 Server on http://localhost:${PORT}`));