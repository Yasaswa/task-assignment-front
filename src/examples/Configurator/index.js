import { useState, useEffect } from "react";


// @mui material components
import Divider from "@mui/material/Divider";
import Switch from "@mui/material/Switch";
import Icon from "@mui/material/Icon";


// Material Dashboard 2 PRO React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Custom styles for the Configurator
import ConfiguratorRoot from "examples/Configurator/ConfiguratorRoot";

//import  custom theme releated files.
import Styles from "assets/css/style.js";
import "assets/css/thems_btn.css";

// Material Dashboard 2 PRO React context
import {
  useMaterialUIController,
  setOpenConfigurator,
  setMiniSidenav,
} from "context";

function Configurator() {
  // custom theme code...
  const [theme, setTheme] = useState(() => sessionStorage.getItem('theme') || '');
  const handleButtonClick = (newTheme) => {
    setTheme(newTheme);
    sessionStorage.setItem('theme', newTheme);
    return <Styles theme={newTheme} />
  };
  useEffect(() => {
    if (theme) {
      sessionStorage.setItem('theme', theme);
    } else {
      sessionStorage.removeItem('theme');
    }
  }, [theme]);
  const [controller, dispatch] = useMaterialUIController();

  const {
    openConfigurator,
    miniSidenav,
    darkMode,
  } = controller;

  const [disabled, setDisabled] = useState(false);


  // Use the useEffect hook to change the button state for the sidenav type based on window size.
  useEffect(() => {
    // A function that sets the disabled state of the buttons for the sidenav type.
    function handleDisabled() {
      return window.innerWidth > 1200 ? setDisabled(false) : setDisabled(true);
    }
    // The event listener that's calling the handleDisabled function when resizing the window.
    window.addEventListener("resize", handleDisabled);
    // Call the handleDisabled function to set the state with the initial value.
    handleDisabled();
    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleDisabled);
  }, []);

  const handleCloseConfigurator = () => setOpenConfigurator(dispatch, false);

  const handleMiniSidenav = () => setMiniSidenav(dispatch, !miniSidenav);

  return (
    <>
      <Styles theme={theme} />
      <ConfiguratorRoot variant="permanent" ownerState={{ openConfigurator }}>
        <MDBox
          display="flex"
          justifyContent="space-between"
          alignItems="baseline"
          pt={4}
          pb={0.5}
          px={3}
        >
          <MDBox>
            <MDTypography variant="h6">SysTech Solutions UI Configurator</MDTypography>
            <MDTypography variant="body2" color="text">
              See our dashboard options.
            </MDTypography>
          </MDBox>
          <Icon
            sx={({ typography: { size }, palette: { dark, white } }) => ({
              fontSize: `${size.lg} !important`,
              color: darkMode ? white.main : dark.main,
              stroke: "currentColor",
              strokeWidth: "2px",
              cursor: "pointer",
              transform: "translateY(5px)",
            })}
            onClick={handleCloseConfigurator}
          >
            close
          </Icon>
        </MDBox>
        <Divider />
        <MDBox pt={0.5} pb={3} px={3}>
          {/* <MDBox>
            <MDTypography variant="h6">Sidenav Colors</MDTypography>
            <MDBox mb={0.5}>
              {sidenavColors.map((color) => (
                <IconButton
                  key={color}
                  sx={({
                    borders: { borderWidth },
                    palette: { white, dark, background },
                    transitions,
                  }) => ({
                    width: "24px",
                    height: "24px",
                    padding: 0,
                    border: `${borderWidth[1]} solid ${darkMode ? background.sidenav : white.main}`,
                    borderColor: () => {
                      let borderColorValue = sidenavColor === color && dark.main;
                      if (darkMode && sidenavColor === color) {
                        borderColorValue = white.main;
                      }
                      return borderColorValue;
                    },
                    transition: transitions.create("border-color", {
                      easing: transitions.easing.sharp,
                      duration: transitions.duration.shorter,
                    }),
                    backgroundImage: ({ functions: { linearGradient }, palette: { gradients } }) =>
                      linearGradient(gradients[color].main, gradients[color].state),
                    "&:not(:last-child)": {
                      mr: 1,
                    },
                    "&:hover, &:focus, &:active": {
                      borderColor: darkMode ? white.main : dark.main,
                    },
                  })}
                  onClick={() => setSidenavColor(dispatch, color)}
                />
              ))}
            </MDBox>
          </MDBox> */}
          {/* thems buttons  */}
          <MDBox>
            <MDTypography variant="h6">Change Thems</MDTypography>
            <MDBox mb={0.5}>
              <div >
                <button type="button" className='button button_green_Theme' onClick={() => handleButtonClick('themeGreen')}></button>
                <button type="button" className='button button_dark_Theme' onClick={() => handleButtonClick('themeDark')}></button>
              </div>
            </MDBox>
          </MDBox>
          {/* <MDBox mt={3} lineHeight={1}>
            <MDTypography variant="h6">Sidenav Type</MDTypography>
            <MDTypography variant="button" color="text">
              Choose between different sidenav types.
            </MDTypography>
            <MDBox
              sx={{
                display: "flex",
                mt: 2,
                mr: 1,
              }}
            >
              <MDButton
                color="dark"
                variant="gradient"
                onClick={handleDarkSidenav}
                disabled={disabled}
                fullWidth
                sx={
                  !transparentSidenav && !whiteSidenav
                    ? sidenavTypeActiveButtonStyles
                    : sidenavTypeButtonsStyles
                }
              >
                Dark
              </MDButton>
              <MDBox sx={{ mx: 1, width: "8rem", minWidth: "8rem" }}>
                <MDButton
                  color="dark"
                  variant="gradient"
                  onClick={handleTransparentSidenav}
                  disabled={disabled}
                  fullWidth
                  sx={
                    transparentSidenav && !whiteSidenav
                      ? sidenavTypeActiveButtonStyles
                      : sidenavTypeButtonsStyles
                  }
                >
                  Transparent
                </MDButton>
              </MDBox>
              <MDButton
                color="dark"
                variant="gradient"
                onClick={handleWhiteSidenav}
                disabled={disabled}
                fullWidth
                sx={
                  whiteSidenav && !transparentSidenav
                    ? sidenavTypeActiveButtonStyles
                    : sidenavTypeButtonsStyles
                }
              >
                White
              </MDButton>
            </MDBox>
          </MDBox> */}
          {/* <MDBox
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mt={3}
            lineHeight={1}
          >
            <MDTypography variant="h6">Navbar Fixed</MDTypography>
            <Switch checked={fixedNavbar} onChange={handleFixedNavbar} />
          </MDBox> */}
          <Divider />
          <MDBox display="flex" justifyContent="space-between" alignItems="center" lineHeight={1}>
            <MDTypography variant="h6">Sidenav Mini</MDTypography>
            <Switch checked={miniSidenav} onChange={handleMiniSidenav} />
          </MDBox>
          <Divider />
          {/* <MDBox display="flex" justifyContent="space-between" alignItems="center" lineHeight={1}>
            <MDTypography variant="h6">Light / Dark</MDTypography>
            <Switch checked={darkMode} onChange={handleDarkMode} />
          </MDBox> */}
          <Divider />
          <MDBox mt={3} mb={2}>
            {/* <MDBox mb={2}>
            <MDButton
              component={Link}
              href="https://www.creative-tim.com/product/material-dashboard-pro-react"
              target="_blank"
              rel="noreferrer"
              color="info"
              variant="gradient"
              fullWidth
            >
              buy now
            </MDButton>
          </MDBox> */}
            {/* <MDBox mb={2}>
            <MDButton
              component={Link}
              href="https://www.creative-tim.com/product/material-dashboard-2-pro-react-ts"
              target="_blank"
              rel="noreferrer"
              color="dark"
              variant="gradient"
              fullWidth
            >
              buy typescript version
            </MDButton>
          </MDBox> */}
            {/* <MDButton
              component={Link}
              href="https://www.creative-tim.com/learning-lab/react/quick-start/material-dashboard/"
              target="_blank"
              rel="noreferrer"
              color={darkMode ? "light" : "dark"}
              variant="outlined"
              fullWidth
            >
              view documentation
            </MDButton> */}
          </MDBox>
          {/* <MDBox display="flex" justifyContent="center">
          <GitHubButton
            href="https://github.com/creativetimofficial/ct-material-dashboard-pro-react"
            data-icon="octicon-star"
            data-size="large"
            data-show-count="true"
            aria-label="Star creativetimofficial/ct-material-dashboard-pro-react on GitHub"
          >
            Star
          </GitHubButton>
        </MDBox> */}
          {/* <MDBox mt={2} textAlign="center">
            <MDBox mb={0.5}>
              <MDTypography variant="h6">Thank you for sharing!</MDTypography>
            </MDBox>
            <MDBox display="flex" justifyContent="center">
              <MDBox mr={1.5}>
                <MDButton
                  component={Link}
                  href="//twitter.com/intent/tweet?text=Check%20Material%20Dashboard%202%20PRO%20React%20made%20by%20%40CreativeTim%20%23webdesign%20%23dashboard%20%23react%20%mui&url=https%3A%2F%2Fwww.creative-tim.com%2Fproduct%2Fmaterial-dashboard-pro-react"
                  target="_blank"
                  rel="noreferrer"
                  color="dark"
                >
                  <TwitterIcon />
                  &nbsp; Tweet
                </MDButton>
              </MDBox>
              <MDButton
                component={Link}
                href="https://www.facebook.com/sharer/sharer.php?u=https://www.creative-tim.com/product/material-dashboard-pro-react"
                target="_blank"
                rel="noreferrer"
                color="dark"
              >
                <FacebookIcon />
                &nbsp; Share
              </MDButton>
            </MDBox>
          </MDBox> */}
        </MDBox>
      </ConfiguratorRoot>
    </>
  );
}
export default Configurator;