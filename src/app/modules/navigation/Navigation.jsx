import Link from 'next/link'
import Image from 'next/image'
import styles from './Navigation.module.scss'
import defaultavatar from '../../../icons/defaultavatar.png'
import { getServerSession } from "next-auth/next"
import { authConfig } from '@/lib/auth'

const Navigation = async () => {

    const session = await getServerSession(authConfig)
    return (
        <nav className={styles.navContainer}>
            <ul className={styles.navList}>
                <li className={styles.navItem}>
                    <Link href="/" className={styles.navLink}>
                        Home
                    </Link>
                </li>
                <li className={styles.navItem}>
                    {session ? <Link href="/profile" className={styles.navItem}>
                        <Image
                            className={styles.userAvatar}
                            src={defaultavatar}
                            alt="avatar"
                            width={36}
                            height={36}
                            priority
                        />
                    </Link> : <Link href="/signIn" className={styles.navLink}>
                        sign in
                    </Link>}

                </li>
            </ul>
        </nav>
    )
}

export default Navigation
