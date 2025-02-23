import React, { useEffect, useState } from "react";
import "./companydata.css";
import logoPlaceholder from "../../assests/img/logo.png";

const CompanyData = () => {
  const [activeTab, setActiveTab] = useState("companyData");
  const [companyData, setCompanyData] = useState({
    companyname: "",
    phone: "",
    email: "",
    address: "",
    contactname: "",
    phoneContact: "",
    logoPath: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://homevocation-001-site4.atempurl.com/api/EmpresaApi/"
        );
        if (!response.ok) throw new Error("Failed to fetch data");
        const data = await response.json();
        setCompanyData(data); // Prefill form with API data
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle form field changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCompanyData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log("Updated Company Data:", companyData);
    alert("Company data saved (simulated).");
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="company-data-container">
      <h3 className="company-data-header">Company Data</h3>
      <ul className="company-data-nav-tabs">
        <li className="company-data-nav-item">
          <button
            className={`company-data-nav-link ${
              activeTab === "companyData" ? "active" : ""
            }`}
            onClick={() => setActiveTab("companyData")}
          >
            COMPANY DATA
          </button>
        </li>
        <li className="company-data-nav-item">
          <button
            className={`company-data-nav-link ${
              activeTab === "extraInfoReport" ? "active" : ""
            }`}
            onClick={() => setActiveTab("extraInfoReport")}
          >
            EXTRA INFO REPORT
          </button>
        </li>
      </ul>
      <div className="company-data-content">
        {activeTab === "companyData" && (
          <form onSubmit={handleFormSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="companyname"
                  value={companyData.companyname}
                  onChange={handleInputChange}
                  placeholder="Enter company name"
                />
              </div>
              <div className="form-group">
                <label>Contact Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  value={companyData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter phone number"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Contact Email</label>
                <input
                  type="email"
                  name="email"
                  value={companyData.email}
                  onChange={handleInputChange}
                  placeholder="Enter email"
                />
              </div>
              <div className="form-group">
                <label>Contact Name</label>
                <input
                  type="text"
                  name="contactname"
                  value={companyData.contactname}
                  onChange={handleInputChange}
                  placeholder="Enter contact name"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group full-width">
                <label>Address</label>
                <input
                  type="text"
                  name="address"
                  value={companyData.address}
                  onChange={handleInputChange}
                  placeholder="Enter address"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <div className="logo-upload">
                  <img
                    src={companyData.logoPath || logoPlaceholder}
                    alt="Company Logo"
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "contain",
                    }}
                  />
                  <p>Contact us to change the logo</p>
                </div>
              </div>
              <div className="form-group">
                <label>Corporate Color</label>
                <input type="color" />
              </div>
            </div>
            <button type="submit" className="company-data-button">
              SAVE
            </button>
          </form>
        )}
        {activeTab === "extraInfoReport" && (
          <div>
            <h3>Extra Info Report</h3>
            <p>This section can be used for additional reports or data.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyData;
