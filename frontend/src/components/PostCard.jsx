// // import { Link } from 'react-router-dom';
// // import { useState } from 'react';
// // import { useAuth } from '../context/AuthContext';
// // import api, { API_URL } from '../api';

// // function timeAgo(date) {
// //   const d = new Date(date);
// //   const now = new Date();
// //   const diff = Math.floor((now - d) / 1000);
// //   if (diff < 60) return 'just now';
// //   if (diff < 3600) return `${Math.floor(diff/60)} min ago`;
// //   if (diff < 86400) return `${Math.floor(diff/3600)}h ago`;
// //   if (diff < 2592000) return `${Math.floor(diff/86400)}d ago`;
// //   return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
// // }

// // export default function PostCard({ post, size = 'md', showImage = true }) {
// //   const { user } = useAuth();
// //   const [bookmarked, setBookmarked] = useState(false);

// //   const handleBookmark = async (e) => {
// //     e.preventDefault();
// //     if (!user) return;
// //     try {
// //       const { data } = await api.post(`/posts/${post._id}/bookmark`);
// //       setBookmarked(data.bookmarked);
// //     } catch {}
// //   };

// //   const imgUrl = post.coverImage
// //     ? post.coverImage.startsWith('http') ? post.coverImage : `${API_URL}${post.coverImage}`
// //     : null;

// //   return (
// //     <article style={{ ...s.card, ...(size === 'lg' ? s.cardLg : {}) }} className="postcard">
// //       {/* ADDED: responsive styles */}
// //       <style>{postCardResponsiveCSS}</style>

// //       {/* Author row */}
// //       <div style={s.authorRow}>
// //         <Link to={`/profile/${post.author?._id}`} style={s.authorLink}>
// //           <div style={{ ...s.avatar, background: '#242424' }}>
// //             {post.author?.name?.[0]?.toUpperCase() || 'A'}
// //           </div>
// //           <span style={s.authorName}>{post.author?.name || 'Anonymous'}</span>
// //         </Link>
// //         <span style={s.dot}>·</span>
// //         <span style={s.date}>{timeAgo(post.createdAt)}</span>
// //       </div>

// //       {/* Content + image row */}
// //       <div style={{ ...s.body, flexDirection: size === 'lg' ? 'column' : 'row' }} className="postcard-body">
// //         <div style={s.textBlock} className="postcard-text">
// //           <Link to={`/post/${post._id}`}>
// //             <h2 style={{ ...s.title, fontSize: size === 'lg' ? 22 : 18 }} className="postcard-title">{post.title}</h2>
// //             {post.subtitle && <p style={s.subtitle} className="postcard-subtitle">{post.subtitle.slice(0, size === 'lg' ? 160 : 100)}{post.subtitle.length > 100 ? '...' : ''}</p>}
// //           </Link>
// //         </div>
// //         {showImage && imgUrl && (
// //           <Link to={`/post/${post._id}`} style={s.imgWrap} className="postcard-imgwrap">
// //             <img src={imgUrl} alt={post.title} style={s.img} className="postcard-img"
// //               onError={e => { e.target.style.display = 'none'; e.target.parentElement.style.visibility = 'hidden'; e.target.parentElement.style.width = '0'; e.target.parentElement.style.height = '0'; }} />
// //           </Link>
// //         )}
// //       </div>

// //       {/* Footer */}
// //       <div style={s.footer}>
// //         <div style={s.footerLeft}>
// //           {post.category && (
// //             <Link to={`/tag/${post.category.toLowerCase()}`} style={s.tag}>{post.category}</Link>
// //           )}
// //           <span style={s.readTime}>{post.readTime || 1} min read</span>
// //         </div>
// //         <div style={s.footerRight}>
// //           <span style={s.claps}>
// //             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b6b6b" strokeWidth="2"><path d="M14.5 10c-.83 0-1.5-.67-1.5-1.5v-5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5z"/><path d="M20.5 10H19V8.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/><path d="M9.5 14.5v-10c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v10"/><path d="M8.5 12.5H7V8.5C7 7.67 7.67 7 8.5 7S10 7.67 10 8.5"/><path d="M5 12.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v1.5"/><path d="M4.5 20.5c1.5 1.5 3.5 2.5 5.5 2.5h4c3.31 0 6-2.69 6-6V13"/></svg>
// //             {post.claps || 0}
// //           </span>
// //           {user && (
// //             <button onClick={handleBookmark} style={{ ...s.iconBtn, color: bookmarked ? '#242424' : '#9b9b9b' }}>
// //               <svg width="16" height="16" viewBox="0 0 24 24" fill={bookmarked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2"><path d="m19 21-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
// //             </button>
// //           )}
// //         </div>
// //       </div>
// //     </article>
// //   );
// // }

