import * as httpRequest from '~/utils/httpRequest';

export const edit = async (videoId, allowComment) => {
    try {
        const res = await httpRequest.post(`video/edit/${videoId}`, {
            allowComment
        });
        return res;
    } catch (err) {
        console.log(err);
    }
};
