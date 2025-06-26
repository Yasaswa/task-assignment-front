import React, { useEffect } from 'react'
import { useState } from "react";
// @mui material components
import Grid from "@mui/material/Grid";
// Material Dashboard 2 PRO React components
import MDBox from "components/MDBox";
// imports react bootstrap
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

// Material Dashboard 2 PRO React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
// Wizard page components
import FrmMBankEntry from "Masters/MBanks/FrmBank/components/FrmMBankEntry"
import FrmMBankContactEntry from "Masters/MBanks/FrmBank/components/FrmMBankContactEntry"
import { useLocation } from 'react-router-dom';

function getSteps() {
  return ["Bank Information", "Bank Contact Information"];
}

function FrmBank() {
  const [activeStep, setActiveStep] = useState(0);
  const steps = getSteps();

  //case no. 1 chnges by ujjwala 3/1/2024 Start
  const { state } = useLocation();
  const { bankID = 0, keyForViewUpdate = 'Add' } = state || {}
  const [bank_id, setBankId] = useState(bankID)
  const [key, setkey] = useState(keyForViewUpdate)
  const [actionType, setActionType] = useState('')

  useEffect(() => {
    ActionType()
  }, [])

  const ActionType = () => {
    switch (keyForViewUpdate) {
      case 'update':
        setActionType('(Modify)');
        break;
      case 'view':
        setActionType('(View)');
        break;
      default:
        setActionType('(Create)');
        break;
    }

  };

  //end by ujjwala
 
  const handleNext = (bankID, keyForViewUpdate) => {
    setBankId(bankID)
    setkey(keyForViewUpdate)
    if (bankID !== 0) {
      setActiveStep(parseInt(activeStep) + 1)
    }
  };
  
  const handleBack = (bankID) => {
    setBankId(bankID)
    setActiveStep(parseInt(activeStep) - 1)
  };
  const moveByTabs = (eventKey) => {
    if (bank_id !== 0) {
      setActiveStep(eventKey)
    }
  }


  function getStepContent() {
    switch (parseInt(activeStep)) {
      case 0:
        return <FrmMBankEntry goToNext={handleNext} bankID={bank_id} />;
      case 1:
        return <FrmMBankContactEntry goToNext={handleNext} goBack={handleBack} keyForViewUpdate={key} bankID={bank_id} />;
      default:
        return null;
    }
  }

  return (
    <DashboardLayout>
      <div className='main_heding'>
        <label className='erp-form-label-lg main_heding'> Bank Information {actionType}</label>
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

export default FrmBank
