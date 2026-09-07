'use client'
import Button from "../../components/Button/Button"
import { useState } from "react"
import { loginSchema } from '../../../lib/zod'
import { signIn } from "next-auth/react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

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

        const response = await signIn('credentials', {
            email: validation.data.email,
            password: validation.data.password,
            redirect: false,
        })

        if (response?.error === 'TooManyAttempts') {
            setError('Too many attempts. Please try again later.')
        } else if (response?.error) {
            setError('Invalid email or password')
        } else if (response && !response.error) {
            router.push(`/profile/${validation.data.username}`)
            router.refresh()
        }
        setIsPending(false)


    }



    return (
        <form onSubmit={handleSubmit}>
            <input type="email" name="email" id="email" placeholder="email" required />
            <input type="password" name="password" id="password" required />
            <Button type="submit" isPending={isPending}>sign in </Button>
            {error && <p>{error} </p>}
        </form>
    )
}

export default SignInForm