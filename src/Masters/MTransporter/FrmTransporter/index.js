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

// wizard page component
import FrmMTransporterEntry from "Masters/MTransporter/FrmTransporter/components/FrmMTransporterEntry";
import FrmTransporterAccessRightsEntry from './components/FrmTransporterAccessRightsEntry';
import { useLocation } from 'react-router-dom';



function getSteps() {
  return ["Transporter Information", "Access Rights"];
}

function FrmTransporter() {
  var { state } = useLocation();
  const { transporterId = 0, transporter_name, transporter_vendor_code, keyForViewUpdate, compType = 'Masters' } = state || {}

  const [activeStep, setActiveStep] = useState(0);
  const steps = getSteps();

  const [transporter_id, setTransporterId] = useState(transporterId)
  const [transporterName, setTransporterName] = useState(transporter_name)
  const [transporterVendorCode, setTransporterVendorCode] = useState(transporter_vendor_code)

  const handleNext = (transporter_id, transporter_name, transporter_vendor_code) => {
    setTransporterId(transporter_id)
    setTransporterName(transporter_name)
    setTransporterVendorCode(transporter_vendor_code)

    if (transporter_id !== 0)
      setActiveStep((parseInt(activeStep) + 1))
  };
  const handleBack = (transporter_id) => {
    setTransporterId(transporter_id)
    setActiveStep((parseInt(activeStep) - 1))
  };

  const moveByTabs = (eventKey) => {
    if (transporter_id !== 0) {
      setActiveStep(eventKey)
    }
  }


  function getStepContent() {
    switch (parseInt(activeStep)) {
      case 0:
        return <FrmMTransporterEntry goToNext={handleNext} transporter_id={transporter_id} />;
      case 1:
        return <FrmTransporterAccessRightsEntry goBack={handleBack} transporterId={transporter_id}
          transporterName={transporterName}
          transporterVendorCode={transporterVendorCode} compType={compType} keyForViewUpdate={keyForViewUpdate}/>
      default:
        return null;
    }
  }

  return (
    <DashboardLayout>
      <div className='main_heding'>
        <label className='erp-form-label-lg main_heding'> Transporter Information {keyForViewUpdate === 'update' ? '(Modification)' : keyForViewUpdate === 'update' ? '(View)' : '(Creation)'}</label>
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
  )
}
export default FrmTransporter
