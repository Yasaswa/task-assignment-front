import React, { useRef } from 'react'
import { useState, useEffect } from "react";
import $ from 'jquery';

// Material Dashboard 2 PRO React components
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
// Imports React bootstrap
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { useLocation, useNavigate } from "react-router-dom";
// File Imports
import ErrorModal from "components/Modals/ErrorModal";
import SuccessModal from "components/Modals/SuccessModal";
import ConfigConstants from 'assets/Constants/config-constant';
import FrmValidations from 'FrmGeneric/FrmValidations';

// File Imports
import ComboBox from "Features/ComboBox";

function CommonParamterEntry({ master_name = '', btn_disabled = false }) {
    //changes by ujjwala on 15/1/2024
    // Call ConfigConstants to get the configuration constants
    const configConstants = ConfigConstants();
    const { COMPANY_ID, UserName } = configConstants;
    const { state } = useLocation();
    const { commonparamterID = 0, keyForViewUpdate = 'Add', compType = 'Masters' } = state || {}
    const validate = useRef();
    const comboDataAPiCall = useRef();
    var activeValue = '';
    // Add Product Type Form Fields
    const [common_parameters_id, setcommonparameters_id] = useState(commonparamterID !== undefined ? commonparamterID : 0);

    //const [common_parameters_id, setcommonparameters_id] = useState(commonparamterID);
    const [txt_common_parameter_master_name, setcommonParameterMasterName] = useState(master_name);
    const [txt_common_parameters_name, setcommonParametersName] = useState('');
    const [txt_common_parameters_value, setcommonParametersValue] = useState('');
    const [actionType, setActionType] = useState('')
    const [actionLabel, setActionLabel] = useState('Save')


    // Error Msg HANDLING
    const handleCloseErrModal = () => setShowErrorMsgModal(false);
    const [showErrorMsgModal, setShowErrorMsgModal] = useState(false);
    const [errMsg, setErrMsg] = useState('');

    // Show ADD record Modal
    const handleCloseRecModal = async () => {
        setShowAddRecModal(false);

    }
    const [showAddRecModal, setShowAddRecModal] = useState(false);

    // Success Msg HANDLING
    const handleCloseSuccessModal = () => {
        setShowSuccessMsgModal(false);
        if (sessionStorage.getItem('dataAddedByCombo') !== 'dataAddedByCombo') {
            navigate(`/Masters/MCommonParameter/CommonParamterListing`);
        }
    }
    const [showSuccessMsgModal, setShowSuccessMsgModal] = useState(false);
    const [succMsg, setSuccMsg] = useState('');

    // For navigate
    const navigate = useNavigate();

    useEffect(() => {
        const loadDataOnload = async () => {
             
            await ActionType()
            if (commonparamterID !== 0) {
                await FnCheckUpdateResponce()
            }
        }
        loadDataOnload()
    }, [])

    const ActionType = async () => {
        switch (keyForViewUpdate) {
            case 'update':
                setActionType('(Modify)');
                setActionLabel('Update')
                $('#rb_departmentType').attr('disabled', true)
                $('#departmentGroup').attr('disabled', true)
                $('#departmentName').attr('disabled', true)
                $('#shortName').attr('disabled', true)
                break;
            case 'view':
                setActionType('(View)');
                //changes done by shivanjali 18-01-24
                await validate.current.readOnly("CommonParamterFormId");
                $("input[type=radio]").attr('disabled', true);
                break;
            default:
                setActionType('(Create)');
                break;
        }
    };

    const handleSubmit = async () => {
        try {
            const checkIsValidate = await validate.current.validateForm("CommonParamterFormId");

            if (checkIsValidate === true) {
                let active;
                activeValue = document.querySelector('input[name=isactive]:checked').value

                switch (activeValue) {
                    case '1': active = true; break;
                    case '0': active = false; break;

                }
                const data = {
                    company_id: COMPANY_ID,
                    created_by: UserName,
                    common_parameters_id: common_parameters_id,
                    modified_by: common_parameters_id === null ? null : UserName,
                    common_parameters_master_name: txt_common_parameter_master_name,
                    common_parameters_name: txt_common_parameters_name,
                    common_parameters_value: txt_common_parameters_value,
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
                const apicall = await fetch(`${process.env.REACT_APP_BASE_URL}/api/CmCommonParameters/FnAddUpdateRecord`, requestOptions)
                const responce = await apicall.json()
                console.log("response error: ", responce);
                if (responce.error !== "") {
                    console.log("response error: ", responce.error);
                    setErrMsg(responce.error)
                    setShowErrorMsgModal(true)

                } else {
                    const evitCache = await comboDataAPiCall.current.evitCache();
                    console.log(evitCache);
                    setSuccMsg(responce.message)
                    setShowSuccessMsgModal(true);
                }
            }
        } catch (error) {
            console.log("error: ", error)
            navigate('/Error')
        }

    };


    const FnCheckUpdateResponce = async () => {
        try {

            const apiCall = await fetch(`${process.env.REACT_APP_BASE_URL}/api/CmCommonParameters/FnShowParticularRecordForUpdate/${common_parameters_id}/${COMPANY_ID}`)
            const updateRes = await apiCall.json();
            setcommonparameters_id(updateRes.data.common_parameters_id);
            setcommonParameterMasterName(updateRes.data.common_parameters_master_name);
            setcommonParametersName(updateRes.data.common_parameters_name);
            setcommonParametersValue(updateRes.data.common_parameters_value);
            $('#saveBtn').show();

            switch (updateRes.is_active) {
                case true:
                    document.querySelector('input[name="isactive"][value="1"]').checked = true;
                    break;
                case false:
                    document.querySelector('input[name="isactive"][value="0"]').checked = true;
                    break;
            }
        } catch (error) {
            console.log("error", error)
            navigate('/Error')
        }
    }


    const validateFields = () => {
        validate.current.validateFieldsOnChange('CommonParamterFormId')
    }


    return (
        <>
            <FrmValidations ref={validate} />
            <ComboBox ref={comboDataAPiCall} />
            <div className="erp_top_Form">
                <div className='card p-1'>
                    <div className='card-header text-center py-0'>
                        <label className='erp-form-label-lg text-center'>Common Parameter {actionType} </label>
                    </div>
                    <form id="CommonParamterFormId">
                        <div className="row erp_transporter_div">

                            {/* first row */}

                            <div className="col-sm-6 erp_filter_group-by-result">
                                <div className='row'>
                                    <div className='col-sm-3'>
                                        <Form.Label className="erp-form-label">Master Name<span className="required">*</span></Form.Label>
                                    </div>
                                    <div className='col'>
                                        <Form.Control type="text" id="txt_common_parameter_master_name" className="erp_input_field" value={txt_common_parameter_master_name} onChange={e => { setcommonParameterMasterName(e.target.value); validateFields(); }} maxLength="255"
                                         disabled={master_name.trim() !== ''} />
                                        <MDTypography variant="button" id="error_txt_common_parameter_master_name" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                                        </MDTypography>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className='col-sm-3'>
                                        <Form.Label className="erp-form-label">Name<span className="required">*</span></Form.Label>
                                    </div>
                                    <div className='col'>
                                        <Form.Control type="text" id="txt_common_parameters_name" className="erp_input_field" value={txt_common_parameters_name} onChange={e => { setcommonParametersName(e.target.value); validateFields(); }} maxLength="255" />
                                        <MDTypography variant="button" id="error_txt_common_parameters_name" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                                        </MDTypography>
                                    </div>

                                </div>



                            </div>

                            {/* second row */}

                            <div className="col-sm-6 erp_filter_group-by-result">



                                <div className="row">
                                    <div className='col-sm-3'>
                                        <Form.Label className="erp-form-label">Value<span className="required">*</span></Form.Label>
                                    </div>
                                    <div className='col'>
                                        <Form.Control type="text" id="txt_common_parameters_value" className="erp_input_field" value={txt_common_parameters_value} onChange={e => { setcommonParametersValue(e.target.value); validateFields(); }} maxLength="255" />
                                        <MDTypography variant="button" id="error_txt_common_parameters_value" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                                        </MDTypography>
                                    </div>

                                </div>
                                <div className="row">
                                    <div className="col-sm-3">
                                        <Form.Label className="erp-form-label">Active</Form.Label>
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
                                const path = compType === 'Register' ? '/Masters/MCommonParameter/CommonParamterListing/reg' : '/Masters/MCommonParameter/CommonParamterListing';
                                navigate(path);
                            }}

                            variant="button" disabled={btn_disabled ? true : false}
                            fontWeight="regular">Back</MDButton>
                        <MDButton type="submit" onClick={handleSubmit} className={`erp-gb-button ms-2 ${keyForViewUpdate === 'view' ? 'd-none' : 'display'}`} variant="button"
                            fontWeight="regular">{actionLabel}</MDButton>
                    </div >


                </div>

                {/* Add new Record Popup */}
                <Modal size="lg" show={showAddRecModal} onHide={handleCloseRecModal} backdrop="static" keyboard={false} centered >
                    <Modal.Header>
                        <Modal.Title className='erp_modal_title'>CommonParameter</Modal.Title>
                        <span><button type="button" className="erp-modal-close btn-close" aria-label="Close" onClick={handleCloseRecModal}></button></span>
                    </Modal.Header>
                    <Modal.Body className='erp_city_modal_body'>
                        {/* <FrmMProductTypeEntry /> */}
                    </Modal.Body>
                    <Modal.Footer>
                        <MDButton type="button" onClick={handleCloseRecModal} className="btn erp-gb-button" variant="button"
                            fontWeight="regular">Close</MDButton>

                    </Modal.Footer>
                </Modal >

                {/* Success Msg Popup */}
                <SuccessModal handleCloseSuccessModal={() => handleCloseSuccessModal()} show={[showSuccessMsgModal, succMsg]} />
                {/* Error Msg Popup */}
                <ErrorModal handleCloseErrModal={() => handleCloseErrModal()} show={[showErrorMsgModal, errMsg]} />


            </div>
        </>
    )
}

export default CommonParamterEntry