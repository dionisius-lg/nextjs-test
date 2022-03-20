import Head from "next/head";
import Footer from "components/Footer";
import Navbar from "components/Navbar";
import Sidebar from "components/Sidebar";

export default function MainLayout(props) {
    return (
        <div>
            <Head>
                <title>{process.env.project.name} | {process.env.client.name} | {props.title || '' }</title>
                <link href="vendor/fontawesome-free/css/all.min.css" rel="stylesheet" type="text/css"></link>
            </Head>

            <div id="wrapper">
                <Navbar />
                <div id="layoutSidenav">
                    <Sidebar />
                    <div id="layoutSidenav_content">
                        <main>
                            <div className="container-fluid">
                                {props.children}
                            </div>
                        </main>
                        <Footer />
                    </div>
                </div>
            </div>
        </div>
    )
}
