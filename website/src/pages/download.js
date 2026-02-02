import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import Heading from '@theme/Heading';

export default function Download() {
    return (
        <Layout
            title="Download"
            description="Laden Sie Rechnix für Ihr Betriebssystem herunter.">
            <main className="container margin-vert--xl">
                <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
                    <Heading as="h1" className="hero__title">
                        Rechnix Herunterladen
                    </Heading>
                    <p className="hero__subtitle">
                        Wählen Sie Ihre Plattform.
                    </p>

                    <div className="alert alert--warning" style={{ marginBottom: '2rem', display: 'inline-block', textAlign: 'left' }}>
                        <Heading as="h3">🚧 Beta Version</Heading>
                        <div>
                            Diese Software befindet sich noch in der <strong>Beta-Phase</strong>. <br />
                            Es können Fehler auftreten. Bitte melden Sie Probleme auf GitHub.
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', margin: '3rem 0', flexWrap: 'wrap' }}>
                        <div className="card shadow--md" style={{ padding: '2rem', minWidth: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Heading as="h3">macOS</Heading>
                            <p>Für Apple Silicon (M1/M2/M3) &amp; Intel</p>
                            <p style={{ fontSize: '0.9rem', color: '#666', fontStyle: 'italic', marginBottom: '1rem' }}>
                                Downloads sind über GitHub Releases verfügbar
                            </p>
                            <a
                                className="button button--primary button--lg"
                                href="https://github.com/vqiz/Simple-Rechnungs-Programm/releases"
                                target="_blank"
                                rel="noopener noreferrer">
                                Zu GitHub Releases
                            </a>
                            <p style={{ fontSize: '0.8rem', marginTop: '1rem', color: '#666' }}>Version 0.1.0 Beta</p>
                        </div>

                        <div className="card shadow--md" style={{ padding: '2rem', minWidth: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Heading as="h3">Windows</Heading>
                            <p>Windows 10 / 11 (ARM64)</p>
                            <p style={{ fontSize: '0.9rem', color: '#666', fontStyle: 'italic', marginBottom: '1rem' }}>
                                Downloads sind über GitHub Releases verfügbar
                            </p>
                            <a
                                className="button button--primary button--lg"
                                href="https://github.com/vqiz/Simple-Rechnungs-Programm/releases"
                                target="_blank"
                                rel="noopener noreferrer">
                                Zu GitHub Releases
                            </a>
                            <p style={{ fontSize: '0.8rem', marginTop: '1rem', color: '#666' }}>Version 0.1.0 Beta</p>
                            <p style={{ fontSize: '0.75rem', marginTop: '0.5rem', color: '#888', fontStyle: 'italic' }}>Entpacken und Rechnix.exe ausführen</p>
                        </div>
                    </div>

                    <div className="alert alert--info" style={{ marginBottom: '2rem', textAlign: 'left' }}>
                        <strong>Entwickler-Hinweis:</strong><br />
                        Sie können die Anwendungen auch selbst bauen. Der Befehl <code>npm run make:all</code> erstellt die Binaries für beide Plattformen.
                        <br /><br />
                        Quellcode verfügbar auf GitHub: <Link href="https://github.com/vqiz/Simple-Rechnungs-Programm">https://github.com/vqiz/Simple-Rechnungs-Programm</Link>
                    </div>

                    <hr style={{ margin: '3rem 0' }} />

                    <section id="haftungsausschluss" style={{ textAlign: 'left' }}>
                        <Heading as="h2">Haftungsausschluss (Disclaimer)</Heading>
                        <p>
                            <strong>1. Haftungsbeschränkung</strong><br />
                            Die Inhalte dieser Software wurden mit größtmöglicher Sorgfalt erstellt. Der Anbieter übernimmt jedoch keine Gewähr für die Richtigkeit, Vollständigkeit und Aktualität der bereitgestellten Inhalte und Funktionen. Die Nutzung der Inhalte der Software erfolgt auf eigene Gefahr des Nutzers.
                        </p>
                        <p>
                            <strong>2. Externe Links</strong><br />
                            Diese Software enthält Verknüpfungen zu Websites Dritter ("externe Links"). Diese Websites unterliegen der Haftung der jeweiligen Betreiber. Der Anbieter hat bei der erstmaligen Verknüpfung der externen Links die fremden Inhalte daraufhin überprüft, ob etwaige Rechtsverstöße bestehen. Zu dem Zeitpunkt waren keine Rechtsverstöße ersichtlich. Der Anbieter hat keinerlei Einfluss auf die aktuelle und zukünftige Gestaltung und auf die Inhalte der verknüpften Seiten.
                        </p>
                        <p>
                            <strong>3. Urheberrecht</strong><br />
                            Die durch den Anbieter erstellten Inhalte und Werke auf dieser Software unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechts bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
                        </p>
                        <p>
                            DIESE SOFTWARE WIRD "WIE BESEHEN" BEREITGESTELLT, OHNE JEGLICHE AUSDRÜCKLICHE ODER STILLSCHWEIGENDE GARANTIE. IN KEINEM FALL SIND DIE AUTOREN ODER URHEBERRECHTSINHABER FÜR JEGLICHE ANSPRÜCHE, SCHÄDEN ODER ANDERE HAFTUNGEN VERANTWORTLICH.
                        </p>
                    </section>
                </div>
            </main>
        </Layout >
    );
}
