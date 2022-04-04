import { useState, useEffect } from "react"
import { Modal, Form, Row, Col, Button, Spinner } from "react-bootstrap"
import { useForm, Controller } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { isEmptyValue } from "utils/general"
import fetchJson, { FetchError } from "lib/fetchJson"
import CustomSelect from "components/CustomSelect"
import * as yup from "yup"
import _ from "lodash"

export default function Add({ changeModal, changeNotif, changeData }) {
    const { handleSubmit, formState: {errors, isSubmitting }, control, register, reset, getValues } = useForm({
        defaultValues: initData,
        resolver: validationSchema
    })

    const onSubmit = async (data, e) => {
        e.preventDefault()

        Object.keys(data).forEach((key) => {
            if (['is_active'].includes(key) && data[key] === false) {
                data[key] = "0"
            }
        })

        await fetchJson(`/api/product_categories`, {
            method: "POST",
            body: JSON.stringify(data),
        }).then((res) => {
            if (res.success) {
                changeNotif({
                    type: "success",
                    // title: "Success",
                    message: "Data has been saved.",
                    show: true
                })
                changeData()
            } else {
                changeNotif({
                    type: "error",
                    // title: "Error",
                    message: "Failed to save data.",
                    show: true
                })
            }
        }).catch((err) => {
            if (err instanceof FetchError) {
                console.log(err.response)
            } else {
                console.log(err)
            }

            changeNotif({
                type: "error",
                // title: "Error",
                message: "Failed to save data.",
                show: true
            })
        })

        return changeModal()
    }

    return (
        <>
            <Modal.Header closeButton={isSubmitting ? false : true}>
                <Modal.Title>Add Data</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Modal.Body className="pb-1">
                    <Row>
                        <Form.Group className="col-md-12">
                            <Form.Label>Name <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                size="sm"
                                isInvalid={!!errors.name}
                                {...register("name")}
                            />
                            <Form.Control.Feedback type="invalid">{errors.name?.message}</Form.Control.Feedback>
                        </Form.Group>
                    </Row>
                    <Form.Group controlId="IsActive">
                        <Form.Check
                            type="checkbox"
                            label="Active"
                            custom
                            checked={true}
                            disabled={true}
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" type="submit" disabled={isSubmitting}>
                        {isSubmitting && <Spinner animation="border" size="sm" className="mr-1" />} Save
                    </Button>
                    <Button variant="light" disabled={isSubmitting} onClick={changeModal}>Close</Button>
                </Modal.Footer>
            </Form>
        </>
    )
}

const initData = {
    name: "",
    is_active: "1"
}

const initOptSelect = [{
    value: "",
    label: "Choose..."
}]

const validationSchema = yupResolver(yup.object().shape({
    name: yup.string()
        .required("This field is required.")
        .min(1, "This field must be at least 1 characters in length."),
}))
