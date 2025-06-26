import React, { useEffect } from 'react'
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
import FrmDesignationEntry from './FrmDesignationEntry';
import FrmDesignationAccessEntry from './FrmDesignationAccessEntry';
import { useLocation } from 'react-router-dom';
import FrmEarningDeductionMapping from './FrmEarningDeductionMapping';

function getSteps() {
    return ["Designation Information", "Access Rights", "Earning Deduction Mapping"];
}


function FrmDesignation() {
    // Success Msg HANDLING //case no. 1 chnges by ujjwala 3/1/2024 Start
    const { state } = useLocation();
    const { designationId = 0, keyForViewUpdate, compType= 'Masters', designationName } = state || {}

    const [activeStep, setActiveStep] = useState(0);
    const [designation_id, setDesignationId] = useState(designationId)
    const [designation_name, setDesignationName] = useState(designationName)
    const [employee_type, setEmployeeType] = useState()
    const [key, setkey] = useState(keyForViewUpdate)

    const steps = getSteps();
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
    const handleNext = (designationId, keyForViewUpdate, txt_designation_name, employeeType) => {
        setDesignationId(designationId)
        setDesignationName(txt_designation_name)
        setEmployeeType(employeeType)
        setkey(keyForViewUpdate)
        if (designationId !== 0) {
            setActiveStep(parseInt(activeStep) + 1)
        }
    };
    const handleBack = (designationId) => {
        setDesignationId(designationId)
        setActiveStep(parseInt(activeStep) - 1)
    };

    const moveByTabs = (eventKey) => {
        switch (parseInt(eventKey)) {
            case 0:
                setActiveStep(eventKey);
                break;
            case 1:
            case 2:
                if (designation_id !== 0) {
                    setActiveStep(eventKey)
                }
                break;


        }
    }

    function getStepContent() {
        switch (parseInt(activeStep)) {
            case 0:
                return <FrmDesignationEntry goToNext={handleNext} keyForViewUpdate={key} designationId={designation_id} compType={compType} />;
            case 1:
                return <FrmDesignationAccessEntry goBack={handleBack} goToNext={handleNext} keyForViewUpdate={key} designationId={designation_id} designationName={designation_name} compType={compType} employeeType={employee_type} />;
            case 2:
                return <FrmEarningDeductionMapping goBack={handleBack} keyForViewUpdate={key} designationId={designation_id} designationName={designation_name} compType={compType} employeeType={employee_type} />;
        }
    }


    return (
        <>
            <DashboardLayout>
                <div className='main_heding'>
                    <label className='erp-form-label-lg main_heding'>Designation Information {actionType}</label>
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

export default FrmDesignation