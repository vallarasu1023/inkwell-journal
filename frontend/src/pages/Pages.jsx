import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PostCard from '../components/PostCard';
import api, { PEXELS_KEY } from '../api';

const SUGGESTIONS = ['Nature','Technology','Travel','Architecture','People','Food','Space','Art','Business','Fashion'];

function handleDownload(url, e) {
  e.stopPropagation();
  e.preventDefault();
  fetch(url)
    .then(function(res) { return res.blob(); })
    .then(function(blob) {
      var blobUrl = window.URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = blobUrl;
      a.download = 'inkwell-image.jpg';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(blobUrl);
    })
    .catch(function() { window.open(url, '_blank'); });
}

function PinCard(props) {
  var img = props.img;
  var onSelect = props.onSelect;
  var imgRef = useRef(null);
  var ratio = img.height / img.width;
  var pt = (ratio * 100).toFixed(2) + '%';

  useEffect(function() {
    if (imgRef.current && imgRef.current.complete) {
      imgRef.current.style.opacity = '1';
      imgRef.current.style.transform = 'translateY(0)';
    }
  }, []);

  return React.createElement(
    'div',
    {
      style: {
        position: 'relative',
        borderRadius: 16,
        overflow: 'hidden',
        cursor: 'pointer',
        background: '#f0f0f0',
        breakInside: 'avoid',
        marginBottom: 12,
        display: 'block',
        width: '100%',
        boxSizing: 'border-box',
      },
      className: 'pin-card',
      onClick: function() { onSelect(img); },
    },
    React.createElement(
      'div',
      { style: { position: 'relative', width: '100%', paddingTop: pt } },
      React.createElement('img', {
        ref: imgRef,
        src: img.src.medium,
        alt: img.alt,
        className: 'pin-img',
        style: {
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
          borderRadius: 16,
          opacity: 0,
          transform: 'translateY(12px)',
          transition: 'opacity 0.5s ease, transform 0.5s ease',
        },
        onLoad: function() {
          if (imgRef.current) {
            imgRef.current.style.opacity = '1';
            imgRef.current.style.transform = 'translateY(0)';
          }
        },
      }),
      React.createElement(
        'div',
        {
          className: 'pin-overlay',
          style: {
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.18) 55%, transparent 100%)',
            opacity: 0,
            transition: 'opacity 0.25s ease',
            display: 'flex',
            alignItems: 'flex-end',
            padding: '14px 12px',
            borderRadius: 16,
            pointerEvents: 'none',
          },
        },
        React.createElement(
          'span',
          {
            style: {
              fontSize: 12,
              color: '#fff',
              fontWeight: 600,
              letterSpacing: '0.01em',
              textShadow: '0 1px 4px rgba(0,0,0,0.6)',
            },
          },
          '\uD83D\uDCF7 ' + img.photographer
        )
      ),
      React.createElement(
        'button',
        {
          className: 'pin-dlbtn',
          style: {
            position: 'absolute',
            top: 10,
            right: 10,
            width: 40,
            height: 40,
            borderRadius: '50%',
            background: '#e30d10',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: 'none',
            cursor: 'pointer',
            zIndex: 10,
            boxShadow: '0 2px 12px rgba(0,0,0,0.35)',
            fontSize: 18,
            fontWeight: 700,
            lineHeight: 1,
            transition: 'opacity 0.2s ease, transform 0.15s ease',
          },
          title: 'Download',
          onClick: function(e) { handleDownload(img.src.original, e); },
        },
        '\u2193'
      )
    )
  );
}

export function ImageSearch() {
  const [query, setQuery] = useState('');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState('');

  const stateRef = useRef({
    query: '',
    page: 0,
    total: 0,
    count: 0,
    loading: false,
  });

  const sentinelRef = useRef(null);
  const loadMoreRef = useRef(null);

  loadMoreRef.current = function() {
    var s = stateRef.current;
    if (!s.query.trim()) return;
    if (s.loading) return;
    if (s.page > 0 && s.count >= s.total) return;

    var nextPage = s.page + 1;
    s.loading = true;
    setLoading(true);
    setError('');

    axios.get('https://api.pexels.com/v1/search', {
      headers: { Authorization: PEXELS_KEY },
      params: { query: s.query, per_page: 20, page: nextPage },
    }).then(function(res) {
      var photos = res.data.photos || [];
      var totalResults = res.data.total_results || 0;
      stateRef.current.page = nextPage;
      stateRef.current.total = totalResults;
      stateRef.current.count = stateRef.current.count + photos.length;
      setTotal(totalResults);
      if (nextPage === 1) {
        setImages(photos);
      } else {
        setImages(function(prev) { return prev.concat(photos); });
      }
    }).catch(function() {
      setError('Failed to load images. Try again.');
    }).finally(function() {
      stateRef.current.loading = false;
      setLoading(false);
      // after load check if sentinel still visible
      setTimeout(function() {
        if (!stateRef.current.loading && stateRef.current.count < stateRef.current.total) {
          if (sentinelRef.current) {
            var rect = sentinelRef.current.getBoundingClientRect();
            if (rect.top < window.innerHeight + 600) {
              loadMoreRef.current();
            }
          }
        }
      }, 400);
    });
  };

  var handleNewSearch = function(q) {
    if (!q.trim()) return;
    stateRef.current.query = q;
    stateRef.current.page = 0;
    stateRef.current.total = 0;
    stateRef.current.count = 0;
    stateRef.current.loading = false;
    setImages([]);
    setTotal(0);
    setError('');
    setTimeout(function() { loadMoreRef.current(); }, 0);
  };

  useEffect(function() {
    var observer = new IntersectionObserver(function(entries) {
      if (entries[0].isIntersecting) {
        loadMoreRef.current();
      }
    }, { rootMargin: '600px' });

    var interval = setInterval(function() {
      if (sentinelRef.current) {
        observer.observe(sentinelRef.current);
        clearInterval(interval);
      }
    }, 100);

    return function() {
      observer.disconnect();
      clearInterval(interval);
    };
  }, []);

  return React.createElement(
    'div',
    { style: { background: '#fff', minHeight: '100vh' } },
    React.createElement('style', null, imageSearchCSS),

    React.createElement(
      'div',
      { style: is.header },
      React.createElement(
        'div',
        { className: 'container' },
        React.createElement(
          'h1',
          { style: is.title },
          React.createElement('span', { style: { marginRight: 8, fontSize: 48, opacity: 2.5 } }, '✦'),
          'Inkwell Visuals'
        ),
        React.createElement('p', { style: is.sub }, 'Search, explore and save stunning visuals from around the world'),
        React.createElement(
          'div',
          { style: is.searchBar },
          React.createElement(
            'svg',
            { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: '#9b9b9b', strokeWidth: 2 },
            React.createElement('circle', { cx: 11, cy: 11, r: 8 }),
            React.createElement('path', { d: 'm21 21-4.35-4.35' })
          ),
          React.createElement('input', {
            style: is.searchInput,
            placeholder: 'Search for photos...',
            value: query,
            onChange: function(e) { setQuery(e.target.value); },
            onKeyDown: function(e) { if (e.key === 'Enter') handleNewSearch(query); },
          }),
          React.createElement(
            'button',
            { style: is.searchBtn, onClick: function() { handleNewSearch(query); } },
            'Search'
          )
        ),
        React.createElement(
          'div',
          { style: is.chips },
          SUGGESTIONS.map(function(s) {
            return React.createElement(
              'button',
              {
                key: s,
                style: is.chip,
                onClick: function() {
                  setQuery(s);
                  setTimeout(function() { handleNewSearch(s); }, 50);
                },
              },
              s
            );
          })
        )
      )
    ),

    React.createElement(
      'div',
      { className: 'container', style: { paddingBottom: 60 } },

      error ? React.createElement('div', { style: is.error }, error) : null,

      !loading && images.length === 0
        ? React.createElement(
            'div',
            { style: is.empty },
            React.createElement('div', { style: { fontSize: 64, marginBottom: 16 } }, '\uD83D\uDD0D'),
            React.createElement('h3', { style: { fontFamily: 'Playfair Display, Georgia, serif', fontSize: 22, marginBottom: 8 } }, 'Explore beautiful photos'),
            React.createElement('p', { style: { color: '#9b9b9b', fontSize: 15 } }, 'Search for any topic above to get started.')
          )
        : null,

      images.length > 0
        ? React.createElement(
            'div',
            null,
            React.createElement(
              'div',
              { style: { fontSize: 13, color: '#9b9b9b', margin: '24px 0 16px' } },
              total.toLocaleString() + ' results for "' + stateRef.current.query + '"'
            ),
            React.createElement(
              'div',
              { style: is.masonryGrid, className: 'masonry-grid' },
              images.map(function(img, idx) {
                return React.createElement(PinCard, { key: img.id + '-' + idx, img: img, onSelect: setSelected });
              }),
              loading
                ? Array.from({ length: 8 }).map(function(_, i) {
                    return React.createElement('div', { key: 'sk' + i, className: 'pin-skeleton' });
                  })
                : null
            ),

            React.createElement('div', { ref: sentinelRef, style: { height: 1 } }),

            loading && images.length > 0
              ? React.createElement(
                  'div',
                  { style: { textAlign: 'center', padding: '24px 0' } },
                  React.createElement('div', { className: 'pin-spinner' })
                )
              : null,

            !loading && images.length >= total && total > 0
              ? React.createElement(
                  'div',
                  { style: { textAlign: 'center', padding: '32px 0', fontSize: 13, color: '#9b9b9b' } },
                  'All ' + total.toLocaleString() + ' images loaded'
                )
              : null
          )
        : null
    ),

    selected
      ? React.createElement(
          'div',
          { style: is.lightbox, onClick: function() { setSelected(null); } },
          React.createElement(
            'div',
            { style: is.lightboxBox, onClick: function(e) { e.stopPropagation(); } },
            React.createElement('button', { style: is.closeBtn, onClick: function() { setSelected(null); } }, '\u2715'),
            React.createElement('img', { src: selected.src.large, alt: selected.alt, style: is.lightboxImg }),
            React.createElement(
              'div',
              { style: is.lightboxFooter },
              React.createElement(
                'div',
                null,
                React.createElement('div', { style: { fontWeight: 600, fontSize: 15, marginBottom: 4 } }, selected.alt || 'Photo'),
                React.createElement(
                  'div',
                  { style: { fontSize: 13, color: '#9b9b9b' } },
                  'by ',
                  React.createElement('strong', null, selected.photographer),
                  ' on Pexels'
                )
              ),
              React.createElement(
                'div',
                { style: { display: 'flex', gap: 10 } },
                React.createElement('a', { href: selected.url, target: '_blank', rel: 'noreferrer', style: is.viewBtn }, 'View on Pexels'),
                React.createElement(
                  'button',
                  { style: is.dlBtn2, onClick: function(e) { handleDownload(selected.src.original, e); } },
                  '\u2193 Original'
                )
              )
            )
          )
        )
      : null
  );
}

const imageSearchCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&display=swap');

  .masonry-grid {
    columns: 4;
    column-gap: 12px;
    margin-top: 8px;
    width: 100%;
    box-sizing: border-box;
    overflow-x: hidden;
  }
  .pin-card {
    break-inside: avoid;
    margin-bottom: 12px;
    display: block;
    width: 100%;
    box-sizing: border-box;
    border-radius: 16px;
    overflow: hidden;
    cursor: pointer;
    background: #f0f0f0;
    position: relative;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    will-change: transform;
  }
  .pin-card:hover {
    transform: translateY(-4px) scale(1.01);
    box-shadow: 0 12px 32px rgba(0,0,0,0.18);
  }
  .pin-card:hover .pin-img {
    transform: translateY(0) scale(1.07) !important;
    filter: brightness(1.06) !important;
  }
  .pin-card:hover .pin-overlay {
    opacity: 1 !important;
  }
  .pin-dlbtn {
    opacity: 0;
    transition: opacity 0.2s ease, transform 0.15s ease !important;
  }
  .pin-card:hover .pin-dlbtn {
    opacity: 1;
  }
  .pin-dlbtn:hover {
    transform: scale(1.12) !important;
    background: #c00a0d !important;
  }
  .pin-dlbtn:active {
    transform: scale(0.92) !important;
  }
  .pin-skeleton {
    break-inside: avoid;
    margin-bottom: 12px;
    display: block;
    width: 100%;
    height: 240px;
    border-radius: 16px;
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: pinShimmer 1.4s infinite;
    box-sizing: border-box;
  }
  @keyframes pinShimmer {
    0%   { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
  .pin-spinner {
    width: 32px;
    height: 32px;
    border: 3px solid #f0f0f0;
    border-top-color: #e30d10;
    border-radius: 50%;
    animation: pinSpin 0.7s linear infinite;
    margin: 0 auto;
  }
  @keyframes pinSpin {
    to { transform: rotate(360deg); }
  }
  .pin-card:active { opacity: 0.94; }

  @media (max-width: 1200px) {
    .masonry-grid { columns: 3 !important; }
  }
  @media (max-width: 768px) {
    .masonry-grid { columns: 2 !important; column-gap: 10px !important; }
    .pin-card { margin-bottom: 10px !important; }
    .pin-card:hover { transform: none !important; box-shadow: 0 2px 8px rgba(0,0,0,0.08) !important; }
    .pin-card:hover .pin-img { transform: translateY(0) scale(1) !important; filter: brightness(1) !important; }
    .pin-dlbtn { opacity: 1 !important; width: 34px !important; height: 34px !important; top: 8px !important; right: 8px !important; font-size: 15px !important; }
    .pin-overlay { opacity: 1 !important; }
  }
  @media (max-width: 480px) {
    .masonry-grid { columns: 2 !important; column-gap: 8px !important; }
    .pin-card { margin-bottom: 8px !important; border-radius: 10px !important; }
    .pin-skeleton { height: 160px !important; border-radius: 10px !important; }
  }
`;

const is = {
  header:         { background: '#fafafa', borderBottom: '1px solid #e6e6e6', padding: '56px 0 32px' },
  title:          { fontFamily: '"Playfair Display", Georgia, serif', fontSize: 52, fontWeight: 800, background: 'linear-gradient(90deg, #0F0F0F, #444444)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', marginBottom: 8, letterSpacing: '-0.04em', lineHeight: 1.05 },
  sub:            { fontSize: 17, color: '#9b9b9b', marginBottom: 28, fontStyle: 'italic', letterSpacing: '0.01em', opacity: 0.85 },
  searchBar:      { display: 'flex', alignItems: 'center', gap: 12, maxWidth: 580, background: '#fff', border: '1px solid #e6e6e6', borderRadius: 999, padding: '8px 8px 8px 20px' },
  searchInput:    { flex: 1, border: 'none', outline: 'none', fontSize: 15, color: '#242424', background: 'none' },
  searchBtn:      { padding: '10px 24px', background: '#242424', color: '#fff', border: 'none', borderRadius: 999, fontSize: 14, fontWeight: 600, cursor: 'pointer', flexShrink: 0 },
  chips:          { display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 20 },
  chip:           { padding: '6px 16px', borderRadius: 999, border: '1px solid #e6e6e6', background: '#fff', fontSize: 13, cursor: 'pointer', color: '#6b6b6b' },
  error:          { padding: '12px', background: '#fff8f8', border: '1px solid #ffd0d0', borderRadius: 4, fontSize: 13, color: '#c00', margin: '24px 0' },
  empty:          { textAlign: 'center', padding: '100px 0' },
  masonryGrid:    { columns: 4, columnGap: 12, marginTop: 8, width: '100%', boxSizing: 'border-box' },
  loadMore:       { padding: '10px 32px', border: '1px solid #242424', borderRadius: 999, fontSize: 14, fontWeight: 500, cursor: 'pointer', background: '#fff', color: '#242424' },
  lightbox:       { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 },
  lightboxBox:    { background: '#fff', borderRadius: 4, overflow: 'hidden', maxWidth: 900, width: '100%', position: 'relative' },
  lightboxImg:    { width: '100%', maxHeight: 560, objectFit: 'cover' },
  lightboxFooter: { padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' },
  closeBtn:       { position: 'absolute', top: 12, right: 12, width: 32, height: 32, borderRadius: '50%', background: 'rgba(0,0,0,0.6)', color: '#fff', border: 'none', fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  viewBtn:        { padding: '8px 16px', border: '1px solid #e6e6e6', borderRadius: 4, fontSize: 13, color: '#242424', textDecoration: 'none' },
  dlBtn2:         { padding: '8px 16px', background: '#242424', color: '#fff', borderRadius: 4, fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer' },
};

export function Profile() {
  const { id } = useParams();
  const { user: me } = useAuth();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('posts');
  const [following, setFollowing] = useState(false);

  useEffect(() => {
    Promise.all([
      api.get('/auth/' + id),
      api.get('/posts?author=' + id)
    ]).then(([u, p]) => {
      setProfile(u.data);
      setPosts(p.data.posts);
      if (me) setFollowing(u.data.followers?.includes(me.id));
    }).catch(console.error).finally(() => setLoading(false));
  }, [id, me]);

  const handleFollow = async () => {
    if (!me) return;
    try {
      await api.post('/auth/' + id + '/follow');
      setFollowing(f => !f);
      setProfile(p => ({ ...p, followers: following ? p.followers.filter(f => f !== me.id) : [...p.followers, me.id] }));
    } catch {}
  };

  if (loading) return <div style={{ padding: 60, textAlign: 'center' }}>Loading...</div>;
  if (!profile) return <div style={{ padding: 60, textAlign: 'center' }}>User not found</div>;
  const isMe = me?.id === id;

  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>
      <div className="container" style={{ maxWidth: 960, padding: '60px 24px' }}>
        <div style={pr.header}>
          <div>
            <h1 style={pr.name}>{profile.name}</h1>
            {profile.bio && <p style={pr.bio}>{profile.bio}</p>}
            <div style={pr.stats}>
              <span style={pr.stat}><strong>{profile.followers?.length || 0}</strong> Followers</span>
              <span style={pr.stat}><strong>{profile.following?.length || 0}</strong> Following</span>
              <span style={pr.stat}><strong>{posts.length}</strong> Stories</span>
            </div>
            {!isMe && me && (
              <button onClick={handleFollow} style={following ? pr.followingBtn : pr.followBtn}>
                {following ? 'Following' : 'Follow'}
              </button>
            )}
          </div>
          <div style={pr.avatarBig}>{profile.name?.[0]?.toUpperCase()}</div>
        </div>
        <div style={pr.tabs}>
          <button style={{ ...pr.tab, ...(tab === 'posts' ? pr.tabActive : {}) }} onClick={() => setTab('posts')}>Stories</button>
          {isMe && <button style={{ ...pr.tab, ...(tab === 'about' ? pr.tabActive : {}) }} onClick={() => setTab('about')}>About</button>}
        </div>
        {tab === 'posts' && (
          posts.length === 0
            ? <div style={{ padding: '60px 0', color: '#9b9b9b', fontSize: 16 }}>No stories published yet.</div>
            : posts.map(p => <PostCard key={p._id} post={p} />)
        )}
        {tab === 'about' && isMe && (
          <div style={{ maxWidth: 480, paddingTop: 32 }}>
            <div style={pr.aboutRow}><span style={pr.aboutLabel}>Name</span><span>{profile.name}</span></div>
            <div style={pr.aboutRow}><span style={pr.aboutLabel}>Bio</span><span>{profile.bio || '—'}</span></div>
            <div style={pr.aboutRow}><span style={pr.aboutLabel}>Joined</span><span>{new Date(profile.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</span></div>
          </div>
        )}
      </div>
    </div>
  );
}

export function Bookmarks() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/auth/me').then(r => {
      setPosts(r.data.bookmarks || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>
      <div style={{ maxWidth: 728, margin: '0 auto', padding: '48px 24px' }}>
        <h1 style={{ fontFamily: 'Lora, serif', fontSize: 36, fontWeight: 700, marginBottom: 40 }}>Reading list</h1>
        {loading ? <div>Loading...</div>
          : posts.length === 0
            ? <div style={{ color: '#9b9b9b', fontSize: 16 }}>No bookmarks yet. Save stories to read later.</div>
            : posts.map(p => <PostCard key={p._id} post={{ ...p, author: { name: 'Author' } }} />)
        }
      </div>
    </div>
  );
}

export function Search() {
  const [searchParams] = useSearchParams();
  const q = searchParams.get('q') || '';
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!q) return setLoading(false);
    api.get('/posts?search=' + encodeURIComponent(q)).then(r => setPosts(r.data.posts)).catch(() => {}).finally(() => setLoading(false));
  }, [q]);

  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>
      <div style={{ maxWidth: 728, margin: '0 auto', padding: '48px 24px' }}>
        <h1 style={{ fontFamily: 'Lora, serif', fontSize: 28, fontWeight: 700, marginBottom: 8 }}>
          Results for &quot;{q}&quot;
        </h1>
        <p style={{ color: '#9b9b9b', fontSize: 14, marginBottom: 32 }}>{posts.length} stories found</p>
        {loading ? <div>Searching...</div>
          : posts.length === 0
            ? <div style={{ color: '#9b9b9b' }}>No stories matched your search.</div>
            : posts.map(p => <PostCard key={p._id} post={p} />)
        }
      </div>
    </div>
  );
}

export function TagPage() {
  const { tag } = useParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const displayTag = tag.charAt(0).toUpperCase() + tag.slice(1);

  useEffect(() => {
    api.get('/posts?category=' + displayTag).then(r => setPosts(r.data.posts)).catch(() => {}).finally(() => setLoading(false));
  }, [tag, displayTag]);

  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>
      <div style={{ borderBottom: '1px solid #e6e6e6', padding: '40px 0' }}>
        <div className="container" style={{ maxWidth: 960 }}>
          <div style={{ display: 'inline-block', padding: '8px 20px', border: '1px solid #242424', borderRadius: 999, fontSize: 14, fontWeight: 500, marginBottom: 12 }}>{displayTag}</div>
          <h1 style={{ fontFamily: 'Lora, serif', fontSize: 42, fontWeight: 700, marginBottom: 8 }}>{displayTag}</h1>
          <p style={{ color: '#9b9b9b', fontSize: 15 }}>{posts.length} stories</p>
        </div>
      </div>
      <div className="container" style={{ maxWidth: 960, padding: '0 24px' }}>
        <div style={{ maxWidth: 728 }}>
          {loading ? <div style={{ padding: 40 }}>Loading...</div>
            : posts.length === 0
              ? <div style={{ padding: '60px 0', color: '#9b9b9b' }}>No stories in this topic yet.</div>
              : posts.map(p => <PostCard key={p._id} post={p} />)
          }
        </div>
      </div>
    </div>
  );
}

export function Drafts() {
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const navigate = useNavigate();

  const fetchDrafts = () => {
    setLoading(true);
    api.get('/posts/my-drafts')
      .then(r => setDrafts(Array.isArray(r.data) ? r.data : r.data.drafts || []))
      .catch(() => setDrafts([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchDrafts(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this draft?')) return;
    setDeleting(id);
    try {
      await api.delete('/posts/' + id);
      setDrafts(d => d.filter(x => x._id !== id));
    } catch {}
    setDeleting(null);
  };

  const handleEdit = (id) => navigate('/write/draft/' + id);

  const handlePublish = async (id) => {
    try {
      await api.put('/posts/' + id, { isDraft: false });
      setDrafts(d => d.filter(x => x._id !== id));
      navigate('/');
    } catch {}
  };

  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>
      <div style={{ maxWidth: 728, margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
          <div>
            <h1 style={{ fontFamily: 'Lora, serif', fontSize: 36, fontWeight: 700, marginBottom: 6 }}>Your Drafts</h1>
            <p style={{ color: '#9b9b9b', fontSize: 15 }}>{drafts.length} draft{drafts.length !== 1 ? 's' : ''} saved</p>
          </div>
          <button onClick={() => navigate('/write')} style={{ padding: '10px 24px', background: '#242424', color: '#fff', border: 'none', borderRadius: 999, fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>
            + New story
          </button>
        </div>
        {loading ? (
          <div style={{ padding: '60px 0', textAlign: 'center', color: '#9b9b9b' }}>Loading drafts...</div>
        ) : drafts.length === 0 ? (
          <div style={{ padding: '80px 0', textAlign: 'center' }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>📝</div>
            <h3 style={{ fontFamily: 'Lora, serif', fontSize: 22, marginBottom: 8 }}>No drafts yet</h3>
            <p style={{ color: '#9b9b9b', fontSize: 15, marginBottom: 24 }}>Start writing and save your work as a draft.</p>
            <button onClick={() => navigate('/write')} style={{ padding: '10px 28px', background: '#242424', color: '#fff', border: 'none', borderRadius: 999, fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>
              Start writing
            </button>
          </div>
        ) : (
          <div>
            {drafts.map(draft => (
              <div key={draft._id} style={dr.card}>
                <div style={dr.cardBody}>
                  <h2 style={dr.title}>{draft.title || 'Untitled draft'}</h2>
                  {draft.content && (
                    <p style={dr.excerpt}>
                      {draft.content.replace(/<[^>]*>/g, '').substring(0, 120)}
                      {draft.content.length > 120 ? '...' : ''}
                    </p>
                  )}
                  <div style={dr.meta}>
                    <span style={dr.date}>
                      Last saved {new Date(draft.updatedAt || draft.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    {draft.category && <span style={dr.tag}>{draft.category}</span>}
                  </div>
                </div>
                <div style={dr.actions}>
                  <button onClick={() => handleEdit(draft._id)} style={dr.editBtn}>Edit</button>
                  <button onClick={() => handlePublish(draft._id)} style={dr.publishBtn}>Publish</button>
                  <button onClick={() => handleDelete(draft._id)} disabled={deleting === draft._id} style={dr.deleteBtn}>
                    {deleting === draft._id ? '...' : 'Delete'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const pr = {
  header:      { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 40, paddingBottom: 40, borderBottom: '1px solid #e6e6e6' },
  name:        { fontFamily: 'Lora, serif', fontSize: 42, fontWeight: 700, color: '#242424', marginBottom: 12 },
  bio:         { fontSize: 16, color: '#6b6b6b', lineHeight: 1.6, marginBottom: 16, maxWidth: 480 },
  stats:       { display: 'flex', gap: 24, marginBottom: 20 },
  stat:        { fontSize: 15, color: '#6b6b6b' },
  followBtn:   { padding: '8px 24px', background: '#1a8917', color: '#fff', border: 'none', borderRadius: 999, fontSize: 14, fontWeight: 500, cursor: 'pointer' },
  followingBtn:{ padding: '8px 24px', background: '#fff', color: '#242424', border: '1px solid #e6e6e6', borderRadius: 999, fontSize: 14, cursor: 'pointer' },
  avatarBig:   { width: 88, height: 88, borderRadius: '50%', background: '#242424', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, fontWeight: 700, flexShrink: 0 },
  tabs:        { display: 'flex', borderBottom: '1px solid #e6e6e6', marginBottom: 0 },
  tab:         { padding: '14px 0', marginRight: 32, fontSize: 15, color: '#9b9b9b', background: 'none', border: 'none', borderBottom: '2px solid transparent', cursor: 'pointer', marginBottom: -1 },
  tabActive:   { color: '#242424', borderBottomColor: '#242424', fontWeight: 500 },
  aboutRow:    { display: 'flex', gap: 32, padding: '16px 0', borderBottom: '1px solid #f2f2f2', fontSize: 15 },
  aboutLabel:  { color: '#9b9b9b', minWidth: 80 },
};

const dr = {
  card:       { borderBottom: '1px solid #e6e6e6', padding: '24px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 24 },
  cardBody:   { flex: 1 },
  title:      { fontFamily: 'Lora, serif', fontSize: 20, fontWeight: 700, color: '#242424', marginBottom: 8, lineHeight: 1.3 },
  excerpt:    { fontSize: 15, color: '#6b6b6b', lineHeight: 1.6, marginBottom: 12 },
  meta:       { display: 'flex', alignItems: 'center', gap: 12 },
  date:       { fontSize: 13, color: '#9b9b9b' },
  tag:        { fontSize: 12, color: '#6b6b6b', background: '#f2f2f2', padding: '2px 10px', borderRadius: 999 },
  actions:    { display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0 },
  editBtn:    { padding: '7px 18px', background: '#242424', color: '#fff', border: 'none', borderRadius: 999, fontSize: 13, fontWeight: 500, cursor: 'pointer', textAlign: 'center' },
  publishBtn: { padding: '7px 18px', background: '#1a8917', color: '#fff', border: 'none', borderRadius: 999, fontSize: 13, fontWeight: 500, cursor: 'pointer', textAlign: 'center' },
  deleteBtn:  { padding: '7px 18px', background: '#fff', color: '#c00', border: '1px solid #ffd0d0', borderRadius: 999, fontSize: 13, cursor: 'pointer', textAlign: 'center' },
};

