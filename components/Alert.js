import { useState, useEffect } from "react";
import { Alert } from "react-bootstrap";
import { isEmptyValue } from "utils/general"
import _ from "lodash";

export const AlertError = ({ title = "", message = "", show, showChange }) => {
    const [showAlert, setShowAlert] = useState(true)

    useEffect(() => {
        if (show === false) return

        setShowAlert(true)
    }, [show])

    const handleClose = () => {
        setShowAlert(false)
        if (typeof showChange === 'function') showChange()
    }

    return (
        <Alert variant='danger' show={showAlert} onClose={handleClose} dismissible>
            {!isEmptyValue(title) && <Alert.Heading  className="mb-0">{title}</Alert.Heading>}
            <p className="mb-0">{!isEmptyValue(message) ? message : "Error"}</p>
        </Alert>
    )
}

export const AlertSuccess = ({ title = "", message = "", show, showChange }) => {
    const [showAlert, setShowAlert] = useState(true)

    useEffect(() => {
        if (show === false) return

        setShowAlert(true)
    }, [show])

    const handleClose = () => {
        setShowAlert(false)
        if (typeof showChange === 'function') showChange()
    }

    return (
        <Alert variant='info' show={showAlert} onClose={handleClose} dismissible>
            {!isEmptyValue(title) && <Alert.Heading  className="mb-0">{title}</Alert.Heading>}
            <p className="mb-0">{!isEmptyValue(message) ? message : "Success"}</p>
        </Alert>
    )
}

export const AlertWarning = ({ title = "", message = "", show, showChange }) => {
    const [showAlert, setShowAlert] = useState(true)

    useEffect(() => {
        if (show === false) return

        setShowAlert(true)
    }, [show])

    const handleClose = () => {
        setShowAlert(false)
        if (typeof showChange === 'function') showChange()
    }

    return (
        <Alert variant='warning' show={showAlert} onClose={handleClose} dismissible>
            {!isEmptyValue(title) && <Alert.Heading  className="mb-0">{title}</Alert.Heading>}
            <p className="mb-0">{!isEmptyValue(message) ? message : "Warning"}</p>
        </Alert>
    )
}
