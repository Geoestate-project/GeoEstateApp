import React from "react";
import { Carousel, Container, Row, Col } from "react-bootstrap";
import testimonial1 from "../../assests/img/testimonial1.png";
import testimonial2 from "../../assests/img/testimonial2.png";
import testimonial3 from "../../assests/img/testimonial3.png";
import testimonial4 from "../../assests/img/testimonial1.png";
import testimonial5 from "../../assests/img/testimonial1.png";

const Testimonial = () => {
    const cardStyle = {
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
        margin: "10px",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100%", // Make cards fill the container
    };

    const textStyle = {
        color: "#333",
        fontStyle: "italic",
        marginBottom: "10px",
    };

    const imageStyle = {
        borderRadius: "50%",
        width: "150px",
        height: "150px",
        objectFit: "cover",
        margin: "0 auto",
    };

    // Testimonials data array
    const testimonials = [
        {
            img: testimonial1,
            message: "Their attention to detail and responsive customer support stood out the most. Highly recommended!",
            name: "Samantha Bloom",
            role: "Marketing Director",
        },
        {
            img: testimonial2,
            message: "I was thoroughly impressed by their professional approach and the timely delivery of services.",
            name: "Michael Brown",
            role: "CEO, Brown Logistics",
        },
        {
            img: testimonial3,
            message: "A truly personalized experience that tailored their services to my exact needs!",
            name: "Jessica Alba",
            role: "Entrepreneur",
        },
        {
            img: testimonial4,
            message: "Their innovative solutions have dramatically increased our operational efficiency.",
            name: "David Smith",
            role: "Operations Manager",
        },
        {
            img: testimonial5,
            message: "Fantastic results! They went above and beyond to ensure everything was perfect.",
            name: "Linda Johnson",
            role: "Product Manager",
        },
    ];

    return (
        <section className="testimonials" style={{ backgroundColor: "#f8f9fa" }}>
            <h2 className="text-center pt-5 fw-bold">Testimonials</h2>
            <Carousel indicators={false} controls={true} interval={5000}>
                {[0, 3].map((slideIndex) => (
                    <Carousel.Item key={slideIndex}>
                        <Container>
                            <Row className="d-flex justify-content-center align-items-stretch">
                                {testimonials.slice(slideIndex, slideIndex + 3).map((testimonial, index) => (
                                    <Col
                                        key={index}
                                        xs={12}
                                        sm={6}
                                        md={4}
                                        className="mb-4 d-flex align-items-stretch"
                                    >
                                        <div style={cardStyle}>
                                            <img
                                                src={testimonial.img}
                                                alt={`Client ${index + slideIndex + 1}`}
                                                style={imageStyle}
                                            />
                                            <div style={textStyle}>
                                                "{testimonial.message}"
                                            </div>
                                            <div className="testimonial-author fw-bold">
                                                {testimonial.name}
                                            </div>
                                            <div className="testimonial-role">{testimonial.role}</div>
                                        </div>
                                    </Col>
                                ))}
                            </Row>
                        </Container>
                    </Carousel.Item>
                ))}
            </Carousel>
        </section>
    );
};

export default Testimonial;

