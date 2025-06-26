import React from 'react';
import { Image, Container, Row, Col } from 'react-bootstrap';
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import connectionError from "assets/images/networkError.jpg";
import { useNavigate, useLocation } from 'react-router-dom';

function Netcheck() {
    const styles = {
        layout: {
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          backgroundColor: "#f8f9fa",
          margin: 0,
        },
        msgPanel: {
          textAlign: "center",
          padding: "2rem",
          borderRadius: "10px",
          backgroundColor: "#ffffff",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
          maxWidth: "600px",
          width: "90%",
        },
        image: {
          width: "400px",
          height: "300px",
          marginBottom: "1rem",
        },
        h0: {
          fontSize: "1.5rem",
          fontWeight: "bold",
          color: "#dc3545",
          margin: "1rem 0",
        },
        h2: {
          fontSize: "1.25rem",
          fontWeight: 600,
          color: "#343a40",
          marginBottom: "1rem",
        },
        ul: {
          listStyleType: "disc",
          paddingLeft: "1.5rem",
          textAlign: "left",
          margin: "1rem 0",
          color: "#495057",
          fontSize: "1rem",
        },
        li: {
          marginBottom: "0.5rem",
          lineHeight: 1.5,
        },
        button: {
          padding: "0.75rem 1.5rem",
          
          border: "none",
          borderRadius: "5px",
          fontSize: "1rem",
          fontWeight: "bold",
          cursor: "pointer",
          transition: "background-color 0.3s ease",
          marginTop: "1rem",
        },
        buttonHover: {
          backgroundColor: "#0056b3",
        },
      };
    
    const handleRetry = () => {
        navigate(`/login`); 
    };
    const navigate = useNavigate();

    return (
        <DashboardLayout>
            <div style={styles.layout}>
                <div style={styles.msgPanel}>
                    <div>
                        <img src={connectionError} alt="Network error icon" style={styles.image} />
                    </div>
                    <h0 style={styles.h0}>No Internet Connection Available</h0>
                    <h2 style={styles.h2}>What could have caused this?</h2>
                    <ul style={styles.ul}>
                        <li style={styles.li}>Your device might be offline</li>
                        <li style={styles.li}>Our server may be temporarily down</li>
                        <li style={styles.li}>A temporary network glitch</li>
                    </ul>
                    <button className={`erp-gb-button`}
                        style={styles.button}
                        onClick={handleRetry}
                    >
                        Retry
                    </button>
                </div>
            </div>
        </DashboardLayout>
    );
}

export default Netcheck;
