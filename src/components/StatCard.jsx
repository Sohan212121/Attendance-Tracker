import './StatCard.css';

export default function StatCard({ icon, label, value, color, delay = 0 }) {
  return (
    <div
      className="stat-card glass-card animate-fade-up"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="stat-icon" style={{ background: color || 'var(--gradient-primary)' }}>
        {icon}
      </div>
      <div className="stat-info">
        <span className="stat-value">{value}</span>
        <span className="stat-label">{label}</span>
      </div>
    </div>
  );
}
