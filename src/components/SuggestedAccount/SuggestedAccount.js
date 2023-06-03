import classNames from "classnames/bind";
import styles from './SuggestedAccount.module.scss'
import PropTypes from 'prop-types'
import AccountItem from "./AccountItem";
import { useContext, useEffect, useState } from "react";
import * as suggestedAccount from '../../services/suggestAccount'
import * as followAccounts from '../../services/followAccounts'
import Context from "~/store/Context";
const cx = classNames.bind(styles)
function SuggestedAccount({ label, divRef, type = 'suggest' }) {
    const { currentUser } = useContext(Context).user
    const [accounts, setAccounts] = useState([])
    const [more, setMore] = useState(false)
    const { followIds, setFollowIds } = useContext(Context).followIds

    const renderAccount = (len = accounts.length) => {
        let res = []
        for (let i = 0; i < len; i++) {
            res[i] = <AccountItem key={i} divRef={divRef} data={accounts[i]} />
        }
        return res;
    }

    useEffect(() => {
        const getSuggestAccounts = async () => {
            const res = await suggestedAccount.search(currentUser?.nickname, currentUser?.id)
            setAccounts(res)
        }
        const getFollowAccounts = async () => {
            const res = await followAccounts.search(currentUser?.id)
            setFollowIds(prev => {
                let a = []
                for (let i = 0; i < res.length; i++) {
                    if (prev.indexOf(res[i].id) === -1) a.push(res[i].id)
                }
                return [...prev, ...a]
            })
            setAccounts(res)
        }
        if (type === 'suggest') getSuggestAccounts()
        else getFollowAccounts()
    }, [])

    return (
        <div className={cx('wrapper')}>
            <p className={cx('label')}>{label}</p>
            {/* <AccountItem divRef={divRef} />
            <AccountItem divRef={divRef} />
            <AccountItem divRef={divRef} /> */}
            {accounts.length > 0 &&
                (more ? renderAccount() : renderAccount(accounts.length < 3 ? accounts.length : 3))
            }
            {
                more ?
                    <p onClick={() => setMore(prev => !prev)} className={cx('see-all')}>Ẩn bớt</p>
                    :
                    <p onClick={() => setMore(prev => !prev)} className={cx('see-all')}>Xem tất cả</p>
            }
        </div>
    )
}

SuggestedAccount.propTypes = {
    label: PropTypes.string.isRequired,
}

export default SuggestedAccount;