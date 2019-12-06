import axios from 'axios'

import { API_URL } from './config'



const getData = (url) => {
    return axios.get(`${API_URL}` + url)
        .then((response) => {
            return response.data
        })
        .catch((e) => {
            return e.response.data.message
        });
}
const postData = (url, data) => {
    return axios.post(`${API_URL}` + url, data)
        .then((response) => {
            return response.data;
        })
        .catch((e) => {
            return e.response.data.message
        });
}
const updateData = (url, data) => {
    return axios.put(`${API_URL}` + url, data)
        .then((response) => {
            return response.data;
        })
        .catch((e) => {
            return e.response.data.message

        });
}
const deleteData = (url, data) => {
    return axios.delete(`${API_URL}` + url, data)
        .then((response) => {
            return response.data;
        })
        .catch((e) => {
            return e.response.data.message
        });
}

export {
    getData,
    postData,
    updateData,
    deleteData
};