// // const s = {
// //   card:        { padding: '24px 0', borderBottom: '1px solid #f2f2f2' },
// //   cardLg:      { padding: '16px 0' },
// //   authorRow:   { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 },
// //   authorLink:  { display: 'flex', alignItems: 'center', gap: 8 },
// //   avatar:      { width: 24, height: 24, borderRadius: '50%', fontSize: 11, fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
// //   authorName:  { fontSize: 13, fontWeight: 500, color: '#242424' },
// //   dot:         { fontSize: 13, color: '#9b9b9b' },
// //   date:        { fontSize: 13, color: '#6b6b6b' },
// //   body:        { display: 'flex', gap: 24, marginBottom: 12, alignItems: 'flex-start' },
// //   textBlock:   { flex: 1, minWidth: 0 },
// //   title:       { fontFamily: 'Lora, serif', fontWeight: 700, color: '#242424', lineHeight: 1.3, marginBottom: 6 },
// //   subtitle:    { fontSize: 14, color: '#6b6b6b', lineHeight: 1.55, fontFamily: 'DM Sans, sans-serif' },
// //   imgWrap:     { flexShrink: 0 },
// //   img:         { width: '160px', height: '104px', objectFit: 'cover', borderRadius: 2, display: 'block' },
// //   footer:      { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
// //   footerLeft:  { display: 'flex', alignItems: 'center', gap: 12 },
// //   footerRight: { display: 'flex', alignItems: 'center', gap: 8 },
// //   tag:         { display: 'inline-block', padding: '4px 10px', borderRadius: 999, background: '#f2f2f2', fontSize: 12, fontWeight: 500, color: '#242424' },
// //   readTime:    { fontSize: 13, color: '#6b6b6b' },
// //   claps:       { display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: '#6b6b6b' },
// //   iconBtn:     { display: 'flex', alignItems: 'center', padding: 4, background: 'none', border: 'none', cursor: 'pointer', transition: 'color 0.15s' },
// // };

// // // ── ADDED: Responsive CSS only ──
// // const postCardResponsiveCSS = `
// //   @media (max-width: 768px) {
// //     .postcard {
// //       padding: 16px 0 !important;
// //     }
// //     .postcard-body {
// //       gap: 12px !important;
// //       margin-bottom: 10px !important;
// //     }
// //     .postcard-title {
// //       font-size: 16px !important;
// //       margin-bottom: 4px !important;
// //     }
// //     .postcard-subtitle {
// //       font-size: 13px !important;
// //       /* hide subtitle on mobile to save space like Medium */
// //       display: none !important;
// //     }
// //     .postcard-imgwrap {
// //       flex-shrink: 0 !important;
// //     }
// //     .postcard-img {
// //       width: 112px !important;
// //   height: 80px !important;
// //   border-radius: 4px !important;
// //   object-fit: cover !important;
// //   display: block !important;
// //   flex-shrink: 0 !important;
// //     }
// //   }

// //   .postcard-img {
// //   width: 96px !important;
// //   height: 72px !important;
// //   object-fit: cover !important;
// //   display: block !important;
// // }
// // `;

// import { Link } from 'react-router-dom';
// import { useState } from 'react';
// import { useAuth } from '../context/AuthContext';
// import api, { API_URL } from '../api';

// function timeAgo(date) {
//   const d = new Date(date);
//   const now = new Date();
//   const diff = Math.floor((now - d) / 1000);
//   if (diff < 60) return 'just now';
//   if (diff < 3600) return `${Math.floor(diff/60)} min ago`;
//   if (diff < 86400) return `${Math.floor(diff/3600)}h ago`;
//   if (diff < 2592000) return `${Math.floor(diff/86400)}d ago`;
//   return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
// }

