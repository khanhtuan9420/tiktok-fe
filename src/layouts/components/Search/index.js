import HeadlessTippy from '@tippyjs/react/headless';

import * as searchService from '~/services/searchService';
import { Wrapper as PopperWrapper } from '~/components/Popper';
import AccountItems from '~/components/AccountItems';
import classNames from 'classnames/bind';
import styles from './Search.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark, faSpinner, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useRef, useState } from 'react';
import { useDebounce } from '~/hooks';

const cx = classNames.bind(styles);

function Search() {
    const [searchResults, setSearchResults] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [showResults, setShowResults] = useState(true);
    const [loading, setLoading] = useState(false);
    const inputSearchRef = useRef();
    const handleClearSearch = () => {
        setSearchText('');
        inputSearchRef.current.focus();
    };

    const handleBlur = () => {
        setShowResults(false);
    };

    const handleShowResults = () => {
        setShowResults(true);
    };

    const handleChange = (e) => {
        const searchValue = e.target.value
        if (!searchValue.startsWith(' ')) {
            setSearchText(searchValue)
        }
    }

    const handleSubmit = (e) => {
        e.stopPropagation()
    }

    const debounced = useDebounce(searchText, 1000);

    const renderSearchResults = () => {
        return searchResults.map((searchItem) => {
            return <AccountItems key={searchItem.id} data={searchItem} />;
        });
    };

    useEffect(() => {
        if (!debounced.trim()) {
            setSearchResults([]);
            return;
        }

        const fetchApi = async () => {
            setLoading(true);
            const res = await searchService.search(debounced, 'less')
            setSearchResults(res)
            setLoading(false)
        }

        fetchApi()
    }, [debounced]);

    return (
        // fix tippy warning by wrapping by div
        <div>
            <HeadlessTippy
                onClickOutside={handleBlur}
                interactive
                visible={showResults && searchResults.length > 0}
                render={(attrs) => (
                    <div className={cx('search-results')} tabIndex="-1" {...attrs}>
                        <PopperWrapper>
                            <h4 className={cx('search-title')}>Tài khoản</h4>
                            {renderSearchResults()}
                        </PopperWrapper>
                    </div>
                )}
            >
                <div className={cx('search')}>
                    <input
                        ref={inputSearchRef}
                        className={cx('search-input')}
                        placeholder="Tìm kiếm tài khoản và video"
                        value={searchText}
                        onChange={handleChange}
                        onClick={handleShowResults}
                    />
                    {searchText && !loading && (
                        <button className={cx('close-btn')} onClick={handleClearSearch}>
                            <FontAwesomeIcon icon={faCircleXmark} />
                        </button>
                    )}

                    {loading && <FontAwesomeIcon className={cx('loading')} icon={faSpinner} />}
                    <button className={cx('search-btn')} onClick={handleSubmit}>
                        <FontAwesomeIcon icon={faMagnifyingGlass} />
                    </button>
                </div>
            </HeadlessTippy>
        </div>
    );
}

export default Search;
