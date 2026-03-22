const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { auth, optionalAuth } = require('../middleware/auth');

const JWT_SECRET = process.env.JWT_SECRET || 'inkwell_secret_2025';
const sign = (user) => jwt.sign({ id: user._id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '7d' });

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'All fields required' });
    if (password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' });
    if (await User.findOne({ email })) return res.status(409).json({ message: 'Email already registered' });
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });
    res.status(201).json({ token: sign(user), user: { id: user._id, name: user.name, email: user.email, bio: user.bio, avatar: user.avatar } });
  } catch (e) { console.error('REGISTER ERROR:', e); res.status(500).json({ message: e.message }); }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'No account found with this email' });
    if (!await bcrypt.compare(password, user.password)) return res.status(401).json({ message: 'Incorrect password' });
    res.json({ token: sign(user), user: { id: user._id, name: user.name, email: user.email, bio: user.bio, avatar: user.avatar } });
  } catch (e) { console.error('LOGIN ERROR:', e); res.status(500).json({ message: e.message }); }
});

// Get my profile
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password').populate('bookmarks', 'title subtitle coverImage createdAt readTime');
    res.json(user);
  } catch (e) { console.error('ME ERROR:', e); res.status(500).json({ message: e.message }); }
});

// Update profile
router.put('/me', auth, async (req, res) => {
  try {
    const { name, bio } = req.body;
    const user = await User.findByIdAndUpdate(req.user.id, { name, bio }, { new: true }).select('-password');
    res.json(user);
  } catch (e) { console.error('UPDATE ERROR:', e); res.status(500).json({ message: e.message }); }
});

// Get any user profile
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password -email');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (e) { console.error('USER ERROR:', e); res.status(500).json({ message: e.message }); }
});

// Follow / Unfollow
router.post('/:id/follow', auth, async (req, res) => {
  try {
    if (req.params.id === req.user.id) return res.status(400).json({ message: "Can't follow yourself" });
    const target = await User.findById(req.params.id);
    const me = await User.findById(req.user.id);
    const isFollowing = me.following.includes(req.params.id);
    if (isFollowing) {
      me.following.pull(req.params.id);
      target.followers.pull(req.user.id);
    } else {
      me.following.push(req.params.id);
      target.followers.push(req.user.id);
    }
    await me.save(); await target.save();
    res.json({ following: !isFollowing, followersCount: target.followers.length });
  } catch (e) { console.error('FOLLOW ERROR:', e); res.status(500).json({ message: e.message }); }
});

// Newsletter subscribe
router.post('/newsletter', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email required' });
    await User.findOneAndUpdate({ email }, { newsletter: true }, { upsert: false });
    res.json({ message: 'Subscribed successfully!' });
  } catch (e) { console.error('NEWSLETTER ERROR:', e); res.status(500).json({ message: e.message }); }
});

module.exports = router;