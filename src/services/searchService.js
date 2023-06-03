import * as httpRequest from '~/utils/httpRequest';

export const search = async (q, type = 'less') => {
    try {
        const res = await httpRequest.get(`search`, {
            params: {
                q
            },
        });
        return res;
    } catch (err) {
        console.log(err)
    }
};