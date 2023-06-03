import ReactPlayer from "react-player"
import classNames from "classnames/bind"
import styles from './SmallVideo.module.scss'
import { useRef, useState } from "react"
import { useNavigate } from "react-router-dom"

const cx = classNames.bind(styles)

function SmallVideo({ classes, videoId, caption, user, listVideo, index }) {
    // const playerRef = useRef()
    // const [play, setPlay] = useState(false)
    // const handlePreviewVideo = () => {
    //     setPlay(true)
    // }
    const navigate = useNavigate()
    const handleSavePath = () => {
        navigate(`/profile/${user}/video/${videoId}`, {
            state: {
                path: window.location.pathname,
                nickname: user,
                listVideo,
                index
            }
        })
    }
    return (
        <div className={cx(classes, 'video-container')}>
            <div onClick={handleSavePath} className={cx('youtube-container')}>
                <ReactPlayer loop muted width="100%" height="" url={videoId.length === 11 ? `https://www.youtube.com/shorts/${videoId}` : `https://res.cloudinary.com/dzidmf6gq/video/upload/v1684165341/video/${videoId}`} config={
                    {
                        youtube: {
                            playerVars: {
                                rel: 0,
                            }
                        }
                    }
                }
                />
            </div>
            <p className={cx('caption')}>{caption}</p>
        </div>
    )
}

export default SmallVideo