import { Link } from '@inertiajs/react';

export default function PaginationLinks({ links }) {
    if (!links?.length) return null;
    return (
        <div className="flex justify-center gap-1 pb-2 flex-wrap">
            {links.map((link, i) => (
                <Link
                    key={i}
                    href={link.url || '#'}
                    className={`px-3 py-1.5 rounded-lg text-sm ${link.active ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border border-gray-200'} ${!link.url ? 'opacity-40 pointer-events-none' : ''}`}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                />
            ))}
        </div>
    );
}
