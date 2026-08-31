import { useState, useEffect, useCallback } from 'react';

export const CLOAK_PRESETS = [
  {
    id: 'default',
    name: 'Default Portal',
    title: 'RG Games',
    favicon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🕹️</text></svg>',
    iconName: 'Gamepad2'
  },
  {
    id: 'google-docs',
    name: 'Google Docs',
    title: 'Untitled document - Google Docs',
    favicon: 'https://ssl.gstatic.com/docs/documents/images/kix-favicon7.ico',
    iconName: 'FileText'
  },
  {
    id: 'google-classroom',
    name: 'Google Classroom',
    title: 'Classes - Google Classroom',
    favicon: 'https://ssl.gstatic.com/classroom/favicon.png',
    iconName: 'GraduationCap'
  },
  {
    id: 'google-drive',
    name: 'Google Drive',
    title: 'My Drive - Google Drive',
    favicon: 'https://ssl.gstatic.com/images/branding/product/1x/drive_2020q4_32dp.png',
    iconName: 'HardDrive'
  },
  {
    id: 'canvas',
    name: 'Canvas LMS',
    title: 'Dashboard | Canvas',
    favicon: 'https://du11hjcvx0uqb.cloudfront.net/dist/images/favicon-e10d657a73.ico',
    iconName: 'BookOpen'
  },
  {
    id: 'desmos',
    name: 'Desmos Calculator',
    title: 'Desmos | Graphing Calculator',
    favicon: 'https://www.desmos.com/favicon.ico',
    iconName: 'Calculator'
  },
  {
    id: 'wikipedia',
    name: 'Wikipedia',
    title: 'Wikipedia, the free encyclopedia',
    favicon: 'https://en.wikipedia.org/static/favicon/wikipedia.ico',
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

