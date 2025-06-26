import { useState, useEffect } from "react";

// react-router components
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";

// @mui material components
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

// Material Dashboard 2 PRO React examples
import Configurator from "examples/Configurator";
import Footer from "examples/Footer";
import MenuNavbar from "./components/Navbars/MenuNavbar"
import DashboardNav from "components/Navbars/DashboardNav";

// Material Dashboard 2 PRO React themes
import theme from "assets/theme";

// Material Dashboard 2 PRO React routes
import routes from "routes";

// Material Dashboard 2 PRO React contexts
import { useMaterialUIController } from "context";
// import InvoiceTemplate from "FrmGeneric/InvoiceTemplate";
import "assets/css/style.js";
import ConfigConstants from "assets/Constants/config-constant";
import { useRef } from "react";
import Logout from "Authentication/Logout";
import { Button, Modal } from "react-bootstrap";

export default function App() {
  const configConstants = ConfigConstants();
  const { IS_AUTHENTICATED } = configConstants;

  const [controller, dispatch] = useMaterialUIController();
  const {
    direction,
    layout,
    darkMode,
  } = controller;

  const { pathname } = useLocation();
  const navigate = useNavigate();
  const logoutRef = useRef(null);
  const events = ['load', 'mousemove', 'mousedown', 'click', 'scroll', 'keypress'];

  // const ACCESS_TOKEN_EXPIRES_TIME = 1000 * 60 * 10 ; // 10 min
  const ACCESS_TOKEN_EXPIRES_TIME = 1000 * 60 * 15; // 15 min 


  // Change the openConfigurator state
  const expireTimeRef = useRef(Date.now() + 600000);
  const [serverApi, setServerApi] = useState(false)
  const [isFirstMounted, setIsFirstMounted] = useState(true);


  // Session Expired modal
  const [show, setShow] = useState(false);
  const handleClose = async () => {
    await logoutRef.current.logoutUser();
    navigate('/login')
    setShow(false)
  };
  const showSessionExpiredModal = () => setShow(true);


  const checkForInactivity = () => {
    if (expireTimeRef.current < Date.now()) {
      showSessionExpiredModal()
      return false;
    } else {
      return true;
    }
  }

  const updateExpireTime = () => {
    //expireTimeRef.current = Date.now() + 600000; // Update expire time to 10 min from now
    expireTimeRef.current = Date.now() + 3600000; // Update expire time to 1 hour from now
    localStorage.setItem("sessionExpireTime", expireTimeRef.current)
  }

  useEffect(() => {
    if (IS_AUTHENTICATED) {
      const handleStorage = () => {
        const storedExpireTime = parseInt(localStorage.getItem("sessionExpireTime") || "0", 10);
        if (storedExpireTime > Date.now()) {
          expireTimeRef.current = storedExpireTime;
        }
      };

      handleStorage();

      const interval = setInterval(() => {
        if (checkForInactivity()) {
          refreshToken()
        } else {
          showSessionExpiredModal()
        }
      }, ACCESS_TOKEN_EXPIRES_TIME); // interval after every 10 min

      const storageListener = () => {
        handleStorage();
      };

      window.addEventListener("storage", storageListener);

      return () => {
        clearInterval(interval);
        window.removeEventListener("storage", storageListener);
      };
    }
  }, [IS_AUTHENTICATED])

  // Function to refresh token
  const refreshToken = () => {
    console.log("Token Refreshed call!...");
    fetch(`${process.env.REACT_APP_BASE_URL}/api/auth/refreshtoken`, { method: 'POST' })
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });

    if (isFirstMounted) {
      setIsFirstMounted(false);
    }
  };

  useEffect(() => {
    if (IS_AUTHENTICATED) {

      // Set event listners
      events.forEach(event => {
        window.addEventListener(event, updateExpireTime);
      });

      // Clean up
      return () => {
        events.forEach(event => {
          window.removeEventListener(event, updateExpireTime);
        });
      }
    }
  }, [IS_AUTHENTICATED])


  const serverTestApi = async () => {
    try {
      const testApiCall = await fetch(`${process.env.REACT_APP_BASE_URL}/api/test/all`)
      if (testApiCall.status !== 504) {
        setServerApi(true)
        if (testApiCall.status === 401 && IS_AUTHENTICATED) {
          showSessionExpiredModal()
        } else if (!IS_AUTHENTICATED) {
          navigate("/login")
        } else if (testApiCall.status === 200 && IS_AUTHENTICATED) {
          // Check on the first render
          if (isFirstMounted && checkForInactivity()) {
            refreshToken();
          }
        }
      } else {
        navigate("/Error")
      }

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }


  // Setting the dir attribute for the body element
  useEffect(() => {
    // Server Test api 
    serverTestApi()

    document.body.setAttribute("dir", direction);
  }, [direction]);

  // Setting page scroll to 0 when changing the route
  useEffect(() => {
   
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    
  }, [pathname]);

  useEffect(() => {
    const networkCheck = async () => {
      if (navigator.onLine) {
          console.log("You are Online");
        //  setNetworkStatus("You are Offline !!")
      }else{
          navigate("/NetworkCheck")
      }
  }
  // networkCheck();   

  }, [pathname])
  
  const getRoutes = (allRoutes) =>
    allRoutes.map((routePath) => {
      if (routePath.collapse) {
        return getRoutes(routePath.collapse);
      }

      if (routePath.route) {
        if (routePath.protected && !IS_AUTHENTICATED) {
          return (<Route exact path={routePath.route} element={routePath.component} key={routePath.key} />);
        } else {
          return (<Route exact path={routePath.route} element={routePath.component} key={routePath.key} />);
        }
      }

      return null;
    });


  return (
    <>
      <Logout ref={logoutRef} />

      <ThemeProvider theme={darkMode ? theme : theme}>
        <CssBaseline />
        {layout === "dashboard" && (
          <div>
            {pathname !== '/Invoice' && pathname !== '/Error' && (
              <div className="erp_header_fix">
                {IS_AUTHENTICATED ? <DashboardNav /> : null}
                <MenuNavbar routes={routes} />
              </div>

            )}
            <Configurator />
          </div>
        )}
        {layout === "vr" && <Configurator />}

        <Routes>
          {getRoutes(routes)}
          {
            serverApi ?
              <>
                <Route path="*" element={<Navigate to="/login" />} />
                {/* <Route path='/Invoice' element={<InvoiceTemplate />} /> */}
              </>
              : null
          }

        </Routes>
        {pathname !== '/Invoice' && pathname !== '/login' && pathname !== '/Error' && IS_AUTHENTICATED && <Footer />}

      </ThemeProvider>

      {show ?
        <Modal show={show} onHide={handleClose} centered>
          <Modal.Header closeButton style={{ fontSize: '11px' }}>
            <Modal.Title style={{ fontSize: '20px' }}>Session Expired</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ fontSize: '15px' }}>Please login again.</Modal.Body>
          <Modal.Footer>
            <Button className="erp-gb-button" onClick={handleClose}>
              Ok
            </Button>
          </Modal.Footer>
        </Modal>
        : null}

    </>
  );

}
