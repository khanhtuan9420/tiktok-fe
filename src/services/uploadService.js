import * as httpRequest from '~/utils/httpRequest';

export const upload = async (form) => {
    try {
        const res = await httpRequest.post(`upload`, form);
        return res;
    } catch (err) {
        console.log(err);
    }
};
