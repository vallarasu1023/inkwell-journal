import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const TOPICS = ['Technology', 'Programming', 'Design', 'Science', 'Business', 'Travel', 'Health', 'Culture'];

const API = 'http://localhost:8080';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQ, setSearchQ]       = useState('');
  const [dropOpen, setDropOpen]     = useState(false);
  const [scrolled, setScrolled]     = useState(false);
  const dropRef   = useRef();
  const searchRef = useRef();

  const [results,   setResults]   = useState([]);
  const [searching, setSearching] = useState(false);
  const searchTimer = useRef(null);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const clearResults = () => setResults([]);

  useEffect(() => {
    if (!searchQ.trim()) { clearResults(); return; }
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(async () => {
      setSearching(true);
      try {
        const ownRes  = await fetch(`${API}/api/posts?search=${encodeURIComponent(searchQ)}&limit=6`);
        const ownData = await ownRes.json();
        const own     = ownData.posts || [];
        if (own.length >= 3) {
          setResults(own);
        } else {
          await fetch(`${API}/api/news/import?q=${encodeURIComponent(searchQ)}`, { method: 'POST' });
          const freshRes  = await fetch(`${API}/api/posts?search=${encodeURIComponent(searchQ)}&limit=6`);
          const freshData = await freshRes.json();
          setResults(freshData.posts || []);
        }
      } catch {
        clearResults();
      } finally {
        setSearching(false);
      }
    }, 400);
    return () => clearTimeout(searchTimer.current);
  }, [searchQ]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current   && !dropRef.current.contains(e.target))   setDropOpen(false);
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false); clearResults();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [sidebarOpen]);

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQ.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQ)}`);
      setSearchOpen(false); setSearchQ(''); clearResults();
    }
  };

  return (
    <header style={{ ...s.header, boxShadow: scrolled ? '0 1px 0 rgba(0,0,0,0.04)' : 'none' }}>
      <style>{navbarResponsiveCSS}</style>

      {sidebarOpen && (
        <div style={mob.overlay} onClick={() => setSidebarOpen(false)} />
      )}

      <div style={{ ...mob.sidebar, transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)' }}>
        <div style={mob.sidebarHeader}>
          <Link to="/" style={s.logo} onClick={() => setSidebarOpen(false)}>
            <img src="/iw.jpg" alt="Inkwell" style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover' }} />
            <span style={s.logoText}>Inkwell</span>
          </Link>
          <button style={mob.closeBtn} onClick={() => setSidebarOpen(false)}>✕</button>
        </div>

        {user && (
          <div style={mob.userInfo}>
            {user.avatar
              ? <img src={user.avatar} alt="" style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover' }} />
              : <div style={mob.userAvatar}>{user.name?.[0]?.toUpperCase()}</div>
            }
            <div>
              <div style={mob.userName}>{user.name}</div>
              <div style={mob.userEmail}>{user.email}</div>
            </div>
          </div>
        )}

        <div style={mob.divider} />

        <nav style={mob.nav}>
          <Link to="/" style={mob.navItem} onClick={() => setSidebarOpen(false)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            Home
          </Link>
          {user && (
            <>
              <Link to="/write" style={mob.navItem} onClick={() => setSidebarOpen(false)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                Write
              </Link>
              <Link to="/bookmarks" style={mob.navItem} onClick={() => setSidebarOpen(false)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="m19 21-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
                Bookmarks
              </Link>
              <Link to={`/profile/${user.id}`} style={mob.navItem} onClick={() => setSidebarOpen(false)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                Profile
              </Link>
              <Link to="/drafts" style={mob.navItem} onClick={() => setSidebarOpen(false)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                Drafts
              </Link>
              <Link to="/images" style={mob.navItem} onClick={() => setSidebarOpen(false)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                Images
              </Link>
            </>
          )}
          {!user && (
            <Link to="/images" style={mob.navItem} onClick={() => setSidebarOpen(false)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
              Images
            </Link>
          )}
        </nav>

        <div style={mob.divider} />

        <div style={mob.topicsSection}>
          <div style={mob.topicsLabel}>Topics</div>
          <div style={mob.topicsGrid}>
            {TOPICS.map(t => (
              <Link key={t} to={`/tag/${t.toLowerCase()}`} style={mob.topicChip} onClick={() => setSidebarOpen(false)}>
                {t}
              </Link>
            ))}
          </div>
        </div>

        <div style={mob.divider} />

        <div style={mob.authSection}>
          {user ? (
            <button style={mob.signOutBtn} onClick={() => { logout(); setSidebarOpen(false); navigate('/'); }}>
              Sign out
            </button>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Link to="/signin" style={mob.signInBtn} onClick={() => setSidebarOpen(false)}>Sign in</Link>
              <Link to="/signup" style={mob.getStartedBtn} onClick={() => setSidebarOpen(false)}>Get started</Link>
            </div>
          )}
        </div>
      </div>

      <div style={s.inner} className="navbar-inner">
        <button className="navbar-hamburger" style={mob.hamburger} onClick={() => setSidebarOpen(true)}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#242424" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6"/>
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>

        <Link to="/" style={s.logo} className="navbar-logo">
          <img src="/iw.jpg" alt="Inkwell" style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover' }} />
          <span style={s.logoText}>Inkwell</span>
        </Link>

        {!searchOpen && (
          <nav style={s.topicsNav} className="navbar-topics">
            {TOPICS.slice(0, 5).map(t => (
              <Link key={t} to={`/tag/${t.toLowerCase()}`} style={s.topicLink}>{t}</Link>
            ))}
          </nav>
        )}

        {searchOpen ? (
          <div ref={searchRef} style={{ ...s.searchBox, position: 'relative' }} className="navbar-searchbox">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6b6b6b" strokeWidth="2" style={{ flexShrink: 0 }}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input
              autoFocus
              style={s.searchInput}
              placeholder="Search Inkwell..."
              value={searchQ}
              onChange={e => setSearchQ(e.target.value)}
              onKeyDown={handleSearch}
            />
            <button onClick={() => { setSearchOpen(false); clearResults(); }} style={s.closeSearch}>✕</button>

            {(searching || results.length > 0) && (
              <div style={s.resultsBox}>
                {searching && <div style={s.loadingRow}>Searching Inkwell…</div>}
                {!searching && results.length === 0 && searchQ.trim() && (
                  <div style={s.loadingRow}>No results found for "{searchQ}"</div>
                )}
                {!searching && results.map(post => (
                  <Link
                    key={post._id}
                    to={`/post/${post._id}`}
                    style={s.resultItem}
                    onClick={() => { setSearchOpen(false); clearResults(); setSearchQ(''); }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f7f7f7'}
                    onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                  >
                    {post.coverImage && (
                      <img
                        src={post.coverImage.startsWith('http') ? post.coverImage : `${API}${post.coverImage}`}
                        alt=""
                        style={s.thumb}
                        onError={e => e.target.style.display = 'none'}
                      />
                    )}
                    <div style={s.resultText}>
                      <div style={s.resultTitle}>{post.title}</div>
                      <div style={s.resultMeta}>{post.author?.name} · {post.readTime} min read · {post.category}</div>
                    </div>
                  </Link>
                ))}
                {!searching && results.length > 0 && (
                  <div style={s.footer}
                    onClick={() => { navigate(`/search?q=${encodeURIComponent(searchQ)}`); setSearchOpen(false); clearResults(); }}>
                    See all results for "{searchQ}" →
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <button onClick={() => setSearchOpen(true)} style={s.searchBtn}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6b6b6b" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          </button>
        )}

        <div style={s.right} className="navbar-right">
          {user ? (
            <>
              <Link to="/write" style={s.writeBtn} className="navbar-write-btn">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                Write
              </Link>
              <Link to="/images" style={s.iconBtn} title="Image Search" className="navbar-icon-hide">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6b6b6b" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
              </Link>
              <Link to="/bookmarks" style={s.iconBtn} title="Bookmarks" className="navbar-icon-hide">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6b6b6b" strokeWidth="2"><path d="m19 21-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
              </Link>
              <div ref={dropRef} style={{ position: 'relative' }} className="navbar-avatar-wrap">
                <button onClick={() => setDropOpen(d => !d)} style={s.avatarBtn}>
                  {user.avatar
                    ? <img src={user.avatar} alt="" style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }} />
                    : <div style={s.avatarCircle}>{user.name?.[0]?.toUpperCase()}</div>
                  }
                </button>
                {dropOpen && (
                  <div style={s.dropdown} className="navbar-dropdown">
                    <div style={s.dropHeader}>
                      <div style={s.dropName}>{user.name}</div>
                      <div style={s.dropEmail}>{user.email}</div>
                    </div>
                    <div style={s.dropDivider} />
                   {[
                      { to: `/profile/${user.id}`, label: 'Profile', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
                      { to: '/write', label: 'Write a story', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg> },
                      { to: '/drafts', label: 'Drafts', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> },
                      { to: '/bookmarks', label: 'Bookmarks', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m19 21-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg> },
                    ].map(item => (
                      <Link key={item.to} to={item.to} style={s.dropItem} onClick={() => setDropOpen(false)}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          {item.icon}
                          {item.label}
                        </span>
                      </Link>
                    ))}
                    <div style={s.dropDivider} />
                    <button style={s.dropItem} onClick={() => { logout(); setDropOpen(false); navigate('/'); }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                        Sign out
                      </span>
                    </button>
                    <div style={s.dropSub}><em>{user.email}</em></div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/images" style={s.topicLink} className="navbar-icon-hide">Images</Link>
              <Link to="/signin" style={s.signInBtn} className="navbar-signin-hide">Sign in</Link>
              <Link to="/signup" style={{ fontSize: 14, padding: '8px 20px', borderRadius: 999, background: '#242424', color: '#fff', fontWeight: 500 }}>Get started</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

const s = {
  header:       { position: 'sticky', top: 0, zIndex: 200, background: '#fff', borderBottom: '1px solid #e6e6e6', transition: 'box-shadow 0.2s' },
  inner:        { maxWidth: 1192, margin: '0 auto', padding: '0 24px', height: 57, display: 'flex', alignItems: 'center', gap: 16, boxSizing: 'border-box', width: '100%', position: 'relative' },
  logo:         { display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0, marginRight: 8 },
  logoText:     { fontFamily: 'Lora, serif', fontSize: 22, fontWeight: 700, color: '#242424', letterSpacing: '-0.02em' },
  topicsNav:    { display: 'flex', gap: 0, flex: 1, overflowX: 'auto', scrollbarWidth: 'none', minWidth: 0 },
  topicLink:    { padding: '0 14px', fontSize: 13, color: '#6b6b6b', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', height: 57, borderBottom: '2px solid transparent', transition: 'color 0.15s', fontWeight: 400 },
  searchBtn:    { display: 'flex', alignItems: 'center', padding: 8, color: '#6b6b6b', borderRadius: '50%', transition: 'background 0.15s', flexShrink: 0 },
  searchBox:    { display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0, padding: '8px 16px', border: '1px solid #e6e6e6', borderRadius: 999, background: '#fafafa', boxSizing: 'border-box' },
  searchInput:  { flex: 1, minWidth: 0, border: 'none', background: 'none', fontSize: 14, outline: 'none', color: '#242424' },
  closeSearch:  { fontSize: 13, color: '#9b9b9b', padding: '2px 4px', flexShrink: 0 },
  right:        { display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0, marginLeft: 'auto' },
  writeBtn:     { display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, color: '#6b6b6b', padding: '6px 12px', borderRadius: 999, transition: 'background 0.15s', fontWeight: 400, whiteSpace: 'nowrap' },
  iconBtn:      { display: 'flex', alignItems: 'center', padding: 8, color: '#6b6b6b', borderRadius: '50%' },
  signInBtn:    { fontSize: 14, color: '#6b6b6b', padding: '6px 12px', whiteSpace: 'nowrap' },
  avatarBtn:    { display: 'flex', alignItems: 'center', padding: 2 },
  avatarCircle: { width: 32, height: 32, borderRadius: '50%', background: '#242424', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 600 },
  dropdown:     { position: 'absolute', top: 44, right: 0, width: 240, background: '#fff', border: '1px solid #e6e6e6', borderRadius: 4, boxShadow: '0 4px 24px rgba(0,0,0,0.1)', zIndex: 300 },
  dropHeader:   { padding: '16px 20px 12px' },
  dropName:     { fontSize: 15, fontWeight: 600, color: '#242424', marginBottom: 2 },
  dropEmail:    { fontSize: 13, color: '#9b9b9b' },
  dropDivider:  { height: 1, background: '#f2f2f2' },
  dropItem:     { display: 'block', padding: '12px 20px', fontSize: 14, color: '#242424', width: '100%', textAlign: 'left', transition: 'background 0.1s', cursor: 'pointer' },
  dropSub:      { padding: '10px 20px', fontSize: 12, color: '#9b9b9b' },
  resultsBox:   { position: 'absolute', top: 'calc(100% + 8px)', left: 0, right: 0, background: '#fff', border: '1px solid #e6e6e6', borderRadius: 8, boxShadow: '0 8px 32px rgba(0,0,0,0.1)', zIndex: 400, overflow: 'hidden' },
  loadingRow:   { padding: '14px 16px', fontSize: 13, color: '#9b9b9b' },
  resultItem:   { display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px', background: '#fff', cursor: 'pointer', textDecoration: 'none', transition: 'background 0.1s' },
  thumb:        { width: 44, height: 44, borderRadius: 4, objectFit: 'cover', flexShrink: 0 },
  resultText:   { flex: 1, minWidth: 0 },
  resultTitle:  { fontSize: 13, fontWeight: 500, color: '#242424', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' },
  resultMeta:   { fontSize: 11, color: '#9b9b9b', marginTop: 2 },
  footer:       { padding: '10px 16px', fontSize: 13, color: '#1a8917', fontWeight: 500, cursor: 'pointer', borderTop: '1px solid #f2f2f2', background: '#fafafa' },
};

const mob = {
  overlay:       { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 500, backdropFilter: 'blur(2px)' },
  sidebar:       { position: 'fixed', top: 0, left: 0, bottom: 0, width: 280, background: '#fff', zIndex: 600, overflowY: 'auto', transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)', boxShadow: '4px 0 24px rgba(0,0,0,0.12)' },
  sidebarHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid #f2f2f2' },
  closeBtn:      { fontSize: 18, color: '#6b6b6b', background: 'none', border: 'none', cursor: 'pointer', padding: 4 },
  userInfo:      { display: 'flex', alignItems: 'center', gap: 12, padding: '20px 20px 16px' },
  userAvatar:    { width: 44, height: 44, borderRadius: '50%', background: '#242424', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, flexShrink: 0 },
  userName:      { fontSize: 15, fontWeight: 600, color: '#242424' },
  userEmail:     { fontSize: 13, color: '#9b9b9b', marginTop: 2 },
  divider:       { height: 1, background: '#f2f2f2', margin: '0' },
  nav:           { padding: '8px 0' },
  navItem:       { display: 'flex', alignItems: 'center', gap: 14, padding: '14px 20px', fontSize: 16, color: '#242424', fontWeight: 400, transition: 'background 0.15s', textDecoration: 'none' },
  topicsSection: { padding: '20px 20px' },
  topicsLabel:   { fontSize: 12, fontWeight: 700, color: '#9b9b9b', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 },
  topicsGrid:    { display: 'flex', flexWrap: 'wrap', gap: 8 },
  topicChip:     { padding: '6px 14px', borderRadius: 999, border: '1px solid #e6e6e6', fontSize: 13, color: '#6b6b6b', background: '#fafafa', textDecoration: 'none' },
  authSection:   { padding: '20px' },
  signOutBtn:    { width: '100%', padding: '12px', background: '#fff', color: '#242424', border: '1px solid #e6e6e6', borderRadius: 999, fontSize: 15, fontWeight: 500, cursor: 'pointer' },
  signInBtn:     { display: 'block', textAlign: 'center', padding: '12px', border: '1px solid #e6e6e6', borderRadius: 999, fontSize: 15, color: '#242424', fontWeight: 500, textDecoration: 'none' },
  getStartedBtn: { display: 'block', textAlign: 'center', padding: '12px', background: '#242424', color: '#fff', borderRadius: 999, fontSize: 15, fontWeight: 500, textDecoration: 'none' },
  hamburger:     { display: 'none', alignItems: 'center', justifyContent: 'center', padding: 6, background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0 },
};

const navbarResponsiveCSS = `
  @media (max-width: 768px) {
    .navbar-hamburger { display: flex !important; }
    .navbar-topics { display: none !important; }
    .navbar-icon-hide { display: none !important; }
    .navbar-signin-hide { display: none !important; }
    .navbar-inner {
      gap: 8px !important;
      padding: 0 16px !important;
      box-sizing: border-box !important;
      width: 100% !important;
      position: relative !important;
    }
    .navbar-write-btn { font-size: 13px !important; padding: 6px 8px !important; }
    .navbar-dropdown { width: 200px !important; right: 0 !important; }

    /* When search is open: full-width overlay bar covering the entire navbar */
    .navbar-searchbox {
      position: absolute !important;
      left: 0 !important;
      right: 0 !important;
      top: 0 !important;
      height: 57px !important;
      padding: 10px 16px !important;
      border-radius: 0 !important;
      border: none !important;
      border-bottom: 1px solid #e6e6e6 !important;
      background: #fff !important;
      z-index: 20 !important;
      box-sizing: border-box !important;
      display: flex !important;
      align-items: center !important;
      gap: 10px !important;
    }
  }

  @media (max-width: 480px) {
    .navbar-inner { padding: 0 12px !important; gap: 4px !important; }
    .navbar-right { gap: 4px !important; min-width: 0 !important; }
    .navbar-logo span { font-size: 18px !important; }
  }
`;