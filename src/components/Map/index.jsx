import React, { useEffect, useReducer, useRef, useState } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  DirectionsService,
  DirectionsRenderer,
  DrawingManager,
} from "@react-google-maps/api";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShareAlt, faTimes } from "@fortawesome/free-solid-svg-icons";

import "./map.css";
import for_map from "../../assests/img/for_map.png";
import For_user from "../../assests/img/For_user_Home.png";
import for_after_Click from "../../assests/img/For_map_afterclick (2).png";
import for_blue from "../../assests/img/for-blue.png";
import EmailModal from "../../components/EmailService";
import for_green from "../../assests/img/gps.png";
const mapLibraries = ["places", "drawing"];

// Marker icon mapping

const MapComponent = ({ properties, updateProperties }) => {
  const mapRef = useRef(null);
  const [prop, setProp] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [googleMapsLoaded, setGoogleMapsLoaded] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState({});
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [drawingMode, setDrawingMode] = useState(false);
  const [activePolygon, setActivePolygon] = useState(null);
  const [showEmailModal, setShowEmailModal] = useState(false);

  const handleCloseEmailModal = () => setShowEmailModal(false);
  const handleShowEmailModal = () => setShowEmailModal(true);
  const [selectedColor, setSelectedColor] = useState(
    localStorage.getItem("selectedColor") || "white"
  );
  const markerIcons = {
    red: For_user,
    blue: for_blue,
    green: for_green,
    yellow: for_map,
    default: for_map,
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
          "http://homevocation-001-site4.atempurl.com/api/Property/getProperties",
          {
            headers: {
              "User-Agent": "curl/7.68.0",
              "Content-Type": "application/json",
            },
          }
        );
        updateProperties(response.data);
        settotalProperties(response.data.length); // Set default count
      } catch (error) {
        console.error("Error fetching properties:", error);
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
          mapRef.current.data.overrideStyle(event.feature, {
            fillColor: "#33DB4A",
            fillOpacity: 0.6,
            strokeColor: "light",
            strokeWeight: 2,
          });
        });

        // Reset highlight on mouseout
        mapRef.current.data.addListener("mouseout", (event) => {
          mapRef.current.data.overrideStyle(event.feature, {
            fillColor: "#FFFFFF40",
            fillOpacity: 0.2,
            strokeColor: "dotted",
            strokeWeight: 1,
            strokeOpacity: 0.6,
          });
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
    if (!drawingMode) {
      setDrawingMode(true);
    } else {
      if (activePolygon) {
        activePolygon.setMap(null);
        setActivePolygon(null);
      }
      updateProperties(properties); // Reset to original properties if needed
      setDrawingMode(false);
    }
  };

  const onPolygonComplete = (polygon) => {
    setActivePolygon(polygon);
    const path = polygon
      .getPath()
      .getArray()
      .map((coord) => ({ lat: coord.lat(), lng: coord.lng() }));
    const bounds = new window.google.maps.LatLngBounds();
    path.forEach((point) => bounds.extend(point));
    mapRef.current.fitBounds(bounds);

    const filteredProperties = properties.filter((property) => {
      const propertyLatLng = new window.google.maps.LatLng(
        property.latitud,
        property.longitud
      );
      return bounds.contains(propertyLatLng);
    });

    updateProperties(filteredProperties);
    setDrawingMode(false); // Automatically deactivate drawing mode after polygon completion
  };

  const handleMarkerClick = (property) => {
    if (!property.latitud || !property.longitud) {
      console.error("Invalid property coordinates:", property);
      return;
    }

    const newSelectedProperty = {
      ...property,
      directions: {
        origin: userLocation,
        destination: { lat: property.latitud, lng: property.longitud },
        travelMode: "DRIVING",
      },
    };
    console.log(newSelectedProperty);
    setSelectedProperty(newSelectedProperty);
    setProp((prev) => [...prev, newSelectedProperty]);
    setShowDetailsModal(true);

    // Center and zoom the map to the selected property
    // mapRef.current.panTo(
    //   new window.google.maps.LatLng(property.latitud, property.longitud)
    // );
    // mapRef.current.setZoom(5); // Adjust zoom level as needed
  };

  const clearDirections = () => {
    setDirectionsResponse(null);
    setSelectedProperty(null); // Optional: Clear selected property if needed
    setPropertiesCount(0); // Reset properties count
  };

  return (
    <>
      <EmailModal
        property={selectedProperty}
        show={showEmailModal}
        handleClose={handleCloseEmailModal}
      />
      <div className="container-fluid py-3 bg-light">
        <div className="row align-items-center">
          {/* Left Section */}
          <div className="col-md-12 col-6 d-flex align-items-center">
            <div>
              <h4 className="mb-1">
                Property for sale in {locationDetails.country}
              </h4>
              <p className="mb-0 text-muted">
                {" "}
                Total Properties Found: {totalProperties} | Properties selected
                Region: {propertiesCount}
              </p>
            </div>
            {/* Right Section */}
            <div className="col-md-6 col-12 text-md-end text-start mt-md-0 mt-2">
              <button className="btn btn-outline-primary">
                <i className="bi bi-bell"></i> Create Alert
              </button>
            </div>
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
            center={userLocation || { lat: 39.5652234, lng: 2.5042032 }}
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
            {properties.map((property, index) => (
              <Marker
                key={index}
                position={{ lat: property.latitud, lng: property.longitud }}
                onClick={() => handleMarkerClick(property)}
                icon={{
                  url: markerIcons[selectedColor] || markerIcons.default, // Use selectedColor to determine the marker image
                  scaledSize: new window.google.maps.Size(25, 35),
                }}
              />
            ))}

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
                onPolygonComplete={onPolygonComplete}
                options={{
                  drawingControl: true,
                  drawingControlOptions: {
                    position: window.google.maps.ControlPosition.BOTTOM_CENTER,
                    drawingModes: [
                      window.google.maps.drawing.OverlayType.POLYGON,
                    ],
                  },
                  polygonOptions: {
                    fillColor: "#ffffff",
                    fillOpacity: 0.5,
                    strokeWeight: 2,
                    clickable: false,
                    editable: true,
                    zIndex: 1,
                  },
                }}
              />
            )}
            {showDetailsModal && selectedProperty && (
              <Modal
                show={showDetailsModal}
                onHide={() => setShowDetailsModal(false)}
              >
                <Modal.Header closeButton>
                  <Modal.Title>Property Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <h4>{selectedProperty.titulo || "No title available"}</h4>
                  <img
                    src={
                      selectedProperty.foto || "https://via.placeholder.com/200"
                    }
                    alt="Property"
                    style={{
                      width: "100%",
                      height: "auto",
                      marginBottom: "10px",
                    }}
                  />
                  <p>
                    {selectedProperty.descripcion || "No description available"}
                  </p>
                  <Button
                    onClick={() => {
                      const message = `Check out this property: ${
                        selectedProperty.titulo || "Property"
                      } - ${selectedProperty.descripcion || ""}`;
                      const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
                        message
                      )}`;
                      window.open(whatsappUrl, "_blank");
                    }}
                    variant="primary"
                  >
                    <FontAwesomeIcon icon={faShareAlt} /> Share on WhatsApp
                  </Button>
                  <Button
                    onClick={handleShowEmailModal}
                    className="btn btn-primary"
                  >
                    Share as PDF via Email
                  </Button>
                </Modal.Body>

                <Modal.Footer>
                  <Button
                    variant="secondary"
                    onClick={() => setShowDetailsModal(false)}
                  >
                    Close
                  </Button>
                </Modal.Footer>
              </Modal>
            )}
          </GoogleMap>
        )}

        <Button className="draw-zone-button" onClick={toggleDrawingMode}>
          {drawingMode ? "Disable Drawing Mode" : "Enable Drawing Mode"}
        </Button>
        <Button className="clear-directions-button" onClick={clearDirections}>
          Clear Filters
        </Button>
      </LoadScript>
    </>
  );
};

export default MapComponent;
