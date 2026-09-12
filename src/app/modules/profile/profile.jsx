'use client'
import styles from './profile.module.scss'
import { useParams } from "next/navigation"
import { useSession } from 'next-auth/react'

const Profile = () => {
    const params = useParams()
    const username = params.username

    const { data: session } = useSession()

    return (
        <div className={`container ${styles.profile}`}>
            <p>
                {username}
            </p>
            <p>
               on the website with: {session?.user?.createdAt ? new Date(session.user.createdAt).toLocaleDateString() : '???'}
            </p>
        </div>
    )
}

export default Profile
