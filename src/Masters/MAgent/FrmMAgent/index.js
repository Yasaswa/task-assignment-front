import React, { useEffect } from 'react'

// @mui material components
import Grid from "@mui/material/Grid";
import { useState } from "react";

// Material Dashboard 2 PRO React components
import MDBox from "components/MDBox";

// imports react bootstrap
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

// Material Dashboard 2 PRO React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import Agent from "Masters/MAgent/FrmMAgent/components/FrmAgentEntry";
import FrmAgentAccessRightsEntry from './components/FrmAgentAccessRightsEntry';
import { useLocation } from 'react-router-dom';

function getSteps() {
    return ["Agent Information", "Access Rights"];
}

export default function FrmAgent() {
    const { state } = useLocation();
    const { agentID = 0, agent_name, agent_vendor_code, keyForViewUpdate = 'Add', compType = 'Masters' } = state || {}

    const [agent_id, setAgentId] = useState(agentID)
    const [agentName, setAgentName] = useState(agent_name)
    const [agentVendorCode, setAgentVendorCode] = useState(agent_vendor_code)
    const [key, setkey] = useState(keyForViewUpdate)
    const [actionType, setActionType] = useState('')


    const [activeStep, setActiveStep] = useState(0);
    const steps = getSteps();

    useEffect(() => {
        ActionType()
    }, []);

    const ActionType = () => {
        switch (keyForViewUpdate) {
            case 'update':
                setActionType('(Modification)');
                break;
            case 'view':
                setActionType('(View)');
                break;
            default:
                setActionType('(Creation)');
                break;
        }

    };

    const handleNext = (agentId, agentVendorCode, agentName, keyForViewUpdate) => {
        setAgentId(agentId)
        setAgentVendorCode(agentVendorCode)
        setAgentName(agentName)
        setkey(keyForViewUpdate)
        if (agentId !== 0) {
            setActiveStep(parseInt(activeStep) + 1)
        }
    };
    const handleBack = (agentId) => {
        setAgentId(agentId)
        setActiveStep(activeStep - 1)
    };

    const moveByTabs = (eventKey) => {
        if (agent_id !== 0) {
            setActiveStep(eventKey)
        }
    }

    function getStepContent() {
        switch (parseInt(activeStep)) {
            case 0:
                return <Agent goToNext={handleNext} agentId={agent_id}/>;
            case 1:
                return <FrmAgentAccessRightsEntry goBack={handleBack} keyForViewUpdate={key} agentId={agent_id} agentVendorCode={agentVendorCode} agentName={agentName} compType={compType}/>
            default:
                return null;
        }
    }

    return (
        <>
            <DashboardLayout>
                <div className='main_heding'>
                    <label className='erp-form-label-lg main_heding'> Agent Information {actionType}</label>
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
    )
}
