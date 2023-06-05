import React, { useState, useEffect, useRef, useContext } from "react";
import socketIOClient from "socket.io-client";
import classNames from "classnames/bind";
import styles from './Comment.module.scss'
import imgs from "~/assets/images";
import * as commentService from '~/services/commentService'
import Context from "~/store/Context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { useParams } from "react-router-dom";
import Login from "../Login";



const host = "https://khanhtuan-tiktok-be.onrender.com:5501";

const cx = classNames.bind(styles)

function Comment({ videoId, setComments, allowComment, ownerId }) {
    const [mess, setMess] = useState([]);
    const { setShowLogin } = useContext(Context).login;
    const [allowScroll, setAllowScroll] = useState(false);
    const { currentUser } = useContext(Context).user
    const [message, setMessage] = useState('');
    const [id, setId] = useState();
    const socketRef = useRef();
    const messagesEnd = useRef();
    const time = new Date();
    const params = useParams()
    const { likedAndComments, setLikedAndComments } = useContext(Context).likedAndComments


    useEffect(() => {
        socketRef.current = socketIOClient(host)
        socketRef.current.on('getId', data => {
            setId(data)
        })

        socketRef.current.on('message', dataGot => {
            setMess(oldMsgs => [...oldMsgs, dataGot.data])
            // scrollToBottom()
        })

        socketRef.current.emit('subscribe', `${videoId}`)

        return () => {
            socketRef.current.disconnect();
        };
    }, [params.videoId]);

    useEffect(() => {
        const fetchApi = async () => {
            const res = await commentService.getComments(videoId)
            console.log(res)
            setMess(res)
        }
        setAllowScroll(prev => {
            return false
        })
        fetchApi()
    }, [params.videoId])

    const sendMessage = () => {
        setAllowScroll(true)
        if (message !== null) {
            const msg = {
                content: message,
                id: id,
                userId: currentUser.id,
                videoId: videoId,
                avatar: currentUser.avatar,
                nickname: currentUser.nickname
            }
            socketRef.current.emit('send', { room: `${videoId}`, msg: msg })
            setLikedAndComments(prev => {
                for (let i = 0; i < prev.length; i++) {
                    if (prev[i].videoId === videoId) {
                        if (prev[i].comments) prev[i].comments++
                        else prev[i].comments = mess.length + 1;
                        return [...prev]
                    }
                }
                return [...prev, { videoId: videoId, comments: mess.length + 1 }]
            })
            setComments(prev => prev + 1)
            setMessage('')
        }
    }

    const scrollToBottom = () => {
        messagesEnd.current.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(() => {
        if (allowScroll) {
            scrollToBottom()
        }
    }, [mess])

    const handleDate = (m) => {
        let res = ''
        if (m['update_At']) {
            if ('' + time.getFullYear() == m['update_At'].substring(0, 4)) res += m['update_At'].substring(5, 10)
            else res += m['update_At'].substring(0, 10)
        } else {
            const month = time.getMonth() + 1 < 10 ? '0' + (time.getMonth() + 1) : (time.getMonth() + 1)
            const day = time.getDate() < 10 ? '0' + time.getDate() : time.getDate()
            res += month + '-' + day
        }
        return res
    }


    const renderMess = () => {
        return mess.map((m, index) =>
            <div key={index} className={cx('comment-wrapper')}>
                <img className={cx('avatar')} src={m.avatar} />
                <div className={cx('comment-content')}>
                    <strong className={cx('nickname')}>{m.nickname}</strong>
                    <p className={cx('name')}>{m.content}</p>
                    <p className={cx('time-and-reply')}>
                        <span className={cx('time')}>
                            {handleDate(m)}
                        </span>
                        <span className={cx('reply')}>Trả lời</span>
                    </p>
                </div>
                <div className={cx('heart')}>
                    <FontAwesomeIcon icon={faHeart} />
                </div>
            </div>
        )
    }

    const handleChange = (e) => {
        setMessage(e.target.value)
    }

    const onEnterPress = (e) => {
        if (e.keyCode == 13 && e.shiftKey == false) {
            sendMessage()
        }
    }



    return (
        <div className={cx("box-chat")}>
            <div className={cx("box-chat_message")}>
                {renderMess()}
                <div className={cx('message-end')} style={{ float: "left", clear: "both" }}
                    ref={messagesEnd}>
                    Hết bình luận
                </div>
            </div>
            <div className={cx('add-comment-container')}>
                {
                    !currentUser.nickname ?
                        (
                            !allowComment ?
                                <p style={{ color: 'var(--text-color)' }}>
                                    Chủ bài viết đã tắt tính năng bình luận cho video này
                                </p>
                                :
                                <div onClick={() => setShowLogin(true)} className={cx('login-required')}>
                                    Đăng nhập để bình luận
                                </div>
                        )
                        :
                        (
                            currentUser.id === ownerId ?
                                <>
                                    <input value={message} onKeyDown={onEnterPress} onChange={handleChange} className={cx('input-comment')} type="text" placeholder="Thêm bình luận..." />
                                    <button onClick={sendMessage} className={cx('submit')}>Đăng</button>
                                </>
                                :
                                (
                                    !allowComment ?
                                        <p style={{ color: 'var(--text-color)' }}>
                                            Chủ bài viết đã tắt tính năng bình luận cho video này
                                        </p>
                                        :
                                        <>
                                            <input value={message} onKeyDown={onEnterPress} onChange={handleChange} className={cx('input-comment')} type="text" placeholder="Thêm bình luận..." />
                                            <button onClick={sendMessage} className={cx('submit')}>Đăng</button>
                                        </>
                                )
                        )
                }
            </div>
        </div>
    );
}

export default Comment;