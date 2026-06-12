import { Info, AlertTriangle, XCircle, CheckCircle } from 'lucide-react';

const variants = {
  info: {
    container: 'bg-navy-50 border-navy-600',
    icon: <Info size={16} className="text-navy-700 shrink-0" />,
    text: 'text-navy-700',
  },
  warning: {
    container: 'bg-warning-50 border-warning-600',
    icon: <AlertTriangle size={16} className="text-warning-700 shrink-0" />,
    text: 'text-warning-700',
  },
  danger: {
    container: 'bg-danger-50 border-danger-600',
    icon: <XCircle size={16} className="text-danger-700 shrink-0" />,
    text: 'text-danger-700',
  },
  success: {
    container: 'bg-success-50 border-success-600',
    icon: <CheckCircle size={16} className="text-success-700 shrink-0" />,
    text: 'text-success-700',
  },
};

export default function Callout({ variant = 'info', children, action, onAction }) {
  const v = variants[variant];
  return (
    <div className={`flex items-center gap-2.5 px-4 py-3 rounded-md border-l-[3px] ${v.container} mb-4`}>
      {v.icon}
      <p className={`text-[13px] flex-1 leading-relaxed ${v.text}`}>{children}</p>
      {action && (
        <button
          onClick={onAction}
          className="text-accent-600 text-[13px] font-medium hover:underline shrink-0"
        >
          {action}
        </button>
      )}
    </div>
  );
}
