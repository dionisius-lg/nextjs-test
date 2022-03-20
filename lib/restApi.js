import axios from "axios";

export const restApi = async ({ req, res, method, endpoint, data = {}, attempt = 1 }) => {
    const optMethod = method.toString().toLowerCase() || 'get'
    const user = await req.session.user
    let result = {}

    axios.defaults.baseURL = process.env.api.baseURL || 'http://localhost:8000'
    // axios.defaults.withCredentials = true
    axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

    if (endpoint !== '/login') {
        axios.defaults.headers.common = {
            'Authorization': `Bearer ${user?.token || ''}`
        }
    }

    switch (optMethod) {
        case 'post':
            result = await axios.post(endpoint, data).catch(errorResponse)
            break
        case 'put':
            result = await axios.put(endpoint, data).catch(errorResponse)
            break
        case 'delete':
            result = await axios.delete(endpoint).catch(errorResponse)
            break
        default:
            result = await axios.get(endpoint).catch(errorResponse)
            break
    }

    let totalAttempt = attempt
    if (result.data.response_code == 401 && totalAttempt <= 2) {
        const refresh = await refreshToken({ req })
        totalAttempt++

        if (refresh.response_code == 200) {
            return restApi({ req, res, method, endpoint, attempt: totalAttempt})
        }
    }

    return result.data
}

const refreshToken = async ({ req, res }) => {
    const user = await req.session.user

    axios.defaults.baseURL = process.env.api.baseURL || 'http://localhost:8000'
    axios.defaults.withCredentials = true
    axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
    axios.defaults.headers.common = {
        'Authorization': `Bearer ${user?.refreshToken || ''}`
    }

    const result = await axios.get('token/refresh').catch(errorResponse)

    if (result.data.response_code == 200) {
        let newUser = {
            ...user,
            token: result.data.data.token,
            refreshToken: result.data.data.refresh_token
        }

        req.session.user = newUser
        await req.session.save()
    }

    return result.data
}

const errorResponse = (error) => {
    if (error.response) {
        return error.response
    }

    let data = {
        request_time: new Date().getTime(),
        response_code: 503,
        success: false,
        message: 'Service Unavailable'
    }

    return { data }
}