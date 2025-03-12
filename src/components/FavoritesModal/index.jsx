import React, { useState } from "react";
import { FaFolderPlus, FaSearch, FaTimes } from "react-icons/fa";

const FavoritesModal = ({ show, handleClose }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFolder, setSelectedFolder] = useState(null);
  
  if (!show) return null;

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
          width: "90%",
          maxWidth: "550px",
          borderRadius: "4px",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
          padding: "20px"
        }}
      >
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="m-0" style={{ color: "#444", fontWeight: "500" }}>Save to favorites</h4>
          <button 
            onClick={handleClose} 
            className="btn border-0" 
            style={{ color: "#666", fontSize: "1.5rem" }}
          >
            <FaTimes />
          </button>
        </div>
        
        <div className="position-relative mb-4">
          <FaSearch 
            style={{ 
              position: "absolute", 
              left: "12px", 
              top: "12px", 
              color: "#aaa",
              zIndex: 1
            }} 
          />
          <input 
            type="text" 
            className="form-control" 
            placeholder="Search folder" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ 
              paddingLeft: "40px", 
              height: "45px", 
              borderColor: "#ddd" 
            }} 
          />
        </div>
        
        <div className="folder-list mb-4" style={{ maxHeight: "250px", overflowY: "auto" }}>
          <div className="form-check d-flex align-items-center p-2">
            <input 
              className="form-check-input" 
              type="checkbox" 
              id="defaultFolder" 
              checked={selectedFolder === "default"}
              onChange={() => setSelectedFolder("default")}
              style={{ 
                marginRight: "10px",
                cursor: "pointer" 
              }}
            />
            <label 
              className="form-check-label w-100" 
              htmlFor="defaultFolder"
              style={{ cursor: "pointer" }}
            >
              Default
            </label>
          </div>
        </div>
        
        <div className="d-flex justify-content-between align-items-center">
          <button 
            className="btn btn-outline-success d-flex align-items-center gap-2"
            style={{ 
              borderColor: "#4caf50", 
              color: "#4caf50", 
              padding: "8px 16px",
              borderRadius: "4px"
            }}
          >
            <FaFolderPlus />
            <span>New folder</span>
          </button>
          
          <button 
            className="btn btn-success" 
            onClick={handleClose}
            style={{ 
              backgroundColor: "#4caf50", 
              border: "none", 
              padding: "8px 24px",
              borderRadius: "4px"
            }}
          >
            KEEP
          </button>
        </div>
      </div>
    </div>
  );
};

export default FavoritesModal;