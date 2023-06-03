const { useContext } = require("react");
const { default: Context } = require("~/store/Context");
const { default: httpRequest } = require("~/utils/httpRequest");


const useLogout= () => {
    const {setAuth} = useContext(Context).authState;
    const {setUser} = useContext(Context).user;

    const logout = async () => {
        setAuth({});
        setUser({})
        try {
            const response = await httpRequest.get('logout', {})
        } catch(err) {
            console.log(err)
        }
    }

    return logout;
}

export default useLogout;