import { useState, useEffect, useContext } from "react";
import { Accordion, Button, Collapse, Fade } from "react-bootstrap";
import { strTok } from "utils/general";
import { GlobalContext } from "contexts/Global";
import { useRouter } from "next/router";
import ActiveLink from "./ActiveLink";
import useUser from "lib/useUser";

export default function Sidebar() {
    const router = useRouter()
    const { user, mutateUser } = useUser()
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
                        <ActiveLink activeClassName="active" href="/">
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
                    </div>
                </div>
                <div className="sb-sidenav-footer">
                    {user?.isLoggedIn === true && (<>
                        <div className="small mb-2">Logged in as: {strTok(user.data.fullname)}</div>
                    </>)}
                    <Button variant="primary"><i className="fas fa-phone-alt"></i></Button>
                </div>
            </nav>
        </div>
    )
}
