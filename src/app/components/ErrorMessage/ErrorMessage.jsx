import styles from './ErrorMessage.module.scss'

const ErrorMessage = ({ error }) => {
    if (!error) return null

    return (
        <div className={styles.errorContainer}>
            <svg 
                className={styles.icon} 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://w3.org"
            >
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <line x1="12" y1="16" x2="12.01" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <p className={styles.text}>{error}</p>
        </div>
    )
}

export default ErrorMessage
