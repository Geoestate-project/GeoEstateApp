import { set } from "lodash";
import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import "./Filters.css";
const Filters = ({
    show,
    handleClose,
    property,
    updateProperties,
    filters,
    setFilters,
}) => {
    const [userName, setUserName] = useState("");
    const [properties, setProperties] = useState(property);
    const [savedFilters, setSavedFilters] = useState([]);

    useEffect(() => {
        setUserName(localStorage.getItem("userName") || "");
        const savedFiltersFromStorage = localStorage.getItem("SavedFilters");
        try {
            setSavedFilters(JSON.parse(savedFiltersFromStorage) || []);
        } catch (e) {
            console.error("Parsing error in savedFilters", e);
            setSavedFilters([]);
        }
    }, []);

    const handleSaveFilters = () => {
        const newFilter = {
            name: userName || "Default",
            filters,
        };
        const updatedFilters = [...savedFilters, newFilter];
        localStorage.setItem("SavedFilters", JSON.stringify(updatedFilters));
        setSavedFilters(updatedFilters);
    };

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        if (
            (id === "minPrice" ||
                id === "maxPrice" ||
                id === "minArea" ||
                id === "maxArea") &&
            value.trim() !== ""
        ) {
            setFilters((prevFilters) => ({ ...prevFilters, [id]: Number(value) }));
        } else {
            setFilters((prevFilters) => ({ ...prevFilters, [id]: value }));
        }
    };

    const fetchProperties = async () => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value || value === 0) {
                // Ensuring that empty strings are not included
                params.append(key, value);
            }
        });

        try {
            const response = await fetch(
                `http://homevocation-001-site4.atempurl.com/api/FilterProperties?${params.toString()}`,
                {
                    method: "GET",
                }
            );

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await response.json();
            (() => {
                updateProperties(data);
            })();
            setProperties(data);
            console.log(data); // Log the properties to see the fetched data
        } catch (error) {
            console.error("Failed to fetch properties:", error);
        }
    };

    const handleApplyFilters = (e) => {
        e.preventDefault();
        fetchProperties();
    };

    return (
        <Modal show={show} onHide={handleClose} centered size="lg">
            <Modal.Header closeButton className="modal-custom-bg">
                <Modal.Title className="text-white">Filter Properties</Modal.Title>
            </Modal.Header>
            <Modal.Body className="modal-custom-bg">
                <Form className="text-white " onSubmit={handleApplyFilters}>
                    <Row>
                        <Form.Group controlId="savedFilters">
                            <Form.Label>Select Saved Filters</Form.Label>
                            <Form.Select
                                className="custom-modal-color"
                                onChange={(e) => {
                                    const index = e.target.value;
                                    const selectedFilter = savedFilters[index].filters;
                                    setFilters(selectedFilter);
                                }}
                            >
                                {savedFilters.length > 0 && (
                                    <option value={0}>Select A Filter</option>
                                )}
                                {savedFilters.length > 0 ? (
                                    savedFilters.map((filter, index) => (
                                        <option value={index} key={index}>
                                            {filter.name}
                                        </option>
                                    ))
                                ) : (
                                    <option>No Saved Filters</option>
                                )}
                            </Form.Select>
                        </Form.Group>
                    </Row>
                    <Row className="mb-3">
                        <Col>
                            <Form.Group controlId="version">
                                <Form.Label>Select Version</Form.Label>
                                <Form.Select
                                    className="custom-modal-color"
                                    value={filters.version}
                                    onChange={handleInputChange}
                                >
                                    <option value="1">Version 1</option>
                                    <option value="2">Version 2</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId="sortBy">
                                <Form.Label>Sort By</Form.Label>
                                <Form.Select
                                    className="custom-modal-color"
                                    value={filters.sortBy}
                                    onChange={handleInputChange}
                                >
                                    <option value="time-desc">
                                        Time on Market (most to least)
                                    </option>
                                    <option value="time-asc">
                                        Time on Market (least to most)
                                    </option>
                                    <option value="price-asc">Price Ascending</option>
                                    <option value="price-desc">Price Descending</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row className="mb-3">
                        <Col>
                            <Form.Group controlId="country">
                                <Form.Label>Country</Form.Label>
                                <Form.Select
                                    className="custom-modal-color"
                                    value={filters.country}
                                    onChange={handleInputChange}
                                >
                                    <option value="spain">Spain</option>
                                    <option value="usa">USA</option>
                                    <option value="uk">UK</option>
                                    <option value="germany">Germany</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId="community">
                                <Form.Label>Community</Form.Label>
                                <Form.Select
                                    className="custom-modal-color"
                                    value={filters.community}
                                    onChange={handleInputChange}
                                >
                                    <option value="suburb">Suburb</option>
                                    <option value="city">City</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row className="mb-3">
                        <Col>
                            <Form.Group controlId="municipality">
                                <Form.Label>Municipality</Form.Label>
                                <Form.Control
                                    className="custom-modal-color"
                                    type="text"
                                    placeholder="Enter Municipality"
                                    value={filters.municipality}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row className="mb-3">
                        <Col>
                            <Form.Group controlId="minPrice">
                                <Form.Label>Min Price</Form.Label>
                                <Form.Control
                                    className="custom-modal-color"
                                    type="number"
                                    placeholder="Min"
                                    value={filters.minPrice}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId="maxPrice">
                                <Form.Label>Max Price</Form.Label>
                                <Form.Control
                                    className="custom-modal-color"
                                    type="number"
                                    placeholder="Max"
                                    value={filters.maxPrice}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row className="mb-3">
                        <Col>
                            <Form.Group controlId="minArea">
                                <Form.Label>
                                    Built Area (m<sup>2</sup>) Min
                                </Form.Label>
                                <Form.Control
                                    className="custom-modal-color"
                                    type="number"
                                    placeholder="Min"
                                    value={filters.minArea}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId="maxArea">
                                <Form.Label>
                                    Built Area (m<sup>2</sup>) Max
                                </Form.Label>
                                <Form.Control
                                    className="custom-modal-color"
                                    type="number"
                                    placeholder="Max"
                                    value={filters.maxArea}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row className="mb-3">
                        <Col>
                            <Form.Group controlId="residential">
                                <Form.Label>Residential</Form.Label>
                                <Form.Select
                                    className="custom-modal-color"
                                    value={filters.residential}
                                    onChange={handleInputChange}
                                >
                                    <option value="apartment">Apartment/Flat</option>
                                    <option value="house">House/Chalet</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId="commercial">
                                <Form.Label>Commercial</Form.Label>
                                <Form.Select
                                    className="custom-modal-color"
                                    value={filters.commercial}
                                    onChange={handleInputChange}
                                >
                                    <option value="solar">Solar Project</option>
                                    <option value="warehouse">
                                        Industrial Surfaces/Warehouses
                                    </option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>
                </Form>
            </Modal.Body>
            <Modal.Footer className="modal-custom-bg">
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                {/* <Button
          variant="danger"
          onClick={() =>
            setFilters({
              version: "",
              sortBy: "",
              country: "",
              community: "",
              municipality: "",
              minPrice: "",
              maxPrice: "",
              minArea: "",
              maxArea: "",
              residential: "",
              commercial: "",
            })
          }
        >
          Clear Filters
        </Button> */}
                <Button variant="dark" onClick={handleSaveFilters}>
                    Save Filters
                </Button>
                <Button variant="success" onClick={handleApplyFilters}>
                    Apply Filters
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default Filters;