// export default function PostCard({ post, size = 'md', showImage = true }) {
//   const { user } = useAuth();
//   const [bookmarked, setBookmarked] = useState(false);

//   const handleBookmark = async (e) => {
//     e.preventDefault();
//     if (!user) return;
//     try {
//       const { data } = await api.post(`/posts/${post._id}/bookmark`);
//       setBookmarked(data.bookmarked);
//     } catch {}
//   };

//   const imgUrl = post.coverImage
//     ? post.coverImage.startsWith('http') ? post.coverImage : `${API_URL}${post.coverImage}`
//     : null;

//   return (
//     <article style={{ ...s.card, ...(size === 'lg' ? s.cardLg : {}) }} className="postcard">
//       <style>{postCardResponsiveCSS}</style>

//       <div style={s.authorRow}>
//         <Link to={`/profile/${post.author?._id}`} style={s.authorLink}>
//           <div style={{ ...s.avatar, background: '#242424' }}>
//             {post.author?.name?.[0]?.toUpperCase() || 'A'}
//           </div>
//           <span style={s.authorName}>{post.author?.name || 'Anonymous'}</span>
//         </Link>
//         <span style={s.dot}>·</span>
//         <span style={s.date}>{timeAgo(post.createdAt)}</span>
//       </div>

//       <div style={{ ...s.body, flexDirection: size === 'lg' ? 'column' : 'row' }} className="postcard-body">
//         <div style={s.textBlock} className="postcard-text">
//           <Link to={`/post/${post._id}`}>
//             <h2 style={{ ...s.title, fontSize: size === 'lg' ? 22 : 18 }} className="postcard-title">{post.title}</h2>
//             {post.subtitle && <p style={s.subtitle} className="postcard-subtitle">{post.subtitle.slice(0, size === 'lg' ? 160 : 100)}{post.subtitle.length > 100 ? '...' : ''}</p>}
//           </Link>
//         </div>
//         {showImage && imgUrl && (
//           <Link to={`/post/${post._id}`} style={s.imgWrap} className="postcard-imgwrap">
//             <img src={imgUrl} alt={post.title} style={s.img} className="postcard-img"
//               onError={e => { e.target.style.display = 'none'; e.target.parentElement.style.visibility = 'hidden'; e.target.parentElement.style.width = '0'; e.target.parentElement.style.height = '0'; }} />
//           </Link>
//         )}
//       </div>

//       <div style={s.footer}>
//         <div style={s.footerLeft}>
//           {post.category && (
//             <Link to={`/tag/${post.category.toLowerCase()}`} style={s.tag}>{post.category}</Link>
//           )}
//           <span style={s.readTime}>{post.readTime || 1} min read</span>
//         </div>
//         <div style={s.footerRight}>
//           <span style={s.claps}>
//             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b6b6b" strokeWidth="2"><path d="M14.5 10c-.83 0-1.5-.67-1.5-1.5v-5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5z"/><path d="M20.5 10H19V8.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/><path d="M9.5 14.5v-10c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v10"/><path d="M8.5 12.5H7V8.5C7 7.67 7.67 7 8.5 7S10 7.67 10 8.5"/><path d="M5 12.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v1.5"/><path d="M4.5 20.5c1.5 1.5 3.5 2.5 5.5 2.5h4c3.31 0 6-2.69 6-6V13"/></svg>
//             {post.claps || 0}
//           </span>
//           {user && (
//             <button onClick={handleBookmark} style={{ ...s.iconBtn, color: bookmarked ? '#242424' : '#9b9b9b' }}>
//               <svg width="16" height="16" viewBox="0 0 24 24" fill={bookmarked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2"><path d="m19 21-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
//             </button>
//           )}
//         </div>
//       </div>
//     </article>
//   );
// }

