'use client'
import Button from "../../components/Button/Button"
import { useState } from "react"
import { loginSchema } from '../../../lib/zod'
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import styles from './signinForm.module.scss'
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage"
import Input from "../../components/Input/Input"
import Link from "next/link"

const SignInForm = () => {
    const router = useRouter()
    const [error, setError] = useState('')
    const [isPending, setIsPending] = useState(false)

    const handleSubmit = async (event) => {
        event.preventDefault()
        setError('')
        setIsPending(true)

        const formData = new FormData(event.currentTarget)
        const data = Object.fromEntries(formData.entries())
        const validation = loginSchema.safeParse(data)

        if (!validation.success) {
            setError(validation.error.issues[0].message)
            setIsPending(false)
            return
        }

          try {

            const response = await fetch('/api/users/reaffirm/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(validation.data)
            })


            const resData = await response.json()

            if (!response.ok) {
                setError(resData.error || 'Something went wrong')
                setIsPending(false)
                return
            }
            if (resData.success) {
                sessionStorage.setItem('pending_verification_email', validation.data.email)
                router.push(`/emailConfirm`)
                router.refresh()
            }
        } catch (err) {
            setIsPending(false)
            setError('Failed to connect to server')
        } finally {
            setIsPending(false)
        }
    }

    return (
        <div className={styles.formWrapper}>
            <form onSubmit={handleSubmit} className={styles.form}>
                <h1 className={styles.title}>Sign In</h1>

                <div className={styles.inputGroup}>
                    <label htmlFor="email" className={styles.label}>Email</label>
                    <Input
                        type="email"
                        name="email"
                        id="email"
                        placeholder="email@example.com"
                        required
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label htmlFor="password" className={styles.label}>Password</label>
                    <Input
                        type="password"
                        name="password"
                        id="password"
                        placeholder="••••••••"
                        required
                    />
                </div>

                <Button type="submit" isPending={isPending} variant="primary">
                    Sign In
                </Button>


                <div className={styles.authFooter}>
                    <p>
                        Don't have an account? <Link href='/register'>Register right now</Link>
                    </p>
                    <p>
                        <Link href='/resetPassword'>forgot your password?</Link>
                    </p>
                </div>

                {error && <ErrorMessage error={error} />}
            </form>
        </div>
    )
}

export default SignInForm
