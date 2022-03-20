import { useState, useEffect, useContext } from "react";
import { Accordion, Button, Collapse, Fade } from "react-bootstrap";
import { GeneralContext } from "contexts/General";

import Link from "next/link";
import { useRouter } from "next/router";
import ActiveLink from "./ActiveLink";

export default function Sidebar() {
    const router = useRouter()
    // const endpoint = 'http://127.0.0.1:8001'
    // const [user, setUser] = useContext(UserContext)
    const [open, setOpen] = useState(false)
    const [open2, setOpen2] = useState(false)
    const [socketResponse, setSocketResponse] = useState('')

    // useEffect(() => {

    //     if (user == '') {
    //         setUser(localStorage.getItem('user'))
    //     }

    //     // const socket = io(endpoint);
    //     // socket.emit('test', { "client":"nextjs" });
    //     // socket.on('test', data => {
    //     //     //setResponse(data);
    //     //     console.log('from socket: ', data)
    //     // });
    // }, [])

    return (
        <div id="layoutSidenav_nav">
            <nav className="sb-sidenav accordion sb-sidenav-dark" id="sidenavAccordion">
                <div className="sb-sidenav-menu">
                    <div className="nav">
                        <div className="sb-sidenav-menu-heading">Core</div>
                        <ActiveLink activeClassName="active" href="/dashboard">
                            <a className="nav-link">
                                <div className="sb-nav-link-icon"><i className="fas fa-tachometer-alt fa-fw"></i></div>
                                Dashboard
                            </a>
                        </ActiveLink>
                        <ActiveLink activeClassName="active" href="/calls">
                            <a className="nav-link">
                                <div className="sb-nav-link-icon"><i className="fas fa-phone-alt fa-fw"></i></div>
                                Calls
                            </a>
                        </ActiveLink>
                        <div className="sb-sidenav-menu-heading">Settings</div>
                        <ActiveLink activeClassName="active" href="/users">
                            <a className="nav-link">
                                <div className="sb-nav-link-icon"><i className="fas fa-user fa-fw"></i></div>
                                Users
                            </a>
                        </ActiveLink>
                        <ActiveLink activeClassName="active" href="/departments">
                            <a className="nav-link">
                                <div className="sb-nav-link-icon"><i className="fas fa-building fa-fw"></i></div>
                                Departments
                            </a>
                        </ActiveLink>
                        {/*
                        <div className="sb-sidenav-menu-heading">Interface</div>
                        <a onClick={() => setOpen(!open)} className="nav-link collapsed" href="#" data-toggle="collapse" data-target="#collapseLayouts" aria-expanded="false" aria-controls="collapseLayouts">
                            <div className="sb-nav-link-icon"><i className="fas fa-columns"></i></div>
                                Layouts
                            <div className="sb-sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
                        </a>
                        <Collapse in={open}>
                        <div className="collapse" id="collapseLayouts" aria-labelledby="headingOne" data-parent="#sidenavAccordion">
                            <nav className="sb-sidenav-menu-nested nav">
                                <a className="nav-link" href="layout-static.html">Static Navigation</a>
                                <a className="nav-link" href="layout-sidenav-light.html">Light Sidenav</a>
                            </nav>
                        </div>
                        </Collapse>
                        <a onClick={() => setOpen2(!open2)} className="nav-link collapsed" href="#" data-toggle="collapse" data-target="#collapsePages" aria-expanded="false" aria-controls="collapsePages">
                            <div className="sb-nav-link-icon"><i className="fas fa-book-open"></i></div>
                                Pages
                                <div className="sb-sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
                        </a>
                        <Collapse in={open2}>
                        <div className="collapse" id="collapsePages" aria-labelledby="headingTwo" data-parent="#sidenavAccordion">
                            <nav className="sb-sidenav-menu-nested nav accordion" id="sidenavAccordionPages">
                                <a className="nav-link collapsed" href="#" data-toggle="collapse" data-target="#pagesCollapseAuth" aria-expanded="false" aria-controls="pagesCollapseAuth">
                                    Authentication
                                        <div className="sb-sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
                                </a>
                                <div className="collapse" id="pagesCollapseAuth" aria-labelledby="headingOne" data-parent="#sidenavAccordionPages">
                                    <nav className="sb-sidenav-menu-nested nav">
                                        <a className="nav-link" href="login.html">Login</a>
                                        <a className="nav-link" href="register.html">Register</a>
                                        <a className="nav-link" href="password.html">Forgot Password</a>
                                    </nav>
                                </div>
                                <a className="nav-link collapsed" href="#" data-toggle="collapse" data-target="#pagesCollapseError" aria-expanded="false" aria-controls="pagesCollapseError">
                                    Error
                                        <div className="sb-sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
                                </a>
                                <div className="collapse" id="pagesCollapseError" aria-labelledby="headingOne" data-parent="#sidenavAccordionPages">
                                    <nav className="sb-sidenav-menu-nested nav">
                                        <a className="nav-link" href="401.html">401 Page</a>
                                        <a className="nav-link" href="404.html">404 Page</a>
                                        <a className="nav-link" href="500.html">500 Page</a>
                                    </nav>
                                </div>
                            </nav>
                        </div>
                        </Collapse>
                        */}
                        {/*<div className="sb-sidenav-menu-heading">Addons</div>
                        <a className="nav-link" href="charts.html">
                            <div className="sb-nav-link-icon"><i className="fas fa-chart-area"></i></div>
                                Charts
                            </a>
                        <a className="nav-link" href="tables.html">
                            <div className="sb-nav-link-icon"><i className="fas fa-table"></i></div>
                                Tables
    </a>*/}
                    </div>
                </div>
                <div className="sb-sidenav-footer">
                    {/* <div className="small">Logged in as: {user || 'user'}</div> */}
                    <div className="small">Logged in as: username</div>
                    <Button variant="primary"><i className="fas fa-phone-alt"></i></Button>
                </div>
            </nav>
        </div>
    )
}
