import classNames from "classnames/bind"
import styles from './VideoViewer.module.scss'
import ReactPlayer from "react-player"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faAngleDown, faAngleUp, faCommentDots, faEllipsis, faHeart, faPlay, faShare, faVolumeHigh, faVolumeMute, faXmark } from "@fortawesome/free-solid-svg-icons"
import { faTiktok } from "@fortawesome/free-brands-svg-icons"
import { FacebookIcon, TikTokIconVer2 } from "../Icon"
import { useCallback, useContext, useEffect, useRef, useState } from "react"
import Context from "~/store/Context"
import PreviewAccount from "../PreviewAccount/PreviewAccount"
import imgs from "~/assets/images"
import { Link, useLocation, useNavigate, useParams } from "react-router-dom"
import Button from "../Button"
import { GoogleIcon } from "../Icon"
import { TwitterIcon } from "../Icon"
import { LINEicon } from "../Icon"
import { KakaoTalkIcon } from "../Icon"
import { ShareIcon } from "../Icon"
import Tippy from "@tippyjs/react/headless";
import { Wrapper as PopperWrapper } from '../Popper'
import * as videoService from '~/services/videoService'
import * as feedService from '~/services/feedService'
import * as likeService from '~/services/likeService'
import * as editPostService from '~/services/editPostService'
import Comment from "../Comment"
import FollowBtn from "../FollowBtn"

