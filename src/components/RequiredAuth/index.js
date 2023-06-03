import { useContext } from "react";
import { useLocation, Navigate, Outlet } from "react-router-dom";
import Context from "~/store/Context";

const RequiredAuth = ()=> {
    const {auth} = useContext(Context).authState;
    const location = useLocation()
    return (
        auth?.user ?
        <Outlet/> :
        <Navigate to="/" state={{from: location}} replace />
    )
}

export default RequiredAuth