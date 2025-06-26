import React from 'react'
import { useState, useEffect, useRef } from "react";
import $ from 'jquery';
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import FrmValidations from "FrmGeneric/FrmValidations";
import { resetGlobalQuery } from 'assets/Constants/config-constant';
import { globalQuery } from 'assets/Constants/config-constant';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { useLocation, useNavigate } from "react-router-dom";
import SuccessModal from "components/Modals/SuccessModal";
import ConfigConstants from "assets/Constants/config-constant";
import ComboBox from 'Features/ComboBox';
import ErrorModal from 'components/Modals/ErrorModal';
// import MCostCenterEntry from 'Masters/MFMCostCenter/MCostCenterEntry/Index';

export default function FrmCostCenterHeadsEntry(props) {
    const validate = useRef();
    const combobox = useRef();
    var activeValue = '';
    const comboDataAPiCall = useRef();
    const { state } = useLocation();
    const configConstants = ConfigConstants();
    const { COMPANY_ID, COMPANY_BRANCH_ID, UserName } = configConstants;
    const { costCenterID = 0, keyForViewUpdate, compType = 'Masters' } = state || {}


    // Add Product Type Form Fields
    const [cost_center_heads_id, setcostcenter_id] = useState(costCenterID);
    const [txt_cost_center_heads_name, setCostcenterName] = useState('');
    const [txt_cost_center_heads_short_name, setCostcenterShortName] = useState('');
    const [actionType, setActionType] = useState('')
    const [actionLabel, setActionLabel] = useState('Save')
    const [txt_cost_center_group, setCostCenterGroup] = useState('');
    const [costCenterOption, setCostCenterOption] = useState([]);
    const [txt_cost_center_short_name, setCcGroupShortName] = useState('');
    // Error Msg HANDLING
    const handleCloseErrModal = () => setShowErrorMsgModal(false);
    const [showErrorMsgModal, setShowErrorMsgModal] = useState(false);
    const [errMsg, setErrMsg] = useState('');

    // Show ADD record Modal
    const handleCloseRecModal = async () => {
    await FillComobos()
    setShowAddRecModal(false);
    sessionStorage.removeItem('dataAddedByCombo')

    setTimeout(() => {
      $(".erp_top_Form").css({ "padding-top": "110px" });
    }, 200)
  }
  const [showAddRecModal, setShowAddRecModal] = useState(false);
    // Success Msg HANDLING
    const handleCloseSuccessModal = () => {
        setShowSuccessMsgModal(false);
        if (sessionStorage.getItem('dataAddedByCombo') !== 'dataAddedByCombo') {
            navigate(`/Masters/MCostCenterHeads/FrmCostCenterHeadsListing`);
        }
    }
    const [showSuccessMsgModal, setShowSuccessMsgModal] = useState(false);
    const [succMsg, setSuccMsg] = useState('');

    // For navigate
    const navigate = useNavigate();
    useEffect(async () => {
        await ActionType();
        await FillComobos();
        
        await FnCheckUpdateResponce();
    }, [])

    // fill combo onload
    const FillComobos = async () => {
        try {
            resetGlobalQuery();
            globalQuery.columns = ['field_id', 'field_name', 'cost_center_short_name',];
            globalQuery.table = "fmv_cost_center";
            globalQuery.conditions.push({ field: "company_id", operator: "=", value: COMPANY_ID });
            globalQuery.conditions.push({ field: "is_delete", operator: "=", value: 0 });
            globalQuery.orderBy = ['cost_center_group']
            const profitCenterList = await combobox.current.fillFiltersCombo(globalQuery);
            setCostCenterOption(profitCenterList);
        } catch (error) {
            console.log("error : ", error)
        }
    }

    const comboOnChange = async (key) => {
        switch (key) {
            case 'costCenterName':
                let productTpVal = parseInt(document.getElementById('txt_cost_center_group').value);
                if (productTpVal === 0) {
                    setCostCenterGroup(productTpVal)
                    sessionStorage.setItem('dataAddedByCombo', 'dataAddedByCombo')
                    setShowAddRecModal(true)
                    setTimeout(() => {
                        $(".erp_top_Form").eq(1).css("padding-top", "0px");

                    }, 200)
                    setCostcenterShortName('');
                } else if (productTpVal !== "" && productTpVal !== NaN) {

                    let selectedProdType = costCenterOption.find((type) => type.field_id === productTpVal);
                    if (selectedProdType) {
                        setCcGroupShortName(selectedProdType.cost_center_short_name);
                        if (keyForViewUpdate === 'Add' || keyForViewUpdate === 'update') {
                            setCostcenterShortName(selectedProdType.cost_center_short_name);
                        }
                    } else {
                        setCostcenterShortName('');
                    }
                }
                break;
        }
    }

 

    const handleSubmit = async () => {
        try {
            const checkIsValidate = await validate.current.validateForm("CostcenterFormId");

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
                    cost_center_heads_id: costCenterID,
                    created_by: UserName,
                    modified_by: costCenterID === 0 ? null : UserName,
                    cost_center_heads_name: txt_cost_center_heads_name,
                    cost_center_heads_short_name: txt_cost_center_heads_short_name,
                    cost_center_heads_group: txt_cost_center_short_name,
                    cost_center_id: txt_cost_center_group,
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
                const apicall = await fetch(`${process.env.REACT_APP_BASE_URL}/api/FmCostCenterHeads/FnAddUpdateRecord`, requestOptions)
                const responce = await apicall.json()
                console.log("response error: ", responce);
                if (responce.success === '0') {
                    console.log("response error: ", responce.success);
                    setErrMsg(responce.error)
                    setShowErrorMsgModal(true)
                } else {
                    const evitCache = combobox.current.evitCache();
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
            if (costCenterID !== 0) {
                const apiCall = await fetch(`${process.env.REACT_APP_BASE_URL}/api/FmCostCenterHeads/FnShowParticularRecordForUpdate/${costCenterID}`)
                const updateRes = await apiCall.json();
                setcostcenter_id(updateRes.data.costCenterID);
                setCostcenterName(updateRes.data.cost_center_heads_name);
                setCostcenterShortName(updateRes.data.cost_center_heads_short_name);
                setCcGroupShortName(updateRes.data.cost_center_heads_group);
                setCostCenterGroup(updateRes.data.cost_center_id)

                $('#saveBtn').show();
                switch (updateRes.data.is_active) {
                    case true:
                        document.querySelector('input[name="isactive"][value="1"]').checked = true;
                        break;
                    case false:
                        document.querySelector('input[name="isactive"][value="0"]').checked = true;
                        break;
                }
            }
        } catch (error) {
            console.log("error", error)
            navigate('/Error')
        }
    }

    const validateFields = () => {
        validate.current.validateFieldsOnChange('CostcenterFormId')
    }

    const ActionType = async () => {
        switch (keyForViewUpdate) {
            case 'update':
                setActionType('(Modification)');
                setActionLabel('Update')
                $('#saveBtn').attr('disabled', false);
                $('#txt_cost_center_heads_name').attr('disabled', true);
                //$('#txt_cost_center_group').attr('disabled', true);
                break;
            case 'view':
                setActionType('(View)');
                $("input[type=radio]").attr('disabled', true);
                await validate.current.readOnly("CostcenterFormId");
                break;
            default:
                setActionType('(Creation)');
                break;
        }
    };

    return (
        <>
            <FrmValidations ref={validate} />
            <ComboBox ref={combobox} />
            <ComboBox ref={comboDataAPiCall} />
            <div className="erp_top_Form">
                <div className='card p-1'>
                    <div className='card-header text-center py-0'>
                        <label className='erp-form-label-lg main_heding'>Cost Center Heads{actionType}</label>
                    </div>
                    <form id="CostcenterFormId">
                        <div className="row erp_transporter_div  text-start">
                            {/* first row */}
                            <div className="col-lg-6">
                                <div className="row">
                                    <div className="col-sm-3">
                                        <Form.Label className="erp-form-label">Cost Center Group <span className="required">*</span></Form.Label>
                                    </div>
                                    <div className="col-sm-4">
                                        <select size="sm" id="txt_cost_center_group" value={txt_cost_center_group} className="form-select form-select-sm erp_input_field"
                                            onChange={e => { setCostCenterGroup(e.target.value); validateFields(); comboOnChange('costCenterName'); }} >
                                            <option value="" disabled>Select</option>
                                            <option value="0">Add New Record +</option>
                                            {costCenterOption?.map(option => (
                                                <option value={option.field_id}>{option.field_name}</option>
                                            ))}
                                        </select>
                                        <MDTypography variant="button" id="error_txt_cost_center_group" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }} >
                                        </MDTypography>
                                    </div>

                                    <div className='col-sm-3'>
                                        <Form.Label className="erp-form-label">Group Short Name<span className="required">*</span></Form.Label>
                                    </div>
                                    <div className='col'>
                                        <Form.Control type="text" id="txt_cost_center_short_name" className="erp_input_field" value={txt_cost_center_short_name} onChange={e => { setCcGroupShortName(e.target.value); validateFields(); }} maxLength="255" disabled />
                                        <MDTypography variant="button" id="error_txt_cost_center_short_name" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                                        </MDTypography>
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col-sm-3'>
                                        <Form.Label className="erp-form-label">Cost Center Heads Name<span className="required">*</span></Form.Label>
                                    </div>
                                    <div className='col'>
                                        <Form.Control type="text" id="txt_cost_center_heads_name" className="erp_input_field" value={txt_cost_center_heads_name} onChange={e => { setCostcenterName(e.target.value); validateFields(); }} maxLength="255" />
                                        <MDTypography variant="button" id="error_txt_cost_center_heads_name" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                                        </MDTypography>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className='col-sm-3'>
                                        <Form.Label className="erp-form-label">Short Name<span className="required">*</span></Form.Label>
                                    </div>
                                    <div className='col'>
                                        <Form.Control type="text" id="txt_cost_center_heads_short_name" className="erp_input_field" value={txt_cost_center_heads_short_name} onChange={e => { setCostcenterShortName(e.target.value.toUpperCase()); validateFields(); }} maxLength="20" />
                                        <MDTypography variant="button" id="error_txt_cost_center_heads_short_name" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                                        </MDTypography>
                                    </div>
                                </div>
                            </div>

                            {/* second row */}
                            <div className="col-lg-6 ">
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
                                const path = compType === 'Register' ? '/Masters/MCostCenterHeads/FrmCostCenterHeadsListing/reg' : '/Masters/MCostCenterHeads/FrmCostCenterHeadsListing';
                                navigate(path);
                            }} variant="button" fontWeight="regular" disabled={props.btn_disabled ? true : false}>Back</MDButton>
                        <MDButton type="submit" onClick={handleSubmit} id="saveBtn" className={`erp-gb-button ms-2 ${keyForViewUpdate === 'view' ? 'd-none' : 'display'}`} variant="button"
                            fontWeight="regular">{actionLabel}</MDButton>

                    </div >
                </div>
            </div>
          
             {/* Add new Record Popup */}
        <Modal size="lg" show={showAddRecModal} onHide={handleCloseRecModal} backdrop="static" keyboard={false} centered >
          <Modal.Body className='erp_city_modal_body'>
            <div className='row'>
              <div className='col-12 align-self-end'><button type="button" className="erp-modal-close btn-close" aria-label="Close" onClick={handleCloseRecModal}></button></div>
            </div>
            {/* <MCostCenterEntry btn_disabled /> */}
          </Modal.Body>

        </Modal >

            {/* Success Msg Popup */}
            <SuccessModal handleCloseSuccessModal={() => handleCloseSuccessModal()} show={[showSuccessMsgModal, succMsg]} />
            {/* Error Msg Popup */}
            <ErrorModal handleCloseErrModal={() => handleCloseErrModal()} show={[showErrorMsgModal, errMsg]} />
        </>
    )

}
