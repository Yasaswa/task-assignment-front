import React, { useLayoutEffect, useMemo } from 'react'
import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import $ from 'jquery';
import { Accordion, Table } from "react-bootstrap";
// Material Dashboard 2 PRO React components
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import Modal from 'react-bootstrap/Modal';
import Tooltip from "@mui/material/Tooltip";
import { IoAddCircleOutline, IoRemoveCircleOutline } from 'react-icons/io5';

// Imports React bootstra
import Form from 'react-bootstrap/Form';

// File Imports
import ComboBox from "Features/ComboBox";
import ErrorModal from "components/Modals/ErrorModal";
import SuccessModal from "components/Modals/SuccessModal";
// import MCostCenterEntry from "Masters/MFMCostCenter/MCostCenterEntry/Index";
import ConfigConstants from "assets/Constants/config-constant";
import ValidateNumberDateInput from "FrmGeneric/ValidateNumberDateInput";
import FrmValidations from "FrmGeneric/FrmValidations";
import DepartmentEntry from "Masters/MDepartment/FrmDepartmentEntry";


function FrmProfessionalTaxationEntry(props) {

    const configConstants = ConfigConstants();
    const { COMPANY_ID, UserName } = configConstants;
    const { state } = useLocation();
    const { ProfessionalTaxId = 0, keyForViewUpdate, compType } = state || {}

    // Use Refs to call external functions
    const validateNumberDateInput = useRef();
    const combobox = useRef();
    const validate = useRef();
    const navigate = useNavigate()

    // production section Feilds
    const [txt_professional_tax_id, setprofessionaltaxid] = useState(ProfessionalTaxId === null ? 0 : ProfessionalTaxId);


    const [dt_applicable_date, setapplicable_date] = useState('');
    const [cmb_gender, setgender] = useState('Male');
    const [genderOptions, setGenderOptions] = useState([]);



    const [chk_isactive, setIsActive] = useState(true);
    const [actionType, setActionType] = useState('')
    const [actionLabel, setActionLabel] = useState('Save')


    const [ProfessionalTaxationData, setProfessionalTaxationData] = useState([])
    const [rowCount, setRowCount] = useState(1)



    // Error Msg HANDLING
    const handleCloseErrModal = () => setShowErrorMsgModal(false);
    const [showErrorMsgModal, setShowErrorMsgModal] = useState(false);
    const [errMsg, setErrMsg] = useState('');

    // Success Msg HANDLING
    const handleCloseSuccessModal = () => {
        setShowSuccessMsgModal(false);
        if (sessionStorage.getItem('dataAddedByCombo') !== 'dataAddedByCombo') {
            navigate(`/DashBoard`)
        }
    }

    const [showSuccessMsgModal, setShowSuccessMsgModal] = useState(false);
    const [succMsg, setSuccMsg] = useState('');

    useEffect(() => {
        const loadDataOnload = async () => {
            await ActionType()
            await fillComobos();
            await FnCheckUpdateResponce("Male")
        }
        loadDataOnload()
    }, [])

    const fillComobos = async () => {
        try {
            const gendersApiCall = await combobox.current.fillComboBox('Gender');
            setGenderOptions(gendersApiCall);

        } catch (error) {
            console.log("error: ", error)
            navigate('/Error')
        }
    }


    const FnValidateProffessionalTaxation = async () => {
        debugger
        // Validating header footer forms data.
        let headerDataIsValid = await validate.current.validateForm("ProfessionalTaxationform");
        if (!headerDataIsValid) { return false; }

        let checkIsValid = true;
        const lastrowupperlimitrow = parseInt(ProfessionalTaxationData.length) - 1
        const lastlowerlimit = ProfessionalTaxationData[0].lower_limit
        const lastupperlimit = ProfessionalTaxationData[0].upper_limit


        // const tableRows = document.querySelectorAll('#ProfessionalTaxationContactTbl tbody tr');
        // tableRows.forEach(row => {
        //     if ((ProfessionalTaxationData[row.rowIndex - 1].upper_limit < ProfessionalTaxationData[row.rowIndex - 1].lower_limit) || ProfessionalTaxationData[row.rowIndex - 1].upper_limit == 0) {
        //         row.querySelector('#upper_limit_' + (row.rowIndex - 1)).parentElement.dataset.tip = 'Please enter valid input...!';
        //         row.querySelector('#upper_limit_' + (row.rowIndex - 1)).focus();
        //         return checkIsValid = false;
        //     } else if (ProfessionalTaxationData[row.rowIndex - 1].lower_limit == 0 && (row.rowIndex - 1) != 0) {
        //         row.querySelector('#lower_limit_' + (row.rowIndex - 1)).parentElement.dataset.tip = 'Please enter valid input...!';
        //         row.querySelector('#lower_limit_' + (row.rowIndex - 1)).focus();
        //         return checkIsValid = false;
        //     }
        // }
        // )

        const tableRows = document.querySelectorAll('#ProfessionalTaxationContactTbl tbody tr');
        for (let i = 0; i < tableRows.length; i++) {
            const row = tableRows[i];

            if ((ProfessionalTaxationData[row.rowIndex - 1].upper_limit < ProfessionalTaxationData[row.rowIndex - 1].lower_limit) || ProfessionalTaxationData[row.rowIndex - 1].upper_limit == 0) {
                row.querySelector('#upper_limit_' + (row.rowIndex - 1)).parentElement.dataset.tip = 'Please enter valid input...!';
                row.querySelector('#upper_limit_' + (row.rowIndex - 1)).focus();
                checkIsValid = false;
                break; // Exit the loop
            } else if (ProfessionalTaxationData[row.rowIndex - 1].lower_limit == 0 && (row.rowIndex - 1) != 0) {
                row.querySelector('#lower_limit_' + (row.rowIndex - 1)).parentElement.dataset.tip = 'Please enter valid input...!';
                row.querySelector('#lower_limit_' + (row.rowIndex - 1)).focus();
                checkIsValid = false;
                break; // Exit the loop
            }
        }


        if (ProfessionalTaxationData !== '') {
            if (parseInt(lastlowerlimit) === "") {
                setErrMsg('enter valid Lower limit...');
                setShowErrorMsgModal(true);
                return checkIsValid = false;
            } else if (parseInt(lastupperlimit) === 0) {
                const lastlowerlimit = ProfessionalTaxationData[0].lower_limit
                const lastupperlimit = ProfessionalTaxationData[0].upper_limit
                const tableRows = document.querySelectorAll('#ProfessionalTaxationContactTbl tbody tr');
                tableRows.forEach(row => {
                    if (parseInt(lastlowerlimit) > parseInt(lastupperlimit)) {
                        row.querySelector('#upper_limit_' + lastrowupperlimitrow).parentElement.dataset.tip = 'Please enter valid input...!';
                        row.querySelector('#upper_limit_' + lastrowupperlimitrow).focus();
                        return checkIsValid = false;
                    }
                })
            }
            // else if (ProfessionalTaxationData[lastrowupperlimitrow].upper_limit < ProfessionalTaxationData[lastrowupperlimitrow].lower_limit) {
            //     const tableRows = document.querySelectorAll('#ProfessionalTaxationContactTbl tbody tr');
            //     tableRows.forEach(row => {
            //         if (ProfessionalTaxationData[lastrowupperlimitrow].upper_limit < ProfessionalTaxationData[lastrowupperlimitrow].lower_limit) {
            //             row.querySelector('#lower_limit_' + lastrowupperlimitrow).parentElement.dataset.tip = 'Please enter Valid upper limit...!';
            //             row.querySelector('input[id^="lower_limit_"]').focus();
            //             return checkIsValid = false;
            //         }
            //     })
            // }
        }
        else {
            const tableRows = document.querySelectorAll('#ProfessionalTaxationContactTbl tbody tr');
            let checkIsValid = true;


            for (let i = 0; i < tableRows.length; i++) {
                const row = tableRows[i];

                const lastrowupperlimitrow = parseInt(ProfessionalTaxationData.length) - 1
                const lastupperlimit = ProfessionalTaxationData[lastrowupperlimitrow].upper_limit


                // if (upper_limit.trim() !== '') {
                //     if (isNaN(custmerOrderQty) || parseInt(custmerOrderQty) <= 0) {
                //         row.querySelector('input[id^="customer_material_order_quantity_"]').parentElement.dataset.tip = 'Order Quantity cannot be zero or left blank..!';
                //         row.querySelector('input[id^="customer_material_order_quantity_"]').focus();
                //         checkIsValid = false;
                //         break;
                //     } else {
                //         delete row.querySelector('input[id^="customer_material_order_quantity_"]').parentElement.dataset.tip;
                //     }
                // }
                //  else {
                //     row.querySelector('input[id^="customer_material_order_quantity_"]').parentElement.dataset.tip = 'Order Quantity cannot be zero or left blank..!';
                //     row.querySelector('input[id^="customer_material_order_quantity_"]').focus();
                //     checkIsValid = false;
                //     break;
                // }


                if (!checkIsValid) {
                    break;
                }
            }

            return checkIsValid = true;
        }
        return checkIsValid
    }

    const addProfessionalTaxationform = async () => {
        debugger
        try {
            let checkIsValidate = true;
            checkIsValidate = await FnValidateProffessionalTaxation();
            let json = { 'TaxDetailsData': [], 'commonIds': {} }
            if (checkIsValidate === true) {

                let updatedProfessionalTaxationData = [];

                for (let index = 0; index < ProfessionalTaxationData.length; index++) {
                    const element = ProfessionalTaxationData[index];
                    const newProfessionalTaxationData = {
                        professional_tax_id: 0,
                        gender: cmb_gender,
                        applicable_date: dt_applicable_date,
                        is_active: chk_isactive,
                        company_id: COMPANY_ID,
                        lower_limit: element.lower_limit,
                        upper_limit: element.upper_limit,
                        professional_tax: element.professional_tax,
                        created_by: UserName,
                    };
                    updatedProfessionalTaxationData.push(newProfessionalTaxationData);
                }

                json.TaxDetailsData = updatedProfessionalTaxationData
                json.commonIds.company_id = COMPANY_ID
                json.commonIds.gender = cmb_gender
                console.log(json);

                const formData = new FormData();
                formData.append(`ProfessionalTaxData`, JSON.stringify(json))
                const requestOptions = {
                    method: 'POST',
                    body: formData
                };
                const apicall = await fetch(`${process.env.REACT_APP_BASE_URL}/api/HmProfessionalTax/FnAddUpdateRecord`, requestOptions)
                const responce = await apicall.json();
                if (responce.error !== "") {
                    console.log("response error: ", responce.error);
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

    const ActionType = async () => {
        switch (keyForViewUpdate) {
            case 'update':
                // setActionType('(Modification)');
                setActionLabel('Update')
                $('#dt_applicable_date').attr('disabled', true)
                break;
            case 'view':
                // setActionType('(View)');
                await validate.current.readOnly("ProfessionalTaxationform");
                $("input[type=radio]").attr('disabled', true);
                break;
            default:
                // setActionType('(Creation)');
                break;
        }
    };

    const validateFields = () => {
        validate.current.validateFieldsOnChange('ProfessionalTaxationform')
    }

    const FnCheckUpdateResponce = async (genderChangeval) => {
        try {
            const apiCall = await fetch(`${process.env.REACT_APP_BASE_URL}/api/HmProfessionalTax/FnShowParticularRecordForUpdate/${genderChangeval}`)
            const updateRes = await apiCall.json();
            const taxData = updateRes.data;
            if (taxData.length !== 0) {
                setapplicable_date(updateRes.data[0].applicable_date)
                setIsActive(updateRes.data[0].is_active);
                setProfessionalTaxationData(updateRes.data)
            } else {
                // setapplicable_date(updateRes.data[0].applicable_date)
                // setIsActive(updateRes.data[0].is_active);
                let professionalTaxData = [];
                professionalTaxData.push(TaxationBlankObject);
                setProfessionalTaxationData(professionalTaxData)
            }
        } catch (error) {
            console.log("error: ", error)
            navigate('/Error')
        }
    }


    // ----------------------------------------------------------------------------
    const setRowCountAndAddRow = () => {
        const lastRowIndex = ProfessionalTaxationData.length - 1;
        const lastRowUpperLimit = ProfessionalTaxationData[lastRowIndex].upper_limit;
        const lastRowlowerLimit = ProfessionalTaxationData[lastRowIndex].lower_limit;


        if (parseInt(lastRowUpperLimit) !== 0 && parseInt(lastRowlowerLimit) < parseInt(lastRowUpperLimit)) {
            setRowCount(rowCount + 1);
        }
        else {
            const tableRows = document.querySelectorAll('#ProfessionalTaxationContactTbl tbody tr');
            tableRows.forEach(row => {
                const upper_limitAmt = row.querySelector('input[id^="upper_limit_"]').value;
                if (upper_limitAmt === 0) {
                    row.querySelector('input[id^="upper_limit_"]').parentElement.dataset.tip = 'Please fill this Field...!';
                    row.querySelector('input[id^="upper_limit_"]').focus();
                    return;
                }
            }
            )
        }
    };



    const removeFirstRow = (indexToRemove) => {
        if (indexToRemove !== 0) {
            const updatedProfessionalTaxationData = ProfessionalTaxationData.filter((item, index) => index !== indexToRemove);
            setProfessionalTaxationData(updatedProfessionalTaxationData)
        } else {
            const updatedProfessionalTaxationData = [...ProfessionalTaxationData];  // Create a copy of the array
            updatedProfessionalTaxationData[0] = { ...TaxationBlankObject }; // Set values of 0th index to the TaxationBlankObject
            setProfessionalTaxationData(updatedProfessionalTaxationData);
        }
    }


    const TaxationBlankObject = {
        company_id: COMPANY_ID,
        lower_limit: 0,
        upper_limit: 0,
        professional_tax: 0,
        created_by: UserName,
    }

    useLayoutEffect(() => {
        if (ProfessionalTaxationData.length !== 0) {
            var lastRowIndex = ProfessionalTaxationData.length - 1;
            var lastRowUpperLimit = ProfessionalTaxationData[lastRowIndex].upper_limit;
        }
        // const updatedData = [...ProfessionalTaxationData];
        const updatedData = {
            company_id: COMPANY_ID,
            lower_limit: parseInt(lastRowUpperLimit) + 1, // Set the Lower limit of the new row to the incremented value
            upper_limit: 0,
            professional_tax: 0,
            created_by: UserName,
        };
        // setProfessionalTaxationData(updatedData);

        const getExistingProfessionalTaxationData = [...ProfessionalTaxationData]
        getExistingProfessionalTaxationData.push(ProfessionalTaxationData.length !== 0 ? updatedData : TaxationBlankObject)
        setProfessionalTaxationData(getExistingProfessionalTaxationData)
    }, [rowCount])


    const FnUpdateProfessionalTaxationTblRows = (rowData, event) => {
        let eventId = document.getElementById(event.target.id);
        let clickedColName = event.target.getAttribute('Headers');
        let enteredValue = event.target.value;

        switch (clickedColName) {
            case 'lower_limit':

                let lastvalue = parseInt(event.target.parentElement.parentElement.getAttribute("rowIndex"))

                if (lastvalue !== 0) {
                    let lastRowIndex = lastvalue - 1
                    var lastRowUpperLimit = ProfessionalTaxationData[lastRowIndex].upper_limit;
                    rowData[clickedColName] = validateNumberDateInput.current.decimalNumber(enteredValue);
                    if (parseInt(lastRowUpperLimit) > parseInt(enteredValue)) {
                        eventId.parentElement.dataset.tip = 'Please enter valid Lower limit...!';
                    }
                    else if (parseInt(lastRowUpperLimit) === parseInt(enteredValue)) {
                        eventId.parentElement.dataset.tip = 'Please enter valid Lower limit...!';
                    }
                    else if (parseInt(lastRowUpperLimit) === 0) {
                        // eventId.parentElement.dataset.tip = 'Please enter valid Lower limit...!';
                        rowData.querySelector('input[id^="upper_limit_"]').parentElement.dataset.tip = 'Please fill this Field...!';
                    } else {
                        if (parseInt(enteredValue) == parseInt(lastRowUpperLimit + 1)) {
                            delete eventId.parentElement.dataset.tip;
                        } else {
                            eventId.parentElement.dataset.tip = 'Please enter valid Lower limit...!';
                        }

                    }
                } else {
                    if (enteredValue === "") {
                        eventId.parentElement.dataset.tip = 'Please enter valid Lower limit...!';
                        rowData[clickedColName] = validateNumberDateInput.current.decimalNumber(enteredValue);

                    } else {
                        rowData[clickedColName] = validateNumberDateInput.current.decimalNumber(enteredValue);
                        delete eventId.parentElement.dataset.tip;
                    }
                }
                break;
            case 'upper_limit':
                // rowData.
                const lowerlimitval = rowData.lower_limit
                if (enteredValue != "") {
                    if (parseInt(lowerlimitval) > parseInt(enteredValue)) {
                        eventId.parentElement.dataset.tip = 'Please enter valid Upper limit...!';
                        rowData[clickedColName] = validateNumberDateInput.current.decimalNumber(enteredValue);
                    } else if (parseInt(lowerlimitval) === parseInt(enteredValue)) {
                        eventId.parentElement.dataset.tip = 'Please enter valid Upper limit...!';
                        rowData[clickedColName] = validateNumberDateInput.current.decimalNumber(enteredValue);
                    } else {
                        delete eventId.parentElement.dataset.tip;
                        rowData[clickedColName] = validateNumberDateInput.current.decimalNumber(enteredValue);
                    }
                } else {
                    rowData[clickedColName] = validateNumberDateInput.current.decimalNumber(enteredValue);
                    eventId.parentElement.dataset.tip = 'Please enter valid Upper limit...!';
                }
                break;

            case 'professional_tax':
                rowData[clickedColName] = validateNumberDateInput.current.decimalNumber(enteredValue);

                break;
        }
        const ProfessionalTaxationDetails = [...ProfessionalTaxationData]
        const arrayIndex = parseInt(event.target.parentElement.parentElement.getAttribute('rowindex'))
        ProfessionalTaxationDetails[arrayIndex] = rowData
        setProfessionalTaxationData(ProfessionalTaxationDetails);


    }




    // ---------------------------------------------------------------------------
    const handleTabKeyPress = (event, index, rowCount, item) => {

        let clickedColName = event.target.getAttribute('Headers');
        // const arrayIndex = parseInt(event.target.parentElement.parentElement.getAttribute('rowindex'))
        // if (arrayIndex !== 0) {
        switch (clickedColName) {
            case 'upper_limit':
                const getlastindex = parseInt(ProfessionalTaxationData.length - 1)
                if (getlastindex > index) {
                    if (event.key === 'Tab' || event.type === 'blur') {
                        const upperlimitVal = parseInt(rowCount.upper_limit);
                        const updatedData = [...ProfessionalTaxationData];
                        updatedData[index + 1].lower_limit = upperlimitVal + 1;
                        setProfessionalTaxationData(updatedData);
                        const getnextRowLowerInput = event.target.parentElement.parentElement.nextSibling.children[1].children[0].id;
                        const id = document.getElementById(getnextRowLowerInput)
                        delete id.parentElement.dataset.tip;
                    }
                }
                break;
            case 'lower_limit':
                const arrayIndex = parseInt(event.target.parentElement.parentElement.getAttribute('rowindex'))
                if (arrayIndex !== 0) {
                    const getaboveIndex = index - 1
                    if (getaboveIndex !== -1 && getaboveIndex >= 0) {
                        if (event.key === 'Tab' || event.type === 'blur') {
                            const updatedData = [...ProfessionalTaxationData];
                            const upperLimitVal = parseInt(updatedData[index - 1].upper_limit);
                            updatedData[index].lower_limit = upperLimitVal + 1;
                            setProfessionalTaxationData(updatedData);
                            const getnextRowLowerInput = event.target.id;
                            const id = document.getElementById(getnextRowLowerInput)
                            delete id.parentElement.dataset.tip;
                        }
                    }
                }
                break;
        }
    };


    // const handleonfoucs = (event, index, rowCount, item) => {
    //     debugger

    //     const getlastindex = parseInt(ProfessionalTaxationData.length - 1)
    //     if (getlastindex > index) {
    //         if (event.key === 'Tab' || event.type === 'blur') {
    //             const lowerlimitVal = parseInt(rowCount.lower_limit);
    //             const updatedData = [...ProfessionalTaxationData];
    //             updatedData[index + 1].lower_limit = upperlimitVal + 1;
    //             setProfessionalTaxationData(updatedData);
    //             const getnextRowLowerInput = event.target.parentElement.parentElement.nextSibling.children[1].children[0].id;
    //             const id = document.getElementById(getnextRowLowerInput)
    //             delete id.parentElement.dataset.tip;
    //         }
    //     }
    // };



    // -------------------------------------------------------------------------------
    const comboOnChange = async (key) => {

        switch (key) {
            case 'onGenderChange':
                let genderChangeval = document.getElementById('cmb_gender').value
                if (genderChangeval !== '') {
                    $('#error_cmb_gender').hide()
                    await FnCheckUpdateResponce(genderChangeval)

                }
                break;
            default:
                break;
        }
    }

    return (
        <>
            <ValidateNumberDateInput ref={validateNumberDateInput} />
            <ComboBox ref={combobox} />
            <FrmValidations ref={validate} />
            <div className="erp_top_Form">
                <div className='card p-1'>
                    <div className='card-header text-center py-0'>
                        <label className='erp-form-label-lg text-center'> </label>
                    </div>
                    <form id="ProfessionalTaxationform">
                        <div className="row erp_transporter_div">
                            <div className="col-sm-6 erp_form_col_div">

                                <div className='row'>
                                    <div className="col-sm-4 col-12">
                                        <Form.Label className="erp-form-label">Applicable Date <span className="required">*</span></Form.Label>
                                    </div>
                                    <div className="col ">
                                        <Form.Control type="date" id='dt_applicable_date' className="erp_input_field" value={dt_applicable_date} onChange={e => { setapplicable_date(e.target.value); validateFields(); }} />
                                        <MDTypography variant="button" id="error_dt_applicable_date" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }}>
                                        </MDTypography>
                                    </div>
                                </div>
                            </div>

                            <div className="col-sm-6 erp_form_col_div">

                                <div className='row'>
                                    <div className='col-sm-4 col-12'>
                                        <Form.Label className="erp-form-label">Gender</Form.Label>
                                    </div>
                                    <div className='col'>
                                        <select id='cmb_gender' className='form-select form-select-sm' value={cmb_gender} onChange={e => { setgender(e.target.value); comboOnChange('onGenderChange') }} optional="optional">
                                            {/* <option value="" disabled>Select</option> */}
                                            {genderOptions?.map(gender => (
                                                <option value={gender.field_name}>{gender.field_name}</option>
                                            ))
                                            }
                                        </select>
                                        <MDTypography variant="button" id="error_cmb_gender" className="erp_validation error-msg" fontWeight="regular" color="error" style={{ display: "none" }}>
                                        </MDTypography>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-sm-4">
                                        <Form.Label className="erp-form-label">Is Active</Form.Label>
                                    </div>
                                    <div className="col">
                                        <div className="erp_form_radio">
                                            <div className="fCheck"> <Form.Check className="erp_radio_button" label="Yes" type="radio" lbl="Yes" value="true" name="chk_isactive" checked={chk_isactive} onClick={() => { setIsActive(true); }} /> </div>
                                            <div className="sCheck"> <Form.Check className="erp_radio_button" label="No" type="radio" lbl="No" value="false" name="chk_isactive" checked={!chk_isactive} onClick={() => { setIsActive(false); }} /> </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <hr />
                        {/* <Accordion defaultActiveKey="0" className="mt-3">
                            <Accordion.Item eventKey="1">
                                <Accordion.Header className="erp-form-label-md">Professional Taxation Details</Accordion.Header>
                                <Accordion.Body className="p-0">
                                    <div className="mt-10">
                                        <>
                                            {renderProfessionaltaxationTable}
                                        </>
                                    </div>
                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion> */}

                        <div className="erp-Mt-10">
                            <>
                                <div style={{ overflowX: "hidden", flex: 0 }}>
                                    <Table id='ProfessionalTaxationContactTbl' className={`erp_table ${ProfessionalTaxationData.length !== 0 ? 'display' : 'display'}`} responsive bordered striped>
                                        <thead className="erp_table_head">
                                            <tr>
                                                <th className={`erp_table_th ${keyForViewUpdate === 'view' ? 'display' : 'display'}`}> Action</th>
                                                <th className="erp_table_th">lower limit</th>
                                                <th className="erp_table_th">upper limit</th>
                                                <th className="erp_table_th">professional tax</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {ProfessionalTaxationData.map((item, index) =>
                                                <tr rowindex={index} className="sticky-column">
                                                    <td className={`erp_table_th ${keyForViewUpdate === 'view' ? 'display' : 'display'}`}>
                                                        <IoRemoveCircleOutline className='erp_trRemove_icon' onClick={() => removeFirstRow(index)} />
                                                        <IoAddCircleOutline className='erp_trAdd_icon' onClick={setRowCountAndAddRow} />
                                                    </td>
                                                    <td className='erp_table_td'>
                                                        {
                                                            keyForViewUpdate !== 'view'
                                                                ? <>
                                                                    <input type="text" className="erp_input_field mb-0"
                                                                        id={`lower_limit_${index}`} value={item.lower_limit}
                                                                        onChange={(e) => { FnUpdateProfessionalTaxationTblRows(item, e); }} Headers='lower_limit'
                                                                        onBlur={(e) => handleTabKeyPress(e, index, item)}
                                                                    />
                                                                </>
                                                                : item.lower_limit
                                                        }
                                                    </td>
                                                    <td className='erp_table_td'>
                                                        {
                                                            keyForViewUpdate !== 'view'
                                                                ? <>
                                                                    <input type="text" id={`upper_limit_${index}`} className="erp_input_field mb-0"
                                                                        value={item.upper_limit} Headers='upper_limit' maxLength="10"
                                                                        onChange={(e) => { FnUpdateProfessionalTaxationTblRows(item, e); }}
                                                                        // onKeyDown={(e) => handleTabKeyPress(e, index, item)}
                                                                        onBlur={(e) => handleTabKeyPress(e, index, item)} />
                                                                </>
                                                                : item.upper_limit
                                                        }
                                                    </td>
                                                    <td className='erp_table_td'>
                                                        {
                                                            keyForViewUpdate !== 'view'
                                                                ? <>
                                                                    <input type="text" id={`professional_tax_${index}`} className="erp_input_field mb-0"
                                                                        value={item.professional_tax} Headers='professional_tax' maxLength="10"
                                                                        onChange={(e) => { FnUpdateProfessionalTaxationTblRows(item, e); }}
                                                                    />
                                                                </>
                                                                : item.professional_tax
                                                        }
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </Table>
                                </div>
                            </>
                        </div>

                    </form>




                    <div className="card-footer py-0 text-center">
                        <MDButton type="button" className="erp-gb-button"

                            onClick={() => {
                                const path = compType === 'Register' ? '/DashBoard/reg' : '/DashBoard';
                                navigate(path);
                            }}

                            variant="button"
                            fontWeight="regular" disabled={props.btn_disabled ? true : false}>Exit</MDButton>
                        <MDButton type="submit" onClick={addProfessionalTaxationform} className={`erp-gb-button ms-2 ${keyForViewUpdate === 'view' ? 'd-none' : 'display'}`} variant="button"
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

export default FrmProfessionalTaxationEntry;

