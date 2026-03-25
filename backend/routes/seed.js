require('dotenv').config();
const mongoose = require('mongoose');
const { User, Post } = require('./models');

const posts = [
  { title: "The Future of Artificial Intelligence", subtitle: "How AI is changing the world", content: "Artificial intelligence is transforming every industry. From healthcare to finance, AI is making processes faster, smarter, and more efficient. The future holds even more promise as models become more capable and accessible to everyone.", category: "Technology", tags: ["AI", "Technology", "Future"], readTime: 5 },
  { title: "Building Your First React App", subtitle: "A step by step guide for beginners", content: "React is one of the most popular JavaScript libraries for building user interfaces. In this guide, we will walk through creating your first React application from scratch, covering components, state, props and hooks.", category: "Programming", tags: ["React", "JavaScript", "Programming"], readTime: 8 },
  { title: "The Art of Minimalist Design", subtitle: "Less is more in modern design", content: "Minimalist design focuses on simplicity and functionality. By removing unnecessary elements, designers create experiences that feel calm, clean and purposeful. This philosophy applies to everything from logos to entire websites.", category: "Design", tags: ["Design", "Minimalism", "UI"], readTime: 3 },
  { title: "The Science of Deep Sleep", subtitle: "Why quality sleep matters more than quantity", content: "Deep sleep is the most restorative phase of sleep. During this phase, your brain consolidates memories, your body repairs tissues, and your immune system strengthens. Poor sleep quality affects everything from mood to metabolism.", category: "Science", tags: ["Science", "Sleep", "Brain"], readTime: 5 },
  { title: "How to Start Investing in 2025", subtitle: "A beginner's guide to building wealth", content: "Investing doesn't require a lot of money to start. With modern apps, anyone can begin investing in stocks and mutual funds. The key is to start early, stay consistent and diversify your portfolio for long term growth.", category: "Business", tags: ["Finance", "Investing", "Business"], readTime: 7 },
  { title: "Exploring the Streets of Tokyo", subtitle: "A journey through Japan's vibrant capital", content: "Tokyo is one of the most vibrant cities in the world. From the neon lights of Shinjuku to the peaceful temples of Asakusa, every corner of Tokyo tells a story. The food, culture and people make it truly unforgettable.", category: "Travel", tags: ["Travel", "Japan", "Tokyo"], readTime: 6 },
  { title: "10 Tips for Healthy Living", subtitle: "Simple habits that change your life", content: "Living a healthy life doesn't have to be complicated. Start with small changes like drinking more water, walking 30 minutes a day, and getting 8 hours of sleep. These simple habits can completely transform your health.", category: "Health", tags: ["Health", "Wellness", "Lifestyle"], readTime: 4 },
  { title: "The Rise of Street Art", subtitle: "How graffiti became fine art", content: "Street art has evolved from illegal graffiti to gallery exhibitions. Artists like Banksy have turned city walls into canvases that spark conversation about politics, society and humanity. Culture is shaped by those brave enough to create.", category: "Culture", tags: ["Art", "Culture", "Street"], readTime: 4 },
  { title: "Python vs JavaScript in 2025", subtitle: "Which language should you learn first?", content: "Both Python and JavaScript are excellent first languages. Python is great for data science and AI while JavaScript dominates web development. Your choice should depend on what you want to build and where you want to work.", category: "Programming", tags: ["Python", "JavaScript", "Programming"], readTime: 6 },
  { title: "How Blockchain is Changing Business", subtitle: "Beyond cryptocurrency and NFTs", content: "Blockchain technology is far more than just Bitcoin. Businesses are using it for supply chain tracking, smart contracts and secure voting systems. The decentralized nature of blockchain brings trust and transparency to industries worldwide.", category: "Business", tags: ["Blockchain", "Business", "Technology"], readTime: 5 },
  { title: "The Psychology of Color in Design", subtitle: "Why colors make us feel things", content: "Colors have a profound effect on human emotions and behavior. Red creates urgency, blue builds trust, and green evokes nature. Smart designers use color psychology to guide users, build brand identity and create memorable experiences.", category: "Design", tags: ["Design", "Psychology", "Color"], readTime: 4 },
  { title: "Solo Travel Guide for Beginners", subtitle: "Everything you need to know before your first solo trip", content: "Solo travel is one of the most rewarding experiences you can have. It builds confidence, teaches self reliance and gives you total freedom. Start with a safe destination, plan your basics and embrace the unexpected adventures.", category: "Travel", tags: ["Travel", "Solo", "Adventure"], readTime: 7 },
  { title: "Understanding Quantum Computing", subtitle: "The next revolution in computing power", content: "Quantum computers use quantum bits instead of classical bits, allowing them to solve problems that would take regular computers millions of years. From drug discovery to cryptography, quantum computing will reshape science and technology.", category: "Science", tags: ["Quantum", "Science", "Computing"], readTime: 6 },
  { title: "The Secret to Work Life Balance", subtitle: "How to thrive in work and life", content: "Work life balance is not about splitting time equally. It is about being fully present in whatever you are doing. Set boundaries, prioritize your health, and remember that rest is not laziness but a requirement for sustained performance.", category: "Health", tags: ["Health", "Productivity", "Balance"], readTime: 3 },
  { title: "The History of Hip Hop Culture", subtitle: "From the Bronx to the world", content: "Hip hop was born in the Bronx in the 1970s as a form of creative expression for Black and Latino youth. What started as block parties evolved into a global cultural movement encompassing music, dance, fashion and art.", category: "Culture", tags: ["Culture", "Music", "History"], readTime: 5 },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  let author = await User.findOne({ email: 'demo@inkwell.com' });
  if (!author) {
    const bcrypt = require('bcryptjs');
    author = await User.create({
      name: 'Inkwell Team',
      email: 'demo@inkwell.com',
      password: await bcrypt.hash('demo1234', 10),
      bio: 'Official Inkwell blog team',
    });
    console.log('Created demo author');
  }

  await Post.deleteMany({ author: author._id });

  for (const p of posts) {
    await Post.create({
      ...p,
      author: author._id,
      claps: Math.floor(Math.random() * 500),
      views: Math.floor(Math.random() * 2000),
      featured: Math.random() > 0.7,
    });
  }

  console.log('✅ Seeded 15 posts across all categories!');
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });