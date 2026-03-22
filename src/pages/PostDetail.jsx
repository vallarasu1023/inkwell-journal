import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api, { API_URL } from '../api';

function timeAgo(d) {
  const date = new Date(d);
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

const postDetailResponsiveCSS = `
  *,*::before,*::after { box-sizing: border-box; }
  html, body { overflow-x: hidden; }
  img { max-width: 100%; }

  @media (max-width: 768px) {
    .post-container   { padding: 24px 16px 80px !important; max-width: 100% !important; overflow-x: hidden !important; }
    .post-para        { font-size: 17px !important; line-height: 1.75 !important; margin-bottom: 20px !important; word-break: break-word !important; }
    .post-author-meta { font-size: 12px !important; }
    .post-author-bio  { flex-direction: column !important; gap: 12px !important; }
  }
  @media (max-width: 480px) {
    .post-container   { padding: 20px 12px 80px !important; }
    .post-author-card { flex-wrap: wrap !important; }
  }
`;

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [claps, setClaps] = useState(0);
  const [clapped, setClapped] = useState(false);
  const [clapAnim, setClapAnim] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(true);
  const [progress, setProgress] = useState(0);
  const contentRef = useRef();
  const commentsRef = useRef();

  useEffect(() => {
    setLoading(true);
    api.get(`/posts/${id}`).then(r => {
      setPost(r.data);
      setClaps(r.data.claps || 0);
    }).catch(() => navigate('/404')).finally(() => setLoading(false));
    api.get(`/comments/${id}`).then(r => setComments(r.data)).catch(() => {});
  }, [id, navigate]);

  useEffect(() => {
    const handler = () => {
      const el = contentRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = el.scrollHeight;
      const scrolled = -rect.top + window.innerHeight;
      setProgress(Math.min(100, Math.max(0, (scrolled / total) * 100)));
    };
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, [post]);

  const handleClap = async () => {
    if (!user) return navigate('/signin');
    setClapAnim(true);
    setTimeout(() => setClapAnim(false), 600);
    try {
      const { data } = await api.post(`/posts/${id}/clap`);
      setClaps(data.claps);
      setClapped(data.clapped);
    } catch {}
  };

  const handleBookmark = async () => {
    if (!user) return navigate('/signin');
    try {
      const { data } = await api.post(`/posts/${id}/bookmark`);
      setBookmarked(data.bookmarked);
    } catch {}
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    try {
      const { data } = await api.post(`/comments/${id}`, { content: commentText });
      setComments(prev => [data, ...prev]);
      setCommentText('');
    } catch {}
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return;
    try {
      await api.delete(`/comments/${commentId}`);
      setComments(prev => prev.filter(c => c._id !== commentId));
    } catch {}
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this story?')) return;
    try {
      await api.delete(`/posts/${id}`);
      navigate('/');
    } catch (e) { alert('Delete failed'); }
  };

  const scrollToComments = () => {
    setShowComments(true);
    setTimeout(() => commentsRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  if (loading) return (
    <div className="content-container" style={{ paddingTop: 60 }}>
      <div className="skeleton" style={{ height: 44, width: '80%', marginBottom: 20 }} />
      <div className="skeleton" style={{ height: 20, width: '40%', marginBottom: 40 }} />
      <div className="skeleton" style={{ height: 400, marginBottom: 32 }} />
      {[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height: 18, marginBottom: 12, width: `${90 - i*8}%` }} />)}
    </div>
  );
  if (!post) return null;

  const imgUrl = post.coverImage
    ? post.coverImage.startsWith('http') ? post.coverImage : `${API_URL}${post.coverImage}`
    : null;
  const isOwner = user?.id === post.author?._id;

  return (
    <div>
      <style>{postDetailResponsiveCSS}</style>

      <div style={{ position: 'fixed', top: 57, left: 0, right: 0, zIndex: 100, height: 2, background: '#f2f2f2' }}>
        <div style={{ height: '100%', background: '#1a8917', width: `${progress}%`, transition: 'width 0.1s' }} />
      </div>

      <div ref={contentRef} className="content-container post-container" style={{ paddingTop: 48, paddingBottom: 80 }}>
        {post.category && (
          <Link to={`/tag/${post.category.toLowerCase()}`} style={s.category}>{post.category}</Link>
        )}

        <h1 style={s.title}>{post.title}</h1>
        {post.subtitle && <p style={s.subtitle}>{post.subtitle}</p>}

        <div style={s.authorCard} className="post-author-card">
          <Link to={`/profile/${post.author?._id}`}>
            <div style={s.authorAvatar}>{post.author?.name?.[0]?.toUpperCase()}</div>
          </Link>
          <div>
            <div style={s.authorName}>
              <Link to={`/profile/${post.author?._id}`} style={{ fontWeight: 600, color: '#242424' }}>
                {post.author?.name}
              </Link>
              {user && user.id !== post.author?._id && (
                <button style={s.followInline}>· Follow</button>
              )}
            </div>
            <div style={s.authorMeta} className="post-author-meta">
              {post.readTime} min read · {timeAgo(post.createdAt)} · {post.views} views
            </div>
          </div>
          {isOwner && (
            <button onClick={handleDelete} style={s.deleteBtn}>Delete</button>
          )}
        </div>

        <div style={s.actionBarTop}>
          <div style={s.dividerLine} />
          <div style={s.actionRow}>
            <div style={s.actionLeft}>
              <button onClick={handleClap} style={{ ...s.clapBtn, color: clapped ? '#e30d10' : '#6b6b6b' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill={clapped ? '#e30d10' : 'none'} stroke="currentColor" strokeWidth="1.5">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
                <span style={{ fontSize: 14 }}>{claps}</span>
              </button>
              <button onClick={scrollToComments} style={s.commentBtn}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b6b6b" strokeWidth="1.5">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
                <span style={{ fontSize: 14 }}>{comments.length}</span>
              </button>
            </div>
            <div style={s.actionRight}>
              <button onClick={handleBookmark} style={s.iconAction}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill={bookmarked ? '#242424' : 'none'} stroke="#6b6b6b" strokeWidth="1.5"><path d="m19 21-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
              </button>
            </div>
          </div>
          <div style={s.dividerLine} />
        </div>

        {imgUrl && (
          <div style={s.coverWrap}>
            <img src={imgUrl} alt={post.title} style={s.coverImg}
              onError={e => { e.target.parentElement.style.display = 'none'; }} />
          </div>
        )}

        <div style={s.content}>
          {post.content?.split('\n')
            .filter(para => !para.trim().startsWith('Source:') && !para.trim().startsWith('http'))
            .map((para, i) =>
              para.trim() ? <p key={i} style={s.para} className="post-para">{para}</p> : <br key={i} />
            )}
        </div>

        {post.tags?.length > 0 && (
          <div style={s.tagsRow}>
            {post.tags.map(tag => (
              <Link key={tag} to={`/tag/${tag.toLowerCase()}`} className="tag">{tag}</Link>
            ))}
          </div>
        )}

        <div style={s.bottomBar}>
          <button onClick={handleClap} style={{ ...s.clapBtnLg, color: clapped ? '#e30d10' : '#6b6b6b' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill={clapped ? '#e30d10' : 'none'} stroke="currentColor" strokeWidth="1.5">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            <span style={{ fontSize: 15 }}>{claps}</span>
          </button>
        </div>

        <div style={s.authorBio} className="post-author-bio">
          <div style={s.authorBigAvatar}>{post.author?.name?.[0]?.toUpperCase()}</div>
          <div style={s.authorBioText}>
            <div style={s.authorBioName}>Written by {post.author?.name}</div>
            <div style={s.authorBioFollowers}>{post.author?.followers?.length || 0} Followers</div>
            {post.author?.bio && <p style={s.authorBioDesc}>{post.author.bio}</p>}
            {user && user.id !== post.author?._id && (
              <button style={s.followBtn}>Follow</button>
            )}
          </div>
        </div>

        {showComments && (
          <div ref={commentsRef} style={s.commentsSection}>
            <h3 style={s.commentsTitle}>Responses ({comments.length})</h3>
            {user && (
              <form onSubmit={handleComment} style={s.commentForm}>
                <div style={s.commentAvatar}>{user.name?.[0]?.toUpperCase()}</div>
                <div style={{ flex: 1 }}>
                  <textarea style={s.commentTextarea} placeholder="What are your thoughts?"
                    value={commentText} onChange={e => setCommentText(e.target.value)} rows={3} />
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 8 }}>
                    <button type="button" style={s.cancelBtn} onClick={() => setCommentText('')}>Cancel</button>
                    <button type="submit" style={s.submitCommentBtn}>Respond</button>
                  </div>
                </div>
              </form>
            )}
            {comments.map(c => (
              <div key={c._id} style={s.comment}>
                <div style={s.commentAuthorAvatar}>{c.author?.name?.[0]?.toUpperCase()}</div>
                <div style={{ flex: 1 }}>
                  <div style={s.commentAuthorRow}>
                    <span style={s.commentAuthorName}>{c.author?.name}</span>
                    <span style={s.commentDate}>{timeAgo(c.createdAt)}</span>
                    {user && user.id === c.author?._id && (
                      <button
                        onClick={() => handleDeleteComment(c._id)}
                        style={{ marginLeft: 'auto', fontSize: 12, color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer', padding: '2px 8px' }}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                  <p style={s.commentContent}>{c.content}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={s.stickyBar}>
        <div style={s.stickyInner}>
          <button onClick={handleClap} style={{ ...s.stickyClap, color: clapped ? '#e30d10' : '#6b6b6b' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill={clapped ? '#e30d10' : 'none'} stroke="currentColor" strokeWidth="1.5">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            {claps}
          </button>
          <button onClick={scrollToComments} style={s.stickyComment}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            {comments.length}
          </button>
        </div>
      </div>
    </div>
  );
}

const s = {
  category:            { display: 'inline-block', fontSize: 13, fontWeight: 600, color: '#1a8917', marginBottom: 20, letterSpacing: '0.04em', textTransform: 'uppercase' },
  title:               { fontFamily: 'Lora, serif', fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 700, color: '#242424', lineHeight: 1.2, letterSpacing: '-0.02em', marginBottom: 16 },
  subtitle:            { fontSize: 22, color: '#6b6b6b', lineHeight: 1.5, fontFamily: 'Lora, serif', fontStyle: 'italic', marginBottom: 32 },
  authorCard:          { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, position: 'relative' },
  authorAvatar:        { width: 44, height: 44, borderRadius: '50%', background: '#242424', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, flexShrink: 0 },
  authorName:          { fontSize: 15, color: '#242424', marginBottom: 3, display: 'flex', alignItems: 'center', gap: 4 },
  authorMeta:          { fontSize: 13, color: '#6b6b6b' },
  followInline:        { fontSize: 14, color: '#1a8917', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer' },
  deleteBtn:           { marginLeft: 'auto', fontSize: 13, color: '#dc2626', background: 'none', border: '1px solid #fecaca', borderRadius: 4, padding: '4px 12px', cursor: 'pointer' },
  actionBarTop:        { marginBottom: 32 },
  dividerLine:         { height: 1, background: '#e6e6e6', margin: '16px 0' },
  actionRow:           { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  actionLeft:          { display: 'flex', gap: 20, alignItems: 'center' },
  actionRight:         { display: 'flex', gap: 12, alignItems: 'center' },
  clapBtn:             { display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0', transition: 'color 0.2s ease' },
  commentBtn:          { display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0', color: '#6b6b6b' },
  iconAction:          { display: 'flex', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', padding: 4 },
  coverWrap:           { marginBottom: 40, borderRadius: 2, overflow: 'hidden' },
  coverImg:            { width: '100%', maxHeight: 500, objectFit: 'cover' },
  content:             { marginBottom: 40 },
  para:                { fontFamily: 'Lora, serif', fontSize: 20, lineHeight: 1.85, color: '#242424', marginBottom: 28 },
  tagsRow:             { display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 48 },
  bottomBar:           { display: 'flex', justifyContent: 'center', padding: '32px 0', borderTop: '1px solid #e6e6e6', borderBottom: '1px solid #e6e6e6', marginBottom: 48 },
  clapBtnLg:           { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, background: 'none', border: 'none', cursor: 'pointer', transition: 'color 0.2s ease' },
  authorBio:           { display: 'flex', gap: 20, padding: '32px 0', borderBottom: '1px solid #e6e6e6', marginBottom: 40 },
  authorBigAvatar:     { width: 64, height: 64, borderRadius: '50%', background: '#242424', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, fontWeight: 700, flexShrink: 0 },
  authorBioText:       { flex: 1 },
  authorBioName:       { fontFamily: 'Lora, serif', fontSize: 20, fontWeight: 700, color: '#242424', marginBottom: 4 },
  authorBioFollowers:  { fontSize: 13, color: '#9b9b9b', marginBottom: 8 },
  authorBioDesc:       { fontSize: 15, color: '#6b6b6b', lineHeight: 1.6, marginBottom: 16 },
  followBtn:           { padding: '8px 20px', background: '#1a8917', color: '#fff', border: 'none', borderRadius: 999, fontSize: 14, fontWeight: 500, cursor: 'pointer' },
  commentsSection:     { marginTop: 40 },
  commentsTitle:       { fontFamily: 'Lora, serif', fontSize: 22, fontWeight: 700, marginBottom: 24 },
  commentForm:         { display: 'flex', gap: 12, marginBottom: 32, alignItems: 'flex-start' },
  commentAvatar:       { width: 36, height: 36, borderRadius: '50%', background: '#242424', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, flexShrink: 0 },
  commentTextarea:     { width: '100%', padding: '12px', border: '1px solid #e6e6e6', borderRadius: 4, fontSize: 15, outline: 'none', resize: 'vertical', fontFamily: 'DM Sans, sans-serif', color: '#242424' },
  cancelBtn:           { padding: '8px 16px', background: 'none', border: 'none', fontSize: 14, color: '#6b6b6b', cursor: 'pointer' },
  submitCommentBtn:    { padding: '8px 20px', background: '#1a8917', color: '#fff', border: 'none', borderRadius: 999, fontSize: 14, fontWeight: 500, cursor: 'pointer' },
  comment:             { display: 'flex', gap: 12, marginBottom: 28, alignItems: 'flex-start' },
  commentAuthorAvatar: { width: 32, height: 32, borderRadius: '50%', background: '#242424', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, flexShrink: 0 },
  commentAuthorRow:    { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, width: '100%' },
  commentAuthorName:   { fontSize: 14, fontWeight: 600, color: '#242424' },
  commentDate:         { fontSize: 12, color: '#9b9b9b' },
  commentContent:      { fontSize: 15, color: '#242424', lineHeight: 1.6 },
  stickyBar:           { position: 'fixed', bottom: 0, left: 0, right: 0, background: '#fff', borderTop: '1px solid #e6e6e6', padding: '12px 0', zIndex: 100 },
  stickyInner:         { maxWidth: 728, margin: '0 auto', padding: '0 24px', display: 'flex', gap: 16, alignItems: 'center' },
  stickyClap:          { display: 'flex', alignItems: 'center', gap: 6, padding: '8px 18px', borderRadius: 999, border: 'none', background: 'none', fontSize: 14, cursor: 'pointer', fontWeight: 500, transition: 'all 0.2s ease' },
  stickyComment:       { display: 'flex', alignItems: 'center', gap: 6, padding: '8px 18px', borderRadius: 999, border: 'none', background: 'none', fontSize: 14, cursor: 'pointer', color: '#242424', fontWeight: 500 },
};