const cx = classNames.bind(styles)
function VideoViewer() {
    const [data, setData] = useState({})
    const location = useLocation()
    const [locationState, setLocationState] = useState(location.state)
    const { homeState, setHomeState } = useContext(Context).home
    const { currentUser } = useContext(Context).user
    const { setShowLogin } = useContext(Context).login
    const { likedAndComments, setLikedAndComments } = useContext(Context).likedAndComments
    const [switchEvent, setSwitchEvent] = useState(0)
    const [comments, setComments] = useState()
    const [likes, setLikes] = useState()
    const [isLiked, setIsLiked] = useState(false)
    const [allowComment, setAllowComment] = useState()
    const [animation, setAnimation] = useState(false)
    const [switchCommentBtn, setSwitchCommentBtn] = useState(false)
    const [switchDuetBtn, setSwitchDuetBtn] = useState(false)
    const [switchStitchBtn, setSwitchStitchBtn] = useState(false)
    const progressRef = useRef();
    const canvas = useRef()
    const progressWrapperRef = useRef();
    const playerRef = useRef();
    const currentTimeRef = useRef();
    const durationRef = useRef();
    const [showTimeLine, setShowTimeLine] = useState(false);
    const [play, setPlay] = useState(true);
    const [showEdit, setShowEdit] = useState(false)
    const { mute, setMute } = useContext(Context).sound
    const videoId = useParams()
    const navigate = useNavigate()

    const getFrame = () => {
        try {
            const video = playerRef.current?.player?.player.player;
            const canvasElement = canvas.current;
            const ctx = canvasElement.getContext('2d');

            // Thiết lập canvas kích thước bằng với kích thước video
            canvasElement.width = video.videoWidth;
            canvasElement.height = video.videoHeight;

            // Lấy khung hình thứ n
            const n = 1; // Ví dụ lấy khung hình thứ 10
            video.currentTime = n * (1 / (video.fps || 30));

            // Vẽ hình ảnh lên canvas
            ctx.drawImage(video, 0, 0, canvasElement.width, canvasElement.height, 0, 0, canvasElement.width, canvasElement.height);

            // Lấy dữ liệu hình ảnh từ canvas
            // const imageData = ctx.getImageData(0, 0, canvasElement.width, canvasElement.height);

            // Hiển thị hình ảnh trên canvas
            // ctx.putImageData(imageData, 0, 0)
        }
        catch (err) {
            console.log(err)
        }
    }

    // useEffect(() => {
    //     if (playerRef.current && !bg) playerRef.current?.player?.player.player.addEventListener('loadeddata', () => {
    //         setBg(true)
    //         getFrame()
    //     })
    // }, [playerRef.current])


    const handleProgress = (e) => {
        progressRef.current.style.width = `${e.played * 100}%`
        let time = Math.floor(e.playedSeconds)
        let res = ''
        let min = Math.floor(res / 60);
        res = min < 10 ? '0' + min + ':' : min + ' '
        let second = Math.ceil((time / 60 - min) * 60);
        if (second < 10) res += '0' + second
        else res += second
        currentTimeRef.current.innerText = res;
    }

    const handleSeek = (e) => {
        const temp = Math.floor(e.target.getBoundingClientRect().x)
        const seekToValue = (e.clientX - temp) / progressWrapperRef.current.clientWidth
        progressRef.current.style.width = `${e.clientX - e.target.getBoundingClientRect().x}px`
        playerRef.current.seekTo(seekToValue, 'fraction')
    }

    const initDuration = () => {
        let time = playerRef.current.getDuration();
        let res = ''
        let min = Math.floor(res / 60);
        let second = Math.floor((time / 60 - min) * 60);
        if (second > 59) {
            min += second / 60
            second = second - 60
        }
        res = min < 10 ? '0' + min + ':' : min + ' '
        if (second < 10) res += '0' + second
        else res += second
        durationRef.current.innerText = res;
    }

    const toggleHide = () => {
        setShowTimeLine(prev => !prev)
    }

    const handlePlay = () => {
        setPlay(prev => !prev)
    }

    const handleBack = () => {
        navigate(locationState?.path || '/', {
            state: {
                path: window.location.pathname,
            }
        })
    }

    const handleLike = () => {
        if (!currentUser.nickname) {
            setShowLogin(true)
        } else {
            if (!isLiked) {
                const fetchApi = async () => {
                    const res = await likeService.like(currentUser.id, data.vId)
                }
                setLikes(prev => prev + 1)
                setIsLiked(true)
                setLikedAndComments(prev => {
                    for (let i = 0; i < prev.length; i++) {
                        if (prev[i].videoId === videoId.videoId) {
                            prev[i].likes = likes + 1
                            prev[i].isLiked = true
                            return [...prev]
                        }
                    }
                    return [...prev, { videoId: videoId.videoId, likes: likes + 1, isLiked: true, comments: comments }]
                })
                fetchApi()
            } else {
                const fetchApi = async () => {
                    const res = await likeService.dislike(currentUser.id, data.vId)
                }
                setLikes(prev => prev - 1)
                setIsLiked(false)
                setLikedAndComments(prev => {
                    for (let i = 0; i < prev.length; i++) {
                        if (prev[i].videoId === videoId.videoId) {
                            prev[i].likes--;
                            prev[i].isLiked = false
                            return [...prev]
                        }
                    }
                    return [...prev, { videoId: videoId.videoId, likes: likes - 1, isLiked: false, comments: comments }]
                })
                fetchApi()
            }
        }
    }

    useEffect(() => {
        const fetchApi = async () => {
            const res = await videoService.getVideo(videoId.videoId, currentUser.id)
            setData(res[0])
            setComments(res[0].comment)
            setLikes(res[0].likes)
            setIsLiked(res[0].isLiked)
            setAllowComment(!!res[0].allowComment)
            setSwitchCommentBtn(!!res[0].allowComment)
        }
        fetchApi()
    }, [videoId.videoId])

    const switchVideo = (i) => {
        let nickname, videoId
        setHomeState(prev => {
            if (prev.index === 0 && i === -1) i = 0
            if (prev.index)
                nickname = homeState.feed[prev.index + i].nickname
            videoId = homeState.feed[prev.index + i].videoId
            navigate(`/profile/${nickname}/video/${videoId}`)
            return { ...prev, index: prev.index + i, y: prev.y + i * 700 }
        })
    }

    const switchVideoFromProfile = (i) => {
        let videoId
        setLocationState(prev => {
            if (prev.index === 0 && i === -1) i = 0
            if (prev.index === locationState.listVideo.length - 1 && i === 1) {
                return { ...prev }
            } else {
                videoId = locationState.listVideo[prev.index + i].videoId
                navigate(`/profile/${locationState.nickname}/video/${videoId}`)
                return { ...prev, index: prev.index + i, y: prev.y + i * 700 }
            }
        })
    }

    const fetchApi = async () => {
        let res = await feedService.moreFeed(homeState.previousIds || [])
        const previousIds = res.map((e) => e.vId)
        if (res.length < 1) return 0;
        if (homeState.feed) {
            setHomeState(prev => {
                navigate(`/profile/${res[0].nickname}/video/${res[0].videoId}`)
                return { ...prev, y: prev.y + 700, index: prev.index + 1, feed: [...prev.feed, ...res], previousIds: [...prev.previousIds, ...previousIds] }
            })
        }
    }

    const switchDown = () => {
        if (locationState.path === '/') {
            if (homeState.index + 1 === homeState.feed.length) {
                fetchApi()
            }
            else switchVideo(1)
        }
        else switchVideoFromProfile(1)
    }

    const switchUp = () => {
        if (locationState.path === '/')
            switchVideo(-1)
        else switchVideoFromProfile(-1)
    }

    const handleSwitchVideo = useCallback((e) => {
        if (e.keyCode === 40) {
            switchDown()
        } else if (e.keyCode === 38) {
            switchUp()
        }
    }, [homeState])

    const handleEditPost = () => {
        setShowEdit(true)
        setAnimation(true)
    }

    const handleHideEditForm = () => {
        setAnimation(false)
        setTimeout(() => {
            setShowEdit(false)
        }, 300)
    }

    const handleDeleteVideo = () => {
        setAllowComment(false)
    }

    const handleSubmitEdit = async () => {
        const res = await editPostService.edit(videoId.videoId, switchCommentBtn)
        setAllowComment(switchCommentBtn)
        handleHideEditForm()
    }

    useState(() => {
        if (playerRef.current) {
            playerRef.current.seekTo(0, 'fraction')
        }
    }, [videoId.videoId])

    useEffect(() => {
        window.addEventListener('keydown', handleSwitchVideo)

        return () => {
            window.removeEventListener('keydown', handleSwitchVideo)
        }
    }, [handleSwitchVideo])

    useEffect(() => {
        if (!locationState?.path) {
            window.removeEventListener('keydown', handleSwitchVideo)
        }
    }, [locationState])


    return (
        <div className={cx('wrapper')}>
            {
                showEdit &&
                <div onClick={handleHideEditForm} className={cx('form-container', {
                    // hide: animation,
                    ["toggle-hide-wrapper"]: animation,
                    ["hide-wrapper"]: !animation,
                })}>
                    <div onClick={(e) => e.stopPropagation()} className={cx('edit-form', {
                        // hide: animation,
                        ["toggle-hide-content"]: animation,
                        ["hide-content"]: !animation,
                    })}>
                        <div style={{ padding: '32px 32px 0 32px' }}>
                            <h2>Cài đặt quyền riêng tư</h2>
                            <div className={cx('edit-options')}>
                                <div className={cx('edit-option')}>
                                    <p>Cho phép bình luận</p>
                                    <div onClick={() => setSwitchCommentBtn(prev => !prev)} className={cx('switch-btn', { switched: switchCommentBtn })}>
                                        <span></span>
                                    </div>
                                </div>
                                <div className={cx('edit-option')}>
                                    <p>Cho phép Duet và Tương tác</p>
                                    <div onClick={() => setSwitchDuetBtn(prev => !prev)} className={cx('switch-btn', { switched: switchDuetBtn })}>
                                        <span></span>
                                    </div>
                                </div>
                                <div className={cx('edit-option')}>
                                    <p>Cho phép Stitch</p>
                                    <div onClick={() => setSwitchStitchBtn(prev => !prev)} className={cx('switch-btn', { switched: switchStitchBtn })}>
                                        <span></span>
                                    </div>
                                </div>
                            </div>
                            <p className={cx('small-desc')}>Các video thuộc tài khoản riêng tư không hỗ trợ tính năng Duet và Stitch</p>
                        </div>
                        <div onClick={handleSubmitEdit} className={cx('sumit-edit-btn')}>
                            Xong
                        </div>
                    </div>
                </div>
            }
            <section className={cx('video-section')}>
                <button onClick={handleBack} className={cx('btn', 'close-btn')}>
                    <FontAwesomeIcon icon={faXmark} />
                </button>
                <button className={cx('logo')}>
                    <TikTokIconVer2 />
                </button>
                {
                    ((locationState?.listVideo && locationState.index !== locationState.listVideo.length - 1) || (!!locationState && locationState.path === '/')) &&
                    <button onClick={switchDown} className={cx('btn', 'down-btn')}>
                        <FontAwesomeIcon icon={faAngleDown} />
                    </button>
                }
                {
                    ((locationState?.listVideo && locationState.index !== 0) || (!locationState?.listVideo && homeState.feed && homeState.index !== 0)) &&
                    <button onClick={switchUp} className={cx('btn', 'up-btn')}>
                        <FontAwesomeIcon icon={faAngleUp} />
                    </button>
                }
                <button onClick={() => setMute(prev => !prev)} className={cx('btn', 'volume-btn')}>
                    {mute ?
                        <FontAwesomeIcon icon={faVolumeMute} /> :
                        <FontAwesomeIcon icon={faVolumeHigh} />
                    }
                </button>
                {
                    !play &&
                    <button onClick={handlePlay} className={cx('play-btn')}>
                        <FontAwesomeIcon icon={faPlay} />
                    </button>
                }
                <canvas ref={canvas} id="myCanvas" width="322px" height="576px"></canvas>
                <div onMouseEnter={toggleHide} onMouseLeave={toggleHide} onClick={handlePlay} className={cx('youtube-container')}>
                    <ReactPlayer playing={play} muted={mute} ref={playerRef} onReady={initDuration} onProgress={handleProgress} loop width="424px" height="758px" url={videoId.videoId.length === 11 ? `https://www.youtube.com/shorts/${videoId.videoId}` : `https://res.cloudinary.com/dzidmf6gq/video/upload/v1684165341/video/${videoId.videoId}`} config={
                        {
                            youtube: {
                                playerVars: {
                                    rel: 0,
                                }
                            }
                        }
                    }
                    />
                    <div onClick={e => e.stopPropagation()} className={cx("progress-container", { hide: !showTimeLine })}>
                        <div ref={progressWrapperRef} onClick={handleSeek} className={cx('process-wrapper')}>
                            <div className={cx('process')}></div>
                            <div ref={progressRef} className={cx('current-process')}>
                                <div className={cx('circle')}></div>
                            </div>
                        </div>
                        <div className={cx('time')}>
                            <span ref={currentTimeRef} className={cx('current-time')}>00:00</span>
                            <span>/</span>
                            <span ref={durationRef} className={cx('duration')}>00:00</span>
                        </div>
                    </div>
                </div>
            </section>
            <section className={cx('chat-section')}>
                <header className={cx('header')}>
                    <PreviewAccount data={{ data: data }}>
                        <Link>
                            <div className={cx('header-content')}>
                                <img className={cx('avatar')} src={data.avatar}></img>
                                <div>
                                    <p className={cx('nickname')}>{data.nickname}</p>
                                    <p className={cx('full-name')}>{data["full_name"]}</p>
                                </div>
                            </div>
                        </Link>
                    </PreviewAccount>
                    {/* <Button width={"106px"} outline size="small">Follow</Button> */}
                    {
                        currentUser.id === data.id ?
                            <Tippy
                                hideOnClick={false}
                                placement="bottom-end"
                                delay={[0, 700]}
                                interactive
                                offset={[20, 10]}
                                render={(attrs) => (
                                    <div className={cx('')} tabIndex="-1" {...attrs}>
                                        <PopperWrapper>
                                            <div className={cx("edit-option-container")}>
                                                <p onClick={handleEditPost}>Cài đặt quyền riêng tư</p>
                                                <p onClick={handleDeleteVideo}>Xóa</p>
                                            </div>
                                        </PopperWrapper>
                                    </div>
                                )}
                            >
                                <button className={cx('edit-btn')}>
                                    <FontAwesomeIcon icon={faEllipsis} />
                                </button>
                            </Tippy>
                            :
                            <FollowBtn data={{ data: data }} />
                    }
                </header>
                <div className={cx('post-content')}>
                    <p className={cx('caption')}>{data.caption}</p>
                    <div className={cx('react-and-share')}>
                        <div className={cx('react')}>
                            <button onClick={handleLike} className={cx('react-btn', { active: isLiked })}>
                                <FontAwesomeIcon icon={faHeart} />
                            </button>
                            <strong className={cx('number-react')}>{likes}</strong>
                            <button className={cx('react-btn')}>
                                <FontAwesomeIcon icon={faCommentDots} />
                            </button>
                            <strong className={cx('number-react')}>{comments}</strong>
                        </div>
                        <div className={cx('share')}>
                            <FacebookIcon />
                            <GoogleIcon />
                            <TwitterIcon />
                            <LINEicon />
                            <KakaoTalkIcon />
                            <button className={cx('share-btn')}>
                                <FontAwesomeIcon icon={faShare} />
                            </button>
                        </div>
                    </div>
                    <div className={cx('link-wrapper')}>
                        <p className={cx('link')}>{window.location.href}</p>
                        <button className={cx('copy-btn')}>Sao chép liên kết</button>
                    </div>
                </div>
                <div className={cx('comment-section')}>
                    <Comment ownerId={data.id} allowComment={allowComment} setComments={setComments} videoId={videoId.videoId} />
                </div>
            </section>
        </div>
    )
}

export default VideoViewer