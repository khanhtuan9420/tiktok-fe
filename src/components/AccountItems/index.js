import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from 'prop-types'
import classNames from "classnames/bind";
import styles from './AccountItems.module.scss'
import { Link } from "react-router-dom";
const cx = classNames.bind(styles)
function AccountItems({data}) {
    return (
        <Link to={`/profile/${data.nickname}`} className={cx('wrapper')}>
            <img className={cx('avatar')} src={data.avatar} alt="" />
            <div className={cx('info')}>
                <p className={cx('username')}>
                    <span>{data.nickname}</span>
                    {data.tick===1 && <FontAwesomeIcon icon={faCheckCircle} />}
                </p>
                <span className={cx('name')}>{data["full_name"]}</span>
            </div>
        </Link>
    )
}

AccountItems.propTypes = {
    data: PropTypes.object.isRequired
}

export default AccountItems;