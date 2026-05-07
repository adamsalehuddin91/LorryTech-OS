/**
 * CompanySelector — reusable "Diterbitkan Oleh" field for Invoice & Quotation forms.
 * Auto-selects when there is only 1 company. Hidden when there are no companies.
 */
export default function CompanySelector({ companies = [], value, onChange, error }) {
    if (!companies || companies.length === 0) return null;

    // Single company — show as read-only info block, not a dropdown
    if (companies.length === 1) {
        const c = companies[0];
        return (
            <div className="rounded-lg border border-blue-100 bg-blue-50 px-4 py-3">
                <p className="text-xs font-medium text-blue-600 mb-0.5">Diterbitkan Oleh</p>
                <p className="text-sm font-semibold text-gray-900">{c.name}</p>
                {c.reg_no && <p className="text-xs text-gray-500">No. Pendaftaran: {c.reg_no}</p>}
            </div>
        );
    }

    // Multiple companies — show dropdown
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700">
                Diterbitkan Oleh <span className="text-red-500">*</span>
            </label>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
                <option value="">-- Pilih Syarikat Penerbit --</option>
                {companies.map((company) => (
                    <option key={company.id} value={company.id}>
                        {company.name}
                        {company.reg_no ? ` (${company.reg_no})` : ''}
                    </option>
                ))}
            </select>
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
}
