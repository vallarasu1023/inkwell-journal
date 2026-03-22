import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PostCard from '../components/PostCard';
import api from '../api';

const TOPICS = ['For you','Following','Technology','Programming','Design','Science','Business','Travel','Health'];

function SkeletonPost() {
  return (
    <div style={{ padding: '24px 0', borderBottom: '1px solid #f2f2f2' }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <div className="skeleton" style={{ width: 24, height: 24, borderRadius: '50%' }} />
        <div className="skeleton" style={{ width: 120, height: 14 }} />
      </div>
      <div style={{ display: 'flex', gap: 24 }}>
        <div style={{ flex: 1 }}>
          <div className="skeleton" style={{ width: '90%', height: 20, marginBottom: 8 }} />
          <div className="skeleton" style={{ width: '70%', height: 14, marginBottom: 6 }} />
          <div className="skeleton" style={{ width: '50%', height: 14 }} />
        </div>
        <div className="skeleton" style={{ width: 160, height: 104, flexShrink: 0 }} />
      </div>
    </div>
  );
}

function getImgUrl(coverImage) {
  if (!coverImage) return null;
  return coverImage.startsWith('http') ? coverImage : `http://localhost:8080${coverImage}`;
}

export default function Home() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [trending, setTrending] = useState([]);
  const [activeTab, setActiveTab] = useState('For you');
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [subMsg, setSubMsg] = useState('');

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (activeTab !== 'For you' && activeTab !== 'Following') params.category = activeTab;
    api.get('/posts', { params }).then(r => setPosts(r.data.posts)).catch(() => {}).finally(() => setLoading(false));
  }, [activeTab]);

  useEffect(() => {
    api.get('/posts/trending').then(r => setTrending(r.data)).catch(() => {});
  }, []);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/newsletter', { email });
      setSubMsg('You\'re subscribed! 🎉');
      setEmail('');
    } catch { setSubMsg('Something went wrong. Try again.'); }
  };

  if (!user) return <LandingPage />;

  return (
    <div style={s.page}>
      <style>{homeResponsiveCSS}</style>
      <div style={s.layout} className="home-layout">
        <main style={s.feed} className="home-feed">
          <div style={s.tabs}>
            <div style={s.tabsInner}>
              {TOPICS.map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  style={{ ...s.tab, ...(activeTab === tab ? s.tabActive : {}) }}>
                  {tab}
                </button>
              ))}
            </div>
          </div>
          <div style={s.posts}>
            {loading
              ? Array.from({ length: 5 }).map((_, i) => <SkeletonPost key={i} />)
              : posts.length === 0
                ? <div style={s.empty}>No stories found. <Link to="/write" style={{ color: '#1a8917' }}>Write one!</Link></div>
                : posts.map(p => <PostCard key={p._id} post={p} />)
            }
          </div>
        </main>

        <aside style={s.sidebar} className="home-sidebar">
          <div style={s.sideSection}>
            <h3 style={s.sideTitle}>Trending on Inkwell</h3>
            {trending.slice(0, 5).map((post, i) => (
              <Link key={post._id} to={`/post/${post._id}`} style={s.trendItem}>
                <span style={s.trendNum}>{String(i + 1).padStart(2, '0')}</span>
                <div style={{ flex: 1 }}>
                  {getImgUrl(post.coverImage) && (
                    <img src={getImgUrl(post.coverImage)} alt=""
                      style={{ width: '100%', height: 80, objectFit: 'cover', borderRadius: 4, marginBottom: 8 }}
                      onError={e => { e.target.style.display = 'none'; }} />
                  )}
                  <div style={s.trendAuthor}>{post.author?.name}</div>
                  <div style={s.trendTitle}>{post.title}</div>
                  <div style={s.trendMeta}>{post.readTime} min read · {post.claps} claps</div>
                </div>
              </Link>
            ))}
          </div>

          <div style={s.sideSection}>
            <h3 style={s.sideTitle}>Recommended topics</h3>
            <div style={s.topicChips}>
              {['Technology','Programming','Design','Science','Business','Travel','Health','Culture','Food','Sports'].map(t => (
                <Link key={t} to={`/tag/${t.toLowerCase()}`} className="tag">{t}</Link>
              ))}
            </div>
          </div>

          <div style={s.newsletter}>
            <h4 style={s.nlTitle}>Get the best of Inkwell</h4>
            <p style={s.nlSub}>Top stories, curated weekly.</p>
            {subMsg ? <p style={{ fontSize: 14, color: '#1a8917', marginTop: 8 }}>{subMsg}</p> : (
              <form onSubmit={handleSubscribe} style={s.nlForm}>
                <input style={s.nlInput} type="email" placeholder="Your email"
                  value={email} onChange={e => setEmail(e.target.value)} required />
                <button type="submit" style={s.nlBtn}>Subscribe</button>
              </form>
            )}
          </div>

          <div style={s.sideFooter}>
            {[
              { label: 'Help', path: '/help' },
              { label: 'Status', path: '/status' },
              { label: 'About', path: '/about' },
              { label: 'Careers', path: '/careers' },
              { label: 'Press', path: '/press' },
              { label: 'Blog', path: '/blog' },
              { label: 'Privacy', path: '/privacy' },
              { label: 'Rules', path: '/rules' },
              { label: 'Terms', path: '/terms' },
            ].map(({ label, path }) => (
              <Link key={label} to={path} style={s.sideFooterLink}>{label}</Link>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}

function LandingPage() {
  return (
    <div>
      <style>{homeResponsiveCSS}</style>
      <div style={lp.hero} className="lp-hero">
        <div style={lp.heroInner} className="lp-hero-inner">
          <div style={lp.heroText} className="lp-hero-text">
            <h1 style={lp.heroTitle}>Human stories & ideas</h1>
            <p style={lp.heroSub}>A place to read, write, and deepen your understanding</p>
            <Link to="/signup" style={lp.heroBtn}>Start reading</Link>
          </div>
          <div style={lp.heroArt} className="lp-hero-art">
            <div style={lp.artCircle1} />
            <div style={lp.artCircle2} />
            <div style={lp.artCircle3} />
          </div>
        </div>
      </div>
      <TrendingSection />
      <div style={lp.banner}>
        <h2 style={lp.bannerTitle}>Write on Inkwell</h2>
        <p style={lp.bannerSub}>New? <Link to="/signup" style={{ color: '#1a8917' }}>Create a free account</Link>. Already a member? <Link to="/signin" style={{ color: '#1a8917' }}>Sign in</Link>.</p>
      </div>
    </div>
  );
}

function TrendingSection() {
  const [posts, setPosts] = useState([]);
  useEffect(() => { api.get('/posts/trending').then(r => setPosts(r.data)).catch(() => {}); }, []);
  return (
    <div style={{ borderTop: '1px solid #242424', padding: '32px 0' }}>
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b6b6b" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#242424' }}>TRENDING ON INKWELL</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '0 40px' }} className="trending-grid">
          {posts.map((post, i) => (
            <Link key={post._id} to={`/post/${post._id}`} style={{ display: 'flex', gap: 16, padding: '20px 0', borderTop: '1px solid #e6e6e6', alignItems: 'flex-start' }}>
              <span style={{ fontSize: 26, fontWeight: 700, color: '#e6e6e6', lineHeight: 1, minWidth: 28 }}>{String(i + 1).padStart(2, '0')}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                {getImgUrl(post.coverImage) && (
                  <img src={getImgUrl(post.coverImage)} alt=""
                    style={{ width: '100%', height: 80, objectFit: 'cover', borderRadius: 4, marginBottom: 8 }}
                    onError={e => { e.target.style.display = 'none'; }} />
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                  <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#242424', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#fff', flexShrink: 0 }}>{post.author?.name?.[0]}</div>
                  <span style={{ fontSize: 12, fontWeight: 600 }}>{post.author?.name}</span>
                </div>
                <h3 style={{ fontFamily: 'Lora, serif', fontSize: 15, fontWeight: 700, lineHeight: 1.3, color: '#242424' }}>{post.title}</h3>
                <div style={{ fontSize: 12, color: '#9b9b9b', marginTop: 6 }}>{post.readTime} min read · {post.claps} claps</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

const s = {
  page:          { background: '#fff', minHeight: '100vh' },
  layout:        { maxWidth: 1192, margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: '1fr 368px', gap: 40, alignItems: 'start', boxSizing: 'border-box' },
  feed:          { borderRight: '1px solid #f2f2f2', paddingRight: 40, minHeight: '100vh', minWidth: 0 },
  tabs:          { borderBottom: '1px solid #f2f2f2', marginBottom: 0, position: 'sticky', top: 57, background: '#fff', zIndex: 10 },
  tabsInner:     { display: 'flex', gap: 0, overflowX: 'auto', scrollbarWidth: 'none' },
  tab:           { padding: '14px 16px', fontSize: 13, color: '#6b6b6b', borderBottom: '2px solid transparent', whiteSpace: 'nowrap', transition: 'all 0.15s', fontWeight: 400 },
  tabActive:     { color: '#242424', borderBottomColor: '#242424', fontWeight: 500 },
  posts:         {},
  empty:         { padding: '60px 0', textAlign: 'center', fontSize: 16, color: '#6b6b6b' },
  sidebar:       { paddingTop: 32, position: 'sticky', top: 80, minWidth: 0 },
  sideSection:   { marginBottom: 40 },
  sideTitle:     { fontSize: 16, fontWeight: 700, color: '#242424', marginBottom: 16, fontFamily: 'Lora, serif' },
  trendItem:     { display: 'flex', gap: 14, marginBottom: 20, alignItems: 'flex-start' },
  trendNum:      { fontSize: 22, fontWeight: 700, color: '#e6e6e6', lineHeight: 1, minWidth: 24, flexShrink: 0 },
  trendAuthor:   { fontSize: 12, fontWeight: 600, color: '#242424', marginBottom: 3 },
  trendTitle:    { fontSize: 14, fontWeight: 700, color: '#242424', lineHeight: 1.3, fontFamily: 'Lora, serif', marginBottom: 4 },
  trendMeta:     { fontSize: 12, color: '#9b9b9b' },
  topicChips:    { display: 'flex', flexWrap: 'wrap', gap: 8 },
  newsletter:    { background: '#fafafa', border: '1px solid #e6e6e6', borderRadius: 4, padding: '20px', marginBottom: 32 },
  nlTitle:       { fontSize: 15, fontWeight: 700, color: '#242424', marginBottom: 4 },
  nlSub:         { fontSize: 13, color: '#6b6b6b', marginBottom: 12 },
  nlForm:        { display: 'flex', flexDirection: 'column', gap: 8 },
  nlInput:       { padding: '8px 12px', border: '1px solid #e6e6e6', borderRadius: 4, fontSize: 13, outline: 'none' },
  nlBtn:         { padding: '8px', background: '#1a8917', color: '#fff', border: 'none', borderRadius: 4, fontSize: 13, fontWeight: 600, cursor: 'pointer' },
  sideFooter:    { display: 'flex', flexWrap: 'wrap', gap: '6px 10px' },
  sideFooterLink:{ fontSize: 12, color: '#9b9b9b', textDecoration: 'none' },
};

const lp = {
  hero:       { borderBottom: '1px solid #242424', padding: '80px 0 60px', background: '#fff' },
  heroInner:  { maxWidth: 1192, margin: '0 auto', padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxSizing: 'border-box' },
  heroText:   {},
  heroTitle:  { fontFamily: 'Lora, serif', fontSize: 'clamp(40px,6vw,88px)', fontWeight: 700, color: '#242424', lineHeight: 1.05, letterSpacing: '-0.03em', marginBottom: 24 },
  heroSub:    { fontSize: 20, color: '#6b6b6b', marginBottom: 32, maxWidth: 420, lineHeight: 1.5 },
  heroBtn:    { display: 'inline-block', padding: '12px 32px', background: '#242424', color: '#fff', borderRadius: 999, fontSize: 16, fontWeight: 500, textDecoration: 'none' },
  heroArt:    { position: 'relative', width: 400, height: 300, flexShrink: 0 },
  artCircle1: { position: 'absolute', width: 260, height: 260, borderRadius: '50%', background: '#FFC017', top: 0, right: 40 },
  artCircle2: { position: 'absolute', width: 160, height: 160, borderRadius: '50%', background: '#242424', bottom: 0, right: 0 },
  artCircle3: { position: 'absolute', width: 80, height: 80, borderRadius: '50%', background: '#1a8917', top: 60, right: 20 },
  banner:     { padding: '40px 24px', borderTop: '1px solid #e6e6e6', textAlign: 'center', maxWidth: 1192, margin: '0 auto', boxSizing: 'border-box' },
  bannerTitle:{ fontFamily: 'Lora, serif', fontSize: 28, fontWeight: 700, marginBottom: 12 },
  bannerSub:  { fontSize: 16, color: '#6b6b6b' },
};

const homeResponsiveCSS = `
  *, *::before, *::after { box-sizing: border-box; }

  @media (max-width: 1024px) {
    .home-layout {
      grid-template-columns: minmax(0, 1fr) !important;
      gap: 0 !important;
    }
    .home-feed {
      border-right: none !important;
      padding-right: 0 !important;
    }
    .home-sidebar {
      display: none !important;
    }
  }

  @media (max-width: 768px) {
    .home-layout {
      padding: 0 16px !important;
      width: 100% !important;
    }
    .lp-hero { padding: 48px 0 40px !important; }
    .lp-hero-inner {
      flex-direction: column !important;
      gap: 32px !important;
      align-items: flex-start !important;
      padding: 0 16px !important;
      width: 100% !important;
    }
    .lp-hero-text {
      width: 100% !important;
    }
    .lp-hero-art {
      width: 100% !important;
      max-width: 100% !important;
      height: 200px !important;
    }
    .trending-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
      gap: 0 24px !important;
    }
  }

  @media (max-width: 480px) {
    .home-layout { padding: 0 12px !important; }
    .lp-hero-art { display: none !important; }
    .trending-grid { grid-template-columns: minmax(0, 1fr) !important; }
  }
`;