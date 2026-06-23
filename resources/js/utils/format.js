// yyyy-MM-dd (atau ISO) -> dd/MM/yyyy. String-split, tiada Date() (elak anjakan timezone).
export function formatDate(s) {
    if (!s) return '-';
    const [y, m, d] = String(s).slice(0, 10).split('-');
    return d && m && y ? `${d}/${m}/${y}` : s;
}
