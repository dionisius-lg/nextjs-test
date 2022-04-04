import { useState, useEffect } from "react";
import { Alert } from "react-bootstrap";
import { isEmptyValue } from "utils/general"
import _ from "lodash";

export default function Notification({ variant="", title = "", message = "", show, changeShow }) {
    variant = variant.toString().toLowerCase()

    const [showAlert, setShowAlert] = useState(true)
    const variantAlert = ["danger", "info", "warning"].includes(variant) ? variant : "info"

    useEffect(() => {
        if (show === false) return

        setShowAlert(true)
    }, [show])

    const handleClose = () => {
        setShowAlert(false)
        if (typeof changeShow === 'function') changeShow()
    }

    return (
        <Alert variant={variantAlert} show={showAlert} onClose={handleClose} dismissible>
            {!isEmptyValue(title) && <Alert.Heading  className="mb-0">{title}</Alert.Heading>}
            <p className="mb-0">{!isEmptyValue(message) ? message : "Error"}</p>
        </Alert>
    )
}