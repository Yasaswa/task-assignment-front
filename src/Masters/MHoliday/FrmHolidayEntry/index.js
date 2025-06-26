import React from 'react'
import { useState, useEffect, useRef } from "react";
import $ from 'jquery';


// Material Dashboard 2 PRO React components
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Imports React bootstrap
import Form from 'react-bootstrap/Form';

// import react icons
import { useNavigate, useLocation } from "react-router-dom";

// File Imports
import ComboBox from "Features/ComboBox";
import ErrorModal from "components/Modals/ErrorModal";
import SuccessModal from "components/Modals/SuccessModal";
import FrmValidations from "FrmGeneric/FrmValidations";
import ConfigConstants from "assets/Constants/config-constant";



function FrmHolidayEntry() {

    var activeValue = '';

    const child = useRef();
    const configConstants = ConfigConstants();
    const { COMPANY_ID, COMPANY_BRANCH_ID, UserName } = configConstants;
    const { state } = useLocation();
    const { productionHolidayId = 0, keyForViewUpdate = 'Add', compType = 'Masters' } = state || {}
    // For navigate
    const navigate = useNavigate();
    // Add Product Type Form Fields
    const validate = useRef();


    const [txt_Holiday_ID, settxt_Holiday_ID] = useState(productionHolidayId);
    const [txt_Holiday_Name, settxt_Holiday_Name] = useState('');
    const [txt_Holiday_Description, settxt_Holiday_Description] = useState('');
    const [txt_Holiday_date, settxt_Holiday_date] = useState('');
    const [actionType, setActionType] = useState('')
    const [actionLabel, setActionLabel] = useState('Save')


    // Error Msg HANDLING
    const handleCloseErrModal = () => setShowErrorMsgModal(false);
    const [showErrorMsgModal, setShowErrorMsgModal] = useState(false);
    const [errMsg, setErrMsg] = useState('');

    // Success Msg HANDLING
    const handleCloseSuccessModal = () => {
        setShowSuccessMsgModal(false);
        if (sessionStorage.getItem('dataAddedByCombo') !== 'dataAddedByCombo') {
            navigate(`/Masters/MHoliday/FrmHolidayListing`);
        }
    }

    useEffect(() => {
        const functionCall = async () => {
            await ActionType();
            if (productionHolidayId !== 0) {
                await FnCheckUpdateResponce();
            }
        }
        functionCall()
    }, [])



    const [showSuccessMsgModal, setShowSuccessMsgModal] = useState(false);
    const [succMsg, setSuccMsg] = useState('');
    
    const FnCheckUpdateResponce = async () => {
        debugger;
        try {
            const apiCall = await fetch(`${process.env.REACT_APP_BASE_URL}/api/XmProductionHoliday/FnShowParticularRecordForUpdate/${txt_Holiday_ID}/${COMPANY_ID}`)
            const updateRes = await apiCall.json();

            let resp = (updateRes.data)
            settxt_Holiday_ID(resp.production_holiday_id)
            settxt_Holiday_Name(resp.production_holiday_name);
            settxt_Holiday_Description(resp.production_holiday_remark);
            settxt_Holiday_date(resp.production_holiday_date);

            $('#saveBtn').show();

            switch (resp.is_active) {
                case true:
                    document.querySelector('input[name="isactive"][value="1"]').checked = true;
                    break;
                case false:
                    document.querySelector('input[name="isactive"][value="0"]').checked = true;
                    break;
                default: break;
            }


        } catch (error) {
            console.log("error", error)
            navigate('/Error')
        }
    }

    const ActionType = async () => {
        switch (keyForViewUpdate) {
            case 'update':
                setActionType('(Modification)');
                setActionLabel('Update')
                $('#txt_Holiday_Name').attr('disabled', true);
                $('#txt_Holiday_date').attr('disabled', true);
                $('#saveBtn').attr('disabled', false);
                break;
            case 'view':
                // test case 2 shivanjali
                setActionType('(View)');
                $("input[type=radio]").attr('disabled', true);
                await validate.current.readOnly("ProductionHolidayId");
                break;
            default:
                setActionType('(Creation)');
                break;
        }
    };
    const handleSubmit = async () => {
        debugger

        try {
            const checkIsValidate = await validate.current.validateForm("ProductionHolidayId");

            if (checkIsValidate === true) {
                var active;

                activeValue = document.querySelector('input[name=isactive]:checked').value

                switch (activeValue) {
                    case '1': active = true; break;
                    case '0': active = false; break;
                    default: break;
                }
                const data = {
                    company_id: COMPANY_ID,
                    created_by: UserName,
                    modified_by: productionHolidayId === 0 ? null : UserName,
                    production_holiday_id: txt_Holiday_ID,
                    company_branch_id: COMPANY_BRANCH_ID,
                    production_holiday_name: txt_Holiday_Name,
                    production_holiday_date: txt_Holiday_date,
                    production_holiday_remark: txt_Holiday_Description,
                    is_active: active,


                };
                console.log(data);
                const requestOptions = {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                };
                const apicall = await fetch(`${process.env.REACT_APP_BASE_URL}/api/XmProductionHoliday/FnAddUpdateRecord`, requestOptions)
                const responce = await apicall.json()
                console.log("response error: ", responce);
                if (responce.success === '0') {
                    console.log("response error: ", responce.error);
                    setErrMsg(responce.error)
                    setShowErrorMsgModal(true)

                } else {
                    const evitCache = child.current.evitCache();
                    console.log(evitCache);
                    setSuccMsg(responce.message)
                    setShowSuccessMsgModal(true);
                    clearFormFields();

                }

            }
        } catch (error) {
            console.log("error: ", error)
            navigate('/Error')
        }

    };

    const clearFormFields = () => {
        settxt_Holiday_ID('');
        settxt_Holiday_Name('');
        settxt_Holiday_Description('');

    }

    const validateFields = () => {
        validate.current.validateFieldsOnChange('ProductionHolidayId')
    }


    return (
        <>

            <ComboBox ref={child} />
            <FrmValidations ref={validate} />
            <div className="erp_top_Form">
                <div className='card p-1'>
                    <div className='card-header text-center py-0'>
                        <label className='erp-form-label-lg main_heding'>Production Holiday{actionType}</label>
                    </div>
                    <form id="ProductionHolidayId">
                        <div className="row erp_transporter_div">

                            {/* first row */}


                            <div className="col-sm-6 erp_filter_group-by-result">

                                <div className='row'>
                                    <div className='col-sm-3'>
                                        <Form.Label className="erp-form-label">Holiday Name<span className="required">*</span></Form.Label>
                                    </div>
                                    <div className='col'>
                                        {/* test case 1 shivanjali */}
                                        <Form.Control type="text" id="txt_Holiday_Name" className="erp_input_field" value={txt_Holiday_Name} onChange={e => { settxt_Holiday_Name(e.target.value); validateFields(); }} maxLength="500" />
                                        <MDTypography variant="button" id="error_txt_Holiday_Name" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                                        </MDTypography>
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col-sm-3'>
                                        <Form.Label className="erp-form-label">Holiday Date<span className="required">*</span></Form.Label>
                                    </div>
                                    <div className='col'>
                                        <Form.Control type="Date" id="txt_Holiday_date" className="erp_input_field" value={txt_Holiday_date} onChange={e => { settxt_Holiday_date(e.target.value); validateFields(); }} />
                                        <MDTypography variant="button" id="error_txt_Holiday_date" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                                        </MDTypography>
                                    </div>
                                </div>

                            </div>

                            {/* second row */}

                            <div className="col-sm-6 erp_filter_group-by-result">
                                <div className="row">
                                    <div className='col-sm-3'>
                                        <Form.Label className="erp-form-label">Holiday Remark</Form.Label>
                                    </div>
                                    <div className="col">
                                        <Form.Control as="textarea" rows={1} id="txt_Holiday_Description" className="erp_txt_area" value={txt_Holiday_Description} onInput={e => { settxt_Holiday_Description(e.target.value); }} maxlength="500" optional="optional" />
                                        <MDTypography variant="button" id="error_txt_Holiday_Description" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}></MDTypography>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-sm-3">
                                        <Form.Label className="erp-form-label">Is Active</Form.Label>
                                    </div>
                                    <div className="col">
                                        <div className="erp_form_radio">
                                            <div className="fCheck">
                                                <Form.Check
                                                    className="erp_radio_button"
                                                    label="Yes"
                                                    type="radio"
                                                    value="1"
                                                    name="isactive"
                                                    defaultChecked
                                                />
                                            </div>
                                            <div className="sCheck">
                                                <Form.Check
                                                    className="erp_radio_button"
                                                    label="No"
                                                    value="0"
                                                    type="radio"
                                                    name="isactive"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>

                        </div>

                    </form>
                    <div className="card-footer py-0 text-center">
                        <MDButton type="button" className="erp-gb-button"
                            onClick={() => {
                                const path = compType === 'Register' ? '/Masters/MHoliday/FrmHolidayListing/reg' : '/Masters/MHoliday/FrmHolidayListing';
                                navigate(path);
                            }}
                            variant="button"
                            fontWeight="regular">Back</MDButton>
                        <MDButton type="submit" onClick={handleSubmit} id="saveBtn" className={`erp-gb-button ms-2 ${keyForViewUpdate === 'view' ? 'd-none' : 'display'}`} variant="button"
                            fontWeight="regular">{actionLabel}</MDButton>

                    </div >
                </div>

                {/* Success Msg Popup */}
                <SuccessModal handleCloseSuccessModal={() => handleCloseSuccessModal()} show={[showSuccessMsgModal, succMsg]} />
                {/* Error Msg Popup */}
                <ErrorModal handleCloseErrModal={() => handleCloseErrModal()} show={[showErrorMsgModal, errMsg]} />

            </div>
        </>
    )
}

export default FrmHolidayEntry