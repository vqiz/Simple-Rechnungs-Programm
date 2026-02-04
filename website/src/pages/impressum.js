
import React, { useEffect, useState } from 'react';
import Layout from '@theme/Layout';

export default function Imprint() {
    const [content, setContent] = useState('Lade Impressum...');

    useEffect(() => {
        fetch('/legal.json')
            .then(res => res.json())
            .then(data => setContent(data.imprint))
            .catch(err => setContent("Fehler beim Laden des Impressums."));
    }, []);

    return (
        <Layout title="Impressum">
            <main className="container margin-vert--xl">
                <div style={{ maxWidth: '800px', margin: '0 auto', whiteSpace: 'pre-wrap' }}>
                    {content}
                </div>
            </main>
        </Layout>
    );
}
