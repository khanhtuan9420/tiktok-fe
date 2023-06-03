import * as httpRequest from '~/utils/httpRequest';

export const getInfo = async (slug) => {
    try {
        const res = await httpRequest.get(`user/${slug}`, {});
        return res;
    } catch (err) {
        console.log(err)
    }
};