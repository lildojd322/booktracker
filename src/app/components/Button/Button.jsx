import styles from './Button.module.scss'

const Button = ({ children, isPending, ...props }) => {
    return (
        <button
            className={styles.button}
            disabled={!!isPending}
            {...props}
        >
              {isPending ? (
                 <div className={styles.bookLoader}>
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://w3.org">
                        {/* Левая обложка/страница */}
                        <path d="M12 21C10 21 5 19 4 19V5C5 5 10 7 12 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        {/* Правая обложка/страница */}
                        <path d="M12 21C14 21 19 19 20 19V5C19 5 14 7 12 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        {/* Анимируемый перелистывающийся лист */}
                        <path className={styles.page} d="M12 21C14 21 19 19 20 19V5C19 5 14 7 12 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </div>
            ) : children}
        </button>
    )
}

export default Button
