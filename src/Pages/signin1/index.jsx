import React, { useState } from "react";
import {
  Form,
  Button,
  InputGroup,
  Dropdown,
  DropdownButton,
} from "react-bootstrap";
import { MdRemoveRedEye } from "react-icons/md";
import logo from "../../assests/img/logo.png";
import "./signin1.css";
import { Link, useHistory } from "react-router-dom";

const Signin1 = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);  
  const history = useHistory();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleRememberMeChange = (e) => {
    setRememberMe(e.target.checked);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 

    
    try {
      const response = await fetch('http://homevocation-001-site4.atempurl.com/api/UserControllerLogin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Email: email,
          Password: password,
          Recuerdame: rememberMe
        })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Login successful:', data);
        
        history.push('/dashboard'); 
      } else {
        const errorData = await response.json();
        console.error('Failed to login:', errorData);
        alert('Failed to login: ' + (errorData.Message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Network error:', error);
      alert('Network error: ' + error.message);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="__login-container shadow p-4 rounded">
        <div className="__language-dropdown mb-3">
          <DropdownButton id="dropdown-basic-button" title="English" size="sm">
            <Dropdown.Item href="#">English</Dropdown.Item>
            <Dropdown.Item href="#">Spanish</Dropdown.Item>
          </DropdownButton>
        </div>

        <div className="__login-logo text-center mb-4">
          <img src={logo} alt="GeoEstate" style={{ width: "120px" }} />
        </div>

        <Form onSubmit={handleSubmit}>
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
                type="password"
                placeholder="Enter your password"
                className="__form-control"
                value={password}
                onChange={handlePasswordChange}
              />
              <InputGroup.Text className="__input-group-text">
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

          <Button
            type="submit"
            className="__enterbutton btn btn-success w-100 mb-3"
          >
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
      </div>
    </div>
  );
};

export default Signin1;
