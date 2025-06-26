// react-router-dom components
import { Link } from "react-router-dom";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @mui material components
import { Breadcrumbs as MuiBreadcrumbs } from "@mui/material";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 PRO React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

function Breadcrumbs({ icon, title, route, light, allRoutes, pathname }) {
  var displayTitle = '';
  const routes = route.slice(0, -1);
  let arr = allRoutes.map((obj) => {
    debugger;
    if (obj.route === pathname) {
      displayTitle = obj.name;
    }
  })
  console.log(arr)
  return (
    <MDBox className='erp_nave_link_path' mr={{ xs: 0, xl: 8 }}>
      <MuiBreadcrumbs
        sx={{
          "& .MuiBreadcrumbs-separator": {
            color: ({ palette: { white, grey } }) => (light ? white.main : grey[600]),
          },
        }}
      >
        <Link to="Masters/CompanyListing">
          <MDTypography
            className="erp_links_css"
            component="span"
            variant="body2"
            color={light ? "white" : "dark"}
            opacity={light ? 0.8 : 0.5}
            sx={{ lineHeight: 0 }}
          >
            <Icon>{icon}</Icon>
          </MDTypography>
        </Link>
        {routes.map((el) => (
          <Link to={`/${el}`} key={el}>
            <MDTypography
              // className="erp_links_css"
              component="span"
              variant="button"
              fontWeight="regular"
              textTransform="capitalize"
              color={light ? "white" : "dark"}
              opacity={light ? 0.8 : 0.5}
              sx={{ lineHeight: 0 }}
            >
              {el}
            </MDTypography>
          </Link>
        ))}
        <MDTypography
          variant="h6"
          fontWeight="bold"
          textTransform="capitalize"
          color={light ? "white" : "dark"}
          sx={{ lineHeight: 0 }}
        >
          {displayTitle}
        </MDTypography>
      </MuiBreadcrumbs>
      <MDTypography
        // className="erp_links_css"
        fontWeight="bold"
        textTransform="capitalize"
        variant="h6"
        color={light ? "white" : "dark"}
        noWrap
      >
        {/* {title.replace("-", " ")} */}
      </MDTypography>
    </MDBox>
  );
}

// Setting default values for the props of Breadcrumbs
Breadcrumbs.defaultProps = {
  light: false,
};

// Typechecking props for the Breadcrumbs
Breadcrumbs.propTypes = {
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  route: PropTypes.oneOfType([PropTypes.string, PropTypes.array]).isRequired,
  light: PropTypes.bool,
};

export default Breadcrumbs;
