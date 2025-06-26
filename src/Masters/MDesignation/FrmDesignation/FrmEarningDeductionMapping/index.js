import React, { useState, useRef, useEffect, useMemo } from "react";
import $ from "jquery";

//React Bootstrap components
import { Table } from "react-bootstrap";
import Form from 'react-bootstrap/Form';
import ConfigConstants from "assets/Constants/config-constant";
import MDButton from "components/MDButton";
import SuccessModal from "components/Modals/SuccessModal";
import ErrorModal from "components/Modals/ErrorModal";
import ValidateNumberDateInput from "FrmGeneric/ValidateNumberDateInput";
import MDTypography from "components/MDTypography";
import { useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";

function FrmEarningDeductionMapping({ goBack, designationId, keyForViewUpdate, compType, designationName, employeeType }) {
    const configConstants = ConfigConstants();
    const { COMPANY_ID, COMPANY_BRANCH_ID, UserName } = configConstants;

    // UseRefs
    const validateNumberPercentInput = useRef();
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false);


    const [showErrorMsgModal, setShowErrorMsgModal] = useState(false);
    const [errMsg, setErrMsg] = useState("");
    const handleCloseSuccessModal = () => setShowSuccessMsgModal(false);
    const [showSuccessMsgModal, setShowSuccessMsgModal] = useState(false);
    const [succMsg, setSuccMsg] = useState("");
    const today = new Date().toISOString().split('T')[0];
    const [deductionData, setDeductionData] = useState([]);
    const [earningData, setEarningData] = useState([]);
    const [actionType, setActionType] = useState('')
    const [actionLabel, setActionLabel] = useState('Save')
    const [effective_date, setEffectiveDate] = useState(today);


    //Error Msg
    const handleCloseErrModal = () => {
        setShowErrorMsgModal(false)
    };

    const ActionType = async () => {
        switch (keyForViewUpdate) {
            case 'update':
                setActionLabel('Update')
                break;
            case 'view':
                $("input[type=radio]").attr('disabled', true);
                break;
            default:
                setActionType('(Create)');
                break;
        }
    };
    useEffect(async () => {
        setIsLoading(true)
        await ActionType();
        try {
            await FnShowEarningHeadRecrd();
        } catch (error) {
            console.error(error);
        }
        setIsLoading(false)
    }, [])
    const FnShowEarningHeadRecrd = async () => {
        try {
            debugger;
            const earnHeadDataApiCall = await fetch(`${process.env.REACT_APP_BASE_URL}/api/designation/FnShowEarningAndDeductionRecords/${(COMPANY_ID)}`)
            const responce = await earnHeadDataApiCall.json();
            const earningMappingRecords = responce.EarningMappingRecords
            const deductionMappingRecords = responce.DeductionMappingRecords

            if (earningMappingRecords.length !== 0) {
                setEarningData(earningMappingRecords)
                setDeductionData(deductionMappingRecords)

                if (keyForViewUpdate === 'Add') {
                    FnGetEmplyeeTypeWiseEarnAndDeductionRecords(earningMappingRecords, deductionMappingRecords)
                } else {
                    FncheckUpadateDeductionRecrds(earningMappingRecords, deductionMappingRecords)
                }
            }
        } catch (error) {
            console.log("error: ", error)
        }
    }

    const FncheckUpadateDeductionRecrds = async (earningHeadData, deductionHeadData) => {
        try {
            const UpadateDeductionRecrdsApiCall = await fetch(`${process.env.REACT_APP_BASE_URL}/api/designation/EarningAndDeductionFnShowAllRecords/${(designationId)}`)
            const responce = await UpadateDeductionRecrdsApiCall.json();

            let earningMapRecords = responce.EarningMappingRecords;
            let deductionMapRecords = responce.DeductionMappingRecords;

            if (earningMapRecords.length !== 0) {

                earningHeadData = earningHeadData.map((rowData) => {
                    const correspondingMapRecord = earningMapRecords.find((mapRecord) => mapRecord.earning_heads_id === rowData.earning_heads_id);

                    if (correspondingMapRecord) {
                        // If a matching mapRecord is found, update calculation_value and formula
                        return {
                            ...rowData,
                            calculation_value: correspondingMapRecord.calculation_value,
                            formula: correspondingMapRecord.formula, // Replace with the appropriate field from mapRecord
                            effective_date: correspondingMapRecord.effective_date,
                        };
                    }

                    // If no matching mapRecord is found, return the original rowData
                    return rowData;
                });
                setEarningData(earningHeadData)

                earningMapRecords.forEach(function (existingPayTerm) {
                    $('#selectEarning_' + existingPayTerm.earning_heads_id).prop('checked', true);
                    setEffectiveDate(earningMapRecords[0].effective_date)
                });
            } else {
                setEarningData(earningHeadData)
                FnGetEmplyeeTypeWiseEarnAndDeductionRecords(earningHeadData, deductionHeadData)
            }
            if (deductionMapRecords.length !== 0) {
                deductionHeadData = deductionHeadData.map((rowData) => {
                    const correspondingMapRecord = deductionMapRecords.find((mapRecord) => mapRecord.deduction_heads_id === rowData.deduction_heads_id);

                    if (correspondingMapRecord) {
                        // If a matching mapRecord is found, update calculation_value and formula
                        return {
                            ...rowData,
                            calculation_value: correspondingMapRecord.calculation_value,
                            formula: correspondingMapRecord.formula, // Replace with the appropriate field from mapRecord
                            effective_date: correspondingMapRecord.effective_date,
                        };
                    }

                    // If no matching mapRecord is found, return the original rowData
                    return rowData;
                });

                setDeductionData(deductionHeadData)

                deductionMapRecords.forEach(function (existingPayTerm) {
                    $('#selectDeduction_' + existingPayTerm.deduction_heads_id).prop('checked', true);
                    setEffectiveDate(earningMapRecords[0].effective_date)
                });

            } else {
                setDeductionData(deductionHeadData)
                FnGetEmplyeeTypeWiseEarnAndDeductionRecords(earningHeadData, deductionHeadData)
            }
        } catch (error) {
            console.log("error: ", error)
        }

    }

    const FnGetEmplyeeTypeWiseEarnAndDeductionRecords = async (earningData, deductionData) => {
        $('.selectEarning').prop('checked', false);
        $('.selectDeduction').prop('checked', false);
        try {
            const UpadateDeductionRecrdsApiCall = await fetch(`${process.env.REACT_APP_BASE_URL}/api/designation/FnEmployeeEarningTypeAndDeductionTypeShowAllRecords/${employeeType}/${COMPANY_ID}`)
            const responce = await UpadateDeductionRecrdsApiCall.json();

            let earningMapRecords = responce.EmployeeEarningMappingRecords;
            let deductionMapRecords = responce.EmployeeDeductionMappingRecords;

            if (earningMapRecords.length !== 0) {

                let earningHeadData = earningData.map((rowData) => {
                    const correspondingMapRecord = earningMapRecords.find((mapRecord) => mapRecord.earning_heads_id === rowData.earning_heads_id);

                    if (correspondingMapRecord) {
                        // If a matching mapRecord is found, update calculation_value and formula
                        return {
                            ...rowData,
                            calculation_value: correspondingMapRecord.calculation_value,
                            formula: correspondingMapRecord.formula,
                            effective_date: correspondingMapRecord.effective_date,
                        };
                    }

                    // If no matching mapRecord is found, return the original rowData
                    return rowData;
                });
                setEarningData(earningHeadData)

                earningMapRecords.forEach(function (existingPayTerm) {
                    $('#selectEarning_' + existingPayTerm.earning_heads_id).prop('checked', true);
                    setEffectiveDate(earningMapRecords[0].effective_date)
                });
            }
            if (deductionMapRecords.length !== 0) {

                let deductionHeadData = deductionData.map((rowData) => {
                    const correspondingMapRecord = deductionMapRecords.find((mapRecord) => mapRecord.deduction_heads_id === rowData.deduction_heads_id);

                    if (correspondingMapRecord) {
                        // If a matching mapRecord is found, update calculation_value and formula
                        return {
                            ...rowData,
                            calculation_value: correspondingMapRecord.calculation_value,
                            formula: correspondingMapRecord.formula, // Replace with the appropriate field from mapRecord
                            effective_date: correspondingMapRecord.effective_date,
                        };
                    }

                    // If no matching mapRecord is found, return the original rowData
                    return rowData;
                });

                setDeductionData(deductionHeadData)

                deductionMapRecords.forEach(function (existingPayTerm) {
                    $('#selectDeduction_' + existingPayTerm.deduction_heads_id).prop('checked', true);
                    setEffectiveDate(deductionMapRecords[0].effective_date)
                });

            }
        } catch (error) {
            console.log("error: ", error)
        }
        // }
    }
    function handleEarningCheckbox(id) {
        $('input:checkbox[name="selectEarning"][value="' + id + '"]').attr('checked', false);
        const totalChkBoxes = document.querySelectorAll('input[name=selectEarning]').length;
        const totalChkBoxesChked = document.querySelectorAll('input[name=selectEarning]:checked').length;
        if (totalChkBoxes == totalChkBoxesChked) {

            document.getElementById('selectAllEarning').checked = true;
        } else if (totalChkBoxes > totalChkBoxesChked) {
            ;
            document.getElementById('selectAllEarning').checked = false;
        }
    }
    function handleDeductionCheckbox(id) {
        $('input:checkbox[name="selectDeduction"][value="' + id + '"]').attr('checked', false);
        const totalChkBoxes = document.querySelectorAll('input[name=selectDeduction]').length;
        const totalChkBoxesChked = document.querySelectorAll('input[name=selectDeduction]:checked').length;
        if (totalChkBoxes == totalChkBoxesChked) {

            document.getElementById('selectAllDeduction').checked = true;
        } else if (totalChkBoxes > totalChkBoxesChked) {
            ;
            document.getElementById('selectAllDeduction').checked = false;
        }
    }

    //Fn for render payment terms static table 
    const renderEarningTable = useMemo(() => {
        return <>
            <Table className="erp_table " id='earningHead-table' bordered striped >
                <thead className="erp_table_head">
                    <tr>
                        <th className="erp_table_th">Action</th>
                        <th className="erp_table_th">Earning Code Id</th>
                        <th className="erp_table_th">Earning Head </th>
                        <th className="erp_table_th">Short Name</th>
                        <th className="erp_table_th">Calculation Type</th>
                        <th className="erp_table_th">Formula</th>
                        <th className="erp_table_th">Calculation Value</th>


                    </tr>
                </thead>
                <tbody>
                    {
                        earningData.map((earnItem, Index) =>
                            <tr payTermItemIndex={Index} rowIndex={Index}>

                                <td className="erp_table_td">
                                    <input type="checkbox" name="selectEarning" className="selectEarning" value={earnItem.earning_heads_id} id={'selectEarning_' + earnItem.earning_heads_id} onClick={() => handleEarningCheckbox(earnItem.earning_heads_id)} disabled={keyForViewUpdate === 'view'} />
                                </td>
                                <td className="erp_table_td">{earnItem.earning_code}</td>
                                <td className="erp_table_td">{earnItem.earning_head_name}</td>
                                <td className="erp_table_td text-end">{earnItem.earning_head_short_name}</td>
                                <td className="erp_table_td text-end">{earnItem.calculation_type}</td>
                                <td className="erp_table_td">
                                    <input type="text" className="erp_input_field_table_txt mb-0" value={earnItem.formula} id={"formula_" + earnItem.earning_heads_id} onChange={(e) => { updatePmtTermsTblData(earnItem, e); }}
                                        onBlur={(e) => { updatePmtTermsTblData(earnItem, e); }}
                                        Headers='formula' disabled={keyForViewUpdate === 'view'}
                                    />
                                </td>
                                <td className="erp_table_td">
                                    <input type="text" className="text-end erp_input_field_table_txt mb-0" value={earnItem.calculation_value} id={"calculation_value_" + earnItem.earning_heads_id} onChange={(e) => { updatePmtTermsTblData(earnItem, e); }}
                                        onBlur={(e) => { updatePmtTermsTblData(earnItem, e); }}
                                        Headers='calculation_value' disabled={keyForViewUpdate === 'view'} />
                                </td>

                            </tr>
                        )
                    }
                </tbody>
            </Table>
        </>
    }, [earningData]);

    const renderDeductionTable = useMemo(() => {
        return <>
            <Table className="erp_table " id='deductionHead-table' bordered striped >
                <thead className="erp_table_head">
                    <tr>
                        <th className="erp_table_th">Action</th>
                        <th className="erp_table_th">Deduction Code Id</th>
                        <th className="erp_table_th">Deduction Head </th>
                        <th className="erp_table_th">Short Name</th>
                        <th className="erp_table_th">Calculation Type</th>
                        <th className="erp_table_th">Formula</th>
                        <th className="erp_table_th">Calculation Value</th>


                    </tr>
                </thead>
                <tbody>
                    {
                        deductionData.map((deductionItem, Index) =>
                            <tr payTermItemIndex={Index} >

                                <td className="erp_table_td">
                                    <input type="checkbox" name="selectDeduction" className="selectDeduction" value={deductionItem.deduction_heads_id} id={'selectDeduction_' + deductionItem.deduction_heads_id} onClick={() => handleDeductionCheckbox(deductionItem.deduction_heads_id)} disabled={keyForViewUpdate === 'view'} />
                                </td>
                                {/* <td className="erp_table_td">{deductionItem.deduction_heads_id}</td> */}
                                <td className="erp_table_td">{deductionItem.deduction_code}</td>
                                <td className="erp_table_td">{deductionItem.deduction_head_name}</td>
                                <td className="erp_table_td">{deductionItem.deduction_head_short_name}</td>
                                <td className="erp_table_td text-end">{deductionItem.calculation_type}</td>
                                <td className="erp_table_td">
                                    <input type="text" className="erp_input_field_table_txt mb-0" value={deductionItem.formula} id={"formula_" + deductionItem.deduction_heads_id} onChange={(e) => { updateDeductionTblData(deductionItem, e); }}
                                        onBlur={(e) => { updateDeductionTblData(deductionItem, e); }}
                                        Headers='formula' disabled={keyForViewUpdate === 'view'} />
                                </td>
                                <td className="erp_table_td">
                                    <input type="text" className="text-end erp_input_field_table_txt mb-0" value={deductionItem.calculation_value} id={"calculation_value_" + deductionItem.deduction_heads_id} onChange={(e) => { updateDeductionTblData(deductionItem, e); }}
                                        onBlur={(e) => { updateDeductionTblData(deductionItem, e); }}
                                        Headers='calculation_value' disabled={keyForViewUpdate === 'view'} />
                                </td>


                            </tr>
                        )
                    }
                </tbody>
            </Table>
        </>
    }, [deductionData]);


    const updatePmtTermsTblData = (currentPaymentTerm, e) => {
        let clickedColName = e.target.getAttribute('Headers');
        delete e.target.parentElement.dataset.tip;

        switch (clickedColName) {

            case 'earning_head_value':
                let isValidPercentageInput = validateNumberPercentInput.current.percentValidate(JSON.stringify(e.target.value));
                if (isValidPercentageInput === true) {
                    currentPaymentTerm[clickedColName] = e.target.value
                    delete e.target.parentElement.dataset.tip;
                }
                break;
            case 'calculation_value':
                let isValiddecimalNumberInput = validateNumberPercentInput.current.decimalNumber(JSON.stringify(e.target.value), 2);
                currentPaymentTerm[clickedColName] = isValiddecimalNumberInput
                delete e.target.parentElement.dataset.tip;

                break;
            case 'formula':
                currentPaymentTerm[clickedColName] = e.target.value
                break;
            default:
                break;
        }

        // update the Payment terms table data.
        const updateEarningData = [...earningData]
        const pmtTermIndexInArray = parseInt(e.target.parentElement.parentElement.getAttribute('rowIndex'))
        updateEarningData[pmtTermIndexInArray] = currentPaymentTerm;
        setEarningData(updateEarningData);

    }
    // Payment term validations
    const FnValidateEarningHead = async () => {
        let selectedEarningHead = $('#earningHead-table tbody tr .selectEarning:checked')
        let selectedDuductionHead = $('#deductionHead-table tbody tr .selectDeduction:checked')

        let EarningHead = true;
        if (selectedEarningHead.length === 0) {
            setErrMsg('Please Select Atleast One Earning Head...!');
            setShowErrorMsgModal(true);
            return EarningHead = false;
        } else {
            selectedEarningHead.each(function () {
                let currentTblRow = $(this.parentElement.parentElement)
                let calculatedValue = currentTblRow.find('input[id^="calculation_value_"]').val();
                let earningFormula = currentTblRow.find('input[id^="formula_"]').val();

                if (calculatedValue === '') {
                    $(currentTblRow.find('input[id^="calculation_value_"]'))[0].parentElement.dataset.tip = 'please fill this field...!';
                    $(currentTblRow.find('input[id^="calculation_value_"]'))[0].focus();
                    return EarningHead = false;

                } else if (earningFormula === '' || earningFormula === null || earningFormula === undefined) {
                    $(currentTblRow.find('input[id^="formula_"]'))[0].parentElement.dataset.tip = 'please fill this field...!';
                    $(currentTblRow.find('input[id^="formula_"]'))[0].focus();
                    return EarningHead = false;
                }

            });
            selectedDuductionHead.each(function () {
                let currentTblRow = $(this.parentElement.parentElement)
                let calculatedValue = currentTblRow.find('input[id^="calculation_value_"]').val();
                let earningFormula = currentTblRow.find('input[id^="formula_"]').val();

                if (calculatedValue === '') {
                    $(currentTblRow.find('input[id^="calculation_value_"]'))[0].parentElement.dataset.tip = 'please fill this field...!';
                    $(currentTblRow.find('input[id^="calculation_value_"]'))[0].focus();
                    return EarningHead = false;

                } else if (earningFormula === '' || earningFormula === null || earningFormula === undefined) {
                    $(currentTblRow.find('input[id^="formula_"]'))[0].parentElement.dataset.tip = 'please fill this field...!';
                    $(currentTblRow.find('input[id^="formula_"]'))[0].focus();
                    return EarningHead = false;
                }

            });
            return EarningHead;
        }
    }


    const updateDeductionTblData = (currentPaymentTerm, e) => {
        let clickedColName = e.target.getAttribute('Headers');
        delete e.target.parentElement.dataset.tip;

        switch (clickedColName) {

            case 'earning_head_value':
                let isValidPercentageInput = validateNumberPercentInput.current.percentValidate(JSON.stringify(e.target.value));
                if (isValidPercentageInput === true) {
                    currentPaymentTerm[clickedColName] = e.target.value
                    delete e.target.parentElement.dataset.tip;
                } else {
                    const currentTblRow = e.target.parentElement.parentElement;

                }
                break;
            case 'calculation_value':
                let isValiddecimalNumberInput = validateNumberPercentInput.current.decimalNumber(JSON.stringify(e.target.value), 2);
                currentPaymentTerm[clickedColName] = isValiddecimalNumberInput
                break;
            case 'formula':
                currentPaymentTerm[clickedColName] = e.target.value
                break;
            default:
                break;
        }
        // update the Payment terms table data.
        const updateDeductionData = [...deductionData]
        const pmtTermIndexInArray = parseInt(e.target.parentElement.parentElement.getAttribute('rowIndex'))
        updateDeductionData[pmtTermIndexInArray] = currentPaymentTerm;
        setDeductionData(updateDeductionData);

    }

    //function to check All checkBoxes of po terms and payment terms
    function toggleChkAllBoxes(key) {
        switch (key) {
            case "selectAllEarning":
                $('.selectEarning').prop('checked', $('#selectAllEarning').is(":checked"));
                break;
            case 'PartiallyEarningSelection':
                $('#selectAllEarning').prop('checked', $('input:checkbox.selectEarning:checked').length == $('input:checkbox.selectEarning').length);
                break;
            // For customer contact
            case 'selectAllDeduction':
                $('.selectDeduction').prop('checked', $('#selectAllDeduction').is(":checked"));
                break;
            case 'PartiallyDeductionSelection':
                $('#selectAllDeduction').prop('checked', $('input:checkbox.selectDeduction:checked').length === $('input:checkbox.selectDeduction').length);
                break;
        }
    }

    const addEarningDeductionData = async () => {
        let json = { 'TransEarningHeadData': [], 'TransDeductionHeadData': [], 'commonIds': {} }
        try {
            setIsLoading(true)
            if (await FnValidateEarningHead()) {
                $("input:checkbox[name=selectEarning]:checked").each(function () {
                    let findEarningData = earningData.find(item => item.earning_heads_id === parseInt($(this).val()));

                    const earningDatas = {
                        company_id: COMPANY_ID,
                        company_branch_id: COMPANY_BRANCH_ID,
                        earning_code: findEarningData.earning_code,
                        earning_heads_id: findEarningData.earning_heads_id,
                        earning_head_short_name: findEarningData.earning_head_short_name,
                        earning_type: findEarningData.earning_type,
                        calculation_type: findEarningData.calculation_type,
                        calculation_value: findEarningData.calculation_value,
                        effective_date: findEarningData.effective_date,
                        formula: findEarningData.formula,
                        effective_date: effective_date,
                        designation_id: designationId,
                        created_by: UserName,

                    }
                    json.TransEarningHeadData.push(earningDatas);
                });

                $("input:checkbox[name=selectDeduction]:checked").each(function () {
                    let findDiductionData = deductionData.find(item => item.deduction_heads_id === parseInt($(this).val()));

                    const deductionDatas = {
                        company_id: COMPANY_ID,
                        company_branch_id: COMPANY_BRANCH_ID,
                        deduction_code: findDiductionData.deduction_code,
                        deduction_heads_id: findDiductionData.deduction_heads_id,
                        deduction_head_short_name: findDiductionData.deduction_head_short_name,
                        deduction_type: findDiductionData.deduction_type,
                        calculation_type: findDiductionData.calculation_type,
                        effective_date: findDiductionData.effective_date,
                        calculation_value: findDiductionData.calculation_value,
                        formula: findDiductionData.formula,
                        effective_date: effective_date,
                        designation_id: designationId,
                        created_by: UserName,

                    }
                    json.TransDeductionHeadData.push(deductionDatas);
                });
                json.commonIds.company_id = COMPANY_ID
                json.commonIds.company_branch_id = COMPANY_BRANCH_ID
                json.commonIds.designation_id = designationId

                console.log("DesignationAccessData: ", json)
                const formData = new FormData();
                formData.append(`DesignationEarningAndDeductionMappingData`, JSON.stringify(json))
                const requestOptions = {
                    method: 'POST',
                    body: formData
                };
                const apiCall = await fetch(`${process.env.REACT_APP_BASE_URL}/api/designation/EarningAndDeductionFnAddUpdateRecord`, requestOptions)
                const resp = await apiCall.json()
                if (resp.success === '0') {
                    setErrMsg(resp.error)
                    setShowErrorMsgModal(true)
                } else {
                    console.log("resp: ", resp)
                    setSuccMsg(resp.message)
                    setShowSuccessMsgModal(true)
                }
            }
        } catch (error) {
            console.log("error: ", error)
        } finally {
            setIsLoading(false)
        }

    }
    return (
        <>
            {isLoading ?
                <div className="spinner-overlay"  >
                    <div className="spinner-container">
                        <CircularProgress />
                        <span>Loading...</span>
                    </div>
                </div> : null}
            <ValidateNumberDateInput ref={validateNumberPercentInput} />

            <div>
                <div className='main_heding'>
                    <label className='erp-form-label-lg main_heding'>Designation Wise Earning & Deduction : {designationName} </label>
                </div>
                <form id='employeeFormId'>
                    <div className="row erp_transporter_div ">
                        <div className="col-sm-6 erp_form_col_div">

                            <div className="col-sm-12 erp_form_col_div">
                                <div className="row">
                                    <div className="col-sm-4">
                                        <Form.Label className="erp-form-label"> Effective Date </Form.Label>
                                    </div>
                                    <div className="col">
                                        <Form.Control type="date" id="effective_date" className="erp_input_field" value={effective_date} onChange={e => { setEffectiveDate(e.target.value); }} optional="optional" />
                                        <MDTypography variant="button" id="error_effective_date" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }} >
                                        </MDTypography>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </form>
                <div className="row col-12">
                    <div class="col-12 col-lg-6" style={{ minHeight: "300px;" }}>
                        <div className='erp-form-label-lg'>Designation Wise Earning</div>
                        <div class="col pt-sm-1">
                            <input type='checkbox' class="selectAllEarning" id="selectAllEarning" onClick={(e) => toggleChkAllBoxes('selectAllEarning')} disabled={keyForViewUpdate === 'view'} /> <label class="erp-form-label pb-1"> Select All </label>
                        </div>
                        <div className="row  mt-3 gx-3" style={{ height: '500px', overflowY: 'auto' }}>
                            {renderEarningTable}

                            <MDTypography variant="button" id="error_select_earningHead" className="erp_validation" fontWeight="regular" color="error" style={{ display: "none" }}> </MDTypography>
                        </div>
                    </div>
                    <div class="col-12 col-lg-6" style={{ minHeight: "300px;" }}>
                        <div className='erp-form-label-lg'>Designation Wise Deduction</div>
                        <div class="col pt-sm-1">
                            <input type='checkbox' class="selectAllDeduction" id="selectAllDeduction" onClick={(e) => toggleChkAllBoxes('selectAllDeduction')} disabled={keyForViewUpdate === 'view'} /> <label class="erp-form-label pb-1"> Select All </label>
                        </div>
                        <div className="row  mt-3 gx-3" style={{ height: '500px', overflowY: 'auto' }}>
                            {renderDeductionTable}
                        </div>

                    </div>
                    <div className="erp_frm_Btns">
                        <MDButton type="button" onClick={() => goBack(designationId)} className="erp-gb-button ms-2" variant="button"
                            fontWeight="regular" >Back</MDButton>
                        <MDButton type="submit" id="saveBtn" onClick={() => addEarningDeductionData()} className={`erp-gb-button ms-2 ${keyForViewUpdate === 'view' ? 'd-none' : 'display'}`} variant="button"
                            fontWeight="regular">{actionLabel}</MDButton>
                        <MDButton type="button" className="erp-gb-button ms-2" onClick={() => { const path = compType === 'Register' ? '/Masters/DesignationListing/reg' : '/Masters/DesignationListing'; navigate(path); }}
                            variant="button" fontWeight="regular">Home</MDButton>
                    </div >
                    {/* Success Msg Popup */}
                    <SuccessModal handleCloseSuccessModal={() => handleCloseSuccessModal()} show={[showSuccessMsgModal, succMsg]} />
                    {/* Error Msg Popup */}
                    <ErrorModal handleCloseErrModal={() => handleCloseErrModal()} show={[showErrorMsgModal, errMsg]} />
                </div>
            </div>
        </>
    )
}

export default FrmEarningDeductionMapping;