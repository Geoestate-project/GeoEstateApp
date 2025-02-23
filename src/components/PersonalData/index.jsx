import React, { useState } from "react";
import logo from "../../assests/img/logo.png"
import "./personaldata.css"

const PersonalData = () => {
    const [isActive, setIsActive] = useState(true)

    return (
        <div className="personal-data-container">
            <h3 className="personal-data-header">My Data</h3>
            <ul className="personal-data-nav-tabs">
                <li className="personal-data-nav-item">
                    <a className={`personal-data-nav-link ${isActive ? 'active' : ''}`} href="#personal-data" onClick={() => { setIsActive(true) }}>
                        PERSONAL DATA
                    </a>
                </li>
                <li className="personal-data-nav-item">
                    <a className={`personal-data-nav-link ${!isActive ? 'active' : ''}`} href="#biography" onClick={() => { setIsActive(false) }}>
                        BIOGRAPHY
                    </a>
                </li>
            </ul>
            <div className="personal-data-content">
                <div className="personal-data-left">
                    <div className="image-upload">
                        <img src={logo} className="profile-img" />
                        <p>Click here or drag an image</p>
                        <p className="image-size">Max size: 1200x1200px</p>
                    </div>
                </div>
                <div className="personal-data-right">
                    <form>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Name</label>
                                <input type="text" placeholder="Name" />
                            </div>
                            <div className="form-group">
                                <label>Surname</label>
                                <input type="text" placeholder="Surname" />
                            </div>
                            <div className="form-group">
                                <label>Post</label>
                                <input type="text" placeholder="Post" />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Email</label>
                                <input type="email" placeholder="Email" />
                            </div>
                            <div className="form-group">
                                <label>Phone</label>
                                <input type="text" placeholder="Phone" />
                            </div>
                            <div className="form-group">
                                <label>Language</label>
                                <select>
                                    <option value="Spanish">Spanish</option>
                                    <option value="English">English</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>New Password</label>
                                <input type="password" placeholder="New password" />
                            </div>
                            <div className="form-group">
                                <label>Repeat Password</label>
                                <input type="password" placeholder="Repeat password" />
                            </div>
                        </div>
                        <div className="checkbox-row d-flex flex-row align-items-start">
                            <input type="checkbox" style={{ width: "fit-content" }} />
                            <label>
                                I would like to receive information about improvements, updates,
                                and changes to the application as well as promotional
                                communications.
                            </label>
                        </div>
                        <button type="submit" className="save-button">
                            KEEP
                        </button>
                        <p className="terms">
                            (*) You have accepted the <a href="#">general conditions</a> and the{" "}
                            <a href="#">privacy policy</a> on 02-10-2023.
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PersonalData;
