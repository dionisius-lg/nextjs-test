import { useState, useEffect, useContext } from "react";
import { withIronSessionApiRoute, withIronSessionSsr } from "iron-session/next";
import { sessionOptions } from "lib/session";
import { restApi } from "lib/restApi";
import { PaginationInfo } from "utils/pagination";
import { isEmptyValue } from "utils/general";
import _ from "lodash";

export default withIronSessionApiRoute(async (req, res) => {
    const { method } = req
    const endpoint = '/users'
    const result = {
        success: false,
        total_data: 0,
        data: null
    }

    switch (method) {
        case "GET":
            return await Get({ req, res, endpoint, result })
            break;
        case "POST":
            return await Create({ req, res, endpoint, result })
            break;
        case "PUT":
            return await Update({ req, res, endpoint, result })
            break;
        default:
            return res.status(400).json(result)
            break;
    }
}, sessionOptions);

const Get = async ({ req, res, endpoint, result }) => {
    const { method, query } = req
    let paging = {}
    let queryStr = ''
    let queryObj = {
        limit: 20
    }

    if (!isEmptyValue(query) && _.isObject(query)) {
        if ('id' in query && !_.isNaN(query['id'])) {
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
        if ('paging' in fetchApi) {
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

const Create = async ({ req, res, endpoint, result }) => {
    const { method, body } = req

    if (!isEmptyValue(body) && _.isObject(body)) {
        const fetchApi = await restApi({ req, res, method, endpoint: `${endpoint}`, data: body })

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

    return res.json(result)
}

const Update = async ({ req, res, endpoint, result }) => {
    const { method, body, query } = req

    if (isEmptyValue(body) || !_.isObject(query)) {
        return res.json(result)
    }

    if (!isEmptyValue(query) && _.isObject(query)) {
        if (query.hasOwnProperty('id') && !_.isNaN(query['id'])) {
            const fetchApi = await restApi({ req, res, method, endpoint: `${endpoint}/${query['id']}`, data: body })

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
    }

    return res.json(result)
}