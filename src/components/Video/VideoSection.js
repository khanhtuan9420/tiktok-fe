import classNames from 'classnames/bind';
import styles from './Video.module.scss';
// import video from "~/assets/video";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { faCommentDots, faHeart, faPause, faPlay, faShare, faVolumeHigh, faVolumeXmark } from '@fortawesome/free-solid-svg-icons';
import ReactPlayer from 'react-player';
import Context from '~/store/Context';
import { Link, useNavigate } from 'react-router-dom';
import * as likeService from '../../services/likeService'
import { useInView } from 'react-intersection-observer';
const cx = classNames.bind(styles);
function VideoSection({ data }) {
    const context = useContext(Context)
    const { homeState, setHomeState } = context.home
    const { currentUser } = context.user
    const { setShowLogin } = context.login
    const { likedAndComments, setLikedAndComments } = useContext(Context).likedAndComments
    const [play, setPlay] = useState(false)
    const [forcePause, setForcePause] = useState(false)
    const { reloadFeed, setReloadFeed } = useContext(Context).reloadFeed
    const [show, setShow] = useState(false);
    const [isLiked, setIsLiked] = useState(data.data.isLiked)
    const [comments, setComments] = useState(data.data.comment)
    const [likes, setLikes] = useState(data.data.likes)
    const playBtnClasses = cx('play-icon', 'icon', { show: show })
    const muteBtnClasses = cx('mute-icon', 'icon', { show: context.sound.mute || show })
    const divRef = useRef()
    const navigate = useNavigate()
    const playerRef = useRef()
    const [ref, inView] = useInView({ threshold: 0.6 });

    const handleLike = () => {
        if (!currentUser.nickname) {
            setShowLogin(true)
        }
        else {
            if (!isLiked) {
                const fetchApi = async () => {
                    const res = await likeService.like(currentUser.id, data.data.vId)
                }
                setLikes(prev => prev + 1)
                setIsLiked(true)
                setLikedAndComments(prev => {
                    for (let i = 0; i < prev.length; i++) {
                        if (prev[i].videoId === data.data.videoId) {
                            prev[i].likes = likes + 1
                            prev[i].isLiked = true
                            return [...prev]
                        }
                    }
                    return [...prev, { videoId: data.data.videoId, likes: likes + 1, isLiked: true, comments: comments }]
                })
                fetchApi()
            }
            else {
                const fetchApi = async () => {
                    const res = await likeService.dislike(currentUser.id, data.data.vId)
                }
                setLikes(prev => prev - 1)
                setIsLiked(false)
                setLikedAndComments(prev => {
                    for (let i = 0; i < prev.length; i++) {
                        if (prev[i].videoId === data.data.videoId) {
                            prev[i].likes--;
                            prev[i].isLiked = false
                            return [...prev]
                        }
                    }
                    return [...prev, { videoId: data.data.videoId, likes: likes - 1, isLiked: false, comments: comments }]
                })
                fetchApi()
            }
        }
    }

    const handlePlayVideo = () => {
        setPlay(prev => !prev)
        setForcePause(prev => !prev)
    }

    const handleMouseOver = () => {
        setShow(true)
    }

    const handleMouseOut = () => {
        setShow(false)
    }

    const handleMute = () => {
        context.sound.setMute(prev => !prev)
    }

    const handleSaveOffset = (option) => {
        const bound = divRef.current.getBoundingClientRect();
        const y = option?.offset ? window.scrollY + option.offset : window.scrollY
        setHomeState(prev => {
            return { ...prev, y: y, boundTop: bound.top, index: data.data.index }
        })
    }

    const handleReadComment = () => {
        navigate(`/profile/${data.data.nickname}/video/${data.data.videoId}`, {
            state: {
                path: window.location.pathname
            }
        })
    }

    // useEffect(() => {
    //     const bound = divRef.current.getBoundingClientRect();
    //     let top = bound.top - 170;
    //     if (bound.top >= 160 && bound.top <= 170) {
    //         setPlay(true)
    //     }
    //     if (homeState.y && bound.top === homeState.boundTop) {
    //         setPlay(true)
    //     }
    //     if (homeState.y) {
    //         top += homeState.y;
    //     }
    //     const handleScroll = (e) => {
    //         if (window.scrollY >= top - bound.height / 2 && window.scrollY <= top + bound.height / 2 && !forcePause) {
    //             setPlay(true)
    //         }
    //         else {
    //             if (playerRef.current) playerRef.current.seekTo(0, 'fraction')
    //             setPlay(false)
    //         }
    //         // handleSaveOffset()
    //     }
    //     const handleKeyDown = (e) => {
    //         if (e.keyCode === 40 || e.keyCode === 38) handleScroll()
    //     }
    //     window.addEventListener('scroll', handleScroll)
    //     window.addEventListener('keydown', handleKeyDown)

    //     return () => {
    //         window.removeEventListener('scroll', handleScroll)
    //         window.removeEventListener('keydown', handleKeyDown)
    //     }
    // }, [])

    useEffect(() => {
        handleSaveOffset({ offset: 40 })
    }, [play])

    useEffect(() => {
        setPlay(inView)
        if (playerRef.current) playerRef.current.seekTo(0, 'fraction')
    }, [inView])
    useEffect(() => {
        if (!reloadFeed) setComments(data.data.comment)
    }, [reloadFeed, data.data.comment])
    useEffect(() => {
        if (!reloadFeed) setLikes(data.data.likes)
    }, [reloadFeed, data.data.likes])
    useEffect(() => {
        if (!reloadFeed) setIsLiked(data.data.isLiked)
    }, [reloadFeed, data.data.isLiked])

    useEffect(() => {
        // console.log(likedAndComments)
        setComments(prev => {
            for (let i = 0; i < likedAndComments.length; i++) {
                if (likedAndComments[i].videoId === data.data.videoId)
                    return likedAndComments[i].comments;
            }
            return prev
        })
        for (let i = 0; i < likedAndComments.length; i++) {
            if (likedAndComments[i].videoId === data.data.videoId && likedAndComments[i].likes != null) {
                // console.log(likedAndComments[i])
                setIsLiked(likedAndComments[i].isLiked)
                setLikes(likedAndComments[i].likes)
                break;
            }
        }

    }, [likedAndComments])


    return (
        <div ref={ref} className={cx('video-section-wrapper')} onClick={handleSaveOffset}>
            <div ref={divRef} className={cx('video-section')} onMouseEnter={handleMouseOver} onMouseLeave={handleMouseOut}>
                <Link to={`/profile/${data.data.nickname}/video/${data.data.videoId}`} state={{ path: window.location.pathname }} className={cx('youtube-container')}>
                    <ReactPlayer ref={playerRef} loop playing={play} muted={context.sound.mute} width="322px" height="576px" url={data.data.videoId.length === 11 && false ? `https://www.youtube.com/shorts/Jdq_uxkyjdU` : `https://res.cloudinary.com/dzidmf6gq/video/upload/v1684165341/video/${data.data.videoId}`} config={
                        {
                            youtube: {
                                playerVars: {
                                    rel: 0,
                                }
                            }
                        }
                    }
                    />
                </Link>
                <button className={playBtnClasses} onClick={handlePlayVideo}>
                    {!play && <FontAwesomeIcon icon={faPlay} />}
                    {play && <FontAwesomeIcon icon={faPause} />}
                </button>
                <button className={muteBtnClasses} onClick={handleMute}>
                    {context.sound.mute && <FontAwesomeIcon icon={faVolumeXmark} />}
                    {!context.sound.mute && <FontAwesomeIcon icon={faVolumeHigh} />}
                </button>
            </div>
            <div className={cx('reaction')}>
                <button onClick={handleLike}>
                    <span className={cx('reaction-icon', { active: isLiked })}>
                        <FontAwesomeIcon icon={faHeart} />
                    </span>
                    <strong>{likes}</strong>
                </button>
                <button onClick={handleReadComment}>
                    <span className={cx('reaction-icon')}>
                        <FontAwesomeIcon icon={faCommentDots} />
                    </span>
                    <strong>{comments}</strong>
                </button>
                <button>
                    <span className={cx('reaction-icon')}>
                        <FontAwesomeIcon icon={faShare} />
                    </span>
                    <strong>0</strong>
                </button>
            </div>
        </div>
    )
}

export default VideoSection