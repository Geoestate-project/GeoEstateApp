import React from "react";

function ContactUs() {
    return (
        <>
            <div className="parent-contact">
                <section
                    id="contact"
                    className="Geo-State-Contact-section my-5 container"
                >
                    <h1 className="text-center Geo-State-Contact-hero-h1">Contact Us</h1>
                    <div className="row p-4">
                        <div className="col-md-6 pe-md-4">
                            <h2 className="fs-4 fw-semibold text-secondary Geo-State-Contact-h2">
                                Contact Us
                            </h2>
                            <p className="text-muted mt-2 w-75">
                                If you're interested in our real estate software, send a message
                                through the form, and one of our sales agents will get in touch
                                with you.
                            </p>
                        </div>
                        <div className="col-md-6">
                            <form className="row g-3">
                                <div className="col-12">
                                    <label
                                        htmlFor="name"
                                        className="form-label text-secondary Geo-State-Contact-label"
                                    >
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control Geo-State-Contact-form-control"
                                        id="name"
                                        placeholder="Name"
                                    />
                                </div>
                                <div className="col-12">
                                    <label
                                        htmlFor="email"
                                        className="form-label text-secondary Geo-State-Contact-label"
                                    >
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        className="form-control Geo-State-Contact-form-control"
                                        id="email"
                                        placeholder="Email"
                                    />
                                </div>
                                <div className="col-12">
                                    <label
                                        htmlFor="phone"
                                        className="form-label text-secondary Geo-State-Contact-label"
                                    >
                                        Phone
                                    </label>
                                    <input
                                        type="tel"
                                        className="form-control Geo-State-Contact-form-control"
                                        id="phone"
                                        placeholder="Phone"
                                    />
                                </div>
                                <div className="col-12">
                                    <label
                                        htmlFor="message"
                                        className="form-label text-secondary Geo-State-Contact-label"
                                    >
                                        Message
                                    </label>
                                    <textarea
                                        className="form-control Geo-State-Contact-form-control"
                                        id="message"
                                        rows={3}
                                        placeholder="Message"
                                        defaultValue={""}
                                    />
                                </div>
                                <div className="col-12 d-flex ">
                                    <input
                                        type="checkbox"
                                        className="form-check-input me-2"
                                        id="privacy"
                                    />
                                    <label
                                        htmlFor="privacy"
                                        className="form-check-label text-muted"
                                    >
                                        I have read and accept the site's privacy policies
                                    </label>
                                </div>
                                <div className="col-12">
                                    <button
                                        type="submit"
                                        className="btn btn-primary border-0 Geo-State-Contact-btn-form-contact w-100 h-100 rounded-5"
                                    >
                                        Submit
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}
export default ContactUs;
