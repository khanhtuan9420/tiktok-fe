import classNames from 'classnames/bind';
import styles from './Video.module.scss';
import VideoItem from './VideoItem';
import { useEffect } from 'react';
const cx = classNames.bind(styles);

function Video({ data, followIds, setFollowIds }) {
    return (
        <div className={cx('wrapper')}>
            <VideoItem followIds={followIds} setFollowIds={setFollowIds} data={data} />
        </div>
    )
}

export default Video