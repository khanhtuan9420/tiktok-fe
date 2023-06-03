import classNames from "classnames/bind"
import styles from './Loading.module.scss'
const cx = classNames.bind(styles)

function Loading({ width = '100vw', height = '100vh', feed = false }) {
    return (
        <div style={{ width, height }} className={cx('loading', {
            feed: feed
        })}>
            <div className={cx('round-1', 'round')}></div>
            <div className={cx('round-2', 'round')}></div>
        </div>
    )
}

export default Loading