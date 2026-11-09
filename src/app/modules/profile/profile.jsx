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
                <svg
                    width="300"
                    height="300"
                    viewBox="0 0 512 512"
                    fill="none"
                    xmlns="http://w3.org"
                >
                    <defs>
                        <radialGradient id="softBg" cx="50%" cy="45%" r="55%">
                            <stop offset="0%" stopColor="#FAF7F0" />
                            <stop offset="100%" stopColor="#EFE8D8" />
                        </radialGradient>

                        <clipPath id="circleClip">
                            <circle cx="256" cy="256" r="256" />
                        </clipPath>
                    </defs>

                    <g clipPath="url(#circleClip)">

                        <circle cx="256" cy="256" r="256" fill="url(#softBg)" />


                        <circle cx="256" cy="186" r="98" style={{ fill: '#DFD3BC' }} />


                        <path
                            d="M58 465C58 358 146 286 256 286C366 286 454 358 454 465V512H58V465Z"
                            style={{ fill: '#DFD3BC' }}
                        />
                    </g>
                </svg>
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
