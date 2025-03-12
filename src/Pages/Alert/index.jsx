import React from "react";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import Sidebar from "../../components/Sidebar";
import "./alert.css";

const AlertPage = () => {
  return (
    <>
      <Sidebar />
      <Container
        fluid
        style={{
          height: "100vh",
          backgroundColor: "#f8f9fa",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Row className="justify-content-center">
          <Col>
            <Card
              style={{
                width: "100%",
                textAlign: "center",
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                borderRadius: "8px",
              }}
            >
              <Card.Body className="AlertIn">
                <h1 className="mb-2" style={{ fontWeight: "bold" }}>
                  Alerts
                </h1>
                <p className="text-muted mb-3">You currently have no alerts.</p>
                <div style={{ marginTop: "20px" }}>
                  <p className="text-muted" style={{ margin: "5px 0" }}>
                    No notifications at this moment.
                  </p>
                  <p className="text-muted" style={{ margin: "5px 0" }}>
                    Check back later for updates or set up alert preferences.
                  </p>
                  <Button
                    variant="success"
                    style={{ marginTop: "20px", backgroundColor: "#28a745" }}
                    className="text-white"
                  >
                    Set Alerts
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default AlertPage;