// const s = {
//   card:        { padding: '24px 0', borderBottom: '1px solid #f2f2f2' },
//   cardLg:      { padding: '16px 0' },
//   authorRow:   { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 },
//   authorLink:  { display: 'flex', alignItems: 'center', gap: 8 },
//   avatar:      { width: 24, height: 24, borderRadius: '50%', fontSize: 11, fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
//   authorName:  { fontSize: 13, fontWeight: 500, color: '#242424' },
//   dot:         { fontSize: 13, color: '#9b9b9b' },
//   date:        { fontSize: 13, color: '#6b6b6b' },
//   body:        { display: 'flex', gap: 24, marginBottom: 12, alignItems: 'flex-start' },
//   textBlock:   { flex: 1, minWidth: 0 },
//   title:       { fontFamily: 'Lora, serif', fontWeight: 700, color: '#242424', lineHeight: 1.3, marginBottom: 6 },
//   subtitle:    { fontSize: 14, color: '#6b6b6b', lineHeight: 1.55, fontFamily: 'DM Sans, sans-serif' },
//   imgWrap:     { flexShrink: 0 },
//   img:         { width: '160px', height: '104px', objectFit: 'cover', borderRadius: 2, display: 'block' },
//   footer:      { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
//   footerLeft:  { display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' },
//   footerRight: { display: 'flex', alignItems: 'center', gap: 8 },
//   tag:         { display: 'inline-block', padding: '4px 10px', borderRadius: 999, background: '#f2f2f2', fontSize: 12, fontWeight: 500, color: '#242424' },
//   readTime:    { fontSize: 13, color: '#6b6b6b' },
//   claps:       { display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: '#6b6b6b' },
//   iconBtn:     { display: 'flex', alignItems: 'center', padding: 4, background: 'none', border: 'none', cursor: 'pointer', transition: 'color 0.15s' },
// };

// const postCardResponsiveCSS = `
//   .postcard-imgwrap { flex-shrink: 0; }
//   .postcard-img { width: 160px; height: 104px; object-fit: cover; display: block; }

//   @media (max-width: 768px) {
//     .postcard { padding: 16px 0 !important; }
//     .postcard-body { gap: 12px !important; margin-bottom: 10px !important; }
//     .postcard-title { font-size: 16px !important; margin-bottom: 4px !important; }
//     .postcard-subtitle { font-size: 13px !important; }
//     .postcard-img { width: 96px !important; height: 72px !important; border-radius: 4px !important; }
//   }

//   @media (max-width: 480px) {
//     .postcard-img { width: 80px !important; height: 60px !important; }
//   }
// `;
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api, { API_URL } from '../api';

