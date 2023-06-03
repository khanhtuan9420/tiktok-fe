import { forwardRef, useState } from 'react';
import imgs from '~/assets/images';
import classNames from 'classnames';
import styles from './Image.module.scss';
import PropTypes from 'prop-types'

const Image = forwardRef(({ src, alt, className, fallBack: customFallback = imgs.noImage, ...props }, ref) => {
    const [fallback, setFallback] = useState('');
    const handleError = () => {
        setFallback(customFallback);
    };
    return (
        <img
            ref={ref}
            className={classNames(styles.wrapper, className)}
            src={fallback || src}
            {...props}
            alt={alt}
            onError={handleError}
        />
    );
})

Image.propTypes = {
    alt: PropTypes.string,
    src: PropTypes.string,
    className: PropTypes.string,
    customFallback: PropTypes.string,
}

export default Image;
