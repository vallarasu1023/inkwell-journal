const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const { Post, User } = require('../models');
const { auth, optionalAuth } = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

function calcReadTime(content) {
  return Math.max(1, Math.ceil(content.split(/\s+/).length / 200));
}

// Get all posts (feed) with filters
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { page = 1, limit = 10, tag, category, search, author } = req.query;
    const filter = { isDraft: { $ne: true } };
    if (tag) filter.tags = tag;
    if (category && category !== 'All') filter.category = category;
    if (author) filter.author = author;
    if (search) filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { content: { $regex: search, $options: 'i' } },
      { tags: { $regex: search, $options: 'i' } },
    ];
    const posts = await Post.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate('author', 'name avatar bio');
    const total = await Post.countDocuments(filter);
    res.json({ posts, total, pages: Math.ceil(total / limit) });
  } catch (e) { res.status(500).json({ message: 'Server error' }); }
});

// Get my drafts
router.get('/my-drafts', auth, async (req, res) => {
  try {
    const drafts = await Post.find({ author: req.user.id, isDraft: true })
      .sort({ updatedAt: -1 })
      .populate('author', 'name avatar');
    res.json(drafts);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// Get trending posts
router.get('/trending', async (req, res) => {
  try {
    const posts = await Post.find({ isDraft: { $ne: true } })
      .sort({ claps: -1, views: -1 })
      .limit(6)
      .populate('author', 'name avatar');
    res.json(posts);
  } catch (e) { res.status(500).json({ message: 'Server error' }); }
});

// Get featured posts
router.get('/featured', async (req, res) => {
  try {
    const posts = await Post.find({ featured: true, isDraft: { $ne: true } })
      .sort({ createdAt: -1 })
      .limit(3)
      .populate('author', 'name avatar bio');
    res.json(posts);
  } catch (e) { res.status(500).json({ message: 'Server error' }); }
});

// Get single post
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id, { $inc: { views: 1 } }, { new: true }
    ).populate('author', 'name avatar bio followers');
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (e) { res.status(500).json({ message: 'Server error' }); }
});

// Create post
router.post('/', auth, upload.single('coverImage'), async (req, res) => {
  try {
    const { title, subtitle, content, tags, category, isDraft } = req.body;
    if (!title || !content) return res.status(400).json({ message: 'Title and content required' });
    const post = await Post.create({
      title, subtitle, content,
      tags: tags ? JSON.parse(tags) : [],
      category: category || 'General',
      coverImage: req.file ? `/uploads/${req.file.filename}` : '',
      author: req.user.id,
      readTime: calcReadTime(content),
      isDraft: isDraft === 'true',
    });
    await post.populate('author', 'name avatar');
    res.status(201).json(post);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// Update post
router.put('/:id', auth, upload.single('coverImage'), async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.author.toString() !== req.user.id) return res.status(403).json({ message: 'Not authorized' });
    const { title, subtitle, content, tags, category, isDraft } = req.body;
    post.title = title || post.title;
    post.subtitle = subtitle !== undefined ? subtitle : post.subtitle;
    post.content = content || post.content;
    post.tags = tags ? JSON.parse(tags) : post.tags;
    post.category = category || post.category;
    if (req.file) post.coverImage = `/uploads/${req.file.filename}`;
    if (content) post.readTime = calcReadTime(content);
    if (isDraft !== undefined) post.isDraft = isDraft === 'true';
    await post.save();
    await post.populate('author', 'name avatar');
    res.json(post);
  } catch (e) { res.status(500).json({ message: 'Server error' }); }
});

// Delete post
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.author.toString() !== req.user.id) return res.status(403).json({ message: 'Not authorized' });
    await post.deleteOne();
    res.json({ message: 'Post deleted' });
  } catch (e) { res.status(500).json({ message: 'Server error' }); }
});

// Clap for post
router.post('/:id/clap', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    const alreadyClapped = post.clappers.includes(req.user.id);
    if (alreadyClapped) {
      post.clappers.pull(req.user.id);
      post.claps = Math.max(0, post.claps - 1);
    } else {
      post.clappers.push(req.user.id);
      post.claps += 1;
    }
    await post.save();
    res.json({ claps: post.claps, clapped: !alreadyClapped });
  } catch (e) { res.status(500).json({ message: 'Server error' }); }
});

// Bookmark / unbookmark
router.post('/:id/bookmark', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const bookmarked = user.bookmarks.includes(req.params.id);
    if (bookmarked) user.bookmarks.pull(req.params.id);
    else user.bookmarks.push(req.params.id);
    await user.save();
    res.json({ bookmarked: !bookmarked });
  } catch (e) { res.status(500).json({ message: 'Server error' }); }
});

module.exports = router;