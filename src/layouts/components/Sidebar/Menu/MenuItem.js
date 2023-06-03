import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import classNames from 'classnames/bind';

import styles from './Menu.module.scss';

const cx = classNames.bind(styles);

function MenuItem({ title, to, icon, state = {} }) {
    return (
        <NavLink className={(a) => cx('menu-item', { active: a.isActive })} to={to} state={state}>
            {({ isActive }) => {
                let _icon = isActive ? icon.active : icon.normal
                return (
                    <>
                        {_icon}
                        <span className={cx('title')}>{title}</span>
                    </>
                );
            }}
        </NavLink>
    );
}

MenuItem.propTypes = {
    title: PropTypes.string.isRequired,
    to: PropTypes.string.isRequired,
    icon: PropTypes.object.isRequired,
};

export default MenuItem;
