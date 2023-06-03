import classNames from "classnames/bind"
import styles from './EditProfile.module.scss'
import { useContext, useEffect, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faXmark } from "@fortawesome/free-solid-svg-icons"
import Context from "~/store/Context"
import Image from "../Image"
import { EditIcon } from "../Icon"
import Button from "../Button"
import * as editProfileService from '../../services/editProfileService'
import Loading from "../Loading"
import { useNavigate } from "react-router-dom"
const cx = classNames.bind(styles)
const editFormState = {
    HIDE: 0,
    SHOW: 1,
}
function EditProfile({ setShowFormFromParrent }) {
    const [animation, setAnimation] = useState(false)
    const [showForm, setShowForm] = useState(editFormState.SHOW)
    const { currentUser } = useContext(Context).user
    const [nickname, setNickname] = useState(currentUser.nickname)
    const [fullname, setFullname] = useState(currentUser['full_name'])
    const [avatar, setAvatar] = useState(currentUser.avatar)
    const [avatarFile, setAvatarFile] = useState()
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const handleChooseFile = (e) => {
        const file = e.target.files[0];
        file.preview = URL.createObjectURL(file)
        setAvatar(file.preview)
        setAvatarFile(file)
    }
    const handleSubmit = async (e) => {
        const uploadData = new FormData();
        uploadData.append("file", avatarFile);
        uploadData.append('nickname', nickname)
        uploadData.append('fullname', fullname)
        uploadData.append('oldAvatar', currentUser.avatar)
        uploadData.append('oldNickname', currentUser.nickname)
        setLoading(true)
        const res = await editProfileService.upload(uploadData)
        setLoading(false)
        navigate(`/profile/${nickname}`)
        window.location.reload()
    }

    const handleCloseForm = () => {
        setShowForm(editFormState.HIDE)
        setTimeout(() => {
            setShowFormFromParrent(false)
        }, 700)
    }

    useEffect(() => {
        return () => {
            URL.revokeObjectURL(avatar)
        }
    }, [avatar])
    return (
        <div className={cx('form-container', {
            hide: animation,
            ["toggle-hide-wrapper"]: showForm === editFormState.SHOW,
            ["hide-wrapper"]: showForm === editFormState.HIDE,
        })}>
            <div className={cx('edit-form', {
                hide: animation,
                ["toggle-hide-content"]: showForm === editFormState.SHOW,
                ["hide-content"]: showForm === editFormState.HIDE,
            })}>
                <div className={cx('edit-form-header')}>
                    Sửa hồ sơ
                    <button onClick={handleCloseForm}>
                        <FontAwesomeIcon icon={faXmark} />
                    </button>
                </div>
                <div className={cx("content-container")}>
                    <div className={cx('content-row')}>
                        <div className={cx('col-title')}>
                            Ảnh hồ sơ
                        </div>
                        <label htmlFor="avatar-input" className={cx("col-content", 'avatar-container')}>
                            <Image className={cx('avatar')} alt="" src={avatar} />
                            <div className={cx('pen')}>
                                <EditIcon />
                            </div>
                            <input onChange={handleChooseFile} id="avatar-input" className={cx('avatar-input')} type="file" />
                        </label>
                    </div>
                    <div className={cx('content-row')}>
                        <div className={cx('col-title')}>
                            TikTok ID
                        </div>
                        <div className={cx("col-content")}>
                            <input value={nickname} onChange={e => setNickname(e.target.value)} type="text" className={cx('edit-input')} />
                            <p className={cx('desc')}>
                                www.tiktok.com/user/{nickname}
                            </p>
                            <p className={cx('desc')}>
                                TikTok ID chỉ có thể bao gồm chữ cái, chữ số, dấu gạch dưới và dấu chấm. Khi thay đổi TikTok ID, liên kết hồ sơ của bạn cũng sẽ thay đổi.
                            </p>
                        </div>
                    </div>
                    <div className={cx('content-row')}>
                        <div className={cx('col-title')}>
                            Tên
                        </div>
                        <div className={cx("col-content")}>
                            <input value={fullname} onChange={e => setFullname(e.target.value)} type="text" className={cx('edit-input')} />
                            <p className={cx('desc')}>
                                Bạn chỉ có thể thay đổi biệt danh 7 ngày một lần.
                            </p>
                        </div>
                    </div>
                    <div className={cx('content-row', 'no-border')}>
                        <div className={cx('col-title')}>
                            Tiểu sử
                        </div>
                        <div className={cx("col-content")}>
                            <textarea placeholder="Tiểu sử" className={cx('resume')} />
                            <p className={cx('desc')}>
                                /80
                            </p>
                        </div>
                    </div>
                </div>
                <footer className={cx('edit-footer')}>
                    {
                        loading ?
                            <Loading width="100%" height="100%" />
                            :
                            <>
                                <Button outline_1>Hủy</Button>
                                <Button onClick={handleSubmit} primary>Lưu</Button>
                            </>
                    }
                </footer>
            </div>
        </div>
    )
}

export default EditProfile