import axios from 'axios'
import { API_URL } from './config'

export async function getData(url) {
    return await axios.get(`${API_URL}` + url).then(({ data }) => data)
}
export async function postData(url, data) {
    return await axios.post(`${API_URL}` + url, data).then(({ data }) => data)
}
export async function updateData(url, data) {
    return await axios.put(`${API_URL}` + url, data).then(({ data }) => data)
}
export async function deleteData(url, data) {
    return await axios.delete(`${API_URL}` + url, data).then(({ data }) => data)
}