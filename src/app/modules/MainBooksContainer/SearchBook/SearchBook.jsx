'use client'

import { useEffect, useState } from "react"
import { searchSchema } from "../../../../lib/zod"
import { useRouter } from "next/navigation"
import ErrorMessage from '../../../components/ErrorMessage/ErrorMessage'
import styles from "./SearchBook.module.scss"
import LittleBookAnim from '../../../components/LittleBookAnim/LittleBookAnim'

const SearchBook = ({ searchQuery: lastQuery }) => {
    const [searchQuery, setSearchQuery] = useState(lastQuery ? decodeURIComponent(lastQuery) : '')
    const [error, setError] = useState('')
    const [isPending, setIsPending] = useState(false)
    const router = useRouter()

    useEffect(() => {
        if (lastQuery) {
            setSearchQuery(decodeURIComponent(lastQuery))
        }
        setIsPending(false)
    }, [lastQuery])

    const handleSubmit = (event) => {

        event.preventDefault()
        setError('')

        if (isPending) return


        const formData = new FormData(event.currentTarget)
        const data = Object.fromEntries(formData.entries())
        const validation = searchSchema.safeParse(data)

        if (!validation.success) {
            setError(validation.error.issues[0].message)
            return
        }

        const trimmedQuery = searchQuery.trim()
        const decodedLastQuery = lastQuery ? decodeURIComponent(lastQuery) : ''

        if (trimmedQuery === decodedLastQuery) {
            return
        }
        setIsPending(true)
        router.push(`/search/${encodeURIComponent(trimmedQuery)}`)
    }

    return (
        <div className={styles.wrapper}>
            <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.inputContainer}>
                    <input
                        disabled={isPending}
                        className={styles.input}
                        id="searchQuery"
                        type="search"
                        value={searchQuery}
                        name="searchQuery"
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Eugene Onegin"
                    />
                    {isPending && (
                        <div className={styles.loaderInside}>
                            <LittleBookAnim />
                        </div>
                    )}
                </div>
                {error && <ErrorMessage error={error} />}
            </form>
        </div>
    )
}

export default SearchBook