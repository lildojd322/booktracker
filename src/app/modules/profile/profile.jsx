'use client'
import styles from './profile.module.scss'
import { useParams } from "next/navigation"
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import defaultavatar from '../../../icons/defaultavatar.png'
import { useEffect, useState } from 'react'
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage'
import Loading from '../../components/Loading/Loading'

const Profile = () => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)


    const params = useParams()
    const username = params.username


    useEffect(() => {
        if (!username) return
        const fetchUser = async () => {
            try {
                setLoading(true)

                const response = await fetch(`/api/users/getUser?username=${encodeURIComponent(username)}`)
                const data = await response.json()

                if (!response.ok) {
                    throw new Error(data.error || "Error loading user")
                }

                setUser(data.user)
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }
        fetchUser()
    }, [username])

    const { data: session } = useSession()


    if (loading) return <Loading />
    if (error) return <ErrorMessage error={error} />
    if (!user) return <p>user not found</p>

    return (
        <div className={`container ${styles.profile}`}>

            <div className={styles.avatarBlock}>
                <Image
                    src={defaultavatar.src}
                    width={500}
                    height={500}
                    alt="avatar"
                />
                <p>
                    {user.name}
                </p>
            </div>

            <p>
                on the website with: {user?.created_at ? new Date(user?.created_at).toLocaleDateString() : '???'}
            </p>
        </div>
    )
}

export default Profile
