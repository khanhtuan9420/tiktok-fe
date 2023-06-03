import * as httpRequest from '~/utils/httpRequest';

export const getComments = async (slug) => {
    try {
        const res = await httpRequest.get(`video/${slug}/comments`, {});
        return res;
    } catch (err) {
        console.log(err)
    }
};