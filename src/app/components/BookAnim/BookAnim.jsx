import styles from './BookAnim.module.scss'

const BookAnim = () => {
    return (
        <div className={styles.bookAnimation}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://w3.org">
                <path className={styles.innerPage} d="M12 21C10 21 5 19 4 19V5C5 5 10 7 12 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path className={styles.innerPage} d="M12 21C14 21 19 19 20 19V5C19 5 14 7 12 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path className={styles.lostPage} d="M12 21C14 21 19 19 20 19V5C19 5 14 7 12 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        </div>
    )
}

export default BookAnim