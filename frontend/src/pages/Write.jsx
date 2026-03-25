import { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api';

const CATEGORIES = ['Technology','Programming','Design','Science','Business','Travel','Health','Culture','General'];

export default function Write() {
  const navigate = useNavigate();
  const { draftId } = useParams();
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [category, setCategory] = useState('General');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [publishing, setPublishing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');
  const [error, setError] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [savedDraftId, setSavedDraftId] = useState(draftId || null);
  const fileRef = useRef();

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  useEffect(() => {
    if (draftId) {
      api.get(`/posts/${draftId}`).then(r => {
        setTitle(r.data.title || '');
        setSubtitle(r.data.subtitle || '');
        setContent(r.data.content || '');
        setCategory(r.data.category || 'General');
        setTags(r.data.tags || []);
        if (r.data.coverImage) setPreview(r.data.coverImage);
      }).catch(() => {});
    }
  }, [draftId]);

  useEffect(() => {
    if (!title && !content) return;
    const timer = setInterval(() => handleSaveDraft(true), 30000);
    return () => clearInterval(timer);
  }, [title, content, subtitle, category, tags]);

  const addTag = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
      e.preventDefault();
      if (tags.length < 5) setTags(prev => [...new Set([...prev, tagInput.trim()])]);
      setTagInput('');
    }
  };

  const handleFile = (file) => {
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSaveDraft = async (auto = false) => {
    if (!title.trim() && !content.trim()) return;
    setSaving(true);
    setSaveStatus('Saving...');
    try {
      const fd = new FormData();
      fd.append('title', title);
      fd.append('subtitle', subtitle);
      fd.append('content', content);
      fd.append('tags', JSON.stringify(tags));
      fd.append('category', category);
      fd.append('isDraft', 'true');
      if (image) fd.append('coverImage', image);

      let data;
      if (savedDraftId) {
        const res = await api.put(`/posts/${savedDraftId}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        data = res.data;
      } else {
        const res = await api.post('/posts', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        data = res.data;
        setSavedDraftId(data._id);
      }
      const now = new Date();
      setSaveStatus(`Draft saved ${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`);
    } catch {
      setSaveStatus('Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!title.trim()) return setError('Title is required');
    if (!content.trim()) return setError('Story content is required');
    setError(''); setPublishing(true);
    try {
      const fd = new FormData();
      fd.append('title', title);
      fd.append('subtitle', subtitle);
      fd.append('content', content);
      fd.append('tags', JSON.stringify(tags));
      fd.append('category', category);
      fd.append('isDraft', 'false');
      if (image) fd.append('coverImage', image);

      let data;
      if (savedDraftId) {
        const res = await api.put(`/posts/${savedDraftId}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        data = res.data;
      } else {
        const res = await api.post('/posts', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        data = res.data;
      }
      navigate(`/post/${data._id}`);
    } catch (e) {
      setError(e.response?.data?.message || 'Publish failed. Try again.');
    } finally { setPublishing(false); }
  };

  return (
    <div style={s.page}>
      <style>{writeResponsiveCSS}</style>

      <div style={s.topBar} className="write-topbar">
        <div style={s.topLeft} className="write-topleft">
          <div style={s.draftBadge}>Draft</div>
          {wordCount > 0 && <span style={s.wordCount} className="write-wordcount">{wordCount} words · {readTime} min read</span>}
          {saveStatus && <span style={s.saveStatus}>{saveStatus}</span>}
        </div>
        <div style={s.topRight}>
          {error && <span style={s.errorInline} className="write-error-hide">{error}</span>}
          <button onClick={() => handleSaveDraft(false)} disabled={saving} style={s.saveDraftBtn} className="write-savedraft-hide">
            {saving ? 'Saving...' : 'Save Draft'}
          </button>
          <button onClick={() => setShowSettings(v => !v)} style={s.settingsBtn} className="write-settings-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
            <span className="write-settings-label">Story settings</span>
          </button>
          <button onClick={handlePublish} disabled={publishing} style={s.publishBtn}>
            {publishing ? 'Publishing...' : 'Publish'}
          </button>
        </div>
      </div>

      <div style={s.editorLayout} className="write-layout">
        <div style={s.editor} className="write-editor">
          {preview ? (
            <div style={s.previewWrap}>
              <img src={preview} alt="cover" style={s.previewImg} />
              <button style={s.removeImg} onClick={() => { setImage(null); setPreview(null); }}>✕ Remove</button>
            </div>
          ) : (
            <button style={s.addImgBtn} onClick={() => fileRef.current.click()}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9b9b9b" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
              Add a cover image
            </button>
          )}
          <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }}
            onChange={e => handleFile(e.target.files[0])} />

          <textarea style={s.titleInput} className="write-title-input" placeholder="Title" value={title}
            onChange={e => setTitle(e.target.value)} rows={2} maxLength={150} />

          <textarea style={s.subtitleInput} className="write-subtitle-input" placeholder="Write a subtitle (optional)" value={subtitle}
            onChange={e => setSubtitle(e.target.value)} rows={2} />

          <div style={s.divider} />

          <textarea style={s.contentInput} className="write-content-input" placeholder="Tell your story..." value={content}
            onChange={e => setContent(e.target.value)} rows={24} />
        </div>

        {showSettings && (
          <>
            <div className="write-mob-overlay" onClick={() => setShowSettings(false)} />
            <div style={s.settingsPanel} className="write-settings-panel">
              <div className="write-sheet-handle" />
              <button className="write-settings-close" onClick={() => setShowSettings(false)}>✕</button>
              <h3 style={s.settingsTitle}>Story settings</h3>

              <div style={s.settingsField}>
                <label style={s.settingsLabel}>Category</label>
                <select style={s.select} value={category} onChange={e => setCategory(e.target.value)}>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>

              <div style={s.settingsField}>
                <label style={s.settingsLabel}>Tags (up to 5)</label>
                <input style={s.tagInput} placeholder="Add a tag, press Enter"
                  value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={addTag} />
                <div style={s.tagList}>
                  {tags.map(t => (
                    <span key={t} className="tag">
                      {t}
                      <button onClick={() => setTags(prev => prev.filter(x => x !== t))} style={s.removeTag}>✕</button>
                    </span>
                  ))}
                </div>
              </div>

              <div style={s.settingsField}>
                <label style={s.settingsLabel}>Story stats</label>
                <div style={s.statRow}><span>Words</span><strong>{wordCount}</strong></div>
                <div style={s.statRow}><span>Read time</span><strong>{readTime} min</strong></div>
                <div style={s.statRow}><span>Status</span><strong>{savedDraftId ? 'Draft' : 'New'}</strong></div>
              </div>

              <button onClick={() => handleSaveDraft(false)} disabled={saving} style={s.saveDraftBtnFull}>
                {saving ? 'Saving...' : 'Save as Draft'}
              </button>
              <button onClick={handlePublish} disabled={publishing} style={s.publishBtnFull}>
                {publishing ? 'Publishing...' : 'Publish story'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const s = {
  page:            { minHeight: '100vh', background: '#fff' },
  topBar:          { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 24px', height: 56, borderBottom: '1px solid #f2f2f2', position: 'sticky', top: 57, background: '#fff', zIndex: 50, boxSizing: 'border-box', width: '100%' },
  topLeft:         { display: 'flex', alignItems: 'center', gap: 12, minWidth: 0, flexShrink: 1 },
  draftBadge:      { fontSize: 13, color: '#9b9b9b', fontWeight: 500, flexShrink: 0 },
  wordCount:       { fontSize: 13, color: '#9b9b9b', whiteSpace: 'nowrap' },
  saveStatus:      { fontSize: 13, color: '#1a8917', fontWeight: 500, whiteSpace: 'nowrap' },
  topRight:        { display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 },
  errorInline:     { fontSize: 13, color: '#c00' },
  saveDraftBtn:    { padding: '7px 16px', background: '#fff', color: '#6b6b6b', border: '1px solid #e6e6e6', borderRadius: 999, fontSize: 13, fontWeight: 500, cursor: 'pointer', whiteSpace: 'nowrap' },
  settingsBtn:     { display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#6b6b6b', padding: '6px 12px', border: '1px solid #e6e6e6', borderRadius: 999, background: 'none', cursor: 'pointer', whiteSpace: 'nowrap' },
  publishBtn:      { padding: '8px 20px', background: '#1a8917', color: '#fff', border: 'none', borderRadius: 999, fontSize: 14, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' },
  editorLayout:    { display: 'flex', maxWidth: 1192, margin: '0 auto', boxSizing: 'border-box', width: '100%' },
  editor:          { flex: 1, padding: '48px 80px 120px', minWidth: 0, boxSizing: 'border-box' },
  previewWrap:     { position: 'relative', marginBottom: 32 },
  previewImg:      { width: '100%', maxHeight: 400, objectFit: 'cover', borderRadius: 2 },
  removeImg:       { position: 'absolute', top: 12, right: 12, background: 'rgba(0,0,0,0.6)', color: '#fff', border: 'none', borderRadius: 4, padding: '4px 10px', fontSize: 12, cursor: 'pointer' },
  addImgBtn:       { display: 'flex', alignItems: 'center', gap: 8, padding: '10px 0', fontSize: 14, color: '#9b9b9b', background: 'none', border: 'none', cursor: 'pointer', marginBottom: 24 },
  titleInput:      { width: '100%', border: 'none', outline: 'none', fontFamily: 'Lora, serif', fontSize: 42, fontWeight: 700, color: '#242424', lineHeight: 1.2, resize: 'none', marginBottom: 16, letterSpacing: '-0.02em', boxSizing: 'border-box' },
  subtitleInput:   { width: '100%', border: 'none', outline: 'none', fontFamily: 'Lora, serif', fontSize: 22, fontStyle: 'italic', color: '#6b6b6b', lineHeight: 1.4, resize: 'none', marginBottom: 24, boxSizing: 'border-box' },
  divider:         { height: 1, background: '#f2f2f2', marginBottom: 32 },
  contentInput:    { width: '100%', border: 'none', outline: 'none', fontFamily: 'Lora, serif', fontSize: 20, color: '#242424', lineHeight: 1.85, resize: 'none', boxSizing: 'border-box' },
  settingsPanel:   { width: 296, borderLeft: '1px solid #f2f2f2', padding: '32px 24px', position: 'sticky', top: 113, maxHeight: 'calc(100vh - 113px)', overflowY: 'auto', flexShrink: 0, boxSizing: 'border-box' },
  settingsTitle:   { fontFamily: 'Lora, serif', fontSize: 20, fontWeight: 700, marginBottom: 28, color: '#242424' },
  settingsField:   { marginBottom: 28 },
  settingsLabel:   { display: 'block', fontSize: 13, fontWeight: 600, color: '#242424', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' },
  select:          { width: '100%', padding: '9px 12px', border: '1px solid #e6e6e6', borderRadius: 4, fontSize: 14, color: '#242424', outline: 'none', background: '#fff', boxSizing: 'border-box' },
  tagInput:        { width: '100%', padding: '9px 12px', border: '1px solid #e6e6e6', borderRadius: 4, fontSize: 14, outline: 'none', marginBottom: 10, boxSizing: 'border-box' },
  tagList:         { display: 'flex', flexWrap: 'wrap', gap: 6 },
  removeTag:       { background: 'none', border: 'none', marginLeft: 4, cursor: 'pointer', fontSize: 11, color: '#9b9b9b', padding: 0 },
  statRow:         { display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#6b6b6b', padding: '8px 0', borderBottom: '1px solid #f2f2f2' },
  saveDraftBtnFull:{ width: '100%', padding: '12px', background: '#fff', color: '#242424', border: '1px solid #e6e6e6', borderRadius: 4, fontSize: 15, fontWeight: 600, cursor: 'pointer', marginBottom: 8, boxSizing: 'border-box' },
  publishBtnFull:  { width: '100%', padding: '12px', background: '#1a8917', color: '#fff', border: 'none', borderRadius: 4, fontSize: 15, fontWeight: 600, cursor: 'pointer', boxSizing: 'border-box' },
};

const writeResponsiveCSS = `
  .write-settings-close { display: none; }
  .write-sheet-handle   { display: none; }
  .write-mob-overlay    { display: none; }

  @media (max-width: 768px) {
    .write-topbar {
      padding: 0 16px !important;
      height: 52px !important;
      box-sizing: border-box !important;
      width: 100% !important;
    }
    .write-topleft { gap: 8px !important; }
    .write-wordcount { display: none !important; }
    .write-error-hide { display: none !important; }
    .write-savedraft-hide { display: none !important; }
    .write-settings-label { display: none !important; }
    .write-settings-btn { padding: 6px 8px !important; }
    .write-editor {
      padding: 24px 20px 80px !important;
      box-sizing: border-box !important;
      width: 100% !important;
    }
    .write-title-input { font-size: 28px !important; }
    .write-subtitle-input { font-size: 17px !important; }
    .write-content-input { font-size: 17px !important; line-height: 1.7 !important; }

    .write-mob-overlay {
      display: block !important;
      position: fixed !important;
      inset: 0 !important;
      background: rgba(0,0,0,0.45) !important;
      z-index: 398 !important;
    }
    .write-settings-panel {
      position: fixed !important;
      bottom: 0 !important;
      left: 0 !important;
      right: 0 !important;
      width: 100% !important;
      max-height: 75vh !important;
      overflow-y: auto !important;
      border-left: none !important;
      border-top: 1px solid #e6e6e6 !important;
      border-radius: 20px 20px 0 0 !important;
      z-index: 399 !important;
      box-shadow: 0 -8px 32px rgba(0,0,0,0.15) !important;
      background: #fff !important;
      padding: 8px 20px 48px !important;
      box-sizing: border-box !important;
    }
    .write-sheet-handle {
      display: block !important;
      width: 40px !important;
      height: 4px !important;
      background: #e0e0e0 !important;
      border-radius: 999px !important;
      margin: 10px auto 16px !important;
    }
    .write-settings-close {
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      position: absolute !important;
      top: 14px !important;
      right: 16px !important;
      width: 32px !important;
      height: 32px !important;
      background: #f2f2f2 !important;
      border: none !important;
      border-radius: 50% !important;
      font-size: 16px !important;
      color: #242424 !important;
      cursor: pointer !important;
      z-index: 10 !important;
    }
  }

  @media (max-width: 480px) {
    .write-topbar { padding: 0 12px !important; }
    .write-editor { padding: 20px 16px 80px !important; }
    .write-title-input { font-size: 24px !important; }
    .write-settings-panel { max-height: 82vh !important; }
  }
`;