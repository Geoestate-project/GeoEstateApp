import React, { useState, useEffect } from "react";
import {
  Navbar,
  Nav,
  Form,
  FormControl,
  Button,
  Dropdown,
  ListGroup,
  Offcanvas,
} from "react-bootstrap";
import { faSearch, faFilter } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Filters from "../../components/Filters";
import "./topbar.css";
import { Link, useLocation } from "react-router-dom";

const TopBar = ({ properties, updateProperties }) => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [language, setLanguage] = useState("Select Language");
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [maxPrice, setMaxPrice] = useState("");
  const [maxArea, setMaxArea] = useState("");
  const [selectedColor, setSelectedColor] = useState("white");
  const prices = [];
  const areas = []; // Array for area values

  for (let area = 50; area <= 5000; area += 50) {
    areas.push(`${area} sqm`);
  }

  const location = useLocation();

  for (let price = 100000; price <= 3100000; price += 50000) {
    prices.push(`$${price.toLocaleString()}`);
  }

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
  };

  const handleColorChange = (color) => {
    setSelectedColor(color);
    localStorage.setItem("selectedColor", color); // Save selected color to localStorage
    window.dispatchEvent(new Event("storage")); // Notify other components
  };

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);

    if (value.length > 0) {
      const filteredProperties = properties.filter((property) => {
        const titleMatch = property.titulo
          ? property.titulo.toLowerCase().includes(value.toLowerCase())
          : false;
        const zoneMatch = property.zona
          ? property.zona.toLowerCase().includes(value.toLowerCase())
          : false;
        const descriptionMatch = property.descripcion
          ? property.descripcion.toLowerCase().includes(value.toLowerCase())
          : false;
        const municipalityMatch = property.municipio
          ? property.municipio.toLowerCase().includes(value.toLowerCase())
          : false;

        return titleMatch || zoneMatch || descriptionMatch || municipalityMatch;
      });

      console.log(filteredProperties.slice(0, 3));
      setSuggestions(filteredProperties);
    } else {
      setSuggestions([]);
    }
  };

  const [filters, setFilters] = useState({
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
  });

  const handleMaxPriceChange = (price) => {
    setMaxPrice(price);
    setFilters((prevFilters) => ({
      ...prevFilters,
      maxPrice: price,
    }));
  };

  const handleMaxAreaChange = (area) => {
    setMaxArea(area);
    setFilters((prevFilters) => ({
      ...prevFilters,
      maxArea: area.replace(/\D/g, ""), // Assuming you want to extract numeric values only
    }));
  };

  const handleClearFilters = () => {
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
    });
    setMaxPrice("");
    setMaxArea("");
    setSearchTerm("");
    setSuggestions([]);
    updateProperties([]); // Optionally reset displayed properties
  };

  const handleSelectSuggestion = (property) => {
    updateProperties([property]);
    setSuggestions([]);
    setSearchTerm("");
  };

  const fetchProperties = async () => {
    const params = new URLSearchParams({
      ...filters,
      maxPrice: maxPrice.replace(/\D/g, ""), // Remove non-numeric characters for API call
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
      updateProperties(data);
      console.log(data); // Log the properties to see the fetched data
    } catch (error) {
      console.error("Failed to fetch properties:", error);
    }
  };

  useEffect(() => {
    if (maxPrice || maxArea) {
      fetchProperties(); // Call fetchProperties when maxPrice changes
    }
  }, [maxPrice, maxArea]); // Dependency array to trigger re-fetch when maxPrice changes

  return (
    <>
      <div className="container"></div>
      <Navbar
        variant="dark"
        expand="lg"
        className="px-3 px-md-5"
        style={{
          zIndex: "100",
          backgroundColor: "forestgreen",
          boxShadow: "none",
        }}
      >
        <Navbar.Toggle
          aria-controls="navbar-side"
          onClick={() => setShowSidebar(true)}
        />
        <Navbar.Collapse id="navbar-side">
          <Nav className="me-auto w-100 d-flex flex-column flex-lg-row align-items-center">
            <Form className="d-flex flex-row w-100 mb-3 mb-lg-0">
              <FormControl
                type="text"
                placeholder="Search location..."
                className="mr-sm-2 search-map rounded-1"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <Button
                variant="outline-light"
                className="rounded-1"
                style={{ backgroundColor: "var(--color)" }}
              >
                <FontAwesomeIcon icon={faSearch} />
              </Button>
              <Button
                variant="outline-light"
                style={{ backgroundColor: "var(--color)" }}
                onClick={handleClearFilters}
              >
                Clear Filters
              </Button>
              {suggestions.length > 0 && (
                <ListGroup
                  className="position-absolute w-100"
                  style={{ marginTop: "40px", maxWidth: "300px" }}
                >
                  {suggestions.slice(0, 3).map((suggestion, index) => (
                    <ListGroup.Item
                      key={index}
                      onClick={() => handleSelectSuggestion(suggestion)}
                    >
                      {suggestion.titulo} - {suggestion.zona}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </Form>
          </Nav>

          <div className="d-flex justify-content-between align-items-center w-100">
            <Button
              variant="outline-light"
              className="rounded-1 mx-2 d-flex flex-row align-items-center gap-2"
              style={{ backgroundColor: "var(--color)" }}
              onClick={() => setShowFilter((prev) => !prev)}
            >
              <FontAwesomeIcon icon={faFilter} /> Filter
            </Button>

            <div className="d-flex">
              {/* Max Price Dropdown */}
              <Dropdown className="mx-2">
                <Dropdown.Toggle
                  variant="outline-light"
                  className="rounded-1"
                  style={{ backgroundColor: "var(--color)" }}
                >
                  {maxPrice || "Max Price"}
                </Dropdown.Toggle>
                <Dropdown.Menu
                  style={{
                    height: "300px",
                    maxWidth: "150px",
                    overflowY: "scroll",
                  }}
                >
                  {prices.map((price) => (
                    <Dropdown.Item
                      key={price}
                      onClick={() => handleMaxPriceChange(price)}
                    >
                      {price}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>

              <Dropdown className="mx-2">
                <Dropdown.Toggle
                  variant="outline-light"
                  className="rounded-1"
                  style={{ backgroundColor: "var(--color)" }}
                >
                  {maxArea || "Max Area"}
                </Dropdown.Toggle>
                <Dropdown.Menu
                  style={{ maxHeight: "300px", overflowY: "scroll" }}
                >
                  {areas.map((area) => (
                    <Dropdown.Item
                      key={area}
                      onClick={() => handleMaxAreaChange(area)}
                    >
                      {area}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>

              <Dropdown className="mx-2">
                <Dropdown.Toggle
                  variant="outline-light"
                  id="dropdown-color"
                  className="rounded-1"
                  style={{ backgroundColor: "var(--color)" }}
                >
                  Color
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => handleColorChange("red")}>
                    Red
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => handleColorChange("blue")}>
                    Blue
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => handleColorChange("green")}>
                    Green
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => handleColorChange("yellow")}>
                    Yellow
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>

              <Dropdown onSelect={handleLanguageChange} className="mx-2">
                <Dropdown.Toggle
                  variant="outline-light"
                  id="language-dropdown"
                  className="rounded-1"
                  style={{ backgroundColor: "var(--color)" }}
                >
                  {language}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item eventKey="en">English</Dropdown.Item>
                  <Dropdown.Item eventKey="es">Spanish</Dropdown.Item>
                  <Dropdown.Item eventKey="fr">French</Dropdown.Item>
                  <Dropdown.Item eventKey="de">German</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              <Button
                variant="outline-light"
                className="rounded-1"
                style={{ backgroundColor: "var(--color)" }}
              >
                <Link
                  to={
                    !location.pathname.includes("PropertiesList")
                      ? "/UserPanel/PropertiesList"
                      : "/UserPanel"
                  }
                  className="d-flex flex-row align-items-center gap-1"
                >
                  <i className={!location.pathname.includes("PropertiesList")
                      ? "fas fa-chart-area"
                      : "fa-solid fa-map"}></i>
                  <p className="text-nowrap m-0">
                    {!location.pathname.includes("PropertiesList")
                      ? "List Section"
                      : "Map View"}
                  </p>
                </Link>
              </Button>
            </div>
          </div>
        </Navbar.Collapse>
      </Navbar>

      <Filters
        show={showFilter}
        handleClose={() => setShowFilter(false)}
        property={properties}
        updateProperties={updateProperties}
        filters={filters}
        setFilters={setFilters}
      />
    </>
  );
};

export default TopBar;