function timeAgo(date) {
  const d = new Date(date);
  const now = new Date();
  const diff = Math.floor((now - d) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff/60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff/3600)}h ago`;
  if (diff < 2592000) return `${Math.floor(diff/86400)}d ago`;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function PostCard({ post, size = 'md', showImage = true }) {
  const { user } = useAuth();
  const [bookmarked, setBookmarked] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.claps || 0);

  const handleBookmark = async (e) => {
    e.preventDefault();
    if (!user) return;
    try {
      const { data } = await api.post(`/posts/${post._id}/bookmark`);
      setBookmarked(data.bookmarked);
    } catch {}
  };

  const handleLike = async (e) => {
    e.preventDefault();
    if (!user) return;
    try {
      const { data } = await api.post(`/posts/${post._id}/clap`);
      setLiked(data.clapped);
      setLikeCount(data.claps);
    } catch {}
  };

  const imgUrl = post.coverImage
    ? post.coverImage.startsWith('http') ? post.coverImage : `${API_URL}${post.coverImage}`
    : null;

  return (
    <article style={{ ...s.card, ...(size === 'lg' ? s.cardLg : {}) }} className="postcard">
      <style>{postCardResponsiveCSS}</style>

      <div style={s.authorRow}>
        <Link to={`/profile/${post.author?._id}`} style={s.authorLink}>
          <div style={{ ...s.avatar, background: '#242424' }}>
            {post.author?.name?.[0]?.toUpperCase() || 'A'}
          </div>
          <span style={s.authorName}>{post.author?.name || 'Anonymous'}</span>
        </Link>
        <span style={s.dot}>·</span>
        <span style={s.date}>{timeAgo(post.createdAt)}</span>
      </div>

      <div style={{ ...s.body, flexDirection: size === 'lg' ? 'column' : 'row' }} className="postcard-body">
        <div style={s.textBlock} className="postcard-text">
          <Link to={`/post/${post._id}`}>
            <h2 style={{ ...s.title, fontSize: size === 'lg' ? 22 : 18 }} className="postcard-title">{post.title}</h2>
            {post.subtitle && <p style={s.subtitle} className="postcard-subtitle">{post.subtitle.slice(0, size === 'lg' ? 160 : 100)}{post.subtitle.length > 100 ? '...' : ''}</p>}
          </Link>
        </div>
        {showImage && imgUrl && (
          <Link to={`/post/${post._id}`} style={s.imgWrap} className="postcard-imgwrap">
            <img src={imgUrl} alt={post.title} style={s.img} className="postcard-img"
              onError={e => { e.target.style.display = 'none'; e.target.parentElement.style.visibility = 'hidden'; e.target.parentElement.style.width = '0'; e.target.parentElement.style.height = '0'; }} />
          </Link>
        )}
      </div>

      <div style={s.footer}>
        <div style={s.footerLeft}>
          {post.category && (
            <Link to={`/tag/${post.category.toLowerCase()}`} style={s.tag}>{post.category}</Link>
          )}
          <span style={s.readTime}>{post.readTime || 1} min read</span>
        </div>
        <div style={s.footerRight}>
          <button onClick={handleLike} style={{ ...s.iconBtn, color: liked ? '#e30d10' : '#9b9b9b' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill={liked ? '#e30d10' : 'none'} stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            <span style={{ fontSize: 13, marginLeft: 4 }}>{likeCount}</span>
          </button>
          <Link to={`/post/${post._id}`} style={{ ...s.iconBtn, color: '#9b9b9b', textDecoration: 'none' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
          </Link>
          {user && (
            <button onClick={handleBookmark} style={{ ...s.iconBtn, color: bookmarked ? '#242424' : '#9b9b9b' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill={bookmarked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2"><path d="m19 21-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

const s = {
  card:        { padding: '24px 0', borderBottom: '1px solid #f2f2f2' },
  cardLg:      { padding: '16px 0' },
  authorRow:   { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 },
  authorLink:  { display: 'flex', alignItems: 'center', gap: 8 },
  avatar:      { width: 24, height: 24, borderRadius: '50%', fontSize: 11, fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  authorName:  { fontSize: 13, fontWeight: 500, color: '#242424' },
  dot:         { fontSize: 13, color: '#9b9b9b' },
  date:        { fontSize: 13, color: '#6b6b6b' },
  body:        { display: 'flex', gap: 24, marginBottom: 12, alignItems: 'flex-start' },
  textBlock:   { flex: 1, minWidth: 0 },
  title:       { fontFamily: 'Lora, serif', fontWeight: 700, color: '#242424', lineHeight: 1.3, marginBottom: 6 },
  subtitle:    { fontSize: 14, color: '#6b6b6b', lineHeight: 1.55, fontFamily: 'DM Sans, sans-serif' },
  imgWrap:     { flexShrink: 0 },
  img:         { width: '160px', height: '104px', objectFit: 'cover', borderRadius: 2, display: 'block' },
  footer:      { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  footerLeft:  { display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' },
  footerRight: { display: 'flex', alignItems: 'center', gap: 8 },
  tag:         { display: 'inline-block', padding: '4px 10px', borderRadius: 999, background: '#f2f2f2', fontSize: 12, fontWeight: 500, color: '#242424' },
  readTime:    { fontSize: 13, color: '#6b6b6b' },
  claps:       { display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: '#6b6b6b' },
  iconBtn:     { display: 'flex', alignItems: 'center', padding: 4, background: 'none', border: 'none', cursor: 'pointer', transition: 'color 0.15s' },
};

const postCardResponsiveCSS = `
  .postcard-imgwrap { flex-shrink: 0; }
  .postcard-img { width: 160px; height: 104px; object-fit: cover; display: block; }

  @media (max-width: 768px) {
    .postcard { padding: 16px 0 !important; }
    .postcard-body { gap: 12px !important; margin-bottom: 10px !important; }
    .postcard-title { font-size: 16px !important; margin-bottom: 4px !important; }
    .postcard-subtitle { font-size: 13px !important; }
    .postcard-img { width: 96px !important; height: 72px !important; border-radius: 4px !important; }
  }

  @media (max-width: 480px) {
    .postcard-img { width: 80px !important; height: 60px !important; }
  }
`;