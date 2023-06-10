import classNames from 'classnames/bind';
import styles from './Header.module.scss';
import imgs from '~/assets/images';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleQuestion, faEllipsisVertical, faGear, faKeyboard, faLanguage, faPlus, faSignOut, faUser } from '@fortawesome/free-solid-svg-icons';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import Button from '~/components/Button';
import Menu from '~/components/Popper/Menu';
import { UploadIcon } from '~/components/Icon';
import Image from '~/components/Image';
import Search from '../Search';
import { Link, useNavigate } from 'react-router-dom';
import config from '~/config';
import { useContext, useEffect, useState } from 'react';
import * as loginService from '~/services/loginService'
import * as registerService from '~/services/registerService'
import Context from '~/store/Context';
import useLogout from '~/hooks/useLogout';
import Login from '~/components/Login';

const cx = classNames.bind(styles);
const MENU_ITEMS = [
    {
        icon: <FontAwesomeIcon icon={faLanguage} />,
        title: 'Tiếng Việt',
        children: {
            title: 'Ngôn ngữ',
            data: [
                {
                    code: 'en',
                    title: 'English'
                },
                {
                    code: 'vi',
                    title: 'Tiếng Việt'
                }
            ]
        }
    },
    {
        icon: <FontAwesomeIcon icon={faCircleQuestion} />,
        title: 'Phản hồi và trợ giúp',
        // to: 'https://google.com'
    },
    {
        icon: <FontAwesomeIcon icon={faKeyboard} />,
        title: 'Phím tắt trên bàn phím'
    }
]

function Header() {
    const navigate = useNavigate()
    const logout = useLogout();
    const { currentUser, setUser } = useContext(Context).user;
    const { reloadFeed, setReloadFeed } = useContext(Context).reloadFeed
    const { showLogin, setShowLogin } = useContext(Context).login
    const { likedAndComments, setLikedAndComments } = useContext(Context).likedAndComments
    const [toLocation, setToLocation] = useState('');
    const signOut = async () => {
        await logout();
        window.location.reload()
        // useNavigate('/')
    }
    let userMenu = [
        {
            icon: <FontAwesomeIcon icon={faUser} />,
            title: 'Xem hồ sơ',
            to: `/profile/${currentUser.nickname}`
        },
        {
            icon: <FontAwesomeIcon icon={faGear} />,
            title: 'Cài đặt',
            to: 'https://google.com'
        },
        ...MENU_ITEMS,
        {
            icon: <FontAwesomeIcon icon={faSignOut} />,
            title: 'Đăng xuất',
            seperate: true,
            onClick: signOut,
        },
    ]


    const handleLoginForm = () => {
        setToLocation(prev => '')
        setShowLogin(true)
    }

    const handleUploadLogin = () => {
        setToLocation(prev => '/upload')
        handleLoginForm()
    }

    const handleReloadFeed = () => {
        if (window.location.pathname === '/') {
            setReloadFeed(true)
        }
    }

    // useEffect(() => {
    //     setLikedAndComments([])
    // }, [reloadFeed])

    return (
        <header className={cx('wrapper')}>
            <div className={cx('inner')}>
                <Link onClick={handleReloadFeed} to={config.routes.home} className={cx('logo')}>
                    <img src={imgs.logo} alt="tiktok-logo" />
                </Link>

                <Search />

                <div className={cx('action')}>
                    {currentUser?.nickname ? (
                        // <Tippy delay={[0, 200]} content="Upload video" placement='bottom'>
                        //     <button onClick={() => navigate('/upload')} className={cx('upload-btn')}>
                        //         <UploadIcon />
                        //     </button>
                        // </Tippy>
                        <Button onClick={() => navigate('/upload')} className={cx('upload-btn')} outline_1 leftIcon={<FontAwesomeIcon icon={faPlus} />}>
                            Tải lên
                        </Button>
                    ) : (
                        <>
                            <Button onClick={handleUploadLogin} outline_1 leftIcon={<FontAwesomeIcon icon={faPlus} />}>
                                Tải lên
                            </Button>
                            <Button className={cx('test')} primary onClick={handleLoginForm}>Đăng nhập</Button>
                        </>
                    )}
                    <Menu
                        items={currentUser?.nickname ? userMenu : MENU_ITEMS}
                        // onChange={handleMenuChange}
                        width={224}>
                        {currentUser?.nickname ? (
                            <Image className={cx('user-avatar')} alt="" fallBack="https://images.unsplash.com/photo-1481349518771-20055b2a7b24?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8cmFuZG9tfGVufDB8fDB8fA%3D%3D&w=1000&q=80" src={currentUser.avatar} />
                        ) : (
                            <button className={cx('more-btn')}>
                                <FontAwesomeIcon icon={faEllipsisVertical} />
                            </button>
                        )}
                    </Menu>
                </div>
            </div>
        </header>
    );
}

export default Header;
