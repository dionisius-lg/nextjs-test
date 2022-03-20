import Head from "next/head";

export default function FrontLayout(props) {
    return (
        <div>
            <Head>
                <title>{process.env.project.name} | {process.env.client.name} | {props.title || ''}</title>            
            </Head>
            <div className="container">
                {props.children}
            </div>
        </div>
    )

}
