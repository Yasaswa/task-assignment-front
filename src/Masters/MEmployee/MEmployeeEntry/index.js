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
import ConfigConstants from "assets/Constants/config-constant";


import FrmMEmployeesEntry from './components/FrmMEmployeesEntry';
import FrmMEmployeeAccessRights from './components/FrmMEmployeeAccessRights';



export default function MEmployeeEntry() {
  // Config Constant
    const configConstants = ConfigConstants();
    const {UserId } = configConstants;
  const [activeStep, setActiveStep] = useState(0);
  
function getSteps() {
  // return ["Employee Information", "Employee Access Rights"];
  const allSteps = ["Employee Information", "Employee Access Rights"];
  return UserId === 1 ?  allSteps : [allSteps[0]];
}
  const steps = getSteps();

  const { state } = useLocation();
  const { employeeID = 0, keyForViewUpdate = 'Add', compType = 'Masters',
    designation_id, employee_code, employee_name, employee_type, gradeId } = state || {}

  const [employeeId, setEmployeeId] = useState(employeeID)
  const [viewOrUpdate, setViewOrUpdate] = useState(keyForViewUpdate)
  const [designationId, setDesignationId] = useState(designation_id)
  const [employeeCode, setEmployeeCode] = useState(employee_code)
  const [employeeName, setEmployeeName] = useState(employee_name)
  const [employeeType, setEmployeeType] = useState(employee_type)
  const [grade_id, setGradeId] = useState(gradeId)


  // && employeeType !== 'Worker' -> removed this condition as per the discussion with prashant sir. on 10-07-24
  const handleNext = (employee_id, viewUpdateKey, designation_id, employee_code, employee_name, gradeId, employee_type) => {
    if (employee_id !== 0) {  
      setEmployeeId(employee_id)
      setDesignationId(designation_id)
      setViewOrUpdate(viewUpdateKey)
      setEmployeeCode(employee_code)
      setEmployeeName(employee_name)
      setEmployeeType(employee_type)
      setGradeId(gradeId)
      setActiveStep((activeStep) + 1)
    }

  };
  const handleBack = (employeeID) => {
    setEmployeeId(employeeID)
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
      case 'approve':
        setActionType('(Approve)');
        break;
      default:
        setActionType('(Create)');
        break;
    }

  };

  const moveByTabs = (eventKey) => {
    debugger
    // && employeeType !== 'Worker' -> removed this condition as per the discussion with prashant sir. on 10-07-24
    if (employeeId !== 0 && UserId === 1)
      setActiveStep(eventKey)
  }

  function getStepContent() {
    switch (parseInt(activeStep)) {
      case 0:
        return <FrmMEmployeesEntry goToNext={handleNext} employeeID={employeeId} />;
      case 1:
        return <FrmMEmployeeAccessRights goBack={handleBack} employeeID={employeeId} compType={compType} keyForViewUpdate={viewOrUpdate} designationId={designationId} employeeCode={employeeCode} employeeName={employeeName} gradeId={grade_id} />;
    }
  }

  return (
    <>
      <DashboardLayout>
        <div className='main_heding'>
          <label className='erp-form-label-lg main_heding'> Employee Information {actionType}</label>
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
