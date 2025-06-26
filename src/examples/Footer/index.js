// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Link from "@mui/material/Link";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 PRO React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 PRO React base styles
import typography from "assets/theme/base/typography";

function Footer({ company, links }) {
  const { href, name } = company;
  const { size } = typography;

  // const renderLinks = () =>
  //   links.map((link) => (
  //     <MDBox key={link.name} component="li" px={2} lineHeight={1}>
  //       <Link href={link.href} target="_blank">
  //         <MDTypography variant="button" fontWeight="regular" color="text">
  //           {link.name}
  //         </MDTypography>
  //       </Link>
  //     </MDBox>
  //   ));

  return (
    <MDBox
      className="erp_footer mt-2"
      width="100%"
      display="flex"
      flexDirection={{ xs: "column", lg: "row" }}
      justifyContent="space-between"
      alignItems="center"
      px={1.5}
    >
      <MDBox
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexWrap="wrap"
        color="text"
        fontSize={size.sm}
        px={1.5}
        style={{ color: "#fff" }}
      >
        &copy; {new Date().getFullYear()}, Designed & Developed by
        {/* <MDBox fontSize={size.md} color="text" mb={-0.5} mx={0.25}>
          <Icon color="inherit" fontSize="inherit">
            favorite
          </Icon>
        </MDBox> */}
        <Link href={href} target="_blank">
          <MDTypography variant="button" fontWeight="medium" style={{ color: "#fff" }} >
            &nbsp;{name}&nbsp;
            {/* &nbsp;Dakshabhi It Solutions&nbsp; */}

          </MDTypography>
        </Link>
        {/* for a better web. */}
      </MDBox>
      <MDBox
        component="ul"
        sx={({ breakpoints }) => ({
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "center",
          listStyle: "none",
          mt: 0,
          mb: 0,
          p: 0,

          [breakpoints.up("lg")]: {
            mt: 0,
          },
        })}
      >
        {/* {renderLinks()} */}
      </MDBox>
    </MDBox>
  );
}

// Setting default values for the props of Footer
Footer.defaultProps = {
  company: { href: "https://www.dakshabhi.com/", name: "Dakshabhi It Solutions, Pune" },
  links: [
    { href: "#", name: "Dakshabhi It Solutions, Pune" },
  ],
};

// Typechecking props for the Footer
Footer.propTypes = {
  company: PropTypes.objectOf(PropTypes.string),
  links: PropTypes.arrayOf(PropTypes.object),
};

export default Footer;
