import classNames from 'classnames/bind';
import styles from './Sidebar.module.scss';
import Menu, { MenuItem } from './Menu'
import config from '~/config';
import { HomeActiveIcon, HomeIcon, LiveActiveIcon, LiveIcon, UsersActiveIcon, UsersIcon } from '~/components/Icon';
import SuggestedAccount from '~/components/SuggestedAccount/SuggestedAccount';
import { useContext, useRef, useState } from 'react';
import Context from '~/store/Context';
import Button from '~/components/Button';
import Login from '~/components/Login';
const cx = classNames.bind(styles)

function Sidebar({ divRef }) {
    const { currentUser } = useContext(Context).user
    const { showLogin, setShowLogin } = useContext(Context).login
    const handleScroll = () => {

    }
    return (
        <aside ref={divRef} onWheel={handleScroll} className={cx('wrapper')}>
            <Menu>
                <MenuItem title='Dành cho bạn' to={config.routes.home} icon={{
                    normal: <HomeIcon />,
                    active: <HomeActiveIcon />
                }} state={{ path: window.location.pathname }} />
                <MenuItem title='Đang Follow' to={config.routes.follow} icon={{
                    normal: <UsersIcon />,
                    active: <UsersActiveIcon />
                }} state={{ path: window.location.pathname }} />
                <MenuItem title='LIVE' to={config.routes.live} icon={{
                    normal: <LiveIcon />,
                    active: <LiveActiveIcon />
                }} state={{ path: window.location.pathname }} />
            </Menu>
            {
                !currentUser.nickname &&
                <div className={cx('login-box')}>
                    <p>Đăng nhập để follow các tác giả, thích video và xem bình luận.</p>
                    <Button onClick={() => setShowLogin(true)} outline>Đăng nhập</Button>
                </div>
            }
            <SuggestedAccount divRef={divRef} label='Các tài khoản được đề xuất' />
            {
                currentUser.nickname &&
                <SuggestedAccount divRef={divRef} type='follow' label='Các tài khoản đang follow' />
            }
            <div className={cx('sidebar-footer')}>
                <div className={cx('footer-row')}>
                    <a href='/'>Giới thiệu</a>
                    <a href='/'>Bảng tin</a>
                    <a href='/'>Liên hệ</a>
                    <a href='/'>Sự nghiệp</a>
                    <a href='/'>ByteDance</a>
                </div>
                <div className={cx('footer-row')}>
                    <a href='/'>TikTok for Good</a>
                    <a href='/'>Quảng cáo</a>
                    <a href='/'>Developers</a>
                    <a href='/'>Minh bạch</a>
                    <a href='/'>TikTok Rewards</a>
                    <a href='/'>TikTok Embeds</a>
                </div>
                <div className={cx('footer-row')}>
                    <a href='/'>Trợ giúp</a>
                    <a href='/'>An toàn</a>
                    <a href='/'>Điều khoản</a>
                    <a href='/'>Quyền riêng tư</a>
                    <a href='/'>Cổng thông tin tác giả</a>
                    <a href='/'>Hướng dẫn cộng đồng</a>
                </div>
                <span>
                    ©
                    2023 TikTok
                </span>
            </div>
        </aside>
    )
}

export default Sidebar