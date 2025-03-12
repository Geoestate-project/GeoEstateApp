import React, { useState } from "react";
import { FaTimes, FaBold, FaItalic, FaUnderline, FaAlignLeft, FaAlignCenter, FaAlignRight, FaUpload } from "react-icons/fa";
import icon from "../../assests/img/icon.png"
const GenerateRecordModal = ({ show, handleClose }) => {
  const [qualification, setQualification] = useState("");
  const [clientFirstName, setClientFirstName] = useState("");
  const [clientLastName, setClientLastName] = useState("");
  const [agentFirstName, setAgentFirstName] = useState("");
  const [agentLastName, setAgentLastName] = useState("");
  const [language, setLanguage] = useState("Spanish");
  const [comments, setComments] = useState("");
  const [toggleStates, setToggleStates] = useState({
    agentData: true,
    price: true,
    address: true,
    market: true,
    characteristics: true,
    interior: true,
    map: true,
    companyInfo: true,
    mail: true
  });
  const [agentName, setAgentName] = useState("");
  const [agentMobile, setAgentMobile] = useState("");
  const [agentPosition, setAgentPosition] = useState("");
  const [agencyName, setAgencyName] = useState("");
  const [corporateColor, setCorporateColor] = useState("");

  if (!show) return null;

  const handleToggle = (key) => {
    setToggleStates(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div 
      className="modal-backdrop" 
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1050
      }}
    >
      <div 
        className="modal-content bg-white" 
        style={{
          width: "95%",
          maxWidth: "550px",
          maxHeight: "90vh",
          overflow: "auto",
          borderRadius: "4px",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
          padding: "20px"
        }}
      >
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h4 className="m-0" style={{ color: "#444", fontWeight: "500" }}>Generate record</h4>
            <p className="m-0 text-muted">Center - C. Cervantes</p>
          </div>
          <button 
            onClick={handleClose} 
            className="btn border-0" 
            style={{ color: "#666", fontSize: "1.5rem" }}
          >
            <FaTimes />
          </button>
        </div>
        
        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">Qualification</label>
            <input 
              type="text" 
              className="form-control"
              value={qualification}
              onChange={(e) => setQualification(e.target.value)}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Language</label>
            <div className="dropdown">
              <button 
                className="form-control text-start dropdown-toggle" 
                type="button" 
                data-bs-toggle="dropdown" 
                aria-expanded="false"
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
              >
                {language}
                <span className="caret"></span>
              </button>
              <ul className="dropdown-menu w-100">
                <li><a className="dropdown-item" onClick={() => setLanguage("Spanish")}>Spanish</a></li>
                <li><a className="dropdown-item" onClick={() => setLanguage("English")}>English</a></li>
                <li><a className="dropdown-item" onClick={() => setLanguage("French")}>French</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">Client first name</label>
            <input 
              type="text" 
              className="form-control"
              value={clientFirstName}
              onChange={(e) => setClientFirstName(e.target.value)}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Client last name</label>
            <input 
              type="text" 
              className="form-control"
              value={clientLastName}
              onChange={(e) => setClientLastName(e.target.value)}
            />
          </div>
        </div>
        
        <div className="mb-4">
          <label className="form-label">Data to be displayed on the list</label>
          <div className="border rounded p-2">
            {[
              { key: "agentData", label: "Agent data" },
              { key: "price", label: "Price" },
              { key: "address", label: "Address" },
              { key: "market", label: "Time on the housing market" },
              { key: "characteristics", label: "Characteristics of the area" },
              { key: "interior", label: "Interior" },
              { key: "map", label: "Map" },
              { key: "companyInfo", label: "Company information" }
            ].map((item) => (
              <div key={item.key} className="d-flex justify-content-between align-items-center py-2 border-bottom">
                <span>{item.label}</span>
                <div 
                  className="toggle-switch"
                  style={{ position: "relative", display: "inline-block", width: "40px", height: "20px" }}
                >
                  <input
                    type="checkbox"
                    checked={toggleStates[item.key]}
                    onChange={() => handleToggle(item.key)}
                    style={{ opacity: 0, width: 0, height: 0 }}
                  />
                  <span
                    style={{
                      position: "absolute",
                      cursor: "pointer",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: toggleStates[item.key] ? "#4caf50" : "#ccc",
                      transition: "0.4s",
                      borderRadius: "20px"
                    }}
                  >
                    <span
                      style={{
                        position: "absolute",
                        height: "16px",
                        width: "16px",
                        left: toggleStates[item.key] ? "22px" : "2px",
                        bottom: "2px",
                        backgroundColor: "white",
                        transition: "0.4s",
                        borderRadius: "50%"
                      }}
                    ></span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mb-4">
          <label className="form-label">Add comments (0 / 2000)</label>
          <div className="border rounded">
            <div className="p-1 border-bottom d-flex">
              <button className="btn btn-sm">Normal</button>
              <button className="btn btn-sm"><FaBold /></button>
              <button className="btn btn-sm"><FaItalic /></button>
              <button className="btn btn-sm"><FaUnderline /></button>
              <button className="btn btn-sm"><FaAlignLeft /></button>
              <button className="btn btn-sm"><FaAlignCenter /></button>
              <button className="btn btn-sm"><FaAlignRight /></button>
            </div>
            <textarea 
              className="form-control border-0" 
              rows="5" 
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              style={{ resize: "none" }}
            ></textarea>
          </div>
          <div className="form-check mt-1">
            <input className="form-check-input" type="checkbox" id="saveAsTemplate" />
            <label className="form-check-label" htmlFor="saveAsTemplate">Save as template</label>
          </div>
        </div>
        
        <div className="mb-4">
          <label className="form-label">Add a custom cover</label>
          <div 
            className="border rounded p-3 text-center"
            style={{ backgroundColor: "#f9f9f9" }}
          >
            <p className="text-muted mb-2">Drag and drop files here<br />or</p>
            <button className="btn " style={{  backgroundColor: "#4caf50", 
}}> BROWSE FILE</button>
          </div>
          <div className="form-check mt-1">
            <input className="form-check-input" type="checkbox" id="saveAsCoverTemplate" />
            <label className="form-check-label" htmlFor="saveAsCoverTemplate">Save as template</label>
          </div>
        </div>
        
        <div className="mb-4">
          <label className="form-label">Add pages</label>
          <div 
            className="border rounded p-3 text-center"
            style={{ backgroundColor: "#f9f9f9" }}
          >
            <p className="text-muted mb-2">Drag and drop files here<br />or</p>
            <button className="btn " style={{  backgroundColor: "#4caf50", 
}}> BROWSE FILE</button>
          </div>
          <div className="form-check mt-1">
            <input className="form-check-input" type="checkbox" id="saveAsPagesTemplate" />
            <label className="form-check-label" htmlFor="saveAsPagesTemplate">Save as template</label>
          </div>
        </div>
        
        <div className="mb-4">
          <h5>Contact</h5>
          <p className="text-muted">Edit your report and customize it completely</p>
          
          <div className="row mb-3">
            <div className="col-md-3">
              <div className="text-center">
                <div 
                  style={{ 
                    width: "80px", 
                    height: "80px", 
                    borderRadius: "50%", 
                    backgroundColor: "#f0f0f0", 
                    margin: "0 auto",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <img src={icon} alt="Profile photo" style={{ borderRadius: "50%",width:"77px" }} />
                </div>
                <button className="btn btn-link text-muted p-0 mt-1">Click here to drop image</button>
              </div>
            </div>
            <div className="col-md-9">
              <div className="mb-3">
                <label className="form-label">Name of agent</label>
                <input 
                  type="text" 
                  className="form-control"
                  value={agentName}
                  onChange={(e) => setAgentName(e.target.value)}
                  placeholder="Alex"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Agent last name</label>
                <input 
                  type="text" 
                  className="form-control"
                  value={agentLastName}
                  onChange={(e) => setAgentLastName(e.target.value)}
                  placeholder="Enter..."
                />
              </div>
            </div>
          </div>
          
          <div className="mb-3">
            <label className="form-label">Mobile</label>
            <input 
              type="text" 
              className="form-control"
              value={agentMobile}
              onChange={(e) => setAgentMobile(e.target.value)}
              placeholder="+34666777766"
            />
          </div>
          
          <div className="mb-3">
            <label className="form-label">Position in the agency</label>
            <input 
              type="text" 
              className="form-control"
              value={agentPosition}
              onChange={(e) => setAgentPosition(e.target.value)}
              placeholder="Finca..."
            />
          </div>
          
          <div className="row mb-3">
            <div className="col-md-3">
              <div className="text-center">
                <div 
                  style={{ 
                    width: "80px", 
                    height: "80px", 
                    borderRadius: "50%", 
                    backgroundColor: "#f0f0f0", 
                    margin: "0 auto",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <img src={icon} alt="Company logo" style={{ borderRadius: "50%",width:"77px" }} />
                </div>
                <button className="btn btn-link text-muted p-0 mt-1">Click here to drop image</button>
              </div>
            </div>
            <div className="col-md-9">
              <div className="mb-3">
                <label className="form-label">Name of the agency</label>
                <input 
                  type="text" 
                  className="form-control"
                  value={agencyName}
                  onChange={(e) => setAgencyName(e.target.value)}
                  placeholder="Real Estates"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Corporate color</label>
                <input 
                  type="text" 
                  className="form-control"
                  value={corporateColor}
                  onChange={(e) => setCorporateColor(e.target.value)}
                />
              </div>
            </div>
          </div>
          
          <div 
            className="btn  text-white w-100 mb-3"
            style={{ 
                backgroundColor: "#4caf50", 
                border: "none", 
              borderRadius: "4px",
              padding: "10px",
              fontSize: "16px"
            }}
          >
            Choose the corporate value you wish to display in the report
          </div>
          
          <div className="d-flex align-items-center">
            <div 
              className="toggle-switch me-2"
              style={{ position: "relative", display: "inline-block", width: "40px", height: "20px" }}
            >
              <input
                type="checkbox"
                checked={toggleStates.mail}
                onChange={() => handleToggle("mail")}
                style={{ opacity: 0, width: 0, height: 0 }}
              />
              <span
                style={{
                  position: "absolute",
                  cursor: "pointer",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: toggleStates.mail ? "#4caf50" : "#ccc",
                  transition: "0.4s",
                  borderRadius: "20px"
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    height: "16px",
                    width: "16px",
                    left: toggleStates.mail ? "22px" : "2px",
                    bottom: "2px",
                    backgroundColor: "white",
                    transition: "0.4s",
                    borderRadius: "50%"
                  }}
                ></span>
              </span>
            </div>
            <span>Mail</span>
          </div>
        </div>
        
        <div className="text-end mt-4">
          <button 
            className="btn  px-4" 
            style={{               backgroundColor: "#4caf50", 
                 border: "none" }}
            onClick={handleClose}
          >
            PUBLISH
          </button>
        </div>
      </div>
    </div>
  );
};

export default GenerateRecordModal;