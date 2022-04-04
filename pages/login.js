import { useState, useEffect, useContext } from "react"
import { Row, Col, Card, Form, Button, Spinner } from "react-bootstrap"
import { isEmptyValue } from "utils/general"
import { useForm, Controller } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import fetchJson, { FetchError } from "lib/fetchJson"
import useUser from "lib/useUser"
import FrontLayout from "components/layouts/FrontLayout"
import Notification from "components/Notification"
import Link from "next/link"
import * as yup from "yup"
import _ from "lodash"

export default function Login() {
    const { mutateUser } = useUser({
        redirectTo: "/",
        redirectIfFound: true,
    })

    const [notif, setNotif] = useState({
        type: null,
        message: "",
        show: false
    })

    const { handleSubmit, formState: { errors, isSubmitting }, register } = useForm({
        defaultValues: {
            username: "",
            password: ""
        },
        resolver: yupResolver(yup.object().shape({
            username: yup.string()
                .required("Username is required."),
            password: yup.string()
                .required("Password is required.")
        }))
    })

    const onSubmit = async (data, e) => {
        e.preventDefault()

        try {
            mutateUser(
                await fetchJson("/api/login", {
                    method: "POST",
                    // headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
                })
            )
        } catch (err) {
            if (err instanceof FetchError) {
                console.log(err.response)
                setNotif({
                    type: "error",
                    message: "Invalid credentials",
                    show: true
                })
            } else {
                console.error("An unexpected error happened:", err)
                setNotif({
                    type: "error",
                    message: "An unexpected error happened, please try again",
                    show: true
                })
            }
        }
    }

    return (
        <FrontLayout>
            <Row className="justify-content-center">
                <Col md={9} lg={12} xl={6}>
                    <Card className="o-hidden border-0 shadow-lg my-5">
                        <Card.Body className="p-0">
                            <Row>
                                <Col lg={12}>
                                    <div className="p-5">
                                        <div className="text-center">
                                            <h1 className="h4 text-gray-900 mb-4">{process.env.project.name}</h1>
                                        </div>
                                        {notif.show && <Notification
                                            type={notif.type}
                                            message={notif.message}
                                            show={notif.show}
                                            changeShow={() => setNotif({
                                                type: null,
                                                message: "",
                                                show: false
                                            })}
                                        />}
                                        <Form className="user" onSubmit={handleSubmit(onSubmit)}>
                                            <Form.Group controlId="Username">
                                                <Form.Control
                                                    type="text"
                                                    className="form-control-user"
                                                    placeholder="Username"
                                                    isInvalid={!!errors.username}
                                                    {...register("username")}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.username?.message}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                            <Form.Group controlId="Password">
                                                <Form.Control
                                                    type="password"
                                                    className="form-control-user"
                                                    placeholder="Password"
                                                    isInvalid={!!errors.password}
                                                    {...register("password")}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.password?.message}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                            <Button type="submit" className="btn-block btn-user" disabled={isSubmitting}>
                                                {isSubmitting && <Spinner animation="border" size="sm" className="mr-1" />} Login
                                             </Button>
                                        </Form>
                                        <hr />
                                        <div className="text-center">
                                            <Link href="/forgot-password"><a className="small">Forgot Password?</a></Link>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </FrontLayout>
    )
}
