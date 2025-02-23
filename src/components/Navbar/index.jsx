import React from "react";
import { Navbar, Nav, Container, Button, NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import ImgLogo from "../../assests/img/logo.png"; // Your logo image
import englogo from "../../assests/img/flag.webp"; // Language dropdown icon

const CustomNavbar = () => {
    return (
        <Navbar
            expand="lg"
            bg="white"
            className="shadow-sm fixed-top py-3"
            style={{ zIndex: 1000 }}
        >
            <Container>
                {/* Logo */}
                <Navbar.Brand href="/">
                    <img src={ImgLogo} alt="Logo" style={{ height: "60px" }} />
                </Navbar.Brand>

                {/* Mobile Toggler */}
                <Navbar.Toggle aria-controls="navbarNav" />

                {/* Navbar Links */}
                <Navbar.Collapse id="navbarNav">
                    <Nav className="mx-auto">
                        {["Home", "Price", "Company", "Blog", "Contact"].map((item) => (
                            <Nav.Link
                                key={item}
                                href={`#${item.toLowerCase()}`}
                                className="text-dark fw-semibold px-3"
                            >
                                {item}
                            </Nav.Link>
                        ))}
                    </Nav>

                    {/* Right Aligned Buttons */}
                    <div className="d-flex align-items-center">
                        <Link to="/Sign">
                            <Button variant="outline-dark" className="rounded-pill me-2">
                                Login
                            </Button>
                        </Link>
                        <Link to="/Signup">
                            <Button variant="outline-success" className="rounded-pill me-2">
                                Sign Up
                            </Button>
                        </Link>

                        {/* Dropdown */}
                        <NavDropdown
                            title={
                                <img
                                    src={englogo}
                                    alt="Language"
                                    style={{ height: "20px", width: "20px" }}
                                />
                            }
                            id="languageDropdown"
                            className="btn-outline-success rounded-pill"
                        >
                            <NavDropdown.Item href="#">
                                <div className="d-flex align-items-center">
                                    <img
                                        src="https://upload.wikimedia.org/wikipedia/commons/c/c3/Flag_of_France.svg"
                                        alt="French"
                                        className="me-2"
                                        style={{ height: "20px" }}
                                    />
                                    French
                                </div>
                            </NavDropdown.Item>
                            <NavDropdown.Item href="#">
                                <div className="d-flex align-items-center">
                                    <img
                                        src="https://upload.wikimedia.org/wikipedia/en/b/ba/Flag_of_Germany.svg"
                                        alt="German"
                                        className="me-2"
                                        style={{ height: "20px" }}
                                    />
                                    German
                                </div>
                            </NavDropdown.Item>
                        </NavDropdown>
                    </div>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default CustomNavbar;

