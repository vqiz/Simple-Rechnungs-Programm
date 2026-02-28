import React from 'react';
import { createRoot } from 'react-dom/client';
import html2pdf from 'html2pdf.js';
import PdfRechnungView from './PdfRechnungView';

export const generateInvoicePdfBuffer = async (rechnungId, data, kunde, unternehmen, logoPath) => {
    return new Promise((resolve, reject) => {
        const div = document.createElement('div');
        div.style.position = 'absolute';
        div.style.top = '-9999px';
        div.style.left = '-9999px';
        div.style.width = '210mm'; // Render A4 width exactly to avoid layout shifts
        document.body.appendChild(div);

        const root = createRoot(div);

        root.render(<PdfRechnungView rechnungId={rechnungId} data={data} kunde={kunde} unternehmen={unternehmen} logoPath={logoPath} />);

        // Wait for next tick so DOM is populated, and give it extra time for image loading
        setTimeout(() => {
            const opt = {
                margin: 0,
                filename: `${rechnungId}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
            };

            html2pdf().set(opt).from(div).toPdf().get('pdf').then((pdf) => {
                const totalPages = pdf.internal.getNumberOfPages();
                for (let i = totalPages; i >= 2; i -= 2) {
                    pdf.deletePage(i);
                }
                const buffer = pdf.output('arraybuffer');

                root.unmount();
                if (document.body.contains(div)) {
                    document.body.removeChild(div);
                }
                resolve(buffer);
            }).catch(e => {
                root.unmount();
                if (document.body.contains(div)) {
                    document.body.removeChild(div);
                }
                reject(e);
            });
        }, 300); // 300ms should be enough for synchronous rendering
    });
};
