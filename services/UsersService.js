import { useState, useEffect, useContext } from "react";
import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "lib/session";

import { restApi } from "lib/restApi";
import { isEmptyValue } from "utils/general";
import { PaginationInfo } from "utils/pagination";

export default async function UsersService({ req, res }) {
// export const users = async ({ req, res }) => {
    const initialResult = {
        success: false,
        total_data: 0,
        data: null
    }
    const endpoint = '/users'
    const unauthorizedStatus = [401, 403]
console.log(req, 'asdasd')
    return async function Get(params) {
    // const Get = async (params) => {
        let result = initialResult
        let resultPaging = {}
        let paramString = ''
        let paramArray = []
        let paramObject = {
            limit: 20
        }

        if (!isEmptyValue(params) && _.isObject(params)) {
            if ('id' in params && !_.isNaN(params['id'])) {
                // const reqLogin = await restApi({ req, res, method: 'POST', endpoint: '/auth/login', data })
                await restApi({ req, res, method: 'GET', endpoint: `${endpoint}/${params['id']}` }).then((res) => {
                // await restApi('get', `${endpoint}/${params['id']}`).then((res) => {
                    result = {
                        ...result,
                        success: res.success,
                        total_data: res.total_data,
                        data: res.data
                    }
                }).catch((err) => {
                    console.log(err)
                    // if (err.response) {
                    //     let res = err.response.data
                    //     if (unauthorizedStatus.indexOf(res.response_code) >= 0) {
                    //         return unauthorized()
                    //     }
                    // }
                })

                return result
            } else {
                paramObject = { ...paramObject, ...params }
            }
        }

        Object.keys(paramObject).forEach((item) => {
            if (!isEmptyValue(paramObject[item])) {
                paramArray.push(`${item}=${paramObject[item]}`)
            }
        })

        if (!isEmptyValue(paramArray)) {
            paramString = `${paramArray.join("&")}`
        }

        await publicApi('get', `${endpoint}?${paramString}`).then((res) => {
            if ('paging' in res) {
                let pagingInfo = PaginationInfo(res.total_data, paramObject.limit || 0, res.paging.current)
                resultPaging = {
                    ...res.paging,
                    index: pagingInfo.index
                }
            }

            result = {
                ...result,
                success: res.success,
                total_data: res.total_data,
                limit: paramObject.limit,
                data: res.data,
                paging: resultPaging
            }
        }).catch((err) => {
            if (err.response) {
                let res = err.response.data
                if (unauthorizedStatus.indexOf(res.response_code) >= 0) {
                    return unauthorized()
                }
            }
        })

        return result
    }
}
