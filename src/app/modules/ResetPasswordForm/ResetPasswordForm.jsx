'use client'
import Button from "../../components/Button/Button"
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage"
import { useState } from "react"

const ResetPasswordForm = () => {
    const [error, setError] = useState('')
    const [isPending, setIsPending] = useState('false')

    return (
       <form action="">
        { error && <ErrorMessage error={error}/>}
       </form>


    )
}

export default ResetPasswordForm