import { axiosPrivate } from "~/utils/httpRequest";
import { useContext, useEffect } from "react";
import useRefreshToken from "./useRefeshToken";
import Context from "~/store/Context";
import { config } from "@fortawesome/fontawesome-svg-core";

const useAxiosPrivate = () => {
    const refresh = useRefreshToken()
    const {auth} = useContext(Context).authState;
    
    useEffect(()=>{
        const requestIntecept = axiosPrivate.interceptors.use(
            config => {
                if(!config.headers['Authorization']) {
                    config.headers['Authorization'] = `Bearer ${auth?.accessToken}`
                }
                return config
            }, err => {
                Promise.reject(err)
            }
        );

        const responseIntercept = axiosPrivate.interceptors.response.use(
            res => res,
            async err => {
                const prevRequest = err?.config;
                if(err?.response.status === 403 && !prevRequest?.sent) {
                    prevRequest.sent = true;
                    const newAccessToken = await refresh();
                    prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`
                    return axiosPrivate(prevRequest)
                }
                return Promise.reject(err)
            }
        )

        return () => {
            axiosPrivate.interceptors.request.eject(requestIntecept)
            axiosPrivate.interceptors.response.eject(responseIntercept)
        }
    },[auth, refresh])

    return axiosPrivate;
}

export default useAxiosPrivate