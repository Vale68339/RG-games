import { useState, useEffect, useCallback } from 'react';

export const CLOAK_PRESETS = [
  {
    id: 'default',
    name: 'Default Portal',
    title: 'RG Games',
    favicon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="20" fill="%234f46e5"/><text x="50%" y="55%" font-size="52" text-anchor="middle" dominant-baseline="middle">🕹️</text></svg>',
    iconName: 'Gamepad2'
  },
  {
    id: 'google-docs',
    name: 'Google Docs',
    title: 'Untitled document - Google Docs',
    favicon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="12" fill="%234285f4"/><path d="M18 16h20l12 12v22a2 2 0 0 1-2 2H18a2 2 0 0 1-2-2V18a2 2 0 0 1 2-2z" fill="%23fff"/><path d="M38 16v12h12z" fill="%23c2e7ff"/><path d="M24 32h16v3H24zm0 6h16v3H24zm0 6h10v3H24z" fill="%234285f4"/></svg>',
    iconName: 'FileText'
  },
  {
    id: 'google-classroom',
    name: 'Google Classroom',
    title: 'Classes - Google Classroom',
    favicon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="12" fill="%23137333"/><rect x="8" y="12" width="48" height="40" rx="6" fill="%23f9ab00"/><rect x="12" y="16" width="40" height="32" rx="4" fill="%231e8e3e"/><circle cx="32" cy="28" r="6" fill="%23fff"/><path d="M22 42c0-5 5-8 10-8s10 3 10 8z" fill="%23fff"/></svg>',
    iconName: 'GraduationCap'
  },
  {
    id: 'google-drive',
    name: 'Google Drive',
    title: 'My Drive - Google Drive',
    favicon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="12" fill="%23ffffff"/><polygon points="24,14 40,14 54,38 38,38" fill="%23f4b400"/><polygon points="10,38 24,14 38,38 24,62" fill="%230f9d58"/><polygon points="24,62 38,38 54,38 40,62" fill="%234285f4"/></svg>',
    iconName: 'HardDrive'
  },
  {
    id: 'canvas',
    name: 'Canvas LMS',
    title: 'Dashboard | Canvas',
    favicon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><circle cx="32" cy="32" r="30" fill="%23e13f2b"/><circle cx="32" cy="32" r="14" fill="%23ffffff"/><circle cx="32" cy="32" r="8" fill="%23e13f2b"/></svg>',
    iconName: 'BookOpen'
  },
  {
    id: 'desmos',
    name: 'Desmos Calculator',
    title: 'Desmos | Graphing Calculator',
    favicon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="12" fill="%23187a41"/><path d="M14 44c10 0 12-24 18-24s8 24 18 24" stroke="%23ffffff" stroke-width="6" fill="none" stroke-linecap="round"/></svg>',
    iconName: 'Calculator'
  },
  {
    id: 'wikipedia',
    name: 'Wikipedia',
    title: 'Wikipedia, the free encyclopedia',
    favicon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="12" fill="%23ffffff"/><text x="50%" y="68%" font-family="serif" font-weight="bold" font-size="44" fill="%23000000" text-anchor="middle">W</text></svg>',
    iconName: 'Globe'
  }
];

const CLOAK_STORAGE_KEY = 'unblocked_tab_cloak_v1';
const PANIC_KEY_STORAGE = 'unblocked_panic_key_v1';

export function useCloak() {
  const [currentPresetId, setCurrentPresetId] = useState(() => {
    try {
      return localStorage.getItem(CLOAK_STORAGE_KEY) || 'default';
    } catch {
      return 'default';
    }
  });

  const [panicKey, setPanicKey] = useState(() => {
    try {
      return localStorage.getItem(PANIC_KEY_STORAGE) || '`';
    } catch {
      return '`';
    }
  });

  const [isPanicActive, setIsPanicActive] = useState(false);

  // Apply title and favicon
  const applyCloak = useCallback((preset) => {
    document.title = preset.title;
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.getElementsByTagName('head')[0].appendChild(link);
    }
    link.href = preset.favicon;
  }, []);

  const setCloak = (presetId) => {
    setCurrentPresetId(presetId);
    try {
      localStorage.setItem(CLOAK_STORAGE_KEY, presetId);
    } catch {
      // ignore
    }
    const preset = CLOAK_PRESETS.find(p => p.id === presetId) || CLOAK_PRESETS[0];
    applyCloak(preset);
  };

  const triggerPanic = useCallback(() => {
    setIsPanicActive(prev => !prev);
    // If turning on panic, cloak as google docs
    if (!isPanicActive) {
      applyCloak(CLOAK_PRESETS[1]); // Google Docs
    } else {
      const preset = CLOAK_PRESETS.find(p => p.id === currentPresetId) || CLOAK_PRESETS[0];
      applyCloak(preset);
    }
  }, [isPanicActive, currentPresetId, applyCloak]);

  // Global key listener for Panic trigger
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Avoid triggering when user is typing in an input or textarea
      const target = e.target;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return;
      }

      if (e.key === panicKey || (panicKey === 'Escape' && e.key === 'Escape')) {
        e.preventDefault();
        triggerPanic();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [panicKey, triggerPanic]);

  // Initial cloak apply
  useEffect(() => {
    const preset = CLOAK_PRESETS.find(p => p.id === currentPresetId) || CLOAK_PRESETS[0];
    applyCloak(preset);
  }, [currentPresetId, applyCloak]);

  const updatePanicKey = (newKey) => {
    setPanicKey(newKey);
    try {
      localStorage.setItem(PANIC_KEY_STORAGE, newKey);
    } catch {
      // ignore
    }
  };

  return {
    currentPresetId,
    setCloak,
    presets: CLOAK_PRESETS,
    isPanicActive,
    setIsPanicActive,
    triggerPanic,
    panicKey,
    updatePanicKey
  };
}

