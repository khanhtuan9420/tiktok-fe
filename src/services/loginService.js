import * as httpRequest from '~/utils/httpRequest';

export const login = async (username, password) => {
    try {
        const res = await httpRequest.post(`auth`, {
            user: username,
            pwd: password
        });
        return res;
    } catch (err) {
        return "Tài khoản hoặc mật khẩu không chính xác";
    }
};
