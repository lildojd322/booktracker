import Link from 'next/link'
import Image from 'next/image'
import styles from './Navigation.module.scss'
import defaultavatar from '../../../icons/defaultavatar.png'

const Navigation = () => {
    return (
        <nav className={styles.navContainer}>
            <ul className={styles.navList}>
                <li>
                    <Link href="/" className={styles.navLink}>
                        Home
                    </Link>
                </li>
                <li className={styles.navItem}>
                    <Link href="/profile">
                        <Image 
                            className={styles.userAvatar}
                            src={defaultavatar.src} 
                            alt="avatar"
                            width={32}
                            height={32}
                        />
                    </Link>
                </li>
            </ul>
        </nav>
    )
}

export default Navigation
