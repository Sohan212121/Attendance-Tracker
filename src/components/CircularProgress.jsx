import './CircularProgress.css';

export default function CircularProgress({ percentage, size = 120, strokeWidth = 8, label }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  const getColor = (pct) => {
    if (pct >= 75) return '#34d399';
    if (pct >= 50) return '#fbbf24';
    return '#f87171';
  };

  const color = getColor(percentage);

  return (
    <div className="circular-progress" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          className="cp-bg"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        <circle
          className="cp-fill"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          stroke={color}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ '--circumference': circumference }}
        />
      </svg>
      <div className="cp-text">
        <span className="cp-value" style={{ color }}>{percentage}%</span>
        {label && <span className="cp-label">{label}</span>}
      </div>
    </div>
  );
}
