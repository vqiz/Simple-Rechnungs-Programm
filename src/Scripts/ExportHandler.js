
export const exportToCSV = (data, filename) => {
    if (!data || !data.length) {
        console.warn("No data to export");
        return;
    }

    // Get headers from first object
    const headers = Object.keys(data[0]);

    const csvContent = [
        headers.join(","), // Header row
        ...data.map(row => headers.map(header => {
            let val = row[header];
            // Handle strings with commas or newlines
            if (typeof val === 'string' && (val.includes(',') || val.includes('\n'))) {
                val = `"${val.replace(/"/g, '""')}"`;
            }
            return val;
        }).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
