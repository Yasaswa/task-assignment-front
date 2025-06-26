import React, { useEffect } from 'react'
import { useState } from "react";
import { useLocation } from 'react-router-dom';

// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 PRO React components
import MDBox from "components/MDBox";

// Material Dashboard 2 PRO React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
// imports react bootstrap
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

import FrmEmployeeGradeEntry from './FrmEmployeeGradeEntry';
import FrmEmployeeGradeAccessEntry from './FrmEmployeeGradeAccessEntry';


function getSteps() {
  return ["Employee Grade Information", "Employee Grade Access Rights"];
}


export default function FrmEmployeeGrade() {
  const [activeStep, setActiveStep] = useState(0);
  const steps = getSteps();

  const { state } = useLocation();
  const { empGradeID = 0, keyForViewUpdate = 'Add', compType = 'Masters',  empGradeName,  txt_empgrade_shortName} = state || {}

  const [employeeGradeId, setEmployeeId] = useState(empGradeID)
  const [viewOrUpdate, setViewOrUpdate] = useState(keyForViewUpdate)
  const [employeename, setEmployeeGradeName] = useState(empGradeName)
  const [employeeShortname, setEmployeeGradeShortName] = useState(txt_empgrade_shortName)


  const handleNext = (employee_grade_id, viewUpdateKey, empGradeName, txt_empgrade_shortName) => {
    if (employee_grade_id !== 0) {
      setEmployeeId(employee_grade_id)
      setViewOrUpdate(viewUpdateKey)
      setEmployeeGradeName(empGradeName)
      setEmployeeGradeShortName(txt_empgrade_shortName)
      setActiveStep((activeStep) + 1)
    }

  };
  const handleBack = (empGradeID) => {
    setEmployeeId(empGradeID)
    setActiveStep((activeStep) - 1)
  };
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

  const moveByTabs = (eventKey) => {
    if (employeeGradeId !== 0)
      setActiveStep(eventKey)
  }

  function getStepContent() {
    switch (parseInt(activeStep)) {
      case 0:
        return <FrmEmployeeGradeEntry goToNext={handleNext} empGradeID={employeeGradeId}/>;
      case 1:
        return <FrmEmployeeGradeAccessEntry goBack={handleBack} empGradeID={employeeGradeId} compType={compType} keyForViewUpdate={viewOrUpdate}  empGradeName={employeename} employeShortName={txt_empgrade_shortName}/>;
    }
  }

  return (
    <>
      <DashboardLayout>
        <div className='main_heding'>
          <label className='erp-form-label-lg main_heding'> Employee Grade Information {actionType}</label>
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
