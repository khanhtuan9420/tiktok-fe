import classNames from 'classnames/bind';
import styles from './SuggestedAccount.module.scss';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import Tippy from '@tippyjs/react/headless';
import imgs from '~/assets/images';
import Button from '../Button';
import { Wrapper as PopperWrapper } from '../Popper';
import PreviewAccount from '../PreviewAccount/PreviewAccount';
import { useEffect } from 'react';
const cx = classNames.bind(styles);

function AccountItem({ showPreview = true, divRef, data }) {
    return (
        // <div>
        //     <Tippy
        //         hideOnClick={false}
        //         placement="bottom-start"
        //         delay={[700,0]}
        //         offset={[0,-20]}
        //         interactive
        //         render={(attrs) => (
        //             <div className={cx('content')} tabIndex="-1" {...attrs}>
        //                 <PopperWrapper>
        //                     <div className={cx('account-info')}>
        //                         <div>
        //                             <img
        //                                 className={cx('avatar')}
        //                                 src={imgs.testAvatar}
        //                                 alt=""
        //                             />
        //                             <Button size='small' primary>Follow</Button>
        //                         </div>
        //                         <p className={cx('username')}>
        //                             <strong>pt122</strong>
        //                             <FontAwesomeIcon icon={faCheckCircle} />
        //                         </p>
        //                         <p className={cx('name')}>Pthao</p>
        //                         <p className={cx('statistical')}>
        //                             <span className={cx('number')}>6.7M</span>
        //                             <span className={cx('label-info')}>Follower</span>
        //                             <span className={cx('number')}>252.3M</span>
        //                             <span className={cx('label-info')}>Thích</span>
        //                         </p>
        //                     </div>
        //                 </PopperWrapper>
        //             </div>
        //         )}
        //     >
        //         <div className={cx('account-item')}>
        //             <img
        //                 className={cx('avatar')}
        //                 src={imgs.testAvatar}
        //                 alt=""
        //             />
        //             <div className={cx('item-info')}>
        //                 <p className={cx('username')}>
        //                     <strong>pt122</strong>
        //                     <FontAwesomeIcon icon={faCheckCircle} />
        //                 </p>
        //                 <p className={cx('name')}>Pthao</p>
        //             </div>
        //         </div>
        //     </Tippy>
        // </div>
        <PreviewAccount parent={divRef.current} data={{ data }}>
            <div className={cx('account-item')}>
                <img
                    className={cx('avatar')}
                    src={data.avatar}
                    alt=""
                />
                <div className={cx('item-info')}>
                    <p className={cx('username')}>
                        <strong>{data.nickname}</strong>
                        {
                            data.tick == 1 &&
                            <FontAwesomeIcon icon={faCheckCircle} />
                        }
                    </p>
                    <p className={cx('name')}>{data["full_name"]}</p>
                </div>
            </div>
        </PreviewAccount>
    );
}

AccountItem.propTypes = {};

export default AccountItem;
