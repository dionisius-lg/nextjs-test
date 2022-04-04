import { withIronSessionApiRoute, withIronSessionSsr } from "iron-session/next"
import { sessionOptions } from "lib/session"
import { restApi } from "lib/restApi"
import { PaginationInfo } from "utils/pagination"
import { isEmptyValue, isJson } from "utils/general"
import _ from "lodash"

export default withIronSessionApiRoute(async (req, res) => {
    const { method } = req
    const result = { success: false, total_data: 0, data: null }
    const endpoint = '/user_levels'

    switch (method) {
        case "GET":
            return await GetData(req, res, endpoint, result)
            break
        case "POST":
            return await PostData(req, res, endpoint, result)
            break
        default:
            return res.status(400).json(result)
            break
    }
}, sessionOptions)

const GetData = async (req, res, endpoint, result) => {
    const { method, query } = req
    let paging = {}
    let queryStr = ''
    let queryObj = {
        limit: 20
    }

    if (!isEmptyValue(query) && _.isObject(query)) {
        if (query.hasOwnProperty('id') && !_.isNaN(query['id'])) {
            const fetchApi = await restApi({ req, res, method, endpoint: `${endpoint}/${query['id']}` })

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

        queryObj = { ...queryObj, ...query }
    }

    if (!isEmptyValue(queryObj) && _.isObject(queryObj)) {
        queryStr = new URLSearchParams(queryObj)
    }

    const fetchApi = await restApi({ req, res, method, endpoint: `${endpoint}?${queryStr}` })

    if (fetchApi.response_code === 200) {
        if (fetchApi.hasOwnProperty('paging') && !isEmptyValue(fetchApi['paging'])) {
            const pagingInfo = PaginationInfo({
                total: fetchApi.total_data,
                limit: queryObj.limit || 0,
                current: fetchApi.paging.current
            })

            paging = {
                ...fetchApi.paging,
                index: pagingInfo.index
            }
        }

        result = {
            ...result,
            success: true,
            total_data: fetchApi.total_data,
            data: fetchApi.data,
            limit: queryObj.limit,
            paging: paging
        }
    }

    return res.status(fetchApi.response_code).json(result)
}

const PostData = async (req, res, endpoint, result) => {
    const { method, body } = req

    if (isEmptyValue(body) || !isJson(body)) {
        return res.json(result)
    }

    const data = JSON.parse(body)
    const fetchApi = await restApi({ req, res, method, endpoint, data })

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
