import { useCallback, useContext, useEffect, useLayoutEffect, useRef, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import Video from "~/components/Video/Video"
import * as feedService from "~/services/feedService"
import Context from "~/store/Context"
import Provider from "~/store/Provider"
import classNames from "classnames/bind"
import styles from './Home.module.scss'
import Loading from "~/components/Loading"
import { Element, animateScroll as scroll } from 'react-scroll';

const cx = classNames.bind(styles)

function Home() {
    window.onbeforeunload = () => {
        window.scrollTo(0, 0)
    }
    const [feed, setFeed] = useState([])
    const [isRequestSent, setIsRequestSent] = useState(false);
    const { isLoading, setIsLoading } = useContext(Context).loading;
    const { homeState, setHomeState } = useContext(Context).home
    const { reloadFeed, setReloadFeed } = useContext(Context).reloadFeed
    const { currentUser } = useContext(Context).user
    const { followIds, setFollowIds } = useContext(Context).followIds
    const [checkKeyDown, setCheckKeyDown] = useState(false)
    const [page, setPage] = useState(0)
    const [isNoMoreFeed, setIsNoMoreFeed] = useState(false)
    const [increPage, setIncrePage] = useState(true)
    const navigate = useNavigate()
    const divRef = useRef()

    useEffect(() => {
        const fetchApi = async () => {
            setIsLoading(true)
            let res = await feedService.moreFeed(homeState.previousIds || [], currentUser.id)
            if (res.length < 1) setIsNoMoreFeed(true)
            // return 0
            console.log(res)
            // setIsLoading(false)
            const previousIds = res.map((e) => e.vId)
            setTimeout(() => {
                if (homeState.feed) {
                    setHomeState(prev => {
                        return { ...prev, feed: [...prev.feed, ...res], previousIds: [...prev.previousIds, ...previousIds] }
                    })
                    setFeed(prev => {
                        divRef.current.style.height = `${res.length * 700}px`
                        return [...prev, ...res];
                    })
                }
                setFollowIds(prev => {
                    let a = []
                    for (let i = 0; i < res.length; i++) {
                        if (prev.indexOf(res[i].id) === -1 && a.indexOf(res[i].id) === -1 && res[i].follow == 1) a.push(res[i].id)
                    }
                    return [...prev, ...a]
                })
            }, 1000)
        }
        if (page > 0 && !isNoMoreFeed) {
            setIsLoading(true)
            if (!isRequestSent) {
                fetchApi()
                setIsRequestSent(true)
            }
            setTimeout(() => {
                setIsRequestSent(false)
            }, 3000)
            setTimeout(() => {
                setIsLoading(false)
            }, 1200)
            setIncrePage(true)
        }
    }, [page])

    const handleKey = (event) => {
        const doc = document.documentElement;
        let curPos = (window.scrollY / 700 - Math.floor(window.scrollY / 700)) * 700
        if (event.keyCode === 40) {
            // window.scrollBy(0, 700 - curPos - 40);
            const doc = document.documentElement;
            if (Math.ceil(doc.scrollTop + doc.clientHeight + 100) >= doc.scrollHeight) {
                // setCheckKeyDown(true)
                setPage(prev => prev + 1)
                // scroll.scrollToBottom()
                scrollToDistance(100)
            } else
                scrollToDistance(700 - curPos)
        }
        if (event.keyCode === 38) {
            let nextPos = curPos > 350 ? -curPos : -700 - curPos
            // window.scrollBy(0, nextPos + 40)
            scrollToDistance(nextPos)
        }
        setHomeState(prev => {
            return { ...prev, y: window.scrollY }
        })
    }

    const scrollToDistance = (distance) => {
        scroll.scrollMore(distance, {
            duration: 800,
            smooth: 'easeInOutQuart',
            containerId: 'scroll-container',
        });
    };

    const scrollEvent = useCallback(() => {
        const doc = document.documentElement;
        if (Math.ceil(doc.scrollTop + doc.clientHeight) >= doc.scrollHeight) {
            // handleKey({ keyCode: 40 })
            setPage(prev => prev + 1)
        }
    }, [document.documentElement.scrollHeight])

    useEffect(() => {
        window.addEventListener('scroll', scrollEvent)

        return () => {
            window.removeEventListener('scroll', scrollEvent)
        }
    }, [document.documentElement.scrollHeight])

    useEffect(() => {
        window.addEventListener("keydown", handleKey)

        return () => {
            window.removeEventListener("keydown", handleKey)
        }
    }, [checkKeyDown])

    useEffect(() => {
        if (!homeState.feed) {
            const fetchApi = async () => {
                let res, previousIds
                try {
                    setIsLoading(true)
                    res = await feedService.feed(currentUser.id)
                    previousIds = res.map((e) => {
                        return e.vId
                    })
                } catch (err) {

                }
                finally {
                    setHomeState(prev => {
                        return { ...prev, feed: res, previousIds }
                    })
                    setIsLoading(prev => {
                        return false
                    })
                    setFeed(prev => {
                        if (divRef.current) divRef.current.style.height = `${res.length * 700}px`
                        return res;
                    })
                    setFollowIds(prev => {
                        let a = []
                        for (let i = 0; i < res.length; i++) {
                            if (a.indexOf(res[i].id) === -1 && prev.indexOf(res[i].id) === -1 && res[i].follow == 1) a.push(res[i].id)
                        }
                        return [...prev, ...a]
                    })
                }
            }
            fetchApi()
        } else {
            setFeed(prev => {
                divRef.current.style.height = `${homeState.feed.length * 700}px`
                return homeState.feed;
            })
        }
        if (divRef.current) divRef.current.style.height = `7000px`
        window.scrollTo(0, 0)
        if (homeState.y >= 0 && homeState.feed) {
            if (divRef.current) {
                divRef.current.style.height = `${homeState.feed.length * 700}px`
            }
            window.scrollTo(0, homeState.y)
        }
    }, [])

    useEffect(() => {
        if (reloadFeed) {
            setIsNoMoreFeed(false)
            const fetchApi = async () => {
                let res, previousIds
                try {
                    setIsLoading(true)
                    res = await feedService.feed(currentUser?.id)
                    previousIds = res.map((e) => {
                        return e.vId
                    })
                } catch (err) {

                }
                finally {
                    window.scrollTo({
                        top: 0,
                        left: 0,
                        behavior: "smooth"
                    })
                    setHomeState(prev => {
                        return { feed: res, previousIds }
                    })
                    setTimeout(() => {
                        setFeed([])
                        setIsLoading(prev => {
                            return false
                        })
                        setFeed(prev => {
                            if (divRef.current) divRef.current.style.height = `${res.length * 700}px`
                            return res;
                        })
                    }, 1000)
                    setReloadFeed(false)
                    setFollowIds(prev => {
                        let a = []
                        for (let i = 0; i < res.length; i++) {
                            if (a.indexOf(res[i].id) === -1 && prev.indexOf(res[i].id) === -1 && res[i].follow === 1) a.push(res[i].id)
                        }
                        return [...prev, ...a]
                    })
                }
            }
            fetchApi()
        }
    }, [reloadFeed])

    return (
        <div ref={divRef} className={cx('home-container')}>
            {
                feed.map((data, index) => {
                    return <Video followIds={followIds} setFollowIds={setFollowIds} key={index} data={{ data: { ...data, index: index } }} />
                })
            }
            {
                isLoading &&
                <Loading width="100%" height="100px" feed={true} />
            }
        </div>
    )
}

export default Home