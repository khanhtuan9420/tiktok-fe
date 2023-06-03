import * as httpRequest from '~/utils/httpRequest';

export const register = async (username, fullName, password) => {
    try {
        const res = await httpRequest.post(`register`, {
            user: username,
            pwd: password,
            fullName
        });
        return res;
    } catch (err) {
        return "Tên đăng nhập đã tồn tại!";
    }
};
