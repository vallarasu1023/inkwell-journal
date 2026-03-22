const router = require('express').Router();
const { Comment } = require('../models');
const { auth } = require('../middleware/auth');

// Get comments for a post
router.get('/:postId', async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .sort({ createdAt: -1 })
      .populate('author', 'name avatar');
    res.json(comments);
  } catch (e) { res.status(500).json({ message: 'Server error' }); }
});

// Add comment
router.post('/:postId', auth, async (req, res) => {
  try {
    const { content } = req.body;
    if (!content?.trim()) return res.status(400).json({ message: 'Comment cannot be empty' });
    const comment = await Comment.create({ post: req.params.postId, author: req.user.id, content });
    await comment.populate('author', 'name avatar');
    res.status(201).json(comment);
  } catch (e) { res.status(500).json({ message: 'Server error' }); }
});

// Delete comment
router.delete('/:id', auth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });
    if (comment.author.toString() !== req.user.id) return res.status(403).json({ message: 'Not authorized' });
    await comment.deleteOne();
    res.json({ message: 'Comment deleted' });
  } catch (e) { res.status(500).json({ message: 'Server error' }); }
});

// Like a comment
router.post('/:id/like', auth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    const liked = comment.likes.includes(req.user.id);
    if (liked) comment.likes.pull(req.user.id);
    else comment.likes.push(req.user.id);
    await comment.save();
    res.json({ liked: !liked, count: comment.likes.length });
  } catch (e) { res.status(500).json({ message: 'Server error' }); }
});

module.exports = router;
