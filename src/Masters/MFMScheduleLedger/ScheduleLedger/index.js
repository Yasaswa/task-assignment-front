import React from 'react'
import { useState } from "react";

// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 PRO React components
import MDBox from "components/MDBox";


// Material Dashboard 2 PRO React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";

// imports react bootstrap
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';


import MFMScheduleLedgerEntry from './component/MFMScheduleLedgerEntry';
import MFMGeneralLeaderMapping from './component/MFMGeneralLeaderMapping';



function getSteps() {
  return ["MFMScheduleLedgerEntry", "Contact Information"];
}


function ScheduleLedger() {
  const [activeStep, setActiveStep] = useState(0);
  const steps = getSteps();
  const isLastStep = activeStep === steps.length - 1;

  const handleNext = () => setActiveStep(activeStep + 1);
  const handleBack = () => setActiveStep(activeStep - 1);

  const moveByTabs = (eventKey) => {
    var transporterID = sessionStorage.getItem('transporterID');
    if (transporterID !== null && transporterID !== '') {
      setActiveStep(eventKey)
    }
  }

  function getStepContent() {
    switch (parseInt(activeStep)) {
      case 0:
        return <MFMScheduleLedgerEntry goToNext={handleNext} goBack={handleBack} />;
      case 1:
        return <MFMGeneralLeaderMapping goBack={handleBack} goToNext={handleNext} />;
    
      default:
        return null;
    }
  }

  return (
    <DashboardLayout>

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
  )
}
export default ScheduleLedger
