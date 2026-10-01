'use client'

import { useEffect, useState } from "react"
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage'
import styles from './MainBooksContainer.module.scss'
import BookAnim from '../../components/BookAnim/BookAnim'
import SearchBook from './SearchBook/SearchBook'
import getHighResImage from '../../../hooks/getHighResImage'
import Loading from '../../components/Loading/Loading'
import BookCover from '../../components/BookCover/BookCover'

const MainBooksContainer = () => {
    const [books, setBooks] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                setIsLoading(true)
                setError('')

                const query = 'onegin'
                const url = `/api/books?q=${encodeURIComponent(query)}`

                const response = await fetch(url)

                if (!response.ok) {
                    throw new Error(`server error: ${response.status}`)
                }

                const data = await response.json()

                if (data.items?.length) {
                    setBooks(data.items)
                }  else {
                    setBooks([])
                    setError('books not found')
                } 
            } catch (err) {
                setError(err instanceof Error ? err.message : 'unknown error')
            } finally {
                setIsLoading(false)
            }
        }

        fetchBooks()
    }, [])

    if (isLoading) return (
        <Loading />
    )
    if (error) return <ErrorMessage error={error} />

    return (
        <>
            <SearchBook />

            <ul className={styles.list}>
                {books.map((book, index) => {
                    const info = book.volumeInfo ?? {}
                    return (
                        <li key={book.id}>
                            <article className={`card ${styles.card}`}
                                style={{ animationDelay: `${index * 60}ms` }}>
                                {info.imageLinks?.thumbnail ? (
                                    <BookCover 
                                       
                                        src={getHighResImage(info.imageLinks.thumbnail)}
                                        alt={info.title ?? 'Cover'}
                                    />
                                ) : (
                                    <div className={styles.placeholder}>no cover</div>
                                )}
                                <h3 className={styles.title}>{info.title}</h3>
                                {info.authors && <p className={styles.authors}>{info.authors.join(', ')}</p>}
                                {info.publishedDate && <span className={styles.year}>{info.publishedDate.slice(0, 4)}</span>}
                            </article>
                        </li>
                    )
                })}

            </ul>
        </>
    )
}

export default MainBooksContainer