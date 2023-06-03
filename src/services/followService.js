import * as httpRequest from '~/utils/httpRequest';

export const follow = async (following_id, followed_id) => {
    try {
        const res = await httpRequest.post(`follow`, {
            following_id,
            followed_id
        });
        return res;
    } catch (err) {
        console.log(err)
    }
};

export const unfollow = async (following_id, followed_id) => {
    try {
        const res = await httpRequest.post(`follow/unfollow`, {
            following_id,
            followed_id
        });
        return res;
    } catch (err) {
        console.log(err)
    }
};