import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';
import styles from './Button.module.scss';
import PropTypes from 'prop-types'
const cx = classNames.bind(styles);

function Button({
    id,
    width,
    to,
    type = 'reset',
    href,
    primary = false,
    outline = false,
    outline_1 = false,
    disabled = false,
    rounded = false,
    size = 'medium',
    children,
    onClick,
    className,
    leftIcon,
    rightIcon,
    ...passProps
}) {
    let Comp = 'button';
    const classes = cx('wrapper', {
        primary,
        outline,
        outline_1,
        disabled,
        rounded,
        [className]: className,
        [size]: size,
    });
    const props = { onClick, ...passProps };

    // disabled
    if (disabled) delete props.onClick;

    if (to) {
        props.to = to;
        Comp = Link;
    } else if (href) {
        props.href = href;
        Comp = 'a';
    } else props.type = type;
    return (
        <Comp id={id} style={{ width: width }} className={classes} {...props}>
            {leftIcon && <span className={cx('btn-icon')}>{leftIcon}</span>}
            <span className={cx('title')}>{children}</span>
            {rightIcon && <span className={cx('btn-icon')}>{rightIcon}</span>}
        </Comp>
    );
}

Button.propTypes = {
    to: PropTypes.string,
    href: PropTypes.string,
    primary: PropTypes.bool,
    outline: PropTypes.bool,
    outline_1: PropTypes.bool,
    disabled: PropTypes.bool,
    rounded: PropTypes.bool,
    size: PropTypes.string,
    children: PropTypes.node.isRequired,
    onClick: PropTypes.func,
    className: PropTypes.string,
    leftIcon: PropTypes.node,
    rightIcon: PropTypes.node,
}

export default Button;
