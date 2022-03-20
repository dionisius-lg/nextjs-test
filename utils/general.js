import { useState } from "react";
import moment from "moment";

export const isEmptyValue = (value) => {
    return (
        value === undefined ||
        value === null ||
        (Array.isArray(value) && value.length === 0) ||
        (typeof value === 'object' && Object.keys(value).length === 0) ||
        (typeof value === 'string' && value.trim().length === 0) ||
        (typeof value === 'number' && value < 1)
    )
}

export const formatDate = (value) => {
    const date = moment(value)

    if (date.isValid()) {
        return date.format('YYYY-MM-DD')
    }

    return false
}

export const formatDateTime = (value) => {
    const date = moment(value)

    if (date.isValid()) {
        return date.format('YYYY-MM-DD HH:mm:ss')
    }

    return false
}

export const useLocalStorage = (key, initialValue) => {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(key)
            return item ? JSON.parse(item) : initialValue
        } catch (err) {
            console.log(err)
            return initialValue
        }
    })

    const setValue = (value) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value
            setStoredValue(valueToStore)
            window.localStorage.setItem(key, JSON.stringify(valueToStore))
        } catch (err) {
            console.log(err)
        }
    }

    return [storedValue, setValue]
}

export const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}
