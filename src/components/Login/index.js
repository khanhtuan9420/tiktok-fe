import classNames from "classnames/bind";
import styles from './Login.module.scss'
import { useContext, useEffect, useState } from "react";
import Context from "~/store/Context";
import { FacebookIcon, GoogleIcon, KakaoTalkIcon, LINEicon, LoginUserIcon, QRicon, TwitterIcon, UploadIcon } from '~/components/Icon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faCircleQuestion, faEllipsisVertical, faEye, faEyeSlash, faGear, faKeyboard, faLanguage, faPlus, faSignOut, faUser, faXmark } from '@fortawesome/free-solid-svg-icons';
import Button from '~/components/Button';
import * as loginService from '~/services/loginService'
import * as registerService from '~/services/registerService'
import { useNavigate } from "react-router-dom";
const cx = classNames.bind(styles)
const loginFormState = {
    HIDE: 0,
    LOGIN: 1,
    SIGNUP: 2,
    LOGIN_NORMAL: 3,
    SIGNUP_NORMAL: 4
}
function Login({ setShowLoginState, toLocation = '' }) {
    const [animation, setAnimation] = useState(false)
    const [showLogin, setShowLogin] = useState(loginFormState.LOGIN)
    const [inputType, setInputType] = useState('password')
    const [fullName, setFullName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [retypePwd, setRetypePwd] = useState('');
    const [successLen, setSuccessLen] = useState(false);
    const [successChar, setSuccessChar] = useState(false);
    const { auth, setAuth } = useContext(Context).authState;
    const { currentUser, setUser } = useContext(Context).user;
    const [error, setError] = useState("");
    const navigate = useNavigate()

    const handleLoginForm = () => {
        setAnimation(false)
        setShowLogin(loginFormState.LOGIN)
    }

    const handleInputType = () => {
        if (inputType === 'password') setInputType('text')
        else setInputType('password')
    }

    const handleBackBtn = () => {
        if (showLogin === loginFormState.LOGIN_NORMAL) setShowLogin(loginFormState.LOGIN)
        else if (showLogin === loginFormState.SIGNUP_NORMAL) setShowLogin(loginFormState.SIGNUP)
    }

    const handleLogin = () => {
        const fetchApi = async () => {
            const res = await loginService.login(username, password)
            if (typeof res === "string") setError(res);
            else {
                setAuth(res.accessToken)
                setUser(res)
                if (toLocation !== '') {
                    navigate(toLocation)
                }
                else
                    window.location.reload()
            }
        }
        fetchApi()
    }

    const handleSignUp = () => {
        if (successLen && successChar) {
            if (retypePwd === password) {
                const fetchApi = async () => {
                    const res = await registerService.register(username, fullName, password)
                    if (typeof res === "string") setError(res);
                    else {
                        handleLogin();
                    }
                }
                fetchApi()
            } else setError("Mật khẩu nhập lại không chính xác")
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (showLogin === loginFormState.LOGIN_NORMAL) handleLogin();
        if (showLogin === loginFormState.SIGNUP_NORMAL) handleSignUp();
    }

    const handleCloseForm = () => {
        setShowLogin(loginFormState.HIDE)
        setTimeout(() => {
            setShowLoginState(false)
        }, 700)
    }

    useEffect(() => {
        setPassword('')
        setUsername('')
        setRetypePwd('')
        setFullName('')
    }, [showLogin])

    useEffect(() => {
        if (password.length >= 8 && password.length <= 20) setSuccessLen(true)
        else setSuccessLen(false)
        if (/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&`~,./^()~])[A-Za-z\d@$!%*#?&`~,./^()~]{8,}$/.test(password)) setSuccessChar(true)
        else setSuccessChar(false)
    }, [password])

    useEffect(() => {
        setError("")
    }, [showLogin])

    return (
        <div className={cx('form-container', {
            hide: animation,
            ["toggle-hide-wrapper"]: showLogin === loginFormState.LOGIN,
            ["hide-wrapper"]: showLogin === loginFormState.HIDE,
        })}>
            <form action='/' method='POST' onSubmit={handleSubmit} className={cx('login-form', {
                hide: animation,
                ["toggle-hide-content"]: showLogin === loginFormState.LOGIN,
                ["hide-content"]: showLogin === loginFormState.HIDE,
            })}>
                {
                    showLogin > loginFormState.SIGNUP &&
                    <button type='reset' className={cx('login-control-btn', 'login-back-btn')} onClick={handleBackBtn}>
                        <FontAwesomeIcon icon={faAngleLeft} />
                    </button>
                }
                <button type='reset' className={cx('close-btn', 'login-control-btn')} onClick={handleCloseForm}>
                    <FontAwesomeIcon icon={faXmark} />
                </button>
                {
                    showLogin === loginFormState.LOGIN &&
                    <>
                        <h3 className={cx('form-title')}>Đăng nhập vào TikTok</h3>
                        <Button leftIcon={<QRicon width='20px' height='20px' />} outline_1>Sử dụng mã QR</Button>
                        <Button onClick={() => setShowLogin(loginFormState.LOGIN_NORMAL)} leftIcon={<LoginUserIcon />} outline_1>Số điện thoại/ Email/ TikTok ID</Button>
                        <Button leftIcon={<FacebookIcon />} outline_1>Tiếp tục với Facebook</Button>
                        <Button leftIcon={<GoogleIcon />} outline_1>Tiếp tục với Google</Button>
                        <Button leftIcon={<TwitterIcon />} outline_1>Tiếp tục với Twitter</Button>
                        <Button leftIcon={<LINEicon />} outline_1>Tiếp tục với LINE</Button>
                        <Button leftIcon={<KakaoTalkIcon />} outline_1>Tiếp tục với KakaoTalkIcon</Button>
                    </>
                }
                {
                    showLogin === loginFormState.LOGIN_NORMAL &&
                    <>
                        <h3 className={cx('form-title')}>Đăng nhập</h3>
                        <input name='user' value={username} onChange={(e) => setUsername(e.target.value)} className={cx('login-input')} placeholder='Email hoặc TikTok ID' />
                        <div className={cx('input-wrapper')}>
                            <input name='pwd' value={password} onChange={(e) => setPassword(e.target.value)} type={inputType} className={cx('login-input')} placeholder='Mật khẩu' />
                            <span className={cx('show-pass-icon')} onClick={handleInputType}>
                                {
                                    inputType === 'text' &&
                                    <FontAwesomeIcon icon={faEye} />
                                }
                                {
                                    inputType === 'password' &&
                                    <FontAwesomeIcon icon={faEyeSlash} />
                                }
                            </span>
                        </div>
                        {error.length > 0 && <p className={cx('error')}>{error}</p>}
                        <p className={cx('forget-pass')}>Quên mật khẩu?</p>
                        <Button type='submit' className={cx('submit')} size='large'>Đăng nhập</Button>
                    </>
                }
                {
                    showLogin === loginFormState.SIGNUP &&
                    <>
                        <h3 className={cx('form-title')}>Đăng ký TikTok</h3>
                        <Button onClick={() => setShowLogin(loginFormState.SIGNUP_NORMAL)} leftIcon={<LoginUserIcon />} outline_1>Sử dụng số điện thoại hoặc email</Button>
                        <Button leftIcon={<FacebookIcon />} outline_1>Tiếp tục với Facebook</Button>
                        <Button leftIcon={<GoogleIcon />} outline_1>Tiếp tục với Google</Button>
                    </>
                }
                {
                    showLogin === loginFormState.SIGNUP_NORMAL &&
                    <>
                        <h3 className={cx('form-title')}>Đăng ký</h3>
                        <input name='user' value={username} onChange={(e) => setUsername(e.target.value)} className={cx('login-input')} placeholder='Tên tài khoản' />
                        <input name='full_name' value={fullName} onChange={(e) => setFullName(e.target.value)} className={cx('login-input')} placeholder='Họ và tên' />
                        <div className={cx('input-wrapper')}>
                            <input name='pwd' value={password} onChange={(e) => setPassword(e.target.value)} type={inputType} className={cx('login-input')} placeholder='Mật khẩu' />
                            <span className={cx('show-pass-icon')} onClick={handleInputType}>
                                {
                                    inputType === 'text' &&
                                    <FontAwesomeIcon icon={faEye} />
                                }
                                {
                                    inputType === 'password' &&
                                    <FontAwesomeIcon icon={faEyeSlash} />
                                }
                            </span>
                        </div>
                        <div className={cx('input-wrapper')}>
                            <input value={retypePwd} onChange={(e) => setRetypePwd(e.target.value)} type={inputType} className={cx('login-input')} placeholder='Nhập lại mật khẩu' />
                            <span className={cx('show-pass-icon')} onClick={handleInputType}>
                                {
                                    inputType === 'text' &&
                                    <FontAwesomeIcon icon={faEye} />
                                }
                                {
                                    inputType === 'password' &&
                                    <FontAwesomeIcon icon={faEyeSlash} />
                                }
                            </span>
                        </div>
                        {error.length > 0 && <p className={cx('error')}>{error}</p>}
                        <p className={cx('check-pass', { successLen: successLen })}>Mật khẩu phải có độ dài 8 đến 20 ký tự</p>
                        <p className={cx('check-pass', { successChar: successChar })}>Mật khẩu phải bao gồm chữ cái, số, và ký tự đặc biệt</p>
                        <p className={cx('forget-pass')}>Quên mật khẩu?</p>
                        <Button type='submit' className={cx('submit')} size='large'>Đăng ký</Button>
                    </>
                }
                {
                    (showLogin === loginFormState.LOGIN || showLogin === loginFormState.LOGIN_NORMAL) &&
                    <div className={cx('form-footer')}>
                        <p>Bạn không có tài khoản?</p>
                        <button type="reset" onClick={() => setShowLogin(loginFormState.SIGNUP)}>Đăng ký</button>
                    </div>
                }
                {
                    (showLogin === loginFormState.SIGNUP || showLogin === loginFormState.SIGNUP_NORMAL) &&
                    <div className={cx('form-footer')}>
                        <p>Bạn đã có tài khoản?</p>
                        <button type="reset" onClick={() => setShowLogin(loginFormState.LOGIN)}>Đăng nhập</button>
                    </div>
                }
            </form>
        </div>
    )
}

export default Login