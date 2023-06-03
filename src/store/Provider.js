import { useState } from "react";
import Context from "./Context";

function Provider({ children }) {
    const [mute, setMute] = useState(true)
    const [auth, setAuth] = useState({})
    const [currentUser, setUser] = useState({})
    const [video, setVideo] = useState({})
    const [homeState, setHomeState] = useState({})
    const [reloadFeed, setReloadFeed] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [showLogin, setShowLogin] = useState(false)
    const [followIds, setFollowIds] = useState([])
    const [likedAndComments, setLikedAndComments] = useState([])
    return (
        <Context.Provider value={{
            likedAndComments: {
                likedAndComments,
                setLikedAndComments
            },
            followIds: {
                followIds,
                setFollowIds
            },
            login: {
                showLogin,
                setShowLogin
            },
            reloadFeed: {
                reloadFeed,
                setReloadFeed
            },
            loading: {
                isLoading,
                setIsLoading
            },
            home: {
                homeState,
                setHomeState
            },
            user: {
                currentUser,
                setUser,
            },
            authState: {
                auth,
                setAuth,
            },
            sound: {
                mute,
                setMute
            },
            video: {
                video,
                setVideo
            }
        }}>
            {children}
        </Context.Provider>
    )
}

export default Provider