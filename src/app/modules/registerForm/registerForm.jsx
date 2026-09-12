'use client'
import { registerSchema } from '../../../lib/zod'
import { useState } from "react"
import Button from '../../components/Button/Button'
import styles from './registerForm.module.scss'
import Input from '../../components/Input/Input'
import Link from 'next/link'


const RegisterForm = () => {
    const [error, setError] = useState('')
    const [isPending, setIsPending] = useState(false)

    const handleSubmit = async (event) => {
        event.preventDefault()
        setError('')
        setIsPending(true)
        const targetForm = event.target
        const formData = new FormData(event.currentTarget)
        const data = Object.fromEntries(formData.entries())

        const validation = registerSchema.safeParse(data)

        if (!validation.success) {
            setError(validation.error.issues[0].message)
            setIsPending(false)
            return
        }

        const response = await fetch(`/api/users/create/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(validation.data)
        })

        if (response.ok) {
            setError('')
            targetForm.reset()
        } else {
            const result = await response.json()
            setError(result.error || 'Registration failed')
        }
        setIsPending(false)
    }

    return (
        <div className={styles.formWrapper}>
            <form onSubmit={handleSubmit} className={styles.form}>
                <h1 className={styles.title}>Create Account</h1>

                <div className={styles.inputGroup}>
                    <label htmlFor="name" className={styles.label}>Username</label>
                    <Input
                        type="text"
                        name="name"
                        id="name"
                        placeholder="username"
                        required

                    />
                </div>

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

                <div className={styles.inputGroup}>
                    <label htmlFor="repeatPassword" className={styles.label}>Repeat Password</label>
                    <Input
                        type="password"
                        name="repeatPassword"
                        id="repeatPassword"
                        placeholder="••••••••"
                        required
                    />
                </div>

                <Button type="submit" isPending={isPending} variant="primary">
                    Create Account
                </Button>

                <div className={styles.authFooter}>
                    <p>
                        Already have an account? <Link href='/signin'>Sign in </Link>

                    </p>
                </div>

                {error && <p className={styles.error}>{error}</p>}
            </form>
        </div>
    )
}

export default RegisterForm
