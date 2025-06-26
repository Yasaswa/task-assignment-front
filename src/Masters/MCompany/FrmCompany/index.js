import { useState } from "react";

// @mui material components
import Grid from "@mui/material/Grid";


// Material Dashboard 2 PRO React components
import MDBox from "components/MDBox";


// Material Dashboard 2 PRO React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";


// Wizard page components
import Company from "Masters/MCompany/FrmCompany/components/FrmMCompanyEntry";
import Branch from "Masters/MCompany/FrmCompany/components/FrmMBranchEntry";
import Directors from "Masters/MCompany/FrmCompany/components/FrmMDirectorsEntry";

// imports react bootstrap
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import ConfigConstants from "assets/Constants/config-constant";

function getSteps() {
  return ["Company Information", "Branch Information", "Directors Information"];
}

function FrmCompany() {
  // Call ConfigConstants to get the configuration constants
  // const configConstants = ConfigConstants();
  // const { COMPANY_ID } = configConstants;

  const [activeStep, setActiveStep] = useState(0);
  const steps = getSteps();

  const handleNext = () => { setActiveStep((parseInt(activeStep) + 1)) };
  const handleBack = () => setActiveStep((parseInt(activeStep) - 1));

  const moveByTabs = (eventKey) => {
   let company_id = sessionStorage.getItem('companyID')
    // if (company_id !== null && company_id !== '' && company_id !== 'undefined') {
      setActiveStep(eventKey)
    // }
  }

  function getStepContent() {
    switch (parseInt(activeStep)) {
      case 0:
        return <Company goToNext={handleNext} />;
      case 1:
        return <Branch goToNext={handleNext} goBack={handleBack} />;
      case 2:
        return <Directors goBack={handleBack} />;
      default:
        return null;
    }
  }

  return (
    <>
      <DashboardLayout>
        <div className='main_heding'>
          <label className='erp-form-label-lg main_heding'> Company Information</label>
        </div>
        <MDBox pt={3} pb={8} className="erp_form_tab_div">
          <Grid justifyContent="center" sx={{ my: 4 }} >
            <Grid item xs={12} lg={8} className="erp_form_container_tabs">
              <MDBox mt={-3} mx={2}>
                <Tabs
                  activeKey={activeStep}
                  id="uncontrolled-tab-example"
                  className="mb-3 selectedTab erp-form-Tabs" onSelect={eventKey => moveByTabs(eventKey)}>
                  {steps.map((label, index) => (
                    <Tab eventKey={index} title={label} ></Tab>
                  ))}
                </Tabs>
                {getStepContent()}
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>
        {/* <Footer /> */}
      </DashboardLayout>
    </>
  );
}

export default FrmCompany;
