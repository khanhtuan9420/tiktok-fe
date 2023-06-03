import imgs from "~/assets/images";
import PreviewAccount from "../PreviewAccount/PreviewAccount";
import Button from "../Button";
import classNames from 'classnames/bind';
import styles from './Video.module.scss';
import video from "~/assets/video";
import VideoSection from "./VideoSection";
import ReactPlayer from "react-player";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import useHashTag from "~/hooks/useHashTag";
import { useContext, useEffect, useState } from "react";
import * as followService from '../../services/followService'
import Context from "~/store/Context";
import FollowBtn from "../FollowBtn";
const cx = classNames.bind(styles);


function VideoItem({ data, followIds, setFollowIds }) {

    const caption = useHashTag({ data: data.data.caption, classes: 'caption', truncate: true })
    const [isFollowed, setIsFollowed] = useState(data.data.follow)
    const [isHover, setIsHover] = useState(false)
    const { currentUser } = useContext(Context).user
    const { setShowLogin } = useContext(Context).login

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

    return (
        <div className={cx('video-wrapper')}>
            <PreviewAccount data={data}>
                <Link to={`/profile/${data.data.nickname}`}>
                    <img className={cx('avatar')} src={data.data.avatar} />
                </Link>
            </PreviewAccount>
            <div className={cx('container')}>
                <header className={cx('header')}>
                    <div className={cx('content')}>
                        <Link to={`/profile/${data.data.nickname}`}>
                            <h3 className={cx('username')}>{data.data.nickname}</h3>
                            {data.data.tick === 1 && <FontAwesomeIcon icon={faCheckCircle} />}
                            <h4 className={cx('name')}>{data.data["full_name"]}</h4>
                        </Link>
                        {/* {renderCaption(data.data.caption)} */}
                        {caption}
                    </div>
                    <FollowBtn data={data} />
                </header>
                <VideoSection data={data} />
            </div>
        </div>
    )
}

export default VideoItem;