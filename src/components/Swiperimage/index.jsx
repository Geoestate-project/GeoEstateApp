import React from "react";
import { Carousel, Container, Row, Col, Button } from "react-bootstrap";
import simg1 from "../../assests/img/simg1.jpg";
import simg2 from "../../assests/img/simg2.jpg";
import simg3 from "../../assests/img/simg3.jpg";
import "./swiper.css";

const SwiperImage = () => {
  return (
    <>
      <section className="py-5">
        <Container>
          <Row className="justify-content-center text-center">
            <Col md={8}>
              
            </Col>
          </Row>
          <Row className="mt-5">
            <Col>
              <Carousel>
                <Carousel.Item>
                  <img className="d-block w-100" src={simg2} alt="Slide 1" />
                </Carousel.Item>
                <Carousel.Item>
                  <img className="d-block w-100" src={simg1} alt="Slide 2" />
                </Carousel.Item>
                <Carousel.Item>
                  <img className="d-block w-100" src={simg3} alt="Slide 3" />
                </Carousel.Item>
              </Carousel>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default SwiperImage;
