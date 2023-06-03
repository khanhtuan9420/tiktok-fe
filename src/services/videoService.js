import * as httpRequest from '~/utils/httpRequest';

export const getVideo = async (slug, curUser) => {
    try {
        const path = !curUser ? `video/${slug}` : `video/${slug}?curUser=${curUser}`
        const res = await httpRequest.get(path, {});
        return res;
    } catch (err) {
        console.log(err)
    }
};