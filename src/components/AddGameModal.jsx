import { useState } from 'react';
import { X, Plus, Eye, Code, Globe, AlertCircle } from 'lucide-react';

export function AddGameModal({ isOpen, onClose, onAddGame }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('arcade');
  const [description, setDescription] = useState('');
  const [thumbnail, setThumbnail] = useState('🎮');
  const [iframeType, setIframeType] = useState('url');
  const [iframeSource, setIframeSource] = useState('');
  const [controlsText, setControlsText] = useState('Arrow Keys or WASD to Move\nSpace to Action');
  const [tagsText, setTagsText] = useState('Custom, Unblocked, Web');
  const [showPreview, setShowPreview] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide a game title.');
      return;
    }
    if (!iframeSource.trim()) {
      setError('Please provide an iframe source URL or HTML code.');
      return;
    }

    const controls = controlsText
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    const tags = tagsText
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    onAddGame({
      title: title.trim(),
      category,
      description: description.trim() || `Play ${title.trim()} unblocked in high performance mode!`,
      thumbnail: thumbnail.trim() || '🎮',
      thumbnailBg: 'bg-slate-800 text-cyan-400 border-slate-700',
      iframeType,
      iframeSource: iframeSource.trim(),
      controls: controls.length > 0 ? controls : ['Click to play'],
      aspectRatio: '16:9',
      tags: tags.length > 0 ? tags : ['Custom', 'Web']
    });

    onClose();
  };

  const sampleHtml = `<!DOCTYPE html>
<html>
<body style="background:#020617; color:#38bdf8; display:flex; flex-direction:column; align-items:center; justify-content:center; height:100vh; margin:0; font-family:sans-serif;">
  <h2>Custom Mini Game</h2>
  <button onclick="this.innerText='Clicks: ' + (++c)" style="padding:12px 24px; font-size:18px; font-weight:bold; background:#06b6d4; border:none; border-radius:8px; cursor:pointer;">Click Me!</button>
  <script>let c=0;</script>
</body>
</html>`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F1115]/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#161920] border border-white/10 rounded-2xl shadow-2xl p-6 my-8">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div>
            <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-indigo-400" />
              Add Custom Iframe Game
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Add any web game URL or custom HTML5/JS code to your JSON catalog
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-red-950/50 border border-red-800/60 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 mt-4 text-xs">
          {/* Title & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 space-y-1">
              <label className="font-bold text-gray-300">Game Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Cyber Runner 3D"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full bg-[#0F1115] border border-white/10 rounded-xl px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-gray-300">Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full bg-[#0F1115] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              >
                <option value="arcade">Arcade</option>
                <option value="action">Action</option>
                <option value="puzzle">Puzzle</option>
                <option value="retro">Retro</option>
                <option value="sports">Sports</option>
                <option value="casual">Casual</option>
              </select>
            </div>
          </div>

          {/* Thumbnail & Tags */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-gray-300">Emoji Icon</label>
              <input
                type="text"
                placeholder="🎮"
                value={thumbnail}
                onChange={e => setThumbnail(e.target.value)}
                className="w-full bg-[#0F1115] border border-white/10 rounded-xl px-3 py-2 text-white text-center text-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div className="sm:col-span-3 space-y-1">
              <label className="font-bold text-gray-300">Tags (comma separated)</label>
              <input
                type="text"
                placeholder="Action, Web, 3D, Fast"
                value={tagsText}
                onChange={e => setTagsText(e.target.value)}
                className="w-full bg-[#0F1115] border border-white/10 rounded-xl px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Iframe Embed Source Type Toggle */}
          <div className="space-y-1.5">
            <label className="font-bold text-gray-300">Iframe Source Type</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setIframeType('url')}
                className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border font-bold transition-all cursor-pointer ${
                  iframeType === 'url'
                    ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300'
                    : 'bg-[#0F1115] border-white/10 text-gray-400 hover:text-white'
                }`}
              >
                <Globe className="w-4 h-4" />
                <span>Web URL (HTTPS)</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setIframeType('srcdoc');
                  if (!iframeSource) setIframeSource(sampleHtml);
                }}
                className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border font-bold transition-all cursor-pointer ${
                  iframeType === 'srcdoc'
                    ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300'
                    : 'bg-[#0F1115] border-white/10 text-gray-400 hover:text-white'
                }`}
              >
                <Code className="w-4 h-4" />
                <span>Raw HTML5 Code (Srcdoc)</span>
              </button>
            </div>
          </div>

          {/* Iframe Source Input / Textarea */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="font-bold text-gray-300">
                {iframeType === 'url' ? 'Game Embed URL *' : 'Game HTML / JS / CSS Source Code *'}
              </label>
              {iframeType === 'srcdoc' && (
                <button
                  type="button"
                  onClick={() => setIframeSource(sampleHtml)}
                  className="text-[11px] text-indigo-400 hover:underline"
                >
                  Insert Sample Code
                </button>
              )}
            </div>
            {iframeType === 'url' ? (
              <input
                type="url"
                required
                placeholder="https://example.com/game-iframe.html"
                value={iframeSource}
                onChange={e => setIframeSource(e.target.value)}
                className="w-full bg-[#0F1115] border border-white/10 rounded-xl px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-mono text-xs"
              />
            ) : (
              <textarea
                required
                rows={5}
                placeholder="<!DOCTYPE html><html>...</html>"
                value={iframeSource}
                onChange={e => setIframeSource(e.target.value)}
                className="w-full bg-[#0F1115] border border-white/10 rounded-xl p-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-mono text-xs"
              />
            )}
          </div>

          {/* Description & Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-gray-300">Description</label>
              <textarea
                rows={3}
                placeholder="Short summary of gameplay..."
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full bg-[#0F1115] border border-white/10 rounded-xl p-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-gray-300">Controls (One per line)</label>
              <textarea
                rows={3}
                placeholder="Arrow Keys to Steer&#10;Space to Brake"
                value={controlsText}
                onChange={e => setControlsText(e.target.value)}
                className="w-full bg-[#0F1115] border border-white/10 rounded-xl p-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-mono"
              />
            </div>
          </div>

          {/* Live Preview Toggle */}
          {iframeSource && (
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => setShowPreview(prev => !prev)}
                className="flex items-center gap-1.5 text-indigo-400 font-bold hover:underline"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{showPreview ? 'Hide Frame Preview' : 'Test Iframe Preview'}</span>
              </button>
              {showPreview && (
                <div className="w-full h-44 rounded-xl bg-[#0F1115] border border-white/10 overflow-hidden">
                  <iframe
                    title="Preview"
                    src={iframeType === 'url' ? iframeSource : undefined}
                    srcDoc={iframeType === 'srcdoc' ? iframeSource : undefined}
                    className="w-full h-full border-none"
                    sandbox="allow-scripts allow-same-origin"
                  />
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-bold transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold transition-all shadow-lg shadow-indigo-600/30 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Add to Games List</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
