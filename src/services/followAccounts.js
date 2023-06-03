import * as httpRequest from '~/utils/httpRequest';

export const search = async (curUser) => {
    try {
        const res = await httpRequest.get(`search/follow`, {
            params: {
                curUser
            },
        });
        return res;
    } catch (err) {
        console.log(err)
    }
};