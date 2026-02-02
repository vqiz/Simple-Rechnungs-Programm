import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from './index.module.css';
import DashboardMock from '../components/AppMock/DashboardMock';

function HomepageHeader() {
    const { siteConfig } = useDocusaurusContext();
    return (
        <header className={clsx('hero hero--primary', styles.heroBanner)}>
            <div className="container">
                <div className="row">
                    <div className="col col--6" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <Heading as="h1" className="hero__title" style={{ fontSize: '3.5rem' }}>
                            Rechnungen einfach.<br />Geschäft erfolgreich.
                        </Heading>
                        <p className="hero__subtitle" style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>
                            Die moderne Lösung für Selbstständige und Kleinunternehmen.
                        </p>
                        <div className={styles.buttons}>
                            <Link
                                className="button button--secondary button--lg"
                                to="/handbuch/intro">
                                Jetzt durchstarten ➔
                            </Link>
                        </div>
                    </div>
                    <div className="col col--6">
                        <div style={{ transform: 'scale(0.8) translateY(20px)', transformOrigin: 'top center' }}>
                            <DashboardMock />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}

function Feature({ title, description, icon }) {
    return (
        <div className={clsx('col col--4')}>
            <div className="feature-card padding--md margin-bottom--md">
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{icon}</div>
                <div className="text--center">
                    <Heading as="h3">{title}</Heading>
                    <p>{description}</p>
                </div>
            </div>
        </div>
    );
}

export default function Home() {
    const { siteConfig } = useDocusaurusContext();
    return (
        <Layout
            title={`Willkommen bei ${siteConfig.title}`}
            description="Rechnix - Die einfache Rechnungsverwaltung für macOS">
            <HomepageHeader />
            <main>
                <div className="container padding-vert--xl">
                    <div className="row">
                        <Feature
                            icon="🚀"
                            title="Blitzschnell"
                            description="Erstellen Sie Rechnungen in Sekunden, nicht Minuten. Intuitive Bedienung steht an erster Stelle."
                        />
                        <Feature
                            icon="📊"
                            title="Übersichtlich"
                            description="Behalten Sie Finanzen, Ausgaben und Gewinne mit dem integrierten Dashboard im Blick."
                        />
                        <Feature
                            icon="⚖️"
                            title="Rechtssicher"
                            description="EÜR Export und konforme Rechnungsformate (inkl. XRechnung) für Deutschland."
                        />
                    </div>

                    <div className="padding-vert--xl text--center">
                        <Heading as="h2">Bereit für professionelle Rechnungen?</Heading>
                        <p>Laden Sie Rechnix heute herunter.</p>
                        <Link
                            className="button button--primary button--lg"
                            to="/handbuch/intro">
                            Dokumentation & Download
                        </Link>
                    </div>
                </div>
            </main>
        </Layout>
    );
}
