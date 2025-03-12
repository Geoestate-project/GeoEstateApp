import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Button, Pagination, ProgressBar } from "react-bootstrap";
import TopBar from "../../components/TopBar";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../index.css";
import { Link } from "react-router-dom";
import { IoClose } from "react-icons/io5";
import "./propertieslist.css";
import AddPropertyModal from "./AddPropertyModal";

const PropertiesList = () => {
  const [properties, setProperties] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);
  const propertiesPerPage = 12;

  useEffect(() => {
    const role = localStorage.getItem("role");

    const fetchProperties = async () => {
      let progress = 0;
      const progressInterval = setInterval(() => {
        progress += 10;
        if (progress >= 90) clearInterval(progressInterval);
        setLoadingProgress(progress);
      }, 100); // Simulate loading progress

      try {
        const response = await axios.get(
          "https://apis.geoestate.ai/api/Property/getPropertiesWithFoto"
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


  console.log("properties",properties)
  const handleDeleteProperty = async (propertyId) => {
    try {
      const response = await axios.delete(
        `http://homevocation-001-site4.atempurl.com/api/Property/deleteProperty/${propertyId}`
      );
      console.log("Property Deleted:", response.data);
      alert("Property deleted successfully!");
    } catch (error) {
      console.error("Failed to delete property:", error);
      alert("Error deleting property. Please try again.");
    }
  };

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

  const handleAddProperty = () => {
    setShowAddModal(true);
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
  };

  return (
    <>
      <TopBar />
      <div className="container mt-5">
        <h3 className="mb-4 text-center fw-bold">Properties List</h3>

        <AddPropertyModal
          show={showAddModal}
          handleClose={handleCloseAddModal}
        />
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
          <>
            <div className="w-100 d-flex my-3">
              <Button
                variant="success"
                onClick={handleAddProperty}
                className="ms-auto me-3"
                style={{ backgroundColor: "var(--color-bg)" }}
              >
                Add Property
              </Button>
            </div>

            <div className="row">
              {properties
                .slice(
                  (currentPage - 1) * propertiesPerPage,
                  currentPage * propertiesPerPage
                )
                .map((property, index) => (
                  <div key={index} className="col-lg-6 col-md-6 mb-4">
                    <div className="card h-100 shadow position-relative">

                      {/* Close Button Positioned at Top Right */}
                      {/* <Button
                        variant="none"
                        onClick={() => handleDeleteProperty(property.idPropiedad)}
                        className="position-absolute top-0 end-0 m-2 p-0"
                        style={{
                          color: "white",
                          border: "none",
                          boxShadow: "2px 2px gray",
                          backgroundColor: "#33db4a",
                          width: "30px",
                          height: "30px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <IoClose size={24} />
                      </Button> */}

                      {/* Image with Full Coverage */}
                      <img
                        src={property.foto}
                        alt="Property"
                        className="card-img-top"
                        style={{
                          height: "200px",
                          objectFit: "cover",
                          width: "100%",
                        }}
                      />

                      <div className="card-body">
                        <h5 className="card-title text-truncate">{property.titulo}</h5>
                        <p className="card-text">
                          <strong>Price:</strong> ${property.precio} <br />   {/*  .toLocaleString() */}
                          {/* <strong>Location:</strong> {displayLocation(property)} */}
                        </p>
                        <div className="d-flex justify-content-between align-items-center">
                          <Button
                            style={{ backgroundColor: "#33db4a", border: "none" }}
                            onClick={() => setSelectedProperty(property)}
                          >
                            View Details
                          </Button>
                          <Link to="/UserPanel">
                            <Button style={{ backgroundColor: "#33db4a", border: "none" }}>
                              View in Map
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

          </>
        )}
        <Pagination className="justify-content-center mt-4 mb-4">
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
                    {selectedProperty.precio}
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
                        ${prop.precio}
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
