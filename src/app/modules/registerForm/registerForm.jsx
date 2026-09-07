'use client'
import { registerSchema } from '../../../lib/zod'
import { useState } from "react"
import Button from '../../components/Button/Button'

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
        <form onSubmit={handleSubmit}>
            <input type="text" name="name" placeholder="username" />
            <input type="email" name="email" placeholder="email" />
            <input type="text" name="password" placeholder="password" />
            <input type="text" name="repeatPassword" placeholder="repeatPassword" />
            <Button type="submit" isPending={isPending}> create account </Button>
            {error && <p> {error}</p>}
        </form>
    )
}

export default RegisterForm