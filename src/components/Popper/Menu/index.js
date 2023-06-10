import Tippy from "@tippyjs/react/headless";
import { Wrapper as PopperWrapper } from '../../Popper'
import MenuItem from "./MenuItem";
import classNames from "classnames/bind";
import styles from './Menu.module.scss'
import Header from "./Header";
import { useEffect, useState } from "react";
import PropTypes from 'prop-types'

const cx = classNames.bind(styles)
const defaultFn = () => { }

function Menu({ children, items, onChange = defaultFn }) {
    const [history, setHistory] = useState([{ data: items }])
    const current = history[history.length - 1]

    const onBack = () => {
        setHistory(prev => {
            prev.splice(-1)
            return [...prev]
        })
    }

    const renderItems = () => {
        return current.data.map((item, index) => {
            const isParent = !!item.children

            return <MenuItem key={index} data={item} onClick={() => {
                if (isParent) {
                    setHistory(prev => [...prev, item.children])
                } else {
                    onChange(item)
                }
                if (item?.onClick) item.onClick()
            }} />
        })
    }

    return (
        <Tippy
            hideOnClick={false}
            placement="bottom-end"
            delay={[0, 700]}
            onHide={() => setHistory(prev => [prev[0]])}
            interactive
            offset={[20, 10]}
            render={(attrs) => (
                <div className={cx('content')} tabIndex="-1" {...attrs}>
                    <PopperWrapper>
                        {history.length > 1 && <Header title={current.title} onBack={onBack} />}
                        <div className={cx('item-wrap')}>
                            {renderItems()}
                        </div>
                    </PopperWrapper>
                </div>
            )}
        >
            {children}
        </Tippy>
    );
}

Menu.propTypes = {
    children: PropTypes.node.isRequired,
    items: PropTypes.array,
    onChange: PropTypes.func,
}

export default Menu;
