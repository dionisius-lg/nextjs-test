import { useState, useEffect } from "react";
import { Modal, Form, Row, Col, Button, Spinner } from "react-bootstrap";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { isEmptyValue } from "utils/general";
import fetchJson, { FetchError } from "lib/fetchJson";
import CustomSelect from "components/CustomSelect";
import * as yup from "yup";
import _ from "lodash";

export default function Add({ changeModal, changeAlert, changeData }) {
    const { handleSubmit, formState: {errors, isSubmitting }, control, register, reset, getValues } = useForm({
        defaultValues: initData,
        resolver: validationSchema
    })

    const [optUserLevels, setOptUserLevels] = useState(initOptSelect)
    const [optProvinces, setOptProvinces] = useState(initOptSelect)
    const [optCities, setOptCities] = useState(initOptSelect)
    const [provinceId, setProvinceId] = useState("")

    useEffect(() => {
        async function initFetch() {
            await fetchJson(`/api/user_levels?${new URLSearchParams({
                limit: 100,
                order: "name",
                is_active: 1
            })}`).then((res) => {
                if (!isEmptyValue(res.data)) {
                    let mapOptSelect = res.data.map((row) => {
                        return { value: row.id, label: row.name }
                    })

                    setOptUserLevels([
                        ...initOptSelect,
                        ...mapOptSelect
                    ])
                }
            }).catch((err) => {
                if (err instanceof FetchError) {
                    console.log(err.response)
                } else {
                    console.log(err)
                }
            })
        }

        initFetch()
        return () => setOptUserLevels(initOptSelect)
    }, [])

    useEffect(() => {
        async function initFetch() {
            await fetchJson(`/api/provinces?${new URLSearchParams({
                limit: 100,
                order: "name",
                is_active: 1
            })}`).then((res) => {
                if (!isEmptyValue(res.data)) {
                    let mapOptSelect = res.data.map((row) => {
                        return { value: row.id, label: row.name }
                    })

                    setOptProvinces([
                        ...initOptSelect,
                        ...mapOptSelect
                    ])
                }
            }).catch((err) => {
                if (err instanceof FetchError) {
                    console.log(err.response)
                } else {
                    console.log(err)
                }
            })
        }

        initFetch()
        return () => setOptProvinces(initOptSelect)
    }, [])

    useEffect(() => {
        async function initFetch() {
            await fetchJson(`/api/cities?${new URLSearchParams({
                limit: 100,
                order: "name",
                is_active: 1,
                province_id: provinceId
            })}`).then((res) => {
                if (!isEmptyValue(res.data)) {
                    let mapOptSelect = res.data.map((row) => {
                        return { value: row.id, label: row.name }
                    })

                    setOptCities([
                        ...initOptSelect,
                        ...mapOptSelect
                    ])
                }
            }).catch((err) => {
                if (err instanceof FetchError) {
                    console.log(err.response)
                } else {
                    console.log(err)
                }
            })            
        }

        if (!isEmptyValue(provinceId) && !_.isNaN(provinceId)) initFetch()
        return () => setOptCities(initOptSelect)
    }, [provinceId])

    const onSubmit = async (data, e) => {
        e.preventDefault()

        Object.keys(data).forEach((key) => {
            if (['is_active'].includes(key) && data[key] === false) {
                data[key] = "0"
            }
        })

        await fetchJson(`/api/users`, {
            method: "POST",
            body: JSON.stringify(data),
        }).then((res) => {
            if (res.success) {
                changeAlert({
                    title: "Success",
                    message: "Data has been saved.",
                    show: true,
                    type: "success"
                })
                changeData()
            } else {
                changeAlert({
                    title: "Error",
                    message: "Failed to save data.",
                    show: true,
                    type: "error"
                })
            }
        }).catch((err) => {
            if (err instanceof FetchError) {
                console.log(err.response)
            } else {
                console.log(err)
            }

            changeAlert({
                title: "Error",
                message: "Failed to save data.",
                show: true,
                type: "error"
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
                        <Form.Group className="col-md-8">
                            <Form.Label>Fullname <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                size="sm"
                                isInvalid={!!errors.fullname}
                                {...register("fullname")}
                            />
                            <Form.Control.Feedback type="invalid">{errors.fullname?.message}</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="col-md-4">
                            <Form.Label>Username <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                size="sm"
                                isInvalid={!!errors.username}
                                {...register("username")}
                            />
                            <Form.Control.Feedback type="invalid">{errors.username?.message}</Form.Control.Feedback>
                        </Form.Group>
                    </Row>
                    <Row>
                        <Form.Group className="col-md-4">
                            <Form.Label>User Level <span className="text-danger">*</span></Form.Label>
                            <Controller
                                name={"user_level_id"}
                                control={control}
                                render={({ field: {value, onChange} }) => {
                                    return (
                                        <CustomSelect
                                            optionSelect={optUserLevels}
                                            onChangeValue={(value) => onChange(value)}
                                            value={getValues('user_level_id')}
                                            isError={!!errors.user_level_id ? true : false}
                                            isSmall={true}
                                        />
                                    )
                                }}
                            />
                            <Form.Control.Feedback type="invalid">{errors.user_level_id?.message}</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="col-md-4">
                            <Form.Label>Email <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                type="text"
                                size="sm"
                                isInvalid={!!errors.email}
                                {...register("email")}
                            />
                            <Form.Control.Feedback type="invalid">{errors.email?.message}</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="col-md-4">
                            <Form.Label>Phone</Form.Label>
                            <Form.Control
                                type="text"
                                size="sm"
                                isInvalid={!!errors.phone}
                                {...register("phone")}
                            />
                            <Form.Control.Feedback type="invalid">{errors.phone?.message}</Form.Control.Feedback>
                        </Form.Group>
                    </Row>
                    <Row>
                        <Form.Group className="col-md-12">
                            <Form.Label>Address</Form.Label>
                            <Form.Control
                                as="textarea"
                                size="sm"
                                rows={2}
                                isInvalid={!!errors.address}
                                {...register("address")}
                            />
                            <Form.Control.Feedback type="invalid">{errors.address?.message}</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="col-md-4">
                            <Form.Label>Province</Form.Label>
                            <Controller
                                name={"province_id"}
                                control={control}
                                render={({ field: {value, onChange} }) => {
                                    return (
                                        <CustomSelect
                                            optionSelect={optProvinces}
                                            onChangeValue={(value) => {
                                                onChange(value)
                                                setProvinceId(value)
                                            }}
                                            value={getValues('province_id')}
                                            isError={!!errors.province_id ? true : false}
                                            isSmall={true}
                                        />
                                    )
                                }}
                            />
                            <Form.Control.Feedback type="invalid">{errors.province_id?.message}</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="col-md-4">
                            <Form.Label>City</Form.Label>
                            <Controller
                                name={"city_id"}
                                control={control}
                                render={({ field: {value, onChange} }) => {
                                    return (
                                        <CustomSelect
                                            optionSelect={optCities}
                                            onChangeValue={(value) => onChange(value)}
                                            value={getValues('city_id')}
                                            isError={!!errors.city_id ? true : false}
                                            isSmall={true}
                                        />
                                    )
                                }}
                            />
                            <Form.Control.Feedback type="invalid">{errors.city_id?.message}</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="col-md-4">
                            <Form.Label>Zip Code</Form.Label>
                            <Form.Control
                                type="text"
                                size="sm"
                                isInvalid={!!errors.zip_code}
                                {...register("zip_code")}
                            />
                            <Form.Control.Feedback type="invalid">{errors.zip_code?.message}</Form.Control.Feedback>
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
    username: "",
    email: "",
    user_level_id: "",
    fullname: "",
    birth_place: "",
    birth_date:  "",
    phone: "",
    address: "",
    zip_code: "",
    province_id: "",
    city_id: "",
    is_active: "1"
}

const initOptSelect = [{
    value: "",
    label: "Choose..."
}]

const validationSchema = yupResolver(yup.object().shape({
    username: yup.string()
        .required("This field is required.")
        .min(4, "This field must be at least 6 characters in length."),
    email: yup.string()
        .required("This field is required.")
        .email("This field must contain a valid email address."),
    user_level_id: yup.string()
        .required("This field is required."),
    fullname: yup.string()
        .required("This field is required."),
    birth_place: yup.string(),
        // .required("This field is required."),
    birth_date: yup.string(),
        // .required("This field is required."),
    phone: yup.string()
        .matches(/^[0-9]+$/, { message: "This field is invalid.", excludeEmptyString: true }),
    address: yup.string(),
        // .required("This field is required."),
    zip_code: yup.string()
        .test("len",  "This field must exactly 6 characters in length or empty.",
            (val) => !isEmptyValue(val) ? val.length === 6 : true
        ),
    // province_id: yup.string()
    //     .required("This field is required."),
    // city_id: yup.string()
    //     .required("This field is required."),
    // is_active: yup.string().oneOf(["1"], "This checkbox is required.")
}))
