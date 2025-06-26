/**
=========================================================
* Material Dashboard 2 PRO React - v2.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-pro-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { useState, useEffect, useRef } from "react";
import { Link } from 'react-router-dom';

// react-router-dom components
import { useNavigate } from "react-router-dom";
// @mui material components
import Card from "@mui/material/Card";
import { CircularProgress } from "@material-ui/core";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";

// Material Dashboard 2 PRO React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import ComboBox from "Features/ComboBox";

// Authentication layout components
import BasicLayout from "layouts/authentication/components/BasicLayout";

// Images
import pashupatiGroup from "assets/images/pashupatigroup_loader.gif";
import pasupati_banner from "assets/images/pasupati_banner.jpg";

// File Imports
import FrmValidations from "FrmGeneric/FrmValidations";
import { useAppContext } from "context/AppContext";
import ConfigConstants from "assets/Constants/config-constant";
import MDDropzone from "components/MDDropzone";
import {
  globalQuery,
  resetGlobalQuery,
} from "assets/Constants/config-constant";

function Login() {
  const [rememberMe, setRememberMe] = useState(false);

  const configConstants = ConfigConstants();
  const { IS_AUTHENTICATED } = configConstants;

  // Set values in the context
  const { dispatch } = useAppContext();

  const navigate = useNavigate();
  const validate = useRef();

  const [companyId, setCompanyId] = useState("");
  const [companyName, setCompanyname] = useState("");
  const [companylistOpts, setCompanylistOpts] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const companyComboref = useRef(null);
  const comboDataFunc = useRef();

  const [showPassword, setShowPassword] = useState(false);

  // Loader
  const [isLoading, setIsLoading] = useState(false);

  // Pashupati banner
  const [loading, setLoading] = useState(true); // Initially set loading to true

  useEffect( async () => {
    setLoading(true);
    await loadCompanyData();

    const currentPath = window.location.pathname;
    console.log("Current Path:", currentPath);
    console.log("IS_AUTHENTICATED:", IS_AUTHENTICATED);
    // Simulate loading for 2 seconds, then hide the loading spinner
    if (IS_AUTHENTICATED && currentPath === '/Login') {
      navigate("/DashBoard");
    } else if (!IS_AUTHENTICATED && currentPath === '/Reset') {
      setLoading(false);
    } else if (!IS_AUTHENTICATED && currentPath === '/Login') {
      setLoading(false);
    } else {
      const timer = setTimeout(() => {
        setLoading(false);
      }, 7000);
    }
    setLoading(false);
  
  },  [IS_AUTHENTICATED, navigate]);



  const loadCompanyData = async () =>{
    try {
      const method = {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: "",
      };
      debugger
      const companyoptions = await fetch(`${process.env.REACT_APP_BASE_URL}/api/auth/companyoptions`, method);
      console.log(companyoptions);
      if (companyoptions.status === 200) {
        const response = await companyoptions.json();
        console.log(response);
        debugger
        const companynames = 
                  response.map((com) => ({
                    value: com.company_id,
                    label: com.company_name,
                  }));
                setCompanylistOpts(companynames);
      }
    } catch (error) {
      alert("Please check the login info.");
      localStorage.setItem("isAuthenticated", false);
    }
  }
  

  const FnLogin = async () => {
    try {
      setIsLoading(true);
      const checkIsValidate = await validate.current.validateForm("loginId");
      debugger
      console.log("company_selected : "+ companyId)
      if (checkIsValidate === true) {
        const loginInfo = {
          username: username,
          password: password,
          remember_me: rememberMe,
          company_id: companyId,
        };

        const method = {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(loginInfo),
        };
        const signin = await fetch(`${process.env.REACT_APP_BASE_URL}/api/auth/signin`, method);
        if (signin.status === 200) {
          debugger;
          const response = await signin.json();
          const apiResponse = response;
          console.log("response: " + response);
          console.log("apiResponse: " + apiResponse);
          const login_company_id = companyId;
          console.log("login_company_id: " + login_company_id);

          localStorage.setItem("isAuthenticated", true);
          localStorage.setItem("userType", apiResponse.user_type);
          localStorage.setItem("userId", apiResponse.user_id);
          localStorage.setItem("user_code", apiResponse.user_code);
          localStorage.setItem("userName", apiResponse.username);
          localStorage.setItem("user", apiResponse.user);
          localStorage.setItem("companyID", login_company_id);
          // await FnGetCompanySettings(apiResponse.company_id)
          localStorage.setItem("companyBranchID", apiResponse.company_branch_id);
          localStorage.setItem("company_name", apiResponse.company_name);
          localStorage.setItem("company_branch_name",apiResponse.company_branch_name);
          localStorage.setItem( "companyAddress",apiResponse.company_branch_address);
          sessionStorage.setItem( "companyAddress", apiResponse.company_branch_address);
          localStorage.setItem("branch_short_name",apiResponse.branch_short_name);
          localStorage.setItem("company_branch_type",apiResponse.company_branch_type);
          localStorage.setItem("user_access",JSON.stringify(response.userAccessDetails));
          localStorage.setItem("Listing_FilterPreferenceDetails", JSON.stringify(response.listingFilterPreferenceDetails));
          localStorage.setItem("page_routes", JSON.stringify(response.pageRoutes));
          localStorage.setItem("department_id",JSON.stringify(response.department_id));
          localStorage.setItem("department_name", response.department_name);
          localStorage.setItem("company_access", response.company_access);

          dispatch({ type: "SET_IS_AUTHENTICATED", payload: true });
          dispatch({ type: "SET_COMPANY_ID", payload: login_company_id });
          dispatch({ type: "SET_COMPANY_BRANCH_ID", payload: apiResponse.company_branch_id,});
          dispatch({ type: "SET_COMPANY_NAME", payload: apiResponse.company_name,});
          dispatch({ type: "SET_COMPANY_BRANCH_NAME",payload: apiResponse.company_branch_name,});
          dispatch({ type: "SET_COMPANY_ADDRESS",payload: apiResponse.company_branch_address,});
          dispatch({ type: "SET_BRANCH_SHORT_NAME",payload: apiResponse.branch_short_name,});
          dispatch({ type: "SET_UserId", payload: apiResponse.user_id });
          dispatch({ type: "SET_USER_CODE", payload: apiResponse.user_code });
          dispatch({ type: "SET_UserName", payload: apiResponse.username });
          dispatch({ type: "SET_USER", payload: apiResponse.user });
          dispatch({ type: "SET_COMPANY_BRANCH_TYPE",  payload: apiResponse.company_branch_type,});
          dispatch({ type: "SET_USER_ACCESS", payload: response.userAccessDetails,});
          dispatch({ type: "SET_PAGE_ROUTES", payload: response.pageRoutes });
          dispatch({ type: "SET_LISTING_FILTERPREFERENCEDETAILS", payload: response.listingFilterPreferenceDetails,});
          dispatch({ type: "SET_DEPARTMENT_ID", payload: response.department_id,});
          dispatch({ type: "SET_DEPARTMENT_NAME", payload: response.department_name, });
          dispatch({ type: "SET_COMPANY_ACCESS", payload: response.company_access, });

          navigate("/DashBoard");
          setIsLoading(false);
        } else if (signin.status === 403) {
          // Permission denied
          const errorText = await signin.text();
          alert(errorText); // Displays: "Permission denied: Access is not granted for this company."
        } else {
            alert("Please check the login info.");
            localStorage.setItem("isAuthenticated", false);
            setIsLoading(false);
          }
      }
    } catch (error) {
      console.log("error: ", error);
      navigate("/Error");
    } finally {
      setIsLoading(false);
    }
  };

  const FnCombosOnChange = (key, value) => {
    try {
      switch (key) {
        case "company":
        
          break;

        default:
          break;
      }
    } catch (error) {
      console.log("error", error);
    }
  }

  const validateFields = () => {
    validate.current.validateFieldsOnChange("loginId");
  };

  const handleKeyDown = (e) =>{
    if(e.key === "Enter"){
        FnLogin();
    }
   
  }
  return (
    <>
      <ComboBox ref={comboDataFunc} />
      <FrmValidations ref={validate} />

      {isLoading ? (
        <div className="spinner-overlay">
          <div className="spinner-container">
            <CircularProgress color="primary" />
            <span id="spinner_text" className="text-dark">
              Loading...
            </span>
          </div>
        </div>
      ) : null}
      {!IS_AUTHENTICATED ? (
        <BasicLayout image={pashupatiGroup}>
          {loading ? (
            <>
              <img
                className="card mt-2 mb-5 border-0"
                src={pashupatiGroup}
                alt="Animated GIF"
                style={{
                  width: "500px",
                  height: "auto",
                  backgroundColor: "#782156",
                }}
              />
            </>
          ) : (
            <>
              <Card style={{ width: "500px" }}>
                <MDBox
                  variant="gradient"
                  bgColor="#ffff"
                  borderRadius="lg"
                  coloredShadow="info"
                  mx={2}
                  mt={-3}
                  p={1}
                  mb={1}
                  textAlign="center"
                  style={{
                    boxShadow:
                      "0rem 0.25rem 1.25rem 0rem rgba(0, 0, 0, 0.14), 0rem 0.4375rem 0.625rem -0.3125rem rgba(131, 22, 87, 1)",
                  }}
                >
                  <MDTypography
                    variant="h4"
                    fontWeight="medium"
                    style={{ color: "#831657" }}
                    mt={1}
                  >
                    Sign in
                  </MDTypography>
                </MDBox>

                <MDBox pt={4} pb={3} px={3}>
                  <MDBox component="form" role="form" id="loginId">

                 {/* Company dropdown  field */}
                 <MDBox mb={1} fontSize = "14px">
                    <select
                      ref={companyComboref}
                      id="company_Name"
                      value={companyId}
                      onChange={(e) => {
                        const selectedOpt = e.target.value;
                        setCompanyId(selectedOpt);
                        companyComboref.current = selectedOpt;
                        FnCombosOnChange("company");
                        validateFields();
                      }}
                      onKeyDown={handleKeyDown}
                      style={{
                        width: "100%",
                        height: "40px",
                        border: "1px solid #831657",
                        borderRadius: "4px",
                        padding: "8px 12px",
                        color: "#831657",
                        backgroundColor: "#ffffff",
                        fontSize: "14px" ,
                        boxSizing: "border-box",
                        appearance: "none",
                        WebkitAppearance: "none",
                        MozAppearance: "none",
                        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23831657" width="30px" height="30px"><path d="M7 10l5 5 5-5z"/></svg>')`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "right 12px center",
                        backgroundSize: "14px",
                      }}
                    >
                      <option value="" disabled> Select Company </option>
                      {companylistOpts.map((option) => (
                        <option key={option.value} value={option.value}> {option.label} </option>
                      ))}
                    </select>
                    <MDTypography
                      variant="button"
                      id="error_company_Name"
                      className="erp_validation"
                      fontWeight="regular"
                      color="error"
                      style={{ display: "none" }}
                    />
                  </MDBox>

                    {/* UserName input field */}
                    <MDBox mb={1}>
                      <MDInput
                        type="UserName"
                        id="usernameId"
                        label="User Name"
                        value={username}
                        onChange={(e) => {
                          setUsername(e.target.value);
                          validateFields();
                        }}
                        onKeyDown = {handleKeyDown}
                        style={{
                          "& label.Mui-focused": {
                            color: "#831657", // Change this to the color you want
                          },
                        }}
                        fullWidth
                      />
                      <MDTypography
                        variant="button"
                        id="error_usernameId"
                        className="erp_validation"
                        fontWeight="regular"
                        color="error"
                        style={{ display: "none" }}
                      />
                    </MDBox>

                    <MDBox mb={0}>
                      <MDBox mb={2}>
                        <MDInput
                          type={showPassword ? "text" : "password"}
                          id="passwordId"
                          label="Password"
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value);
                            validateFields();
                          }}
                          onKeyDown = {handleKeyDown}
                          fullWidth
                        />
                      </MDBox>

                      <MDTypography
                        variant="button"
                        id="error_passwordId"
                        className="erp_validation"
                        fontWeight="regular"
                        color="error"
                        style={{ display: "none" }}
                      />
                    </MDBox>

                    <MDBox mt={0} mb={0}>
                      <MDButton
                        className="sign-in-btn"
                        type="button"
                        variant="gradient"
                        onClick={FnLogin}
                        style={{
                          backgroundColor: "#831657",
                          backgroundImage: "unset",
                        }}
                        color="info"
                        size="large"
                        fullWidth
                        onMouseOver={(e) => {
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
                        }}
                      >
                        Login
                      </MDButton>
                    </MDBox>

                    <MDBox textAlign = "center" style={{marginTop: '10px'}}>
                      <MDButton onClick={() =>  navigate("/Authentication/Reset")} >
                          Forgot Password
                      </MDButton>
                    </MDBox>

                    {/* <MDBox mt={1} textAlign="center">
                                                <MDTypography variant="button" color="text" to="/authentication/New Customer/cover">
                                                    <a href=""> New Customer</a> /<a href="">  Supplier Registration? {" "}</a>

                                                    <MDTypography
                                                        component={Link}
                                                        to="/Reset"
                                                        variant="button"
                                                        color="info"
                                                        fontWeight="medium"
                                                        textGradient
                                                    >
                                                        Forgot Password
                                                    </MDTypography>
                                                </MDTypography>
                                            </MDBox> */}

                    {/* </MDGrid> */}
                  </MDBox>
                </MDBox>
              </Card>

              <img
                className="card mt-3"
                src={pasupati_banner}
                alt="Animated GIF"
                style={{ width: "500px", height: "auto" }}
              />
            </>
          )}
        </BasicLayout>
      ) : null}
    </>
  );
}

export default Login;
