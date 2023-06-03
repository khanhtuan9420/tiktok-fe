import { Outlet } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import useRefreshToken from "~/hooks/useRefeshToken";
import Context from "~/store/Context";
import classNames from "classnames/bind";
import styles from './PersistLogin.module.scss'
import Loading from "../Loading";

const cx = classNames.bind(styles)

const PersistLogin = () => {
    const [isLoading, setIsLoading] = useState(true);
    const refresh = useRefreshToken();
    const { auth } = useContext(Context).authState;

    useEffect(() => {
        const verifyRefreshToken = async () => {
            try {
                await refresh();
            } catch (err) {
                console.log(err)
            }
            finally {
                setTimeout(() => {
                    setIsLoading(false)
                }, 2000)
            }
        }
        !auth?.accessToken ? verifyRefreshToken() : setIsLoading(false)
    }, [])

    // useEffect(() => {
    //     // console.log(`isLoading: ${isLoading}`)
    //     // console.log(`auth: ${JSON.stringify(auth?.accessToken)}`)
    // }, [isLoading])

    return (
        <>
            {isLoading ?
                <Loading /> :
                <Outlet />
            }
        </>
    )
}


export default PersistLogin