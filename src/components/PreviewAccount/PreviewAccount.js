import classNames from 'classnames/bind';
import styles from './PreviewAccount.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import Tippy from '@tippyjs/react/headless';
import imgs from '~/assets/images';
import Button from '../Button';
import { Wrapper as PopperWrapper } from '../Popper';
import { Link } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import FollowBtn from '../FollowBtn';
import Context from '~/store/Context';

const cx = classNames.bind(styles);
function PreviewAccount({ children, data, parent }) {
    const { currentUser } = useContext(Context).user
    return (
        <div>
            <Tippy
                // visible
                appendTo={parent}
                zIndex={99999}
                hideOnClick={false}
                placement="bottom-start"
                delay={[700, 0]}
                offset={[0, -20]}
                interactive
                render={(attrs) => (
                    <>
                        {
                            currentUser.nickname === data.data.nickname ?
                                <></> :
                                <div className={cx('content')} tabIndex="-1" {...attrs}>
                                    <PopperWrapper>
                                        <div className={cx('account-info')}>
                                            <div>
                                                <Link to={`/profile/${data.data.nickname}`}>
                                                    <img
                                                        className={cx('avatar')}
                                                        src={data.data.avatar}
                                                        alt=""
                                                    />
                                                </Link>
                                                {/* <Button outline size='small' primary>Follow</Button> */}
                                                <FollowBtn data={data} />
                                            </div>
                                            <Link to={`/profile/${data.data.nickname}`}>
                                                <p className={cx('username')}>
                                                    <strong>{data.data.nickname}</strong>
                                                    {data.data.tick === 1 && <FontAwesomeIcon icon={faCheckCircle} />}
                                                </p>
                                                <p className={cx('name')}>{data.data["full_name"]}</p>
                                            </Link>
                                            <p className={cx('statistical')}>
                                                <span className={cx('number')}>6.7M</span>
                                                <span className={cx('label-info')}>Follower</span>
                                                <span className={cx('number')}>252.3M</span>
                                                <span className={cx('label-info')}>Thích</span>
                                            </p>
                                        </div>
                                    </PopperWrapper>
                                </div>
                        }
                    </>
                )}
            >
                {children}
            </Tippy>
        </div>
    )
}

export default PreviewAccount