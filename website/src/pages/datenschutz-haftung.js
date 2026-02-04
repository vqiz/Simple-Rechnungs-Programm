
import React, { useEffect, useState } from 'react';
import Layout from '@theme/Layout';

export default function Disclaimer() {
    const [content, setContent] = useState('Lade Haftungsausschluss...');

    useEffect(() => {
        fetch('/legal.json')
            .then(res => res.json())
            .then(data => setContent(data.disclaimer))
            .catch(err => setContent("Fehler beim Laden des Haftungsausschlusses."));
    }, []);

    return (
        <Layout title="Haftungsausschluss">
            <main className="container margin-vert--xl">
                <div style={{ maxWidth: '800px', margin: '0 auto', whiteSpace: 'pre-wrap' }}>
                    {content}
                </div>
            </main>
        </Layout>
    );
}
