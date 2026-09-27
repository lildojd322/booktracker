import ErrorMessage from '../../components/ErrorMessage/ErrorMessage'
import getHighResImage from '../../../hooks/getHighResImage'
import styles from './FoundBooks.module.scss'
import SearchBook from '../MainBooksContainer/SearchBook/SearchBook'

const FoundBooks = async ({ searchQuery }) => {

    console.log(searchQuery)
    const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(searchQuery)}&maxResults=20&key=${process.env.API_KEY}`
    console.log('URL:', url)
    const response = await fetch(url)
    if (!response.ok) {
        throw new Error(`Google API error: ${response.status}`)
    }

    const data = await response.json()
    const foundBooks = data.items ?? []

    return (
        <div style={{ margin: '20px' }}>
            <SearchBook  searchQuery={searchQuery}/>

            {foundBooks.length < 1
                ? <p className={styles.empty}>books not found :(</p>
                : <ul className={styles.list}>
                    {foundBooks.map((book, index) => {
                        const info = book.volumeInfo ?? {}
                        return (
                            <li key={book.id}>
                                <article
                                    className={`card ${styles.card}`}
                                    style={{ animationDelay: `${index * 60}ms` }}
                                >
                                    {info.imageLinks?.thumbnail ? (
                                        <img
                                            className={styles.cover}
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
            }
        </div>
    )
}

export default FoundBooks