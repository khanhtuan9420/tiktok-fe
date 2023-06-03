import axios from "axios"
import { useContext } from "react"
import Context from "~/store/Context"
import httpRequest from "~/utils/httpRequest";

const useRefreshToken = () => {
    const {setAuth} = useContext(Context).authState;
    const {setUser} = useContext(Context).user

    const refresh = async ()=>{
        const res = await httpRequest.get('refresh', {
            withCredentials: true
        })
        setAuth(prev => {
            return {...prev, accessToken: res.data.accessToken}
        })
        setUser(prev => {
            return {...res.data}
        })
        return res.data.accessToken
    }
    return refresh;
}

export default useRefreshToken