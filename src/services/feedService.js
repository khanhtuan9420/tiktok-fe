import * as httpRequest from '~/utils/httpRequest';

export const feed = async (curUser) => {
    try {
        const res = await httpRequest.get(`feed`, {
            params: {
                curUser
            },
        });
        return res;
    } catch (err) {
        console.log(err)
    }
};

export const moreFeed = async (previousIds, curUser) => {
    try {
        const res = await httpRequest.post(`feed`, {
            previousIds,
            curUser
        });
        return res;
    } catch (err) {
        console.log(err)
    }
};