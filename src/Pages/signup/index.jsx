import React, { useState } from "react";
import { Container, Form, Button, Row, Col } from "react-bootstrap";
import logo from "../../assests/img/logo.png";
import bcrypt from "bcryptjs";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phoneNumber, setPhoneNumber] = useState(0)
    const [role, setRole] = useState("")
    const navigate = useNavigate();

    const handleSumbit = async (e) => {
        e.preventDefault();

        try {
            const hashedPassword = await bcrypt.hash(password, 10);

            const formData = new FormData();
            formData.append("UserName", email);
            formData.append("Email", email);
            formData.append("EmailConfirmed", false);
            formData.append("PhoneNumber", phoneNumber);
            formData.append("passwordHash", hashedPassword);
            console.log(formData);

            const response = await axios.post(
                "http://homevocation-001-site4.atempurl.com/api/UserControllerLogin/register",
                formData
            );

            if (!response.ok) {
                throw new Error("Failed to sign up.");
            }

            const result = await response.json();
            console.log("Signup successful:", result);
            role === "agent" ? navigate("/AgentPanel") : role === "client" ? navigate("/ClientPanel") : navigate("/UserPanel")
        } catch (err) {
            console.error("Error during signup:", err);
        }
    };

    return (
        <Container className="my-5">
            <Row className="justify-content-center">
                <Col xs={12} md={8} lg={6}>
                    <div className="text-center mb-4">
                        <img
                            src={logo}
                            alt="GeoEstate Logo"
                            style={{ width: "150px", height: "auto" }}
                        />
                        <h2 className="mt-3">Signup Here</h2>
                    </div>
                    <Form onSubmit={handleSumbit}>
                        <Form.Group className="mb-3" controlId="firstName">
                            <Form.Label>First Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter your name"
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter your email"
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="firstName">
                            <Form.Label>Phone Number</Form.Label>
                            <Form.Control
                                type="tel"
                                placeholder="Enter your phone number"
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Create a password"
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="role">
                            <Form.Label>Role</Form.Label>
                            <Form.Select onChange={(e) => setRole(e.target.value)}>
                                <option value="buyer">Buyer</option>
                                <option value="agent">Agent</option>
                                <option value="client">Client</option>
                            </Form.Select>
                        </Form.Group>

                        <Button
                            variant="success"
                            type="submit"
                            className="w-100 text-white"
                        >
                            Sign Up
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default Signup;
