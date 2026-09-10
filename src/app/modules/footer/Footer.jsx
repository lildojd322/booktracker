import Link from 'next/link'
import styles from './Footer.module.scss'

const Footer = () => {
    const currentYear = new Date().getFullYear()

    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.grid}>
                    <div className={styles.brandColumn}>
                        <span className={styles.logo}>BookTracker</span>
                        <p className={styles.description}>
                            Your personal book tracker. Mark your reads, track your progress, and discover new stories.
                        </p>
                    </div>

                    <div className={styles.linksColumn}>
                        <h4 className={styles.heading}>Info</h4>
                        <ul className={styles.list}>
                            <li><Link href="/dmca" className={styles.link}>Copyright (DMCA)</Link></li>
                            <li><Link href="/privacy" className={styles.link}>Privacy Policy</Link></li>
                        </ul>
                    </div>
                </div>

                <div className={styles.bottom}>
                    <p className={styles.copyright}>
                        &copy; {currentYear} BookTracker. Designed for book lovers.
                    </p>
                </div>
            </div>
        </footer>
    )
}

export default Footer
