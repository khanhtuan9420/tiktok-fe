import Button from "~/components/Button"
import classNames from "classnames/bind";
import styles from './Menu.module.scss'
import PropTypes from 'prop-types'

const cx = classNames.bind(styles)

function MenuItem({data, onClick}) {
    const classes = cx('menu-item', {seperate: data.seperate})
    return (
        <Button onClick={onClick} className={classes} to={data.to} leftIcon={data.icon}>
            {data.title}
        </Button>
    )
}

MenuItem.propTypes = {
    data: PropTypes.object.isRequired,
    onClick: PropTypes.func,
}

export default MenuItem