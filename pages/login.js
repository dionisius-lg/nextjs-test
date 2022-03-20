import { useState, useEffect, useContext } from "react";
import { Row, Col, Card, Form, Button, Spinner } from "react-bootstrap";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import _ from "lodash";
import { useRouter } from "next/router";
import Link from "next/link";
import FrontLayout from "components/layouts/FrontLayout";
import fetchJson, { FetchError } from "lib/fetchJson";
import useUser from "lib/useUser";
import { GeneralContext } from "contexts/General";

export default function Login() {
    // here we just check if user is already logged in and redirect to profile
    const { mutateUser } = useUser({
        // redirectTo: "/profile-sg",
        redirectTo: "/dashboard",
        redirectIfFound: true,
    });

    const [errorMsg, setErrorMsg] = useState(false);
    const [inputs, setInputs] = useState(false);
    const router = useRouter()

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
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
                })
            )
        } catch (err) {
            if (err instanceof FetchError) {
                console.log(err.response)
                setErrorMsg("Invalid credentials")
            } else {
                console.error("An unexpected error happened:", err)
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
                                        {errorMsg && <div className="text-center text-danger">{errorMsg}</div>}
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
