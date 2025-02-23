import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Button, Pagination, ProgressBar } from "react-bootstrap";
import TopBar from "../../components/TopBar";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../index.css";
import { Link } from "react-router-dom";
import "./propertieslist.css";

const PropertiesList = () => {
  const [properties, setProperties] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const propertiesPerPage = 12;

  useEffect(() => {
    const fetchProperties = async () => {
      let progress = 0;
      const progressInterval = setInterval(() => {
        progress += 10;
        if (progress >= 90) clearInterval(progressInterval);
        setLoadingProgress(progress);
      }, 100); // Simulate loading progress

      try {
        const response = await axios.get(
          "http://homevocation-001-site4.atempurl.com/api/Property/getProperties"
        );
        setProperties(response.data);
        setTotalPages(Math.ceil(response.data.length / propertiesPerPage));
        setLoadingProgress(100); // Set to 100 when loading is complete
      } catch (error) {
        console.error("Error fetching properties:", error);
      } finally {
        clearInterval(progressInterval);
      }
    };

    fetchProperties();
  }, []);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleClose = () => setSelectedProperty(null);

  const displayLocation = (property) => {
    return property.provincia && property.municipio
      ? `${property.provincia}, ${property.municipio}`
      : "Not available";
  };

  const paginationItems = () => {
    let items = [];
    let startPage = Math.max(currentPage - 2, 1);
    let endPage = Math.min(startPage + 4, totalPages);

    if (currentPage > 1) {
      items.push(
        <Pagination.First key="first" onClick={() => handlePageChange(1)} />
      );
      items.push(
        <Pagination.Prev
          key="prev"
          onClick={() => handlePageChange(currentPage - 1)}
        />
      );
    }

    for (let number = startPage; number <= endPage; number++) {
      items.push(
        <Pagination.Item
          key={number}
          active={number === currentPage}
          onClick={() => handlePageChange(number)}
        >
          {number}
        </Pagination.Item>
      );
    }

    if (currentPage < totalPages) {
      items.push(
        <Pagination.Next
          key="next"
          onClick={() => handlePageChange(currentPage + 1)}
        />
      );
      items.push(
        <Pagination.Last
          key="last"
          onClick={() => handlePageChange(totalPages)}
        />
      );
    }

    return items;
  };

  return (
    <>
      <TopBar />
      <div className="container mt-5">
        <h3 className="mb-4 text-center">Properties List</h3>
        {loadingProgress < 100 ? (
          <div
            className="d-flex flex-column justify-content-center align-items-center"
            style={{ height: "50vh" }}
          >
            <h4>Loading Properties...</h4>
            <div className="custom-progress-container">
              <ProgressBar
                animated
                now={loadingProgress}
                className="custom-progress-bar"
                label={
                  <span className="custom-progress-label">
                    {`${loadingProgress}%`}
                  </span>
                }
              />
            </div>
          </div>
        ) : (
          <div className="row">
            {properties
              .slice(
                (currentPage - 1) * propertiesPerPage,
                currentPage * propertiesPerPage
              )
              .map((property, index) => (
                <div key={index} className="col-lg-4 col-md-6 mb-4">
                  <div className="card h-100 shadow">
                    <img
                      src={property.foto}
                      alt="Property"
                      className="card-img-top"
                      style={{ height: "200px", objectFit: "cover" }}
                    />
                    <div className="card-body">
                      <h5 className="card-title text-truncate">
                        {property.titulo}
                      </h5>
                      <p className="card-text">
                        <strong>Price:</strong> $
                        {property.precio.toLocaleString()} <br />
                        <strong>Location:</strong> {displayLocation(property)}
                      </p>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Button
                          style={{ backgroundColor: "#33db4a", border: "none" }}
                          onClick={() => setSelectedProperty(property)}
                        >
                          View Details
                        </Button>
                        <Link to="/UserPanel">
                          <Button
                            style={{
                              backgroundColor: "#33db4a",
                              border: "none",
                            }}
                          >
                            View in Map
                          </Button>
                        </Link>
                      </div>

                      {/* <Button
                        style={{
                          backgroundColor: "#33db4a",
                          border: "none",
                          marginLeft: "90px",
                        }}
                        onClick={() => setSelectedProperty(property)}
                      >
                        View in Map
                      </Button> */}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
        <Pagination className="justify-content-center mt-4">
          {paginationItems()}
        </Pagination>
      </div>
      {selectedProperty && (
        <Modal show={true} onHide={handleClose} size="xl" fullscreen="true">
          <Modal.Header closeButton>
            <Modal.Title>{selectedProperty.titulo}</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <div className="d-flex">
              <div className="flex-fill">
                <img
                  src={selectedProperty.foto}
                  alt="Featured"
                  className="w-100"
                  style={{ maxHeight: "40vh", width: "38vw !important" }}
                />
                <div className="mt-4 p-3">
                  <p>
                    <strong>Description:</strong> {selectedProperty.descripcion}
                  </p>
                  <p>
                    <strong>Price:</strong> $
                    {selectedProperty.precio.toLocaleString()}
                  </p>
                  <p>
                    <strong>Bathrooms:</strong> {selectedProperty.banos}
                  </p>
                  <p>
                    <strong>Area:</strong> {selectedProperty.detalle}
                  </p>
                  <p>
                    <strong>Location:</strong>{" "}
                    {displayLocation(selectedProperty)}
                  </p>
                  <p>
                    <strong>Published Date:</strong>{" "}
                    {selectedProperty.fechaPublicacion
                      ? new Date(
                          selectedProperty.fechaPublicacion
                        ).toLocaleDateString()
                      : "Not available"}
                  </p>
                </div>
              </div>
              <div className="flex-fill">
                {/* <Form style={{ width: "24vw", marginLeft: "20px", backgroundColor: "#33db4a", borderRadius: "10px", padding: "20px" }}>
                  <h5>Contact the Advertiser</h5>
                  <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm={4}>Your Name</Form.Label>
                    <Col sm={8}>
                      <Form.Control type="text" placeholder="Enter your name" required />
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm={4}>Email</Form.Label>
                    <Col sm={8}>
                      <Form.Control type="email" placeholder="Enter your email" required />
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm={4}>Telephone</Form.Label>
                    <Col sm={8}>
                      <Form.Control type="tel" placeholder="Your telephone number" />
                    </Col>
                  </Form.Group>
                  <Button style={{backgroundColor: "green", cursor: "pointer"}} type="submit">Send Enquiry</Button>
                  <Link to="/UserPanel"><Button style={{backgroundColor: "green", cursor: "pointer"}} type="submit">View in Map</Button></Link>
                </Form> */}
              </div>
            </div>
            <h5 className="mt-4">Related Properties</h5>
            <div className="row">
              {properties.slice(0, 6).map((prop, idx) => (
                <div key={idx} className="col-md-6 mb-3">
                  <div className="card">
                    <img
                      src={prop.foto}
                      alt={prop.titulo}
                      className="card-img-top"
                    />
                    <div className="card-body">
                      <h6 className="card-title">{prop.titulo}</h6>
                      <p className="card-text">
                        ${prop.precio.toLocaleString()}
                      </p>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Button
                          onClick={() => setSelectedProperty(prop)}
                          style={{ backgroundColor: "#33db4a" }}
                        >
                          View More
                        </Button>
                        <Link to="/UserPanel">
                          <Button
                            style={{
                              backgroundColor: "#33db4a",
                              border: "none",
                            }}
                          >
                            View in Map
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Modal.Body>
        </Modal>
      )}
    </>
  );
};

export default PropertiesList;
