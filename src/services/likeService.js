import * as httpRequest from '~/utils/httpRequest';

export const like = async (userId, videoId) => {
    try {
        const res = await httpRequest.post(`/reaction/like`, {
            userId,
            videoId
        });
        return res;
    } catch (err) {
        console.log(err)
    }
};

export const dislike = async (userId, videoId) => {
    try {
        const res = await httpRequest.post(`reaction/dislike`, {
            userId,
            videoId
        });
        return res;
    } catch (err) {
        console.log(err)
    }
};