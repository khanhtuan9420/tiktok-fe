import classNames from 'classnames/bind';
import styles from './FollowBtn.module.scss';
import Button from '../Button';
import { useContext, useEffect, useState } from 'react';
import Context from '~/store/Context';
import * as followService from '../../services/followService'


const cx = classNames.bind(styles)

function FollowBtn({ data }) {
    const { setShowLogin } = useContext(Context).login
    const { currentUser } = useContext(Context).user
    const { followIds, setFollowIds } = useContext(Context).followIds
    const [isFollowed, setIsFollowed] = useState(data.data.follow)
    const [isHover, setIsHover] = useState(false)

    const handleFollow = () => {
        if (currentUser.nickname) {
            setIsFollowed(true)
            const fetchApi = async () => {
                const res = await followService.follow(currentUser.id, data.data.id)
            }
            fetchApi()
            setFollowIds(prev => {
                return [...prev, data.data.id]
            })
        } else {
            setShowLogin(true)
        }
    }
    const handleUnfollow = () => {
        const fetchApi = async () => {
            const res = await followService.unfollow(currentUser.id, data.data.id)
        }
        setIsFollowed(false)
        setFollowIds(prev => {
            prev.splice(prev.indexOf(data.data.id), 1)
            return [...prev]
        })
        fetchApi()
    }


    useEffect(() => {
        if (followIds.indexOf(data.data.id) !== -1) {
            setIsFollowed(true)
            setIsHover(false)
        } else {
            setIsFollowed(false)
        }
    }, [followIds])

    useEffect(() => {
        setIsFollowed(data.data.follow)
    }, [data.data.follow])

    return (
        <div className={cx('button-wrapper')}>
            {
                isFollowed ?
                    <>
                        <Button onClick={handleUnfollow} outline_1 size="small" className={cx('btn-follow', { ["disable-hide"]: isHover })}>Hủy Follow</Button>
                        <Button onMouseLeave={() => setIsHover(false)} onMouseEnter={() => setIsHover(true)} onClick={handleUnfollow} className={cx('btn-follow', { hide: isHover })} outline_1 size="small">Đang Follow</Button>
                    </>
                    :
                    <Button onClick={handleFollow} outline primary size="small">
                        Follow
                    </Button>
            }
        </div>
    )
}

export default FollowBtn