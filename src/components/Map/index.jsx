import React, { useEffect, useReducer, useRef, useState } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  DirectionsService,
  DirectionsRenderer,
  DrawingManager,
  OverlayView,
} from "@react-google-maps/api";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";
import Filters from "../Filters";

import CompanyDetailsModal from "../CompanyDetailsModal/CompanyDetailsModal";
import PDFGenerator from "../PDFGenerator/PDFGenerator";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShareAlt, faTimes } from "@fortawesome/free-solid-svg-icons";
import { jsPDF } from "jspdf";
import inactive from "../../assests/img/for-inactive.png";
import active from "../../assests/img/for-active.png";

import "./map.css";
import for_map from "../../assests/img/for_map.png";
import For_user from "../../assests/img/For_user_Home.png";
import for_blue from "../../assests/img/for-blue.png";
import EmailModal from "../../components/EmailService";
import for_green from "../../assests/img/gps.png";
import { useNavigate } from "react-router-dom";
const mapLibraries = ["places", "drawing"];

// Marker icon mapping

const MapComponent = ({ properties, updateProperties }) => {
  const mapRef = useRef(null);
  const drawingManagerRef = useRef(null);
  const [allProperties, setAllProperties] = useState([]); // Stores all properties from API
  const [prop, setProp] = useState([]); // Stores filtered properties inside drawn polygon
  const [userLocation, setUserLocation] = useState(null);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [googleMapsLoaded, setGoogleMapsLoaded] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState({});
  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const [companyDetails, setCompanyDetails] = useState(null);
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [drawingMode, setDrawingMode] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const handleMarkerClick = async (property) => {
    console.log(property);

    if (!property.latitud || !property.longitud) {
      console.error("Invalid property coordinates:", property);
      return;
    }

    try {
      const fetchedData = await fetchPropertyById(property.idPropiedad);
      if (!fetchedData) {
        console.error("No data returned for property", property.idPropiedad);
        return;
      }

      const newSelectedProperty = {
        ...fetchedData,
        directions: {
          origin: userLocation,
          destination: { lat: property.latitud, lng: property.longitud },
          travelMode: "DRIVING",
        },
        // Store the marker position for proper modal positioning
        markerPosition: {
          lat: property.latitud,
          lng: property.longitud,
        },
      };

      console.log(newSelectedProperty);
      setSelectedProperty(newSelectedProperty);
      setProp((prev) => [...prev, newSelectedProperty]);
      setShowDetailsModal(true);
    } catch (error) {
      console.error("Error fetching property details:", error);
    }
  };

  const [activePolygon, setActivePolygon] = useState(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [isLiveActive, setIsLiveActive] = useState(false);
  const [polygons, setPolygons] = useState([]);

  const handleCloseEmailModal = () => setShowEmailModal(false);
  const handleShowEmailModal = () => setShowEmailModal(true);
  const navigate = useNavigate();

  // Add a function to convert LatLng to pixel coordinates
  const getPixelPositionFromLatLng = (latLng) => {
    if (!mapRef.current || !latLng) return null;

    const projection = mapRef.current.getProjection();
    if (!projection) return null;

    const bounds = mapRef.current.getBounds();
    if (!bounds) return null;

    const topRight = projection.fromLatLngToPoint(bounds.getNorthEast());
    const bottomLeft = projection.fromLatLngToPoint(bounds.getSouthWest());
    const scale = Math.pow(2, mapRef.current.getZoom());
    const worldPoint = projection.fromLatLngToPoint(latLng);

    return {
      x: (worldPoint.x - bottomLeft.x) * scale,
      y: (worldPoint.y - topRight.y) * scale,
    };
  };

  const handleShowCompanyModal = () => setShowCompanyModal(true);
  const handleCloseCompanyModal = () => setShowCompanyModal(false);
  const [selectedColor, setSelectedColor] = useState(
    localStorage.getItem("selectedColor") || "white"
  );

  const handleGenerateExposes = async () => {
    try {
      const response = await axios.get("https://apis.geoestate.ai/api/Exposes");
      console.log("exposes", response.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
    setShowCompanyModal(true);
  };

  const [filters, setFilters] = useState({
    version: "1",
    sortBy: "time-desc",
    country: "Spain",
    community: "City",
    municipality: "",
    minPrice: "",
    maxPrice: "",
    minArea: "",
    maxArea: "",
    residential: "Apartment",
    commercial: "Retail",
    bedrooms: "",
    bathrooms: "",
    land: "",
  });

  const generatePDF = (companyDetails) => {
    const { logo, name, address, phone, email } = companyDetails;
    const { titulo, descripcion, foto } = selectedProperty;

    const doc = new jsPDF();

    // Add Property Info
    doc.setFontSize(16);
    doc.text(titulo || "No Title Available", 10, 10);
    doc.setFontSize(12);
    doc.text(descripcion || "No Description Available", 10, 20);

    // Add Company Info
    doc.setFontSize(14);
    doc.text("Company Information", 10, 40);
    doc.text(`Name: ${name}`, 10, 50);
    doc.text(`Address: ${address}`, 10, 60);
    doc.text(`Phone: ${phone}`, 10, 70);
    doc.text(`Email: ${email}`, 10, 80);

    // Add company logo if provided
    if (logo) {
      const logoImage = URL.createObjectURL(logo);
      doc.addImage(logoImage, "JPEG", 10, 90, 40, 40);
    }

    // Add property image if provided
    if (foto) {
      doc.addImage(foto, "JPEG", 10, 130, 100, 100);
    }

    doc.save(`${titulo || "property"}.pdf`);
  };

  const handleSaveCompanyDetails = (details) => {
    setCompanyDetails(details); // Save the company details to state
    setShowCompanyModal(false); // Close the modal after saving
    generatePDF(details); // Trigger the PDF generation with company and property data
  };

  const toggleLiveButton = () => {
    setIsLiveActive((prevState) => !prevState);
    if (!isLiveActive) {
      goToLiveLocation();
    }
  };
  const markerIcons = {
    red: For_user,
    blue: for_blue,
    green: for_green,
    yellow: for_map,
    default: for_map,
  };
  const downloadPDF = () => {
    if (!selectedProperty) {
      alert("No property details available to download.");
      return;
    }

    const { titulo, descripcion, foto } = selectedProperty;

    // Initialize jsPDF
    const doc = new jsPDF();

    // Add title and description
    doc.setFontSize(16);
    doc.text(titulo || "No Title Available", 10, 10);
    doc.setFontSize(12);
    doc.text(descripcion || "No Description Available", 10, 20);

    const getBase64ImageFromURL = async (url) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "Anonymous"; // Handle CORS
        img.src = url;

        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);
          resolve(canvas.toDataURL("image/jpeg"));
        };

        img.onerror = (error) => {
          reject(error);
        };
      });
    };

    if (foto) {
      getBase64ImageFromURL(foto)
        .then((base64Image) => {
          doc.addImage(base64Image, "JPEG", 10, 30, 100, 100);
          doc.save(`${titulo || "property"}.pdf`);
        })
        .catch((error) => {
          console.error("Failed to load image:", error);
          doc.save(`${titulo || "property"}.pdf`);
        });
    } else {
      doc.save(`${titulo || "property"}.pdf`);
    }
  };

  // Listen for changes in localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      const color = localStorage.getItem("selectedColor");
      setSelectedColor(color || "white");
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const [locationDetails, setLocationDetails] = useState({
    country: "",
    state: "",
    city: "",
  });
  const [mapLoaded, setMapLoaded] = useState(false);
  const [propertiesCount, setPropertiesCount] = useState(0);
  const [totalProperties, settotalProperties] = useState();
  const addCrossToPolygon = (polygon) => {
    if (!polygon) return;

    const path = polygon.getPath();
    const firstVertex = path.getAt(0);

    const crossDiv = document.createElement("div");
    crossDiv.innerHTML = `<i class="fas fa-times-circle" style="font-size: 20px; color: red; cursor: pointer;"></i>`;
    crossDiv.style.position = "absolute";
    crossDiv.style.cursor = "pointer";

    const overlay = new window.google.maps.OverlayView();
    overlay.onAdd = function () {
      const panes = this.getPanes();
      panes.overlayMouseTarget.appendChild(crossDiv);

      crossDiv.addEventListener("click", () => {
        console.log("Cross clicked: Removing polygon.");
        polygon.setMap(null); // Remove polygon
        overlay.setMap(null); // Remove overlay

        setPolygons((prevPolygons) =>
          prevPolygons.filter((p) => p !== polygon)
        ); // Remove from state

        setActivePolygon(null); // Reset active polygon
      });
    };

    overlay.draw = function () {
      const projection = this.getProjection();
      const position = projection.fromLatLngToDivPixel(firstVertex);
      crossDiv.style.left = `${position.x}px`;
      crossDiv.style.top = `${position.y}px`;
    };

    overlay.onRemove = function () {
      if (crossDiv.parentNode) {
        crossDiv.parentNode.removeChild(crossDiv);
      }
    };

    overlay.setMap(mapRef.current); // Attach overlay to map
    polygon.overlay = overlay; // Store reference inside polygon
  };

  useEffect(() => {
    console.log("Current properties in state:", prop);
  }, [prop]);

  useEffect(() => {
    if (googleMapsLoaded && mapRef.current) {
      const listener = mapRef.current.addListener("click", (event) => {
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();
      });

      return () => {
        listener.remove();
      };
    }
  }, [googleMapsLoaded, mapRef.current]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        console.error("Location access denied.", error);
      }
    );
  }, []);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get(
          "https://apis.geoestate.ai/api/Property/getProperties"
        );
        console.log("API Response:", response.data);

        if (Array.isArray(response.data)) {
          console.log("✅ API returned an array.");
          setAllProperties(response.data); // Store properties
        } else {
          console.error(
            "🛑 Expected an array but got:",
            typeof response.data,
            response.data
          );
          setAllProperties([]); // Fallback to empty array
        }
      } catch (error) {
        console.error("Error fetching properties:", error);
        setAllProperties([]); // Fallback to empty array
      }
    };
    fetchProperties();
  }, []);

  useEffect(() => {
    // Set count for filtered properties
    setPropertiesCount(properties.length);
  }, [properties]);

  useEffect(() => {
    const loadGeoJsonData = async () => {
      if (!mapRef.current) return;

      try {
        const response = await fetch(
          "https://api.biznetusa.com/public/countries.geojson"
        );
        if (!response.ok) throw new Error("Failed to fetch GeoJSON data");
        const data = await response.json();
        mapRef.current.data.addGeoJson(data);

        mapRef.current.data.setStyle({
          fillColor: "#FFFFFF", // Transparent fill
          fillOpacity: 0.1,
          strokeColor: "light",
          strokeWeight: 1,
          strokeOpacity: 0.2,
        });

        // Highlight on hover
        mapRef.current.data.addListener("mouseover", (event) => {
          const currentZoom = mapRef.current.getZoom();
          if (currentZoom < 7) {
            mapRef.current.data.overrideStyle(event.feature, {
              fillColor: "#33DB4A",
              fillOpacity: 0.6,
              strokeColor: "light",
              strokeWeight: 2,
            });
          }
        });

        // Reset highlight on mouseout
        mapRef.current.data.addListener("mouseout", (event) => {
          const currentZoom = mapRef.current.getZoom();
          if (currentZoom < 10) {
            // Change 10 to your desired zoom level
            mapRef.current.data.overrideStyle(event.feature, {
              fillColor: "#FFFFFF40",
              fillOpacity: 0.2,
              strokeColor: "dotted",
              strokeWeight: 1,
              strokeOpacity: 0.6,
            });
          }
        });

        mapRef.current.data.addListener("click", async (event) => {
          const bounds = new window.google.maps.LatLngBounds();

          // Extend bounds with the GeoJSON feature's geometry
          const geometry = event.feature.getGeometry();
          geometry.forEachLatLng((latLng) => bounds.extend(latLng));

          // Fit map to bounds
          mapRef.current.fitBounds(bounds);

          // Count properties within the bounds
          const propertiesInBounds = properties.filter((property) => {
            const propertyLatLng = new window.google.maps.LatLng(
              property.latitud,
              property.longitud
            );
            return bounds.contains(propertyLatLng);
          });

          // Update properties count state
          setPropertiesCount(propertiesInBounds.length);

          // Fetch city, state, and country using Geocoder
          const center = bounds.getCenter();
          const geocoder = new window.google.maps.Geocoder();
          geocoder.geocode(
            { location: { lat: center.lat(), lng: center.lng() } },
            (results, status) => {
              if (status === "OK" && results[0]) {
                const addressComponents = results[0].address_components;

                const country =
                  addressComponents.find((comp) =>
                    comp.types.includes("country")
                  )?.long_name || "";
                const state =
                  addressComponents.find((comp) =>
                    comp.types.includes("administrative_area_level_1")
                  )?.long_name || "";
                const city =
                  addressComponents.find(
                    (comp) =>
                      comp.types.includes("locality") ||
                      comp.types.includes("political")
                  )?.long_name || "";

                // Save these values to state
                setLocationDetails({ city, state, country });
              } else {
                console.error("Geocoder failed:", status);
              }
            }
          );
        });
      } catch (error) {
        console.error("Error loading or parsing GeoJSON data:", error);
      }
    };

    if (mapLoaded) {
      loadGeoJsonData();
    }
  }, [mapLoaded, properties]);

  const toggleDrawingMode = () => {
    if (drawingMode) {
      // If already in drawing mode, clear the active polygon and exit mode
      if (activePolygon) {
        activePolygon.setMap(null);
        setActivePolygon(null);
      }
      setDrawingMode(false); // Disable drawing mode
    } else {
      setDrawingMode(true); // Enable drawing mode
    }
  };
  const displayedProperties =
    filteredProperties.length > 0 ? filteredProperties : allProperties;

  const onPolygonComplete = (polygon) => {
    console.log("✅ Polygon completed:", polygon);

    polygon.setEditable(false);
    polygon.setDraggable(false);

    setActivePolygon(polygon);
    setPolygons((prevPolygons) => [...prevPolygons, polygon]);

    // Get bounds and zoom to polygon
    const bounds = new window.google.maps.LatLngBounds();
    polygon.getPath().forEach((point) => bounds.extend(point));
    mapRef.current.fitBounds(bounds);

    if (!Array.isArray(allProperties) || allProperties.length === 0) {
      console.error("⚠️ No properties available to filter.");
      return;
    }

    // Find properties inside the polygon
    const propertiesInPolygon = allProperties.filter((property) => {
      const propertyLatLng = new window.google.maps.LatLng(
        property.latitud,
        property.longitud
      );
      return window.google.maps.geometry.poly.containsLocation(
        propertyLatLng,
        polygon
      );
    });

    console.log("🏡 Filtered properties inside polygon:", propertiesInPolygon);
    setProp(allProperties);

    addCrossToPolygon(polygon); // Attach cross button

    console.log("🛑 HARD RESET of DrawingManager...");

    if (drawingManagerRef.current) {
      drawingManagerRef.current.setDrawingMode(null);
    }

    setDrawingMode(false);
    setTimeout(() => {
      console.log("♻️ Re-rendering DrawingManager...");
      setDrawingMode(true); // This forces a fresh instance of DrawingManager
    }, 100);
  };

  const clearPolygons = () => {
    console.log("Clearing all polygons...");

    // Remove all polygons and their overlays
    polygons.forEach((polygon) => {
      if (polygon) {
        polygon.setMap(null); // Remove polygon
        if (polygon.overlay) {
          polygon.overlay.setMap(null); // Remove overlay cross icon
        }
      }
    });

    setPolygons([]); // Clear polygons from state
    setProp([]); // Clear filtered properties
    setActivePolygon(null); // Reset active polygon

    // Ensure drawing mode is disabled
    if (drawingManagerRef.current) {
      drawingManagerRef.current.setDrawingMode(null);
    }
    setDrawingMode(false); // Ensure mode is disabled
  };

  const goToLiveLocation = () => {
    if (userLocation) {
      mapRef.current.panTo(
        new window.google.maps.LatLng(userLocation.lat, userLocation.lng)
      );
      mapRef.current.setZoom(15); // Set a closer zoom level to show detail
      setIsLiveActive(true); // Set live active to true when going to live location
    } else {
      console.error("User location is not available.");
    }
  };

  // const handleMarkerClick = async (property) => {
  //   console.log(property);

  //   if (!property.latitud || !property.longitud) {
  //     console.error("Invalid property coordinates:", property);
  //     return;
  //   }

  //   try {
  //     const fetchedData = await fetchPropertyById(property.idPropiedad);
  //     if (!fetchedData) {
  //       console.error("No data returned for property", property.idPropiedad);
  //       return;
  //     }

  //     const newSelectedProperty = {
  //       ...fetchedData,
  //       directions: {
  //         origin: userLocation,
  //         destination: { lat: property.latitud, lng: property.longitud },
  //         travelMode: "DRIVING",
  //       },
  //     };

  //     console.log(newSelectedProperty);
  //     setSelectedProperty(newSelectedProperty);
  //     setProp((prev) => [...prev, newSelectedProperty]);
  //     setShowDetailsModal(true);
  //   } catch (error) {
  //     console.error("Error fetching property details:", error);
  //   }
  // };

  const fetchPropertyById = async (id) => {
    try {
      const response = await axios.get(
        `https://apis.geoestate.ai/api/Property/getProperties/${id}`
      );
      console.log("Fetched property:", response.data);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch property", error);
    }
  };

  const clearDirections = () => {
    setDirectionsResponse(null);
    setSelectedProperty(null); // Optional: Clear selected property if needed
    setPropertiesCount(0); // Reset properties count
  };

  const handleProperDetail = (idPropiedad) => {
    navigate(`/product-detail/${idPropiedad}`);
  };

  return (
    <>
      <EmailModal
        property={selectedProperty}
        show={showEmailModal}
        handleClose={handleCloseEmailModal}
      />
      <div className="container-fluid py-4 bg-gradient bg-light shadow-sm rounded">
        <div className="row align-items-center justify-content-between">
          {/* Left Section */}
          <div className="col-md-8 col-12">
            <h4 className="mb-2 text-muted ">
              Property for sale in {locationDetails.country}
            </h4>
            <p className="mb-0 text-muted">
              Total Properties Found: <strong>{totalProperties || 0}</strong> |
              Properties Selected Region: <strong>{propertiesCount}</strong>
            </p>
          </div>
          <Filters
            show={showFilters}
            handleClose={() => setShowFilters(false)}
            property={filteredProperties}
            updateProperties={setFilteredProperties}
            filters={filters}
            setFilters={setFilters}
          />
          {/* Right Section */}
          <div className="col-md-4 col-12 text-md-end text-center mt-md-0 mt-3">
            {/* <button
              className="btn px-4 py-2 shadow-sm"
              style={{ backgroundColor: "var(--color)" }}
            >
              <i className="bi bi-bell me-2"></i> Create Alert
            </button> */}
          </div>
        </div>
      </div>

      <LoadScript
        googleMapsApiKey="AIzaSyD6BzBn_Tszpy0STtNSbtyyBp4ii2Ji55c"
        libraries={mapLibraries}
        onLoad={() => setGoogleMapsLoaded(true)}
      >
        {googleMapsLoaded && (
          <GoogleMap
            mapContainerStyle={{ width: "100%", height: "85vh" }}
            zoom={3} // Adjust as needed to better fit the initial view
            center={userLocation || { lat: 39.6111, lng: 2.8989 }} // Default to Islas Baleares
            onLoad={(map) => {
              mapRef.current = map;
              setMapLoaded(true); // Set this state when the map is actually loaded
            }}
            options={{
              restriction: {
                latLngBounds: {
                  north: 85,
                  south: -85,
                  east: 180,
                  west: -180,
                },
                strictBounds: true,
              },
              mapTypeId: "satellite",
            }}
          >
            {userLocation && (
              <Marker
                position={userLocation}
                icon={{
                  url: For_user,
                  scaledSize: new window.google.maps.Size(25, 35),
                }}
              />
            )}
            {displayedProperties.length > 0 &&
              displayedProperties.map(
                (property, index) =>
                  property.latitud &&
                  property.longitud && (
                    <Marker
                      key={index}
                      position={{
                        lat: property.latitud,
                        lng: property.longitud,
                      }}
                      onClick={() => handleMarkerClick(property)}
                      icon={{
                        url: markerIcons[selectedColor] || markerIcons.default,
                        scaledSize: new window.google.maps.Size(25, 35),
                      }}
                    />
                  )
              )}

            {selectedProperty && selectedProperty.directions && (
              <DirectionsService
                options={selectedProperty.directions}
                callback={(response) => {
                  if (response.status === "OK") {
                    setDirectionsResponse(response);
                  } else {
                    console.error(
                      "Directions request failed due to ",
                      response.status
                    );
                    alert("Failed to get directions: " + response.status);
                  }
                }}
              />
            )}
            {directionsResponse && (
              <DirectionsRenderer
                options={{
                  directions: directionsResponse,
                  suppressMarkers: true,
                  polylineOptions: {
                    strokeColor: "#33db4a",
                    strokeWeight: 6,
                  },
                }}
              />
            )}
            {drawingMode && (
              <DrawingManager
                key={`drawingManagerKey`}
                onLoad={(dm) => (drawingManagerRef.current = dm)}
                onPolygonComplete={onPolygonComplete}
                options={{
                  drawingControl: false,
                  drawingMode: "polygon",
                  polygonOptions: {
                    fillColor: "#ffffff",
                    fillOpacity: 0.5,
                    strokeWeight: 2,
                    clickable: true,
                    editable: true,
                    zIndex: 1,
                  },
                }}
              />
            )}
            <PDFGenerator
              companyDetails={companyDetails}
              selectedProperty={selectedProperty}
            />

            {showDetailsModal && selectedProperty && (
              <div
                className="property-modal-container"
                style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  pointerEvents: "none",
                  zIndex: 1000,
                }}
              >
                <CompanyDetailsModal
                  id={selectedProperty.idPropiedad}
                  show={showCompanyModal}
                  handleClose={handleCloseCompanyModal}
                  onSave={handleSaveCompanyDetails}
                />

                <OverlayView
                  position={{
                    lat: selectedProperty.markerPosition?.lat,
                    lng: selectedProperty.markerPosition?.lng,
                  }}
                  mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                >
                  <div
                    className="property-modal p-3 rounded shadow bg-white"
                    onClick={() =>
                      handleProperDetail(selectedProperty.idPropiedad)
                    }
                    style={{
                      Width: "300px !important",
                      height: "auto",
                      transform: "translate(-50%, -105%)",
                      marginBottom: "5px",
                      cursor: "pointer",
                      pointerEvents: "auto",
                      border: "1px solid #ddd",
                    }}
                  >
                    {/* Close Button */}
                    <div className="d-flex justify-content-end">
                      <button
                        className="btn-close"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowDetailsModal(false);
                        }}
                      />
                    </div>

                    <div className="property-image text-center">
                      <img
                        src={
                          selectedProperty.foto ||
                          "https://via.placeholder.com/400"
                        }
                        alt="Property"
                        className="rounded w-100"
                        style={{ maxHeight: "150px", objectFit: "cover" }}
                      />
                    </div>

                    <h5 className="mt-2 mb-1 text-dark">
                      {selectedProperty.titulo || "No title available"}
                      <span className="text-primary fw-bold">
                        {" "}
                        €{selectedProperty.precio || "N/A"}
                      </span>
                    </h5>
                    <p className="text-muted small">
                      {selectedProperty.ubicacion || ""}
                    </p>

                    <div className="d-flex justify-content-around my-2">
                      <div className="text-center">
                        <span className="fs-5">📏</span>
                        <p className="mb-0">
                          {selectedProperty.area || "N/A"} m²
                        </p>
                      </div>
                      <div className="text-center">
                        <span className="fs-5">🛏</span>
                        <p className="mb-0">
                          {selectedProperty.habitaciones || "N/A"} Beds
                        </p>
                      </div>
                      <div className="text-center">
                        <span className="fs-5">🚿</span>
                        <p className="mb-0">
                          {selectedProperty.banos || "N/A"} Baths
                        </p>
                      </div>
                    </div>

                    {/* Only Generate Exposes Button */}
                   
                  </div>
                </OverlayView>
              </div>
            )}
          </GoogleMap>
        )}

        <Button
          className="draw-zone-button"
          onClick={() => {
            toggleDrawingMode();
            // setDrawingMode(prev => !prev);
            // if (!drawingMode) {
            //     drawingManagerRef.current.setDrawingMode(null);
            // }
            // console.log(`Drawing mode ${!drawingMode ? "Enable" : "Disable"}`);
          }}
        >
          {drawingMode ? "Disable Drawing" : "Enable Drawing"}
        </Button>
        <div
          className="live-location-control"
          onClick={goToLiveLocation}
          style={{
            position: "absolute",
            bottom: "20px",
            right: "40rem",
            zIndex: "1000",
            border: "2px solid green ",
            cursor: "pointer",
            display: "flex",

            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "transparent",
            width: "50px",
            height: "60px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          <img
            src={isLiveActive ? active : inactive}
            alt="Live Location"
            className="live-location-icon"
            style={{
              width: "24px",
              height: "34px",
              filter: isLiveActive ? "none" : "grayscale(100%)", // Grayscale effect when inactive
            }}
          />
          <div
            className="live-location-text"
            style={{
              marginTop: "5px",
              fontSize: "12px",
              color: isLiveActive ? "white" : "#999",
            }}
          >
            Live
          </div>
        </div>

        <Button className="clear-directions-button" onClick={clearPolygons}>
          Clear Filters
        </Button>
      </LoadScript>
    </>
  );
};

export default MapComponent;
