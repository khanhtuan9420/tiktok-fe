import classNames from "classnames/bind"
import styles from './Profile.module.scss'
import Image from "~/components/Image"
import * as infoService from "~/services/getInfoService"
import { useContext, useEffect, useRef, useState } from "react"
import Button from "~/components/Button"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCheckCircle, faLock, faPenToSquare } from "@fortawesome/free-solid-svg-icons"
import { ShareIcon, UsersIcon } from "~/components/Icon"
import SmallVideo from "../components/SmallVideo"
import { useParams } from "react-router-dom"
import Context from "~/store/Context"
import EditProfile from "~/components/EditProfile"

const cx = classNames.bind(styles)

function Profile() {
    const [info, setInfo] = useState({})
    const [showEditForm, setShowEditForm] = useState(false)
    const { currentUser } = useContext(Context).user;
    const username = useParams();
    const videoBtnRef = useRef()
    const likedBtnRef = useRef()
    const bottomLineRef = useRef()
    const handleClickVideoBtn = (e) => {
        bottomLineRef.current.style.transform = `translateX(0)`
        bottomLineRef.current.style.width = `${videoBtnRef.current.clientWidth}px`
        videoBtnRef.current.style.color = `var(--text-color)`
        likedBtnRef.current.style.color = `#16182380`
    }
    const handleClickLikedBtn = (e) => {
        bottomLineRef.current.style.transform = `translateX(${videoBtnRef.current.clientWidth}px)`
        bottomLineRef.current.style.width = `${likedBtnRef.current.clientWidth}px`
        likedBtnRef.current.style.color = `var(--text-color)`
        videoBtnRef.current.style.color = `#16182380`
    }

    // useEffect(() => {
    //     console.log(9)
    //     const fetchApi = async () => {
    //         console.log(1)
    //         const res = await infoService.getInfo(username.nickname)
    //         console.log(res)
    //         setInfo(res);
    //     }
    //     fetchApi()
    // }, [])

    useEffect(() => {
        bottomLineRef.current.style.width = `${videoBtnRef.current.clientWidth}px`
        videoBtnRef.current.style.color = `var(--text-color)`
        const fetchApi = async () => {
            const res = await infoService.getInfo(username.nickname)
            setInfo(res);
        }
        fetchApi()
    }, [username])
    return (
        <div className={cx('container')}>
            {
                showEditForm &&
                <EditProfile setShowFormFromParrent={setShowEditForm} />
            }
            <header className={cx('header')}>
                <Image className={cx('avatar')} src={info.avatar} />
                <div className={cx('info')}>
                    <h4 className={cx('name')}>{info.nickname}
                        {info.tick === 0 && <FontAwesomeIcon icon={faCheckCircle} />}
                    </h4>
                    <p className={cx('fullname')}>{info['full_name']}</p>
                    <button className={cx('share-icon')}>
                        <ShareIcon width="24px" height="24px" />
                    </button>
                    {
                        currentUser.nickname === info.nickname ?
                            <Button onClick={() => { setShowEditForm(true) }} outline_1 leftIcon={<FontAwesomeIcon icon={faPenToSquare} />}>Sửa hồ sơ</Button>
                            :
                            <Button width={"164px"} outline>Tin nhắn</Button>
                    }
                </div>
            </header>
            <div className={cx('content')}>
                <strong className={cx('number')}>18</strong>
                <span className={cx('label')}>Đang Follow</span>
                <strong className={cx('number')}>9M</strong>
                <span className={cx('label')}>Follower</span>
                <strong className={cx('number')}>755M</strong>
                <span className={cx('label')}>Thích</span>
            </div>
            <div className={cx('video-section')}>
                <div className={cx('nav-bar')}>
                    <p onClick={handleClickVideoBtn} ref={videoBtnRef}>Video</p>
                    <p onClick={handleClickLikedBtn} ref={likedBtnRef}>
                        <FontAwesomeIcon icon={faLock} />
                        Đã thích
                    </p>
                    <div ref={bottomLineRef} className={cx('bottom-line')}></div>
                </div>
                <div className={cx('video-container')}>
                    {
                        info.videoList && info.videoList.length > 0 ?
                            info.videoList.map((e, index) => {
                                return <SmallVideo classes={cx('pd5', 'fl3')} index={index} listVideo={info.videoList} user={info.nickname} key={e.videoId} videoId={e.videoId} caption={e.caption} />
                            })
                            :
                            <div className={cx('novideo')}>
                                <UsersIcon width="120px" height="120px" />
                                <strong>Tải video đầu tiên của bạn lên</strong>
                                <p>Video của bạn sẽ xuất hiện tại đây</p>
                            </div>
                    }
                </div>
            </div>
        </div>
    )
}

export default Profile