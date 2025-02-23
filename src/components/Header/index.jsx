import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import {
    Container,
    Navbar,
    Nav,
    NavDropdown,
    Offcanvas,
} from "react-bootstrap";
import logo from "../../assests/img/logo.png";
import flag from "../../assests/img/flag.webp";
import "./Header.css";

const Header = () => {
    const [language, setLanguage] = useState("Eng");

    const handleLanguageChange = (lang) => {
        setLanguage(lang);
        toast.success(`Language changed to: ${lang}`);
    };

    return (
        <Navbar bg="white" expand="lg" className="py-3 shadow-sm" variant="light">
            <ToastContainer />
            <Container fluid>
                {/* Logo */}
                <Navbar.Brand href="#home" className="d-flex align-items-center">
                    <img src={logo} alt="GeoEstate Logo" height="30" />
                </Navbar.Brand>

                {/* Toggle Button for Mobile */}
                <Navbar.Toggle aria-controls="offcanvasNavbar" />
                <Navbar.Offcanvas
                    id="offcanvasNavbar"
                    aria-labelledby="offcanvasNavbarLabel"
                    placement="end"
                >
                    <Offcanvas.Header closeButton>
                        <Offcanvas.Title id="offcanvasNavbarLabel">GeoEstate</Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                        <Nav className="justify-content-end flex-grow-1 pe-3">
                            {/* Navigation Links */}
                            <Nav.Link href="#home">Home</Nav.Link>
                            <Nav.Link href="#price">Price</Nav.Link>
                            <Nav.Link href="#company">Company</Nav.Link>
                            <Nav.Link href="#blog">Blog</Nav.Link>
                            <Nav.Link href="#contact">Contact</Nav.Link>

                            {/* Login/Signup Buttons */}
                            <Nav.Link
                                href="./pages/signin.html"
                                className="btn btn-outline-dark rounded-pill px-3 py-2 me-2"
                            >
                                Login
                            </Nav.Link>
                            <Nav.Link
                                href="./pages/signup.html"
                                className="btn btn-outline-success rounded-pill px-3 py-2"
                            >
                                Sign Up
                            </Nav.Link>

                            {/* Language Dropdown */}
                            <NavDropdown
                                className="d-flex align-items-center gap-1"
                                id="navbarScrollingDropdown"
                            >
                                <NavDropdown.Item onClick={() => handleLanguageChange("French")}>
                                    <img
                                        src="https://upload.wikimedia.org/wikipedia/commons/c/c3/Flag_of_France.svg"
                                        alt="French"
                                        style={{ height: "15px", width: "20px", marginRight: "8px" }}
                                    />
                                    French
                                </NavDropdown.Item>
                                <NavDropdown.Item onClick={() => handleLanguageChange("German")}>
                                    <img
                                        src="https://upload.wikimedia.org/wikipedia/en/b/ba/Flag_of_Germany.svg"
                                        alt="German"
                                        style={{ height: "15px", width: "20px", marginRight: "8px" }}
                                    />
                                    German
                                </NavDropdown.Item>
                            </NavDropdown>

                        </Nav>
                    </Offcanvas.Body>
                </Navbar.Offcanvas>
            </Container>
        </Navbar>
    );
};

export default Header;



