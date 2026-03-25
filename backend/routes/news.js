const router  = require('express').Router();
const axios   = require('axios');
const { Post, User } = require('../models');

const GNEWS_KEY = process.env.GNEWS_KEY;
const BOT_EMAIL = 'newsbot@inkwell.internal';
const BOT_NAME  = 'Inkwell Times';

async function getNewsBot() {
  let bot = await User.findOne({ email: BOT_EMAIL });
  if (!bot) {
    bot = await User.create({
      name:     BOT_NAME,
      email:    BOT_EMAIL,
      password: Math.random().toString(36),
      bio:      'Automated news feed for Inkwell.',
      avatar:   '',
    });
  }
  return bot;
}

function mapCategory(q) {
  const q2 = (q || '').toLowerCase();
  if (/programming|coding|developer/.test(q2))        return 'Programming';
  if (/tech|ai|software/.test(q2))                    return 'Technology';
  if (/health|medical|covid|disease/.test(q2))        return 'Health';
  if (/business|economy|market|finance|money/.test(q2)) return 'Business';
  if (/science|space|nasa|research/.test(q2))         return 'Science';
  if (/travel|tourism/.test(q2))                      return 'Travel';
  if (/design|art|culture/.test(q2))                  return 'Design';
  if (/politics|government|election|policy/.test(q2)) return 'General';
  if (/food|cooking|recipe/.test(q2))                 return 'Health';
  if (/sport|football|cricket|basketball/.test(q2))   return 'General';
  return 'General';
}

router.post('/import', async (req, res) => {
  try {
    const { q = 'world news' } = req.query;

    const gnewsRes = await axios.get('https://gnews.io/api/v4/search', {
      params: { q, lang: 'en', max: 10, apikey: GNEWS_KEY },
    });
    const articles = gnewsRes.data.articles || [];
    if (!articles.length) return res.json({ posts: [] });

    const bot   = await getNewsBot();
    const saved = [];

    for (const article of articles) {
      const exists = await Post.findOne({ title: article.title });
      if (exists) { saved.push(exists); continue; }

      const post = await Post.create({
        title:      article.title,
        subtitle:   article.description || '',
        content:    `${article.description || ''}\n\n${(article.content || '').split('[')[0].trim()}`,
        coverImage: article.image || '',
        tags:       [q, article.source?.name || 'news'].filter(Boolean),
        category:   mapCategory(q),
        author:     bot._id,
        readTime:   Math.max(1, Math.ceil((article.content || '').split(/\s+/).length / 200)),
        featured:   false,
        isDraft:    false,
      });
      await post.populate('author', 'name avatar bio');
      saved.push(post);
    }

    res.json({ posts: saved });
  } catch (e) {
    console.error('News import error:', e.message);
    res.status(500).json({ message: e.message });
  }
});

module.exports = router;