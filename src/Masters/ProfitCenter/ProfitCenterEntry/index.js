import React from 'react'
import { useState, useEffect, useRef } from "react";
import ComboBox from "Features/ComboBox";
import $ from 'jquery';
import { resetGlobalQuery } from 'assets/Constants/config-constant';
import { globalQuery } from 'assets/Constants/config-constant';

// Material Dashboard 2 PRO React components
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Imports React bootstrap
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

// import react icons
import { useNavigate, useLocation } from "react-router-dom";

// File Imports
import ErrorModal from "components/Modals/ErrorModal";
import SuccessModal from "components/Modals/SuccessModal";
import ConfigConstants from "assets/Constants/config-constant";
import FrmValidations from 'FrmGeneric/FrmValidations';


function ProfitCenterEntry(props) {
    var activeValue = '';
    const validate = useRef();

    const { state } = useLocation();
    const configConstants = ConfigConstants();
    const { COMPANY_ID, COMPANY_BRANCH_ID, UserName } = configConstants;
    const { profitcenterID = 0, keyForViewUpdate, compType } = state || {}
    const comboDataAPiCall = useRef();

    // Add Product Type Form Fields
    const [profit_center_id, setprofitcenter_id] = useState(profitcenterID);
    const [txt_profit_center_name, setprofitcenterName] = useState('');
    const [txt_profit_center_Short_Name, setprofitcenterShortName] = useState('');
    const [actionType, setActionType] = useState('')
    const [actionLabel, setActionLabel] = useState('Save')
    const [txt_profit_center_group, setProfitCenterGroup] = useState('');
    const [profitCenterOption, setProfitCenterOption] = useState([]);
    const [txt_pc_group_ShortName, setPcGroupShortName] = useState('');

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
            navigate(`/Masters/ProfitCenterListing`);
        }

    }
    const [showSuccessMsgModal, setShowSuccessMsgModal] = useState(false);
    const [succMsg, setSuccMsg] = useState('');

    // For navigate
    const navigate = useNavigate();

    useEffect(() => {
        const functionCall = async () => {
            await ActionType();
            await FillComobos();
            await FnCheckUpdateResponce();
        }
        functionCall()
    }, [])

    //fill combo onload
    const FillComobos = async () => {
        try {
            resetGlobalQuery();
            globalQuery.columns = ['field_id', 'field_name', 'property_value'];
            globalQuery.table = "amv_properties";
            globalQuery.conditions.push({ field: "company_id", operator: "IN", values: [parseInt(COMPANY_ID),0] });
            globalQuery.conditions.push({ field: "properties_master_name", operator: "=", value: 'ProfitCenterGroups' });
            globalQuery.conditions.push({ field: "is_delete", operator: "=", value: 0 });
            globalQuery.orderBy = ['property_name']
            const profitCenterList = await comboDataAPiCall.current.fillFiltersCombo(globalQuery);
            setProfitCenterOption(profitCenterList);

        } catch (error) {
            console.log("error : ", error)
        }

    }

    // fill field onchange GroupName
    const ShowShortGroupName = async () => {
        
        const profitGroupName = document.getElementById('txt_profit_center_group').value;
        resetGlobalQuery();
        globalQuery.columns = ['field_id', 'field_name', 'property_value'];
        globalQuery.table = "amv_properties";
        globalQuery.conditions.push({ field: "company_id", operator: "IN", values: [parseInt(COMPANY_ID),0] });
        globalQuery.conditions.push({ field: "properties_master_name", operator: "=", value: 'ProfitCenterGroups' });
        globalQuery.conditions.push({ field: "field_name", operator: "=", value: profitGroupName });
        globalQuery.conditions.push({ field: "is_delete", operator: "=", value: 0 });
        const profitCenterList = await comboDataAPiCall.current.fillFiltersCombo(globalQuery);
        setPcGroupShortName(profitCenterList[0].property_value);

    }

    const handleSubmit = async () => {
        try {
            const checkIsValidate = await validate.current.validateForm("ProfitcenterFormId");;

            if (checkIsValidate === true) {
                let active;
                activeValue = document.querySelector('input[name=isactive]:checked').value

                switch (activeValue) {
                    case '1': active = true; break;
                    case '0': active = false; break;

                }
                const data = {
                    company_id: COMPANY_ID,
                    company_branch_id: COMPANY_BRANCH_ID,
                    profit_center_id: profit_center_id,
                    created_by: UserName,
                    modified_by: profit_center_id === 0 ? null : UserName,
                    profit_center_name: txt_profit_center_name,
                    profit_center_short_name: txt_profit_center_Short_Name,
                    profit_center_group: txt_profit_center_group,
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
                const apicall = await fetch(`${process.env.REACT_APP_BASE_URL}/api/FmProfitCenter/FnAddUpdateRecord`, requestOptions)
                const responce = await apicall.json()
                console.log("response error: ", responce);
                if (responce.error !== "") {
                    console.log("response error: ", responce.error);
                    setErrMsg(responce.error)
                    setShowErrorMsgModal(true)
                } else {
                    const evitCache = comboDataAPiCall.current.evitCache();
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
    const validateFields = () => {
        validate.current.validateFieldsOnChange('ProfitcenterFormId')
    }


    const FnCheckUpdateResponce = async () => {
        try {
            if (profit_center_id !== 0) {
                const apiCall = await fetch(`${process.env.REACT_APP_BASE_URL}/api/FmProfitCenter/FnShowParticularRecordForUpdate/${profit_center_id}/${COMPANY_ID}`)
                const updateRes = await apiCall.json();
                setprofitcenter_id(updateRes.profit_center_id);
                setprofitcenterName(updateRes.profit_center_name);
                setprofitcenterShortName(updateRes.profit_center_short_name);
                setProfitCenterGroup(updateRes.profit_center_group);
                ShowShortGroupName();
                $('#saveBtn').show();

                switch (updateRes.is_active) {
                    case true:
                        document.querySelector('input[name="isactive"][value="1"]').checked = true;
                        break;
                    case false:
                        document.querySelector('input[name="isactive"][value="0"]').checked = true;
                        break;
                    default: break;
                }

            }
        } catch (error) {
            console.log("error", error)
            navigate('/Error')
        }
    }


    const ActionType = async () => {
        switch (keyForViewUpdate) {
            case 'update':
                if (!props.addNewProd) {
                    setActionType('(Modification )');
                    setActionLabel('Update')
                    $('#saveBtn').attr('disabled', false);
                    $('#txt_profit_center_name').attr('disabled', true);
                    // $('#txt_profit_center_Short_Name').attr('disabled', true);
                }
                else {
                    setActionType('(Creation)');
                    setActionLabel('Add')
                }
                break;
            case 'view':
                $("input[type=radio]").attr('disabled', true);
                await validate.current.readOnly("ProfitcenterFormId");
                setActionType('(View)');
                break;
            default:
                setActionType('(Creation)');
                setActionLabel('Add')
                break;
        }
    };

    return (
        <>
            <ComboBox ref={comboDataAPiCall} />
            <FrmValidations ref={validate} />
            <div className="erp_top_Form">
                <div className='card p-1'>
                    <div className='card-header text-center py-0'>
                        <label className='erp-form-label-lg main_heding'>Profit Center Master{actionType}</label>
                    </div>

                    <form id="ProfitcenterFormId">
                        <div className="row erp_transporter_div text-start">

                            {/* first row */}

                            <div className="col-sm-6 erp_form_col_div">
                                <div className="row">
                                    <div className="col-sm-3">
                                        <Form.Label className="erp-form-label">Profit Center Group <span className="required">*</span></Form.Label>
                                    </div>
                                    <div className="col-sm-4">
                                        <select size="sm" id="txt_profit_center_group" value={txt_profit_center_group} className="form-select form-select-sm erp_input_field"
                                            onChange={e => { setProfitCenterGroup(e.target.value); validateFields(); ShowShortGroupName() }} >
                                            <option value="" disabled>Select</option>

                                            {profitCenterOption?.map(option => (
                                                <option value={option.field_name}>{option.field_name}</option>
                                            ))}
                                        </select>
                                        <MDTypography variant="button" id="error_txt_profit_center_group" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }} >
                                        </MDTypography>
                                    </div>
                                    <div className='col-sm-3'>
                                        <Form.Label className="erp-form-label">Group Short Name<span className="required">*</span></Form.Label>
                                    </div>
                                    <div className='col'>
                                        <Form.Control type="text" id="txt_pc_group_ShortName" className="erp_input_field" value={txt_pc_group_ShortName} onChange={e => { setPcGroupShortName(e.target.value); validateFields(); }} maxLength="255" disabled />
                                        <MDTypography variant="button" id="error_txt_pc_group_ShortName" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                                        </MDTypography>
                                    </div>
                                </div>

                                <div className='row'>
                                    <div className='col-sm-3'>
                                        <Form.Label className="erp-form-label">Profit Center Name<span className="required">*</span></Form.Label>
                                    </div>
                                    <div className='col'>
                                        <Form.Control type="text" id="txt_profit_center_name" className="erp_input_field" value={txt_profit_center_name} onChange={e => { setprofitcenterName(e.target.value); validateFields(); }} maxLength="255" />
                                        <MDTypography variant="button" id="error_txt_profit_center_name" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                                        </MDTypography>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className='col-sm-3'>
                                        <Form.Label className="erp-form-label">Short Name<span className="required">*</span></Form.Label>
                                    </div>
                                    <div className='col'>
                                        <Form.Control type="text" id="txt_profit_center_Short_Name" className="erp_input_field" value={txt_profit_center_Short_Name} onChange={e => { setprofitcenterShortName(e.target.value.toUpperCase()); validateFields(); }} maxLength="20" />
                                        <MDTypography variant="button" id="error_txt_profit_center_Short_Name" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                                        </MDTypography>
                                    </div>

                                </div>
                            </div>

                            {/* second row */}
                            {/* test case 1 shivanjali */}
                            <div className="col-sm-6 erp_form_col_div">
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
                                const path = compType === 'Register' ? '/Masters/ProfitCenterListing/reg' : '/Masters/ProfitCenterListing';
                                navigate(path);
                            }}
                            variant="button"
                            fontWeight="regular" disabled={props.btn_disabled ? true : false}>Back</MDButton>
                        <MDButton type="submit" onClick={handleSubmit} id="saveBtn" className={`erp-gb-button ms-2 ${keyForViewUpdate === 'view' ? 'd-none' : 'display'}`} variant="button"
                            fontWeight="regular">{actionLabel}</MDButton>

                    </div >
                </div>
            </div>

            {/* Add new Record Popup */}
            <Modal size="lg" show={showAddRecModal} onHide={handleCloseRecModal} backdrop="static" keyboard={false} centered >
                <Modal.Header>
                    <Modal.Title className='erp_modal_title'>MFMCostCenter</Modal.Title>
                    <span><button type="button" className="erp-modal-close btn-close" aria-label="Close" onClick={handleCloseRecModal}></button></span>
                </Modal.Header>
                <Modal.Body className='erp_city_modal_body'>
                    
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
        </>

    )
}

export default ProfitCenterEntry