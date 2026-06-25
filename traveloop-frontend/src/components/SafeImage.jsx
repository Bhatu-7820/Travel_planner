import { useState } from 'react';

/**
 * SafeImage — shows a gradient placeholder when the image fails to load.
 * Prevents broken image icons from appearing anywhere in the app.
 */
const FALLBACK_GRADIENTS = [
  'from-teal-400 to-blue-500',
  'from-purple-400 to-indigo-500',
  'from-orange-400 to-pink-500',
  'from-green-400 to-cyan-500',
  'from-rose-400 to-red-500',
  'from-amber-400 to-yellow-500',
];

function getGradient(src = '') {
  // Pick a consistent gradient based on the URL string
  const idx = src.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return FALLBACK_GRADIENTS[idx % FALLBACK_GRADIENTS.length];
}

export default function SafeImage({
  src,
  alt = '',
  className = '',
  fallbackText = null,
  ...props
}) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  if (failed || !src) {
    return (
      <div
        className={`bg-gradient-to-br ${getGradient(src)} flex items-center justify-center ${className}`}
        aria-label={alt}
      >
        {fallbackText ? (
          <span className="text-white font-bold text-lg opacity-90 text-center px-2">
            {fallbackText}
          </span>
        ) : (
          <svg className="w-8 h-8 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        )}
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} style={{ overflow: 'hidden' }}>
      {!loaded && (
        <div className={`absolute inset-0 bg-gradient-to-br ${getGradient(src)} animate-pulse`} />
      )}
      <img
        src={src}
        alt={alt}
        loading={props.loading || 'lazy'}
        decoding={props.decoding || 'async'}
        className={`${className} ${!loaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        style={{ position: loaded ? 'static' : 'absolute', inset: 0 }}
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
        {...props}
      />
    </div>
  );
}
