'use client'

import { useState } from "react"
import styles from './BookCover.module.scss' 

const BookCover = ({ src, alt }) => {
    const [isLoaded, setIsLoaded] = useState(false)

    return (
        <div className={`${styles.coverWrapper} ${!isLoaded ? styles.blur : ''}`}>
            <img
                className={styles.cover}
                src={src}
                alt={alt}
                onLoad={() => setIsLoaded(true)} 
                loading="lazy" 
            />
        </div>
    )
}

export default BookCover