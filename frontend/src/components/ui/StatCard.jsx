import { TrendingUp, TrendingDown } from 'lucide-react';

export default function StatCard({ label, value, trend, trendLabel, trendUp, unit, accentValue = false, className = '' }) {
  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-5 ${className}`}>
      <p className="text-[10px] font-semibold uppercase tracking-[.06em] text-gray-500 mb-3">
        {label}
      </p>
      <div className="flex items-end justify-between gap-2">
        <div>
          <p
            className={`font-mono tabular-nums text-[36px] font-bold leading-none tracking-[-0.02em] ${
              accentValue ? 'text-accent-600' : 'text-gray-900'
            }`}
          >
            {value}
            {unit && <span className="text-base font-sans font-normal text-gray-400 ml-1">{unit}</span>}
          </p>
          {trend !== undefined && (
            <div className="flex items-center gap-1 mt-2">
              {trendUp ? (
                <TrendingUp size={12} className="text-success-600" />
              ) : (
                <TrendingDown size={12} className="text-danger-600" />
              )}
              <span className={`text-xs font-medium ${trendUp ? 'text-success-600' : 'text-danger-600'}`}>
                {trend}
              </span>
              {trendLabel && <span className="text-xs text-gray-500">{trendLabel}</span>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
