import { useState, useEffect } from 'react';
import {
  X,
  FileCode2,
  Download,
  Upload,
  Copy,
  Check,
  RotateCcw,
  AlertCircle,
  Save,
  Info
} from 'lucide-react';

export function JsonManagerModal({
  isOpen,
  onClose,
  games,
  onImportJson,
  onExportJson,
  onResetDefaults
}) {
  const [activeTab, setActiveTab] = useState('view');
  const [jsonText, setJsonText] = useState('');
  const [statusMessage, setStatusMessage] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setJsonText(JSON.stringify(games, null, 2));
      setStatusMessage(null);
    }
  }, [isOpen, games]);

  if (!isOpen) return null;

  // Handle Save edited JSON
  const handleSaveJson = () => {
    const res = onImportJson(jsonText);
    if (res.success) {
      setStatusMessage({ type: 'success', text: res.message });
      setTimeout(() => {
        setActiveTab('view');
      }, 1200);
    } else {
      setStatusMessage({ type: 'error', text: res.message });
    }
  };

  // Download JSON file
  const handleDownload = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(onExportJson());
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'games.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setStatusMessage({ type: 'info', text: 'Downloaded games.json successfully!' });
  };

  // Copy JSON text
  const handleCopy = () => {
    navigator.clipboard.writeText(jsonText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    setStatusMessage({ type: 'info', text: 'JSON copied to clipboard!' });
  };

  // File Upload
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      const content = event.target?.result;
      setJsonText(content);
      const res = onImportJson(content);
      if (res.success) {
        setStatusMessage({ type: 'success', text: `Imported ${res.count} games from ${file.name}` });
      } else {
        setStatusMessage({ type: 'error', text: res.message });
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F1115]/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#161920] border border-white/10 rounded-2xl shadow-2xl p-6 my-8 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 shrink-0">
          <div>
            <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
              <FileCode2 className="w-5 h-5 text-amber-400" />
              Games JSON Database Storage
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              All {games.length} iframe games are stored and structured in this JSON schema
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab & Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 py-3 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-1.5 bg-[#0F1115] p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setActiveTab('view')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'view'
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              View JSON Schema
            </button>
            <button
              onClick={() => setActiveTab('edit')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'edit'
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Edit JSON Directly
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Copy */}
            <button
              onClick={handleCopy}
              title="Copy JSON text"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-bold transition-all cursor-pointer border border-white/10"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>

            {/* Download */}
            <button
              onClick={handleDownload}
              title="Download games.json"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-bold transition-all cursor-pointer border border-white/10"
            >
              <Download className="w-3.5 h-3.5 text-indigo-400" />
              <span>Export</span>
            </button>

            {/* Upload */}
            <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-bold transition-all cursor-pointer border border-white/10">
              <Upload className="w-3.5 h-3.5 text-emerald-400" />
              <span>Import File</span>
              <input
                type="file"
                accept=".json,application/json"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            {/* Reset */}
            <button
              onClick={() => {
                if (confirm('Reset games catalog back to factory defaults?')) {
                  onResetDefaults();
                  setStatusMessage({ type: 'info', text: 'Reset games list to default collection.' });
                }
              }}
              title="Reset to original games"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-red-950/60 text-gray-400 hover:text-red-400 text-xs font-bold transition-all cursor-pointer border border-white/10"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Status notification banner */}
        {statusMessage && (
          <div
            className={`my-3 p-3 rounded-xl text-xs flex items-center gap-2 ${
              statusMessage.type === 'success'
                ? 'bg-emerald-950/60 border border-emerald-800/60 text-emerald-300'
                : statusMessage.type === 'error'
                ? 'bg-red-950/60 border border-red-800/60 text-red-300'
                : 'bg-indigo-950/60 border border-indigo-800/60 text-indigo-300'
            }`}
          >
            {statusMessage.type === 'error' ? (
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            ) : (
              <Info className="w-4 h-4 shrink-0 text-indigo-400" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* JSON Code Area */}
        <div className="flex-1 overflow-hidden my-3 rounded-xl bg-[#0F1115] border border-white/10 flex flex-col min-h-[350px]">
          {activeTab === 'view' ? (
            <pre className="p-4 text-xs font-mono text-indigo-300/90 overflow-auto flex-1 leading-relaxed selection:bg-indigo-500/30">
              {jsonText}
            </pre>
          ) : (
            <div className="flex-1 flex flex-col p-2">
              <textarea
                value={jsonText}
                onChange={e => setJsonText(e.target.value)}
                placeholder="Paste or write valid JSON array here..."
                className="w-full flex-1 bg-transparent text-xs font-mono text-emerald-300 p-2 focus:outline-none resize-none leading-relaxed"
                spellCheck={false}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-white/10 shrink-0 text-xs">
          <span className="text-gray-500 font-mono">
            {games.length} total entries loaded in memory & localStorage
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-bold transition-all cursor-pointer"
            >
              Close
            </button>
            {activeTab === 'edit' && (
              <button
                onClick={handleSaveJson}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold transition-all shadow-lg shadow-indigo-600/30 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save JSON Changes</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
