import * as httpRequest from '~/utils/httpRequest';

export const search = async (nickname, id) => {
    try {
        const res = await httpRequest.get(`search/suggestAccount`, {
            params: {
                nickname,
                id
            },
        });
        return res;
    } catch (err) {
        console.log(err)
    }
};