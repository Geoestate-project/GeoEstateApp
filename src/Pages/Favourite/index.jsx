import React from "react";
import { Container, Row, Col, Button, Card, Image } from "react-bootstrap";
import Sidebar from "../../components/Sidebar";
import image from "../../assests/img/3.jpg";

const FavoritesPage = () => {
  return (
    <>
      <Sidebar />
      <Container
        fluid
        style={{
          padding: "20px",
          backgroundColor: "#f8f9fa",
          height: "100vh",
          overflowY: "auto",
        }}
      >
        <Row className="mb-3">
          <Col md={{ span: 10, offset: 1 }}>
            <h1 style={{ fontWeight: "bold", marginBottom: "10px" }}>
              Favorites
            </h1>
            <p style={{ color: "#6c757d", marginBottom: "20px" }}>
              Your favorite items will appear here.
            </p>
            <Button
              style={{ backgroundColor: "#28a745", borderColor: "#28a745" }}
              className="mb-3"
            >
              + Create Folder
            </Button>
          </Col>
        </Row>
        <Row>
          <Col md={{ span: 10, offset: 1 }}>
            <Card className="mb-3">
              <Card.Body>
                <div className="d-flex align-items-center">
                  <Image
                    src={image}
                    rounded
                    className="img-fluid"
                    style={{ width: "40%", marginBottom: "10px" }}
                  />
                  <div className="text-center ms-5">
                    <p style={{ marginBottom: "5px" }}>
                      REF: CSA1938 7 BEDROOM COUNTRY VILLA WITH HIGH RENTAL
                      POTENTIAL IN FRIGILIANA
                    </p>
                    <p style={{ fontWeight: "bold", color: "#007bff" }}>
                      1,300,000 €
                    </p>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default FavoritesPage;
