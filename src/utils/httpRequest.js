import axios from "axios";
const httpRequest = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
    withCredentials: true,
    
})

export const get = async (path, params= {}) => {
    const response = await httpRequest.get(path, params);
    return response.data;
}

export const post = async (path, data= {user: '1', pwd: '1'}) => {
    const response = await httpRequest.post(path, data);
    return response.data;
}

export default httpRequest

export const axiosPrivate = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,    
    headers: {'Content-Type': 'application/json'},
    withCredentials: true,
})