const axios = require('axios');
const { json } = require('express');
const baseHeader = {
    'authority': 'acb-dev-shared-gateway.creditstrong.com',
    'sec-ch-ua': '"Chromium";v="94", "Google Chrome";v="94", ";Not A Brand";v="99"',
    'sec-ch-ua-mobile': '?0',
    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.55 Safari/537.36',
    'content-type': 'application/json',
    'accept': 'application/json, text/plain, */*',
    'acb-system': 'CONSUMER',
    'performance-testing': '0',
    'sec-ch-ua-platform': '"macOS"',
    'origin': 'https://acb-dev-customer-ui.creditstrong.com',
    'sec-fetch-site': 'same-site',
    'sec-fetch-mode': 'cors',
    'sec-fetch-dest': 'empty',
    'referer': 'https://acb-dev-customer-ui.creditstrong.com/',
    'accept-language': 'en-US,en;q=0.9',
}

module.exports = {
    get: function (url, params, header) {
        url += '?';
        if (params && Object.keys(params).length) {
            Object.keys(params).forEach(key => {
                url += `${key}=${params[key]}&`
            });
        }
        var config = {
            method: 'get',
            url,
            headers: {
                ...baseHeader,
                ...(header || {})
            }
        };
        return axios(config)
            .then(function (response) {
                return response.data;
            })
            .catch(function (error) {
                return Promise.reject(error);
            });
    },
    post: function (url, body, header) {
        var config = {
            method: 'post',
            url,
            headers: {
                ...baseHeader,
                ...(header || {})
            },
            data: body
        };
        return axios(config)
            .then(function (response) {
                return response.data;
            })
            .catch(function (error) {
                return Promise.reject(error);
            });
    },
    put: function (url, body, header) {
        var config = {
            method: 'put',
            url,
            headers: {
                ...baseHeader,
                ...(header || {})
            },
            data: body
        };
        return axios(config)
            .then(function (response) {
                return response.data;
            })
            .catch(function (error) {
                return Promise.reject(error);
            });
    },
    patch: function (url, body, header) {
        var config = {
            method: 'patch',
            url,
            headers: {
                ...baseHeader,
                ...(header || {})
            },
            data: body
        };
        return axios(config)
            .then(function (response) {
                return response.data;
            })
            .catch(function (error) {
                return Promise.reject(error);
            });
    }
}