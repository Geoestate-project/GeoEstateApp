import React, { useRef, useState } from "react";
import axios from "axios";
import html2pdf from "html2pdf.js";
import Sidebar from "../../components/Sidebar";
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Form, 
  Button, 
  Spinner, 
  Image, 
  Badge,
  ListGroup
} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const PropertyToPDF = () => {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const contentRef = useRef(null);
  const [property, setProperty] = useState(null);
  const [manualInput, setManualInput] = useState(false);
  const [formData, setFormData] = useState({
    title: "Modern villa in Sol de Mallorca",
    surface: "682",
    plotSize: "1358",
    bedrooms: "5",
    bathrooms: "6",
    price: "3.800.000",
    description: "Situated close by the stunning Portals Vells Bay and within the quiet residential neighbourhood of Sol de Mallorca, this recently built villa offers exceptionally comfortable living with open plan spaces and generous terraces.\n\nOn entering the property you find a foyer, a large living and dining area and kitchen with a central island. There is also a spacious guest bedroom suite, guest WC and laundry area. There are both covered and uncovered terraces on this level to fully enjoy the property all year round, a pool bathroom and a salt water swimming pool.\n\nThe garden is mature and provides privacy to the neighbors. The first floor consists of two master bedroom suites and two additional bedroom suites, all with access to terraces.\n\nFeatures of the property consist of stone, ceramic and wood flooring, h/c air conditioning, under floor heating through oil, exensive solar panel system, double garage plus additional off-street parking and lift access from the garage to the first floor.\n\nThere is also access to a roof terrace which offer sea views to Portals Vells Bay and the surrounding green areas. This is a perfect family home for both holidays and permanent living, just a few minutes walk from the beach and 20 minutes from Palma.",
    features: "- Air conditioning hot/cold\n- Central heating\n- Alarm system\n- Open plan fitted kitchen\n- Laundry room\n- Porches\n- Terraces\n- Solarium\n- Garden\n- Swimming pool\n- Garage and parking space\n- Stone, ceramic and wood flooring\n- Under floor heating\n- Solar panel system\n- Double garage\n- Lift access from garage to first floor\n- Roof terrace with sea views",
    location: "- Coastal environment\n- 5 min. walking distance to beaches\n- Close to restaurants\n- Close to shops\n- 20 min. from Palma",
    agentName: "Germán Feliu",
    agentTitle: "Sales Executive",
    agentPhone1: "+34 699 017 566",
    agentPhone2: "+34 971 129 292",
    agentEmail: "feliu@balearhouse.es",
    agentWebsite: "www.balearhouse.com",
    agentAddress: "Paseo Mallorca 22, Palma de Mallorca",
    images: []
  });

  const API_KEY = "2c19371054f47d3b696514521e77565f"; // Replace with your Diffbot API Key
  const API_URL = "https://api.diffbot.com/v3/article";

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Fetch the property details from URL
  const fetchPropertyDetails = async () => {
    if (!url && !manualInput) {
      alert("Please enter a property URL or use manual input");
      return;
    }
    
    if (manualInput) {
      // Use form data directly
      setProperty({
        formData: { ...formData }
      });
      return;
    }
    
    setLoading(true);
    try {
      const response = await axios.get(API_URL, {
        params: { token: API_KEY, url: url },
      });
      if (
        response.data &&
        response.data.objects &&
        response.data.objects.length > 0
      ) {
        // Get data from API
        const apiData = response.data.objects[0];
        
        // Extract structured data from API result
        const extractedData = extractPropertyDetails(apiData);
        
        // Set property with both raw API data and our extracted data
        setProperty({
          apiData,
          extractedData
        });
      } else {
        alert("No property data found for this URL!");
      }
    } catch (error) {
      console.error("Error fetching property data:", error);
      alert("Failed to fetch property data. Please check the URL and try again.");
    }
    setLoading(false);
  };

  // Generate the PDF using html2pdf.js
  const generatePDF = () => {
    if (!contentRef.current) return;
    const options = {
      margin: 1,
      filename: "Property_Expose.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };
    html2pdf().set(options).from(contentRef.current).save();
  };

  // Function to extract property features and details from API data
  const extractPropertyDetails = (apiData) => {
    if (!apiData) return {};
    
    // Initialize with default values
    const details = {
      title: apiData.title || "Beautiful Property",
      location: apiData.author || apiData.siteName || "",
      price: "",
      bedrooms: "",
      bathrooms: "",
      surface: "",
      plotSize: "",
      description: apiData.text || "",
      features: [],
      locationDetails: [],
      contactInfo: {
        name: "",
        title: "",
        phone1: "",
        phone2: "",
        email: "",
        website: "",
        address: ""
      },
      images: apiData.images || []
    };
    
    // Try to extract structured data from text
    if (apiData.text) {
      // Look for price in €X,XXX,XXX format
      const priceMatch = apiData.text.match(/(?:price|:)\s*[€$]?\s*([\d\.,]+)\s*[€$]?/i);
      if (priceMatch) details.price = priceMatch[1];
      
      // Look for bedrooms
      const bedroomMatch = apiData.text.match(/(?:bedrooms|bed)\s*[:\s]\s*(\d+)/i);
      if (bedroomMatch) details.bedrooms = bedroomMatch[1];
      
      // Look for bathrooms
      const bathroomMatch = apiData.text.match(/(?:bathrooms|bath)\s*[:\s]\s*(\d+)/i);
      if (bathroomMatch) details.bathrooms = bathroomMatch[1];
      
      // Look for surface area
      const surfaceMatch = apiData.text.match(/(?:surface|built area|area)\s*[:\s]\s*(\d+[\d\.,]*)\s*m2/i);
      if (surfaceMatch) details.surface = surfaceMatch[1];
      
      // Look for plot size
      const plotMatch = apiData.text.match(/(?:plot|plot size|land)\s*[:\s]\s*(\d+[\d\.,]*)\s*m2/i);
      if (plotMatch) details.plotSize = plotMatch[1];
      
      // Extract features section
      const featuresMatch = apiData.text.match(/FEATURES:(.+?)(?:LOCATION:|$)/is);
      if (featuresMatch && featuresMatch[1]) {
        const featuresText = featuresMatch[1].trim();
        const featuresList = featuresText.split(/\n-|\n•|,/).map(item => item.trim()).filter(item => item);
        details.features = featuresList;
      } else {
        // Fallback: Extract features by looking for common amenities
        const featureKeywords = [
          "air conditioning", "heating", "swimming pool", "garden", "terrace", 
          "garage", "parking", "alarm", "security", "sea view", "mountain view",
          "fireplace", "fitted kitchen", "laundry", "solarium", "basement"
        ];
        
        featureKeywords.forEach(feature => {
          if (apiData.text.toLowerCase().includes(feature.toLowerCase())) {
            details.features.push(feature.charAt(0).toUpperCase() + feature.slice(1));
          }
        });
      }
      
      // Extract location details
      const locationMatch = apiData.text.match(/LOCATION:(.+?)(?:\n\n|\n[A-Z]|$)/is);
      if (locationMatch && locationMatch[1]) {
        const locationText = locationMatch[1].trim();
        const locationList = locationText.split(/\n-|\n•|,/).map(item => item.trim()).filter(item => item);
        details.locationDetails = locationList;
      }
      
      // Extract contact info (look for email, phone, website patterns)
      const emailMatch = apiData.text.match(/[\w.+-]+@[\w-]+\.[\w.-]+/);
      if (emailMatch) details.contactInfo.email = emailMatch[0];
      
      const phoneMatch = apiData.text.match(/(?:\+\d{1,3}[\s-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/g);
      if (phoneMatch && phoneMatch.length > 0) {
        details.contactInfo.phone1 = phoneMatch[0];
        if (phoneMatch.length > 1) details.contactInfo.phone2 = phoneMatch[1];
      }
      
      const websiteMatch = apiData.text.match(/www\.[\w.-]+\.\w+/);
      if (websiteMatch) details.contactInfo.website = websiteMatch[0];
      
      // Try to extract agent name (simple heuristic: look for lines with 1-3 words before contact info)
      const lines = apiData.text.split('\n');
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line && line.split(/\s+/).length <= 3 && line.length > 3 && 
            !line.match(/^[0-9+@]/) && !line.includes('@') && !line.includes('www.')) {
          details.contactInfo.name = line;
          // Check if next line might be title
          if (i+1 < lines.length && lines[i+1].trim().split(/\s+/).length <= 4) {
            details.contactInfo.title = lines[i+1].trim();
          }
          break;
        }
      }
    }
    
    return details;
  };

  // Get final property data to display (either from API or manual form)
  const getPropertyData = () => {
    if (!property) return null;
    
    if (property.formData) {
      // Manual input data
      return {
        title: property.formData.title,
        price: property.formData.price,
        bedrooms: property.formData.bedrooms,
        bathrooms: property.formData.bathrooms,
        surface: property.formData.surface,
        plotSize: property.formData.plotSize,
        description: property.formData.description,
        features: property.formData.features.split('\n').map(f => f.trim()).filter(f => f),
        locationDetails: property.formData.location.split('\n').map(l => l.trim()).filter(l => l),
        contactInfo: {
          name: property.formData.agentName,
          title: property.formData.agentTitle,
          phone1: property.formData.agentPhone1,
          phone2: property.formData.agentPhone2,
          email: property.formData.agentEmail,
          website: property.formData.agentWebsite,
          address: property.formData.agentAddress
        },
        images: property.formData.images
      };
    } else if (property.extractedData) {
      // API data with our extraction
      return property.extractedData;
    }
    
    return null;
  };

  const propertyData = getPropertyData();

  // Placeholder images for demo
  const placeholderImages = [
    "/api/placeholder/800/600",
    "/api/placeholder/800/600",
    "/api/placeholder/800/600",
    "/api/placeholder/800/600"
  ];

  return (
    <div className="d-flex min-vh-100 bg-light">
      <Sidebar />
      
      <Container >
        <Row className="mb-4">
          <Col>
            <h1 className="text-success fw-bold">Real Estate Exposé Generator</h1>
          </Col>
        </Row>
        
        <Card className="mb-4 shadow-sm">
          <Card.Body>
            <Card.Title className="text-success mb-3">Property Data Source</Card.Title>
            <Form.Group as={Row} className="mb-3">
              <Col md={12}>
                <Form.Check 
                  type="switch"
                  id="manual-input-switch"
                  label="Use manual input instead of URL"
                  checked={manualInput}
                  onChange={() => setManualInput(!manualInput)}
                  className="mb-3"
                />
                
                {!manualInput ? (
                  <Row>
                    <Col md={9}>
                      <Form.Control
                        type="text"
                        placeholder="https://www.example.com/property/123"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className="py-2"
                      />
                    </Col>
                    <Col md={3}>
                      <Button 
                        variant="success" 
                        onClick={fetchPropertyDetails} 
                        disabled={loading}
                        className="w-100 py-2"
                      >
                        {loading ? (
                          <>
                            <Spinner
                              as="span"
                              animation="border"
                              size="sm"
                              role="status"
                              aria-hidden="true"
                              className="me-2"
                            />
                            Fetching...
                          </>
                        ) : "Generate Exposé"}
                      </Button>
                    </Col>
                  </Row>
                ) : (
                  <div className="manual-input-form">
                    <Row className="mb-3">
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Property Title</Form.Label>
                          <Form.Control
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={3}>
                        <Form.Group className="mb-3">
                          <Form.Label>Price (€)</Form.Label>
                          <Form.Control
                            type="text"
                            name="price"
                            value={formData.price}
                            onChange={handleInputChange}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={3}>
                        <Form.Group className="mb-3">
                          <Form.Label>Location</Form.Label>
                          <Form.Control
                            type="text"
                            name="propertyLocation"
                            value={formData.propertyLocation || "Sol de Mallorca"}
                            onChange={handleInputChange}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    
                    <Row className="mb-3">
                      <Col md={3}>
                        <Form.Group className="mb-3">
                          <Form.Label>Surface (m²)</Form.Label>
                          <Form.Control
                            type="text"
                            name="surface"
                            value={formData.surface}
                            onChange={handleInputChange}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={3}>
                        <Form.Group className="mb-3">
                          <Form.Label>Plot Size (m²)</Form.Label>
                          <Form.Control
                            type="text"
                            name="plotSize"
                            value={formData.plotSize}
                            onChange={handleInputChange}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={3}>
                        <Form.Group className="mb-3">
                          <Form.Label>Bedrooms</Form.Label>
                          <Form.Control
                            type="text"
                            name="bedrooms"
                            value={formData.bedrooms}
                            onChange={handleInputChange}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={3}>
                        <Form.Group className="mb-3">
                          <Form.Label>Bathrooms</Form.Label>
                          <Form.Control
                            type="text"
                            name="bathrooms"
                            value={formData.bathrooms}
                            onChange={handleInputChange}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    
                    <Row className="mb-3">
                      <Col md={12}>
                        <Form.Group className="mb-3">
                          <Form.Label>Description</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={5}
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    
                    <Row className="mb-3">
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Features (one per line)</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={5}
                            name="features"
                            value={formData.features}
                            onChange={handleInputChange}
                            placeholder="- Feature 1&#10;- Feature 2&#10;- Feature 3"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Location Details (one per line)</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={5}
                            name="location"
                            value={formData.location}
                            onChange={handleInputChange}
                            placeholder="- Location detail 1&#10;- Location detail 2"
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    
                    <Row className="mb-3">
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Agent Name</Form.Label>
                          <Form.Control
                            type="text"
                            name="agentName"
                            value={formData.agentName}
                            onChange={handleInputChange}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Agent Title</Form.Label>
                          <Form.Control
                            type="text"
                            name="agentTitle"
                            value={formData.agentTitle}
                            onChange={handleInputChange}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Agent Email</Form.Label>
                          <Form.Control
                            type="email"
                            name="agentEmail"
                            value={formData.agentEmail}
                            onChange={handleInputChange}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    
                    <Row className="mb-3">
                      <Col md={3}>
                        <Form.Group className="mb-3">
                          <Form.Label>Phone 1</Form.Label>
                          <Form.Control
                            type="text"
                            name="agentPhone1"
                            value={formData.agentPhone1}
                            onChange={handleInputChange}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={3}>
                        <Form.Group className="mb-3">
                          <Form.Label>Phone 2</Form.Label>
                          <Form.Control
                            type="text"
                            name="agentPhone2"
                            value={formData.agentPhone2}
                            onChange={handleInputChange}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={3}>
                        <Form.Group className="mb-3">
                          <Form.Label>Website</Form.Label>
                          <Form.Control
                            type="text"
                            name="agentWebsite"
                            value={formData.agentWebsite}
                            onChange={handleInputChange}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={3}>
                        <Form.Group className="mb-3">
                          <Form.Label>Address</Form.Label>
                          <Form.Control
                            type="text"
                            name="agentAddress"
                            value={formData.agentAddress}
                            onChange={handleInputChange}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    
                    <Button 
                      variant="success" 
                      onClick={fetchPropertyDetails}
                      className="w-100 py-2"
                    >
                      Generate Exposé
                    </Button>
                  </div>
                )}
              </Col>
            </Form.Group>
          </Card.Body>
        </Card>
        
        {loading && (
          <div className="text-center p-5">
            <Spinner animation="border" variant="success" className="mb-3" />
            <p className="text-success">Fetching property details...</p>
          </div>
        )}
        
        {propertyData && (
          <>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h2 className="text-success m-0">Property Exposé</h2>
              <Button 
                variant="success" 
                onClick={generatePDF}
                className="d-flex align-items-center"
              >
                <i className="bi bi-file-pdf me-2"></i> Download PDF
              </Button>
            </div>
            
            <div ref={contentRef} className="pdf-content">
              <Card className="mb-4 shadow-sm">
                <Card.Body>
                  {/* Property Header with Title */}
                  <Row>
                    <Col md={12}>
                      <h2 className="display-6 text-success border-bottom pb-2 mb-3">{propertyData.title}</h2>
                    </Col>
                  </Row>
                  
                  {/* Key Property Details */}
                  <Row className="mb-4">
                    <Col md={12}>
                      <div className="d-flex align-items-center justify-content-center bg-light p-3 rounded mb-4">
                        <div className="d-flex flex-wrap justify-content-center gap-3 gap-md-5 text-center">
                          <div>
                            <strong className="d-block">Total surface</strong>
                            <span className="fs-5">{propertyData.surface} m²</span>
                          </div>
                          <div>
                            <strong className="d-block">Plot size</strong>
                            <span className="fs-5">{propertyData.plotSize} m²</span>
                          </div>
                          <div>
                            <strong className="d-block">Bedrooms</strong>
                            <span className="fs-5">{propertyData.bedrooms}</span>
                          </div>
                          <div>
                            <strong className="d-block">Bathrooms</strong>
                            <span className="fs-5">{propertyData.bathrooms}</span>
                          </div>
                          <div>
                            <strong className="d-block">Price</strong>
                            <span className="fs-5 text-success fw-bold">
                              {propertyData.price?.includes('€') ? 
                                propertyData.price : 
                                `${propertyData.price} €`}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Property Images */}
                      <Row className="mb-4">
                        {(propertyData.images && propertyData.images.length > 0 ? 
                          propertyData.images : placeholderImages).map((img, index) => {
                          const imgUrl = typeof img === "object" ? img.url : img;
                          return (
                            <Col md={index === 0 ? 12 : 4} className="mb-3" key={index}>
                              <Card className="border-0 shadow-sm overflow-hidden h-100">
                                <Image 
                                  src={imgUrl} 
                                  alt={`${propertyData.title} - Image ${index + 1}`} 
                                  className="card-img-top"
                                  style={{ 
                                    height: index === 0 ? "400px" : "200px", 
                                    objectFit: "cover",
                                    width: "100%" 
                                  }}
                                />
                              </Card>
                            </Col>
                          );
                        })}
                      </Row>
                    </Col>
                  </Row>
                  
                  {/* Property Description */}
                  <Row className="mb-4">
                    <Col md={12}>
                      <h3 className="fs-4 text-success mb-3">Property Description</h3>
                      <p className="fs-6" style={{ whiteSpace: 'pre-line' }}>
                        {propertyData.description}
                      </p>
                    </Col>
                  </Row>
                  
                  {/* Two-column layout for Features and Location */}
                  <Row className="mb-4">
                    {/* Features Column */}
                    <Col md={6}>
                      <Card className="h-100 border-0 shadow-sm">
                        <Card.Body>
                          <h3 className="fs-4 text-success mb-3">Features</h3>
                          <ListGroup variant="flush">
                            {propertyData.features.map((feature, index) => (
                              <ListGroup.Item key={index} className="border-0 py-2">
                                <i className="bi bi-check-circle-fill text-success me-2"></i>
                                <span>{feature.replace(/^-\s*/, '')}</span>
                              </ListGroup.Item>
                            ))}
                          </ListGroup>
                        </Card.Body>
                      </Card>
                    </Col>
                    
                    {/* Location Column */}
                    <Col md={6}>
                      <Card className="h-100 border-0 shadow-sm">
                        <Card.Body>
                          <h3 className="fs-4 text-success mb-3">Location</h3>
                          <ListGroup variant="flush">
                            {propertyData.locationDetails.map((item, index) => (
                              <ListGroup.Item key={index} className="border-0 py-2">
                                <i className="bi bi-geo-alt-fill text-success me-2"></i>
                                <span>{item.replace(/^-\s*/, '')}</span>
                              </ListGroup.Item>
                            ))}
                          </ListGroup>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                  
                  {/* Contact Information */}
                  <Row className="mt-5 pt-4 border-top">
                    <Col md={12} className="text-center mb-2">
                      <h4 className="text-success mb-3">Contact Information</h4>
                    </Col>
                    <Col md={4} className="text-center">
                      <div className="d-inline-block text-start">
                        <p className="mb-0 fw-bold">{propertyData.contactInfo.name}</p>
                        <p className="text-muted mb-0">{propertyData.contactInfo.title}</p>
                      </div>
                    </Col>
                    <Col md={4} className="text-center">
                      <div className="d-inline-block text-start">
                        <p className="mb-0">
                          <i className="bi bi-telephone me-2 text-success"></i>
                          {propertyData.contactInfo.phone1}
                        </p>
                        <p className="mb-0">
                          <i className="bi bi-telephone me-2 text-success"></i>
                          {propertyData.contactInfo.phone2}
                        </p>
                        <p className="mb-0">
                          <i className="bi bi-envelope me-2 text-success"></i>
                          {propertyData.contactInfo.email}
                        </p>
                      </div>
                    </Col>
                    <Col md={4} className="text-center">
                      <div className="d-inline-block text-start">
                        <p className="mb-0">
                          <i className="bi bi-globe me-2 text-success"></i>
                          {propertyData.contactInfo.website}
                        </p>
                        <p className="mb-0">
                          <i className="bi bi-geo me-2 text-success"></i>
                          {propertyData.contactInfo.address}
                        </p>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </div>
          </>
        )}
        
        {!propertyData && !loading && (
          <Card className="text-center p-5 shadow-sm">
            <Card.Body>
              <i className="bi bi-house-door text-success fs-1 mb-3"></i>
              <Card.Title>Create a professional property exposé</Card.Title>
              <Card.Text className="text-muted">
                Either enter a property URL or use the manual input option above
              </Card.Text>
            </Card.Body>
          </Card>
        )}
      </Container>
    </div>
  );
};

export default PropertyToPDF;