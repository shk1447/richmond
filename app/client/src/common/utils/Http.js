import axios from 'axios';

// http 통신 모듈(향후 세션 체크 및 통신에 대한 관리를 위해 모듈로 이용)
export default {
    post: function (url, body, config = {}) {
        return axios.post(url, body, config).then(function (response) {
            return response.data
        }).catch(function (err) {
            throw err.response.data;
        })
    },
    get: function (url, config = {}) {
        config['headers'] = [{ key: 'Cache-Control', value: 'no-cache' }];
        return axios.get(url, config).then(function (response) {
            return response.data
        }).catch(function (err) {
            throw err.response.data;
        })
    },
    put: function (url, body, config = {}) {
        return axios.put(url, body, config).then(function (response) {
            return response.data
        }).catch(function (err) {
            throw err.response.data;
        })
    },
    delete: function (url, config = {}) {
        return axios.delete(url, config).then(function (response) {
            return response.data
        }).catch(function (err) {
            throw err.response.data;
        })
    }
}
