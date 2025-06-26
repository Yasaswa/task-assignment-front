/* eslint-disable no-param-reassign */
/**
=========================================================
* Material Dashboard 2 PRO React TS - v1.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-2-pro-react-ts
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { useState, useEffect, Fragment, useRef } from "react";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// react-router components
import { Link } from "react-router-dom";

// @mui material components
import Icon from "@mui/material/Icon";
import Popper from "@mui/material/Popper";
import Grow from "@mui/material/Grow";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import MuiLink from "@mui/material/Link";
import Container from "@mui/material/Container";

// Material Dashboard 2 PRO React TS components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Material Dashboard 2 PRO React TS examples components
import DefaultNavbarDropdown from "examples/Navbars/DefaultNavbar/DefaultNavbarDropdown";
import DefaultNavbarMobile from "examples/Navbars/DefaultNavbar/DefaultNavbarMobile";
// Notification imports
import NotificationsIcon from "@mui/icons-material/Notifications"
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import ConfigConstants, { resetGlobalQuery, globalQuery } from "assets/Constants/config-constant";
import ComboBox from 'Features/ComboBox';
import ScrollDialog from "components/Navbars/Notification/index";
import BirthdayCardModal from "components/Navbars/BdayCardModal/index"

// Material Dashboard 2 PRO React TS Base Styles
import breakpoints from "assets/theme/base/breakpoints";

// Material Dashboard 2 PRO React context
import { useMaterialUIController } from "context";


function DefaultNavbar({ routes, brand, transparent, light, action }) {
  const configConstants = ConfigConstants();

  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  const [dropdown, setDropdown] = useState("");
  const [dropdownEl, setDropdownEl] = useState("");
  const [dropdownName, setDropdownName] = useState("");
  const [nestedDropdown, setNestedDropdown] = useState("");
  const [nestedDropdownEl, setNestedDropdownEl] = useState("");
  const [nestedDropdownName, setNestedDropdownName] = useState("");
  const [arrowRef, setArrowRef] = useState(null);
  const [mobileNavbar, setMobileNavbar] = useState(false);
  const [mobileView, setMobileView] = useState(false);


  // Notificaiton Hooks
  const comboBoxRef = useRef()
  const [selEmployeeData, setSelEmployeeData] = useState()
  const [openDialog, setOpenDialog] = useState(false);
  const [isModalOpen, setBdayModalOpen] = useState(false)
  const [bdayEmployees, setBdayEmployees] = useState([]);
  const [overdueSalesOrders, setOverDueSalesOrder] = useState([]);

  useEffect(() => {
    FnGetEmployeeDataForBdayCard()
  }, [])

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleOpenBdayModal = () => {
    setBdayModalOpen(true)
  }

  const handleCloseBdayModal = () => {
    setBdayModalOpen(false);
  };

  const today = new Date();
  const todayDate = today.toISOString().slice(5, 10);


  const FnGetEmployeeDataForBdayCard = async () => {
    debugger
    const today = new Date();
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(today.getMonth() - 3);

    const yyyy = threeMonthsAgo.getFullYear();
    const mm = String(threeMonthsAgo.getMonth() + 1).padStart(2, '0');
    const dd = String(threeMonthsAgo.getDate()).padStart(2, '0');

    const formattedDate = `${yyyy}-${mm}-${dd}`;  // e.g. "2025-03-04"
    resetGlobalQuery();
    globalQuery.columns = ["employee_name", "designation_name", "company_name", "date_of_birth", "cell_no1"];
    globalQuery.conditions.push({ field: "date_of_birth", operator: "LIKE", value: `%-${todayDate}` });
    globalQuery.conditions.push({ field: "is_delete", operator: "=", value: 0 });
    globalQuery.conditions.push({ field: "is_active", operator: "=", value: 1 });
    globalQuery.table = "cmv_employee";
    const getEmployees = await comboBoxRef.current.fillFiltersCombo(globalQuery)
    setBdayEmployees(getEmployees)

    resetGlobalQuery();
    globalQuery.columns = ["sales_order_no", "sales_order_date","sales_order_version","financial_year","sales_order_master_transaction_id","sales_order_type_id"];
    globalQuery.conditions.push({ field: "sales_order_date", operator: "<", value: formattedDate });
    globalQuery.conditions.push({ field: "is_delete", operator: "=", value: 0 });
    globalQuery.table = "mt_sales_order_master_trading";
    const getOverDueSalesOrder = await comboBoxRef.current.fillFiltersCombo(globalQuery)
    setOverDueSalesOrder(getOverDueSalesOrder)

  }

  const openMobileNavbar = () => setMobileNavbar(!mobileNavbar);

  useEffect(() => {
    // A function that sets the display state for the DefaultNavbarMobile.
    function displayMobileNavbar() {
      if (window.innerWidth < breakpoints.values.lg) {
        setMobileView(true);
        setMobileNavbar(false);
      } else {
        setMobileView(false);
        setMobileNavbar(false);
      }
    }

    /** 
     The event listener that's calling the displayMobileNavbar function when 
     resizing the window.
    */
    window.addEventListener("resize", displayMobileNavbar);

    // Call the displayMobileNavbar function to set the state with the initial value.
    displayMobileNavbar();

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", displayMobileNavbar);
  }, []);

  const renderNavbarItems = routes?.map(({ name, icon, href, route, collapse }) => (
    <DefaultNavbarDropdown
      className={'opacity-100'}
      key={name}
      name={name}
      icon={icon}
      href={href}
      route={route}
      collapse={Boolean(collapse)}
      // onMouseEnter={({ currentTarget }) => {
      //   if (collapse) {
      //     setDropdown(currentTarget);
      //     setDropdownEl(currentTarget);
      //     setDropdownName(name);
      //   }
      // }}
      onClick={({ currentTarget }) => {
        if (collapse) {
          setDropdown(currentTarget);
          setDropdownEl(currentTarget);
          setDropdownName(name);
        }
      }}
      onMouseLeave={() => collapse && setDropdown(null)}
      light={light}
    />
  ));

  // Render the  routes? on the dropdown menu
  const renderRoutes = routes?.map(({ name, collapse, columns, rowsPerColumn }) => {
    let template;

    // Render the dropdown menu that should be display as columns
    if (collapse && columns && name === dropdownName) {
      const calculateColumns = collapse.reduce((resultArray, item, index) => {
        const chunkIndex = Math.floor(index / rowsPerColumn);

        if (!resultArray[chunkIndex]) {
          resultArray[chunkIndex] = [];
        }

        resultArray[chunkIndex].push(item);

        return resultArray;
      }, []);

      template = (
        <Grid key={name} container spacing={3} py={1} px={1.5} >
          {calculateColumns.map((cols, key) => {
            const gridKey = `grid-${key}`;
            const dividerKey = `divider-${key}`;

            return (
              <Grid key={gridKey} item xs={12 / columns} sx={{ position: "relative" }}
                style={{ maxHeight: '400px', overflowY: 'auto' }}
              >
                {cols.map((col, index) => (
                  <Fragment key={col.name}>
                    <MDBox
                      width="100%"
                      display="flex"
                      alignItems="center"
                      py={1}
                      mt={index !== 0 ? 2 : 0}
                    // position="sticky"
                    // top="0"
                    // zIndex="1000" // Adjust z-index as needed
                    >
                      <MDBox
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        width="1.5rem"
                        height="1.5rem"
                        borderRadius="md"
                        color="text"
                        mr={1}
                        fontSize="1rem"
                        lineHeight={1}
                        backgroundColor="#FFFFFF"
                      >
                        {col.icon}
                      </MDBox>
                      <MDTypography
                        display="block"
                        variant="button"
                        fontWeight="bold"
                        textTransform="capitalize"
                        backgroundColor="#FFFFFF"
                      >
                        {/* {col.name} */}
                      </MDTypography>
                    </MDBox>
                    {col.collapse.map((item) => (
                      <MDBox >
                        <MDTypography
                          key={item.name}
                          component={item.route ? Link : MuiLink}
                          to={item.route ? item.route : ""}
                          href={item.href ? item.href : (e) => e.preventDefault()}
                          target={item.href ? "_blank" : ""}
                          rel={item.href ? "noreferrer" : "noreferrer"}
                          minWidth="11.25rem"
                          display="block"
                          variant="button"
                          color="text"
                          textTransform="capitalize"
                          fontWeight="regular"
                          py={0.625}
                          px={2}
                          sx={({ palette: { grey, dark }, borders: { borderRadius } }) => ({
                            borderRadius: borderRadius.md,
                            cursor: "pointer",
                            transition: "all 300ms linear",

                            "&:hover": {
                              backgroundColor: grey[200],
                              color: dark.main,
                            },
                          })}
                          onClick={(e) => {
                            collapse && setDropdown(null)
                            setMobileNavbar(false); // Close the navbar
                          }}
                        >
                          {/* {item.name} */}
                        </MDTypography>
                      </MDBox>
                    ))}
                  </Fragment>
                ))}
                {key !== 0 && (
                  <Divider
                    key={dividerKey}
                    orientation="vertical"
                    sx={{
                      position: "absolute",
                      top: "20%",
                      left: "-4px",
                      transform: "translateY(-45%)",
                      height: "90%",
                    }}
                  />
                )}
              </Grid>
            );
          })}
        </Grid>


      );

      // Render the dropdown menu that should be display as list items
    } else if (collapse && name === dropdownName) {
      template = collapse.map((item) => {
        const linkComponent = {
          component: MuiLink,
          href: item.href,
          target: "_blank",
          rel: "noreferrer",
        };

        const routeComponent = {
          component: Link,
          to: item.url_parameter ? item.route + '/' + item.url_parameter : item.route,
        };

        return (
          <MDTypography
            key={item.name}
            {...(item.route ? routeComponent : linkComponent)}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            variant="button"
            textTransform="capitalize"
            minWidth={item.description ? "14rem" : "12rem"}
            color={item.description ? "dark" : "text"}
            fontWeight={item.description ? "bold" : "regular"}
            py={item.description ? 1 : 0.625}
            px={2}
            sx={({ palette: { grey, dark }, borders: { borderRadius } }) => ({
              borderRadius: borderRadius.md,
              cursor: "pointer",
              transition: "all 300ms linear",

              "&:hover": {
                backgroundColor: grey[200],
                color: dark.main,

                "& *": {
                  color: dark.main,
                },
              },
            })}
            onMouseEnter={({ currentTarget }) => {
              if (item.dropdown) {
                setNestedDropdown(currentTarget);
                setNestedDropdownEl(currentTarget);
                setNestedDropdownName(item.name);
              }
            }}
            onMouseLeave={() => {
              if (item.dropdown) {
                setNestedDropdown(null);
              }
            }}

          >
            {item.description ? (
              <MDBox display="flex" py={0.25} fontSize="1rem" color="text"  >
                {typeof item.icon === "string" ? (
                  <Icon color="inherit">{item.icon}</Icon>
                ) : (
                  <MDBox color="inherit">{item.icon}</MDBox>
                )}
                <MDBox pl={1} lineHeight={0}
                // style={{ maxHeight: '400px', overflowY: 'auto' }}
                >
                  <MDTypography
                    variant="button"
                    display="block"
                    fontWeight="bold"
                    textTransform="capitalize"
                  >
                    {/* {item.name} */}
                  </MDTypography>
                  <MDTypography variant="button" fontWeight="regular" color="text">
                    {item.description}
                  </MDTypography>
                </MDBox>
              </MDBox>
            ) : (
              <MDBox display="flex" alignItems="center" color="text">
                <Icon sx={{ mr: 1 }}>{item.icon}</Icon>
                {item.name}
              </MDBox>
            )}
            {item.collapse && (
              <Icon sx={{ fontWeight: "normal", verticalAlign: "middle", mr: -0.5 }}>
                keyboard_arrow_right
              </Icon>
            )}
          </MDTypography>
        );
      });
    }

    return template;
  });

  //  routes? dropdown menu
  const dropdownMenu = (
    <Popper
      anchorEl={dropdown}
      popperRef={null}
      open={Boolean(dropdown)}
      placement="top-start"
      transition
      style={{ zIndex: 999, maxHeight: '400px', overflowY: 'auto' }}
      modifiers={[
        {
          name: "arrow",
          enabled: true,
          options: {
            element: arrowRef,
          },
        },
      ]}
      onMouseEnter={() => setDropdown(dropdownEl)}
      onMouseLeave={() => {
        if (!nestedDropdown) {
          setDropdown(null);
          setDropdownName("");
        }
      }}
    >
      {({ TransitionProps }) => (
        <Grow
          {...TransitionProps}
          sx={{
            transformOrigin: "left top",
            background: ({ palette: { white } }) => white.main,
          }}
        >
          <MDBox borderRadius="lg">
            <MDTypography variant="h1" color="white">
              <Icon ref={setArrowRef} sx={{ mt: -3 }}>
                arrow_drop_up
              </Icon>
            </MDTypography>
            <MDBox shadow="lg" borderRadius="lg" p={1.625} mt={1}>
              {renderRoutes}
            </MDBox>
          </MDBox>
        </Grow>
      )}
    </Popper>
  );

  // Render  routes? that are nested inside the dropdown menu  routes?
  const renderNestedRoutes = routes?.map(({ collapse, columns }) =>
    collapse && !columns
      ? collapse.map(({ name: parentName, collapse: nestedCollapse }) => {
        let template;

        if (parentName === nestedDropdownName) {
          template =
            nestedCollapse &&
            nestedCollapse.map((item) => {
              const linkComponent = {
                component: MuiLink,
                href: item.href,
                target: "_blank",
                rel: "noreferrer",
              };

              const routeComponent = {
                component: Link,
                to: item.url_parameter ? item.route + '/' + item.url_parameter : item.route,
              };

              return (
                <MDTypography
                  key={item.name}
                  {...(item.route ? routeComponent : linkComponent)}
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  variant="button"
                  textTransform="capitalize"
                  minWidth={item.description ? "14rem" : "12rem"}
                  color={item.description ? "dark" : "text"}
                  fontWeight={item.description ? "bold" : "regular"}
                  py={item.description ? 1 : 0.625}
                  px={2}
                  sx={({ palette: { grey, dark }, borders: { borderRadius } }) => ({
                    borderRadius: borderRadius.md,
                    cursor: "pointer",
                    transition: "all 300ms linear",

                    "&:hover": {
                      backgroundColor: grey[200],
                      color: dark.main,

                      "& *": {
                        color: dark.main,
                      },
                    },
                  })}
                  onClick={() => {
                    setNestedDropdown(null);
                    setNestedDropdownName("");
                    setDropdown(null); // Close the parent dropdown as well if needed
                    setDropdownName(""); // Reset dropdown name
                  }}

                >
                  {item.description ? (
                    <MDBox>
                      {item.name}
                      <MDTypography
                        display="block"
                        variant="button"

                        color="text"
                        fontWeight="regular"
                        sx={{ transition: "all 300ms linear" }}
                      >
                        {item.description}
                      </MDTypography>
                    </MDBox>
                  ) : (
                    item.name
                  )}
                  {item.collapse && (
                    <Icon
                      fontSize="small"
                      sx={{ fontWeight: "normal", verticalAlign: "middle", mr: -0.5 }}
                    >
                      keyboard_arrow_right
                    </Icon>
                  )}
                </MDTypography>
              );
            });
        }

        return template;
      })
      : null
  );

  // Dropdown menu for the nested dropdowns
  const nestedDropdownMenu = (
    <Popper
      anchorEl={nestedDropdown}
      popperRef={null}
      open={Boolean(nestedDropdown)}
      placement="right-start"
      transition
      style={{ zIndex: 999 }}
      onMouseEnter={() => {
        setNestedDropdown(nestedDropdownEl);
      }}
      onMouseLeave={() => {
        setNestedDropdown(null);
        setNestedDropdownName("");
        setDropdown(null);
      }}
    >
      {({ TransitionProps }) => (
        <Grow
          {...TransitionProps}
          sx={{
            transformOrigin: "left top",
            background: ({ palette: { white } }) => white.main,
          }}
        >
          <MDBox ml={2.5} mt={-2.5} borderRadius="lg">
            <MDBox shadow="lg" borderRadius="lg" py={1.5} px={1} mt={2} style={{ maxHeight: '250px', overflowY: 'auto' }}>
              {renderNestedRoutes}
            </MDBox>
          </MDBox>
        </Grow>
      )}
    </Popper>
  );

  return (
    <Container className="custom-container">
      <ComboBox ref={comboBoxRef} />
      <MDBox
        className="menubar-color"
        width="calc(110% - 48px)"
        shadow={transparent ? "none" : "md"}
        color={light ? "white" : "dark"}
        position="absolute"
        left={0}
        sx={({
          palette: { transparent: transparentColor, white, background },
          functions: { rgba },
        }) => ({
          backgroundColor: transparent
            ? transparentColor.main
            : rgba(darkMode ? background.sidenav : white.main, 0.8),
          backdropFilter: transparent ? "none" : `saturate(200%) blur(30px)`,
        })}

      >
        {/* <MDBox display="flex" justifyContent="space-between" alignItems="center" style={{ backgroundColor: '#045cb4' }}> */}
        <MDBox display="flex" justifyContent="space-between" alignItems="center" width="92%">

          {/* <MDBox
            component={Link}
            to="/"
            py={transparent ? 1.5 : 0.75}
            lineHeight={1}
            pl={{ xs: 0, lg: 1 }}
          >
            <MDTypography variant="button" fontWeight="bold" color={light ? "white" : "dark"}>
              {brand}
            </MDTypography>
          </MDBox> */}
          <MDBox color="inherit" display={{ xs: "none", lg: "flex" }} m={0} p={0}>
            {renderNavbarItems}
          </MDBox>
          <div className='ms-0' style={{ display: "flex", flexDirection: "column", fontSize: "1.4em", justifyContent: "center", cursor: "pointer" }}>
            <NotificationsNoneIcon onClick={handleOpenDialog}
              style={{ color: 'white', backgroundColor: 'transparent' }}
            />
          </div>
          {/* {action &&
            (action.type === "internal" ? (
              <MDBox display={{ xs: "none", lg: "inline-block" }}>
                <MDButton
                  component={Link}
                  to={action.route}
                  variant="gradient"
                  color={action.color ? action.color : "info"}
                  size="small"
                >
                  {action.label}
                </MDButton>
              </MDBox>
            ) : (
              <MDBox display={{ xs: "none", lg: "inline-block" }}>
                <MDButton
                  component="a"
                  href={action.route}
                  target="_blank"
                  rel="noreferrer"
                  variant="gradient"
                  color={action.color ? action.color : "info"}
                  size="small"
                  sx={{ mt: -0.3 }}
                >
                  {action.label}
                </MDButton>
              </MDBox>
            ))} */}
          <MDBox
            display={{ xs: "inline-block", lg: "none" }}
            lineHeight={0}
            py={1.5}
            pl={1.5}
            color={transparent ? "white" : "inherit"}
            sx={{ cursor: "pointer" }}
            onClick={openMobileNavbar}
          >
            <Icon fontSize="default">{mobileNavbar ? "close" : "menu"}</Icon>
          </MDBox>
        </MDBox>
        <MDBox
          bgColor={transparent ? "white" : "transparent"}
          shadow={transparent ? "lg" : "none"}
          borderRadius="md"
          px={transparent ? 2 : 0}
        >
          {mobileView && <DefaultNavbarMobile routes={routes} open={mobileNavbar} />}
        </MDBox>
      </MDBox>
      {dropdownMenu}
      {nestedDropdownMenu}
      {openDialog &&
        <div>
          <ScrollDialog isOpen={openDialog} bdayEmployees={bdayEmployees}   overdueSalesOrders={overdueSalesOrders}setSelEmployeeData={setSelEmployeeData} handleOpenBdayModal={handleOpenBdayModal} handleCloseDialog={handleCloseDialog} />
        </div>}
      {isModalOpen && <BirthdayCardModal bdayEmployee={selEmployeeData} isModalOpen={isModalOpen} handleCloseBdayModal={handleCloseBdayModal} />}

    </Container>
  );
}

// Declaring default props for DefaultNavbar
DefaultNavbar.defaultProps = {
  brand: "Material Dashboard PRO",
  transparent: false,
  light: false,
  action: false,
};

// Typechecking props for the DefaultNavbar
DefaultNavbar.propTypes = {
  brand: PropTypes.string,
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
  transparent: PropTypes.bool,
  light: PropTypes.bool,
  action: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.shape({
      type: PropTypes.oneOf(["external", "internal"]).isRequired,
      route: PropTypes.string.isRequired,
      color: PropTypes.oneOf([
        "primary",
        "secondary",
        "info",
        "success",
        "warning",
        "error",
        "dark",
        "light",
        "default",
        "white",
      ]),
      label: PropTypes.string.isRequired,
    }),
  ]),
};

export default DefaultNavbar;
