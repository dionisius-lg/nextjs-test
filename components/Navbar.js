import { useState, useEffect, useContext } from "react";
import { Badge, Button, Dropdown, Form, Nav, NavDropdown } from "react-bootstrap";
import { strTok } from "utils/general";
import { useRouter } from "next/router";
import fetchJson from "lib/fetchJson";
import useUser from "lib/useUser";

export default function Navbar() {
    const router = useRouter()
    const { user, mutateUser } = useUser()
    const toggleClass = () => {
        document.body.classList.toggle("sb-sidenav-toggled");
    }

    return (
        <nav className="navbar sb-topnav navbar-expand navbar-dark bg-dark">
            <a className="navbar-brand" href="index.html">POS</a>
            <Button variant="dark" size="sm" className="order-1 order-lg-0" id="sidebarToggle" onClick={toggleClass}>
                <i className="fas fa-bars text-secondary"></i>
            </Button>
            <ul className="navbar-nav ml-auto mr-0 mr-md-3 my-2 my-md-0">
                <Dropdown as={Nav.Item}>
                    <Dropdown.Toggle as={Nav.Link} id="userDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        {user?.isLoggedIn === true && (<>
                            <i className="fas fa-user fa-fw" />
                            <span className="mx-1">{strTok(user.data.fullname)}</span>
                        </>)}
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="dropdown-menu-right" aria-labelledby="userDropdown">
                        <Dropdown.Item href="#">Settings</Dropdown.Item>
                        <Dropdown.Item href="#">Activity Log</Dropdown.Item>
                        <Dropdown.Divider />
                        {user?.isLoggedIn === true && (<>
                            <Dropdown.Item href="/api/logout" onClick={async (e) => {
                                e.preventDefault();
                                mutateUser(
                                    await fetchJson("/api/logout", { method: "POST" }),
                                    false,
                                );
                                router.push("/login");
                            }}>Logout</Dropdown.Item>
                        </>)}
                    </Dropdown.Menu>
                </Dropdown>
            </ul>
        </nav>
    )
}
