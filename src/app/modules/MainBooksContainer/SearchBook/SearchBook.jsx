'use client'

import { useState } from "react"
import { searchSchema } from "../../../../lib/zod"
import { useRouter } from "next/navigation"
import ErrorMessage from '../../../components/ErrorMessage/ErrorMessage'
import styles from "./SearchBook.module.scss"

const SearchBook = () => {
    const [searchQuery, setSearchQuery] = useState('')
    const [error, setError] = useState('')
    const router = useRouter()

    const handleSubmit = (event) => {
        event.preventDefault()
        setError('')

        const formData = new FormData(event.currentTarget)
        const data = Object.fromEntries(formData.entries())
        const validation = searchSchema.safeParse(data)

        if (!validation.success) {
            setError(validation.error.issues[0].message)
            return
        }

        router.push(`/search/${encodeURIComponent(searchQuery.trim())}`)
    }

    return (
        <div className={styles.wrapper}>
            <form className={styles.form} onSubmit={handleSubmit}>
                <input
                    className={styles.input}
                    id="searchQuery"
                    type="search"
                    value={searchQuery}
                    name="searchQuery"
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Eugene Onegin"
                />
                {error && <ErrorMessage error={error} />}
            </form>
        </div>
    )
}

export default SearchBook