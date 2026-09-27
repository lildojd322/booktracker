import styles from './Loading.module.scss'
import BookAnim from '../BookAnim/BookAnim'


const Loading = () => {
    return (
          <div className={styles.anim}>
            <BookAnim />
            <p>
                one moment...
            </p>

        </div>
    )
}

export default Loading