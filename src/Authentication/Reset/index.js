/**
=========================================================
* Material Dashboard 2 PRO React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-pro-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// Material Dashboard 2 PRO React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import FrmValidations from "FrmGeneric/FrmValidations";

import $ from "jquery";

import MDButton from "components/MDButton";
//import MBHeader from "components/MBHeader";

// Authentication layout components
import IllustrationLayout from "layouts/authentication/components/IllustrationLayout";

// Image
import bgImage from "assets/images/illustrations/illustration-reset.jpg";
import { useEffect, useState, useRef} from "react";
import { Navigate } from "react-router-dom";
import Card from "@mui/material/Card";
import { CircularProgress } from "@material-ui/core";
import { useNavigate } from "react-router-dom";
import { colors } from "@mui/material";

function Reset() {
  const validate = useRef();
  const [inputCred, setInputCred] = useState("");
  const [otp, setOTP] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [Isotpsend, SetIsOTPSend] = useState(false);
  const [otptimer, setOTPtimer] = useState(0);
 
  const [verified, SetVerified] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");
  const [IsResetDone, setIsResetDone] = useState("");

  const [errorMeassage,  setErrorMeassage] = useState("");
  const [successMeassage, setSuccessMeassage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let interval;
    if (otptimer > 0) {
      interval = setInterval(() => {
        setOTPtimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [otptimer]);

  const minutes = Math.floor(otptimer / 60);
  const seconds = otptimer % 60;

  const generateOTP = async () => {
    setErrorMeassage("");
    setSuccessMeassage("");
    setIsLoading(true);
    try {
      debugger
      setOTPtimer(0);
      setOTP("");
      SetVerified(false);
      let checkIsValidate = true;
      if(!Isotpsend){
       checkIsValidate = await validate.current.validateForm("resetFormId");
      }

      const inputCredentials =  {"inputCred": inputCred} ;
      const token = localStorage.getItem("authToken"); 
      console.log("token" + token);
      if (inputCred !== null && checkIsValidate === true) {
        const requestOptions = {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(inputCredentials),
        };
        const checkCredential = await fetch(`${process.env.REACT_APP_BASE_URL}/api/auth/reset/checkCredential`,requestOptions);
        const resp = await checkCredential.json();

        if (resp.status === "success") {
          SetIsOTPSend(true);
          setEmail(resp.email);
          setOTPtimer(120);
          setSuccessMeassage(resp.message);
          // console.log(resp);
        } else {
          setEmail("");
          setOTPtimer(0);
          console.log("Unauthorized access, check your credentials.");
        }
      } else {
        setEmail("");
        setOTPtimer(0);
        console.log("Unauthorized access, check your credentials.");
      }
    } catch (error) {
      console.log("error: ", error);
      navigate("/Error");
    } finally {
      setIsLoading(false);
    }
    setIsLoading(false);
  };

  const VerifyOTP = async () => {
    debugger
    setIsLoading(true);
    setErrorMeassage("");
    setSuccessMeassage("");
    const checkIsValidate = await validate.current.validateForm("resetFormId");
    if(checkIsValidate) {
      try {
        const token = localStorage.getItem("authToken");
        const requestOptions = {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ "otp" :  otp , "emailId" : email }),
        };
        
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/auth/reset/verifyOtp`, requestOptions);
        const result = await response.json();
  
        if (result.status === "success") {
          SetVerified(true);
          console.log("OTP verified successfully.");
        } else {
          setErrorMeassage("Please enter Correct OTP");
          console.log("OTP verified fails.");
          SetVerified(false);
        }
      } catch (error) {
        console.log("error: ", error);
      } finally {
        setIsLoading(false);
      }
    }
    setIsLoading(false);
  };

  const CheckPassword = async () => {
    debugger
    setErrorMeassage("");
    setSuccessMeassage("");
    const checkIsValidate = await validate.current.validateForm("resetFormId");
    if(checkIsValidate){
          if(password === "" || password === null){
            setErrorMeassage("Please enter Password");
          }else if(confirmpassword === "" || confirmpassword === null){
            setErrorMeassage("Please enter Confirm Reset Password");
          }else if(password !== confirmpassword){
            setErrorMeassage("Password not matched");
            //$("#errorConfirmPassword").show();
          }else if (!/^[^\s]{4,}$/.test(password)) {
            setErrorMeassage("Password must be at least 4 characters long.");
          } else {
            resetAPI();
          }
    }
  }

  const resetAPI = async () => {
    setErrorMeassage("");
    setSuccessMeassage("");
    setIsLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      const requestOptions = {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ "password" :  password, "confirmpassword" : confirmpassword, "employee_code" : inputCred }),
      };
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/auth/reset/PasswordReset`, requestOptions);
      const resp = await response.json();
      navigate(
        (response.status === 200 && resp.status === "success")
          ? (alert("Password changed successfully."), setIsResetDone(true), "/login")
          : (alert("Error...Please try again."), setIsResetDone(false), "/Authentication/Reset")
      );

    } catch (error) {
      console.log("error: ", error);
    }finally{
      setIsLoading(false);
    }
  }

  const validateFields = () => {
    validate.current.validateFieldsOnChange("resetFormId")
  };

  return (
    <>
      <FrmValidations ref={validate} />
      {isLoading ? (
        <div className="spinner-overlay">
          <div className="spinner-container">
            <CircularProgress color="primary" />
            <span id="spinner_text" className="text-dark">Loading...{" "}</span>
          </div>
        </div>
      ) : null}
      <MDBox sx={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        height: "100vh", 
        width: "100vw", 
        backgroundColor: "#782156",
      }}>
      <Card  sx={{ 
          p: 3, 
          maxWidth: 400, 
          width: "100%",  
          textAlign: "center",
        }}>
        <MDTypography varient = "h4" fontWeight = "medium" gutterBottom sx={{ mb: 2 }}>Reset Password</MDTypography>
        <MDBox component="form" role="form">
          <form id="resetFormId">
            <MDBox mb={2}>
              <MDInput type="text" label="Employee Code" fullWidth id="emailId" value={inputCred} onChange={(e) => {setInputCred(e.target.value); validateFields(); }} />
              <MDTypography variant="button" id="error_emailId" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}></MDTypography>
            </MDBox>
            {verified === false ? (
                Isotpsend === false ) ? (
                  <MDBox mt={2} mb={0}>
                    <MDButton variant="gradient" color="info" size="large" fullWidth onClick={generateOTP} onMouseOver={(e) => {
                          e.target.style.backgroundColor = "#d5278f";
                        }}
                        onMouseOut={(e) => {
                          e.target.style.backgroundColor = "#831657";
                        }}
                        onFocus={(e) => {
                          e.target.style.backgroundColor = "#d5278f";
                        }}
                        onBlur={(e) => {
                          e.target.style.backgroundColor = "";
                        }}>Sent</MDButton>
                  </MDBox>
                ) : (
                  <>
                    <MDBox mb={2}>
                      <MDInput type="text" label="Enter OTP" fullWidth id="otp" value={otp} className="optional" onChange={(e) => {setOTP(e.target.value);validateFields();}} optional="optional" />
                      <MDTypography variant="button" id="error_otp" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}></MDTypography> 
                      
                    </MDBox>
                    
                    <MDBox mt={2} mb={0} hidden={otptimer != 0}>
                      <MDButton variant="gradient" color="info" size="large" fullWidth onClick={generateOTP} onMouseOver={(e) => {
                          e.target.style.backgroundColor = "#d5278f";
                        }}
                        onMouseOut={(e) => {
                          e.target.style.backgroundColor = "#831657";
                        }}
                        onFocus={(e) => {
                          e.target.style.backgroundColor = "#d5278f";
                        }}
                        onBlur={(e) => {
                          e.target.style.backgroundColor = "";
                        }}>Resend</MDButton>
                    </MDBox>
                    <MDBox mt={2} mb={0}>
                      <MDButton variant="gradient" color="info" size="large" fullWidth onClick={VerifyOTP} onMouseOver={(e) => {
                          e.target.style.backgroundColor = "#d5278f";
                        }}
                        onMouseOut={(e) => {
                          e.target.style.backgroundColor = "#831657";
                        }}
                        onFocus={(e) => {
                          e.target.style.backgroundColor = "#d5278f";
                        }}
                        onBlur={(e) => {
                          e.target.style.backgroundColor = "";
                        }}>Verify</MDButton>
                    </MDBox>
                  </>
                ) : ( 

                  <>
                    <MDBox mb={2}>
                      <MDInput type="password" label="Enter New Password" fullWidth id="password" value={password} onChange={(e) => {setPassword(e.target.value); validateFields();}} />
                      <MDTypography variant="button" id="error_password" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}/>
                    </MDBox>
                    <MDBox mb={2}>
                      <MDInput type="password" label="Confirm Password" fullWidth id="confirmpassword" value={confirmpassword} onChange={(e) => {setConfirmpassword(e.target.value); validateFields();}} />
                      <MDTypography variant="button" id="error_confirmpassword" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }} />
                    </MDBox>
                    <MDBox mt={2} mb={0}>
                      <MDButton variant="gradient" color="info" size="large" fullWidth onClick={CheckPassword} onMouseOver={(e) => {
                          e.target.style.backgroundColor = "#d5278f";
                        }}
                        onMouseOut={(e) => {
                          e.target.style.backgroundColor = "#831657";
                        }}
                        onFocus={(e) => {
                          e.target.style.backgroundColor = "#d5278f";
                        }}
                        onBlur={(e) => {
                          e.target.style.backgroundColor = "";
                        }}>Confirm</MDButton>
                      {/* <MDTypography variant="button" id="errorConfirmPassword" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>Password not matched, Enter correct pasword</MDTypography> */}
                    </MDBox>
                  </>
                )}
  
            <MDBox mt={2} mb={0}>
              <MDButton variant="gradient" color="info" size="large" fullWidth onClick={() =>  navigate("/login")} onMouseOver={(e) => {
                          e.target.style.backgroundColor = "#d5278f";
                        }}
                        onMouseOut={(e) => {
                          e.target.style.backgroundColor = "#831657";
                        }}
                        onFocus={(e) => {
                          e.target.style.backgroundColor = "#d5278f";
                        }}
                        onBlur={(e) => {
                          e.target.style.backgroundColor = "";
                        }}>Back</MDButton>
               <MDBox>
                  <MDTypography variant="button" id="error_message" className="erp_validation" fontWeight="regular" color="error">{errorMeassage}</MDTypography>
                </MDBox>
                <MDBox>
                  <MDTypography variant="button" id="error_message" className="erp_validation" fontWeight="regular" color="success">{successMeassage}</MDTypography>
              </MDBox>
              <MDBox>
                <span size="10px" hidden={!Isotpsend || otptimer <= 0 || verified == true}>{minutes.toString().padStart(2, "0")}:{seconds.toString().padStart(2, "0")}</span>
              </MDBox>
            </MDBox>
          </form>
        </MDBox>
        </Card></MDBox>
    </>
  );
}
export default Reset;
