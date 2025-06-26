import { useRef } from "react";
import html2canvas from "html2canvas";
import { Modal, Button } from "react-bootstrap";
import DakshabhiLogo from "assets/images/DakshabhiLogo.png";
import bdayCrackers from "assets/images/bdayCrackers.png";
import cakeImage from "assets/images/cakeImage.png";
import bdayBackGround from "assets/images/bdayBackGround.jpg";


function BirthdayCardModal({
  bdayEmployee,
  handleCloseBdayModal,
  isModalOpen,
}) {
  const { employee_name, designation_name, cell_no1, company_name } =
    bdayEmployee;
  const cardRef = useRef(); 
  const downloadCard = () => {
    html2canvas(cardRef.current, { useCORS: true }).then((canvas) => {
      const link = document.createElement("a");
      link.download = `${employee_name.toLowerCase()}_birthday_card.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    });
    handleCloseBdayModal();
  };

  const formatTodayDateToDDMMM = () => {
    const months = [
      "JAN",
      "FEB",
      "MAR",
      "APR",
      "MAY",
      "JUN",
      "JUL",
      "AUG",
      "SEP",
      "OCT",
      "NOV",
      "DEC",
    ];

    const today = new Date();
    const day = today.getDate().toString().padStart(2, "0"); // Ensure 2 digits for the day
    const month = months[today.getMonth()]; // Get the month's short name

    return `${day} ${month}`;
  };

  const birthdayDate = formatTodayDateToDDMMM();

  const toTitleCase = (str) =>
    str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Modal
          show={isModalOpen}
          onHide={handleCloseBdayModal}
          keyboard={false}
          centered
        >
          <span
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              zIndex: 1050,
              borderRadius: "0px",
            }}
          >
            <button
              type="button"
              className="erp-modal-close btn-close"
              aria-label="Close"
              onClick={handleCloseBdayModal}
            ></button>
          </span>
          <Modal.Body
            ref={cardRef}
            style={{ padding: "10px 10px 10px 10px" }}
            className="erp_city_modal_body"
          >
           

            <div style={cardContainer}>
              <div  style={gradientBackground}>
                <div  style={compLogo}></div>
                <div  style={crackers}></div>
                <div style={dateStyle}>{birthdayDate}</div>
                <h1  style={birthdayTitle}>HAPPY BIRTHDAY!</h1>
                <h1></h1>
                <h2  style={empName} >{employee_name}</h2>
                <h1></h1>
                <h4  style={compName} >{company_name}</h4>
                <h1></h1>
                <h4  style={compName}>{toTitleCase(designation_name)}</h4>
                {cell_no1 !== null && cell_no1 !== "" && ( <h5  style={mob}>Mob: {cell_no1}</h5>)}
                <div  style={decorations} >
                  <div  style={balloons}></div>
                  <div  style={cakeIcon}></div>
                  <div  style={confetti}></div>
                </div>
                <div  style={messageContainer}>
                  <p  style={birthdayMessage}>  Wishing you a day filled with happiness and a year filled with joy!  </p>
                </div>
              </div>
            </div>
          </Modal.Body>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "2rem",
              paddingBottom: "10px",
              height: "60px",
            }}
            className=""
          >
            <Button
              style={buttonStyle}
              variant="success"
              className="erp-gb-button"
              onClick={handleCloseBdayModal}
            >
              Cancel
            </Button>
            <Button
              style={buttonStyle}
              variant="success"
              className="erp-gb-button"
              onClick={downloadCard}
            >
              Download
            </Button>
          </div>
        </Modal>
      </div>
    </>
  );
}

// Styling

// const logoStyle = {
//   position: "absolute",
//   top: "10px",
//   left: "20px",
//   height: "40px",
// };

const dateStyle = {
  position: "absolute",
  top: "10px",
  right: "30px",
  fontSize: "16px",
  fontWeight: "bold",
  color: "rgb(195 52 52)", // Blue shade for the date
};


const buttonStyle = {
  marginTop: "20px",
  padding: "10px 10px",
  border: "none",
  cursor: "pointer",
  transition: "all 0.3s ease",
  width: "70px ",
};

buttonStyle[":hover"] = {
  backgroundColor: "#002244", // Darker blue for hover
  // boxShadow: "0 6px 12px rgba(0, 0, 0, 0.3)", // Commented out shadow for hover
};

const cardContainer = {
    width: "450px",
    height: "600px",
    margin: "auto",
   // borderRadius: "20px",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
    overflow: "hidden",
    textAlign: "center",
    fontFamily: "'Arial', sans-serif",
    backgroundColor: "#f8f8f8",
  };
  
  const compLogo = {
    zIndex: 1,
    position: "absolute",
    backgroundImage: `url(${DakshabhiLogo})` , /* Add your cake icon */
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    width: "140px",
    position: "absolute",
    top: "7px",
    left: "9px",
    height: "40px",
  };
  
  const gradientBackground = {
    backgroundImage: `url(${bdayBackGround})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    height: "100%",
    color: "white",
    padding: "10px",
    position: "relative",
  };
  
  const crackers = {
    top: "50px",
    left: "315px",
    backgroundImage: `url(${bdayCrackers})` ,
    backgroundRepeat: "no-repeat",
    position: "relative",
    width: "90px",
    height: "100px",
    backgroundSize: "cover",
  };
  
  const birthdayTitle = {
    marginTop: "-6px",
    marginBottom: "0px",
    fontSize: "3rem",
    fontWeight: "bold",
    color: " rgb(137 15 104)", // Transparent for gradient
    // background: "linear-gradient(45deg, #eb7a9e, #340653)", // Gradient effect
    // WebkitBackgroundClip: "text", // Clip background to text
    // backgroundClip: "text", // Ensure text-only clip for non-WebKit browsers
    // WebkitTextFillColor: "transparent", // Transparent fill for WebKit browsers
    textAlign: "center",
    letterSpacing: "1px",
  };
  
  
  const empName = {
    color: "rgb(163 41 62)",
    fontSize: "1.2rem",
    fontWeight: "bold",
    fontFamily: "'Dancing Script', cursive",  // A cursive font for a more personalized look
    textShadow: "1px 1px 8px rgba(43, 6, 123, 0.2)",
    letterSpacing: "0.5px",
    textTransform: "capitalize",
    lineHeight: "1.5",
  };
  
  
  const compName = {
    color: "#18020b",
    fontSize: "1.1rem",
  };
  
  const mob = {
    color: "#18020b",
    fontSize: "1.1rem",
  };
  
  const messageContainer = {
    marginTop: "20px",
    fontSize: "1rem",
    fontWeight: "400",
  };
  
  const birthdayMessage = {
    fontWeight: "bold",
    fontSize: "1.1rem",
    color: "rgb(137 15 104)",
    marginTop: "173px",
    background: "rgba(212, 193, 229, 0.2)",
    padding: "10px",
    borderRadius: "10px",
    textShadow: "1px 1px 4px rgba(20, 13, 26, 0.1)",
  };
  
  const decorations = {
    position: "absolute",
    bottom: "20px",
    width: "100%",
  };
  
  const balloons = {
    backgroundImage: "url('https://example.com/balloons.png')", /* Add your balloons icon */
    height: "50px",
    width: "50px",
    margin: "auto",
  };
  
  const cakeIcon = {
    position: "absolute",
    bottom: "163%", /* Adjust the vertical position */
    left: "50%", /* Center the cake horizontally */
    transform: "translateX(-50%)", /* Center the image exactly */
    zIndex: 1,
    backgroundImage: `url(${cakeImage})`, /* Add your cake icon */
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    height: "120px",
    width: "120px",
  };
  
  const confetti = {
    position: "absolute",
    backgroundImage: "url('./crackers-image.avif')", /* Add your confetti icon */
    backgroundRepeat: "no-repeat",
    margin: "auto",
    backgroundSize: "cover",
  };
  

export default BirthdayCardModal;
