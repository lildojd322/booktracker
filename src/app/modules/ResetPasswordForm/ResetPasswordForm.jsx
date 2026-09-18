'use client'
import Button from "../../components/Button/Button"
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage"
import { useState } from "react"
import Input from "../../components/Input/Input"
import styles from './ResetPasswordForm.module.scss'
import { emailSchema } from '../../../lib/zod'
import { useRouter } from "next/navigation"

const ResetPasswordForm = () => {
    const router = useRouter()
    const [error, setError] = useState('')
    const [isPending, setIsPending] = useState(false)

    const handleSubmit = async (event) => {
        event.preventDefault()
        setError('')
        setIsPending(true)

        const formData = new FormData(event.currentTarget)
        const data = Object.fromEntries(formData.entries())
        const validation = emailSchema.safeParse(data)

        if (!validation.success) {
            setError(validation.error.issues[0].message)
            setIsPending(false)
            return
        }
        try {
            const response = await fetch('/api/users/resetPassword/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: validation.data.email,
                })
            })

            const resData = await response.json()

            if (!response.ok) {
                setError(resData.error || 'Something went wrong')
                setIsPending(false)
                return
            }
            if (resData.success) {
                sessionStorage.setItem('pending_verification_email', validation.data.email)
                router.push(`/resetPassword/verify`)
                router.refresh()
            }
        } catch (err) {
            setError('Failed to connect to server')
        }

    }


    return (
        <div className={styles.formWrapper}>
            <form onSubmit={handleSubmit} className={`${styles.form} container`} action="">
                Reset password
                <Input type="email"
                    name="email"
                    id="email"
                    placeholder="email@example.com"
                    required />
                <Button type="submit" isPending={isPending}>confirm </Button>

                {error && <ErrorMessage error={error} />}
            </form>
        </div>


    )
}

export default ResetPasswordForm