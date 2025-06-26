import { useState, useEffect, useRef } from "react";
import $ from 'jquery';

// Material Dashboard 2 PRO React components

import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import { globalQuery, resetGlobalQuery } from "assets/Constants/config-constant"
import { Modal } from "react-bootstrap";

// Imports React bootstrap
import Form from 'react-bootstrap/Form';

// import react icons
import { useNavigate, useLocation } from "react-router-dom";

// File Imports
import ComboBox from "Features/ComboBox";
import ErrorModal from "components/Modals/ErrorModal";
import SuccessModal from "components/Modals/SuccessModal";
import FrmMTaxtypeEntry from "Masters/MTaxtype/FrmMTaxtypeEntry";
import FrmValidations from 'FrmGeneric/FrmValidations';
import ConfigConstants from "assets/Constants/config-constant";


function FrmTaxationEntry() {
    const validate = useRef();
    const { state } = useLocation();
    const configConstants = ConfigConstants();
    const { COMPANY_ID, UserName } = configConstants;
    const { taxationID = 0, keyForViewUpdate, compType } = state || {}
    const [actionType, setActionType] = useState('')
    const [actionLabel, setActionLabel] = useState('Save')


    const comboDataAPiCall = useRef();

    // combobox Option
    const [taxationTypeOption, setTaxationTypeOption] = useState([]);

    // For navigate
    const navigate = useNavigate();

    // Add Taxation Form Fields
    const [taxation_id, setTaxationId] = useState(0);
    const [cmb_tax_Types, setTaxationTypes] = useState('');
    const [txt_start_date, setStartDate] = useState('');
    const [txt_end_date, setEndDate] = useState('');
    const [txt_text_value, setTaxValue] = useState('');

    // Error Msg HANDLING
    const handleCloseErrModal = () => setShowErrorMsgModal(false);
    const [showErrorMsgModal, setShowErrorMsgModal] = useState(false);
    const [errMsg, setErrMsg] = useState('');

    // to add new records in combo box 
    const [showAddRecModal, setShowAddRecModal] = useState(false);
    const [modalHeaderName, setHeaderName] = useState('')

    // Success Msg HANDLING
    const handleCloseSuccessModal = () => {
        setShowSuccessMsgModal(false);
        if (sessionStorage.getItem('dataAddedByCombo') !== 'dataAddedByCombo') {
            navigate(`/Masters/TaxationListing`);
        }
    }
    const [showSuccessMsgModal, setShowSuccessMsgModal] = useState(false);
    const [succMsg, setSuccMsg] = useState('');


    useEffect(async () => {
        await FnFetchPropertyRecords();
        await FnCheckUpdateResponce();
        await ActionType();
    }, [])

    const addTaxation = async () => {
        try {
            const checkIsValidate = await validate.current.validateForm("taxationFormId");;
            if (checkIsValidate === true) {
                var active;
                var taxApplication;
                var activeValue = document.querySelector('input[name=isTaxationActive]:checked').value
                switch (activeValue) {
                    case '0': active = false; break;
                    case '1': active = true; break;
                }
                var taxApplicationVal = document.querySelector('input[name=isTaxApplicationActive]:checked').value

                switch (taxApplicationVal) {
                    case '0': taxApplication = 'Gross Total'; break;
                    case '1': taxApplication = 'Basic Total'; break;
                }

                const data = {
                    company_id: COMPANY_ID,
                    taxation_id: taxation_id,
                    created_by: UserName,
                    modified_by: taxation_id === 0 ? null : UserName,
                    taxtype_id: cmb_tax_Types,
                    start_date: txt_start_date,
                    end_date: txt_end_date,
                    tax_value: txt_text_value,
                    tax_Applicable_on: taxApplication,
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
                const apicall = await fetch(`${process.env.REACT_APP_BASE_URL}/api/taxation/FnAddUpdateRecord`, requestOptions)
                const responce = await apicall.json()

                console.log("response error: ", responce.data);
                if (responce.success === "0") {
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


    const ActionType = async () => {
        switch (keyForViewUpdate) {
            case 'update':
                setActionType('(Modify)');
                setActionLabel('Update')
                $('#taxTypeId').attr('disabled', true)
                break;
            case 'view':
                setActionType('(View)');
                $("input[type=radio]").attr('disabled', true);
                await validate.current.readOnly("taxationFormId");
                break;
            default:
                setActionType('(Create)');
                break;
        }
    };
    const FnCheckUpdateResponce = async () => {
        try {
            if (taxationID !== "undefined" && taxationID !== '' && taxationID !== null) {
                const apiCall = await fetch(`${process.env.REACT_APP_BASE_URL}/api/taxation/FnShowParticularRecordForUpdate/${taxationID}`)
                const updateRes = await apiCall.json();
                const data = JSON.parse(updateRes.data)
                if (data !== null && data !== "") {
                    setTaxationId(taxationID)
                    setTaxationTypes(data.taxtype_id);
                    setStartDate(data.start_date);
                    setEndDate(data.end_date);
                    setTaxValue(data.tax_value);

                    switch (data.tax_Applicable_on) {
                        case true:
                            document.querySelector('input[name="isTaxApplicationActive"][value="1"]').checked = true;
                            break;
                        case false:
                            document.querySelector('input[name="isTaxApplicationActive"][value="0"]').checked = true;
                            break;
                    }
                    switch (data.is_active) {
                        case true:
                            document.querySelector('input[name="isTaxationActive"][value="1"]').checked = true;
                            break;
                        case false:
                            document.querySelector('input[name="isTaxationActive"][value="0"]').checked = true;
                            break;
                    }
                }

            }

        } catch (error) {
            console.log("error", error)
            navigate('/Error')
        }
    }
    //test case 1 shivanjali
    const FnFetchPropertyRecords = async () => {
        const getAgentsApiCall = await comboDataAPiCall.current.fillMasterData("cmv_taxtype", "is_delete", "0");
        setTaxationTypeOption(getAgentsApiCall);



    }

    const openAddRecordPopUp = () => {
        switch (modalHeaderName) {

            case 'Add TaxType':
                return <FrmMTaxtypeEntry btn_disabled={true} />

            default:
                return null;
        }
    }

    const addRecordInProperty = async (key) => {
        switch (key) {
            case 'cmv_taxation':
                var taxType = $('#taxTypeId').val();
                setTaxationTypes(taxType);


                if ($('#taxTypeId').val() === "0") {
                    sessionStorage.setItem('dataAddedByCombo', 'dataAddedByCombo')
                    setHeaderName('Add TaxType')
                    setShowAddRecModal(true)
                    setTimeout(() => {
                        $(".erp_top_Form").eq(1).css("padding-top", "0px");
                    }, 100)
                    setTaxationTypes('');
                } else if (taxType !== "") {

                    $('#error_taxTypeId').hide();
                }

                break;
        }


    }


    const validateNo = (key) => {
        const numCheck = /^[0-9]*\.?[0-9]*$/;
        const regexNo = /^[0-9]*\.[0-9]{5}$/


        var dot = '.';

        switch (key) {

            case 'TaxValue':
                var TaxValue = $('#taxValueId').val();
                if (!regexNo.test(TaxValue) && TaxValue.length <= 14 || TaxValue.indexOf(dot) === 14) {
                    if (numCheck.test(TaxValue)) {
                        setTaxValue(TaxValue)
                    }

                }
                break;
        }
    }
    // test case 9 shivanjali
    const handleCloseAddRecModal = async () => {
        switch (modalHeaderName) {
            case 'Add TaxType':
                resetGlobalQuery();
                globalQuery.columns.push("field_id");
                globalQuery.columns.push("field_name");
                globalQuery.table = "cmv_taxtype";
                globalQuery.conditions.push({ field: "company_id", operator: "=", value: COMPANY_ID });
                globalQuery.conditions.push({ field: "is_delete", operator: "=", value: 0 });
                const getUpdatedDepartments = await comboDataAPiCall.current.removeCatcheFillCombo(globalQuery);
                setTaxationTypes(getUpdatedDepartments);
                break;

            default:
                break;
        }
        setShowAddRecModal(false);
        sessionStorage.removeItem('dataAddedByCombo')
        setTimeout(() => {
            $(".erp_top_Form").css({ "padding-top": "110px" });
        }, 200)
    }
    return (
        <>
            {/* test case 7 shivanjali */}
            <ComboBox ref={comboDataAPiCall} />
            <FrmValidations ref={validate} />

            <div className="erp_top_Form">
                <div className='card p-1'>
                    <div className='card-header text-center py-0'>
                        <label className='erp-form-label-lg main_heding'>Taxation Information{actionType}</label>
                    </div>


                    <form id="taxationFormId">
                        <div className="row erp_transporter_div text-start">

                            {/* //first column */}
                            <div className="col-sm-6 erp_form_col_div">

                                <div className='row'>
                                    <div className="col-sm-4">
                                        <Form.Label className="erp-form-label">TaxType<span className="required">*</span></Form.Label>
                                    </div>
                                    <div className="col">
                                        <select id="taxTypeId" value={cmb_tax_Types} className="form-select form-select-sm" onChange={() => addRecordInProperty('cmv_taxation')}>
                                            <option value="">Select</option>
                                            <option value="0">Add New Record+</option>
                                            {taxationTypeOption?.map(taxtypes => (
                                                <option value={taxtypes.field_id}>{taxtypes.field_name}</option>

                                            ))}

                                        </select>
                                        <MDTypography variant="button" id="error_taxTypeId" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                                        </MDTypography>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-sm-4">
                                        <Form.Label className="erp-form-label"> Start Date<span className="required">*</span></Form.Label>
                                    </div>
                                    <div className="col">
                                        <Form.Control type="date" id="startDateId" className="erp_input_field optional" value={txt_start_date} onChange={e => { setStartDate(e.target.value); }} />
                                        <MDTypography variant="button" id="error_startDateId" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                                        </MDTypography>
                                    </div>
                                </div>


                                <div className="row">
                                    <div className="col-sm-4">
                                        <Form.Label className="erp-form-label"> End Date<span className="required">*</span></Form.Label>
                                    </div>
                                    <div className="col">
                                        <Form.Control type="date" id="EndDateId" className="erp_input_field optional" value={txt_end_date} onChange={e => { setEndDate(e.target.value); }} />
                                        <MDTypography variant="button" id="error_EndDateId" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}>
                                        </MDTypography>
                                    </div>
                                </div>
                            </div>

                            {/* second column */}
                            <div className="col-sm-6 erp_form_col_div">
                                <div className="row">
                                    <div className="col-sm-4">
                                        <Form.Label className="erp-form-label">Tax Application On</Form.Label>
                                    </div>
                                    <div className="col">
                                        <Form>

                                            <div className="erp_form_radio">
                                                <div className="fCheck">
                                                    <Form.Check
                                                        className="erp_radio_button"
                                                        label="Basic Total"
                                                        type="radio"
                                                        value="1"
                                                        name="isTaxApplicationActive"
                                                        defaultChecked

                                                    />
                                                </div>
                                                <div className="sCheck">
                                                    <Form.Check
                                                        className="erp_radio_button"
                                                        label="Gross Total"
                                                        value="0"
                                                        type="radio"
                                                        name="isTaxApplicationActive"

                                                    />
                                                </div>
                                            </div>
                                        </Form>
                                    </div>

                                </div>
                                {/* test case 5 shivanjali */}
                                <div className='row'>
                                    <div className="col-sm-4">
                                        <Form.Label className="erp-form-label">Tax Value</Form.Label>
                                    </div>
                                    <div className="col">
                                        <Form.Control type="text" id='taxValueId' className="erp_input_field text-end" value={txt_text_value} onChange={e => { validateNo('TaxValue'); }} maxLength="19" optional='optional' />
                                        <MDTypography variant="button" id="error_taxValueId" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }}>
                                        </MDTypography>
                                    </div>
                                </div>
                                {/* test case 6 shivanjali */}
                                <div className="row">
                                    <div className="col-sm-4">
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
                                                    name="isTaxationActive"
                                                    defaultChecked

                                                />
                                            </div>
                                            <div className="sCheck">
                                                <Form.Check
                                                    className="erp_radio_button"
                                                    label="No"
                                                    value="0"
                                                    type="radio"
                                                    name="isTaxationActive"

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
                                const path = compType === 'Register' ? '/Masters/TaxationListing/reg' : '/Masters/TaxationListing';
                                navigate(path);
                            }}
                            variant="button"
                            fontWeight="regular">Back</MDButton>
                        <MDButton type="submit" onClick={addTaxation} id="btn_save" className={`erp-gb-button ms-2 ${keyForViewUpdate === 'view' ? 'd-none' : 'display'}`} variant="button"
                            fontWeight="regular">{actionLabel}</MDButton>

                    </div >
                </div>
            </div>


            <SuccessModal handleCloseSuccessModal={() => handleCloseSuccessModal()} show={[showSuccessMsgModal, succMsg]} />
            <ErrorModal handleCloseErrModal={() => handleCloseErrModal()} show={[showErrorMsgModal, errMsg]} />


            <Modal size="lg" show={showAddRecModal} onHide={handleCloseAddRecModal} backdrop="static" keyboard={false} centered >
                <Modal.Body className='erp_city_modal_body'>
                    <div className='row'>
                        <div className='col-12 align-self-end'><button type="button" className="erp-modal-close btn-close" aria-label="Close" onClick={handleCloseAddRecModal}></button></div>
                    </div>
                    {openAddRecordPopUp()}
                </Modal.Body>
            </Modal >

        </>
    )
}

export default FrmTaxationEntry