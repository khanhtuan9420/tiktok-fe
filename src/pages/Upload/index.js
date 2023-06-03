import classNames from "classnames/bind"
import styles from './Upload.module.scss'
import Button from "~/components/Button"
import { useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faMinus, faPause, faPlay, faPlus, faScissors, faVolumeHigh, faVolumeMute } from "@fortawesome/free-solid-svg-icons";
import { SplitIcon } from "~/components/Icon";
import Context from "~/store/Context";
import * as uploadService from '../../services/uploadService'
import Loading from "~/components/Loading";
import { useNavigate } from "react-router-dom";


const cx = classNames.bind(styles)
const uploadingState = {
    pending: 0,
    uploading: 1,
    uploaded: 2,
}
function Upload() {
    const [isUploading, setIsUploading] = useState(uploadingState.pending)
    const [video, setVideo] = useState();
    const [file, setFile] = useState();
    const [name, setName] = useState();
    const [caption, setCaption] = useState();
    const [commentCheck, setCommentCheck] = useState(true);
    const [duetCheck, setDuetCheck] = useState(true);
    const [stitchCheck, setStitchCheck] = useState(true);
    const [switchBtnState, setSwitchBtnState] = useState(false);
    const [privacy, setPrivacy] = useState('Công khai');
    const [showPrivacyOptions, setShowPrivacyOptions] = useState(false);
    const privacyRef = useRef();
    const [play, setPlay] = useState(false);
    const [mute, setMute] = useState(false);
    const [showControl, setShowControl] = useState(false);
    const [duration, setDuration] = useState();
    const { currentUser } = useContext(Context).user;
    const navigate = useNavigate()
    const handleChooseFile = (e) => {
        const file = e.target.files[0];
        var index = file.name.indexOf('.')
        setName(file.name.slice(0, index))
        setCaption(file.name.slice(0, index))
        setFile(e.target.files[0])
        file.preview = URL.createObjectURL(file)
        setVideo(file.preview)
    }
    const videoElement = useRef()
    const canvas = useRef()
    const initDuration = (time) => {
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
        return res;
    }
    const getFrame = () => {
        const video = videoElement.current;
        setDuration(initDuration(video.duration))
        const canvasElement = canvas.current;
        const ctx = canvasElement.getContext('2d');

        // Thiết lập canvas kích thước bằng với kích thước video
        canvasElement.width = video.videoWidth;
        canvasElement.height = video.videoHeight;

        // Lấy khung hình thứ n
        const n = 2; // Ví dụ lấy khung hình thứ 10
        video.currentTime = n * (1 / (video.fps || 30));

        // Vẽ hình ảnh lên canvas
        ctx.drawImage(video, 0, 0, canvasElement.width, canvasElement.height, 0, 0, canvasElement.width, canvasElement.height);

        // Lấy dữ liệu hình ảnh từ canvas
        const imageData = ctx.getImageData(0, 0, canvasElement.width, canvasElement.height);

        // Hiển thị hình ảnh trên canvas
        ctx.putImageData(imageData, 0, 0)
    }

    const handlePlay = () => {
        setPlay(prev => {
            if (!prev) videoElement.current.play();
            else videoElement.current.pause();
            return !prev
        })
    }

    const handleMute = () => {
        setMute(prev => {
            if (mute) videoElement.current.muted = false;
            else videoElement.current.muted = true;
            return !prev
        })
    }

    const handlePrivacyValue = (e) => {
        setPrivacy(e.target.innerText)
    }

    const handleSubmitVideo = async (e) => {
        const uploadData = new FormData();
        uploadData.append("file", file);
        uploadData.append('caption', caption)
        uploadData.append('userId', currentUser.id)
        setIsUploading(uploadingState.uploading)
        const res = await uploadService.upload(uploadData)
        setIsUploading(uploadingState.uploaded)
        navigate(`/profile/${currentUser.nickname}`)
    }

    useEffect(() => {
        if (videoElement.current) videoElement.current.addEventListener('loadeddata', () => {
            setTimeout(() => {
                getFrame();
            }, 500)
        })
        return () => {
            URL.revokeObjectURL(video)
        }
    }, [video])
    return (
        <div className={cx('wrapper')}>
            {
                !video ?
                    <div className={cx('bg')}>
                        <label htmlFor="submit-upload" className={cx('content')}>
                            <img className={cx('upload-icon')} alt="" src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iMjkiIHZpZXdCb3g9IjAgMCA0MCAyOSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0yMS41MDAxIDI5SDMwLjVDMzUuNzQ2NyAyOSA0MCAyNC43NDY3IDQwIDE5LjVDNDAgMTQuNzExNSAzNi40NTcxIDEwLjc1MDQgMzEuODQ5NyAxMC4wOTUxQzMwLjkzNyA0LjM3Mjk3IDI1Ljk3OTIgMCAyMCAwQzEzLjM3MjYgMCA4IDUuMzcyNTggOCAxMkw4LjAwMDAxIDEyLjAxNDVDMy41MzgzMSAxMi4yNzMzIDAgMTUuOTczNCAwIDIwLjVDMCAyNS4xOTQ0IDMuODA1NTggMjkgOC41IDI5SDE4LjUwMDFWMTcuMTIxM0wxNS45MTQzIDE5LjcwNzFDMTUuNzE5MSAxOS45MDI0IDE1LjQwMjUgMTkuOTAyNCAxNS4yMDcyIDE5LjcwNzFMMTMuNzkzIDE4LjI5MjlDMTMuNTk3NyAxOC4wOTc2IDEzLjU5NzcgMTcuNzgxIDEzLjc5MyAxNy41ODU4TDE4LjkzOTUgMTIuNDM5M0MxOS41MjUyIDExLjg1MzYgMjAuNDc1IDExLjg1MzYgMjEuMDYwOCAxMi40MzkzTDI2LjIwNzIgMTcuNTg1OEMyNi40MDI1IDE3Ljc4MSAyNi40MDI1IDE4LjA5NzYgMjYuMjA3MiAxOC4yOTI5TDI0Ljc5MyAxOS43MDcxQzI0LjU5NzcgMTkuOTAyNCAyNC4yODEyIDE5LjkwMjQgMjQuMDg1OSAxOS43MDcxTDIxLjUwMDEgMTcuMTIxM1YyOVoiIGZpbGw9IiMxNjE4MjMiIGZpbGwtb3BhY2l0eT0iMC4zNCIvPgo8L3N2Zz4K" />
                            <p className={cx('text-main')}>Chọn video để tải lên</p>
                            <p className={cx('text-sub')}>Hoặc kéo và thả tập tin</p>
                            <p className={cx('text-sub')}>Có thể tách video dài thành nhiều phần để tăng khả năng hiển thị</p>
                            <div className={cx('text-video-info')}>
                                <p>MP4 hoặc WebM</p>
                                <p>Độ phân giải 720x1280 trở lên</p>
                                <p>Tối đa 30 phút</p>
                                <p>Nhỏ hơn 2GB</p>
                            </div>
                            <label className={cx('submit-btn')} htmlFor="submit-upload">
                                Chọn tập tin
                                <input onChange={handleChooseFile} id="submit-upload" type="file" />
                            </label>
                        </label>
                    </div>
                    :
                    <div className={cx('edit-upload-container')}>
                        <div className={cx('edit-video')}>
                            <div className={cx('block1')}>
                                <canvas ref={canvas} id="myCanvas" width="322px" height="576px"></canvas>
                                <div className={cx('name-and-time')}>
                                    <span className={cx('name', 'truncate')}>{name}</span>
                                    <span className={cx('time')}>00:00 - {duration}</span>
                                </div>
                                <Button primary size="small" leftIcon={<FontAwesomeIcon icon={faScissors} />}>Chỉnh sửa video</Button>
                            </div>
                            <div className={cx('block2')}>
                                <div className={cx('cut-option')}>
                                    <p className={cx('cut-option-guide')}>Tách thành nhiều phần để tăng khả năng hiển thị</p>
                                    <div className={cx('cut-option-btn')}>
                                        <span className={cx('minus', 'btn')}>
                                            <FontAwesomeIcon icon={faMinus} />
                                        </span>
                                        <span className={cx("number-to-cut", 'btn')}>
                                            2
                                        </span>
                                        <span className={cx('plus', 'btn')}>
                                            <FontAwesomeIcon icon={faPlus} />
                                        </span>
                                    </div>
                                </div>
                                <div className={cx('cut-btn')}>
                                    <Button leftIcon={<SplitIcon />} size="small" outline_1>Phân chia</Button>
                                </div>
                            </div>
                        </div>
                        <div className={cx('post-info')}>
                            <header className={cx('post-info-header')}>
                                <h4>Tải video lên</h4>
                                <p>Đăng video vào tài khoản của bạn</p>
                            </header>
                            <div className={cx('post-options')}>
                                <div onMouseEnter={() => setShowControl(true)} onMouseLeave={() => setShowControl(false)} className={cx('video-preview')}>
                                    <div className={cx('control-wrapper', { hide: !showControl })}>
                                        <button onClick={handlePlay} className={cx('play-btn')}>
                                            {
                                                play ?
                                                    <FontAwesomeIcon icon={faPause} /> :
                                                    <FontAwesomeIcon icon={faPlay} />
                                            }
                                        </button>
                                        <button className={cx('volume')} onClick={handleMute}>
                                            {
                                                mute ?
                                                    <FontAwesomeIcon icon={faVolumeMute} /> :
                                                    <FontAwesomeIcon icon={faVolumeHigh} />
                                            }
                                        </button>
                                    </div>
                                    <div className={cx('mobile-control')}></div>
                                    <div className={cx('header-title')}>
                                        <img alt="" src={`data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjYiIGhlaWdodD0iMjYiIHZpZXdCb3g9IjAgMCAyNiAyNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwXzI1NzFfMTI5MjMpIiBmaWx0ZXI9InVybCgjZmlsdGVyMF9kXzI1NzFfMTI5MjMpIj4KPHBhdGggZD0iTTguNTgyMTEgMS43MDI2MUwxMC42MjQzIDQuMDAwMTJINC41OTcxN0MzLjYxOTUgNC4wMDAxMiAyLjc4NTEyIDQuNzA2OTUgMi42MjQzOSA1LjY3MTMyTDIuMzYwNjkgNy4yNTM1MkMyLjMwOTg5IDcuNTU4MjkgMi41NDQ5MSA3LjgzNTcyIDIuODUzODggNy44MzU3MkgzLjg2NzY4QzQuMTEyMSA3LjgzNTcyIDQuMzIwNjkgNy42NTkwMiA0LjM2MDg3IDcuNDE3OTJMNC41NjIzNiA2LjIwOTAyQzQuNTgyNDUgNi4wODg0OCA0LjY4Njc1IDYuMDAwMTIgNC44MDg5NiA2LjAwMDEySDIxLjE5MTFDMjEuMzEzMyA2LjAwMDEyIDIxLjQxNzYgNi4wODg0OCAyMS40Mzc3IDYuMjA5MDJMMjEuNjM5MiA3LjQxNzkyQzIxLjY3OTQgNy42NTkwMiAyMS44ODggNy44MzU3MiAyMi4xMzI0IDcuODM1NzJIMjMuMTQ2MkMyMy40NTUyIDcuODM1NzIgMjMuNjkwMiA3LjU1ODI5IDIzLjYzOTQgNy4yNTM1MkwyMy4zNzU3IDUuNjcxMzJDMjMuMjE1IDQuNzA2OTUgMjIuMzgwNiA0LjAwMDEyIDIxLjQwMjkgNC4wMDAxMkgxNS4zNzAzTDE3LjQxMjYgMS43MDI2MUMxNy41OTYgMS40OTYyMSAxNy41Nzc0IDEuMTgwMTggMTcuMzcxIDAuOTk2NzE5TDE2LjYyMzYgMC4zMzIzNTZDMTYuNDE3MiAwLjE0ODg5NiAxNi4xMDEyIDAuMTY3NDg3IDE1LjkxNzcgMC4zNzM4NzhMMTIuOTk3MyAzLjY1OTM0TDEwLjA3NjkgMC4zNzM4NzhDOS44OTM0NyAwLjE2NzQ4NyA5LjU3NzQzIDAuMTQ4ODk2IDkuMzcxMDQgMC4zMzIzNTVMOC42MjM2MyAwLjk5NjcxOUM4LjQxNzI0IDEuMTgwMTggOC4zOTg2NSAxLjQ5NjIxIDguNTgyMTEgMS43MDI2MVoiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0yMC40NTA1IDkuODUwMTJDMjAuMTc0NCA5Ljg1MDEyIDE5Ljk1MDUgMTAuMDc0IDE5Ljk1MDUgMTAuMzUwMVYxNy4zNTAxQzE5Ljk1MDUgMTcuNjI2MyAyMC4xNzQ0IDE3Ljg1MDEgMjAuNDUwNSAxNy44NTAxSDI0LjE1QzI0LjQyNjEgMTcuODUwMSAyNC42NSAxNy42MjYzIDI0LjY1IDE3LjM1MDFWMTYuMzUwMUMyNC42NSAxNi4wNzQgMjQuNDI2MSAxNS44NTAxIDI0LjE1IDE1Ljg1MDFIMjEuOTcyNVYxNC44NTAxSDI0LjE1QzI0LjQyNjEgMTQuODUwMSAyNC42NSAxNC42MjYzIDI0LjY1IDE0LjM1MDFWMTMuMzUwMUMyNC42NSAxMy4wNzQgMjQuNDI2MSAxMi44NTAxIDI0LjE1IDEyLjg1MDFIMjEuOTcyNVYxMS44NTAxSDI0LjE1QzI0LjQyNjEgMTEuODUwMSAyNC42NSAxMS42MjYzIDI0LjY1IDExLjM1MDFWMTAuMzUwMUMyNC42NSAxMC4wNzQgMjQuNDI2MSA5Ljg1MDEyIDI0LjE1IDkuODUwMTJIMjAuNDUwNVoiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0yIDkuODUwMTJDMS43MjM4NiA5Ljg1MDEyIDEuNSAxMC4wNzQgMS41IDEwLjM1MDFWMTcuMzUwMUMxLjUgMTcuNjI2MyAxLjcyMzg2IDE3Ljg1MDEgMiAxNy44NTAxSDUuODAyMkM2LjA3ODM0IDE3Ljg1MDEgNi4zMDIyIDE3LjYyNjMgNi4zMDIyIDE3LjM1MDFWMTYuMzUwMUM2LjMwMjIgMTYuMDc0IDYuMDc4MzQgMTUuODUwMSA1LjgwMjIgMTUuODUwMUgzLjUyMTk4VjEwLjM1MDFDMy41MjE5OCAxMC4wNzQgMy4yOTgxMiA5Ljg1MDEyIDMuMDIxOTggOS44NTAxMkgyWiIgZmlsbD0id2hpdGUiLz4KPHBhdGggZD0iTTcuNTY1OTMgMTcuMzUwMUM3LjU2NTkzIDE3LjYyNjMgNy43ODk3OSAxNy44NTAxIDguMDY1OTMgMTcuODUwMUg5LjA4NzkxQzkuMzY0MDUgMTcuODUwMSA5LjU4NzkxIDE3LjYyNjMgOS41ODc5MSAxNy4zNTAxVjEwLjM1MDFDOS41ODc5MSAxMC4wNzQgOS4zNjQwNSA5Ljg1MDEyIDkuMDg3OTEgOS44NTAxMkg4LjA2NTkzQzcuNzg5NzkgOS44NTAxMiA3LjU2NTkzIDEwLjA3NCA3LjU2NTkzIDEwLjM1MDFWMTcuMzUwMVoiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0xNC45ODY3IDE1Ljg2MjZIMTQuNzQwMkwxMy4wOTkzIDEwLjIxMDdDMTMuMDM3MyA5Ljk5NzA5IDEyLjg0MTYgOS44NTAxMiAxMi42MTkyIDkuODUwMTJIMTEuNTkwOEMxMS4yNTc3IDkuODUwMTIgMTEuMDE3OCAxMC4xNjk3IDExLjExMDYgMTAuNDg5NUwxMy4xNDI5IDE3LjQ4OTVDMTMuMjA0OSAxNy43MDMyIDEzLjQwMDYgMTcuODUwMSAxMy42MjMxIDE3Ljg1MDFIMTYuMTAzOEMxNi4zMjYzIDE3Ljg1MDEgMTYuNTIyIDE3LjcwMzIgMTYuNTg0IDE3LjQ4OTVMMTguNjE2MiAxMC40ODk1QzE4LjcwOTEgMTAuMTY5NyAxOC40NjkxIDkuODUwMTIgMTguMTM2MSA5Ljg1MDEySDE3LjEwNzdDMTYuODg1MyA5Ljg1MDEyIDE2LjY4OTYgOS45OTcwOSAxNi42Mjc2IDEwLjIxMDdMMTQuOTg2NyAxNS44NjI2WiIgZmlsbD0id2hpdGUiLz4KPHBhdGggZD0iTTIzLjM3NTkgMjEuOTE0NUMyMy4yMTUxIDIyLjg3ODkgMjIuMzgwNyAyMy41ODU3IDIxLjQwMzEgMjMuNTg1N0w0LjU5NzMzIDIzLjU4NTdDMy42MTk2NSAyMy41ODU3IDIuNzg1MjcgMjIuODc4OSAyLjYyNDU0IDIxLjkxNDVMMi4zNjA4NCAyMC4zMzIzQzIuMzEwMDQgMjAuMDI3NiAyLjU0NTA3IDE5Ljc1MDEgMi44NTQwNCAxOS43NTAxSDMuODY3ODNDNC4xMTIyNSAxOS43NTAxIDQuMzIwODQgMTkuOTI2OCA0LjM2MTAzIDIwLjE2NzlMNC41NjI1MSAyMS4zNzY4QzQuNTgyNiAyMS40OTc0IDQuNjg2OSAyMS41ODU3IDQuODA5MTEgMjEuNTg1N0wyMS4xOTEzIDIxLjU4NTdDMjEuMzEzNSAyMS41ODU3IDIxLjQxNzggMjEuNDk3NCAyMS40Mzc5IDIxLjM3NjhMMjEuNjM5NCAyMC4xNjc5QzIxLjY3OTYgMTkuOTI2OCAyMS44ODgxIDE5Ljc1MDEgMjIuMTMyNiAxOS43NTAxSDIzLjE0NjRDMjMuNDU1MyAxOS43NTAxIDIzLjY5MDQgMjAuMDI3NiAyMy42Mzk2IDIwLjMzMjNMMjMuMzc1OSAyMS45MTQ1WiIgZmlsbD0id2hpdGUiLz4KPC9nPgo8ZGVmcz4KPGZpbHRlciBpZD0iZmlsdGVyMF9kXzI1NzFfMTI5MjMiIHg9IjAiIHk9IjAiIHdpZHRoPSIyNiIgaGVpZ2h0PSIyNiIgZmlsdGVyVW5pdHM9InVzZXJTcGFjZU9uVXNlIiBjb2xvci1pbnRlcnBvbGF0aW9uLWZpbHRlcnM9InNSR0IiPgo8ZmVGbG9vZCBmbG9vZC1vcGFjaXR5PSIwIiByZXN1bHQ9IkJhY2tncm91bmRJbWFnZUZpeCIvPgo8ZmVDb2xvck1hdHJpeCBpbj0iU291cmNlQWxwaGEiIHR5cGU9Im1hdHJpeCIgdmFsdWVzPSIwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAxMjcgMCIgcmVzdWx0PSJoYXJkQWxwaGEiLz4KPGZlT2Zmc2V0IGR5PSIxIi8+CjxmZUdhdXNzaWFuQmx1ciBzdGREZXZpYXRpb249IjAuNSIvPgo8ZmVDb2xvck1hdHJpeCB0eXBlPSJtYXRyaXgiIHZhbHVlcz0iMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMC4xMiAwIi8+CjxmZUJsZW5kIG1vZGU9Im5vcm1hbCIgaW4yPSJCYWNrZ3JvdW5kSW1hZ2VGaXgiIHJlc3VsdD0iZWZmZWN0MV9kcm9wU2hhZG93XzI1NzFfMTI5MjMiLz4KPGZlQmxlbmQgbW9kZT0ibm9ybWFsIiBpbj0iU291cmNlR3JhcGhpYyIgaW4yPSJlZmZlY3QxX2Ryb3BTaGFkb3dfMjU3MV8xMjkyMyIgcmVzdWx0PSJzaGFwZSIvPgo8L2ZpbHRlcj4KPGNsaXBQYXRoIGlkPSJjbGlwMF8yNTcxXzEyOTIzIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSJ3aGl0ZSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMSkiLz4KPC9jbGlwUGF0aD4KPC9kZWZzPgo8L3N2Zz4K`} />
                                        <div className={cx('categories')}>
                                            <span>Đang Follow</span>
                                            <span>Dành cho bạn</span>
                                        </div>
                                        <img alt="" src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjUiIGhlaWdodD0iMjYiIHZpZXdCb3g9IjAgMCAyNSAyNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgZmlsdGVyPSJ1cmwoI2ZpbHRlcjBfZF8yNTcxXzEyOTI3KSI+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMTAuNjMxNiAzLjVDNi40MTY3NyAzLjUgMyA2LjkxNjc3IDMgMTEuMTMxNkMzIDE1LjM0NjQgNi40MTY3NyAxOC43NjMyIDEwLjYzMTYgMTguNzYzMkMxNC44NDY0IDE4Ljc2MzIgMTguMjYzMiAxNS4zNDY0IDE4LjI2MzIgMTEuMTMxNkMxOC4yNjMyIDYuOTE2NzcgMTQuODQ2NCAzLjUgMTAuNjMxNiAzLjVaTTEgMTEuMTMxNkMxIDUuODEyMiA1LjMxMjIgMS41IDEwLjYzMTYgMS41QzE1Ljk1MSAxLjUgMjAuMjYzMiA1LjgxMjIgMjAuMjYzMiAxMS4xMzE2QzIwLjI2MzIgMTMuNDMxMSAxOS40NTczIDE1LjU0MjQgMTguMTEyNyAxNy4xOTg0TDIyLjk0MTkgMjIuMDI3N0MyMy4wODg0IDIyLjE3NDIgMjMuMDg4NCAyMi40MTE2IDIyLjk0MTkgMjIuNTU4MUwyMi4wNTgxIDIzLjQ0MTlDMjEuOTExNiAyMy41ODg0IDIxLjY3NDIgMjMuNTg4NCAyMS41Mjc3IDIzLjQ0MTlMMTYuNjk4NCAxOC42MTI3QzE1LjA0MjQgMTkuOTU3MyAxMi45MzExIDIwLjc2MzIgMTAuNjMxNiAyMC43NjMyQzUuMzEyMiAyMC43NjMyIDEgMTYuNDUxIDEgMTEuMTMxNloiIGZpbGw9IndoaXRlIi8+CjwvZz4KPGRlZnM+CjxmaWx0ZXIgaWQ9ImZpbHRlcjBfZF8yNTcxXzEyOTI3IiB4PSItMSIgeT0iMCIgd2lkdGg9IjI2IiBoZWlnaHQ9IjI2IiBmaWx0ZXJVbml0cz0idXNlclNwYWNlT25Vc2UiIGNvbG9yLWludGVycG9sYXRpb24tZmlsdGVycz0ic1JHQiI+CjxmZUZsb29kIGZsb29kLW9wYWNpdHk9IjAiIHJlc3VsdD0iQmFja2dyb3VuZEltYWdlRml4Ii8+CjxmZUNvbG9yTWF0cml4IGluPSJTb3VyY2VBbHBoYSIgdHlwZT0ibWF0cml4IiB2YWx1ZXM9IjAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDEyNyAwIiByZXN1bHQ9ImhhcmRBbHBoYSIvPgo8ZmVPZmZzZXQgZHk9IjEiLz4KPGZlR2F1c3NpYW5CbHVyIHN0ZERldmlhdGlvbj0iMC41Ii8+CjxmZUNvbG9yTWF0cml4IHR5cGU9Im1hdHJpeCIgdmFsdWVzPSIwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwLjEyIDAiLz4KPGZlQmxlbmQgbW9kZT0ibm9ybWFsIiBpbjI9IkJhY2tncm91bmRJbWFnZUZpeCIgcmVzdWx0PSJlZmZlY3QxX2Ryb3BTaGFkb3dfMjU3MV8xMjkyNyIvPgo8ZmVCbGVuZCBtb2RlPSJub3JtYWwiIGluPSJTb3VyY2VHcmFwaGljIiBpbjI9ImVmZmVjdDFfZHJvcFNoYWRvd18yNTcxXzEyOTI3IiByZXN1bHQ9InNoYXBlIi8+CjwvZmlsdGVyPgo8L2RlZnM+Cjwvc3ZnPgo=" />
                                    </div>
                                    <div className={cx('sidebar')}>
                                        <img className={cx('avatar')} src={currentUser.avatar} alt="" />
                                        <img className={cx('reaction')} alt="" src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjkiIGhlaWdodD0iMTI1IiB2aWV3Qm94PSIwIDAgMjkgMTI1IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8ZyBjbGlwLXBhdGg9InVybCgjY2xpcDApIj4KPGcgZmlsdGVyPSJ1cmwoI2ZpbHRlcjBfZCkiPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTkuNzAzMTMgMy41ODI2NEMxMy4yMDMxIDMuNTgyNjQgMTQuOTUzMSA1LjkxNTk3IDE0Ljk1MzEgNS45MTU5N0MxNC45NTMxIDUuOTE1OTcgMTYuNzAzMSAzLjU4MjY0IDIwLjIwMzEgMy41ODI2NEMyNC4yODY1IDMuNTgyNjQgMjcuMjAzMSA2Ljc5MDk2IDI3LjIwMzEgMTAuODc0M0MyNy4yMDMxIDE1LjU0MSAyMy4zODk0IDE5LjcwMSAxOS45MTE1IDIyLjgzMjZDMTcuNzY0MyAyNC43NjYxIDE2LjExOTggMjYuMDQxIDE0Ljk1MzEgMjYuMDQxQzEzLjc4NjUgMjYuMDQxIDEyLjA5NTQgMjQuNzU2NCA5Ljk5NDc5IDIyLjgzMjZDNi41NzU4NiAxOS43MDE2IDIuNzAzMTIgMTUuNTQxIDIuNzAzMTIgMTAuODc0M0MyLjcwMzEyIDYuNzkwOTYgNS42MTk3OSAzLjU4MjY0IDkuNzAzMTMgMy41ODI2NFoiIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9IjAuOSIvPgo8L2c+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMy43NTU4NiAxNS4xOTExQzUuMTQwOTggMTguMTAzOSA3LjY3Mjc3IDIwLjcwNTggOS45OTUxNiAyMi44MzI3QzEyLjA5NTggMjQuNzU2NCAxMy43ODY4IDI2LjA0MSAxNC45NTM1IDI2LjA0MUMxNi4xMjAyIDI2LjA0MSAxNy43NjQ2IDI0Ljc2NjEgMTkuOTExOCAyMi44MzI3QzIzLjM4OTggMTkuNzAxIDI3LjIwMzUgMTUuNTQxIDI3LjIwMzUgMTAuODc0M0MyNy4yMDM1IDEwLjc3MjMgMjcuMjAxNyAxMC42NzA4IDI3LjE5ODEgMTAuNTY5OEMyNC45NDg4IDE2Ljg5NjQgMTYuOTEyIDIyLjU0MSAxNC42NjE4IDIyLjU0MUMxMi45ODUgMjIuNTQxIDcuNDk5NzggMTkuNDA2NSAzLjc1NTg2IDE1LjE5MTFaIiBmaWxsPSJibGFjayIgZmlsbC1vcGFjaXR5PSIwLjAzIi8+CjwvZz4KPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAxKSI+CjxnIG9wYWNpdHk9IjAuOSIgZmlsdGVyPSJ1cmwoI2ZpbHRlcjFfZCkiPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTIzLjQwODEgNjkuNTU2OEMyNS44MDMxIDY3LjE1NzYgMjcuMjAzMSA2NC42NTg3IDI3LjIwMzEgNjEuNzQ4OUMyNy4yMDMxIDU1Ljg0NDIgMjEuNzk3NCA1MS4wNTc2IDE1LjEyODEgNTEuMDU3NkM4LjQ1ODkzIDUxLjA1NzYgMy4wNTMxMyA1NS44NDQyIDMuMDUzMTMgNjEuNzQ5MUMzLjA1MzEzIDY3LjY1NCA4LjYzMzgzIDcxLjcwNzYgMTUuMzAzMSA3MS43MDc2VjcyLjcwNjdDMTUuMzAzMSA3My43NzAzIDE2LjQwNzMgNzQuNDQ5NCAxNy4zMzE4IDczLjkyMzVDMTkuMTAzIDcyLjkxNiAyMS42NTcyIDcxLjMxMDcgMjMuNDA4MSA2OS41NTY4Wk05LjI2MjUgNjAuMzA3MkMxMC4yMTU2IDYwLjMwNzIgMTAuOTg4MyA2MS4wNzQzIDEwLjk4ODMgNjIuMDE5MUMxMC45ODgzIDYyLjk2NTkgMTAuMjE1NiA2My43MzI5IDkuMjYyNSA2My43MzI5QzguMzEwOTcgNjMuNzMyOSA3LjUzODI4IDYyLjk2NTkgNy41MzgyOCA2Mi4wMTkxQzcuNTM4MjggNjEuMDc0MyA4LjMxMDk3IDYwLjMwNzIgOS4yNjI1IDYwLjMwNzJaTTE2Ljg1MTYgNjIuMDE5MkMxNi44NTE2IDYxLjA3NDMgMTYuMDc5MiA2MC4zMDcyIDE1LjEyNjUgNjAuMzA3MkMxNC4xNzM5IDYwLjMwNzIgMTMuNDAxNiA2MS4wNzQzIDEzLjQwMTYgNjIuMDE5MkMxMy40MDE2IDYyLjk2NTkgMTQuMTc0IDYzLjczMyAxNS4xMjY1IDYzLjczM0MxNi4wNzkyIDYzLjczMyAxNi44NTE2IDYyLjk2NTkgMTYuODUxNiA2Mi4wMTkyWk0yMC45OTMzIDYwLjMwNzJDMjEuOTQ2MiA2MC4zMDcyIDIyLjcxNzggNjEuMDc0MyAyMi43MTc4IDYyLjAxOTFDMjIuNzE3OCA2Mi45NjU5IDIxLjk0NjMgNjMuNzMyOSAyMC45OTMzIDYzLjczMjlDMjAuMDQwMyA2My43MzI5IDE5LjI2NzcgNjIuOTY1OSAxOS4yNjc4IDYyLjAxOTFDMTkuMjY3OCA2MS4wNzQzIDIwLjA0MDMgNjAuMzA3MiAyMC45OTMzIDYwLjMwNzJaIiBmaWxsPSJ3aGl0ZSIvPgo8L2c+CjxwYXRoIG9wYWNpdHk9IjAuMSIgZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xNS4zMDM5IDcxLjcwNzdDMTUuMzAzOSA3MS43MDc3IDIxLjk5MjkgNzEuMTkwOCAyNC43ODg5IDY3LjYxMDZDMjEuOTkyOSA3MS41NDg4IDE5LjE5NjkgNzMuNjk2OSAxNi43NTAzIDc0LjQxM0MxNC4zMDM4IDc1LjEyOSAxNS4zMDM5IDcxLjcwNzcgMTUuMzAzOSA3MS43MDc3WiIgZmlsbD0idXJsKCNwYWludDBfbGluZWFyKSIvPgo8L2c+CjxnIG9wYWNpdHk9IjAuOSIgZmlsdGVyPSJ1cmwoI2ZpbHRlcjJfZCkiPgo8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTE2LjAwMjMgMTA0LjM3MUMxNi4wMDIzIDEwMy4xMDUgMTcuNTE4NiAxMDIuNDU1IDE4LjQzNTQgMTAzLjMyOEwyNC42MDY5IDEwOS4yMDVDMjUuODM0NyAxMTAuMzc1IDI1Ljc5MTggMTEyLjM0NiAyNC41MTQzIDExMy40NjFMMTguMzg5MSAxMTguODA2QzE3LjQ1NzYgMTE5LjYxOCAxNi4wMDIzIDExOC45NTcgMTYuMDAyMyAxMTcuNzIxVjExNS44MzNDMTYuMDAyMyAxMTUuODMzIDcuMjkyOTQgMTE0LjI2NCA0LjQ5OTE5IDExOS4zOTJDNC4yMzg3MiAxMTkuODcgMy4yMjM0NSAxMjAuMDM4IDMuNDI5ODIgMTE3LjY1MkM0LjI5MjgyIDExMy4yNjIgNi4wNTY1NCAxMDYuNDA4IDE2LjAwMjMgMTA2LjQwOFYxMDQuMzcxWiIgZmlsbD0id2hpdGUiLz4KPC9nPgo8cGF0aCBvcGFjaXR5PSIwLjAzIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTIyLjAwNiAxMDYuNzU4TDIzLjI3NDEgMTA5LjI5NEMyMy43NjM4IDExMC4yNzMgMjMuNTI4NSAxMTEuNDYgMjIuNzAyMyAxMTIuMTc4TDE2LjA1NiAxMTcuOTU4QzE2LjA1NiAxMTcuOTU4IDE1LjcwNiAxMTkuNzA4IDE2Ljc1NiAxMTkuNzA4QzE3LjgwNiAxMTkuNzA4IDI2LjIwNiAxMTIuMDA4IDI2LjIwNiAxMTIuMDA4QzI2LjIwNiAxMTIuMDA4IDI2LjU1NiAxMTAuOTU4IDI1LjUwNiAxMDkuOTA4QzI0LjQ1NiAxMDguODU4IDIyLjAwNiAxMDYuNzU4IDIyLjAwNiAxMDYuNzU4WiIgZmlsbD0iIzE2MTgyMyIvPgo8cGF0aCBvcGFjaXR5PSIwLjA5IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTE2LjAwMjMgMTA2Ljc4VjExNS44OEMxNi4wMDIzIDExNS44OCA3LjY2NzQ3IDExNC43MDYgNS4wNTcwNSAxMTguNjhDMi41NDUyNiAxMjIuNTA1IDIuNzc1OTUgMTE0LjM2MSA2LjU1NzI4IDExMC4zMDZDMTAuMzM4NiAxMDYuMjUxIDE2LjAwMjMgMTA2Ljc4IDE2LjAwMjMgMTA2Ljc4WiIgZmlsbD0idXJsKCNwYWludDFfcmFkaWFsKSIvPgo8ZGVmcz4KPGZpbHRlciBpZD0iZmlsdGVyMF9kIiB4PSIwLjMwMzEyNSIgeT0iMi4zODI2NCIgd2lkdGg9IjI5LjMiIGhlaWdodD0iMjcuMjU4MyIgZmlsdGVyVW5pdHM9InVzZXJTcGFjZU9uVXNlIiBjb2xvci1pbnRlcnBvbGF0aW9uLWZpbHRlcnM9InNSR0IiPgo8ZmVGbG9vZCBmbG9vZC1vcGFjaXR5PSIwIiByZXN1bHQ9IkJhY2tncm91bmRJbWFnZUZpeCIvPgo8ZmVDb2xvck1hdHJpeCBpbj0iU291cmNlQWxwaGEiIHR5cGU9Im1hdHJpeCIgdmFsdWVzPSIwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAxMjcgMCIgcmVzdWx0PSJoYXJkQWxwaGEiLz4KPGZlT2Zmc2V0IGR5PSIxLjIiLz4KPGZlR2F1c3NpYW5CbHVyIHN0ZERldmlhdGlvbj0iMS4yIi8+CjxmZUNvbG9yTWF0cml4IHR5cGU9Im1hdHJpeCIgdmFsdWVzPSIwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwLjE1IDAiLz4KPGZlQmxlbmQgbW9kZT0ibm9ybWFsIiBpbjI9IkJhY2tncm91bmRJbWFnZUZpeCIgcmVzdWx0PSJlZmZlY3QxX2Ryb3BTaGFkb3ciLz4KPGZlQmxlbmQgbW9kZT0ibm9ybWFsIiBpbj0iU291cmNlR3JhcGhpYyIgaW4yPSJlZmZlY3QxX2Ryb3BTaGFkb3ciIHJlc3VsdD0ic2hhcGUiLz4KPC9maWx0ZXI+CjxmaWx0ZXIgaWQ9ImZpbHRlcjFfZCIgeD0iMC42NTI3MzQiIHk9IjQ5Ljg1NzYiIHdpZHRoPSIyOC45NSIgaGVpZ2h0PSIyNy44NDc3IiBmaWx0ZXJVbml0cz0idXNlclNwYWNlT25Vc2UiIGNvbG9yLWludGVycG9sYXRpb24tZmlsdGVycz0ic1JHQiI+CjxmZUZsb29kIGZsb29kLW9wYWNpdHk9IjAiIHJlc3VsdD0iQmFja2dyb3VuZEltYWdlRml4Ii8+CjxmZUNvbG9yTWF0cml4IGluPSJTb3VyY2VBbHBoYSIgdHlwZT0ibWF0cml4IiB2YWx1ZXM9IjAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDEyNyAwIiByZXN1bHQ9ImhhcmRBbHBoYSIvPgo8ZmVPZmZzZXQgZHk9IjEuMiIvPgo8ZmVHYXVzc2lhbkJsdXIgc3RkRGV2aWF0aW9uPSIxLjIiLz4KPGZlQ29sb3JNYXRyaXggdHlwZT0ibWF0cml4IiB2YWx1ZXM9IjAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAuMTUgMCIvPgo8ZmVCbGVuZCBtb2RlPSJub3JtYWwiIGluMj0iQmFja2dyb3VuZEltYWdlRml4IiByZXN1bHQ9ImVmZmVjdDFfZHJvcFNoYWRvdyIvPgo8ZmVCbGVuZCBtb2RlPSJub3JtYWwiIGluPSJTb3VyY2VHcmFwaGljIiBpbjI9ImVmZmVjdDFfZHJvcFNoYWRvdyIgcmVzdWx0PSJzaGFwZSIvPgo8L2ZpbHRlcj4KPGZpbHRlciBpZD0iZmlsdGVyMl9kIiB4PSIxLjAwMjM0IiB5PSIxMDEuNzI4IiB3aWR0aD0iMjYuODk4NCIgaGVpZ2h0PSIyMS41NTYiIGZpbHRlclVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgY29sb3ItaW50ZXJwb2xhdGlvbi1maWx0ZXJzPSJzUkdCIj4KPGZlRmxvb2QgZmxvb2Qtb3BhY2l0eT0iMCIgcmVzdWx0PSJCYWNrZ3JvdW5kSW1hZ2VGaXgiLz4KPGZlQ29sb3JNYXRyaXggaW49IlNvdXJjZUFscGhhIiB0eXBlPSJtYXRyaXgiIHZhbHVlcz0iMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMTI3IDAiIHJlc3VsdD0iaGFyZEFscGhhIi8+CjxmZU9mZnNldCBkeT0iMS4yIi8+CjxmZUdhdXNzaWFuQmx1ciBzdGREZXZpYXRpb249IjEuMiIvPgo8ZmVDb2xvck1hdHJpeCB0eXBlPSJtYXRyaXgiIHZhbHVlcz0iMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMC4xNSAwIi8+CjxmZUJsZW5kIG1vZGU9Im5vcm1hbCIgaW4yPSJCYWNrZ3JvdW5kSW1hZ2VGaXgiIHJlc3VsdD0iZWZmZWN0MV9kcm9wU2hhZG93Ii8+CjxmZUJsZW5kIG1vZGU9Im5vcm1hbCIgaW49IlNvdXJjZUdyYXBoaWMiIGluMj0iZWZmZWN0MV9kcm9wU2hhZG93IiByZXN1bHQ9InNoYXBlIi8+CjwvZmlsdGVyPgo8bGluZWFyR3JhZGllbnQgaWQ9InBhaW50MF9saW5lYXIiIHgxPSIxMi44NTk5IiB5MT0iNzAuOTMxOCIgeDI9IjEzLjk2NjkiIHkyPSI3NC40MTA2IiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CjxzdG9wLz4KPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLW9wYWNpdHk9IjAuMDEiLz4KPC9saW5lYXJHcmFkaWVudD4KPHJhZGlhbEdyYWRpZW50IGlkPSJwYWludDFfcmFkaWFsIiBjeD0iMCIgY3k9IjAiIHI9IjEiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiBncmFkaWVudFRyYW5zZm9ybT0idHJhbnNsYXRlKDE2LjMwODIgMTIxLjc3Nikgcm90YXRlKC0xMTMuMDQ2KSBzY2FsZSgxMS4xMzkxIDEwLjk0OTgpIj4KPHN0b3AvPgo8c3RvcCBvZmZzZXQ9IjAuOTk1NDk2IiBzdG9wLW9wYWNpdHk9IjAuMDEiLz4KPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLW9wYWNpdHk9IjAuMDEiLz4KPC9yYWRpYWxHcmFkaWVudD4KPGNsaXBQYXRoIGlkPSJjbGlwMCI+CjxyZWN0IHdpZHRoPSIyOCIgaGVpZ2h0PSIyOCIgZmlsbD0id2hpdGUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAuOTUzMTI1IDAuOTU3NjQyKSIvPgo8L2NsaXBQYXRoPgo8Y2xpcFBhdGggaWQ9ImNsaXAxIj4KPHJlY3Qgd2lkdGg9IjI4IiBoZWlnaHQ9IjI4IiBmaWxsPSJ3aGl0ZSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMC45NTMxMjUgNDguOTU3NikiLz4KPC9jbGlwUGF0aD4KPC9kZWZzPgo8L3N2Zz4K" />
                                        <div className={cx('music-cd')}>
                                            <img alt="" src={currentUser.avatar} className={cx('cd-img', { 'pause-animation': !play })} />
                                        </div>
                                    </div>
                                    <div className={cx('user-info')}>
                                        <p className={cx('username')}>{currentUser.nickname}</p>
                                        <p className={cx('caption', 'truncate')}>{caption}</p>
                                    </div>
                                    <div className={cx('video-container')}>
                                        <video loop ref={videoElement} width={259} height={519}>
                                            <source src={video} type="video/mp4" />
                                        </video>
                                    </div>
                                </div>
                                <div className={cx('input-options')}>
                                    <div className={cx('caption-title', 'title')}>
                                        <span>Chú thích</span>
                                        <span>{caption.length} / 2200</span>
                                    </div>
                                    <input value={caption} onChange={(e) => setCaption(e.target.value)} className={cx('caption-input')} type="text" />
                                    <p className={cx('privacy-label', 'title')}>Ai có thể xem video này</p>
                                    <label htmlFor="privacy" className={cx('custome-select')}>
                                        <ul onClick={() => setShowPrivacyOptions(prev => !prev)} ref={privacyRef} defaultValue={privacy} id="privacy" className={cx('privacy-select')}>
                                            {privacy}
                                            {
                                                showPrivacyOptions &&
                                                <div className={cx('option-wrapper')}>
                                                    <li onClick={handlePrivacyValue} className={cx({ selected: privacy === 'Công khai' })}>Công khai</li>
                                                    <li onClick={handlePrivacyValue} className={cx({ selected: privacy === 'Bạn bè' })}>Bạn bè</li>
                                                    <li onClick={handlePrivacyValue} className={cx({ selected: privacy === 'Riêng tư' })}>Riêng tư</li>
                                                </div>

                                            }
                                        </ul>
                                    </label>
                                    <p className={cx('title')}>Cho phép người dùng</p>
                                    <div className={cx('guest-rights')}>
                                        {/* <label htmlFor="comment-right" className={cx('guest-rights-input')}>
                                            <input onChange={(e) => setCommentCheck(e.target.checked)} checked={commentCheck} id="comment-right" type="checkbox" />
                                            <span className={cx('check-mark')}></span>
                                            <span className={cx('right-name')}>Bình luận</span>
                                        </label> */}
                                        <label htmlFor="duet-right" className={cx('guest-rights-input')}>
                                            <input onChange={(e) => setDuetCheck(e.target.checked)} checked={duetCheck} id="duet-right" type="checkbox" />
                                            <span className={cx('check-mark')}></span>
                                            <span className={cx('right-name')}>Duet</span>
                                        </label>
                                        <label htmlFor="stitch-right" className={cx('guest-rights-input')}>
                                            <input onChange={(e) => setStitchCheck(e.target.checked)} checked={stitchCheck} id="stitch-right" type="checkbox" />
                                            <span className={cx('check-mark')}></span>
                                            <span className={cx('right-name')}>Stitch</span>
                                        </label>
                                    </div>
                                    <div className={cx('right-check-wrapper')}>
                                        <p className={cx('title')}>Chạy trình kiểm tra bản quyền</p>
                                        <div onClick={() => setSwitchBtnState(prev => !prev)} className={cx('switch-btn', { switched: switchBtnState })}>
                                            <span></span>
                                        </div>
                                    </div>
                                    <p className={cx('small-desc')}>
                                        Chúng tôi sẽ kiểm tra xem video của bạn có sử dụng âm thanh vi phạm bản quyền hay không. Nếu chúng tôi phát hiện có vi phạm, bạn có thể chỉnh sửa video trước khi đăng.
                                        <span className={cx('title', 'small')}>Tìm hiểu thêm</span>
                                    </p>
                                    <div className={cx('submit-btns')}>
                                        <Button onClick={() => window.location.reload()} outline_1>Hủy bỏ</Button>
                                        <Button onClick={handleSubmitVideo} primary>Đăng</Button>
                                    </div>
                                    {
                                        isUploading === uploadingState.uploading &&
                                        <Loading width="100%" height="100px" />
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
            }
        </div>
    )
}

export default Upload