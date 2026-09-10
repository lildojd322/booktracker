import Link from 'next/link'
import styles from './NotFound.module.scss'
import BookAnim from './components/BookAnim/BookAnim'

const NotFound = () => {
    return (
        <div className={styles.wrapper}>
            <div className={styles.content}>
                <BookAnim />
                <h1 className={styles.code}>404</h1>
                <h2 className={styles.title}>Page Not Found</h2>
                <p className={styles.description}>
                    Oops! The page you are looking for has been torn out, or never existed in this book tracker.
                </p>
                <Link href="/" className={styles.homeButton}>
                    Return Home
                </Link>
            </div>
        </div>
    )
}

export default NotFound