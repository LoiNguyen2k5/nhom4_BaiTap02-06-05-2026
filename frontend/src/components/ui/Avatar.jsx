const HASH_COLORS = [
  '#1E3A6B', '#0891B2', '#7C3AED', '#0D9488', '#BE185D', '#A16207',
];

function hashColor(name = '') {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) & 0xffffffff;
  return HASH_COLORS[Math.abs(h) % HASH_COLORS.length];
}

function initials(name = '') {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

const sizeClasses = {
  xs: 'w-5 h-5 text-[9px]',
  sm: 'w-6 h-6 text-[10px]',
  md: 'w-8 h-8 text-xs',
  lg: 'w-10 h-10 text-sm',
  xl: 'w-16 h-16 text-xl',
};

export default function Avatar({ name = '', src, size = 'md', className = '' }) {
  const sz = sizeClasses[size] || sizeClasses.md;

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`${sz} rounded-pill object-cover border border-gray-200 shrink-0 ${className}`}
      />
    );
  }

  return (
    <div
      className={`${sz} rounded-pill flex items-center justify-center font-semibold text-white shrink-0 ${className}`}
      style={{ backgroundColor: hashColor(name) }}
      title={name}
    >
      {initials(name)}
    </div>
  );
}

export function AvatarGroup({ names = [], max = 3, size = 'sm' }) {
  const visible = names.slice(0, max);
  const extra = names.length - max;
  const sz = sizeClasses[size] || sizeClasses.sm;

  return (
    <div className="flex items-center">
      {visible.map((name, i) => (
        <div key={i} className="-ml-2 first:ml-0 ring-2 ring-white rounded-pill">
          <Avatar name={name} size={size} />
        </div>
      ))}
      {extra > 0 && (
        <div
          className={`${sz} -ml-2 ring-2 ring-white rounded-pill flex items-center justify-center bg-gray-200 text-gray-700 font-semibold`}
          style={{ fontSize: '9px' }}
        >
          +{extra}
        </div>
      )}
    </div>
  );
}
