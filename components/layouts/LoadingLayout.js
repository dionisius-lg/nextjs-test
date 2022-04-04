import Head from "next/head";
import { Container, Spinner } from "react-bootstrap";

export default function FrontLayout(props) {
    return (
        <>
            <Head>
                <title>{process.env.project.name} | {process.env.client.name} | {props.title || ''}</title>
            </Head>
            <Container fluid className="min-vh-100 vh-100 h-100 text-center" style={{position: "relative"}}>
                <div style={{position: "absolute", top: "50%", left: "40%", transform: "translateY(-50%)"}}>
                <Spinner animation="grow" variant="primary" />
                        <Spinner animation="grow" variant="secondary" />
                        <Spinner animation="grow" variant="success" />
                        <Spinner animation="grow" variant="danger" />
                        <Spinner animation="grow" variant="warning" />
                        <Spinner animation="grow" variant="info" />
                        <Spinner animation="grow" variant="dark" />
                        {/* <h1>Please wait ...</h1> */}
                </div>
            </Container>
        </>
    )

}
