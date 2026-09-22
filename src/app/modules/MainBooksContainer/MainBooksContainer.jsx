'use client'

import { useEffect, useState } from "react"
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage'

const MainBooksContainer = () => {
    const [books, setBooks] = useState([])
    const [isLoading, setIsLoading] = useState(false) 
    const [error, setError] = useState('')

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                setIsLoading(true)
                setError('')

                const query = 'subject:fiction'
                const url = `/api/books?q=${encodeURIComponent(query)}`

                const response = await fetch(url)

                if (!response.ok) {
                    throw new Error(`server error: ${response.status}`)
                }

                const data = await response.json()

                if (data.items?.length) {
                    setBooks(data.items)
                } else {
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

    if (isLoading) return <p>loading...</p>
    if (error) return <ErrorMessage error={error} />

    return (
        <ul>
            {books.map((book) => {
                const info = book.volumeInfo ?? {}
                return (
                    <li key={book.id}>
                        {info.imageLinks?.thumbnail ? (
                            <img
                                src={info.imageLinks.thumbnail.replace('http://', 'https://')}
                                alt={info.title ?? 'Cover'}
                            />
                        ) : (
                            <div className="placeholder">no cover</div>
                        )}
                        <h3>{info.title}</h3>
                        {info.authors && <p>{info.authors.join(', ')}</p>}
                        {info.publishedDate && <span>{info.publishedDate.slice(0, 4)}</span>}
                    </li>
                )
            })}
        </ul>
    )
}

export default MainBooksContainer