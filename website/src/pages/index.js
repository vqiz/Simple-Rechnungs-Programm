import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from './index.module.css';

function HomepageHeader() {
    const { siteConfig } = useDocusaurusContext();
    return (
        <header className={clsx('hero hero--primary', styles.heroBanner)}>
            <div className="container">
                <Heading as="h1" className="hero__title">
                    {siteConfig.title}
                </Heading>
                <p className="hero__subtitle">{siteConfig.tagline}</p>
                <div className={styles.buttons}>
                    <Link
                        className="button button--secondary button--lg"
                        to="/handbuch/intro">
                        Jetzt Starten - Handbuch ⏱️
                    </Link>
                </div>
            </div>
        </header>
    );
}

export default function Home() {
    const { siteConfig } = useDocusaurusContext();
    return (
        <Layout
            title={`${siteConfig.title}`}
            description="Rechnix - Einfache Rechnungsverwaltung">
            <HomepageHeader />
            <main>
                <div className="container padding-vert--xl">
                    <div className="row">
                        <div className="col col--4">
                            <div className="text--center">
                                <h3>Einfache Verwaltung</h3>
                                <p>Verwalten Sie Kunden, Produkte und Rechnungen an einem Ort.</p>
                            </div>
                        </div>
                        <div className="col col--4">
                            <div className="text--center">
                                <h3>Statistiken</h3>
                                <p>Behalten Sie Ihre Finanzen mit detaillierten Grafiken im Blick.</p>
                            </div>
                        </div>
                        <div className="col col--4">
                            <div className="text--center">
                                <h3>EÜR Export</h3>
                                <p>Erstellen Sie Ihre Einnahmenüberschussrechnung mit einem Klick.</p>
                            </div>
                        </div>
                    </div>
                    <div className="text--center padding-top--xl">
                        <Link
                            className="button button--primary button--lg"
                            // In a real scenario, this would point to a release asset
                            to="/handbuch/intro">
                            Download Rechnix v1.0
                        </Link>
                    </div>
                </div>
            </main>
        </Layout>
    );
}
