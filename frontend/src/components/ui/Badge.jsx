const variantClasses = {
  neutral: 'bg-gray-100 text-gray-700',
  brand:   'bg-navy-100 text-navy-700',
  success: 'bg-success-100 text-success-700',
  warning: 'bg-warning-100 text-warning-700',
  danger:  'bg-danger-100 text-danger-700',
  info:    'bg-info-100 text-info-700',
  accent:  'bg-accent-100 text-accent-700',
};

const dotClasses = {
  neutral: 'bg-gray-500',
  brand:   'bg-navy-700',
  success: 'bg-success-600',
  warning: 'bg-warning-600',
  danger:  'bg-danger-600',
  info:    'bg-info-600',
  accent:  'bg-accent-600',
};

const sizeClasses = {
  sm: 'text-[11px] px-1.5 py-0.5',
  md: 'text-xs px-2 py-0.5',
};

export default function Badge({ variant = 'neutral', size = 'md', dot = false, children }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-sm ${variantClasses[variant]} ${sizeClasses[size]}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotClasses[variant]}`} />}
      {children}
    </span>
  );
}
