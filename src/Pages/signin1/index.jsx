import React, { useContext, useState } from "react";
import { Form, Button, InputGroup } from "react-bootstrap";
import { MdRemoveRedEye } from "react-icons/md";
import logo from "../../assests/img/logo.png";
import "./signin1.css";
import { Link, useNavigate } from "react-router-dom";
import { RolesContext } from "../../Context/RolesContext";

const Signin1 = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false); // Admin mode toggle

    const { roles } = useContext(RolesContext);

    const navigate = useNavigate();

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleRememberMeChange = (e) => {
        setRememberMe(e.target.checked);
    };

    const toggleAdminMode = (e) => {
        e.preventDefault();
        // Toggle admin mode and clear errors if any
        setIsAdmin(prev => !prev);
        setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        // In admin mode, verify that the email is the superadmin's email
        if (isAdmin && email !== "sanan.suisse@gmail.com") {
            setError("Unauthorized admin email. Please use the correct admin email.");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch("https://apis.geoestate.ai/api/UserRegister/login", {
                method: "POST",
                headers: {
                    "Accept": "*/*",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                    recuerdame: rememberMe,
                }),
            });

            const data = await response.json();
            console.log("API Response:", data);
            localStorage.setItem('user_id', data.userId);

            if (!response.ok) {
                throw new Error(data.message || "Login failed. Please check your credentials.");
            }

            console.log("Login successful:", data);

            // Store token if provided
            if (data.token) {
                localStorage.setItem("authToken", data.token);
            }

            // Navigate based on mode: admin goes to /users, normal user goes to /
            if (isAdmin) {
                navigate("/users");
            } else {
                const role = roles.find(role => role.id = data.roles)
                console.log(role);
                if (role.name !== "Buyer")
                    navigate(`/${role.name}Panel`)
                else
                    navigate("/UserPanel")
            }
        } catch (error) {
            console.error("Login Error:", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="__login-container shadow p-4 rounded">
                <div className="__login-logo text-center mb-4">
                    <img src={logo} alt="GeoEstate" style={{ width: "120px" }} />
                </div>
                {/* Added heading that toggles between Login and Login as Admin */}
                <h2 className="text-center mb-4">{isAdmin ? "Login as Admin" : "Login"}</h2>
                <Form onSubmit={handleSubmit}>
                    {error && <p className="text-danger text-center">{error}</p>}
                    <Form.Group className="mb-3" controlId="formEmail">
                        <Form.Label className="__form-label">E-mail</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Enter your e-mail"
                            className="__form-control"
                            value={email}
                            onChange={handleEmailChange}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formPassword">
                        <Form.Label className="__form-label">Password</Form.Label>
                        <InputGroup>
                            <Form.Control
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                className="__form-control"
                                value={password}
                                onChange={handlePasswordChange}
                            />
                            <InputGroup.Text
                                className="__input-group-text"
                                onClick={() => setShowPassword((prev) => !prev)}
                            >
                                <MdRemoveRedEye />
                            </InputGroup.Text>
                        </InputGroup>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formRememberMe">
                        <Form.Check
                            type="checkbox"
                            label="Remember Me"
                            className="__form-check"
                            checked={rememberMe}
                            onChange={handleRememberMeChange}
                        />
                    </Form.Group>

                    <Button type="submit" className="__enterbutton btn btn-success w-100 mb-3">
                        Enter
                    </Button>
                </Form>

                <div className="text-center mb-2">Or connect with</div>

                <div className="__socialmedia d-flex gap-2 justify-content-center">
                    <Button variant="light" className="__btn-google">
                        <i className="bi bi-google me-2"></i> Google
                    </Button>
                    <Button variant="light" className="__btn-facebook">
                        <i className="bi bi-facebook me-2"></i> Facebook
                    </Button>
                    <Button variant="light" className="__btn-apple">
                        <i className="bi bi-apple me-2"></i> Apple
                    </Button>
                </div>

                <div className="__newsignup text-center mt-3">
                    <p>
                        New to GEOESTATE?{" "}
                        <Link className="link-primary text-decoration-none" to="/Signup">
                            Sign Up
                        </Link>
                    </p>
                </div>
                <div className="__newsignup text-center mt-2" >
                    <a style={{ color: "black" }} href="#" onClick={toggleAdminMode}>
                        {isAdmin ? "Switch to User Login" : "Login as Admin"}
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Signin1;
