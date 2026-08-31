import { useState } from 'react';
import {
  X,
  Shield,
  Check,
  AlertTriangle,
  FileText,
  GraduationCap,
  HardDrive,
  BookOpen,
  Calculator,
  Globe,
  Gamepad2
} from 'lucide-react';

const ICON_MAP = {
  Gamepad2,
  FileText,
  GraduationCap,
  HardDrive,
  BookOpen,
  Calculator,
  Globe
};

export function TabCloakModal({
  isOpen,
  onClose,
  presets,
  currentPresetId,
  onSelectPreset,
  panicKey,
  onUpdatePanicKey
}) {
  const [selectedKey, setSelectedKey] = useState(panicKey);

  if (!isOpen) return null;

  const handleKeyChange = (key) => {
    setSelectedKey(key);
    onUpdatePanicKey(key);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F1115]/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl bg-[#161920] border border-white/10 rounded-2xl shadow-2xl p-6 my-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div>
            <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-emerald-400" />
              Tab Cloaker & Panic Config
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Disguise browser tab title and favicon to look like standard school/work apps
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Presets Grid */}
        <div className="space-y-2.5">
          <label className="text-xs font-bold text-gray-300">Choose Tab Cloak Preset:</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {presets.map(preset => {
              const Icon = ICON_MAP[preset.iconName] || Globe;
              const isSelected = currentPresetId === preset.id;

              return (
                <button
                  key={preset.id}
                  onClick={() => onSelectPreset(preset.id)}
                  className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-300 shadow-md shadow-emerald-950/20'
                      : 'bg-[#0F1115] border-white/10 text-gray-300 hover:bg-white/5 hover:border-white/20'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-gray-400'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-white">{preset.name}</span>
                      {isSelected && <Check className="w-4 h-4 text-emerald-400 shrink-0 ml-1" />}
                    </div>
                    <p className="text-[11px] text-gray-400 truncate mt-0.5">{preset.title}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Panic Key Setting */}
        <div className="space-y-3 p-4 rounded-xl bg-[#0F1115] border border-white/10 text-xs">
          <div className="flex items-center gap-2 text-red-400 font-bold">
            <AlertTriangle className="w-4 h-4" />
            <span>Panic Hotkey Trigger</span>
          </div>
          <p className="text-gray-400 leading-relaxed">
            Pressing this key instantly hides all games and switches the tab to a realistic Google Docs disguise screen.
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-gray-300 font-medium mr-1">Choose Panic Key:</span>
            {['`', 'Escape', 'p', 'q', 'F2'].map(k => (
              <button
                key={k}
                onClick={() => handleKeyChange(k)}
                className={`px-3 py-1.5 rounded-lg border font-mono font-bold transition-all cursor-pointer ${
                  selectedKey === k
                    ? 'bg-red-500 text-white border-red-400 shadow-sm'
                    : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                }`}
              >
                {k === '`' ? '` (Tilde)' : k}
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs transition-all shadow-md shadow-emerald-500/20 cursor-pointer"
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
}
