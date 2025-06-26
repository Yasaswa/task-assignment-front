import React from 'react'
import { Image, Container, Row, Col } from 'react-bootstrap';
import errorGear from 'assets/images/Error_500_Gear.png';
import { useNavigate, useLocation } from 'react-router-dom';

function Error_500() {
  const imgStyle = {
    float: 'none',
    borderRadius: '12px',
    position: 'relative',
    top: '75px',
    left: '255px',
  }

  const h1 = {
    fontSize: '30px',
    fontFamily: 'Museo500',
    color: '#000000',
  }
  const h2 = {
    fontSize: '18px',
    lineHeight: '18px',
    fontFamily: 'Open sans',
    fontWeight: '600',
    marginTop: '28px',
    marginBottom: '12px'
  }
  const p = {
    fontFamily: 'OpenSans - Regular',
    fontSize: '14px',
    color: '#000000',
    lineHeight: '20px'
  }

  const button = {
    padding: "0.75rem 1.5rem",
    
    border: "none",
    borderRadius: "5px",
    fontSize: "1rem",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
    marginTop: "1rem",
  }

  const handleRetry = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  const navigateToHome = () => {
      navigate('/');
  };

  const navigate = useNavigate();

  return (
    <>
      <img src={errorGear} alt="erp icon" style={imgStyle} className="image" />

      <div className='msgpanel'>
        <h1 style={h1}>Internal Server Error!</h1>
        <h2 style={h2}>
          What could have caused this?
        </h2>
        <p style={p}>
          We apologize for the inconvenience,

        </p>
        <p style={p}>
          but our server encountered an unexpected issue that prevented it from completing your request.
        </p>
        <h2 style={h2}>
          What you can do?
        </h2>
        <p style={p}>
          Please try re-logging into your account and navigating to the desired page again. <br />This may resolve the issue. If the problem persists, please contact our support team.
        </p>
        <p style={p}>
          Feel free to explore other areas of the application while our team works to fix this issue.<br /> We appreciate your patience.        </p>
          <button className={`erp-gb-button`}  style={button}  onClick={handleRetry} > Go Back </button> &nbsp;
          <button className={`erp-gb-button`}  style={button}  onClick={navigateToHome} > Home </button>
      </div>

    </>
  )
}

export default Error_500
