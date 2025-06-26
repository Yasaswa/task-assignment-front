import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import React from 'react'
import { useNavigate } from 'react-router-dom'
import MDButton from "components/MDButton";


function FrmShiftRosterListing() {
    const navigate = useNavigate();
    return (
        <>
            <DashboardLayout>
                <div className='row'>
                    <div className="col-sm-1">
                        <MDButton className="erp-gb-button" variant="button" fontWeight="regular" onClick={() => navigate("/Masters/MShiftRoster/MShiftRosterEntry")}>Navigate </MDButton>
                    </div>
                </div>
            </DashboardLayout >
        </>

    )
}

export default FrmShiftRosterListing