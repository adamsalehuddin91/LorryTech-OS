export default function StatusBadge({ status, map, className = '' }) {
    const s = map[status] || { label: status, cls: 'bg-gray-100 text-gray-700' };
    return (
        <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${s.cls} ${className}`}>
            {s.label}
        </span>
    );
}
