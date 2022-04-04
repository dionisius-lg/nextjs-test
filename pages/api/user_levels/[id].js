import { withIronSessionApiRoute, withIronSessionSsr } from "iron-session/next"
import { sessionOptions } from "lib/session"
import { restApi } from "lib/restApi"
import { isEmptyValue, isJson } from "utils/general"
import _ from "lodash"

export default withIronSessionApiRoute(async (req, res) => {
    const { method, query: {id} } = req
    let result = { success: false, total_data: 0, data: null }
    const endpoint = '/user_levels'

    if (isEmptyValue(id) || _.isNaN(id)) {
        return res.status(400).json(result)
    }

    switch (method) {
        case "PUT":
            return await Update(req, res, endpoint, result)
            break
        case "DELETE":
            return await Delete(req, res, endpoint, result)
            break
        default:
            return res.status(400).json(result)
            break
    }
}, sessionOptions)

const Update = async (req, res, endpoint, result) => {
    const { method, body, query: {id} } = req

    if (isEmptyValue(body) || !isJson(body)) {
        return res.json(result)
    }

    const data = JSON.parse(body)
    const fetchApi = await restApi({ req, res, method, endpoint: `${endpoint}/${id}`, data })

    if (fetchApi.response_code === 200) {
        result = {
            ...result,
            success: true,
            total_data: fetchApi.total_data,
            data: fetchApi.data
        }
    }

    return res.status(fetchApi.response_code).json(result)
}

const Delete = async (req, res, endpoint, result) => {
    const { method, query: {id} } = req
    const fetchApi = await restApi({ req, res, method, endpoint: `${endpoint}/${id}` })

    if (fetchApi.response_code === 201) {
        result = {
            ...result,
            success: true,
            total_data: fetchApi.total_data,
            data: fetchApi.data
        }
    }

    return res.status(fetchApi.response_code).json(result)
}