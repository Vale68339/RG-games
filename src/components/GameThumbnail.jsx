import { useState } from 'react';
import { Gamepad2 } from 'lucide-react';

export function isImageUrl(thumbnail) {
  if (!thumbnail || typeof thumbnail !== 'string') return false;
  const str = thumbnail.trim();
  return (
    str.startsWith('http://') ||
    str.startsWith('https://') ||
    str.startsWith('data:image/') ||
    str.startsWith('blob:') ||
    str.startsWith('/') ||
    str.startsWith('./') ||
    /\.(png|jpe?g|webp|gif|svg|avif)(\?.*)?$/i.test(str)
  );
}

export function GameThumbnail({
  thumbnail,
  alt = 'Game thumbnail',
  className = 'w-full h-full object-cover',
  emojiClassName = 'text-4xl',
  containerClassName = 'w-full h-full flex items-center justify-center'
}) {
  const [hasError, setHasError] = useState(false);
  const isImg = !hasError && isImageUrl(thumbnail);

  if (isImg) {
    return (
      <img
        src={thumbnail}
        alt={alt}
        className={className}
        loading="lazy"
        referrerPolicy="no-referrer"
        onError={() => setHasError(true)}
      />
    );
  }

  return (
    <div className={containerClassName}>
      {hasError ? (
        <Gamepad2 className="w-8 h-8 text-indigo-400/80 animate-pulse" />
      ) : (
        <span className={emojiClassName}>{thumbnail || '🎮'}</span>
      )}
    </div>
  );
}
